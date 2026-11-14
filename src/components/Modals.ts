import { appState } from '../state/appState';
import { authService } from '../services/authService';

export function renderToastContainer(): string {
  const { toasts } = appState;
  if (toasts.length === 0) return '<div id="toast-container" class="fixed top-5 right-5 z-50 space-y-2 pointer-events-none no-print"></div>';

  const itemsHtml = toasts.map(t => {
    const isError = t.type === 'error';
    const isWarning = t.type === 'warning';
    const isSuccess = t.type === 'success';

    const bgClass = isError ? 'bg-rose-900/95 border-rose-700 text-white'
      : isWarning ? 'bg-amber-900/95 border-amber-700 text-white'
      : isSuccess ? 'bg-emerald-900/95 border-emerald-700 text-white'
      : 'bg-slate-900/95 border-slate-700 text-white';

    const iconHtml = isError ? `<svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
      : isWarning ? `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
      : `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;

    return `
      <div class="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl max-w-sm ${bgClass} transition-all transform animate-in slide-in-from-top-2">
        ${iconHtml}
        <div class="flex-1 text-xs">
          <div class="font-bold text-white mb-0.5">${t.title}</div>
          <div class="text-slate-200 leading-snug">${t.message}</div>
        </div>
        <button data-toast-id="${t.id}" class="btn-dismiss-toast text-slate-400 hover:text-white p-0.5 cursor-pointer">&times;</button>
      </div>
    `;
  }).join('');

  return `
    <div id="toast-container" class="fixed top-5 right-5 z-50 space-y-2 pointer-events-none no-print">
      ${itemsHtml}
    </div>
  `;
}

export function renderModals(): string {
  const isFbConfigured = authService.isFirebaseConfigured();
  const fbConfig = authService.getFirebaseConfig();

  return `
    <!-- Hidden File Input for JSON Import -->
    <input type="file" id="json-file-input" accept=".json,application/json" class="hidden" />

    <!-- Google Login Modal -->
    <div id="modal-login" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-slate-900">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <h3 class="text-sm font-bold text-slate-900">Masuk dengan Akun Google</h3>
          </div>
          <button id="btn-close-modal-login" class="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer">&times;</button>
        </div>

        <p class="text-xs text-slate-600 mb-4 leading-relaxed">
          Autentikasi resmi menggunakan Google Sign-In memberikan Anda <strong>kuota 25x perhitungan per hari</strong> secara cuma-cuma.
        </p>

        <!-- Google Login Action Button -->
        <div class="mb-4">
          <button id="btn-do-google-login" class="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-xs transition hover:shadow cursor-pointer">
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span id="label-google-login-text">Lanjutkan dengan Google</span>
          </button>
        </div>

        <!-- Firebase Config Section (Collapsible) -->
        <div class="pt-2 border-t border-slate-100">
          <button id="btn-toggle-modal-firebase-config" type="button" class="text-[11px] text-slate-500 hover:text-slate-800 flex items-center justify-between w-full py-1 cursor-pointer">
            <span class="flex items-center gap-1">
              <span>⚙️ Pengaturan Kredensial Firebase</span>
              ${isFbConfigured ? '<span class="text-emerald-600 font-semibold">(Terhubung)</span>' : '<span class="text-amber-600 font-semibold">(Belum Diatur)</span>'}
            </span>
            <span id="icon-toggle-firebase" class="text-xs">&darr;</span>
          </button>

          <div id="section-firebase-modal-config" class="${isFbConfigured ? 'hidden' : ''} mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2.5">
            <p class="text-[11px] text-amber-900 leading-snug">
              Agar Google Sign-In aktif di browser, pastikan Anda telah memasukkan kredensial Web App dari <strong>Firebase Console</strong> (atau via <code>.env</code>):
            </p>
            <form id="form-modal-firebase-config" class="space-y-2">
              <div>
                <label class="block text-[10px] font-semibold text-slate-700 mb-0.5">Firebase API Key</label>
                <input type="text" id="fb-modal-api-key" value="${fbConfig?.apiKey || ''}" required placeholder="AIzaSy..." 
                  class="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none font-mono" />
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-700 mb-0.5">Auth Domain</label>
                <input type="text" id="fb-modal-auth-domain" value="${fbConfig?.authDomain || ''}" required placeholder="project-id.firebaseapp.com" 
                  class="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none font-mono" />
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-700 mb-0.5">Project ID</label>
                <input type="text" id="fb-modal-project-id" value="${fbConfig?.projectId || ''}" required placeholder="project-id" 
                  class="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none font-mono" />
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-700 mb-0.5">App ID (Opsional)</label>
                <input type="text" id="fb-modal-app-id" value="${fbConfig?.appId || ''}" placeholder="1:123456789:web:abcdef" 
                  class="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none font-mono" />
              </div>
              <button type="submit" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition shadow-xs cursor-pointer">
                Simpan & Aktifkan Firebase
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <div id="modal-reset" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-slate-900 text-center">
        <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </div>
        <h3 class="text-base font-bold text-slate-900 mb-1">Reset ke Data Kosong?</h3>
        <p class="text-xs text-slate-600 mb-5 leading-relaxed">
          Tindakan ini akan menghapus seluruh data pegawai dan 12 bulan komponen penghasilan yang telah dimasukkan. Pastikan Anda telah mengekspor file cadangan jika masih dibutuhkan.
        </p>
        <div class="flex gap-2">
          <button id="btn-cancel-reset" class="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer">
            Batal
          </button>
          <button id="btn-confirm-reset" class="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs cursor-pointer">
            Ya, Kosongkan
          </button>
        </div>
      </div>
    </div>

    <!-- Validation Error Modal -->
    <div id="modal-validation-error" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
      <div class="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-lg w-full p-6 text-slate-900">
        <div class="flex items-center gap-3 pb-3 border-b border-rose-100 mb-3 text-rose-700">
          <svg class="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <h3 class="text-base font-bold">File JSON Ditolak (Validasi Skema Gagal)</h3>
        </div>
        <p class="text-xs text-slate-600 mb-3">
          Sesuai standar keamanan sistem, file JSON wajib memenuhi spesifikasi skema PPh 21 ASN. Ditemukan kesalahan berikut:
        </p>
        <div id="validation-error-list" class="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1 max-h-48 overflow-y-auto mb-4 font-mono">
        </div>
        <button id="btn-close-validation-modal" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer">
          Tutup
        </button>
      </div>
    </div>
  `;
}
