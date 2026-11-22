import { QUOTA_CONFIG } from '../../taxConstants';
import { QuotaState, UserBonusQuotaItem } from '../types';
import { authService } from './authService';

const QUOTA_STORAGE_PREFIX = 'pph21_quota_';
const DEFAULT_LIMIT_STORAGE_KEY = 'pph21_default_daily_quota';
const BONUS_QUOTA_STORAGE_KEY = 'pph21_user_bonus_quota';

class QuotaService {
  private memStorage: Record<string, string> = {};

  private getStorage(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) return val;
      } catch {
        // Fallback to memory
      }
    }
    return this.memStorage[key] ?? null;
  }

  private setStorage(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Fallback to memory
      }
    }
    this.memStorage[key] = value;
  }

  private removeStorage(key: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch {
        // Fallback to memory
      }
    }
    delete this.memStorage[key];
  }

  private getTodayKey(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private getUserKey(email?: string): string {
    if (email) return `user_${email.toLowerCase().trim()}`;
    const user = authService.getCurrentUser();
    return user ? `user_${user.email.toLowerCase().trim()}` : 'unauthenticated';
  }

  // --- DEFAULT DAILY LIMIT SETTINGS ---
  public getDefaultDailyLimit(): number {
    const stored = this.getStorage(DEFAULT_LIMIT_STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return QUOTA_CONFIG.USER_DAILY_LIMIT;
  }

  public setDefaultDailyLimit(limit: number): boolean {
    if (isNaN(limit) || limit < 1) return false;
    this.setStorage(DEFAULT_LIMIT_STORAGE_KEY, String(Math.floor(limit)));
    return true;
  }

  public resetDefaultDailyLimit(): void {
    this.removeStorage(DEFAULT_LIMIT_STORAGE_KEY);
  }

  // --- BONUS QUOTA PER ACCOUNT SETTINGS ---
  public getAllBonusQuotas(): Record<string, number> {
    const stored = this.getStorage(BONUS_QUOTA_STORAGE_KEY);
    if (!stored) return {};
    try {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    } catch {
      // Fallback
    }
    return {};
  }

  public getBonusQuotaList(): UserBonusQuotaItem[] {
    const bonuses = this.getAllBonusQuotas();
    const defaultLimit = this.getDefaultDailyLimit();
    return Object.entries(bonuses).map(([email, bonus]) => ({
      email,
      bonus,
      totalLimit: defaultLimit + bonus
    })).sort((a, b) => b.bonus - a.bonus);
  }

  public getBonusQuota(email?: string): number {
    if (!email) return 0;
    const cleanEmail = email.toLowerCase().trim();
    const bonuses = this.getAllBonusQuotas();
    const val = bonuses[cleanEmail];
    return typeof val === 'number' && val > 0 ? val : 0;
  }

  public setBonusQuota(email: string, bonus: number): boolean {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) return false;
    const bonuses = this.getAllBonusQuotas();
    if (bonus <= 0) {
      delete bonuses[cleanEmail];
    } else {
      bonuses[cleanEmail] = Math.floor(bonus);
    }
    this.setStorage(BONUS_QUOTA_STORAGE_KEY, JSON.stringify(bonuses));
    return true;
  }

  public removeBonusQuota(email: string): boolean {
    const cleanEmail = email.toLowerCase().trim();
    const bonuses = this.getAllBonusQuotas();
    if (cleanEmail in bonuses) {
      delete bonuses[cleanEmail];
      this.setStorage(BONUS_QUOTA_STORAGE_KEY, JSON.stringify(bonuses));
      return true;
    }
    return false;
  }

  public getUserEffectiveLimit(email: string): { limit: number; isUnlimited: boolean; bonus: number; defaultLimit: number } {
    const isAdmin = authService.checkIsAdmin(email);
    const defaultLimit = this.getDefaultDailyLimit();
    if (isAdmin) {
      return { limit: Infinity, isUnlimited: true, bonus: 0, defaultLimit };
    }
    const bonus = this.getBonusQuota(email);
    return {
      limit: defaultLimit + bonus,
      isUnlimited: false,
      bonus,
      defaultLimit
    };
  }

  // --- QUOTA STATE COMPUTATION ---
  public getQuotaState(): QuotaState {
    const today = this.getTodayKey();
    const user = authService.getCurrentUser();
    const defaultLimit = this.getDefaultDailyLimit();

    // Mode Tamu dihapus: jika belum login, kuota 0
    if (!user) {
      return {
        todayKey: today,
        usedToday: 0,
        limit: 0,
        remaining: 0,
        isUnlimited: false,
        defaultLimit,
        bonusQuota: 0
      };
    }

    const userKey = this.getUserKey();
    const storageKey = `${QUOTA_STORAGE_PREFIX}${today}_${userKey}`;
    const isAdmin = user.isAdmin || user.isSuperAdmin;

    if (isAdmin) {
      return {
        todayKey: today,
        usedToday: this.getRawUsage(storageKey),
        limit: Infinity,
        remaining: Infinity,
        isUnlimited: true,
        defaultLimit,
        bonusQuota: 0
      };
    }

    const bonus = this.getBonusQuota(user.email);
    const limit = defaultLimit + bonus;
    const used = this.getRawUsage(storageKey);
    const remaining = Math.max(0, limit - used);

    return {
      todayKey: today,
      usedToday: used,
      limit,
      remaining,
      isUnlimited: false,
      defaultLimit,
      bonusQuota: bonus
    };
  }

  private getRawUsage(storageKey: string): number {
    try {
      const val = this.getStorage(storageKey);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  public canCalculate(): boolean {
    const user = authService.getCurrentUser();
    if (!user) return false; // Wajib login!
    const state = this.getQuotaState();
    return state.isUnlimited || state.remaining > 0;
  }

  public consumeQuota(): boolean {
    const state = this.getQuotaState();
    if (!state.isUnlimited && state.remaining <= 0) {
      return false;
    }

    const today = this.getTodayKey();
    const userKey = this.getUserKey();
    const storageKey = `${QUOTA_STORAGE_PREFIX}${today}_${userKey}`;

    const newUsage = state.usedToday + 1;
    this.setStorage(storageKey, String(newUsage));
    return true;
  }

  public resetQuotaForToday(): void {
    const today = this.getTodayKey();
    const userKey = this.getUserKey();
    const storageKey = `${QUOTA_STORAGE_PREFIX}${today}_${userKey}`;
    this.removeStorage(storageKey);
  }

  public resetQuotaForEmail(email: string): void {
    const today = this.getTodayKey();
    const userKey = this.getUserKey(email);
    const storageKey = `${QUOTA_STORAGE_PREFIX}${today}_${userKey}`;
    this.removeStorage(storageKey);
  }

  public resetAllQuotas(): void {
    if (typeof localStorage === 'undefined') return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(QUOTA_STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => this.removeStorage(k));
  }
}

export const quotaService = new QuotaService();
