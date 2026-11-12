import { appState } from '../state/appState';

export function renderNavigation(): string {
  const { activeTab, currentUser } = appState;

  const tabs = [
    {
      id: 'pegawai',
      label: 'Data Pegawai & Instansi',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
    },
    {
      id: 'input',
      label: 'Input Penghasilan (12 Bulan)',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
    },
    {
      id: 'hasil',
      label: 'Hasil & Rekonsiliasi',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`
    },
    {
      id: 'bpa2',
      label: 'Cetak Bukti Potong 1721-BPA2',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>`
    },
    {
      id: 'faq',
      label: 'Pusat Bantuan & FAQ',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
    {
      id: 'admin',
      label: 'Dashboard Admin',
      icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
      isAdminTab: true
    }
  ];

  const tabsHtml = tabs.map(tab => {
    const isActive = activeTab === tab.id;
    const baseClasses = "flex items-center gap-2 py-3.5 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all shrink-0 cursor-pointer";
    const activeClasses = isActive
      ? "border-emerald-600 text-emerald-700 bg-emerald-50/40"
      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300";

    const adminBadge = tab.isAdminTab && currentUser?.isAdmin 
      ? '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>' 
      : '';

    return `
      <button data-tab="${tab.id}" class="tab-button ${baseClasses} ${activeClasses}">
        ${tab.icon}
        <span>${tab.label}</span>
        ${adminBadge}
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
