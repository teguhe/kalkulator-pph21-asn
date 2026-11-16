import { appState } from '../state/appState';
import { formatRupiah, formatNumber } from '../utils/formatters';

export function renderInputPenghasilanView(): string {
  const { dataset, activeMonth, calculation } = appState;
  const currentMonthData = dataset.periode_bulanan[activeMonth - 1];
  const kp = currentMonthData.komponen_penghasilan;
  const monthCalc = calculation.hasil_bulanan[activeMonth - 1];

  // Month navigation buttons
  const monthButtonsHtml = dataset.periode_bulanan.map(m => {
    const isCurrent = m.bulan === activeMonth;
    const isAkhir = m.is_akhir_periode || m.metode_perhitungan === 'AKHIR_PERIODE';
    const mCalc = calculation.hasil_bulanan[m.bulan - 1];
    const hasData = mCalc && mCalc.bruto_total > 0;

    let baseClass = "flex flex-col items-center justify-center py-2 px-3 rounded-xl border text-xs font-semibold transition-all relative";
    if (isCurrent) {
      baseClass += " bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/30";
    } else if (hasData) {
      baseClass += " bg-white text-slate-800 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50";
    } else {
      baseClass += " bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600";
    }

    const shortName = m.nama_bulan.slice(0, 3);
    const akhirBadge = isAkhir 
      ? `<span class="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-bold rounded-full shadow-xs">Akhir</span>` 
      : '';

    return `
      <button data-month="${m.bulan}" class="month-tab-btn ${baseClass}">
        ${akhirBadge}
        <span class="text-[10px] uppercase font-bold tracking-wider">${shortName}</span>
        <span data-month-chip="${m.bulan}" class="text-[11px] font-mono mt-0.5">${hasData ? formatNumber(mCalc.bruto_total / 1000000) + 'jt' : '-'}</span>
      </button>
    `;
  }).join('');

  // Month summary badges
  const brutoTotal = monthCalc ? monthCalc.bruto_total : 0;
  const pajakSudahDipotong = monthCalc ? monthCalc.pajak_sudah_dipotong : 0;
  const pphTerutang = monthCalc ? monthCalc.pph21_terutang : 0;
  const selisih = monthCalc ? monthCalc.selisih : 0;
  const isAkhir = currentMonthData.is_akhir_periode || currentMonthData.metode_perhitungan === 'AKHIR_PERIODE';

  return `
    <div class="space-y-6">
      <!-- 12-Month Selector Strip -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-sm font-bold text-slate-800">Pilih Bulan Masa Pajak (Januari s.d. Desember)</h3>
          </div>
          <div class="text-xs text-slate-500 hidden sm:block">
            Klik bulan untuk mengedit rincian penghasilan
          </div>
        </div>

        <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          ${monthButtonsHtml}
        </div>
      </div>

      <!-- Active Month Editor Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <!-- Card Header with Month Title and Akhir Periode Toggle -->
        <div class="bg-slate-900 text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                Form 2 (Perhitungan PPh 21 Setahun) &bull; Bulan ${currentMonthData.bulan} / 12
              </span>
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white">Form 2: Input Masa Pajak ${currentMonthData.nama_bulan}</h2>
            </div>
            <p class="text-xs text-slate-300">
              Input 4 komponen penghasilan bruto, pajak yang telah dipotong, dan NPWP bendahara pemotong.
            </p>
          </div>

          <!-- Method Selector (TER Bulanan vs Akhir Periode) -->
          <div class="flex items-center gap-3 bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl shrink-0">
            <div class="text-right">
              <div class="text-xs font-semibold text-slate-200">Metode Perhitungan:</div>
              <div id="header-method-indicator" class="text-[11px] text-emerald-400 font-mono">${isAkhir ? 'AKHIR PERIODE (Pasal 17)' : `TER KATEGORI ${dataset.pegawai.kategori_ter}`}</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="toggle-akhir-periode" class="sr-only peer" ${isAkhir ? 'checked' : ''}>
              <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
            <span id="header-method-text" class="text-xs font-bold ${isAkhir ? 'text-amber-400' : 'text-slate-400'}">
              ${isAkhir ? 'Akhir Periode' : 'TER Bulanan'}
            </span>
          </div>
        </div>

        <!-- Month Summary Bar -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-slate-50 border-b border-slate-200">
          <div class="bg-white p-3.5 rounded-xl border border-slate-200">
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Bruto Bulan Ini</div>
            <div id="summary-month-bruto" class="text-base sm:text-lg font-bold text-slate-900">${formatRupiah(brutoTotal)}</div>
            <div class="text-[11px] text-slate-500 mt-0.5">Gabungan 4 komponen</div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200">
            <div id="summary-month-rate-label" class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              ${isAkhir ? 'Metode Pajak' : 'Tarif TER Bulan Ini'}
            </div>
            <div id="summary-month-rate" class="text-base sm:text-lg font-bold text-emerald-700">
              ${isAkhir ? 'Pasal 17 Tahunan' : `${monthCalc?.ter_rate ?? 0}% (Kategori ${dataset.pegawai.kategori_ter})`}
            </div>
            <div id="summary-month-rate-sub" class="text-[11px] text-slate-500 mt-0.5">${isAkhir ? 'Rekonsiliasi kumulatif' : 'PP 58/2023'}</div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200">
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">PPh 21 Terutang Seharusnya</div>
            <div id="summary-month-pph" class="text-base sm:text-lg font-bold text-blue-700">${formatRupiah(pphTerutang)}</div>
            <div id="summary-month-dipotong" class="text-[11px] text-slate-500 mt-0.5">Sudah dipotong: ${formatRupiah(pajakSudahDipotong)}</div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200">
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Selisih Bulan Ini</div>
            <div id="summary-month-selisih" class="text-base sm:text-lg font-bold ${selisih > 0 ? 'text-rose-600' : selisih < 0 ? 'text-amber-600' : 'text-emerald-600'}">
              ${selisih > 0 ? `+${formatRupiah(selisih)}` : formatRupiah(selisih)}
            </div>
            <div id="summary-month-selisih-status" class="text-[11px] font-semibold ${selisih > 0 ? 'text-rose-500' : selisih < 0 ? 'text-amber-500' : 'text-emerald-500'} mt-0.5">
              ${selisih > 0 ? 'Kurang Bayar / Potong' : selisih < 0 ? 'Lebih Bayar / Potong' : 'Sesuai (Nihil)'}
            </div>
          </div>
        </div>

        <!-- 4 Komponen Penghasilan Form -->
        <div class="p-6 space-y-6">
          <!-- Komponen 1: Gaji Plus Tunjangan Melekat -->
          <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-slate-300 transition">
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <h4 class="text-sm font-bold text-slate-900">${kp.penghasilan_1.label || 'Gaji Plus Tunjangan Melekat'}</h4>
                <span class="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">Dasar Iuran Pensiun</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Penghasilan Bruto (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input type="text" data-comp="penghasilan_1" data-field="bruto" value="${formatNumber(kp.penghasilan_1.bruto)}" 
                    class="comp-input w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Pajak Sudah Dipotong di Slip (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input type="text" data-comp="penghasilan_1" data-field="pajak_dipotong" value="${formatNumber(kp.penghasilan_1.pajak_dipotong)}" 
                    class="comp-input w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NPWP Bendahara Pemotong</label>
                <input type="text" data-comp="penghasilan_1" data-field="npwp_bendahara" value="${kp.penghasilan_1.npwp_bendahara || dataset.pegawai.instansi.npwp_instansi_utama || ''}" placeholder="NPWP Bendahara Gaji" 
                  class="comp-text-input w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>
            </div>
          </div>

          <!-- Komponen 2: TPP / Tunjangan Tambahan Penghasilan -->
          <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-slate-300 transition">
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <h4 class="text-sm font-bold text-slate-900">${kp.penghasilan_2.label || 'Tunjangan Tambahan Penghasilan (TPP)'}</h4>
                <span class="text-[11px] text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-medium">Tukin / TPP</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Penghasilan Bruto TPP (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input type="text" data-comp="penghasilan_2" data-field="bruto" value="${formatNumber(kp.penghasilan_2.bruto)}" 
                    class="comp-input w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Pajak Sudah Dipotong di Slip TPP (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input type="text" data-comp="penghasilan_2" data-field="pajak_dipotong" value="${formatNumber(kp.penghasilan_2.pajak_dipotong)}" 
                    class="comp-input w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NPWP Bendahara Pemotong</label>
                <input type="text" data-comp="penghasilan_2" data-field="npwp_bendahara" value="${kp.penghasilan_2.npwp_bendahara || dataset.pegawai.instansi.npwp_instansi_utama || ''}" placeholder="NPWP Bendahara TPP" 
                  class="comp-text-input w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>
            </div>
          </div>

          <!-- Komponen 3: Penghasilan Lainnya 1 (Upah Pungut, Honorarium, dll) -->
          <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-slate-300 transition">
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                <input type="text" data-comp="penghasilan_3" data-field="label" value="${kp.penghasilan_3.label || 'Penghasilan Lainnya 1 (Upah Pungut / Honor)'}" 
                  class="comp-label-input text-sm font-bold text-slate-900 bg-transparent hover:bg-white px-2 py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none transition" />
                <span class="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-medium">Honor / Upah Pungut</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Bruto (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input type="text" data-comp="penghasilan_3" data-field="bruto" value="${formatNumber(kp.penghasilan_3.bruto)}" 
                    class="comp-input w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Pajak Sudah Dipotong (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input type="text" data-comp="penghasilan_3" data-field="pajak_dipotong" value="${formatNumber(kp.penghasilan_3.pajak_dipotong)}" 
                    class="comp-input w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NPWP Bendahara Pemotong</label>
                <input type="text" data-comp="penghasilan_3" data-field="npwp_bendahara" value="${kp.penghasilan_3.npwp_bendahara || ''}" placeholder="NPWP Bendahara Pemotong" 
                  class="comp-text-input w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>
            </div>
          </div>

          <!-- Komponen 4: Penghasilan Lainnya 2 (Honorarium Lintas OPD) -->
          <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-slate-300 transition">
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                <input type="text" data-comp="penghasilan_4" data-field="label" value="${kp.penghasilan_4.label || 'Penghasilan Lainnya 2 (Honor Lintas OPD)'}" 
                  class="comp-label-input text-sm font-bold text-slate-900 bg-transparent hover:bg-white px-2 py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none transition" />
                <span class="text-[11px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded font-medium">Lintas OPD / Luar Instansi</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Bruto (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input type="text" data-comp="penghasilan_4" data-field="bruto" value="${formatNumber(kp.penghasilan_4.bruto)}" 
                    class="comp-input w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Pajak Sudah Dipotong (Rp)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input type="text" data-comp="penghasilan_4" data-field="pajak_dipotong" value="${formatNumber(kp.penghasilan_4.pajak_dipotong)}" 
                    class="comp-input w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NPWP Bendahara Pemotong (Lintas OPD)</label>
                <input type="text" data-comp="penghasilan_4" data-field="npwp_bendahara" value="${kp.penghasilan_4.npwp_bendahara || ''}" placeholder="Contoh: 009876543505000" 
                  class="comp-text-input w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Tools & Actions -->
        <div class="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button id="btn-copy-month" class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg transition shadow-xs">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <span>Salin Bulan Ini ke Bulan Berikutnya</span>
            </button>
            <button id="btn-clear-month" class="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              <span>Kosongkan Bulan</span>
            </button>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button id="btn-recalculate-tax" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              <span>Hitung Ulang & Rekonsiliasi Pajak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
