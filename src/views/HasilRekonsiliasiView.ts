import { appState } from '../state/appState';
import { formatRupiah, formatNumber } from '../utils/formatters';

export function renderHasilRekonsiliasiView(): string {
  const { calculation, dataset } = appState;
  const akhir = appState.getActiveHasilRekonsiliasiResult();
  const daftarAkhir = calculation.daftar_akhir_periode || [];

  const totalBruto = calculation.total_bruto_setahun;
  const totalDipotong = calculation.total_pajak_dipotong_setahun;
  const totalTerutang = calculation.total_pph21_terutang_setahun;
  const selisihTahunan = calculation.total_selisih_setahun;

  const isKurangBayar = selisihTahunan > 0;
  const isLebihBayar = selisihTahunan < 0;
  const isNihil = selisihTahunan === 0;

  let statusBadgeHtml = '';
  if (isKurangBayar) {
    statusBadgeHtml = `
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs sm:text-sm">
        <svg class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        Status: KURANG POTONG (Kurang Bayar)
      </div>
    `;
  } else if (isLebihBayar) {
    statusBadgeHtml = `
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs sm:text-sm">
        <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Status: LEBIH POTONG (Lebih Bayar)
      </div>
    `;
  } else {
    statusBadgeHtml = `
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs sm:text-sm">
        <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        Status: NIHIL (Tepat Sesuai)
      </div>
    `;
  }

  // Monthly table rows
  const monthlyRowsHtml = calculation.hasil_bulanan.map(m => {
    const isAkhir = m.is_akhir_periode;
    const apMatch = daftarAkhir.find(p => p.bulan_akhir === m.bulan);
    const diff = m.selisih;
    const diffClass = diff > 0 ? 'text-rose-600 font-bold' : diff < 0 ? 'text-amber-600 font-bold' : 'text-slate-500';

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 ${isAkhir ? 'bg-amber-50/40 font-semibold' : ''}">
        <td class="py-3 px-4 text-xs">
          <div class="font-bold text-slate-800">${m.nama_bulan}</div>
          ${isAkhir ? `<span class="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded font-bold">Akhir Periode (${apMatch ? apMatch.kode_masa : 'Masa ' + m.bulan})</span>` : ''}
        </td>
        <td class="py-3 px-4 text-xs font-mono text-right text-slate-900">${formatRupiah(m.bruto_total)}</td>
        <td class="py-3 px-4 text-xs font-mono text-right text-slate-700">${formatRupiah(m.pajak_sudah_dipotong)}</td>
        <td class="py-3 px-4 text-xs text-center">
          ${isAkhir 
            ? `<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Pasal 17 (${apMatch ? apMatch.kode_masa : 'Tahunan'})</span>` 
            : `<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">TER ${m.ter_rate}%</span>`}
        </td>
        <td class="py-3 px-4 text-xs font-mono text-right text-blue-700 font-bold">${formatRupiah(m.pph21_terutang)}</td>
        <td class="py-3 px-4 text-xs font-mono text-right ${diffClass}">
          ${diff > 0 ? `+${formatRupiah(diff)}` : formatRupiah(diff)}
        </td>
      </tr>
    `;
  }).join('');

  // Pasal 17 layers breakdown
  const layersHtml = akhir ? akhir.lapisan_breakdown.map(l => {
    return `
      <tr class="border-b border-slate-100 text-xs">
        <td class="py-2.5 px-3 font-semibold text-slate-800">Lapisan ${l.lapisan} (${l.tarif}%)</td>
        <td class="py-2.5 px-3 text-slate-600">${l.rentang}</td>
        <td class="py-2.5 px-3 text-right font-mono text-slate-800">${formatRupiah(l.pkp_lapisan)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${formatRupiah(l.pajak_lapisan)}</td>
      </tr>
    `;
  }).join('') : '';

  // Split withholding table rows
  const splitWithholdingRowsHtml = calculation.rekap_bendahara.map(r => {
    return `
      <tr class="border-b border-slate-100 text-xs hover:bg-slate-50 transition">
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${r.nama_keterangan}</div>
          <div class="font-mono text-[11px] text-slate-500">${r.npwp_bendahara}</div>
        </td>
        <td class="py-3 px-4 text-slate-600">
          <div class="flex flex-wrap gap-1">
            ${r.daftar_komponen.map(c => `<span class="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700 border border-slate-200">${c}</span>`).join('')}
          </div>
        </td>
        <td class="py-3 px-4 text-right font-mono font-semibold text-slate-900">${formatRupiah(r.total_bruto)}</td>
        <td class="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">${r.persentase_bruto.toFixed(1)}%</td>
        <td class="py-3 px-4 text-right font-mono font-bold text-emerald-700">${formatRupiah(r.total_pajak_dipotong)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-6">
      <!-- Top Summary Header -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Form 3 (Perhitungan PPh 21 Setahun)
              </span>
              <span class="text-xs text-slate-500 font-mono">Tahun Pajak ${new Date().getFullYear()}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Form 3: Hasil Rekonsiliasi &amp; Perhitungan Akhir Periode
            </h2>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Pegawai: <strong>${dataset.pegawai.nama || 'Tanpa Nama'}</strong> | Status PTKP: <strong>${dataset.pegawai.status_ptkp}</strong> (TER Kategori ${dataset.pegawai.kategori_ter})
            </p>
          </div>

          <div class="shrink-0">
            ${statusBadgeHtml}
          </div>
        </div>

        <!-- 4 Grand Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Penghasilan Bruto</div>
            <div class="text-lg sm:text-xl font-bold text-slate-900">${formatRupiah(totalBruto)}</div>
            <div class="text-[11px] text-slate-500 mt-1">Gaji, TPP & Honorarium 12 Bulan</div>
          </div>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pajak Sudah Dipotong</div>
            <div class="text-lg sm:text-xl font-bold text-slate-800">${formatRupiah(totalDipotong)}</div>
            <div class="text-[11px] text-slate-500 mt-1">Akumulasi bukti potong/slip</div>
          </div>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">PPh 21 Terutang Setahun</div>
            <div class="text-lg sm:text-xl font-bold text-blue-700">${formatRupiah(totalTerutang)}</div>
            <div class="text-[11px] text-blue-600 mt-1">Tarif Progresif Pasal 17 UU HPP</div>
          </div>

          <div class="bg-slate-50 rounded-xl p-4 border ${isKurangBayar ? 'border-rose-300 bg-rose-50/50' : isLebihBayar ? 'border-amber-300 bg-amber-50/50' : 'border-emerald-300 bg-emerald-50/50'}">
            <div class="text-[11px] font-bold uppercase tracking-wider mb-1 ${isKurangBayar ? 'text-rose-700' : isLebihBayar ? 'text-amber-700' : 'text-emerald-700'}">
              Selisih Akhir Tahun
            </div>
            <div class="text-lg sm:text-xl font-bold ${isKurangBayar ? 'text-rose-700' : isLebihBayar ? 'text-amber-700' : 'text-emerald-700'}">
              ${isKurangBayar ? `+${formatRupiah(selisihTahunan)}` : formatRupiah(selisihTahunan)}
            </div>
            <div class="text-[11px] font-semibold mt-1 ${isKurangBayar ? 'text-rose-600' : isLebihBayar ? 'text-amber-600' : 'text-emerald-600'}">
              ${isKurangBayar ? 'Kurang Dipotong (Perlu Disetor)' : isLebihBayar ? 'Lebih Dipotong (Kompensasi)' : 'Nihil (Sempurna)'}
            </div>
          </div>
        </div>
      </div>

      <!-- Narrative Explanation Card -->
      <div class="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-white mb-1">Analisis Selisih & Rekonsiliasi Fiskal PMK 168/2023</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ${isKurangBayar 
                ? `Terjadi <strong>Kurang Potong sebesar ${formatRupiah(selisihTahunan)}</strong> pada rekapitulasi akhir tahun. Hal ini terjadi karena komponen penghasilan seperti Gaji dan TPP dipotong secara terpisah oleh masing-masing bendahara dengan lapisan tarif efektif yang lebih rendah pada slip bulanan. Saat seluruh penghasilan digabungkan secara akumulatif di akhir tahun, total Penghasilan Kena Pajak (PKP) mencapai <strong>${formatRupiah(akhir?.pkp || 0)}</strong> yang menyentuh lapisan tarif progresif Pasal 17 (15% atau lebih tinggi). Selisih ini adalah penyesuaian sah yang harus diperhitungkan pada masa pajak terakhir.`
                : isLebihBayar
                ? `Terjadi <strong>Lebih Potong sebesar ${formatRupiah(Math.abs(selisihTahunan))}</strong>. Pemotongan pajak bulanan yang dilakukan sebelumnya melebihi total PPh 21 Pasal 17 terutang tahunan. Kelebihan ini dapat diperhitungkan/dikembalikan oleh bendahara pemotong.`
                : `Penghitungan pajak PPh 21 Anda <strong>Nihil (Sempurna)</strong>. Jumlah pajak yang dipotong sepanjang tahun tepat sama dengan PPh 21 Pasal 17 yang terutang.`}
              ${daftarAkhir.length > 1 ? `<br><span class="inline-block mt-2 font-semibold text-amber-300">Catatan: Terdeteksi ${daftarAkhir.length} akhir periode perhitungan pajak (${daftarAkhir.map(d => `Masa ${d.kode_masa} [${d.nama_bulan_akhir}]`).join(' dan ')}). Setiap periode memiliki rekonsiliasi Pasal 17 dan bukti potong BPA2 tersendiri. Pada periode berikutnya, Penghasilan Neto dari pemotongan sebelumnya diakumulasikan (Baris 15 Formulir BPA2) dan PPh 21 bukti sebelumnya dikreditkan (Baris 21) sesuai regulasi DJP PER-2/PJ/2024.</span>` : ''}
            </p>
          </div>
        </div>
      </div>

      <!-- Period Switcher Tabs if multiple akhir periode exist -->
      ${daftarAkhir.length > 1 ? `
        <div class="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div class="flex items-center gap-2.5">
            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs shrink-0">${daftarAkhir.length}</span>
            <div>
              <div class="text-xs font-bold text-indigo-950">Tersedia ${daftarAkhir.length} Titik Akhir Periode Rekonsiliasi Pajak</div>
              <div class="text-[11px] text-indigo-700">Pilih tab masa pajak untuk meninjau rincian perhitungan Pasal 17 periode tersebut:</div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 shrink-0">
            ${daftarAkhir.map(da => {
              const isActive = akhir && da.bulan_akhir === akhir.bulan_akhir;
              return `
                <button 
                  type="button"
                  class="btn-rekonsiliasi-period px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-700 text-white shadow-sm ring-2 ring-indigo-400' 
                      : 'bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200 shadow-xs'
                  }"
                  data-month="${da.bulan_akhir}"
                >
                  <span>Masa ${da.kode_masa} (${da.nama_bulan_mulai} - ${da.nama_bulan_akhir})</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-indigo-800 text-white' : 'bg-indigo-100 text-indigo-800'}">
                    ${da.jumlah_bulan} Bln
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Detail Rekonsiliasi Akhir Periode (Pasal 17) -->
      ${akhir ? `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">P17</span>
              <div>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Perhitungan Rinci Akhir Periode (Masa ${akhir.kode_masa}: ${akhir.nama_bulan_mulai} s.d. ${akhir.nama_bulan_akhir})
                </h3>
                <div class="text-[11px] text-slate-500">
                  Maksimal Biaya Jabatan Periode Ini: <strong>${formatRupiah(akhir.max_biaya_jabatan)}</strong> (${akhir.jumlah_bulan} bulan x Rp 500.000)
                </div>
              </div>
            </div>
            <span class="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
              Periode: ${akhir.jumlah_bulan} Bulan Kerja
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left: Pengurang, Neto, PTKP, PKP -->
            <div class="space-y-3">
              <div class="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                <span class="text-slate-600">Total Bruto Masa Ini (${akhir.jumlah_bulan} Bulan) [Baris 9]:</span>
                <span class="font-bold font-mono text-slate-900">${formatRupiah(akhir.total_bruto_akumulasi)}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                <span class="text-slate-600">Biaya Jabatan (5% maks Rp 500.000/bln x ${akhir.jumlah_bulan} bln) [Baris 10]:</span>
                <span class="font-bold font-mono text-rose-600">- ${formatRupiah(akhir.biaya_jabatan)}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                <span class="text-slate-600">Iuran Pensiun / THT (${dataset.pegawai.persen_iuran_pensiun}% dari Gaji) [Baris 11]:</span>
                <span class="font-bold font-mono text-rose-600">- ${formatRupiah(akhir.iuran_pensiun)}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-slate-200 text-xs bg-slate-50 px-2 rounded font-semibold">
                <span class="text-slate-800">Total Pengurang Bruto [Baris 13]:</span>
                <span class="font-mono text-rose-700">- ${formatRupiah(akhir.total_pengurang)}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                <span class="text-slate-700 font-semibold">Jumlah Penghasilan Neto Masa Ini (9 - 13) [Baris 14]:</span>
                <span class="font-bold font-mono text-slate-900">${formatRupiah(akhir.penghasilan_neto)}</span>
              </div>

              <!-- Baris 15: Penghasilan Neto dari Pemotongan Sebelumnya -->
              <div class="flex justify-between items-center py-2 border-b border-slate-100 text-xs ${akhir.penghasilan_neto_sebelumnya > 0 ? 'bg-amber-50/90 px-2 rounded border border-amber-300' : ''}">
                <div>
                  <span class="text-slate-800 font-bold">Penghasilan Neto dari Pemotongan Sebelumnya [Baris 15]:</span>
                  ${akhir.penghasilan_neto_sebelumnya > 0 
                    ? `<div class="text-[10px] text-amber-800 font-semibold mt-0.5">Diakumulasikan dari Bukti Potong sebelumnya dalam tahun berjalan</div>` 
                    : `<div class="text-[10px] text-slate-400 mt-0.5">Pemotongan pertama / tidak ada pemotongan sebelumnya</div>`}
                </div>
                <span class="font-bold font-mono ${akhir.penghasilan_neto_sebelumnya > 0 ? 'text-amber-950 text-sm' : 'text-slate-500'}">
                  ${akhir.penghasilan_neto_sebelumnya > 0 ? `+ ${formatRupiah(akhir.penghasilan_neto_sebelumnya)}` : 'Rp 0'}
                </span>
              </div>

              <!-- Baris 16: Jumlah Penghasilan Neto Kumulatif -->
              <div class="flex justify-between items-center py-2 border-b border-slate-200 text-xs bg-slate-100 px-2 rounded font-bold">
                <span class="text-slate-900">Jumlah Neto untuk PPh 21 (Setahun / Disetahunkan) (14 + 15) [Baris 16]:</span>
                <span class="font-mono text-slate-950">${formatRupiah(akhir.jumlah_penghasilan_neto_setahun)}</span>
              </div>

              <div class="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                <span class="text-slate-600">PTKP (${akhir.status_ptkp}) [Baris 17]:</span>
                <span class="font-bold font-mono text-slate-700">- ${formatRupiah(akhir.ptkp)}</span>
              </div>
              <div class="flex justify-between items-center py-2.5 border-t-2 border-slate-300 text-xs bg-emerald-50 px-2 rounded font-bold">
                <span class="text-emerald-900">Penghasilan Kena Pajak (PKP Dibulatkan) [Baris 18]:</span>
                <span class="font-mono text-emerald-800 text-sm">${formatRupiah(akhir.pkp)}</span>
              </div>
            </div>

            <!-- Right: Progressive Brackets Table -->
            <div>
              <div class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Penerapan Lapisan Tarif Pasal 17 UU HPP</div>
              <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table class="w-full text-left">
                  <thead class="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th class="py-2 px-3">Lapisan</th>
                      <th class="py-2 px-3">Rentang Bruto</th>
                      <th class="py-2 px-3 text-right">PKP Lapisan</th>
                      <th class="py-2 px-3 text-right">Pajak</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${layersHtml}
                  </tbody>
                  <tfoot class="bg-slate-100 font-bold text-xs border-t border-slate-200">
                    <tr>
                      <td colspan="3" class="py-2.5 px-3 text-slate-800">Total PPh 21 Terutang Setahun / Disetahunkan [Baris 19 & 20]:</td>
                      <td class="py-2.5 px-3 text-right font-mono text-blue-800 text-sm">${formatRupiah(akhir.pph21_pasal17_setahun)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div class="mt-3 p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 space-y-1.5">
                ${akhir.pph21_dipotong_sebelumnya > 0 ? `
                  <div class="flex justify-between items-center bg-amber-50 px-2 py-1.5 rounded border border-amber-300">
                    <div>
                      <span class="font-bold text-amber-950">PPh 21 Dipotong dari Bukti Pemotongan Sebelumnya [Baris 21]:</span>
                      <div class="text-[10px] text-amber-800 font-medium">Kredit pajak yang disetor pada bukti potong sebelumnya</div>
                    </div>
                    <span class="font-mono font-bold text-rose-700 text-xs">- ${formatRupiah(akhir.pph21_dipotong_sebelumnya)}</span>
                  </div>
                  <div class="flex justify-between items-center font-bold text-blue-950 bg-blue-50 px-2 py-1.5 rounded border border-blue-200">
                    <span>PPh 21 Terutang pada Bukti Pemotongan Ini (20 - 21) [Baris 22]:</span>
                    <span class="font-mono text-blue-900 text-xs">${formatRupiah(akhir.pph21_terutang_bukti_ini)}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between">
                  <span>PPh 21 yang Telah Dipotong (${akhir.bulan_mulai === akhir.bulan_akhir ? `Masa ${akhir.bulan_akhir}` : `Masa ${String(akhir.bulan_mulai).padStart(2, '0')} s.d. ${String(akhir.bulan_akhir - 1).padStart(2, '0')}`}) [Baris 23]:</span>
                  <span class="font-mono font-semibold">${formatRupiah(akhir.pajak_terutang_sebelumnya)}</span>
                </div>
                <div class="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                  <span>PPh 21 Kurang (Lebih) Dipotong Masa Terakhir (${akhir.nama_bulan_akhir}) [Baris 24]:</span>
                  <span class="font-mono text-blue-700">${formatRupiah(akhir.pph21_terutang_bulan_terakhir)}</span>
                </div>
                <div class="flex justify-between text-slate-500 pt-0.5">
                  <span>Pajak telah dipotong slip s.d. bulan ini:</span>
                  <span class="font-mono">${formatRupiah(akhir.total_pajak_sudah_dipotong_tahunan)}</span>
                </div>
                <div class="flex justify-between font-bold border-t border-slate-200 pt-1 ${akhir.selisih_tahunan > 0 ? 'text-rose-700' : akhir.selisih_tahunan < 0 ? 'text-amber-700' : 'text-emerald-700'}">
                  <span>Selisih Periode Masa ${akhir.kode_masa}:</span>
                  <span class="font-mono">${akhir.selisih_tahunan > 0 ? `+${formatRupiah(akhir.selisih_tahunan)}` : formatRupiah(akhir.selisih_tahunan)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- 12-Month Table -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs overflow-hidden">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Tabel Rekapitulasi 12 Bulan Masa Pajak</h3>
            <p class="text-xs text-slate-500">Perbandingan Bruto, Pemotongan di Slip, Tarif TER, dan Selisih Fiskal</p>
          </div>
          <button id="btn-goto-bpa2-tab" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            <span>Cetak Formulir BPA2</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th class="py-3 px-4">Masa Pajak</th>
                <th class="py-3 px-4 text-right">Penghasilan Bruto</th>
                <th class="py-3 px-4 text-right">Dipotong di Slip</th>
                <th class="py-3 px-4 text-center">Metode / TER</th>
                <th class="py-3 px-4 text-right">PPh 21 Seharusnya</th>
                <th class="py-3 px-4 text-right">Selisih</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyRowsHtml}
            </tbody>
            <tfoot class="bg-slate-100 font-bold text-xs border-t-2 border-slate-300">
              <tr>
                <td class="py-3 px-4 text-slate-900">TOTAL 1 TAHUN</td>
                <td class="py-3 px-4 text-right font-mono text-slate-900">${formatRupiah(totalBruto)}</td>
                <td class="py-3 px-4 text-right font-mono text-slate-800">${formatRupiah(totalDipotong)}</td>
                <td class="py-3 px-4 text-center text-slate-500">-</td>
                <td class="py-3 px-4 text-right font-mono text-blue-800 font-bold">${formatRupiah(totalTerutang)}</td>
                <td class="py-3 px-4 text-right font-mono ${isKurangBayar ? 'text-rose-700' : isLebihBayar ? 'text-amber-700' : 'text-emerald-700'} font-bold">
                  ${isKurangBayar ? `+${formatRupiah(selisihTahunan)}` : formatRupiah(selisihTahunan)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Split Withholding Summary (Rekapitulasi per NPWP Bendahara Pemotong) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Rekapitulasi Pemotong Pajak (Split Withholding)</h3>
            <p class="text-xs text-slate-500">Rincian kontribusi penghasilan dan pemotongan pajak berdasarkan NPWP Bendahara Pengeluaran / OPD</p>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            ${calculation.rekap_bendahara.length} Entitas Pemotong
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th class="py-3 px-4">Nama Instansi & NPWP Bendahara</th>
                <th class="py-3 px-4">Komponen Penghasilan Terkait</th>
                <th class="py-3 px-4 text-right">Total Bruto</th>
                <th class="py-3 px-4 text-right">Porsi (%)</th>
                <th class="py-3 px-4 text-right">Pajak Telah Dipotong</th>
              </tr>
            </thead>
            <tbody>
              ${splitWithholdingRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Navigation Card -->
      <div class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
            Langkah 3 dari 4
          </div>
          <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Langkah Selanjutnya</h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            Hasil rekonsiliasi dan perhitungan PPh 21 Pasal 17 telah selesai. Lanjutkan ke menu <strong>Form 4: Cetak Formulir Bukti Potong 1721-BPA2</strong> untuk mencetak formulir resmi bukti potong atau mengunduh dokumen HTML mandiri.
          </p>
        </div>
        <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <button id="btn-back-to-input-from-hasil" class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer">
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span>Input Penghasilan</span>
          </button>
          <button id="btn-goto-bpa2-bottom" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition shrink-0 cursor-pointer">
            <span>Buka Cetak Bukti Potong (BPA2)</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}
