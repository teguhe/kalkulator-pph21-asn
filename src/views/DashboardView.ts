import { appState } from '../state/appState';
import { PTKP_MAP } from '../../taxConstants';
import { formatRupiah } from '../utils/formatters';

export function renderDashboardView(): string {
  const { currentUser, dataset, calculation, quotaState } = appState;
  const p = dataset.pegawai;
  const ptkpInfo = PTKP_MAP[p.status_ptkp as keyof typeof PTKP_MAP] || PTKP_MAP['TK/0'];
  const hasPegawaiName = Boolean(p.nama && p.nama.trim().length > 0);

  return `
    <div class="space-y-6">
      <!-- Welcome Hero Banner -->
      <div class="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Aplikasi Resmi Berbasis PP 58/2023 &amp; PMK 168/2023
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Selamat Datang, ${currentUser?.displayName || 'Bapak/Ibu ASN'}!
          </h1>
          <p class="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Kalkulator PPh 21 ASN adalah sistem komprehensif penghitungan dan rekonsiliasi Pajak Penghasilan Pasal 21 bagi Aparatur Sipil Negara (PNS &amp; PPPK) serta Instansi Pemerintah. Aplikasi ini mempermudah simulasi pemotongan bulanan menggunakan <strong>Tarif Efektif Rata-Rata (TER)</strong>, rekonsiliasi akhir tahun (Pasal 17), dan pembuatan bukti pemotongan resmi <strong>Formulir 1721-BPA2</strong>.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button data-tab="ter-bulanan" class="tab-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition hover:shadow cursor-pointer">
              <svg class="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Mulai PPh TER Bulanan</span>
            </button>
            <button data-tab="pegawai" class="tab-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition cursor-pointer">
              <svg class="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Perhitungan PPh 21 Setahun</span>
            </button>
          </div>
        </div>

        <!-- Decorative background icon -->
        <div class="absolute -right-8 -bottom-12 opacity-10 pointer-events-none">
          <svg class="w-80 h-80 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      </div>

      <!-- 3 Primary Menu Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- 1. PPh TER Bulanan -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Fitur Baru
              </span>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-1.5">PPh TER Bulanan</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">
              Simulasi cepat perhitungan PPh 21 bulanan menggunakan Tarif Efektif Rata-Rata (TER) untuk <strong>4 komponen penghasilan ASN</strong> (Gaji, TPP, dan 2 Honorarium). Menghitung tarif dan pajak per masing-masing penghasilan serta pajak ketika keempat penghasilan digabung sebulan.
            </p>
          </div>
          <button data-tab="ter-bulanan" class="tab-button w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer">
            <span>Buka PPh TER Bulanan</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <!-- 2. PPh TER Setahun (Form 1 - 4) -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                Form 1 s/d 4
              </span>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-1.5">PPh TER Setahun</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">
              Perhitungan lengkap siklus satu tahun pajak (12 bulan) yang mencakup 4 langkah berurutan: <strong>Form 1:</strong> Data Pegawai &amp; Instansi, <strong>Form 2:</strong> Input Penghasilan 12 Bulan, <strong>Form 3:</strong> Hasil &amp; Rekonsiliasi Pasal 17, dan <strong>Form 4:</strong> Cetak Bukti Potong 1721-BPA2.
            </p>
          </div>
          <button data-tab="pegawai" class="tab-button w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition cursor-pointer">
            <span>Buka PPh TER Setahun</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <!-- 3. FAQ & Pusat Bantuan -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                Buku Panduan DJP
              </span>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-1.5">Pusat Bantuan &amp; FAQ</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">
              Panduan lengkap regulasi perpajakan ASN berbasis Buku Panduan Cermat DJP: daftar lengkap <strong>Tabel TER Kategori A, B, dan C</strong>, aturan batas PTKP, penanganan pemotongan bendahara terpisah (Split Withholding), serta kewajiban pelaporan SPT Tahunan.
            </p>
          </div>
          <button data-tab="faq" class="tab-button w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 transition cursor-pointer">
            <span>Buka Tanya Jawab &amp; FAQ</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick Status & Info Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Status Pegawai Aktif -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                👤
              </div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Profil Pegawai ASN Aktif
              </h3>
            </div>
            <button data-tab="pegawai" class="tab-button text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
              Edit di Form 1 &rarr;
            </button>
          </div>

          ${hasPegawaiName ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div class="text-[11px] font-semibold text-slate-400 uppercase">Nama Lengkap</div>
                <div class="text-sm font-bold text-slate-800 truncate">${p.nama}</div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">NIP: ${p.nip || '-'}</div>
              </div>

              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div class="text-[11px] font-semibold text-slate-400 uppercase">Jabatan &amp; Golongan</div>
                <div class="text-sm font-bold text-slate-800 truncate">${p.jabatan || '-'}</div>
                <div class="text-xs text-slate-500 mt-0.5">${p.pangkat_golongan || '-'}</div>
              </div>

              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div class="text-[11px] font-semibold text-slate-400 uppercase">Status PTKP</div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                    ${p.status_ptkp}
                  </span>
                  <span class="text-xs text-slate-600 font-semibold">${formatRupiah(ptkpInfo.nilaiTahunan)} / thn</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">${ptkpInfo.deskripsi}</div>
              </div>

              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div class="text-[11px] font-semibold text-slate-400 uppercase">Kategori TER Aktif</div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="px-2.5 py-0.5 bg-teal-600 text-white text-xs font-bold rounded">
                    Kategori ${p.kategori_ter}
                  </span>
                  <span class="text-xs text-slate-600">Dipakai untuk TER Bulanan</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Instansi: ${p.instansi?.nama_instansi || 'Belum diisi'}</div>
              </div>
            </div>
          ` : `
            <div class="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <svg class="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div class="text-sm font-bold text-slate-700">Data Pegawai Masih Kosong</div>
              <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
                Anda dapat mengisi data pegawai pada Form 1 atau langsung menggunakan contoh data bawaan ASN.
              </p>
              <div class="flex items-center justify-center gap-2">
                <button id="btn-dashboard-load-dummy" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer">
                  Muat Sampel Dummy ASN
                </button>
                <button data-tab="pegawai" class="tab-button px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer">
                  Isi Manual Form 1
                </button>
              </div>
            </div>
          `}
        </div>

        <!-- Ringkasan Kuota & Tips Perpajakan -->
        <div class="space-y-5">
          <!-- Kuota Box -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kuota Perhitungan Harian</h4>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xl font-extrabold ${quotaState.isUnlimited || quotaState.remaining > 0 ? 'text-emerald-700' : 'text-rose-600'}">
                  ${quotaState.isUnlimited ? 'Akses Unlimited' : `${quotaState.remaining} Perhitungan`}
                </div>
                <div class="text-xs text-slate-500">
                  ${quotaState.isUnlimited ? 'Akun Administrator' : `Tersisa dari kuota ${quotaState.limit}x / hari`}
                </div>
              </div>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                ✓
              </div>
            </div>
          </div>

          <!-- Tips Cepat PPh TER -->
          <div class="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 text-amber-950">
            <div class="flex items-center gap-2 font-bold text-xs text-amber-900 mb-1">
              <svg class="w-4 h-4 text-amber-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Catatan Penting TER ASN
            </div>
            <p class="text-xs text-amber-900/90 leading-relaxed">
              Jika penghasilan Anda (Gaji, TPP, dan Honor) dipotong terpisah oleh bendahara yang berbeda, total potongan bulanan berpotensi lebih rendah dibanding perhitungan gabungan sebulan. Gunakan menu <strong>PPh TER Bulanan</strong> untuk melihat simulasi selisihnya!
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
