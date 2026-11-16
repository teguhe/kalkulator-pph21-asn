import { appState } from '../state/appState';
import { authService } from '../services/authService';

export function renderHeader(): string {
  const { currentUser, quotaState } = appState;

  let quotaBadgeHtml = '';
  if (currentUser) {
    if (quotaState.isUnlimited) {
      quotaBadgeHtml = `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs" title="Super Admin / Admin Akses Tanpa Batas">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Kuota: Unlimited (Admin)
        </span>
      `;
    } else {
      const badgeColor = quotaState.remaining > 0 
        ? 'bg-blue-50 text-blue-700 border-blue-200' 
        : 'bg-rose-50 text-rose-700 border-rose-200';
      quotaBadgeHtml = `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeColor} border shadow-xs" title="Sisa perhitungan harian">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Kuota: ${quotaState.remaining} / ${quotaState.limit}
        </span>
      `;
    }
  }

  let authSectionHtml = '';
  if (currentUser) {
    authSectionHtml = `
      <div class="relative group">
        <button id="btn-user-profile-menu" class="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            ${currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'US'}
          </div>
          <div class="text-left hidden sm:block">
            <div class="text-xs font-semibold text-slate-800 leading-tight">${currentUser.displayName || currentUser.email}</div>
            <div class="text-[10px] text-slate-500 flex items-center gap-1">
              ${currentUser.isSuperAdmin ? '<span class="text-amber-600 font-bold">Super Admin</span>' : currentUser.isAdmin ? '<span class="text-emerald-600 font-semibold">Admin</span>' : 'Pegawai ASN'}
            </div>
          </div>
          <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div class="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 hidden group-hover:block hover:block z-50">
          <div class="px-3 py-2 border-b border-slate-100 text-xs">
            <div class="font-medium text-slate-800">${currentUser.displayName}</div>
            <div class="text-slate-400 truncate">${currentUser.email}</div>
          </div>
          <button id="btn-header-signout" class="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer mt-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Keluar (Sign Out)
          </button>
        </div>
      </div>
    `;
  } else {
    authSectionHtml = `
      <div class="flex items-center gap-2">
        <button id="btn-header-google-signin" class="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs transition-all hover:shadow-sm cursor-pointer">
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Google Sign-In</span>
        </button>
      </div>
    `;
  }

  // Jika belum login, sembunyikan semua toolbar menu atas kecuali FAQ dan Google Sign-In
  if (!currentUser) {
    return `
      <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 gap-4">
            <!-- Logo & Title (Bisa diklik untuk kembali ke Halaman Masuk) -->
            <button id="btn-header-logo-home" class="flex items-center gap-3 min-w-0 shrink text-left cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h1 class="text-sm sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                    Kalkulator PPh 21
                  </h1>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    ASN
                  </span>
                </div>
              </div>
            </button>

            <!-- Menu Kanan Sebelum Login: Hanya FAQ dan Login Google -->
            <div class="flex items-center gap-2 sm:gap-3 shrink-0">
              <button id="btn-header-faq" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${appState.activeTab === 'faq' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'} transition cursor-pointer">
                <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Pusat Bantuan & FAQ</span>
              </button>

              <div class="border-l border-slate-200 pl-2 sm:pl-3">
                ${authSectionHtml}
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // Jika sudah login: tampilkan navbar lengkap dengan toolbar & profil
  return `
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-4">
          <!-- Mobile Sidebar Toggle & Logo/Title -->
          <div class="flex items-center gap-2 min-w-0 shrink">
            <button id="btn-toggle-sidebar" class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer" title="Buka Menu Sidebar">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Logo & Title -->
            <button id="btn-header-logo-home" class="flex items-center gap-3 min-w-0 shrink text-left cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h1 class="text-sm sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                    Kalkulator PPh 21
                  </h1>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    ASN
                  </span>
                </div>
              </div>
            </button>
          </div>

          <!-- Action Buttons & User Info -->
          <div class="flex items-center gap-3 shrink-0">
            <!-- Quota badge -->
            ${quotaBadgeHtml}

            <!-- Auth profile / login -->
            <div>
              ${authSectionHtml}
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}
