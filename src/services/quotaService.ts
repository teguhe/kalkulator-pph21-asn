import { QUOTA_CONFIG } from '../../taxConstants';
import { QuotaState } from '../types';
import { authService } from './authService';

const QUOTA_STORAGE_PREFIX = 'pph21_quota_';

class QuotaService {
  private getTodayKey(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private getUserKey(): string {
    const user = authService.getCurrentUser();
    return user ? `user_${user.email}` : 'unauthenticated';
  }

  public getQuotaState(): QuotaState {
    const today = this.getTodayKey();
    const user = authService.getCurrentUser();

    // Mode Tamu dihapus: jika belum login, kuota 0
    if (!user) {
      return {
        todayKey: today,
        usedToday: 0,
        limit: 0,
        remaining: 0,
        isUnlimited: false
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
        isUnlimited: true
      };
    }

    const limit = QUOTA_CONFIG.USER_DAILY_LIMIT;
    const used = this.getRawUsage(storageKey);
    const remaining = Math.max(0, limit - used);

    return {
      todayKey: today,
      usedToday: used,
      limit,
      remaining,
      isUnlimited: false
    };
  }

  private getRawUsage(storageKey: string): number {
    try {
      const val = localStorage.getItem(storageKey);
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
    localStorage.setItem(storageKey, String(newUsage));
    return true;
  }

  public resetQuotaForToday(): void {
    const today = this.getTodayKey();
    const userKey = this.getUserKey();
    const storageKey = `${QUOTA_STORAGE_PREFIX}${today}_${userKey}`;
    localStorage.removeItem(storageKey);
  }

  public resetAllQuotas(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(QUOTA_STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
}

export const quotaService = new QuotaService();
