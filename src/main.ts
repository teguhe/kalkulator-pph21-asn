import './index.css';
import { appState } from './state/appState';
import { authService } from './services/authService';
import { quotaService } from './services/quotaService';
import { logService } from './services/logService';
import { validatePPh21Dataset } from './utils/validator';
import { parseFormattedNumber, formatNumber, formatRupiah } from './utils/formatters';
import { PTKP_MAP } from '../taxConstants';

import { renderHeader } from './components/Header';
import { renderNavigation } from './components/Navigation';
import { renderToastContainer, renderModals } from './components/Modals';

import { renderPegawaiView } from './views/PegawaiView';
import { renderInputPenghasilanView } from './views/InputPenghasilanView';
import { renderHasilRekonsiliasiView } from './views/HasilRekonsiliasiView';
import { renderBpa2View } from './views/Bpa2View';
import { renderFaqView } from './views/FaqView';
import { renderAdminView } from './views/AdminView';

const appEl = document.getElementById('app')!;

function renderLoginGate(): string {
  return `
    <div class="max-w-xl mx-auto py-10 text-center">
      <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <svg class="w-8 h-8" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Kalkulator PPh 21 ASN</h2>
        <p class="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          Semua pengguna wajib masuk menggunakan Akun Google terlebih dahulu untuk menggunakan fitur kalkulator dan pencetakan BPA2.
        </p>

        <div class="space-y-3 max-w-sm mx-auto mb-6">
          <button id="btn-gate-google-login" class="w-full flex items-center justify-center gap-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition hover:shadow cursor-pointer">
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Masuk dengan Akun Google</span>
          </button>
        </div>

        <div class="pt-6 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-center gap-2">
          <span class="text-emerald-600 font-bold">&check;</span>
          <span>Setiap akun Google diberikan kuota 25x perhitungan per hari</span>
        </div>
      </div>
    </div>
  `;
}

function renderApp(): void {
  let contentHtml = '';
  if (!appState.currentUser && appState.activeTab !== 'faq') {
    contentHtml = renderLoginGate();
  } else {
    switch (appState.activeTab) {
      case 'pegawai':
        contentHtml = renderPegawaiView();
        break;
      case 'input':
        contentHtml = renderInputPenghasilanView();
        break;
      case 'hasil':
        contentHtml = renderHasilRekonsiliasiView();
        break;
      case 'bpa2':
        contentHtml = renderBpa2View();
        break;
      case 'faq':
        contentHtml = renderFaqView();
        break;
      case 'admin':
        contentHtml = renderAdminView();
        break;
    }
  }

  appEl.innerHTML = `
    <div class="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      ${renderHeader()}
      ${renderNavigation()}

      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        ${contentHtml}
      </main>

      <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print mt-auto">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>Kalkulator PPh 21 & Generator BPA2 ASN</strong> &copy; ${new Date().getFullYear()} Teguh Prasetyo, M.Si.
          </div>
          <div class="flex items-center gap-3 text-slate-600">
            <button id="btn-footer-faq" class="text-emerald-700 hover:text-emerald-800 font-semibold transition cursor-pointer hover:underline">
              Pusat Bantuan &amp; FAQ
            </button>
            <span>&bull;</span>
            <span>PP 58/2023 &amp; PMK 168/2023</span>
            <span>&bull;</span>
            <span>Formulir 1721-BPA2</span>
          </div>
        </div>
      </footer>

      ${renderToastContainer()}
      ${renderModals()}
    </div>
  `;

  attachEventListeners();
}

function updateToastContainerUI(): void {
  const container = document.getElementById('toast-container');
  if (container) {
    container.outerHTML = renderToastContainer();
    // Attach dismiss handlers
    document.querySelectorAll('.btn-dismiss-toast').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.toastId;
        if (id) appState.removeToast(id);
      });
    });
  }
}

function updateMonthSummaryCards(monthNum: number): void {
  const mCalc = appState.calculation.hasil_bulanan[monthNum - 1];
  if (!mCalc) return;

  const currentMonthData = appState.dataset.periode_bulanan[monthNum - 1];
  const isAkhir = currentMonthData.is_akhir_periode || currentMonthData.metode_perhitungan === 'AKHIR_PERIODE';

  // 1. Total Bruto
  const elBruto = document.getElementById('summary-month-bruto');
  if (elBruto) elBruto.textContent = formatRupiah(mCalc.bruto_total);

  // 2. Rate / Method
  const elRate = document.getElementById('summary-month-rate');
  if (elRate) {
    elRate.textContent = isAkhir 
      ? 'Pasal 17 Tahunan' 
      : `${mCalc.ter_rate ?? 0}% (Kategori ${appState.dataset.pegawai.kategori_ter})`;
  }

  // 3. PPh Terutang & Dipotong
  const elPph = document.getElementById('summary-month-pph');
  if (elPph) elPph.textContent = formatRupiah(mCalc.pph21_terutang);

  const elDipotong = document.getElementById('summary-month-dipotong');
  if (elDipotong) elDipotong.textContent = `Sudah dipotong: ${formatRupiah(mCalc.pajak_sudah_dipotong)}`;

  // 4. Selisih
  const elSelisih = document.getElementById('summary-month-selisih');
  const elSelisihStatus = document.getElementById('summary-month-selisih-status');
  if (elSelisih) {
    elSelisih.textContent = mCalc.selisih > 0 ? `+${formatRupiah(mCalc.selisih)}` : formatRupiah(mCalc.selisih);
    elSelisih.className = `text-base sm:text-lg font-bold ${
      mCalc.selisih > 0 ? 'text-rose-600' : mCalc.selisih < 0 ? 'text-amber-600' : 'text-emerald-600'
    }`;
  }
  if (elSelisihStatus) {
    elSelisihStatus.textContent = mCalc.selisih > 0 ? 'Kurang Bayar / Potong' : mCalc.selisih < 0 ? 'Lebih Bayar / Potong' : 'Sesuai (Nihil)';
    elSelisihStatus.className = `text-[11px] font-semibold mt-0.5 ${
      mCalc.selisih > 0 ? 'text-rose-500' : mCalc.selisih < 0 ? 'text-amber-500' : 'text-emerald-500'
    }`;
  }

  // 5. Update chip in 12-month strip
  const elChip = document.querySelector(`[data-month-chip="${monthNum}"]`);
  if (elChip) {
    elChip.textContent = mCalc.bruto_total > 0 ? formatNumber(mCalc.bruto_total / 1000000) + 'jt' : '-';
  }
}

function attachEventListeners(): void {
  // Navigation Tabs
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = (e.currentTarget as HTMLElement).dataset.tab;
      if (target) {
        if (!appState.currentUser && target !== 'faq') {
          appState.showToast('warning', 'Wajib Login', 'Silakan masuk dengan Akun Google terlebih dahulu.');
          document.getElementById('modal-login')?.classList.remove('hidden');
          return;
        }
        appState.setActiveTab(target as any);
      }
    });
  });

  // Google Sign-In Handler
  const handleGoogleSignIn = async (triggerBtn?: HTMLElement | null) => {
    if (!authService.isFirebaseConfigured()) {
      appState.showToast('warning', 'Autentikasi Belum Aktif', 'Konfigurasi Firebase belum diatur. Silakan hubungi Administrator situs.');
      return;
    }

    const originalHtml = triggerBtn ? triggerBtn.innerHTML : '';
    try {
      if (triggerBtn) {
        triggerBtn.setAttribute('disabled', 'true');
        triggerBtn.classList.add('opacity-75', 'cursor-not-allowed');
        triggerBtn.innerHTML = `
          <span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          <span>Menghubungkan ke Google...</span>
        `;
      }

      const user = await authService.signInWithGoogle();
      document.getElementById('modal-login')?.classList.add('hidden');
      logService.recordLog('LOGIN', `Login sukses dengan akun Google: ${user.email} (${user.isAdmin ? 'Admin' : 'Pegawai'})`);

      if (user.isAdmin) {
        appState.showToast('success', 'Akses Administrator Terbuka', `Selamat datang, ${user.displayName || user.email} (Administrator).`);
      } else {
        appState.showToast('success', 'Login Berhasil', `Selamat datang, ${user.displayName || user.email} (+25 Kuota Harian).`);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      appState.showToast('error', 'Gagal Login Google', err.message || 'Terjadi kesalahan saat masuk dengan Google.');
    } finally {
      if (triggerBtn) {
        triggerBtn.removeAttribute('disabled');
        triggerBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        triggerBtn.innerHTML = originalHtml;
      }
    }
  };

  // Gatekeeper Button (Shown on login welcome card)
  const btnGateGoogle = document.getElementById('btn-gate-google-login');
  btnGateGoogle?.addEventListener('click', () => {
    handleGoogleSignIn(btnGateGoogle);
  });

  // Pusat Bantuan & FAQ Event Listeners
  const handleOpenFaq = () => appState.setActiveTab('faq');
  document.getElementById('btn-header-faq')?.addEventListener('click', handleOpenFaq);
  document.getElementById('btn-header-faq-loggedin')?.addEventListener('click', handleOpenFaq);
  document.getElementById('btn-header-faq-mobile')?.addEventListener('click', handleOpenFaq);
  document.getElementById('btn-menu-faq')?.addEventListener('click', handleOpenFaq);
  document.getElementById('btn-footer-faq')?.addEventListener('click', handleOpenFaq);

  // Navigasi Kembali ke Kalkulator (Langkah 1: Data Pegawai)
  const handleBackToCalc = () => appState.setActiveTab('pegawai');
  document.getElementById('btn-header-logo-home')?.addEventListener('click', handleBackToCalc);
  document.querySelectorAll('.btn-back-to-calc').forEach(btn => {
    btn.addEventListener('click', handleBackToCalc);
  });

  // Header Actions
  const btnLoadDummy = document.getElementById('btn-load-dummy');
  const btnLoadDummyMobile = document.getElementById('btn-load-dummy-mobile');
  const handleLoadDummy = () => appState.loadDummyTemplate();
  btnLoadDummy?.addEventListener('click', handleLoadDummy);
  btnLoadDummyMobile?.addEventListener('click', handleLoadDummy);

  const btnExport = document.getElementById('btn-export-json');
  const btnExportMobile = document.getElementById('btn-export-json-mobile');
  const handleExport = () => exportDatasetJSON();
  btnExport?.addEventListener('click', handleExport);
  btnExportMobile?.addEventListener('click', handleExport);

  const fileInput = document.getElementById('json-file-input') as HTMLInputElement;
  const btnImport = document.getElementById('btn-import-json');
  const btnImportMobile = document.getElementById('btn-import-json-mobile');
  const triggerImport = () => fileInput?.click();
  btnImport?.addEventListener('click', triggerImport);
  btnImportMobile?.addEventListener('click', triggerImport);

  fileInput?.addEventListener('change', handleFileImport);

  // Reset Modal
  const modalReset = document.getElementById('modal-reset');
  const btnReset = document.getElementById('btn-reset-data');
  const btnResetMobile = document.getElementById('btn-reset-data-mobile');
  const btnCancelReset = document.getElementById('btn-cancel-reset');
  const btnConfirmReset = document.getElementById('btn-confirm-reset');

  const openReset = () => modalReset?.classList.remove('hidden');
  const closeReset = () => modalReset?.classList.add('hidden');

  btnReset?.addEventListener('click', openReset);
  btnResetMobile?.addEventListener('click', openReset);
  btnCancelReset?.addEventListener('click', closeReset);
  btnConfirmReset?.addEventListener('click', () => {
    closeReset();
    appState.resetToEmpty();
  });

  // Auth / Login Modal
  const modalLogin = document.getElementById('modal-login');
  const btnOpenLogin = document.getElementById('btn-header-google-signin');
  const btnPromptLogin = document.getElementById('btn-header-login-prompt');
  const btnCloseLogin = document.getElementById('btn-close-modal-login');
  const btnSignout = document.getElementById('btn-header-signout');

  const openLogin = () => modalLogin?.classList.remove('hidden');
  const closeLogin = () => modalLogin?.classList.add('hidden');

  btnOpenLogin?.addEventListener('click', () => handleGoogleSignIn(btnOpenLogin));
  btnPromptLogin?.addEventListener('click', openLogin);
  btnCloseLogin?.addEventListener('click', closeLogin);

  btnSignout?.addEventListener('click', async () => {
    await authService.signOut();
    appState.showToast('info', 'Keluar', 'Anda telah keluar dari sesi.');
  });

  // Menu to admin
  const btnMenuToAdmin = document.getElementById('btn-menu-to-admin');
  btnMenuToAdmin?.addEventListener('click', () => {
    appState.setActiveTab('admin');
  });

  // Real Google Sign-In Button inside Modal
  const btnDoGoogle = document.getElementById('btn-do-google-login');
  btnDoGoogle?.addEventListener('click', () => {
    handleGoogleSignIn(btnDoGoogle);
  });

  // Toast Dismissal
  document.querySelectorAll('.btn-dismiss-toast').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.toastId;
      if (id) appState.removeToast(id);
    });
  });

  // Validation Error Modal Close
  const btnCloseValidation = document.getElementById('btn-close-validation-modal');
  btnCloseValidation?.addEventListener('click', () => {
    document.getElementById('modal-validation-error')?.classList.add('hidden');
  });

  // --- TAB-SPECIFIC LISTENERS ---
  if (appState.activeTab === 'pegawai') {
    attachPegawaiListeners();
  } else if (appState.activeTab === 'input') {
    attachInputListeners();
  } else if (appState.activeTab === 'hasil') {
    attachHasilListeners();
  } else if (appState.activeTab === 'bpa2') {
    attachBpa2Listeners();
  } else if (appState.activeTab === 'faq') {
    attachFaqListeners();
  } else if (appState.activeTab === 'admin') {
    attachAdminListeners();
  }
}

function attachPegawaiListeners(): void {
  // Bind text inputs with shouldNotify = false to prevent DOM destruction on keystroke!
  const bindText = (id: string, field: any, isInstansi: boolean = false) => {
    const el = document.getElementById(id) as HTMLInputElement;
    el?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      if (isInstansi) {
        appState.updateInstansi(field, val, false);
      } else {
        appState.updatePegawai(field, val, false);
      }
    });
  };

  bindText('pegawai-nama', 'nama');
  bindText('pegawai-nip', 'nip');
  bindText('pegawai-nik', 'nik');
  bindText('pegawai-npwp', 'npwp');
  bindText('pegawai-jabatan', 'jabatan');

  // Pangkat select dropdown
  const pangkatSelect = document.getElementById('pegawai-pangkat') as HTMLSelectElement;
  pangkatSelect?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    appState.updatePegawai('pangkat_golongan', val, false);
  });

  // PTKP select dropdown
  const ptkpSelect = document.getElementById('pegawai-ptkp') as HTMLSelectElement;
  ptkpSelect?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    appState.updatePegawai('status_ptkp', val, false);

    // Update TER select and info banner directly in the DOM without re-rendering!
    const terSelect = document.getElementById('pegawai-kategori-ter') as HTMLSelectElement;
    if (terSelect) {
      terSelect.value = appState.dataset.pegawai.kategori_ter;
    }
    const infoBanner = document.getElementById('ptkp-info-banner');
    if (infoBanner) {
      const ptkpConf = PTKP_MAP[val as keyof typeof PTKP_MAP] || PTKP_MAP['TK/0'];
      infoBanner.innerHTML = `<strong>Nilai PTKP Tahunan:</strong> ${formatRupiah(ptkpConf.nilaiTahunan)} (${ptkpConf.deskripsi}). Kategori TER bulanan aktif: <strong>Kategori ${appState.dataset.pegawai.kategori_ter}</strong>.`;
    }
  });

  // TER category override
  const terSelect = document.getElementById('pegawai-kategori-ter') as HTMLSelectElement;
  terSelect?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    appState.updatePegawai('kategori_ter', val, false);
    const infoBanner = document.getElementById('ptkp-info-banner');
    if (infoBanner) {
      const ptkpConf = PTKP_MAP[appState.dataset.pegawai.status_ptkp] || PTKP_MAP['TK/0'];
      infoBanner.innerHTML = `<strong>Nilai PTKP Tahunan:</strong> ${formatRupiah(ptkpConf.nilaiTahunan)} (${ptkpConf.deskripsi}). Kategori TER bulanan aktif: <strong>Kategori ${val}</strong>.`;
    }
  });

  // Iuran Pensiun %
  const iuranInput = document.getElementById('pegawai-iuran-pensiun') as HTMLInputElement;
  iuranInput?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value) || 0;
    appState.updatePegawai('persen_iuran_pensiun', val, false);
  });

  // Instansi fields
  bindText('instansi-nama', 'nama_instansi', true);
  bindText('instansi-npwp', 'npwp_instansi_utama', true);
  bindText('instansi-bendahara-nama', 'nama_bendahara_utama', true);
  bindText('instansi-bendahara-nip', 'nip_bendahara_utama', true);
  bindText('instansi-kota', 'kota_penandatangan', true);

  const btnSyncNPWP = document.getElementById('btn-sync-npwp');
  btnSyncNPWP?.addEventListener('click', () => {
    appState.syncMainNPWPToAllComponents();
  });

  const btnGotoInput = document.getElementById('btn-goto-input-tab');
  btnGotoInput?.addEventListener('click', () => {
    appState.setActiveTab('input');
  });
}

function attachInputListeners(): void {
  // Month selector
  document.querySelectorAll('.month-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const m = parseInt((e.currentTarget as HTMLElement).dataset.month || '1', 10);
      appState.setActiveMonth(m);
    });
  });

  // Toggle Akhir Periode
  const toggleAkhir = document.getElementById('toggle-akhir-periode') as HTMLInputElement;
  toggleAkhir?.addEventListener('change', (e) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    appState.updateBulanMetode(appState.activeMonth, isChecked, true);
  });

  // Component Currency Inputs (smooth typing with live summary update without re-rendering form inputs)
  document.querySelectorAll('.comp-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const el = e.target as HTMLInputElement;
      const comp = el.dataset.comp as any;
      const field = el.dataset.field as any;
      const parsed = parseFormattedNumber(el.value);
      appState.updateKomponen(appState.activeMonth, comp, field, parsed, false);
      updateMonthSummaryCards(appState.activeMonth);
    });

    input.addEventListener('blur', (e) => {
      const el = e.target as HTMLInputElement;
      const parsed = parseFormattedNumber(el.value);
      el.value = formatNumber(parsed);
      updateMonthSummaryCards(appState.activeMonth);
    });
  });

  // Component Text / NPWP Inputs
  document.querySelectorAll('.comp-text-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const el = e.target as HTMLInputElement;
      const comp = el.dataset.comp as any;
      const field = el.dataset.field as any;
      appState.updateKomponen(appState.activeMonth, comp, field, el.value, false);
    });
  });

  // Component Label Inputs (comp 3 & 4)
  document.querySelectorAll('.comp-label-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const el = e.target as HTMLInputElement;
      const comp = el.dataset.comp as any;
      appState.updateKomponen(appState.activeMonth, comp, 'label', el.value, false);
    });
  });

  // Copy Month Button
  const btnCopy = document.getElementById('btn-copy-month');
  btnCopy?.addEventListener('click', () => {
    appState.copyMonthToAllSubsequent(appState.activeMonth);
  });

  // Clear Month Button
  const btnClear = document.getElementById('btn-clear-month');
  btnClear?.addEventListener('click', () => {
    appState.clearMonth(appState.activeMonth);
  });

  // Recalculate Button (consumes quota count with confirmation)
  const btnRecalc = document.getElementById('btn-recalculate-tax');
  btnRecalc?.addEventListener('click', () => {
    const success = appState.recalculateTax(true);
    if (success) {
      appState.showToast('success', 'Perhitungan Berhasil', 'Pajak PPh 21 seluruh bulan telah dihitung ulang dan direkonsiliasi.');
      appState.notify();
    }
  });
}

function attachHasilListeners(): void {
  const btnGotoBpa2 = document.getElementById('btn-goto-bpa2-tab');
  btnGotoBpa2?.addEventListener('click', () => {
    appState.setActiveTab('bpa2');
  });

  // Period Switcher Tab Buttons
  document.querySelectorAll('.btn-rekonsiliasi-period').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const month = parseInt((e.currentTarget as HTMLElement).dataset.month || '0', 10);
      if (month > 0) {
        appState.setSelectedHasilRekonsiliasiMonth(month);
      }
    });
  });
}

function attachBpa2Listeners(): void {
  const selectPeriod = document.getElementById('select-bpa2-period') as HTMLSelectElement;
  selectPeriod?.addEventListener('change', (e) => {
    const val = parseInt((e.target as HTMLSelectElement).value, 10);
    appState.setSelectedBpa2PeriodMonth(val);
  });

  const selectNPWP = document.getElementById('select-bpa2-npwp') as HTMLSelectElement;
  selectNPWP?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    appState.setSelectedBpa2NPWP(val);
  });

  const inputNo = document.getElementById('input-bpa2-no') as HTMLInputElement;
  inputNo?.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value;
    const display = document.getElementById('bpa2-no-display');
    if (display) display.textContent = val;
  });

  const inputTgl = document.getElementById('input-bpa2-tgl') as HTMLInputElement;
  inputTgl?.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value;
    const display = document.getElementById('bpa2-tgl-display');
    if (display) display.textContent = val;
  });

  const btnPrint = document.getElementById('btn-print-bpa2');
  btnPrint?.addEventListener('click', () => {
    window.print();
  });

  const btnLoadDummy = document.getElementById('btn-bpa2-load-dummy');
  btnLoadDummy?.addEventListener('click', () => {
    appState.loadDummyTemplate();
  });

  const btnDownloadHtml = document.getElementById('btn-download-bpa2-html');
  btnDownloadHtml?.addEventListener('click', () => {
    const container = document.getElementById('bpa2-print-container');
    if (!container) return;
    const ap = appState.getActiveBpa2Result();
    const masaSuffix = ap ? `_Masa_${ap.kode_masa.replace(/\s+/g, '')}` : '';
    const safeName = (appState.dataset.pegawai.nama || 'ASN').replace(/[^a-zA-Z0-9_-]/g, '_');
    const title = `Formulir_1721_BPA2_${safeName}${masaSuffix}`;
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4 portrait; margin: 10mm 12mm; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; padding: 20px; }
    @media print { body { background: white; padding: 0; } }
  </style>
</head>
<body class="flex justify-center">
  <div style="max-width: 800px; width: 100%;">
    ${container.outerHTML}
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.html`;
    a.click();
    URL.revokeObjectURL(url);
    appState.showToast('success', 'File Diunduh', `Formulir BPA2 mandiri (${ap ? ap.kode_masa : ''}) telah diunduh sebagai ${a.download}.`);
  });
}

function attachFaqListeners(): void {
  // Accordion toggle
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = (e.currentTarget as HTMLElement).closest('.faq-item');
      const content = item?.querySelector('.faq-content');
      const icon = item?.querySelector('.faq-icon');

      content?.classList.toggle('hidden');
      icon?.classList.toggle('rotate-180');
    });
  });

  // FAQ search filter
  const searchInput = document.getElementById('faq-search-input') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
    document.querySelectorAll('.faq-item').forEach(item => {
      const searchData = (item as HTMLElement).dataset.search || '';
      if (!query || searchData.includes(query)) {
        (item as HTMLElement).classList.remove('hidden');
      } else {
        (item as HTMLElement).classList.add('hidden');
      }
    });
  });
}

function attachAdminListeners(): void {
  // Admin Google Login button (for non-admin users)
  const btnAdminOpenGoogle = document.getElementById('btn-admin-open-google-login');
  btnAdminOpenGoogle?.addEventListener('click', async () => {
    if (authService.getCurrentUser()) {
      await authService.signOut();
    }
    document.getElementById('modal-login')?.classList.remove('hidden');
  });

  // Form Add Admin
  const formAddAdmin = document.getElementById('form-add-admin') as HTMLFormElement;
  formAddAdmin?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('input-new-admin-email') as HTMLInputElement;
    const email = input.value.trim();
    if (email) {
      const ok = authService.addAdmin(email);
      if (ok) {
        logService.recordLog('LOGIN', `Admin menambahkan administrator baru: ${email}`);
        appState.showToast('success', 'Admin Ditambahkan', `Email ${email} sekarang memiliki akses admin.`);
        appState.notify();
      } else {
        appState.showToast('warning', 'Sudah Ada', `Email ${email} sudah berstatus admin.`);
      }
      input.value = '';
    }
  });

  // Buttons Remove Admin
  document.querySelectorAll('.btn-remove-admin').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = (e.currentTarget as HTMLElement).dataset.removeAdmin;
      if (email) {
        try {
          authService.removeAdmin(email);
          appState.showToast('info', 'Admin Dihapus', `Akses admin untuk ${email} telah dicabut.`);
          appState.notify();
        } catch (err: any) {
          appState.showToast('error', 'Gagal', err.message || 'Tidak dapat menghapus admin.');
        }
      }
    });
  });

  // Quota Resets
  const btnResetToday = document.getElementById('btn-admin-reset-quota-today');
  btnResetToday?.addEventListener('click', () => {
    quotaService.resetQuotaForToday();
    appState.showToast('success', 'Kuota Direset', 'Kuota hari ini telah dikembalikan penuh.');
    appState.notify();
  });

  const btnResetAll = document.getElementById('btn-admin-reset-all-quotas');
  btnResetAll?.addEventListener('click', () => {
    quotaService.resetAllQuotas();
    appState.showToast('success', 'Seluruh Kuota Direset', 'Semua counter kuota harian telah dibersihkan.');
    appState.notify();
  });

  // Firebase config
  const formFirebase = document.getElementById('form-firebase-config') as HTMLFormElement;
  formFirebase?.addEventListener('submit', (e) => {
    e.preventDefault();
    const apiKey = (document.getElementById('fb-api-key') as HTMLInputElement).value.trim();
    const authDomain = (document.getElementById('fb-auth-domain') as HTMLInputElement).value.trim();
    const projectId = (document.getElementById('fb-project-id') as HTMLInputElement).value.trim();
    const appId = (document.getElementById('fb-app-id') as HTMLInputElement)?.value.trim() || undefined;

    try {
      const ok = authService.saveFirebaseConfig({ apiKey, authDomain, projectId, appId });
      if (ok) {
        appState.showToast('success', 'Konfigurasi Disimpan', 'Konfigurasi Firebase lokal berhasil diperbarui dan aktif.');
        appState.notify();
      } else {
        appState.showToast('error', 'Gagal Inisialisasi', 'Konfigurasi tersimpan namun inisialisasi Firebase gagal. Periksa API Key dan Project ID.');
      }
    } catch (err: any) {
      appState.showToast('error', 'Gagal', err.message || 'Gagal menyimpan konfigurasi.');
    }
  });

  // Export CSV
  const btnExportCSV = document.getElementById('btn-admin-export-csv');
  btnExportCSV?.addEventListener('click', () => {
    const csvContent = logService.exportLogsToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Log_Aktivitas_PPh21_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    appState.showToast('success', 'CSV Diunduh', 'File riwayat log telah diekspor.');
  });

  // Clear Logs
  const btnClearLogs = document.getElementById('btn-admin-clear-logs');
  btnClearLogs?.addEventListener('click', () => {
    logService.clearLogs();
    appState.showToast('info', 'Log Dibersihkan', 'Riwayat aktivitas telah dihapus.');
    appState.notify();
  });

  // Rekap per Email search
  const inputSearchEmail = document.getElementById('input-search-rekap-email') as HTMLInputElement;
  inputSearchEmail?.addEventListener('input', (e) => {
    const term = (e.target as HTMLInputElement).value.toLowerCase().trim();
    document.querySelectorAll('.row-rekap-email').forEach(row => {
      const searchVal = (row as HTMLElement).dataset.emailSearch || '';
      (row as HTMLElement).style.display = searchVal.includes(term) ? '' : 'none';
    });
  });

  // Rekap per NIK search
  const inputSearchNik = document.getElementById('input-search-rekap-nik') as HTMLInputElement;
  inputSearchNik?.addEventListener('input', (e) => {
    const term = (e.target as HTMLInputElement).value.toLowerCase().trim();
    document.querySelectorAll('.row-rekap-nik').forEach(row => {
      const searchVal = (row as HTMLElement).dataset.nikSearch || '';
      (row as HTMLElement).style.display = searchVal.includes(term) ? '' : 'none';
    });
  });

  // Log filter
  const selectLogFilter = document.getElementById('select-log-filter') as HTMLSelectElement;
  const inputSearchLog = document.getElementById('input-search-log') as HTMLInputElement;

  const filterLogs = () => {
    const filterType = selectLogFilter?.value || 'ALL';
    const query = inputSearchLog?.value.toLowerCase().trim() || '';

    document.querySelectorAll('#admin-log-tbody tr').forEach(tr => {
      const type = (tr as HTMLElement).dataset.logType;
      const search = (tr as HTMLElement).dataset.logSearch || '';

      const matchType = filterType === 'ALL' || type === filterType;
      const matchQuery = !query || search.includes(query);

      if (matchType && matchQuery) {
        (tr as HTMLElement).style.display = '';
      } else {
        (tr as HTMLElement).style.display = 'none';
      }
    });
  };

  selectLogFilter?.addEventListener('change', filterLogs);
  inputSearchLog?.addEventListener('input', filterLogs);
}

// File Export Handler
function exportDatasetJSON(): void {
  const { dataset } = appState;
  const exportPayload = {
    ...dataset,
    exported_at: new Date().toISOString()
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (dataset.pegawai.nama || 'Data_Pegawai').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.href = url;
  a.download = `PPh21_${safeName}_${new Date().getFullYear()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  logService.recordLog('EXPORT', `Ekspor data JSON pegawai: ${dataset.pegawai.nama}`);
  appState.showToast('success', 'Ekspor Berhasil', `File ${a.download} berhasil diunduh.`);
}

// File Import Handler with Strict Validation
function handleFileImport(e: Event): void {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const rawText = event.target?.result as string;
      const parsed = JSON.parse(rawText);
      const valResult = validatePPh21Dataset(parsed);

      if (!valResult.valid) {
        showValidationErrorModal(valResult.errors);
        return;
      }

      if (valResult.sanitizedData) {
        appState.loadImportedDataset(valResult.sanitizedData);
        if (valResult.warnings.length > 0) {
          appState.showToast('warning', 'Peringatan Skema', valResult.warnings.join(' '));
        }
      }
    } catch (err: any) {
      showValidationErrorModal([`File bukan format JSON yang valid: ${err.message || 'Syntax error'}`]);
    } finally {
      // Reset input value so same file can be selected again
      input.value = '';
    }
  };

  reader.readAsText(file);
}

function showValidationErrorModal(errors: string[]): void {
  const modal = document.getElementById('modal-validation-error');
  const list = document.getElementById('validation-error-list');
  if (modal && list) {
    list.innerHTML = errors.map(err => `<div class="py-1 border-b border-rose-100 last:border-none">&bull; ${err}</div>`).join('');
    modal.classList.remove('hidden');
  }
}

// Subscribe to state updates for view-changing actions
appState.subscribe(() => {
  renderApp();
});

// Subscribe to toast updates independently so main form DOM is never rebuilt when a toast appears!
appState.subscribeToast(() => {
  updateToastContainerUI();
});

// Initial mount
renderApp();
