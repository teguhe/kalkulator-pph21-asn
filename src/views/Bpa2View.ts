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
  const bulanMulaiStr = akhir ? String(akhir.bulan_mulai).padStart(2, '0') : '01';
  const kodeMasa = akhir ? akhir.kode_masa : '01 - 12';
  const periodePenghasilan = `${bulanMulaiStr}-${currentYear}-${bulanAkhirStr}-${currentYear}`;
  const jenisPemotongan = (akhir && akhir.jumlah_bulan < 12) ? 'Kurang dari Setahun' : 'Setahun Penuh';
  const nomorBpa2 = `2508${bulanAkhirStr}CD0`;
  const tanggalHariIni = formatDateIndo();

  // Values specific to the selected Akhir Periode
  const brutoTotal = akhir ? akhir.total_bruto_akumulasi : calculation.total_bruto_setahun;
  const gajiTotal = akhir ? akhir.total_gaji_akumulasi : 0;
  const tppTotal = akhir ? (akhir.total_tpp_akumulasi || 0) : 0;
  const honor1Total = akhir ? (akhir.total_honor1_akumulasi || 0) : 0;
  const honor2Total = akhir ? (akhir.total_honor2_akumulasi || 0) : 0;
  const penghasilanTetapTerpisah = tppTotal + honor1Total + honor2Total;

  const maxBiayaJabatan = akhir ? akhir.max_biaya_jabatan : 6000000;
  const biayaJabatan = akhir ? akhir.biaya_jabatan : Math.min(Math.floor(brutoTotal * 0.05), maxBiayaJabatan);
  const iuranPensiun = akhir ? akhir.iuran_pensiun : Math.floor(gajiTotal * ((p.persen_iuran_pensiun || 4.75) / 100));
  const totalPengurang = akhir ? akhir.total_pengurang : (biayaJabatan + iuranPensiun);
  
  // Section III Values matching PER-2/PJ/2024 (Rows 14 to 24)
  const penghasilanNeto = akhir ? akhir.penghasilan_neto : Math.max(0, brutoTotal - totalPengurang);
  const penghasilanNetoSebelumnya = akhir ? (akhir.penghasilan_neto_sebelumnya || 0) : 0;
  const jumlahPenghasilanNeto = akhir ? (akhir.jumlah_penghasilan_neto_setahun || (penghasilanNeto + penghasilanNetoSebelumnya)) : (penghasilanNeto + penghasilanNetoSebelumnya);
  const ptkp = akhir ? akhir.ptkp : 54000000;
  const pkp = akhir ? akhir.pkp : Math.max(0, Math.floor((jumlahPenghasilanNeto - ptkp) / 1000) * 1000);
  const pph21Setahun = akhir ? akhir.pph21_pasal17_setahun : calculation.total_pph21_terutang_setahun;
  const pph21DipotongSebelumnya = akhir ? (akhir.pph21_dipotong_sebelumnya || 0) : 0;
  const pph21TerutangBuktiIni = akhir ? (akhir.pph21_terutang_bukti_ini ?? (pph21Setahun - pph21DipotongSebelumnya)) : pph21Setahun;
  const pph21TelahDipotong = akhir ? akhir.pajak_terutang_sebelumnya : 0;
  const pph21KurangLebihMasaAkhir = akhir ? akhir.pph21_terutang_bulan_terakhir : (pph21TerutangBuktiIni - pph21TelahDipotong);

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
      <div id="bpa2-print-container" class="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-8 max-w-4xl mx-auto text-slate-900 font-sans">
        
        <!-- HEADER FORMULIR BPA2 SESUAI PER-2/PJ/2024 -->
        <div class="border-2 border-slate-900 mb-3 text-slate-950">
          <div class="p-3 grid grid-cols-12 gap-2 items-center border-b-2 border-slate-900 bg-white">
            <div class="col-span-8 sm:col-span-9 flex items-center gap-3 text-left">
              <div class="w-12 h-12 bg-linear-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center font-extrabold text-slate-950 text-xs shadow-xs shrink-0 border border-slate-900">
                DJP
              </div>
              <div>
                <div class="text-[10px] font-bold uppercase leading-tight text-slate-800">KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</div>
                <div class="text-[10px] font-bold uppercase leading-tight text-slate-800">DIREKTORAT JENDERAL PAJAK</div>
                <h2 class="text-[11px] sm:text-xs font-black uppercase tracking-tight text-slate-950 mt-0.5 leading-snug">
                  BUKTI PEMOTONGAN PAJAK PENGHASILAN PASAL 21 BAGI PEGAWAI NEGERI SIPIL ATAU ANGGOTA TENTARA NASIONAL INDONESIA ATAU ANGGOTA KEPOLISIAN REPUBLIK INDONESIA ATAU PEJABAT NEGARA ATAU PENSIUNANNYA
                </h2>
              </div>
            </div>
            <div class="col-span-4 sm:col-span-3 text-right flex flex-col items-end justify-center">
              <div class="inline-block bg-amber-300 border-2 border-slate-950 px-3.5 py-1 font-black text-lg sm:text-xl font-mono text-slate-950 tracking-wider shadow-xs">
                BPA2
              </div>
              <div class="text-[8px] text-slate-600 mt-0.5">PER-2/PJ/2024 &bull; Coretax Form</div>
            </div>
          </div>
          <!-- 4 Metadata Columns -->
          <div class="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-slate-900 text-center text-[10px] bg-slate-100 font-bold">
            <div class="p-1.5 border-r sm:border-r-0 border-slate-900">
              <div class="text-slate-600 text-[8px] uppercase tracking-wider">NOMOR BUKTI PEMOTONGAN</div>
              <div class="font-mono text-xs font-bold text-slate-950" id="bpa2-no-display">${nomorBpa2}</div>
            </div>
            <div class="p-1.5">
              <div class="text-slate-600 text-[8px] uppercase tracking-wider">PERIODE PENGHASILAN</div>
              <div class="font-mono text-xs font-bold text-slate-950">${periodePenghasilan}</div>
            </div>
            <div class="p-1.5 border-r sm:border-r-0 border-slate-900 border-t sm:border-t-0">
              <div class="text-slate-600 text-[8px] uppercase tracking-wider">SIFAT PEMOTONGAN</div>
              <div class="text-xs font-bold text-slate-950">TIDAK FINAL</div>
            </div>
            <div class="p-1.5 border-t sm:border-t-0">
              <div class="text-slate-600 text-[8px] uppercase tracking-wider">STATUS BUKTI PEMOTONGAN</div>
              <div class="text-xs font-bold text-slate-950">NORMAL</div>
            </div>
          </div>
        </div>

        <!-- BAGIAN A: IDENTITAS PENERIMA PENGHASILAN -->
        <div class="mb-3">
          <div class="bg-slate-800 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-1">
            A. IDENTITAS PENERIMA PENGHASILAN
          </div>
          <div class="border border-slate-300 rounded text-xs p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4">
            <div>
              <span class="text-slate-500 text-[10px] inline-block w-24">A.1 NIK/NPWP</span>: 
              <span class="font-mono font-bold text-slate-900 ml-1">${formatNPWP(p.npwp || p.nik) || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] inline-block w-24">A.6 Pangkat/Gol</span>: 
              <span class="font-semibold text-slate-900 ml-1">${p.pangkat_golongan || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] inline-block w-24">A.2 Nama</span>: 
              <span class="font-bold text-slate-900 text-xs sm:text-sm ml-1">${p.nama || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] inline-block w-24">A.7 Status PTKP</span>: 
              <span class="font-bold text-slate-900 font-mono ml-1">${p.status_ptkp} (Kategori TER ${p.kategori_ter})</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] inline-block w-24">A.3 Alamat</span>: 
              <span class="text-slate-800 ml-1">${p.instansi.kota_penandatangan || 'Salatiga'}</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] inline-block w-24">A.8 Posisi / Jabatan</span>: 
              <span class="text-slate-900 ml-1 font-medium">${p.jabatan || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] inline-block w-24">A.4 NIP/NRP</span>: 
              <span class="font-mono font-semibold text-slate-900 ml-1">${p.nip || '-'}</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] inline-block w-24">A.9 Lebih dari 1 Kerja</span>: 
              <span class="text-slate-900 ml-1">Tidak</span>
            </div>
          </div>
        </div>

        <!-- BAGIAN B: RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21 -->
        <div class="mb-3">
          <div class="bg-slate-800 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>B. RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21</span>
            <span class="text-[10px] text-slate-300 font-normal">B.1.1 Kode: 21-100-01 &bull; B.2 Jenis: ${jenisPemotongan}</span>
          </div>
          <div class="border border-slate-300 rounded overflow-hidden text-xs">
            <table class="w-full">
              <thead class="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 text-[10px]">
                <tr>
                  <th class="py-1 px-2.5 w-10 text-center border-r border-slate-300">NO</th>
                  <th class="py-1 px-2.5 text-left border-r border-slate-300">URAIAN RINCIAN PENGHASILAN & PENGURANG</th>
                  <th class="py-1 px-2.5 text-right w-40 sm:w-44">JUMLAH (Rp)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <!-- Objek Penghasilan -->
                <tr class="bg-slate-100/70 font-bold text-[10px] text-slate-800">
                  <td class="py-1 px-2.5 text-center border-r border-slate-300">I</td>
                  <td colspan="2" class="py-1 px-2.5">PENGHASILAN BRUTO</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">1.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Gaji Pokok / Pensiun &amp; Tunjangan Melekat</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-900">${formatNumber(gajiTotal)}</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">2.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Tunjangan Istri</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-400">0</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">3.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Tunjangan Anak</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-400">0</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">4.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Tunjangan Perbaikan Penghasilan</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-400">0</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">5.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Tunjangan Struktural / Fungsional</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-400">0</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">6.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Tunjangan Beras</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-400">0</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">7.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Tunjangan Lain-lain</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-400">0</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">8.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">
                    <div>Penghasilan Tetap dan Teratur Lainnya yang Pembayarannya Terpisah dari Pembayaran Gaji</div>
                    ${penghasilanTetapTerpisah > 0 ? `<div class="text-[9px] text-slate-500 font-normal">TPP: ${formatNumber(tppTotal)} &bull; Honorarium: ${formatNumber(honor1Total + honor2Total)}</div>` : ''}
                  </td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-900 font-medium">${formatNumber(penghasilanTetapTerpisah)}</td>
                </tr>
                <tr class="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td class="py-1 px-2.5 text-center border-r border-slate-300">9.</td>
                  <td class="py-1 px-2.5 text-slate-950 border-r border-slate-300">Jumlah Penghasilan Bruto (1 s.d. 8)</td>
                  <td class="py-1 px-2.5 text-right font-mono text-slate-950">${formatNumber(brutoTotal)}</td>
                </tr>

                <!-- Pengurang -->
                <tr class="bg-slate-100/70 font-bold text-[10px] text-slate-800">
                  <td class="py-1 px-2.5 text-center border-r border-slate-300">II</td>
                  <td colspan="2" class="py-1 px-2.5">PENGURANG PENGHASILAN BRUTO</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">10.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Biaya Jabatan / Biaya Pensiun (Maks. ${formatRupiah(maxBiayaJabatan)})</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-800">${formatNumber(biayaJabatan)}</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">11.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Iuran terkait Pensiun atau Hari Tua (${p.persen_iuran_pensiun}% dari Gaji Pokok)</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-800">${formatNumber(iuranPensiun)}</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">12.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Zakat atau Sumbangan Keagamaan yang Bersifat Wajib yang Dibayarkan melalui Pemberi Kerja</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-400">0</td>
                </tr>
                <tr class="bg-slate-100 font-bold border-t border-slate-300">
                  <td class="py-1 px-2.5 text-center border-r border-slate-300">13.</td>
                  <td class="py-1 px-2.5 text-slate-950 border-r border-slate-300">Jumlah Pengurangan (10 s.d 12)</td>
                  <td class="py-1 px-2.5 text-right font-mono text-slate-950">${formatNumber(totalPengurang)}</td>
                </tr>

                <!-- Penghitungan PPh 21 -->
                <tr class="bg-slate-100/70 font-bold text-[10px] text-slate-800">
                  <td class="py-1 px-2.5 text-center border-r border-slate-300">III</td>
                  <td colspan="2" class="py-1 px-2.5">PENGHITUNGAN PPh PASAL 21</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">14.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Jumlah Penghasilan Neto (9 - 13)</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-900 font-semibold">${formatNumber(penghasilanNeto)}</td>
                </tr>
                <tr class="${penghasilanNetoSebelumnya > 0 ? 'bg-amber-50/70' : ''}">
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">15.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">
                    <span class="${penghasilanNetoSebelumnya > 0 ? 'font-bold text-slate-900' : ''}">Penghasilan Neto dari Pemotongan Sebelumnya</span>
                    ${penghasilanNetoSebelumnya > 0 ? `<span class="ml-1 text-[9px] text-amber-800 bg-amber-100 px-1 py-0.2 rounded font-semibold no-print">Akumulasi Bukti Potong Sebelumnya</span>` : ''}
                  </td>
                  <td class="py-0.5 px-2.5 text-right font-mono ${penghasilanNetoSebelumnya > 0 ? 'font-bold text-amber-950' : 'text-slate-700'}">${formatNumber(penghasilanNetoSebelumnya)}</td>
                </tr>
                <tr class="bg-slate-50 font-semibold">
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">16.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Jumlah Penghasilan Neto untuk Perhitungan PPh Pasal 21 (Setahun / Disetahunkan) (14 + 15)</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-950 font-bold">${formatNumber(jumlahPenghasilanNeto)}</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">17.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">Penghasilan Tidak Kena Pajak (PTKP ${p.status_ptkp})</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-800">${formatNumber(ptkp)}</td>
                </tr>
                <tr class="bg-slate-50 font-bold">
                  <td class="py-0.5 px-2.5 text-center border-r border-slate-300">18.</td>
                  <td class="py-0.5 px-2.5 text-slate-900 border-r border-slate-300">Penghasilan Kena Pajak Setahun / Disetahunkan (16 - 17)</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-950">${formatNumber(pkp)}</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">19.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">PPh Pasal 21 atas Penghasilan Kena Pajak Setahun / Disetahunkan</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-900 font-semibold">${formatNumber(pph21Setahun)}</td>
                </tr>
                <tr class="font-bold bg-slate-50">
                  <td class="py-0.5 px-2.5 text-center border-r border-slate-300">20.</td>
                  <td class="py-0.5 px-2.5 text-slate-900 border-r border-slate-300">PPh Pasal 21 Terutang</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-950">${formatNumber(pph21Setahun)}</td>
                </tr>
                <tr class="${pph21DipotongSebelumnya > 0 ? 'bg-amber-50/70' : ''}">
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">21.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">
                    <span class="${pph21DipotongSebelumnya > 0 ? 'font-bold text-slate-900' : ''}">PPh Pasal 21 Dipotong dari Bukti Pemotongan Sebelumnya</span>
                    ${pph21DipotongSebelumnya > 0 ? `<span class="ml-1 text-[9px] text-amber-800 bg-amber-100 px-1 py-0.2 rounded font-semibold no-print">Kredit Bukti Potong Sebelumnya</span>` : ''}
                  </td>
                  <td class="py-0.5 px-2.5 text-right font-mono ${pph21DipotongSebelumnya > 0 ? 'font-bold text-rose-700' : 'text-slate-700'}">${formatNumber(pph21DipotongSebelumnya)}</td>
                </tr>
                <tr class="font-bold bg-blue-50/60">
                  <td class="py-1 px-2.5 text-center border-r border-slate-300 text-blue-950">22.</td>
                  <td class="py-1 px-2.5 text-blue-950 border-r border-slate-300">PPh Pasal 21 Terutang pada Bukti Pemotongan Ini (Dapat Dikreditkan Pada SPT Tahunan) (20 - 21)</td>
                  <td class="py-1 px-2.5 text-right font-mono text-blue-900 text-sm">${formatNumber(pph21TerutangBuktiIni)}</td>
                </tr>
                <tr>
                  <td class="py-0.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-300">23.</td>
                  <td class="py-0.5 px-2.5 text-slate-800 border-r border-slate-300">PPh Pasal 21 yang Telah Dipotong${akhir && akhir.jumlah_bulan > 1 ? ` (Masa ${String(akhir.bulan_mulai).padStart(2, '0')} s.d. ${String(akhir.bulan_akhir - 1).padStart(2, '0')})` : ''}</td>
                  <td class="py-0.5 px-2.5 text-right font-mono text-slate-800">${formatNumber(pph21TelahDipotong)}</td>
                </tr>
                <tr class="bg-emerald-50/80 font-bold border-t-2 border-slate-400">
                  <td class="py-1 px-2.5 text-center border-r border-slate-300 text-emerald-900">24.</td>
                  <td class="py-1 px-2.5 text-emerald-950 border-r border-slate-300">PPh Pasal 21 Kurang (Lebih) Dipotong pada Masa Pajak ${akhir ? akhir.nama_bulan_akhir : 'Desember'} / Masa Pajak Terakhir (22 - 23)</td>
                  <td class="py-1 px-2.5 text-right font-mono text-emerald-950 text-sm">${formatNumber(pph21KurangLebihMasaAkhir)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- BAGIAN C: IDENTITAS PEMOTONG PPh SESUAI DOKUMEN RESMI DJP -->
        <div class="mb-4">
          <div class="bg-slate-800 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-1">
            C. IDENTITAS PEMOTONG PPh
          </div>
          <div class="border border-slate-300 rounded text-xs p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div class="md:col-span-8 space-y-1.5">
              <div><span class="text-slate-500 text-[10px] inline-block w-24">C.1 NPWP</span>: <span class="font-mono font-bold text-slate-900">${formatNPWP(currentPemotongNPWP)}</span></div>
              <div><span class="text-slate-500 text-[10px] inline-block w-24">C.2 NITKU</span>: <span class="font-mono text-slate-800 text-[11px]">${currentPemotongNPWP}0000000 - ${currentPemotongTitle}</span></div>
              <div><span class="text-slate-500 text-[10px] inline-block w-24">C.3 Nama Pemotong</span>: <span class="font-bold text-slate-900">${currentPemotongTitle}</span></div>
              <div><span class="text-slate-500 text-[10px] inline-block w-24">C.4 Tanggal</span>: <span class="text-slate-900">${tanggalHariIni}</span></div>
              <div><span class="text-slate-500 text-[10px] inline-block w-24">C.5 Penandatangan</span>: <span class="font-bold text-slate-900 underline">${currentBendaharaNama}</span> <span class="text-[10px] font-mono text-slate-600">(${currentBendaharaNIP ? 'NIP. ' + currentBendaharaNIP : 'Bendahara Pengeluaran'})</span></div>
              <div class="text-[9px] text-slate-500 italic pt-1 border-t border-slate-200">
                <strong>C.6 Pernyataan:</strong> Dengan ini saya menyatakan bahwa Bukti Pemotongan ini telah saya isi dengan benar dan telah saya tandatangani secara elektronik sesuai ketentuan peraturan perundang-undangan perpajakan.
              </div>
            </div>

            <div class="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-300 pt-2 md:pt-0 md:pl-4 text-center flex flex-col items-center justify-center">
              <div class="w-16 h-16 border-2 border-slate-900 rounded p-1 flex items-center justify-center bg-slate-50 shadow-xs mb-1">
                <svg class="w-14 h-14 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 2h2v3h-2v-3zm3 3h3v3h-3v-3zm-5 1h2v2h-2v-2zm0-4h2v2h-2v-2z"/>
                </svg>
              </div>
              <div class="text-[9px] font-bold text-slate-900 uppercase">Ditandatangani secara elektronik</div>
              <div class="text-[8px] text-slate-500 leading-tight mt-0.5">
                Sesuai dengan ketentuan yang berlaku, Direktorat Jenderal Pajak mengatur bahwa Bukti Pemotongan ini sah tanpa tanda tangan basah.
              </div>
            </div>
          </div>
        </div>

        <!-- BAGIAN D: REKAPITULASI PEMOTONGAN PAJAK (SPLIT WITHHOLDING) -->
        <div>
          <div class="bg-slate-800 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>D. REKAPITULASI PEMOTONGAN PAJAK OLEH BENDAHARA PENGELUARAN (SPLIT WITHHOLDING)</span>
            <span class="text-[10px] text-slate-300 font-normal">Kontribusi per NPWP Pemotong</span>
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

      </div>

      <!-- Quick Navigation Card (Hidden in Print) -->
      <div class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
            Selesai Siklus Perhitungan (Form 4 dari 4)
          </div>
          <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Langkah Selanjutnya</h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            Formulir Bukti Potong 1721-BPA2 telah siap dicetak atau diunduh. Gunakan data bukti pemotongan ini untuk pelaporan <strong>SPT Tahunan Orang Pribadi</strong> di DJP Online, atau lanjutkan ke panduan FAQ serta pemrosesan pegawai berikutnya.
          </p>
        </div>
        <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <button id="btn-goto-hasil-from-bpa2" class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer">
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span>Hasil Rekonsiliasi</span>
          </button>
          <button id="btn-goto-pegawai-from-bpa2" class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer">
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span>Pegawai Baru</span>
          </button>
          <button id="btn-goto-faq-from-bpa2" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer">
            <span>Panduan SPT &amp; FAQ</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}
