import { appState } from '../state/appState';
import { authService } from '../services/authService';
import { quotaService } from '../services/quotaService';
import { logService } from '../services/logService';
import { formatTimestampIndo, formatRupiah, formatNPWP } from '../utils/formatters';

export function renderAdminView(): string {
  const { currentUser } = appState;
  const isAdmin = currentUser ? currentUser.isAdmin : false;
  const firebaseConfig = authService.getFirebaseConfig();
  const isFbConfigured = authService.isFirebaseConfigured();

  if (!isAdmin) {
    return `
      <div class="max-w-2xl mx-auto py-8 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div class="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Area Khusus Administrator</h2>
          <p class="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Dashboard ini hanya dapat diakses oleh email Super Admin terdaftar (<strong>teguhe@gmail.com</strong>, <strong>teguhe2@gmail.com</strong>) atau email yang telah diberi hak akses administrator oleh Super Admin.
          </p>

          ${currentUser ? `
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs text-slate-700">
              Anda saat ini masuk sebagai: <strong>${currentUser.email}</strong> (Bukan Administrator).
            </div>
          ` : `
            <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl mb-6 text-xs text-rose-800">
              Anda belum login. Semua pengguna wajib masuk menggunakan akun Google resmi terlebih dahulu.
            </div>
          `}

          <div class="flex flex-col items-center justify-center gap-3">
            <button id="btn-admin-open-google-login" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>${currentUser ? 'Ganti Akun Google (Login Administrator)' : 'Masuk dengan Akun Google'}</span>
            </button>
            <p class="text-[11px] text-slate-500 max-w-md">
              Akses administrator terverifikasi otomatis melalui autentikasi Google resmi.
            </p>
          </div>
        </div>

        <!-- Form Konfigurasi Firebase API Langsung (Dapat diakses sebelum login admin) -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-left">
          <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M3.89 15.672L6.255.474A.5.5 0 0 1 7.15.28l3.49 6.55-6.75 8.842zm14.839 3.013l-1.89-11.758a.5.5 0 0 0-.87-.271L3.08 18.685l7.98 4.51a2 2 0 0 0 1.94 0l5.73-3.01zM13.63 8.358l-2.42-4.63a.5.5 0 0 0-.88 0l-7.79 14.86 11.09-10.23z"/></svg>
              <h3 class="text-sm font-bold text-slate-900">Form Pengaturan Firebase & API Key</h3>
            </div>
            ${isFbConfigured 
              ? '<span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">🟢 Terhubung</span>' 
              : '<span class="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">🟠 Belum Terhubung</span>'}
          </div>

          <p class="text-xs text-slate-600 mb-4 leading-relaxed">
            Untuk mengaktifkan login Google, masukkan kredensial Web App dari <strong>Firebase Console</strong> (menu <em>Project Settings &gt; General &gt; Your apps</em>). Data ini disimpan aman di browser lokal Anda.
          </p>

          <form id="form-firebase-config" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Firebase API Key <span class="text-rose-500">*</span></label>
              <input type="text" id="fb-api-key" value="${firebaseConfig?.apiKey || ''}" required placeholder="Contoh: AIzaSyD..." 
                class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Auth Domain <span class="text-rose-500">*</span></label>
                <input type="text" id="fb-auth-domain" value="${firebaseConfig?.authDomain || ''}" required placeholder="project-id.firebaseapp.com" 
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Project ID <span class="text-rose-500">*</span></label>
                <input type="text" id="fb-project-id" value="${firebaseConfig?.projectId || ''}" required placeholder="project-id" 
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">App ID (Opsional)</label>
              <input type="text" id="fb-app-id" value="${firebaseConfig?.appId || ''}" placeholder="1:123456789:web:abcdef" 
                class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button type="submit" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer mt-2">
              Simpan Konfigurasi Firebase
            </button>
          </form>
        </div>
      </div>
    `;
  }

  // Admin Dashboard Content (Admin is logged in)
  const adminList = authService.getAdminList();
  const logs = logService.getLogs();
  const defaultLimit = quotaService.getDefaultDailyLimit();
  const bonusList = quotaService.getBonusQuotaList();
  const emailSummaries = logService.getProcessSummaryByEmail();
  const nikSummaries = logService.getProcessSummaryByNIK();

  const allKnownEmails = Array.from(new Set([
    ...emailSummaries.map(s => s.email),
    ...bonusList.map(b => b.email)
  ])).filter(Boolean);

  // Admin list rows
  const adminRowsHtml = adminList.map(a => {
    return `
      <tr class="border-b border-slate-100 text-xs hover:bg-slate-50 transition">
        <td class="py-2.5 px-3 font-semibold text-slate-900">${a.email}</td>
        <td class="py-2.5 px-3">
          ${a.isSuperAdmin 
            ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Super Admin Bawaan</span>' 
            : '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Admin Tambahan</span>'}
        </td>
        <td class="py-2.5 px-3 text-right">
          ${!a.isSuperAdmin ? `
            <button data-remove-admin="${a.email}" class="btn-remove-admin text-rose-600 hover:text-rose-800 font-semibold text-[11px] cursor-pointer">Hapus</button>
          ` : '<span class="text-slate-400 text-[11px]">-</span>'}
        </td>
      </tr>
    `;
  }).join('');

  // 1. Rekap Per Email Rows (dengan info Kuota Harian & Tombol Aksi Cepat Bonus)
  const emailRecapRowsHtml = emailSummaries.map((s, idx) => {
    const isAdminEmail = authService.checkIsAdmin(s.email);
    const isSuper = authService.checkIsSuperAdmin(s.email);
    const roleBadge = isSuper 
      ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Super Admin</span>'
      : isAdminEmail 
      ? '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Admin</span>'
      : '<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">Pegawai</span>';

    const eff = quotaService.getUserEffectiveLimit(s.email);
    let quotaBadge = '';
    if (eff.isUnlimited) {
      quotaBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Unlimited (Admin)</span>';
    } else if (eff.bonus > 0) {
      quotaBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300" title="Batas Default ${eff.defaultLimit} + Bonus ${eff.bonus}">+${eff.bonus} (Total: ${eff.limit}x)</span>`;
    } else {
      quotaBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">${eff.defaultLimit}x / hari</span>`;
    }

    const actionButton = !eff.isUnlimited ? `
      <button data-quick-bonus-email="${s.email}" data-quick-bonus-current="${eff.bonus}" class="btn-quick-bonus inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition cursor-pointer" title="Atur bonus proses untuk ${s.email}">
        <svg class="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        <span>${eff.bonus > 0 ? 'Ubah Bonus' : '+ Bonus'}</span>
      </button>
    ` : '<span class="text-slate-400 text-[11px]">-</span>';

    return `
      <tr class="border-b border-slate-100 text-xs hover:bg-slate-50 transition row-rekap-email" data-email-search="${s.email.toLowerCase()}">
        <td class="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">${idx + 1}</td>
        <td class="py-2.5 px-3 font-medium text-slate-900">
          <div class="flex items-center gap-2">
            <span>${s.email}</span>
            ${roleBadge}
          </div>
        </td>
        <td class="py-2.5 px-3 text-center whitespace-nowrap">${quotaBadge}</td>
        <td class="py-2.5 px-3 text-center font-bold text-emerald-700 bg-emerald-50/50">${s.totalCalculations}x</td>
        <td class="py-2.5 px-3 text-center text-slate-600 font-semibold">${s.totalActions} aksi</td>
        <td class="py-2.5 px-3">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ${s.uniqueNIKs.length} NIK Pegawai
          </span>
        </td>
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">${formatTimestampIndo(s.lastActive)}</td>
        <td class="py-2.5 px-3 text-center">${actionButton}</td>
      </tr>
    `;
  }).join('');

  // 2. Bonus Quota Rows HTML
  const bonusRowsHtml = bonusList.map(b => {
    return `
      <tr class="border-b border-slate-100 text-xs hover:bg-slate-50 transition">
        <td class="py-2.5 px-3 font-semibold text-slate-900">${b.email}</td>
        <td class="py-2.5 px-3 text-center">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            +${b.bonus} proses
          </span>
        </td>
        <td class="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">
          ${b.totalLimit}x / hari
        </td>
        <td class="py-2.5 px-3 text-right space-x-2">
          <button data-reset-email-quota="${b.email}" class="btn-reset-email-quota text-slate-600 hover:text-slate-800 font-semibold text-[11px] cursor-pointer" title="Reset hitungan terpakai hari ini">Reset Hari Ini</button>
          <button data-remove-bonus="${b.email}" class="btn-remove-bonus text-rose-600 hover:text-rose-800 font-semibold text-[11px] cursor-pointer">Hapus</button>
        </td>
      </tr>
    `;
  }).join('');

  // 3. Rekap Per NIK Rows
  const nikRecapRowsHtml = nikSummaries.map((s, idx) => {
    const emailsBadge = s.processedByEmails.map(em => 
      `<span class="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 mr-1 mb-1">${em}</span>`
    ).join('');

    return `
      <tr class="border-b border-slate-100 text-xs hover:bg-slate-50 transition row-rekap-nik" data-nik-search="${(s.nik + ' ' + s.nama + ' ' + s.nip + ' ' + s.instansi).toLowerCase()}">
        <td class="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">${idx + 1}</td>
        <td class="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">${formatNPWP(s.nik)}</td>
        <td class="py-2.5 px-3">
          <div class="font-bold text-slate-900">${s.nama}</div>
          <div class="text-[10px] text-slate-500 font-mono">NIP: ${s.nip}</div>
        </td>
        <td class="py-2.5 px-3 text-slate-600 text-[11px]">${s.instansi}</td>
        <td class="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/50">${s.totalCalculations}x</td>
        <td class="py-2.5 px-3 text-right font-mono text-slate-800">${formatRupiah(s.lastTotalBruto)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-semibold text-emerald-700">${formatRupiah(s.lastTotalPajak)}</td>
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">${formatTimestampIndo(s.lastProcessedAt)}</td>
        <td class="py-2.5 px-3 max-w-[200px]">${emailsBadge || '<span class="text-slate-400">-</span>'}</td>
      </tr>
    `;
  }).join('');

  // 4. Raw Log Rows
  const logRowsHtml = logs.slice(0, 50).map(l => {
    const badgeColor = l.type === 'CALCULATE' ? 'bg-blue-100 text-blue-800'
      : l.type === 'LOGIN' ? 'bg-emerald-100 text-emerald-800'
      : l.type === 'IMPORT' ? 'bg-purple-100 text-purple-800'
      : 'bg-slate-100 text-slate-800';

    return `
      <tr class="border-b border-slate-100 text-xs hover:bg-slate-50 transition" data-log-type="${l.type}" data-log-search="${(l.details + ' ' + l.userEmail).toLowerCase()}">
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">${formatTimestampIndo(l.timestamp)}</td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}">${l.type}</span>
        </td>
        <td class="py-2.5 px-3 font-medium text-slate-800 text-[11px]">${l.userEmail}</td>
        <td class="py-2.5 px-3 text-slate-600">${l.details}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-6">
      <!-- Admin Top Banner -->
      <div class="bg-linear-to-r from-slate-900 via-indigo-950 to-emerald-950 rounded-2xl p-6 text-white shadow-md">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Panel Kontrol Administrator
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white">Dashboard Admin &amp; Rekapitulasi Proses</h2>
            <p class="text-xs sm:text-sm text-slate-300">
              Login Aktif: <strong>${currentUser?.email || '-'}</strong> (${currentUser?.isSuperAdmin ? 'Super Administrator' : 'Administrator'})
            </p>
          </div>
          <div class="shrink-0 flex items-center gap-2">
            <button id="btn-admin-export-csv" class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer">
              <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Download Log CSV</span>
            </button>
          </div>
        </div>

        <!-- Metric Stat Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-6 pt-6 border-t border-slate-800">
          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <div class="text-[10px] font-semibold text-slate-400 uppercase">Max Default Harian</div>
            <div class="text-base sm:text-lg font-bold text-white font-mono mt-1">${defaultLimit}x / hari</div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <div class="text-[10px] font-semibold text-slate-400 uppercase">Bonus Akun Aktif</div>
            <div class="text-base sm:text-lg font-bold text-amber-400 font-mono mt-1">${bonusList.length} Akun</div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <div class="text-[10px] font-semibold text-slate-400 uppercase">Akun Pemroses</div>
            <div class="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1">${emailSummaries.length} Email</div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <div class="text-[10px] font-semibold text-slate-400 uppercase">Pegawai / NIK Diproses</div>
            <div class="text-base sm:text-lg font-bold text-indigo-400 font-mono mt-1">${nikSummaries.length} NIK</div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <div class="text-[10px] font-semibold text-slate-400 uppercase">Total Akun Admin</div>
            <div class="text-base sm:text-lg font-bold text-purple-400 font-mono mt-1">${adminList.length} Akun</div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <div class="text-[10px] font-semibold text-slate-400 uppercase">Total Aktivitas</div>
            <div class="text-base sm:text-lg font-bold text-blue-400 font-mono mt-1">${logs.length} Log</div>
          </div>
        </div>
      </div>

      <!-- BAGIAN 1: REKAPITULASI PROSES PER EMAIL PENGGUNA -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Rekapitulasi Proses Berdasarkan Email Pengguna</h3>
              <p class="text-xs text-slate-500">Mencatat aktivitas, jumlah perhitungan pajak, batas kuota, dan NIK pegawai yang diproses</p>
            </div>
          </div>
          <div class="w-full sm:w-64">
            <input type="text" id="input-search-rekap-email" placeholder="Cari email pengguna..." 
              class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs overflow-x-auto">
          <table class="w-full text-left min-w-[750px]">
            <thead class="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th class="py-2.5 px-3 text-center w-12">No</th>
                <th class="py-2.5 px-3">Email Pengguna (Google)</th>
                <th class="py-2.5 px-3 text-center">Batas Kuota</th>
                <th class="py-2.5 px-3 text-center">Hitung PPh 21</th>
                <th class="py-2.5 px-3 text-center">Total Aksi</th>
                <th class="py-2.5 px-3">Pegawai / NIK Diproses</th>
                <th class="py-2.5 px-3">Aktivitas Terakhir</th>
                <th class="py-2.5 px-3 text-center">Atur Kuota</th>
              </tr>
            </thead>
            <tbody id="tbody-rekap-email" class="divide-y divide-slate-100">
              ${emailRecapRowsHtml.length > 0 ? emailRecapRowsHtml : '<tr><td colspan="8" class="p-6 text-center text-xs text-slate-400">Belum ada aktivitas proses per email yang tercatat.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <!-- BAGIAN 2: REKAPITULASI PROSES PER NIK PEGAWAI -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Rekapitulasi Proses Berdasarkan NIK Pegawai</h3>
              <p class="text-xs text-slate-500">Mencatat data pegawai, frekuensi perhitungan PPh 21, nilai bruto &amp; pajak terakhir, serta akun pemroses</p>
            </div>
          </div>
          <div class="w-full sm:w-72">
            <input type="text" id="input-search-rekap-nik" placeholder="Cari NIK, Nama, atau Instansi..." 
              class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs overflow-x-auto">
          <table class="w-full text-left min-w-[900px]">
            <thead class="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th class="py-2.5 px-3 text-center w-12">No</th>
                <th class="py-2.5 px-3">NIK Pegawai</th>
                <th class="py-2.5 px-3">Nama Pegawai &amp; NIP</th>
                <th class="py-2.5 px-3">Instansi</th>
                <th class="py-2.5 px-3 text-center">Frekuensi</th>
                <th class="py-2.5 px-3 text-right">Bruto Terakhir</th>
                <th class="py-2.5 px-3 text-right">PPh 21 Terutang</th>
                <th class="py-2.5 px-3">Terakhir Diproses</th>
                <th class="py-2.5 px-3">Diproses Oleh</th>
              </tr>
            </thead>
            <tbody id="tbody-rekap-nik" class="divide-y divide-slate-100">
              ${nikRecapRowsHtml.length > 0 ? nikRecapRowsHtml : '<tr><td colspan="9" class="p-6 text-center text-xs text-slate-400">Belum ada pegawai (NIK) yang diproses perhitungannya.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <!-- BAGIAN 3: PENGATURAN KUOTA PROSES & HAK AKSES -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- KOLOM KIRI: MANAJEMEN KUOTA PROSES (DEFAULT & BONUS) -->
        <div class="space-y-6">
          
          <!-- 1. Pengaturan Max Proses Default Harian -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <div>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Batas Max Proses Default Harian</h3>
                  <p class="text-[11px] text-slate-500">Kuota dasar harian untuk seluruh akun pengguna terdaftar</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                Aktif: ${defaultLimit}x / hari
              </span>
            </div>

            <form id="form-default-quota-limit" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Max Proses Default (per hari per akun)
                </label>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <input type="number" id="input-default-daily-limit" min="1" max="1000" value="${defaultLimit}" required 
                      class="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                    <span class="absolute right-3 top-2 text-[11px] font-semibold text-slate-400">proses / hari</span>
                  </div>
                  <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer shrink-0">
                    Simpan Default
                  </button>
                  <button type="button" id="btn-reset-default-limit" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0" title="Kembalikan batas default ke nilai standar 25 proses">
                    Reset Standar (25)
                  </button>
                </div>
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed">
                Pengguna yang masuk via Google akan otomatis menerima kuota dasar sebanyak <strong>${defaultLimit} proses per hari</strong>. Kuota akan tereset otomatis setiap hari.
              </p>
            </form>
          </div>

          <!-- 2. Pengaturan Bonus Proses Per Akun -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs" id="card-bonus-quota">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Bonus Proses Per Akun</h3>
                  <p class="text-[11px] text-slate-500">Berikan tambahan kuota harian khusus untuk akun tertentu</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200">
                ${bonusList.length} Akun Berbonus
              </span>
            </div>

            <!-- Form Tambah/Ubah Bonus -->
            <form id="form-bonus-quota" class="space-y-3 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div class="sm:col-span-2">
                  <label class="block text-[11px] font-semibold text-slate-700 mb-1">Email Akun Pengguna</label>
                  <input type="email" id="input-bonus-email" placeholder="contoh.pegawai@gmail.com" list="datalist-all-emails" required 
                    class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                  <datalist id="datalist-all-emails">
                    ${allKnownEmails.map(em => `<option value="${em}">`).join('')}
                  </datalist>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-1">Bonus (+Proses)</label>
                  <input type="number" id="input-bonus-amount" min="1" max="5000" placeholder="50" required 
                    class="w-full px-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>
              </div>
              <div class="flex items-center justify-between pt-1">
                <span class="text-[11px] text-slate-500">
                  Total kuota akun ini: <strong class="text-slate-800">${defaultLimit} (Default) + Bonus</strong>
                </span>
                <button type="submit" class="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer">
                  Terapkan Bonus
                </button>
              </div>
            </form>

            <!-- Tabel Daftar Akun dengan Bonus Khusus -->
            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table class="w-full text-left">
                <thead class="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th class="py-2 px-3">Email Pengguna</th>
                    <th class="py-2 px-3 text-center">Bonus (+X)</th>
                    <th class="py-2 px-3 text-center">Total Kuota</th>
                    <th class="py-2 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${bonusRowsHtml.length > 0 ? bonusRowsHtml : `
                    <tr>
                      <td colspan="4" class="p-4 text-center text-xs text-slate-400">
                        Belum ada akun yang diberikan bonus proses khusus.
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3. Tindakan Reset Kuota Sistem -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div class="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <svg class="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Pemulihan / Reset Kuota Sistem</h3>
            </div>
            <p class="text-xs text-slate-600 mb-3 leading-relaxed">
              Gunakan opsi ini jika ingin mereset pemakaian kuota sebelum waktu pergantian hari otomatis.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button id="btn-admin-reset-quota-today" class="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 transition flex items-center justify-between cursor-pointer">
                <span>Reset Akun Saya Hari Ini</span>
                <span class="text-emerald-600">&circlearrowright;</span>
              </button>
              <button id="btn-admin-reset-all-quotas" class="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 transition flex items-center justify-between cursor-pointer">
                <span>Reset Seluruh Kuota Sistem</span>
                <span class="text-rose-600">&times;</span>
              </button>
            </div>
          </div>

        </div>

        <!-- KOLOM KANAN: KELOLA DAFTAR ADMIN & KONFIGURASI FIREBASE -->
        <div class="space-y-6">
          
          <!-- Manajemen Email Admin -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div class="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Kelola Daftar Admin</h3>
            </div>

            <!-- Form Tambah Admin -->
            <form id="form-add-admin" class="flex gap-2 mb-4">
              <input type="email" id="input-new-admin-email" placeholder="admin.baru@gmail.com" required 
                class="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              <button type="submit" class="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shrink-0 cursor-pointer">
                Tambah Admin
              </button>
            </form>

            <!-- Tabel Admin -->
            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table class="w-full text-left">
                <thead class="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th class="py-2 px-3">Email</th>
                    <th class="py-2 px-3">Role</th>
                    <th class="py-2 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${adminRowsHtml}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Konfigurasi Firebase Live -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M3.89 15.672L6.255.474A.5.5 0 0 1 7.15.28l3.49 6.55-6.75 8.842zm14.839 3.013l-1.89-11.758a.5.5 0 0 0-.87-.271L3.08 18.685l7.98 4.51a2 2 0 0 0 1.94 0l5.73-3.01zM13.63 8.358l-2.42-4.63a.5.5 0 0 0-.88 0l-7.79 14.86 11.09-10.23z"/></svg>
                <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Konfigurasi Firebase</h3>
              </div>
              ${isFbConfigured 
                ? '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">🟢 Terhubung</span>' 
                : '<span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">🟠 Belum Terhubung</span>'}
            </div>

            <p class="text-[11px] text-slate-500 mb-3">
              Kredensial Firebase project untuk mengaktifkan Google Sign-In &amp; pencatatan live. Kredensial ini disimpan aman di browser lokal Anda.
            </p>

            <form id="form-firebase-config" class="space-y-2.5 text-xs">
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-0.5">Firebase API Key</label>
                <input type="text" id="fb-api-key" value="${firebaseConfig?.apiKey || ''}" required placeholder="AIzaSy..." 
                  class="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-0.5">Auth Domain</label>
                <input type="text" id="fb-auth-domain" value="${firebaseConfig?.authDomain || ''}" required placeholder="project-id.firebaseapp.com" 
                  class="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-0.5">Project ID</label>
                <input type="text" id="fb-project-id" value="${firebaseConfig?.projectId || ''}" required placeholder="project-id" 
                  class="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-0.5">App ID (Opsional)</label>
                <input type="text" id="fb-app-id" value="${firebaseConfig?.appId || ''}" placeholder="1:123456789:web:abcdef" 
                  class="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button type="submit" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition mt-2 cursor-pointer">
                Simpan Konfigurasi Firebase
              </button>
            </form>
          </div>

        </div>

      </div>

      <!-- BAGIAN 4: CATATAN LOG AKTIVITAS SISTEM LENGKAP -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Catatan Log Aktivitas Sistem Lengkap</h3>
            <p class="text-xs text-slate-500">Mencatat riwayat login, proses perhitungan pajak, serta impor/ekspor data</p>
          </div>

          <!-- Filter controls -->
          <div class="flex items-center gap-2">
            <select id="select-log-filter" class="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none cursor-pointer">
              <option value="ALL">Semua Tipe Log</option>
              <option value="CALCULATE">Perhitungan Pajak</option>
              <option value="LOGIN">Login Akun</option>
              <option value="IMPORT">Impor Data</option>
              <option value="EXPORT">Ekspor Data</option>
            </select>
            <button id="btn-admin-clear-logs" class="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition font-medium cursor-pointer">
              Hapus Log
            </button>
          </div>
        </div>

        <!-- Search log input -->
        <div class="mb-4">
          <input type="text" id="input-search-log" placeholder="Cari dalam log (email, nama pegawai, dll)..." 
            class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <!-- Log Table -->
        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs max-h-[500px] overflow-y-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-200 sticky top-0">
              <tr>
                <th class="py-2.5 px-3">Waktu (WIB)</th>
                <th class="py-2.5 px-3">Tipe</th>
                <th class="py-2.5 px-3">Pengguna</th>
                <th class="py-2.5 px-3">Keterangan / Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody id="admin-log-tbody" class="divide-y divide-slate-100">
              ${logRowsHtml.length > 0 ? logRowsHtml : '<tr><td colspan="4" class="p-6 text-center text-xs text-slate-400">Belum ada catatan aktivitas sistem.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
