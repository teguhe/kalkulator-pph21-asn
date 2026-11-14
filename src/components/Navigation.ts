import { appState } from '../state/appState';

export function renderNavigation(): string {
  const { activeTab, currentUser } = appState;

  // Jika belum login, bilah navigasi di atas tidak ditampilkan
  if (!currentUser) {
    return '';
  }

  // 4 Tab Murni Alur Perhitungan (Stepper Workflow)
  const tabs = [
    {
      id: 'pegawai',
      step: '1',
      label: 'Data Pegawai & Instansi',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
    },
    {
      id: 'input',
      step: '2',
      label: 'Input Penghasilan (12 Bulan)',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
    },
    {
      id: 'hasil',
      step: '3',
      label: 'Hasil & Rekonsiliasi',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`
    },
    {
      id: 'bpa2',
      step: '4',
      label: 'Cetak Bukti Potong 1721-BPA2',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>`
    }
  ];

  const tabsHtml = tabs.map(tab => {
    const isActive = activeTab === tab.id;
    const baseClasses = "flex items-center gap-2 py-3 px-3.5 font-semibold text-xs sm:text-sm border-b-2 transition-all shrink-0 cursor-pointer";
    const activeClasses = isActive
      ? "border-emerald-600 text-emerald-700 bg-emerald-50/40"
      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300";

    return `
      <button data-tab="${tab.id}" class="tab-button ${baseClasses} ${activeClasses}">
        <span class="w-5 h-5 rounded-full ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'} flex items-center justify-center text-[11px] font-bold shrink-0">${tab.step}</span>
        ${tab.icon}
        <span>${tab.label}</span>
      </button>
    `;
  }).join('');

  return `
    <nav class="bg-white border-b border-slate-200 no-print overflow-x-auto shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-1 sm:space-x-2">
          ${tabsHtml}
        </div>
      </div>
    </nav>
  `;
}
