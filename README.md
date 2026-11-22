# Kalkulator PPh 21 ASN & Generator Bukti Potong 1721-BPA2

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Regulasi](https://img.shields.io/badge/Regulasi-PP_58/2023_|_PMK_168/2023_|_PER--2/PJ/2024-emerald?style=flat)](#dasar-hukum--regulasi)

Aplikasi kalkulator pajak penghasilan komprehensif yang dirancang khusus untuk Aparatur Sipil Negara (**PNS & PPPK**) di lingkungan instansi pemerintah pusat maupun pemerintah daerah (**OPD/SKPD**). Aplikasi ini mengimplementasikan skema pemotongan **Tarif Efektif Rata-Rata (TER) Bulanan**, rekonsiliasi akhir masa/akhir periode berdasarkan **Tarif Progresif Pasal 17 Ayat (1) huruf a UU HPP**, penanganan **Split Withholding lintas bendahara**, serta pembuatan bukti pemotongan resmi **Formulir 1721-BPA2 (DJP Coretax / e-Bupot 21/26)**.

---

## Daftar Isi
- [Latar Belakang & Fitur Utama](#latar-belakang--fitur-utama)
- [Alur 4 Langkah Penggunaan](#alur-4-langkah-penggunaan)
- [Dasar Hukum & Formula Perhitungan](#dasar-hukum--formula-perhitungan)
- [Fitur Manajemen Kuota & Dashboard Admin](#fitur-manajemen-kuota--dashboard-admin)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Panduan Instalasi & Menjalankan Lokal](#panduan-instalasi--menjalankan-lokal)
- [Konfigurasi Firebase (Login Google)](#konfigurasi-firebase-login-google)
- [Struktur Direktori](#struktur-direktori)
- [Lisensi](#lisensi)

---

## Latar Belakang & Fitur Utama

Semenjak berlakunya **PP No. 58 Tahun 2023** dan petunjuk teknis **PMK No. 168 Tahun 2023**, pemotongan PPh Pasal 21 bulanan (Masa Januari s.d. November atau masa sebelum akhir periode) wajib menggunakan skema TER (Kategori A, B, atau C). Pada masa pajak terakhir (Masa Desember atau masa berhenti/mutasi kerja), dilakukan **rekonsiliasi fiskal** dengan menghitung kembali seluruh penghasilan setahun menggunakan tarif progresif Pasal 17 UU HPP, memperhitungkan Biaya Jabatan, Iuran Pensiun, dan PTKP.

### Fitur Unggulan:
1. **Multi-Komponen Penghasilan ASN**:
   - Mendukung 4 pos komponen per bulan: Gaji Induk (Teratur), Tambahan Penghasilan Pegawai (TPP / Kinerja / Bonus), serta 2 komponen fleksibel (Uang Makan, Honorarium, Jasa Pelayanan, Gaji Ke-13, THR).
2. **Split Withholding (Pemotongan Pajak Lintas OPD)**:
   - Mendukung pencatatan NPWP Bendahara Pengeluaran yang berbeda untuk tiap komponen penghasilan.
   - Menyajikan rekapitulasi kontribusi bruto dan pajak disetor per NPWP Pemotong Pajak (Bagian D Formulir 1721-BPA2).
3. **Multi Akhir Periode dalam Satu Tahun Pajak (Sesuai DJP Coretax)**:
   - Mengakomodasi ASN yang mutasi, pensiun, atau berhenti di tengah tahun sehingga memiliki lebih dari satu akhir periode.
   - Mengakumulasikan penghasilan neto periode sebelumnya ke **Baris 15 (`Penghasilan Neto dari Pemotongan Sebelumnya`)**.
   - Mengkreditkan pajak yang disetor pada bukti potong sebelumnya pada **Baris 21 (`PPh Pasal 21 yang Telah Dipotong dari Pemotongan Sebelumnya`)** untuk menghasilkan PPh terutang bukti pemotongan ini pada **Baris 22**.
4. **Generator Formulir Bukti Potong 1721-BPA2**:
   - Tampilan cetak standar A4 Portrait yang identik dengan format resmi DJP e-Bupot 21/26 (24 baris rincian perhitungan fiskal, kode masa, identitas pemotong, dan kode QR verifikasi elektronik).
   - Fitur **Cetak Langsung** (dengan print-styling bersih tanpa elemen UI aplikasi) dan **Unduh Dokumen HTML Mandiri** yang portabel.
5. **Simulasi Cepat TER Bulanan**:
   - Modul kalkulator mandiri untuk menghitung pemotongan PPh 21 satu bulan berjalan secara instan berdasarkan status PTKP dan 4 komponen bruto.
6. **Pusat Bantuan & FAQ Pajak ASN**:
   - Panduan lengkap mengenai dasar hukum, alasan selisih lebih/kurang bayar pada masa Desember, mekanisme split withholding, dan petunjuk pelaporan SPT Tahunan Orang Pribadi di DJP Online.
7. **Penyimpanan Data Portabel (JSON Export / Import)**:
   - Kemudahan mencadangkan seluruh data pegawai, instansi, dan 12 bulan penghasilan ke dalam file JSON, serta memuat template data dummy ASN dalam 1 klik.

---

## Alur 4 Langkah Penggunaan

Aplikasi dilengkapi dengan kartu navigasi (*Next Step Card*) antar form untuk memandu pengguna dari awal hingga akhir siklus:

```
[Form 1: Data Pegawai & Instansi]
               │
               ▼
[Form 2: Input Penghasilan (12 Bulan)]
               │
               ▼
[Form 3: Hasil & Rekonsiliasi Fiskal]
               │
               ▼
[Form 4: Cetak Bukti Potong (1721-BPA2)]
```

1. **Langkah 1 (Form 1 - Data Pegawai & Instansi)**:
   - Masukkan identitas ASN (Nama, NIP, NIK, NPWP 15/16 digit, Pangkat/Golongan, Jabatan).
   - Pilih Status PTKP (otomatis menentukan Kategori TER: A, B, atau C).
   - Atur persentase Iuran Pensiun / THT (default 4.75%).
   - Isi identitas instansi utama dan NPWP Bendahara Pengeluaran (tersedia tombol sinkronisasi NPWP ke seluruh bulan).

2. **Langkah 2 (Form 2 - Input Penghasilan 12 Bulan)**:
   - Pilih bulan pada strip navigasi (Januari s.d. Desember).
   - Isi nominal Bruto, Pajak yang telah dipotong pada slip/daftar gaji, dan NPWP Bendahara Pemotong.
   - Gunakan tombol **"Salin Bulan Ini ke Bulan Berikutnya"** untuk mempercepat pengisian gaji tetap.
   - Tandai *checkbox* **Akhir Periode** pada masa terakhir (biasanya Masa 12 / Desember, atau bulan mutasi/berhenti).
   - Klik **"Hitung Ulang & Rekonsiliasi Pajak"**.

3. **Langkah 3 (Form 3 - Hasil & Rekonsiliasi)**:
   - Tinjau ringkasan fiskal: Total Bruto, Total Dipotong di Slip, PPh 21 Terutang Seharusnya, dan Selisih Fiskal (Kurang Bayar / Lebih Bayar / Nihil).
   - Pelajari rincian resmi Baris 9 s.d. Baris 24 untuk setiap akhir periode.
   - Evaluasi rekapitulasi pemotongan per NPWP Bendahara Pengeluaran (Split Withholding).

4. **Langkah 4 (Form 4 - Cetak Bukti Potong 1721-BPA2)**:
   - Pilih nomor bukti potong, tanggal penandatanganan, dan masa akhir periode yang diinginkan.
   - Cetak formulir resmi ke kertas/PDF A4 atau unduh sebagai file HTML mandiri.

---

## Dasar Hukum & Formula Perhitungan

### 1. Kategori TER Bulanan (PP 58/2023 & PMK 168/2023)
| Kategori TER | Status PTKP yang Termasuk | Nilai PTKP Setahun |
| :---: | :--- | :---: |
| **TER A** | TK/0 (Rp 54 Jt), TK/1 (Rp 58.5 Jt), K/0 (Rp 58.5 Jt) | s.d. Rp 58.500.000 |
| **TER B** | TK/2 (Rp 63 Jt), TK/3 (Rp 67.5 Jt), K/1 (Rp 63 Jt), K/2 (Rp 67.5 Jt) | Rp 63 Jt s.d. Rp 67.5 Jt |
| **TER C** | K/3 (Rp 72 Jt) | Rp 72.000.000 |

### 2. Tarif Progresif Pasal 17 Ayat (1) huruf a UU HPP
Diterapkan pada Penghasilan Kena Pajak (PKP) yang telah dibulatkan ke bawah hingga ribuan penuh:
- Lapisan I: Rp 0 s.d. Rp 60.000.000 $\rightarrow$ **5%**
- Lapisan II: > Rp 60.000.000 s.d. Rp 250.000.000 $\rightarrow$ **15%**
- Lapisan III: > Rp 250.000.000 s.d. Rp 500.000.000 $\rightarrow$ **25%**
- Lapisan IV: > Rp 500.000.000 s.d. Rp 5.000.000.000 $\rightarrow$ **30%**
- Lapisan V: > Rp 5.000.000.000 $\rightarrow$ **35%**

### 3. Pengurang Penghasilan Bruto
- **Biaya Jabatan**: $5\% \times \text{Penghasilan Bruto}$, maksimal Rp 500.000/bulan atau Rp 6.000.000/tahun (disesuaikan proporsional dengan jumlah masa kerja).
- **Iuran Pensiun / THT**: Persentase iuran yang dipotong dari gaji pokok dan tunjangan keluarga yang dibayar sendiri oleh ASN.

### 4. Rincian Baris Bukti Pemotongan 1721-BPA2 Multi-Periode
```
[Baris 14] Penghasilan Neto Masa Ini (Bruto - Biaya Jabatan - Iuran Pensiun)
[Baris 15] Penghasilan Neto dari Bukti Pemotongan Sebelumnya
[Baris 16] Jumlah Penghasilan Neto Setahun/Disetahunkan = (Baris 14 + Baris 15)
[Baris 17] Penghasilan Tidak Kena Pajak (PTKP)
[Baris 18] Penghasilan Kena Pajak (PKP) = (Baris 16 - Baris 17)
[Baris 19 & 20] PPh Pasal 21 Terutang Setahun (Tarif Pasal 17 atas Baris 18)
[Baris 21] PPh Pasal 21 Dipotong dari Bukti Pemotongan Sebelumnya
[Baris 22] PPh Pasal 21 Terutang pada Bukti Ini = (Baris 20 - Baris 21)
[Baris 23] PPh Pasal 21 yang Telah Dipotong Masa Sebelumnya (TER Bulanan)
[Baris 24] PPh Pasal 21 Kurang (Lebih) Dipotong Masa Terakhir = (Baris 22 - Baris 23)
```

---

## Fitur Manajemen Kuota & Dashboard Admin

Aplikasi dilengkapi panel administrasi untuk memonitor penggunaan serta mengontrol beban komputasi sistem:

1. **Wajib Login Google (Firebase Auth)**:
   - Semua pengguna masuk menggunakan akun Google resmi demi keamanan dan pencatatan audit trail yang akurat.
2. **Pengaturan Batas Proses Default Harian**:
   - Admin dapat menentukan batas maksimal proses default harian untuk seluruh akun terdaftar (standar: 25 proses/hari).
   - Pengaturan dapat diubah dan disimpan langsung dari UI Dashboard Admin.
3. **Pengaturan Bonus Proses Per Akun (Custom Daily Quota)**:
   - Admin dapat menambahkan kuota bonus (`+X` proses) bagi akun operator/bendahara tertentu yang memiliki intensitas input tinggi.
   - Total kuota harian akun tersebut menjadi: `Default Limit + Bonus Quota`.
   - Tabel manajemen akun bonus menyediakan fitur pencabutan bonus atau reset kuota terpakai hari ini.
4. **Audit Trail & Monitoring Proses**:
   - **Rekapitulasi per Email Pengguna**: Memantau jumlah perhitungan pajak, total aksi, jumlah NIK yang diproses, status batas kuota, serta tombol pintas pemberian bonus.
   - **Rekapitulasi per NIK Pegawai**: Menampilkan frekuensi perhitungan NIK, nilai bruto dan pajak terakhir, serta akun-akun pemrosesnya.
   - **Log Aktivitas Lengkap**: Riwayat pencatatan waktu nyata (Calculate, Login, Import, Export) dengan fitur filter dan ekspor CSV.

---

## Teknologi yang Digunakan

- **Runtime & Tools**: Node.js, [Vite 8](https://vitejs.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Backend / Authentication**: [Firebase Web SDK v13](https://firebase.google.com/) (Google Authentication & Local Fallback)
- **Icons**: [Lucide Icons](https://lucide.dev/) (SVG)
- **Arsitektur State**: Reactive AppState dengan Subscriber Pattern (tanpa framework eksternal berat seperti React/Vue/Angular, menghasilkan waktu render instan dan ukuran bundle yang sangat kecil).

---

## Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.0.0 atau lebih baru.
- npm atau pnpm/yarn.

### Langkah-Langkah

1. **Clone repositori**:
   ```bash
   git clone https://github.com/teguhe/kalkulator-pph21-asn.git
   cd kalkulator-pph21-asn
   ```

2. **Checkout ke branch pengembangan**:
   ```bash
   git checkout dev
   ```

3. **Install dependensi**:
   ```bash
   npm install
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka peramban pada alamat `http://localhost:5173/` (atau port yang ditampilkan terminal).

5. **Typecheck & Build Produksi**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
   Hasil build siap saji akan berada di direktori `dist/`.

6. **Preview hasil build**:
   ```bash
   npm run preview
   ```

---

## Konfigurasi Firebase (Login Google)

Aplikasi telah menyertakan konfigurasi default. Jika ingin menggunakan Firebase Project milik instansi Anda sendiri:
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Buat project baru dan tambahkan **Web App**.
3. Aktifkan **Authentication** dengan provider **Google**.
4. Tambahkan domain aplikasi Anda ke menu **Authorized Domains** di Firebase Auth settings.
5. Pada aplikasi Kalkulator PPh 21, buka menu **Dashboard Admin**, lalu masukkan kredensial:
   - `Firebase API Key`
   - `Auth Domain`
   - `Project ID`
   - `App ID`
6. Klik **Simpan Konfigurasi Firebase** (kredensial disimpan secara aman di browser lokal Anda).

---

## Struktur Direktori

```text
kalkulator-pph21-asn/
├── index.html                   # Entry point dokumen HTML
├── package.json                 # Metadata proyek & daftar dependensi
├── taxConstants.ts              # Tabel resmi TER PP 58/2023, PTKP, dan Tarif Pasal 17
├── tsconfig.json                # Konfigurasi TypeScript compiler
├── vite.config.ts               # Konfigurasi Vite & Tailwind CSS v4
└── src/
    ├── main.ts                  # Entry point aplikasi & event listeners
    ├── index.css                # Konfigurasi Tailwind CSS
    ├── types/
    │   └── index.ts             # Interface data TypeScript (Dataset, BPA2, Quota, dll)
    ├── state/
    │   └── appState.ts          # State management sentral (AppState)
    ├── services/
    │   ├── authService.ts       # Manajemen autentikasi Firebase & hak akses admin
    │   ├── quotaService.ts      # Logika batas kuota harian & bonus proses per akun
    │   └── logService.ts        # Pencatatan audit trail, rekap per email, dan rekap NIK
    ├── utils/
    │   ├── calculator.ts        # Mesin perhitungan TER, Pasal 17, dan BPA2 Multi-Periode
    │   ├── formatters.ts        # Pemformat Rupiah, Angka, NPWP, dan Tanggal Indonesia
    │   └── validator.ts         # Validasi integritas dataset perpajakan
    ├── components/
    │   ├── Header.ts            # Komponen bilah navigasi atas & indikator kuota
    │   ├── Sidebar.ts           # Komponen menu navigasi samping (collapsible/mobile)
    │   ├── Navigation.ts        # Bar navigasi tab horizontal
    │   └── Modals.ts            # Dialog konfirmasi reset, validasi, dan login
    └── views/
        ├── DashboardView.ts         # Tampilan beranda & ringkasan eksekutif
        ├── PegawaiView.ts           # Form 1: Data Identitas Pegawai & Instansi
        ├── InputPenghasilanView.ts  # Form 2: Input Penghasilan 12 Bulan (Multi-Komponen)
        ├── HasilRekonsiliasiView.ts # Form 3: Hasil & Rekonsiliasi Fiskal (Pasal 17 vs Slip)
        ├── Bpa2View.ts              # Form 4: Formulir Resmi Bukti Potong 1721-BPA2
        ├── TerBulananView.ts        # Simulasi Cepat Pemotongan TER Bulanan
        ├── FaqView.ts               # Pusat Bantuan & Pertanyaan Seputar Pajak ASN
        └── AdminView.ts             # Panel Pengawasan Admin, Kuota & Rekapitulasi
```

---

## Lisensi

Proyek ini dikembangkan untuk mempermudah pengelolaan perpajakan dan pelaporan bukti pemotongan PPh Pasal 21 ASN di Indonesia. Dilisensikan di bawah lisensi [MIT](LICENSE).
