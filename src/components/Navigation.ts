import { appState } from '../state/appState';

export function renderNavigation(): string {
  const { activeTab, currentUser } = appState;

  // Hanya tampilkan jika sudah login dan sedang membuka menu Perhitungan PPh 21 Setahun (Form 1 s/d 4)
  if (!currentUser || !['pegawai', 'input', 'hasil', 'bpa2'].includes(activeTab)) {
    return '';
  }

  // Form 1 sampai 4 diberi nama "perhitungan pph21 setahun"
  const tabs = [
    {
      id: 'pegawai',
      step: 'Form 1',
      label: 'Data Pegawai & Instansi',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
    },
    {
      id: 'input',
      step: 'Form 2',
      label: 'Input Penghasilan (12 Bulan)',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
    },
    {
      id: 'hasil',
      step: 'Form 3',
      label: 'Hasil & Rekonsiliasi',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`
    },
    {
      id: 'bpa2',
      step: 'Form 4',
      label: 'Cetak Bukti Potong 1721-BPA2',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>`
    }
  ];

  const tabsHtml = tabs.map(tab => {
    const isActive = activeTab === tab.id;
    const baseClasses = "flex items-center gap-2 py-2 px-3 font-semibold text-xs rounded-xl transition-all shrink-0 cursor-pointer";
    const activeClasses = isActive
      ? "bg-emerald-600 text-white shadow-xs"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200";

    return `
      <button data-tab="${tab.id}" class="tab-button ${baseClasses} ${activeClasses}">
        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'}">${tab.step}</span>
        ${tab.icon}
        <span>${tab.label}</span>
      </button>
    `;
  }).join('');

  return `
    <div class="mb-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs no-print space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-100 text-teal-800">
              Form 1 s/d 4 Terpadu
            </span>
            <h2 class="text-sm sm:text-base font-bold text-slate-900">Perhitungan PPh 21 Setahun</h2>
          </div>
          <p class="text-[11px] text-slate-500 mt-0.5">
            Siklus lengkap 12 bulan: Identitas Pegawai, Input Penghasilan, Rekonsiliasi Pasal 17, dan Generator 1721-BPA2
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 overflow-x-auto pb-0.5">
        ${tabsHtml}
      </div>
    </div>
  `;
}
