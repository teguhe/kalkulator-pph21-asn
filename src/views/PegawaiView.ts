import { appState } from '../state/appState';
import { PTKP_MAP } from '../../taxConstants';
import { formatRupiah } from '../utils/formatters';
import { renderPangkatOptionsHtml } from '../utils/pangkatList';

export function renderPegawaiView(): string {
  const { dataset } = appState;
  const p = dataset.pegawai;
  const ptkpInfo = PTKP_MAP[p.status_ptkp] || PTKP_MAP['TK/0'];

  const ptkpOptions = Object.keys(PTKP_MAP).map(key => {
    const item = PTKP_MAP[key as keyof typeof PTKP_MAP];
    const isSelected = p.status_ptkp === key ? 'selected' : '';
    return `<option value="${key}" ${isSelected}>${key} - ${item.deskripsi} (${formatRupiah(item.nilaiTahunan)} / thn - TER ${item.kategoriTER})</option>`;
  }).join('');

  return `
    <div class="space-y-6">
      <!-- Title & Context Card -->
      <div class="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Profil Wajib Pajak & Pengaturan Instansi
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">Data Pegawai ASN & Parameter Pemotongan</h2>
            <p class="text-sm text-slate-300 leading-relaxed">
              Data identitas ini digunakan untuk menentukan kategori TER bulanan (A, B, atau C), batasan PTKP saat rekonsiliasi akhir periode/Desember, serta identitas resmi pemotong pada formulir bukti potong <strong>1721-BPA2</strong>.
            </p>
          </div>
          <div class="shrink-0 flex flex-wrap items-center gap-2">
            <button id="btn-load-dummy" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-slate-950 shadow-sm transition-all cursor-pointer" title="Muat Data Sampel Dummy ASN">
              <svg class="w-4 h-4 shrink-0 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              <span>Template Dummy</span>
            </button>
            <button id="btn-import-json" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 transition-all cursor-pointer" title="Impor Data dari file JSON">
              <svg class="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              <span>Impor JSON</span>
            </button>
            <button id="btn-export-json" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 transition-all cursor-pointer" title="Ekspor data ke file cadangan JSON">
              <svg class="w-4 h-4 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Ekspor JSON</span>
            </button>
            <button id="btn-reset-data" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 transition-all cursor-pointer" title="Reset ke data kosong">
              <svg class="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              <span>Reset</span>
            </button>
          </div>
        </div>
        <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <svg class="w-72 h-72 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Identitas Pegawai (2 cols) -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</span>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Identitas Pegawai ASN</h3>
              </div>
              <span class="text-xs text-slate-400">*Wajib untuk pelaporan BPA2</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input type="text" id="pegawai-nama" value="${p.nama || ''}" placeholder="Contoh: Budi Santoso, S.Kom., M.T." 
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NIP (18 Digit)</label>
                <input type="text" id="pegawai-nip" value="${p.nip || ''}" placeholder="Contoh: 198505152010011005" maxlength="20"
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-mono" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NIK (16 Digit)</label>
                <input type="text" id="pegawai-nik" value="${p.nik || ''}" placeholder="16 digit NIK KTP" maxlength="18"
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-mono" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NPWP Pegawai</label>
                <input type="text" id="pegawai-npwp" value="${p.npwp || ''}" placeholder="15/16 digit NPWP / NIK" maxlength="20"
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-mono" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Pangkat / Golongan (PNS & PPPK)</label>
                <select id="pegawai-pangkat" 
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white font-medium">
                  ${renderPangkatOptionsHtml(p.pangkat_golongan || '')}
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Jabatan</label>
                <input type="text" id="pegawai-jabatan" value="${p.jabatan || ''}" placeholder="Contoh: Pranata Komputer Ahli Madya" 
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>
            </div>
          </div>

          <!-- Parameter Perpajakan (PTKP, TER, Pensiun) -->
          <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">2</span>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Parameter Status PTKP & TER</h3>
              </div>
              <span class="text-xs text-slate-500">Sesuai PP 58/2023 & PMK 168/2023</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Status PTKP (Penghasilan Tidak Kena Pajak)</label>
                <select id="pegawai-ptkp" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white font-medium">
                  ${ptkpOptions}
                </select>
                <p class="text-[11px] text-slate-500 mt-1">Mengubah status PTKP akan otomatis menyinkronkan Kategori TER (A, B, atau C).</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Kategori TER</label>
                <select id="pegawai-kategori-ter" class="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-slate-50">
                  <option value="A" ${p.kategori_ter === 'A' ? 'selected' : ''}>Kategori A (TK/0, TK/1, K/0)</option>
                  <option value="B" ${p.kategori_ter === 'B' ? 'selected' : ''}>Kategori B (TK/2, TK/3, K/1, K/2)</option>
                  <option value="C" ${p.kategori_ter === 'C' ? 'selected' : ''}>Kategori C (K/3)</option>
                </select>
                <p class="text-[11px] text-slate-500 mt-1">Otomatis dari PTKP.</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Iuran Pensiun / THT (%)</label>
                <div class="relative">
                  <input type="number" step="0.01" min="0" max="100" id="pegawai-iuran-pensiun" value="${p.persen_iuran_pensiun ?? 4.75}" 
                    class="w-full px-3 py-2 pr-8 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                  <span class="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
                <p class="text-[11px] text-slate-500 mt-1">Standar ASN: 4.75% dari Gaji Pokok & Tunjangan Melekat.</p>
              </div>

              <div class="sm:col-span-2 flex items-center p-3 bg-amber-50 border border-amber-200 rounded-lg gap-3">
                <svg class="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div id="ptkp-info-banner" class="text-xs text-amber-900 leading-snug">
                  <strong>Nilai PTKP Tahunan:</strong> ${formatRupiah(ptkpInfo.nilaiTahunan)} (${ptkpInfo.deskripsi}). Kategori TER bulanan aktif: <strong>Kategori ${p.kategori_ter}</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Instansi & Bendahara Utama (1 col) -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div class="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">3</span>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Instansi & Bendahara</h3>
            </div>

            <div class="space-y-3.5">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Instansi / OPD</label>
                <input type="text" id="instansi-nama" value="${p.instansi.nama_instansi || ''}" placeholder="Dinas Komunikasi dan Informatika" 
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NPWP Instansi Utama</label>
                <input type="text" id="instansi-npwp" value="${p.instansi.npwp_instansi_utama || ''}" placeholder="001234567505000" maxlength="20"
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-mono" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Bendahara Pengeluaran</label>
                <input type="text" id="instansi-bendahara-nama" value="${p.instansi.nama_bendahara_utama || ''}" placeholder="Siti Aminah, S.E." 
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NIP Bendahara Pengeluaran</label>
                <input type="text" id="instansi-bendahara-nip" value="${p.instansi.nip_bendahara_utama || ''}" placeholder="198808122011012003" maxlength="20"
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-mono" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Kota Penandatanganan</label>
                <input type="text" id="instansi-kota" value="${p.instansi.kota_penandatangan || 'Salatiga'}" placeholder="Salatiga" 
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>

              <div class="pt-2">
                <button id="btn-sync-npwp" class="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Terapkan NPWP Ini ke Gaji & TPP 12 Bulan
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Navigation Card -->
          <div class="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Langkah Selanjutnya</h4>
            <p class="text-xs text-slate-300 mb-4">
              Setelah identitas pegawai dan instansi terisi, lanjutkan ke tab <strong>Input Penghasilan (12 Bulan)</strong> untuk mengisi 4 komponen penghasilan atau gunakan template dummy untuk melihat contoh nyata.
            </p>
            <button id="btn-goto-input-tab" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition">
              <span>Buka Input Penghasilan (12 Bulan)</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
