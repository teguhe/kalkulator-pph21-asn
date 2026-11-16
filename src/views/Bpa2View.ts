import { appState } from '../state/appState';
import { formatRupiah, formatNPWP, formatDateIndo, formatNumber } from '../utils/formatters';

export function renderBpa2View(): string {
  const { dataset, calculation, selectedBpa2NPWP } = appState;
  const p = dataset.pegawai;
  const akhir = appState.getActiveBpa2Result();
  const daftarAkhir = calculation.daftar_akhir_periode || [];
  const rekapList = (akhir && akhir.rekap_bendahara_periode && akhir.rekap_bendahara_periode.length > 0)
    ? akhir.rekap_bendahara_periode
    : calculation.rekap_bendahara;

  // Filter based on selected NPWP if user selects specific bendahara
  let currentPemotongTitle = p.instansi.nama_instansi || 'Dinas Komunikasi dan Informatika';
  let currentPemotongNPWP = p.instansi.npwp_instansi_utama || '001234567505000';
  let currentBendaharaNama = p.instansi.nama_bendahara_utama || 'Siti Aminah, S.E.';
  let currentBendaharaNIP = p.instansi.nip_bendahara_utama || '198808122011012003';
  let currentKota = p.instansi.kota_penandatangan || 'Salatiga';

  const isFiltered = selectedBpa2NPWP !== 'ALL';
  const filteredRekap = isFiltered ? rekapList.find(r => r.npwp_bendahara === selectedBpa2NPWP) : null;

  if (isFiltered && filteredRekap) {
    currentPemotongTitle = filteredRekap.nama_keterangan;
    currentPemotongNPWP = filteredRekap.npwp_bendahara;
  }

  const currentYear = new Date().getFullYear();
  const bulanAkhirStr = akhir ? String(akhir.bulan_akhir).padStart(2, '0') : '12';
  const kodeMasa = akhir ? akhir.kode_masa : '01 - 12';
  const nomorBpa2 = `1.1-${bulanAkhirStr}.${String(currentYear).slice(-2)}-0000108`;
  const tanggalHariIni = formatDateIndo();

  // Values specific to the selected Akhir Periode
  const brutoTotal = akhir ? akhir.total_bruto_akumulasi : calculation.total_bruto_setahun;
  const gajiTotal = akhir ? akhir.total_gaji_akumulasi : 0;
  const tppTotal = akhir ? (akhir.total_tpp_akumulasi || 0) : 0;
  const honor1Total = akhir ? (akhir.total_honor1_akumulasi || 0) : 0;
  const honor2Total = akhir ? (akhir.total_honor2_akumulasi || 0) : 0;

  const maxBiayaJabatan = akhir ? akhir.max_biaya_jabatan : 6000000;
  const biayaJabatan = akhir ? akhir.biaya_jabatan : Math.min(Math.floor(brutoTotal * 0.05), maxBiayaJabatan);
  const iuranPensiun = akhir ? akhir.iuran_pensiun : Math.floor(gajiTotal * ((p.persen_iuran_pensiun || 4.75) / 100));
  const totalPengurang = akhir ? akhir.total_pengurang : (biayaJabatan + iuranPensiun);
  const penghasilanNeto = akhir ? akhir.penghasilan_neto : Math.max(0, brutoTotal - totalPengurang);
  const ptkp = akhir ? akhir.ptkp : 67500000;
  const pkp = akhir ? akhir.pkp : Math.max(0, Math.floor((penghasilanNeto - ptkp) / 1000) * 1000);
  const pph21Setahun = akhir ? akhir.pph21_pasal17_setahun : calculation.total_pph21_terutang_setahun;
  const pph21Sebelumnya = akhir ? akhir.pajak_terutang_sebelumnya : 0;
  const pph21TerutangMasaAkhir = akhir ? akhir.pph21_terutang_bulan_terakhir : (pph21Setahun - pph21Sebelumnya);

  const isEmpty = !p.nama && brutoTotal === 0;

  // Period Options for BPA2
  const periodOptionsHtml = daftarAkhir.map(da => `
    <option value="${da.bulan_akhir}" ${(akhir && akhir.bulan_akhir === da.bulan_akhir) ? 'selected' : ''}>
      Masa ${da.kode_masa} (${da.nama_bulan_mulai} - ${da.nama_bulan_akhir}, ${da.jumlah_bulan} Bln)
    </option>
  `).join('');

  // NPWP filter options
  const npwpOptionsHtml = `
    <option value="ALL" ${selectedBpa2NPWP === 'ALL' ? 'selected' : ''}>Semua / Konsolidasi Instansi Utama</option>
    ${rekapList.map(r => `
      <option value="${r.npwp_bendahara}" ${selectedBpa2NPWP === r.npwp_bendahara ? 'selected' : ''}>
        ${r.npwp_bendahara} - ${r.nama_keterangan} (${formatRupiah(r.total_bruto)})
      </option>
    `).join('')}
  `;

  return `
    <div class="space-y-6">
      ${isEmpty ? `
        <!-- Empty State Advice Banner -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <div class="text-sm font-bold text-amber-900">Data Pegawai & Penghasilan Masih Kosong</div>
              <div class="text-xs text-amber-700">Formulir 1721-BPA2 siap dicetak setelah Anda mengisi data pegawai dan penghasilan bulanan, atau klik tombol di samping untuk memuat sampel.</div>
            </div>
          </div>
          <button id="btn-bpa2-load-dummy" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0">
            Muat Template Dummy ASN
          </button>
        </div>
      ` : ''}

      <!-- Toolbar (Cetak & Filter) - Hidden in Print -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs no-print space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-0.5">
              Form 4 (Perhitungan PPh 21 Setahun)
            </div>
            <h2 class="text-base font-bold text-slate-900">Form 4: Cetak Formulir Bukti Potong 1721-BPA2</h2>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Masa Pajak Formulir BPA2</label>
              <select id="select-bpa2-period" class="w-full px-3 py-1.5 text-xs font-bold border border-indigo-300 rounded-lg bg-indigo-50/70 text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none">
                ${periodOptionsHtml}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Entitas Pemotong Pajak</label>
              <select id="select-bpa2-npwp" class="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                ${npwpOptionsHtml}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nomor Bukti Pemotongan</label>
              <input type="text" id="input-bpa2-no" value="${nomorBpa2}" 
                class="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Kota & Tanggal Cetak</label>
              <input type="text" id="input-bpa2-tgl" value="${currentKota}, ${tanggalHariIni}" 
                class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2 lg:pt-0 shrink-0">
            <button id="btn-download-bpa2-html" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition shadow-xs cursor-pointer" title="Unduh file dokumen HTML mandiri yang siap dibuka dan dicetak kapan saja secara offline">
              <svg class="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Unduh File HTML</span>
            </button>
            <button id="btn-print-bpa2" class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak / Print PDF (A4)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Printable BPA2 Container -->
      <div id="bpa2-print-container" class="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 max-w-4xl mx-auto text-slate-900 font-sans">
        
        <!-- HEADER FORMULIR -->
        <div class="border-2 border-slate-900 p-3 mb-4">
          <div class="grid grid-cols-12 gap-2 items-center text-center">
            <div class="col-span-3 border-r-2 border-slate-900 pr-2 text-left">
              <div class="text-[10px] font-bold uppercase leading-tight text-slate-800">KEMENTERIAN KEUANGAN RI</div>
              <div class="text-[10px] font-bold uppercase leading-tight text-slate-800">DIREKTORAT JENDERAL PAJAK</div>
              <div class="text-[8px] text-slate-600 mt-1">PER-2/PJ/2024 & PMK 168/2023</div>
            </div>
            <div class="col-span-6 px-2">
              <h2 class="text-xs sm:text-sm font-extrabold uppercase tracking-tight text-slate-950">
                BUKTI PEMOTONGAN PAJAK PENGHASILAN PASAL 21
              </h2>
              <div class="text-[11px] font-bold uppercase text-slate-800">
                BAGI PEGAWAI TETAP / APARATUR SIPIL NEGARA
              </div>
              <div class="text-[10px] font-mono text-slate-600 mt-0.5">
                Masa Pajak: <strong>${kodeMasa}</strong> / Tahun Pajak: <strong>${currentYear}</strong>
              </div>
            </div>
            <div class="col-span-3 border-l-2 border-slate-900 pl-2 text-right">
              <div class="text-sm font-black text-slate-950 font-mono tracking-wider">FORMULIR 1721-BPA2</div>
              <div class="text-[8px] text-slate-600 leading-tight mt-1">Lembar ke-1 : Untuk Penerima Penghasilan</div>
              <div class="text-[8px] text-slate-600 leading-tight">Lembar ke-2 : Untuk Pemotong Pajak</div>
            </div>
          </div>
        </div>

        <!-- NOMOR BUKTI POTONG -->
        <div class="flex items-center justify-between text-xs mb-3 border-b border-slate-300 pb-2">
          <div>
            <span class="font-semibold text-slate-700">Nomor Bukti Pemotongan:</span>
            <span id="bpa2-no-display" class="font-mono font-bold text-slate-950 ml-1 px-2 py-0.5 bg-slate-100 rounded border border-slate-300">${nomorBpa2}</span>
          </div>
          <div class="text-[11px] text-slate-500">
            Status Pembetulan: <strong>0 (Normal)</strong>
          </div>
        </div>

        <!-- BAGIAN A: IDENTITAS PENERIMA PENGHASILAN -->
        <div class="mb-4">
          <div class="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-1">
            A. IDENTITAS PENERIMA PENGHASILAN YANG DIPOTONG
          </div>
          <div class="border border-slate-300 rounded text-xs p-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <span class="text-slate-500 block text-[10px]">1. NPWP / NIK:</span>
              <span class="font-mono font-bold text-slate-900">${formatNPWP(p.npwp || p.nik) || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">2. NIP Pegawai:</span>
              <span class="font-mono font-semibold text-slate-900">${p.nip || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">3. Nama Lengkap:</span>
              <span class="font-bold text-slate-900 text-sm">${p.nama || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">4. Pangkat / Golongan:</span>
              <span class="font-semibold text-slate-900">${p.pangkat_golongan || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">5. Jabatan:</span>
              <span class="text-slate-900">${p.jabatan || '-'}</span>
            </div>
            <div class="flex gap-4">
              <div>
                <span class="text-slate-500 block text-[10px]">6. Status PTKP:</span>
                <span class="font-bold text-slate-900 font-mono">${p.status_ptkp}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">7. Kategori TER:</span>
                <span class="font-bold text-slate-900 font-mono">TER ${p.kategori_ter}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- BAGIAN B: RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21 -->
        <div class="mb-4">
          <div class="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-1">
            B. RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21 TAHUNAN
          </div>
          <div class="border border-slate-300 rounded overflow-hidden text-xs">
            <table class="w-full">
              <thead class="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 text-[11px]">
                <tr>
                  <th class="py-1.5 px-3 w-10 text-center border-r border-slate-300">NO</th>
                  <th class="py-1.5 px-3 text-left border-r border-slate-300">URAIAN OBJEK PENGHASILAN & PENGURANG</th>
                  <th class="py-1.5 px-3 text-right w-44">JUMLAH (RUPIAH)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <!-- Objek Penghasilan -->
                <tr class="bg-slate-50/70 font-semibold text-[11px] text-slate-600">
                  <td class="py-1 px-3 text-center border-r border-slate-300">I</td>
                  <td colspan="2" class="py-1 px-3">PENGHASILAN BRUTO</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">1</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Gaji Pokok Plus Tunjangan Melekat</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-900">${formatNumber(gajiTotal)}</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">2</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Tunjangan Tambahan Penghasilan (TPP / Tukin)</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-900">${formatNumber(tppTotal)}</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">3</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Upah Pungut / Honorarium Rutin</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-900">${formatNumber(honor1Total)}</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">4</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Honorarium Lintas OPD / Kegiatan Lainnya</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-900">${formatNumber(honor2Total)}</td>
                </tr>
                <tr class="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td class="py-1.5 px-3 text-center border-r border-slate-300">5</td>
                  <td class="py-1.5 px-3 text-slate-900 border-r border-slate-300">JUMLAH PENGHASILAN BRUTO (1 + 2 + 3 + 4)</td>
                  <td class="py-1.5 px-3 text-right font-mono text-slate-950">${formatNumber(brutoTotal)}</td>
                </tr>

                <!-- Pengurang -->
                <tr class="bg-slate-50/70 font-semibold text-[11px] text-slate-600">
                  <td class="py-1 px-3 text-center border-r border-slate-300">II</td>
                  <td colspan="2" class="py-1 px-3">PENGURANG PENGHASILAN BRUTO</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">6</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Biaya Jabatan (5% x Bruto, Maks. ${formatRupiah(maxBiayaJabatan)})</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-800">${formatNumber(biayaJabatan)}</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">7</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Iuran Pensiun / THT (${p.persen_iuran_pensiun}% dari Gaji Pokok)</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-800">${formatNumber(iuranPensiun)}</td>
                </tr>
                <tr class="bg-slate-100 font-bold border-t border-slate-300">
                  <td class="py-1.5 px-3 text-center border-r border-slate-300">8</td>
                  <td class="py-1.5 px-3 text-slate-900 border-r border-slate-300">JUMLAH PENGURANG (6 + 7)</td>
                  <td class="py-1.5 px-3 text-right font-mono text-slate-950">${formatNumber(totalPengurang)}</td>
                </tr>

                <!-- Penghitungan PPh 21 -->
                <tr class="bg-slate-50/70 font-semibold text-[11px] text-slate-600">
                  <td class="py-1 px-3 text-center border-r border-slate-300">III</td>
                  <td colspan="2" class="py-1 px-3">PENGHITUNGAN PPh PASAL 21</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">9</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Jumlah Penghasilan Neto (5 - 8)</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-900 font-semibold">${formatNumber(penghasilanNeto)}</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">10</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Penghasilan Tidak Kena Pajak (PTKP ${p.status_ptkp})</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-800">${formatNumber(ptkp)}</td>
                </tr>
                <tr class="bg-slate-50 font-bold">
                  <td class="py-1 px-3 text-center border-r border-slate-300">11</td>
                  <td class="py-1 px-3 text-slate-900 border-r border-slate-300">Penghasilan Kena Pajak (PKP Dibulatkan ke Bawah)</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-950">${formatNumber(pkp)}</td>
                </tr>
                <tr class="font-bold">
                  <td class="py-1.5 px-3 text-center border-r border-slate-300">12</td>
                  <td class="py-1.5 px-3 text-slate-900 border-r border-slate-300">PPh Pasal 21 Terutang ${akhir && akhir.jumlah_bulan < 12 ? `Masa ${kodeMasa}` : 'Setahun'} (Pasal 17 UU HPP)</td>
                  <td class="py-1.5 px-3 text-right font-mono text-blue-900">${formatNumber(pph21Setahun)}</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">13</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">PPh Pasal 21 yang Telah Dipotong Masa Sebelumnya${akhir && akhir.jumlah_bulan > 1 ? ` (Masa ${String(akhir.bulan_mulai).padStart(2, '0')} s.d. ${String(akhir.bulan_akhir - 1).padStart(2, '0')})` : ''}</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-800">${formatNumber(pph21Sebelumnya)}</td>
                </tr>
                <tr class="bg-emerald-50/70 font-bold border-t-2 border-slate-400">
                  <td class="py-2 px-3 text-center border-r border-slate-300 text-emerald-900">14</td>
                  <td class="py-2 px-3 text-emerald-950 border-r border-slate-300">PPh Pasal 21 Kurang / (Lebih) Dipotong Masa Terakhir (${akhir ? akhir.nama_bulan_akhir : 'Masa Terakhir'})</td>
                  <td class="py-2 px-3 text-right font-mono text-emerald-950 text-sm">${formatNumber(pph21TerutangMasaAkhir)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- BAGIAN C: REKAPITULASI PEMOTONGAN PAJAK (SPLIT WITHHOLDING) -->
        <div class="mb-5">
          <div class="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-1">
            C. REKAPITULASI PEMOTONGAN PAJAK OLEH BENDAHARA PENGELUARAN
          </div>
          <div class="border border-slate-300 rounded overflow-hidden text-[11px]">
            <table class="w-full">
              <thead class="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <tr>
                  <th class="py-1 px-3 text-left">NPWP Bendahara</th>
                  <th class="py-1 px-3 text-left">Instansi / Unit Kerja Pemotong</th>
                  <th class="py-1 px-3 text-right">Bruto Dipotong</th>
                  <th class="py-1 px-3 text-right">Pajak Disetor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${rekapList.length > 0 ? rekapList.map(r => `
                  <tr>
                    <td class="py-1 px-3 font-mono">${r.npwp_bendahara}</td>
                    <td class="py-1 px-3 font-medium text-slate-800">${r.nama_keterangan}</td>
                    <td class="py-1 px-3 text-right font-mono">${formatNumber(r.total_bruto)}</td>
                    <td class="py-1 px-3 text-right font-mono font-semibold">${formatNumber(r.total_pajak_dipotong)}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="4" class="py-2 px-3 text-center text-slate-400">Belum ada rincian pemotongan bendahara.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

        <!-- BAGIAN D: TANDA TANGAN PEMOTONG PAJAK -->
        <div class="border-t-2 border-slate-400 pt-3">
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <div class="font-bold text-slate-800 uppercase text-[11px]">D. IDENTITAS PEMOTONG PAJAK</div>
              <div><span class="text-slate-500">Nama Instansi:</span> <span class="font-semibold text-slate-900">${currentPemotongTitle}</span></div>
              <div><span class="text-slate-500">NPWP Instansi:</span> <span class="font-mono text-slate-900">${formatNPWP(currentPemotongNPWP)}</span></div>
              <div class="text-[10px] text-slate-500 italic mt-2">
                *Bukti pemotongan ini sah dan dicetak secara elektronik melalui Sistem Kalkulator PPh 21 ASN.
              </div>
            </div>

            <div class="text-center flex flex-col items-center justify-between">
              <div>
                <div id="bpa2-tgl-display">${currentKota}, ${tanggalHariIni}</div>
                <div class="font-bold text-slate-900 mt-0.5">Bendahara Pengeluaran,</div>
              </div>
              <div class="my-6 text-slate-300 font-mono text-[10px] italic border-b border-dashed border-slate-300 px-8 py-2">
                (Tanda Tangan & Cap Instansi)
              </div>
              <div>
                <div class="font-bold text-slate-950 underline">${currentBendaharaNama}</div>
                <div class="text-[11px] font-mono text-slate-700">NIP. ${currentBendaharaNIP}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
