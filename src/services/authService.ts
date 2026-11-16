import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  Auth,
  User as FirebaseUser 
} from 'firebase/auth';
import { SUPER_ADMIN_EMAILS } from '../../taxConstants';
import { UserProfile } from '../types';

const ADMIN_STORAGE_KEY = 'pph21_custom_admins';
const FIREBASE_CONFIG_KEY = 'pph21_firebase_config';
const CURRENT_USER_KEY = 'pph21_current_user';

export const DEFAULT_FIREBASE_CONFIG: FirebaseClientConfig = {
  apiKey: 'AIzaSyCsfIZlou-K9mjuTDIE6VP5On0_E0gzuK8',
  authDomain: 'kalkulator-pph21-37603.firebaseapp.com',
  projectId: 'kalkulator-pph21-37603',
  storageBucket: 'kalkulator-pph21-37603.firebasestorage.app',
  messagingSenderId: '508960807018',
  appId: '1:508960807018:web:0c28db9b6f47a9b0b79213'
};

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

class AuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private currentUser: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];
  private customAdmins: string[] = [];
  private isFirebaseInitialized: boolean = false;

  constructor() {
    this.loadCustomAdmins();
    this.initFirebase();
  }

  private getStorage(key: string): string | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setStorage(key: string, value: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Could not save ${key} to storage`, e);
    }
  }

  private removeStorage(key: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }

  private loadCustomAdmins(): void {
    try {
      const stored = this.getStorage(ADMIN_STORAGE_KEY);
      if (stored) {
        this.customAdmins = JSON.parse(stored);
      }
    } catch {
      this.customAdmins = [];
    }
  }

  private saveCustomAdmins(): void {
    this.setStorage(ADMIN_STORAGE_KEY, JSON.stringify(this.customAdmins));
  }

  /**
   * Initializes Firebase from localStorage or import.meta.env variables
   */
  public initFirebase(): boolean {
    const config = this.getFirebaseConfig();
    if (!config || !config.apiKey || !config.authDomain || !config.projectId) {
      this.isFirebaseInitialized = false;
      this.auth = null;
      // Do not trust local storage user if Firebase is not active
      this.currentUser = null;
      this.removeStorage(CURRENT_USER_KEY);
      return false;
    }

    try {
      if (getApps().length === 0) {
        this.app = initializeApp(config);
      } else {
        this.app = getApp();
      }
      this.auth = getAuth(this.app);
      this.isFirebaseInitialized = true;

      // Subscribe to real Firebase authentication state changes
      onAuthStateChanged(this.auth, (fbUser: FirebaseUser | null) => {
        if (fbUser && fbUser.email) {
          const email = fbUser.email.toLowerCase().trim();
          const user: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email.split('@')[0] || 'Pengguna',
            photoURL: fbUser.photoURL || undefined,
            isAdmin: this.checkIsAdmin(email),
            isSuperAdmin: this.checkIsSuperAdmin(email)
          };
          this.currentUser = user;
          this.setStorage(CURRENT_USER_KEY, JSON.stringify(user));
        } else {
          this.currentUser = null;
          this.removeStorage(CURRENT_USER_KEY);
        }
        this.notify();
      });

      return true;
    } catch (err) {
      console.error('Inisialisasi Firebase gagal:', err);
      this.isFirebaseInitialized = false;
      this.auth = null;
      this.currentUser = null;
      this.removeStorage(CURRENT_USER_KEY);
      return false;
    }
  }

  public isFirebaseConfigured(): boolean {
    return this.isFirebaseInitialized && this.auth !== null;
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
    this.listeners.forEach(cb => {
      try {
        cb(this.currentUser);
      } catch (e) {
        console.error('Error in auth listener:', e);
      }
    });
  }

  /**
   * Real Google Sign-In using Firebase Auth popup
   */
  public async signInWithGoogle(): Promise<UserProfile> {
    if (!this.auth) {
      this.initFirebase();
    }
    if (!this.auth) {
      throw new Error('Konfigurasi Firebase belum diatur. Silakan atur konfigurasi Firebase project Anda terlebih dahulu.');
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(this.auth, provider);
      const fbUser = result.user;
      if (!fbUser || !fbUser.email) {
        throw new Error('Autentikasi Google berhasil tetapi informasi email tidak ditemukan.');
      }

      const email = fbUser.email.toLowerCase().trim();
      const user: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || fbUser.email.split('@')[0] || 'Pengguna',
        photoURL: fbUser.photoURL || undefined,
        isAdmin: this.checkIsAdmin(email),
        isSuperAdmin: this.checkIsSuperAdmin(email)
      };

      this.currentUser = user;
      this.setStorage(CURRENT_USER_KEY, JSON.stringify(user));
      this.notify();
      return user;
    } catch (err: any) {
      const code = err?.code || '';
      let friendlyMessage = err?.message || 'Gagal masuk dengan Google.';

      if (code === 'auth/popup-closed-by-user') {
        friendlyMessage = 'Jendela login Google ditutup sebelum proses autentikasi selesai.';
      } else if (code === 'auth/unauthorized-domain') {
        friendlyMessage = 'Domain ini belum diizinkan di Firebase Console. Buka Firebase Console > Authentication > Settings > Authorized domains dan tambahkan domain Anda.';
      } else if (code === 'auth/popup-blocked') {
        friendlyMessage = 'Jendela popup login diblokir oleh browser. Harap izinkan popup untuk situs ini.';
      } else if (code === 'auth/cancelled-popup-request') {
        friendlyMessage = 'Proses login dibatalkan karena ada jendela baru yang dibuka.';
      } else if (code === 'auth/invalid-api-key') {
        friendlyMessage = 'Firebase API Key tidak valid. Periksa konfigurasi Firebase Anda.';
      } else if (code === 'auth/network-request-failed') {
        friendlyMessage = 'Koneksi jaringan gagal saat menghubungi server Google.';
      }

      const customError = new Error(friendlyMessage);
      (customError as any).code = code;
      throw customError;
    }
  }

  public async signOut(): Promise<void> {
    if (this.auth) {
      try {
        await fbSignOut(this.auth);
      } catch (err) {
        console.warn('Firebase signout warning:', err);
      }
    }
    this.currentUser = null;
    this.removeStorage(CURRENT_USER_KEY);
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
    // 1. LocalStorage
    try {
      const stored = this.getStorage(FIREBASE_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.apiKey && parsed.authDomain && parsed.projectId) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // 2. Vite Environment Variables
    const envApiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY;
    const envAuthDomain = (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN;
    const envProjectId = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID;
    const envStorageBucket = (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET;
    const envMessagingSenderId = (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID;
    const envAppId = (import.meta as any).env?.VITE_FIREBASE_APP_ID;

    if (envApiKey && envAuthDomain && envProjectId) {
      return {
        apiKey: envApiKey,
        authDomain: envAuthDomain,
        projectId: envProjectId,
        storageBucket: envStorageBucket || DEFAULT_FIREBASE_CONFIG.storageBucket,
        messagingSenderId: envMessagingSenderId || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
        appId: envAppId || DEFAULT_FIREBASE_CONFIG.appId
      };
    }

    // 3. Project Default Configuration Fallback
    return DEFAULT_FIREBASE_CONFIG;
  }

  public saveFirebaseConfig(config: FirebaseClientConfig): boolean {
    if (!config.apiKey || !config.authDomain || !config.projectId) {
      throw new Error('Firebase API Key, Auth Domain, dan Project ID wajib diisi.');
    }
    this.setStorage(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    return this.initFirebase();
  }
}

export const authService = new AuthService();
