# Product Requirements Document (PRD): Kalkulator PPh 21 & Generator BPA2

## 1. Project Overview & Objectives
- **Project Name:** Kalkulator PPh 21 & Generator BPA2 (Sistem Penghitungan PPh 21 ASN & Instansi Pemerintah)
- **Target Users:** Pegawai ASN, Bendahara Pengeluaran, dan Operator Kepegawaian.
- **Core Problem Statement:** Penghitungan PPh 21 bulanan menggunakan Tarif Efektif Rata-Rata (TER) dan rekonsiliasi akhir tahun/akhir periode sesuai PP 58 Tahun 2023 dan PMK 168 Tahun 2023 seringkali rumit, melibatkan banyak komponen penghasilan dari bendahara/OPD berbeda, serta membutuhkan cetakan formulir bukti potong yang presisi.
- **Success Metrics:** Aplikasi dapat menghitung PPh 21 akurat per bulan, mendeteksi akhir periode secara otomatis maupun manual, memvalidasi file JSON cadangan secara ketat, serta menyediakan sistem kuota harian dan dashboard admin eksklusif.

## 2. Tech Stack & Environment
- **Frontend / UI:** Single-Page Application (SPA) berbasis HTML5, Tailwind CSS, dan Alpine.js / Vanilla JavaScript modular yang ringan dan mudah di-*hosting* secara statis (GitHub Pages, Netlify, Vercel, atau cPanel).
- **Authentication & Database (Cloud & Kuota/Log):** Firebase Authentication (Google Sign-In) & Cloud Firestore untuk mencatat log login, log proses perhitungan, dan kuota harian.
- **Local Persistence & Backup:** Impor/Ekspor file JSON dengan skema ketat untuk penyimpanan data offline di perangkat lokal user.

## 3. Core Features & User Stories

### 3.1 Perhitungan PPh 21 Setahun (Form 1 s.d. 4)
- **Form 1: Data Pegawai & Instansi:** Input Nama, NIK, NPWP, NIP, Pangkat/Golongan, Jabatan, Status PTKP (TK/0 s.d. K/3), Kategori TER (A, B, C), Persen Iuran Pensiun/THT, dan Data Instansi Utama.
- **Form 2: Input Penghasilan (12 Bulan):** 4 komponen penghasilan bruto per bulan (Gaji Melekat, TPP, Penghasilan Lain 1 & 2), pajak dipotong, NPWP bendahara, serta pilihan metode TER bulanan vs. Akhir Periode (Pasal 17).
- **Form 3: Hasil & Rekonsiliasi:** Rekapitulasi tahunan, perbandingan pajak terutang vs dipotong, dan breakdown lapisan tarif progresif Pasal 17.
- **Form 4: Cetak Bukti Potong 1721-BPA2:** Generator cetak bukti pemotongan resmi 1721-BPA2 dengan rekapitulasi per bendahara pemotong (Split Withholding).

### 3.2 Perhitungan PPh 21 TER Bulanan (Fitur Baru)
- Menggunakan data yang tersinkronisasi dengan Form 1 (Nama, NIP, Status PTKP, dan Kategori TER A/B/C).
- Input 4 komponen penghasilan bulanan: Gaji Plus Tunjangan Melekat, TPP, Penghasilan Lainnya 1 (Upah Pungut), dan Penghasilan Lainnya 2 (Honorarium Lintas OPD).
- Perhitungan tarif efektif rata-rata (%) dan nominal pajak PPh 21 untuk masing-masing dari ke-4 komponen penghasilan secara terpisah.
- Perhitungan pajak ketika ke-4 komponen penghasilan digabung (total bruto sebulan, tarif TER gabungan, dan nominal pajak gabungan).
- Analisis komparasi selisih (potensi kurang potong/lebih potong bulanan akibat perbedaan pemotongan terpisah bendahara vs gabungan sebulan) sesuai PP 58/2023 & PMK 168/2023.
- Fitur interoperabilitas: salin data ke/dari Form 2 (Input Penghasilan 12 Bulan) dan cetak ringkasan TER bulanan.

### 3.3 Dashboard & Sidebar Navigasi
- Setelah login, pengguna disuguhkan **Dashboard** dengan penjelasan pendek mengenai aplikasi dan ringkasan fitur.
- **Sidebar di sebelah kiri** menyediakan menu navigasi:
  1. **Dashboard:** Ringkasan sistem dan status pegawai.
  2. **PPh TER Bulanan:** Perhitungan cepat 4 penghasilan bulanan (parsial vs gabungan).
  3. **PPh TER Setahun:** Alur lengkap Form 1 sampai 4.
  4. **FAQ:** Pusat bantuan dan panduan resmi DJP.

### 3.4 Cetak Formulir BPA2 (Bukti Potong PPh 21)
- Fitur cetak/export Formulir 1721-BPA2 untuk bulan yang dilakukan perhitungan akhir periode atau bulan Desember, mengakomodasi rekapitulasi per NPWP Bendahara Pemotong.

### 3.5 Manajemen File JSON & Validasi
- Aplikasi dimulai dengan data kosong, dilengkapi tombol **Load Template Dummy ASN** untuk sampel perhitungan.
- Fitur Simpan (*Export*) dan Muat (*Import*) file `.json` dengan validasi skema ketat (menolak file korup/tidak valid).

### 3.6 Autentikasi, Kuota, & Panel Admin
- **Google Sign-In:** Kuota perhitungan 25x/hari untuk user login, 3x/hari untuk tamu (tanpa login). Admin memiliki kuota unlimited.
- **Log Aktivitas:** Log login user dan log proses perhitungan.
- **Dashboard Admin:** Hanya dapat diakses oleh email `teguhe@gmail.com`, `teguhe2@gmail.com`, serta admin tambahan yang ditambahkan melalui menu Pengaturan Admin.

### 3.7 Pusat Bantuan & FAQ
- Modul FAQ lengkap mencakup PPh 21 & TER, PTKP, NPWP Bendahara Pemotong (Split Withholding), BPA2, Kewajiban Lapor SPT Tahunan, dan Panduan Aplikasi.
