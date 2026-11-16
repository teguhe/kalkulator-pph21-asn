import { appState } from '../state/appState';
import { PTKP_MAP } from '../../taxConstants';
import { formatNumber, formatRupiah } from '../utils/formatters';

export function renderTerBulananView(): string {
  const { dataset, terBulananInput } = appState;
  const p = dataset.pegawai;
  const ptkpInfo = PTKP_MAP[p.status_ptkp as keyof typeof PTKP_MAP] || PTKP_MAP['TK/0'];
  const calc = appState.getTerBulananCalculation();

  // Opsi PTKP Dropdown (Sama dengan Form 1)
  const ptkpOptionsHtml = Object.keys(PTKP_MAP).map(key => {
    const item = PTKP_MAP[key as keyof typeof PTKP_MAP];
    const isSelected = p.status_ptkp === key ? 'selected' : '';
    return `<option value="${key}" ${isSelected}>${key} - ${item.deskripsi} (${formatRupiah(item.nilaiTahunan)} / thn - TER ${item.kategoriTER})</option>`;
  }).join('');

  // Dropdown bulan untuk interoperabilitas dengan Form 2
  const monthOptionsHtml = dataset.periode_bulanan.map(b => {
    return `<option value="${b.bulan}">Bulan ${b.bulan} - ${b.nama_bulan}</option>`;
  }).join('');

  // Status selisih styling
  let selisihCardHtml = '';
  if (calc.selisih > 0) {
    selisihCardHtml = `
      <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-950">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0 mt-0.5">
            ⚠️
          </div>
          <div class="space-y-1.5 flex-1">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="text-sm font-bold text-amber-900 uppercase tracking-wide">
                Potensi Kurang Potong Bulanan Terdeteksi
              </h4>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-200 text-amber-900 border border-amber-300">
                Selisih: +${formatRupiah(calc.selisih)}
              </span>
            </div>
            <p class="text-xs text-amber-900/90 leading-relaxed">
              Jika pemotongan dilakukan terpisah oleh masing-masing bendahara, total pajak yang dipotong adalah <strong>${formatRupiah(calc.total_pajak_terpisah)}</strong>. Namun menurut ketentuan <strong>PP 58/2023 &amp; PMK 168/2023</strong>, seluruh penghasilan bruto yang diterima dalam satu masa pajak (1 bulan) dijumlahkan sehingga tarif TER melonjak menjadi <strong>${calc.ter_rate_gabungan}%</strong> (Pajak Terutang: <strong>${formatRupiah(calc.pajak_gabungan)}</strong>).
            </p>
            <div class="pt-2 text-xs font-semibold text-amber-950 flex items-center gap-1.5">
              <span>💡</span>
              <span>Selisih <strong>${formatRupiah(calc.selisih)}</strong> ini akan menjadi beban kurang bayar yang harus diselesaikan pada rekonsiliasi akhir tahun/Desember di menu <strong>PPh TER Setahun</strong>.</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (calc.selisih < 0) {
    selisihCardHtml = `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-blue-950">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-lg shrink-0 mt-0.5">
            ℹ️
          </div>
          <div class="space-y-1 flex-1">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="text-sm font-bold text-blue-900 uppercase tracking-wide">
                Potensi Lebih Potong Bulanan
              </h4>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-200 text-blue-900 border border-blue-300">
                Selisih: -${formatRupiah(Math.abs(calc.selisih))}
              </span>
            </div>
            <p class="text-xs text-blue-900/90 leading-relaxed">
              Total pajak pemotongan terpisah lebih besar daripada tarif gabungan bulanan.
            </p>
          </div>
        </div>
      </div>
    `;
  } else {
    selisihCardHtml = `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-emerald-950">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
            ✓
          </div>
          <div class="space-y-0.5 flex-1">
            <h4 class="text-sm font-bold text-emerald-900 uppercase tracking-wide">
              Perhitungan Sesuai &amp; Nihil Selisih
            </h4>
            <p class="text-xs text-emerald-800/90 leading-relaxed">
              Total pemotongan terpisah (${formatRupiah(calc.total_pajak_terpisah)}) identik dengan perhitungan tarif TER gabungan sebulan (${formatRupiah(calc.pajak_gabungan)}).
            </p>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-y-6">
      <!-- Title Card -->
      <div class="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Kalkulator Cepat Bulanan
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
              Perhitungan PPh 21 TER Bulanan
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Simulasi perhitungan PPh 21 bulanan berdasarkan <strong>Tarif Efektif Rata-Rata (TER)</strong> PP 58/2023 &amp; PMK 168/2023 untuk 4 komponen penghasilan ASN: perbandingan potongan masing-masing penghasilan vs. perhitungan gabungan sebulan.
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="shrink-0 flex flex-wrap items-center gap-2">
            <button id="btn-ter-dummy" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm transition-all cursor-pointer" title="Muat Data Sampel ASN">
              <svg class="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Sampel Dummy</span>
            </button>

            <button id="btn-ter-reset" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer" title="Reset Isian ke 0">
              <svg class="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Reset</span>
            </button>

            <button id="btn-ter-print" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer" title="Cetak Ringkasan">
              <svg class="w-4 h-4 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak Ringkasan</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Section 1: Data Pegawai & Status PTKP / TER (Tersinkronisasi dengan Form 1) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</span>
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Parameter Pegawai &amp; Status PTKP / TER
              </h3>
              <p class="text-[11px] text-slate-500">Data ini tersinkronisasi otomatis dengan Form 1 (Perhitungan PPh 21 Setahun)</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
              <span class="w-2 h-2 rounded-full bg-teal-500"></span>
              Kategori TER ${p.kategori_ter}
            </span>
            <button data-tab="pegawai" class="tab-button text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
              Buka Form 1 &rarr;
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Pegawai ASN</label>
            <input type="text" id="ter-pegawai-nama" value="${p.nama || ''}" placeholder="Nama Lengkap Pegawai"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">NIP Pegawai</label>
            <input type="text" id="ter-pegawai-nip" value="${p.nip || ''}" placeholder="18 Digit NIP"
              class="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 mb-1">Status PTKP (Penghasilan Tidak Kena Pajak)</label>
            <select id="ter-pegawai-ptkp" class="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
              ${ptkpOptionsHtml}
            </select>
          </div>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-800">Nilai PTKP Tahunan:</span>
            <span class="font-semibold text-emerald-700">${formatRupiah(ptkpInfo.nilaiTahunan)}</span>
            <span class="text-slate-400">(${ptkpInfo.deskripsi})</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-800">Instansi:</span>
            <span class="text-slate-700">${p.instansi?.nama_instansi || 'Instansi Pemerintah'}</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Input 4 Komponen Penghasilan Bulanan -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">2</span>
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Input 4 Komponen Penghasilan Bulanan
              </h3>
              <p class="text-[11px] text-slate-500">Masukkan nominal penghasilan bruto yang diterima dalam 1 bulan kalender</p>
            </div>
          </div>

          <!-- Interoperabilitas dengan Form 2 -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
              <select id="ter-select-month-load" class="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                ${monthOptionsHtml}
              </select>
              <button id="btn-ter-load-month" class="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs cursor-pointer" title="Muat 4 penghasilan dari bulan yang dipilih di Form 2">
                Muat dari Form 2
              </button>
            </div>

            <div class="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
              <select id="ter-select-month-copy" class="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                ${monthOptionsHtml}
              </select>
              <button id="btn-ter-copy-month" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs cursor-pointer" title="Salin 4 penghasilan ini ke bulan yang dipilih di Form 2">
                Salin ke Form 2
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Penghasilan 1: Gaji Plus Tunjangan Melekat -->
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Komponen 1
              </span>
              <span class="text-xs text-slate-500">Bendahara Gaji</span>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1">
                ${terBulananInput.penghasilan_1.nama}
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                <input type="text" id="ter-input-p1" 
                  value="${terBulananInput.penghasilan_1.bruto ? formatNumber(terBulananInput.penghasilan_1.bruto) : ''}" 
                  placeholder="0"
                  class="w-full pl-9 pr-3 py-2 text-sm font-bold font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition" />
              </div>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
              <span>Tarif TER: <strong class="text-emerald-700">${calc.items[0].ter_rate}%</strong></span>
              <span>Pajak: <strong class="text-slate-900">${formatRupiah(calc.items[0].pajak)}</strong></span>
            </div>
          </div>

          <!-- Penghasilan 2: TPP / Tunjangan Kinerja -->
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                Komponen 2
              </span>
              <span class="text-xs text-slate-500">Bendahara TPP</span>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1">
                ${terBulananInput.penghasilan_2.nama}
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                <input type="text" id="ter-input-p2" 
                  value="${terBulananInput.penghasilan_2.bruto ? formatNumber(terBulananInput.penghasilan_2.bruto) : ''}" 
                  placeholder="0"
                  class="w-full pl-9 pr-3 py-2 text-sm font-bold font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition" />
              </div>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
              <span>Tarif TER: <strong class="text-teal-700">${calc.items[1].ter_rate}%</strong></span>
              <span>Pajak: <strong class="text-slate-900">${formatRupiah(calc.items[1].pajak)}</strong></span>
            </div>
          </div>

          <!-- Penghasilan 3: Penghasilan Lainnya 1 -->
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                Komponen 3
              </span>
              <span class="text-xs text-slate-500">Honorarium / Upah Pungut</span>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1">
                ${terBulananInput.penghasilan_3.nama}
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                <input type="text" id="ter-input-p3" 
                  value="${terBulananInput.penghasilan_3.bruto ? formatNumber(terBulananInput.penghasilan_3.bruto) : ''}" 
                  placeholder="0"
                  class="w-full pl-9 pr-3 py-2 text-sm font-bold font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition" />
              </div>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
              <span>Tarif TER: <strong class="text-indigo-700">${calc.items[2].ter_rate}%</strong></span>
              <span>Pajak: <strong class="text-slate-900">${formatRupiah(calc.items[2].pajak)}</strong></span>
            </div>
          </div>

          <!-- Penghasilan 4: Penghasilan Lainnya 2 -->
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                Komponen 4
              </span>
              <span class="text-xs text-slate-500">Honor Lintas OPD / Pokja</span>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1">
                ${terBulananInput.penghasilan_4.nama}
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                <input type="text" id="ter-input-p4" 
                  value="${terBulananInput.penghasilan_4.bruto ? formatNumber(terBulananInput.penghasilan_4.bruto) : ''}" 
                  placeholder="0"
                  class="w-full pl-9 pr-3 py-2 text-sm font-bold font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition" />
              </div>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
              <span>Tarif TER: <strong class="text-amber-700">${calc.items[3].ter_rate}%</strong></span>
              <span>Pajak: <strong class="text-slate-900">${formatRupiah(calc.items[3].pajak)}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Tabel Rincian Perhitungan Masing-Masing Penghasilan -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">3</span>
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Hasil Perhitungan Masing-Masing Penghasilan (Pemotongan Terpisah)
              </h3>
              <p class="text-[11px] text-slate-500">Kalkulasi tarif TER (%) dan nominal pajak jika masing-masing penghasilan dipotong secara mandiri oleh bendahara terkait</p>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th class="py-2.5 px-3">Komponen Penghasilan</th>
                <th class="py-2.5 px-3">Keterangan / Bendahara</th>
                <th class="py-2.5 px-3 text-right">Penghasilan Bruto</th>
                <th class="py-2.5 px-3 text-center">Tarif TER (%)</th>
                <th class="py-2.5 px-3 text-right">Nominal Pajak PPh 21</th>
                <th class="py-2.5 px-3 text-right">Penghasilan Netto</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              ${calc.items.map((item, idx) => `
                <tr class="hover:bg-slate-50/60">
                  <td class="py-2.5 px-3 font-semibold text-slate-800">
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">${idx + 1}</span>
                      <span>${item.nama}</span>
                    </div>
                  </td>
                  <td class="py-2.5 px-3 text-slate-500">${item.keterangan || '-'}</td>
                  <td class="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">${formatRupiah(item.bruto)}</td>
                  <td class="py-2.5 px-3 text-center">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.ter_rate > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }">
                      ${item.ter_rate}%
                    </span>
                  </td>
                  <td class="py-2.5 px-3 text-right font-mono font-bold ${item.pajak > 0 ? 'text-rose-700' : 'text-slate-500'}">
                    ${formatRupiah(item.pajak)}
                  </td>
                  <td class="py-2.5 px-3 text-right font-mono text-slate-700 font-semibold">
                    ${formatRupiah(item.netto)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                <td colspan="2" class="py-3 px-3 uppercase text-[11px] tracking-wider text-slate-700">
                  Total Pemotongan Terpisah (Akumulasi Masing-Masing)
                </td>
                <td class="py-3 px-3 text-right font-mono text-sm text-emerald-800">
                  ${formatRupiah(calc.total_bruto_terpisah)}
                </td>
                <td class="py-3 px-3 text-center text-slate-400">-</td>
                <td class="py-3 px-3 text-right font-mono text-sm text-rose-700">
                  ${formatRupiah(calc.total_pajak_terpisah)}
                </td>
                <td class="py-3 px-3 text-right font-mono text-sm text-slate-900">
                  ${formatRupiah(calc.total_netto_terpisah)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Section 4: Hasil Perhitungan Pajak Ketika Keempat Penghasilan Digabung -->
      <div class="bg-linear-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10 gap-2">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs">4</span>
            <div>
              <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                Hasil Perhitungan Pajak Ketika Keempat Penghasilan Digabung
              </h3>
              <p class="text-[11px] text-slate-300">Penghitungan PPh 21 TER atas total penghasilan bruto sebulan sesuai PP 58/2023 &amp; PMK 168/2023</p>
            </div>
          </div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
            Kategori TER ${p.kategori_ter} (${p.status_ptkp})
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Bruto Sebulan -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bruto Sebulan (Gabungan)</div>
            <div class="text-xl sm:text-2xl font-extrabold text-white font-mono">
              ${formatRupiah(calc.bruto_sebulan)}
            </div>
            <div class="text-[10px] text-emerald-400">Total akumulasi 4 penghasilan</div>
          </div>

          <!-- Persen Pajak (Tarif TER Gabungan) -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Persen Pajak (Tarif TER)</div>
            <div class="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
              ${calc.ter_rate_gabungan}%
            </div>
            <div class="text-[10px] text-slate-300">Berdasarkan Tabel Kategori ${p.kategori_ter}</div>
          </div>

          <!-- Nominal Pajak Terutang -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nominal Pajak PPh 21</div>
            <div class="text-xl sm:text-2xl font-extrabold text-rose-300 font-mono">
              ${formatRupiah(calc.pajak_gabungan)}
            </div>
            <div class="text-[10px] text-slate-300 font-mono">${formatRupiah(calc.bruto_sebulan)} &times; ${calc.ter_rate_gabungan}%</div>
          </div>

          <!-- Penghasilan Netto Gabungan -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Netto Setelah Pajak</div>
            <div class="text-xl sm:text-2xl font-extrabold text-teal-300 font-mono">
              ${formatRupiah(calc.netto_gabungan)}
            </div>
            <div class="text-[10px] text-slate-300">Bruto sebulan dikurangi pajak</div>
          </div>
        </div>
      </div>

      <!-- Section 5: Analisis Komparasi Selisih (Terpisah vs Gabungan Sebulan) -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span class="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">5</span>
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Analisis &amp; Komparasi Selisih (Terpisah vs Gabungan)
              </h3>
              <p class="text-[11px] text-slate-500">Perbandingan antara potongan riil oleh masing-masing bendahara dengan pajak terutang seharusnya</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs font-semibold text-slate-500 mb-1">A. Pajak Dipotong Terpisah</div>
              <div class="text-lg font-bold text-slate-800 font-mono">${formatRupiah(calc.total_pajak_terpisah)}</div>
              <p class="text-[11px] text-slate-500 mt-1">Total potongan oleh 4 bendahara/kegiatan secara parsial</p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs font-semibold text-slate-500 mb-1">B. Pajak Terutang Gabungan Sebulan</div>
              <div class="text-lg font-bold text-rose-700 font-mono">${formatRupiah(calc.pajak_gabungan)}</div>
              <p class="text-[11px] text-slate-500 mt-1">Sesuai PP 58/2023 atas total bruto ${formatRupiah(calc.bruto_sebulan)}</p>
            </div>

            <div class="p-4 rounded-xl ${calc.selisih > 0 ? 'bg-amber-50 border border-amber-300' : 'bg-emerald-50 border border-emerald-300'}">
              <div class="text-xs font-semibold ${calc.selisih > 0 ? 'text-amber-800' : 'text-emerald-800'} mb-1">
                Selisih (B - A)
              </div>
              <div class="text-lg font-bold font-mono ${calc.selisih > 0 ? 'text-amber-900' : 'text-emerald-900'}">
                ${calc.selisih > 0 ? '+' : ''}${formatRupiah(calc.selisih)}
              </div>
              <p class="text-[11px] ${calc.selisih > 0 ? 'text-amber-700' : 'text-emerald-700'} mt-1">
                ${calc.selisih > 0 ? 'Potensi kurang potong bulanan' : calc.selisih === 0 ? 'Pemotongan telah sesuai nihil' : 'Potensi lebih potong'}
              </p>
            </div>
          </div>

          ${selisihCardHtml}
        </div>
      </div>
    </div>
  `;
}
