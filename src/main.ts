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

function renderApp(): void {
  let contentHtml = '';
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
            <strong>Kalkulator PPh 21 & Generator BPA2 Pegawai ASN/PNS</strong> &copy; ${new Date().getFullYear()}
          </div>
          <div class="flex items-center gap-4 text-slate-600">
            <span>PP 58/2023 & PMK 168/2023</span>
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
        appState.setActiveTab(target as any);
      }
    });
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

  btnOpenLogin?.addEventListener('click', openLogin);
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

  // Quick Login Buttons in Modal
  document.querySelectorAll('.btn-quick-login').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const email = (e.currentTarget as HTMLElement).dataset.quickLogin;
      closeLogin();
      await authService.signInWithGoogleMock(email);
      logService.recordLog('LOGIN', `Login sukses menggunakan akun: ${email}`);
      appState.showToast('success', 'Login Berhasil', `Masuk sebagai ${email}.`);
    });
  });

  // Custom Login Form
  const formCustomLogin = document.getElementById('form-custom-login') as HTMLFormElement;
  formCustomLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('input-login-email') as HTMLInputElement).value;
    const name = (document.getElementById('input-login-name') as HTMLInputElement).value;
    closeLogin();
    await authService.signInWithGoogleMock(email, name);
    logService.recordLog('LOGIN', `Login sukses menggunakan akun kustom: ${email}`);
    appState.showToast('success', 'Login Berhasil', `Masuk sebagai ${email} (+25 Kuota Harian).`);
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
  bindText('pegawai-pangkat', 'pangkat_golongan');
  bindText('pegawai-jabatan', 'jabatan');

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
}

function attachBpa2Listeners(): void {
  const selectNPWP = document.getElementById('select-bpa2-npwp') as HTMLSelectElement;
  selectNPWP?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    appState.setSelectedBpa2NPWP(val);
  });

  const btnPrint = document.getElementById('btn-print-bpa2');
  btnPrint?.addEventListener('click', () => {
    window.print();
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
  // Super admin login buttons
  const btnLoginSuper1 = document.getElementById('btn-admin-login-super1');
  const btnLoginSuper2 = document.getElementById('btn-admin-login-super2');

  const loginSuper = async (email: string) => {
    await authService.signInWithGoogleMock(email);
    logService.recordLog('LOGIN', `Login Admin: ${email}`);
    appState.showToast('success', 'Akses Admin Terbuka', `Masuk sebagai ${email}.`);
  };

  btnLoginSuper1?.addEventListener('click', () => loginSuper('teguhe@gmail.com'));
  btnLoginSuper2?.addEventListener('click', () => loginSuper('teguhe2@gmail.com'));

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

    authService.saveFirebaseConfig({ apiKey, authDomain, projectId });
    appState.showToast('success', 'Konfigurasi Disimpan', 'Konfigurasi Firebase lokal berhasil diperbarui.');
    appState.notify();
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
