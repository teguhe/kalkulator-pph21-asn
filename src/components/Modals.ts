import { appState } from '../state/appState';

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
        <button data-toast-id="${t.id}" class="btn-dismiss-toast text-slate-400 hover:text-white p-0.5">&times;</button>
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
            <h3 class="text-sm font-bold">Masuk dengan Google</h3>
          </div>
          <button id="btn-close-modal-login" class="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <p class="text-xs text-slate-600 mb-4 leading-relaxed">
          Login akun Google memberikan Anda <strong>kuota 25x perhitungan per hari</strong> secara gratis dan pencatatan riwayat aktivitas.
        </p>

        <div class="space-y-2 mb-4">
          <button data-quick-login="teguhe@gmail.com" class="btn-quick-login w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex items-center justify-between group">
            <div>
              <div class="text-xs font-bold text-slate-900 group-hover:text-emerald-800">teguhe@gmail.com</div>
              <div class="text-[10px] text-amber-600 font-semibold">Super Administrator (Akses Penuh & Unlimited)</div>
            </div>
            <span class="text-xs text-emerald-600 font-bold">&rarr;</span>
          </button>

          <button data-quick-login="teguhe2@gmail.com" class="btn-quick-login w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex items-center justify-between group">
            <div>
              <div class="text-xs font-bold text-slate-900 group-hover:text-emerald-800">teguhe2@gmail.com</div>
              <div class="text-[10px] text-amber-600 font-semibold">Super Administrator Cadangan</div>
            </div>
            <span class="text-xs text-emerald-600 font-bold">&rarr;</span>
          </button>
        </div>

        <div class="relative flex items-center justify-center my-3">
          <div class="border-t border-slate-200 w-full"></div>
          <span class="bg-white px-2 text-[10px] text-slate-400 uppercase font-semibold">atau email custom</span>
        </div>

        <form id="form-custom-login" class="space-y-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Email Pengguna</label>
            <input type="email" id="input-login-email" placeholder="nama.pegawai@gmail.com" required 
              class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Nama Tampilan</label>
            <input type="text" id="input-login-name" placeholder="Budi Santoso" 
              class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
            Lanjutkan Masuk
          </button>
        </form>
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
          <button id="btn-cancel-reset" class="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
            Batal
          </button>
          <button id="btn-confirm-reset" class="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs">
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
        <button id="btn-close-validation-modal" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition">
          Tutup
        </button>
      </div>
    </div>
  `;
}
