import { appState } from '../state/appState';

export function renderSidebar(): string {
  const { activeTab, currentUser, isSidebarMobileOpen, quotaState } = appState;

  if (!currentUser) {
    return '';
  }

  const isSetahunActive = ['pegawai', 'input', 'hasil', 'bpa2'].includes(activeTab);

  const baseItemClass = "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer group";
  const activeClass = "bg-emerald-600 text-white shadow-xs font-semibold";
  const inactiveClass = "text-slate-700 hover:bg-slate-100 hover:text-slate-900";

  const setahunSubItems = [
    { id: 'pegawai', num: '1', label: 'Data Pegawai & Instansi' },
    { id: 'input', num: '2', label: 'Input Penghasilan (12 Bln)' },
    { id: 'hasil', num: '3', label: 'Hasil & Rekonsiliasi' },
    { id: 'bpa2', num: '4', label: 'Cetak Bukti Potong BPA2' },
  ];

  const subItemsHtml = setahunSubItems.map(sub => {
    const isSubActive = activeTab === sub.id;
    return `
      <button data-tab="${sub.id}" class="tab-button w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs transition cursor-pointer text-left ${
        isSubActive
          ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }">
        <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
          isSubActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
        }">${sub.num}</span>
        <span class="truncate">${sub.label}</span>
      </button>
    `;
  }).join('');

  return `
    <!-- Mobile Backdrop -->
    <div id="sidebar-backdrop" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity ${isSidebarMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"></div>

    <!-- Sidebar Container -->
    <aside id="app-sidebar" class="fixed md:static inset-y-0 left-0 z-50 md:z-auto w-64 md:w-60 lg:w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out shrink-0 no-print ${
      isSidebarMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
    }">
      <!-- Mobile Sidebar Header -->
      <div class="flex items-center justify-between p-4 border-b border-slate-100 md:hidden">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
            PPh
          </div>
          <span class="font-bold text-sm text-slate-800">Menu Utama</span>
        </div>
        <button id="btn-close-sidebar-mobile" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Menus -->
      <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5">
        <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigasi Utama
        </div>

        <!-- Dashboard -->
        <button data-tab="dashboard" class="tab-button w-full ${baseItemClass} ${activeTab === 'dashboard' ? activeClass : inactiveClass}">
          <svg class="w-5 h-5 shrink-0 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-left flex-1 font-medium">Dashboard</span>
        </button>

        <!-- PPh TER Bulanan -->
        <button data-tab="ter-bulanan" class="tab-button w-full ${baseItemClass} ${activeTab === 'ter-bulanan' ? activeClass : inactiveClass}">
          <svg class="w-5 h-5 shrink-0 ${activeTab === 'ter-bulanan' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div class="text-left flex-1">
            <div class="leading-tight">PPh TER Bulanan</div>
            <div class="text-[10px] ${activeTab === 'ter-bulanan' ? 'text-emerald-100' : 'text-slate-400'}">Hitung Cepat 4 Penghasilan</div>
          </div>
          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
            activeTab === 'ter-bulanan' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
          }">Baru</span>
        </button>

        <!-- PPh TER Setahun (Perhitungan PPh 21 Setahun) -->
        <div class="space-y-1 pt-1">
          <button data-tab="pegawai" class="tab-button w-full ${baseItemClass} ${isSetahunActive ? activeClass : inactiveClass}">
            <svg class="w-5 h-5 shrink-0 ${isSetahunActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div class="text-left flex-1">
              <div class="leading-tight">PPh TER Setahun</div>
              <div class="text-[10px] ${isSetahunActive ? 'text-emerald-100' : 'text-slate-400'}">Form 1 s.d. 4</div>
            </div>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
              isSetahunActive ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-700'
            }">12 Bln</span>
          </button>

          <!-- Sub-menu Form 1 s/d 4 (Perhitungan PPh 21 Setahun) -->
          <div class="pl-4 pr-1 py-1 space-y-1 bg-slate-50/70 rounded-xl border border-slate-100">
            <div class="px-2 pt-1 pb-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Form 1 s/d 4 Setahun
            </div>
            ${subItemsHtml}
          </div>
        </div>

        <!-- FAQ -->
        <div class="pt-2">
          <button data-tab="faq" class="tab-button w-full ${baseItemClass} ${activeTab === 'faq' ? activeClass : inactiveClass}">
            <svg class="w-5 h-5 shrink-0 ${activeTab === 'faq' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-left flex-1 font-medium">FAQ & Panduan</span>
          </button>
        </div>

        <!-- Admin Menu (Hanya Jika Admin) -->
        ${currentUser.isAdmin ? `
          <div class="pt-2 border-t border-slate-100">
            <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pengaturan Admin
            </div>
            <button data-tab="admin" class="tab-button w-full ${baseItemClass} ${activeTab === 'admin' ? activeClass : inactiveClass}">
              <svg class="w-5 h-5 shrink-0 ${activeTab === 'admin' ? 'text-white' : 'text-amber-500'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-left flex-1 font-medium">Dashboard Admin</span>
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Sidebar Footer (Info Kuota & Regulasi) -->
      <div class="p-3.5 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-500 font-medium">Sisa Kuota:</span>
          ${quotaState.isUnlimited 
            ? '<span class="font-bold text-emerald-600">Unlimited</span>'
            : `<span class="font-bold ${quotaState.remaining > 0 ? 'text-blue-700' : 'text-rose-600'}">${quotaState.remaining} / ${quotaState.limit}</span>`
          }
        </div>
        <div class="text-[10px] text-slate-400 leading-tight">
          Sesuai PP 58/2023 &amp; PMK 168/2023
        </div>
      </div>
    </aside>
  `;
}
