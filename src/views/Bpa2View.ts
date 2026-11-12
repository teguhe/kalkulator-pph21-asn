import { appState } from '../state/appState';
import { formatRupiah, formatNPWP, formatDateIndo } from '../utils/formatters';

export function renderBpa2View(): string {
  const { dataset, calculation, selectedBpa2NPWP } = appState;
  const p = dataset.pegawai;
  const akhir = calculation.akhir_periode;
  const rekapList = calculation.rekap_bendahara;

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

  // Values
  const brutoTotal = akhir ? akhir.total_bruto_akumulasi : calculation.total_bruto_setahun;
  const gajiTotal = akhir ? akhir.total_gaji_akumulasi : (calculation.hasil_bulanan.reduce((a, b) => a + b.komponen.k1_bruto, 0));
  const tppTotal = calculation.hasil_bulanan.reduce((a, b) => a + b.komponen.k2_bruto, 0);
  const honor1Total = calculation.hasil_bulanan.reduce((a, b) => a + b.komponen.k3_bruto, 0);
  const honor2Total = calculation.hasil_bulanan.reduce((a, b) => a + b.komponen.k4_bruto, 0);

  const biayaJabatan = akhir ? akhir.biaya_jabatan : Math.min(Math.floor(brutoTotal * 0.05), 6000000);
  const iuranPensiun = akhir ? akhir.iuran_pensiun : Math.floor(gajiTotal * ((p.persen_iuran_pensiun || 4.75) / 100));
  const totalPengurang = biayaJabatan + iuranPensiun;
  const penghasilanNeto = akhir ? akhir.penghasilan_neto : Math.max(0, brutoTotal - totalPengurang);
  const ptkp = akhir ? akhir.ptkp : 67500000;
  const pkp = akhir ? akhir.pkp : Math.max(0, Math.floor((penghasilanNeto - ptkp) / 1000) * 1000);
  const pph21Setahun = akhir ? akhir.pph21_pasal17_setahun : calculation.total_pph21_terutang_setahun;
  const pph21Sebelumnya = akhir ? akhir.pajak_terutang_sebelumnya : (calculation.hasil_bulanan.slice(0, 11).reduce((a, b) => a + b.pph21_terutang, 0));
  const pph21TerutangMasaAkhir = akhir ? akhir.pph21_terutang_bulan_terakhir : (pph21Setahun - pph21Sebelumnya);
  const selisihTahunan = calculation.total_selisih_setahun;

  const currentYear = new Date().getFullYear();
  const nomorBpa2 = `1.1-12.${String(currentYear).slice(-2)}-0000108`;

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
      <!-- Toolbar (Cetak & Filter) - Hidden in Print -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs no-print">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Entitas Pemotong Pajak</label>
              <select id="select-bpa2-npwp" class="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                ${npwpOptionsHtml}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nomor Bukti Potong</label>
              <input type="text" id="input-bpa2-no" value="${nomorBpa2}" 
                class="px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-print-bpa2" class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak / Cetak PDF (A4)</span>
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
                Masa Pajak: <strong>01 - 12</strong> / Tahun Pajak: <strong>${currentYear}</strong>
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
            <span class="font-mono font-bold text-slate-950 ml-1 px-2 py-0.5 bg-slate-100 rounded border border-slate-300">${nomorBpa2}</span>
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
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">Biaya Jabatan (5% x Bruto, Maks. Rp 6.000.000 / thn)</td>
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
                  <td class="py-1.5 px-3 text-slate-900 border-r border-slate-300">PPh Pasal 21 Terutang Setahun (Pasal 17 UU HPP)</td>
                  <td class="py-1.5 px-3 text-right font-mono text-blue-900">${formatNumber(pph21Setahun)}</td>
                </tr>
                <tr>
                  <td class="py-1 px-3 text-center font-mono text-slate-500 border-r border-slate-300">13</td>
                  <td class="py-1 px-3 text-slate-800 border-r border-slate-300">PPh Pasal 21 yang Telah Dipotong Masa Sebelumnya (Jan - Nov)</td>
                  <td class="py-1 px-3 text-right font-mono text-slate-800">${formatNumber(pph21Sebelumnya)}</td>
                </tr>
                <tr class="bg-emerald-50/70 font-bold border-t-2 border-slate-400">
                  <td class="py-2 px-3 text-center border-r border-slate-300 text-emerald-900">14</td>
                  <td class="py-2 px-3 text-emerald-950 border-r border-slate-300">PPh Pasal 21 Kurang / (Lebih) Dipotong Masa Terakhir</td>
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
                ${rekapList.map(r => `
                  <tr>
                    <td class="py-1 px-3 font-mono">${r.npwp_bendahara}</td>
                    <td class="py-1 px-3 font-medium text-slate-800">${r.nama_keterangan}</td>
                    <td class="py-1 px-3 text-right font-mono">${formatNumber(r.total_bruto)}</td>
                    <td class="py-1 px-3 text-right font-mono font-semibold">${formatNumber(r.total_pajak_dipotong)}</td>
                  </tr>
                `).join('')}
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
                *Bukti pemotongan ini sah dan dicetak secara elektronik melalui Sistem Kalkulator PPh 21 ASN/PNS.
              </div>
            </div>

            <div class="text-center flex flex-col items-center justify-between">
              <div>
                <div>${currentKota}, ${formatDateIndo()}</div>
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
