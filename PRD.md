# Product Requirements Document (PRD): Kalkulator PPh 21 & Generator BPA2

## 1. Project Overview & Objectives
- **Project Name:** Kalkulator PPh 21 & Generator BPA2 (Sistem Penghitungan PPh 21 ASN/PNS & Instansi Pemerintah)
- **Target Users:** Pegawai ASN/PNS, Bendahara Pengeluaran, dan Operator Kepegawaian.
- **Core Problem Statement:** Penghitungan PPh 21 bulanan menggunakan Tarif Efektif Rata-Rata (TER) dan rekonsiliasi akhir tahun/akhir periode sesuai PP 58 Tahun 2023 dan PMK 168 Tahun 2023 seringkali rumit, melibatkan banyak komponen penghasilan dari bendahara/OPD berbeda, serta membutuhkan cetakan formulir bukti potong yang presisi.
- **Success Metrics:** Aplikasi dapat menghitung PPh 21 akurat per bulan, mendeteksi akhir periode secara otomatis maupun manual, memvalidasi file JSON cadangan secara ketat, serta menyediakan sistem kuota harian dan dashboard admin eksklusif.

## 2. Tech Stack & Environment
- **Frontend / UI:** Single-Page Application (SPA) berbasis HTML5, Tailwind CSS, dan Alpine.js / Vanilla JavaScript modular yang ringan dan mudah di-*hosting* secara statis (GitHub Pages, Netlify, Vercel, atau cPanel).
- **Authentication & Database (Cloud & Kuota/Log):** Firebase Authentication (Google Sign-In) & Cloud Firestore untuk mencatat log login, log proses perhitungan, dan kuota harian.
- **Local Persistence & Backup:** Impor/Ekspor file JSON dengan skema ketat untuk penyimpanan data offline di perangkat lokal user.

## 3. Core Features & User Stories

### 3.1 Data Perorangan & Pengaturan Pegawai
- Input Nama, NIK, NPWP, NIP, Pangkat/Golongan, Jabatan, Status PTKP (TK/0 s.d. K/3), Kategori TER (A, B, C), Persen Iuran Pensiun/THT, dan Data Instansi Utama.

### 3.2 Input Penghasilan 4 Komponen per Bulan
Setiap bulan memiliki 4 komponen penghasilan bruto, di mana masing-masing komponen memiliki input:
1. **Gaji Plus Tunjangan Melekat** (Bruto, Pajak Sudah Dipotong, NPWP Bendahara Pemotong)
2. **Tunjangan Tambahan Penghasilan / TPP** (Bruto, Pajak Sudah Dipotong, NPWP Bendahara Pemotong)
3. **Penghasilan Lainnya 1 (Misal: Upah Pungut, dll)** (Bruto, Pajak Sudah Dipotong, NPWP Bendahara Pemotong)
4. **Penghasilan Lainnya 2 (Misal: Honorarium Lintas OPD, dll)** (Bruto, Pajak Sudah Dipotong, NPWP Bendahara Pemotong)

### 3.3 Pilihan Metode Perhitungan & Akhir Periode
- Pilihan metode: **TER Bulanan** vs **Akhir Periode / Desember** di setiap bulan.
- Otomatis melakukan perhitungan akumulatif dan koreksi selisih pajak di bulan yang ditandai akhir periode atau di bulan Desember.

### 3.4 Cetak Formulir BPA2 (Bukti Potong PPh 21)
- Fitur cetak/export Formulir 1721-BPA2 untuk bulan yang dilakukan perhitungan akhir periode atau bulan Desember, mengakomodasi rekapitulasi per NPWP Bendahara Pemotong.

### 3.5 Manajemen File JSON & Validasi
- Aplikasi dimulai dengan data kosong, dilengkapi tombol **Load Template Dummy ASN/PNS** untuk sampel perhitungan.
- Fitur Simpan (*Export*) dan Muat (*Import*) file `.json` dengan validasi skema ketat (menolak file korup/tidak valid).

### 3.6 Autentikasi, Kuota, & Panel Admin
- **Google Sign-In:** Kuota perhitungan 25x/hari untuk user login, 3x/hari untuk tamu (tanpa login). Admin memiliki kuota unlimited.
- **Log Aktivitas:** Log login user dan log proses perhitungan.
- **Dashboard Admin:** Hanya dapat diakses oleh email `teguhe@gmail.com`, `teguhe2@gmail.com`, serta admin tambahan yang ditambahkan melalui menu Pengaturan Admin.

### 3.7 Pusat Bantuan & FAQ
- Modul FAQ lengkap mencakup PPh 21 & TER, PTKP, NPWP Bendahara Pemotong (Split Withholding), BPA2, Kewajiban Lapor SPT Tahunan, dan Panduan Aplikasi.
