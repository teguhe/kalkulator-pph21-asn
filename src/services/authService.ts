import { SUPER_ADMIN_EMAILS, QUOTA_CONFIG } from '../../taxConstants';
import { UserProfile, QuotaState, LogItem } from '../types';

const ADMIN_STORAGE_KEY = 'pph21_custom_admins';
const FIREBASE_CONFIG_KEY = 'pph21_firebase_config';
const CURRENT_USER_KEY = 'pph21_current_user';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

class AuthService {
  private currentUser: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];
  private customAdmins: string[] = [];

  constructor() {
    this.loadCustomAdmins();
    this.loadPersistedUser();
  }

  private loadCustomAdmins(): void {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        this.customAdmins = JSON.parse(stored);
      }
    } catch (e) {
      this.customAdmins = [];
    }
  }

  private saveCustomAdmins(): void {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(this.customAdmins));
  }

  private loadPersistedUser(): void {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const u = JSON.parse(stored);
        this.currentUser = {
          ...u,
          isAdmin: this.checkIsAdmin(u.email),
          isSuperAdmin: this.checkIsSuperAdmin(u.email)
        };
      }
    } catch {
      this.currentUser = null;
    }
  }

  public checkIsSuperAdmin(email: string): boolean {
    if (!email) return false;
    return SUPER_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase().trim());
  }

  public checkIsAdmin(email: string): boolean {
    if (!email) return false;
    const clean = email.toLowerCase().trim();
    return this.checkIsSuperAdmin(clean) || this.customAdmins.map(e => e.toLowerCase()).includes(clean);
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public onAuthStateChanged(cb: (user: UserProfile | null) => void): () => void {
    this.listeners.push(cb);
    cb(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify(): void {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  /**
   * Simulated Google Sign In for instant testing or offline use
   */
  public async signInWithGoogleMock(emailInput?: string, displayNameInput?: string): Promise<UserProfile> {
    const email = emailInput || 'teguhe@gmail.com';
    const displayName = displayNameInput || (email.startsWith('teguhe') ? 'Teguh (Super Admin)' : 'Pegawai ASN');
    
    const user: UserProfile = {
      uid: 'user_' + Math.random().toString(36).substring(2, 9),
      email: email.trim(),
      displayName,
      isAdmin: this.checkIsAdmin(email),
      isSuperAdmin: this.checkIsSuperAdmin(email)
    };

    this.currentUser = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    this.notify();
    return user;
  }

  public async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem(CURRENT_USER_KEY);
    this.notify();
  }

  // Admin Management
  public getAdminList(): { email: string; isSuperAdmin: boolean }[] {
    const list: { email: string; isSuperAdmin: boolean }[] = [];
    
    // Super admins
    for (const email of SUPER_ADMIN_EMAILS) {
      list.push({ email, isSuperAdmin: true });
    }

    // Custom admins
    for (const email of this.customAdmins) {
      if (!list.some(a => a.email.toLowerCase() === email.toLowerCase())) {
        list.push({ email, isSuperAdmin: false });
      }
    }

    return list;
  }

  public addAdmin(email: string): boolean {
    const clean = email.toLowerCase().trim();
    if (!clean || this.checkIsAdmin(clean)) return false;
    this.customAdmins.push(clean);
    this.saveCustomAdmins();

    if (this.currentUser && this.currentUser.email.toLowerCase() === clean) {
      this.currentUser.isAdmin = true;
      this.notify();
    }
    return true;
  }

  public removeAdmin(email: string): boolean {
    const clean = email.toLowerCase().trim();
    if (this.checkIsSuperAdmin(clean)) {
      throw new Error('Super Admin bawaan tidak dapat dihapus.');
    }
    const idx = this.customAdmins.findIndex(e => e.toLowerCase() === clean);
    if (idx !== -1) {
      this.customAdmins.splice(idx, 1);
      this.saveCustomAdmins();

      if (this.currentUser && this.currentUser.email.toLowerCase() === clean) {
        this.currentUser.isAdmin = false;
        this.notify();
      }
      return true;
    }
    return false;
  }

  // Firebase Config Storage
  public getFirebaseConfig(): FirebaseClientConfig | null {
    try {
      const stored = localStorage.getItem(FIREBASE_CONFIG_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  public saveFirebaseConfig(config: FirebaseClientConfig): void {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  }
}

export const authService = new AuthService();
