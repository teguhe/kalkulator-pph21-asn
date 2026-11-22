import type { StatusPTKP, KategoriTER } from '../../taxConstants';
export type { StatusPTKP, KategoriTER };

export interface InstansiData {
  nama_instansi: string;
  nama_bendahara_utama: string;
  nip_bendahara_utama: string;
  npwp_instansi_utama: string;
  kota_penandatangan: string;
}

export interface PegawaiData {
  nama: string;
  nik: string;
  npwp: string;
  nip: string;
  pangkat_golongan: string;
  jabatan: string;
  status_ptkp: StatusPTKP;
  kategori_ter: KategoriTER;
  persen_iuran_pensiun: number; // e.g. 4.75
  instansi: InstansiData;
}

export interface KomponenDetail {
  label: string;
  bruto: number;
  pajak_dipotong: number;
  npwp_bendahara: string;
}

export interface KomponenPenghasilan {
  penghasilan_1: KomponenDetail; // Gaji Plus Tunjangan Melekat
  penghasilan_2: KomponenDetail; // TPP / Tunjangan Kinerja
  penghasilan_3: KomponenDetail; // Upah Pungut / Honorarium 1
  penghasilan_4: KomponenDetail; // Honorarium Lintas OPD 2
}

export type MetodePerhitungan = 'TER_BULANAN' | 'AKHIR_PERIODE';

export interface PeriodeBulan {
  bulan: number; // 1 to 12
  nama_bulan: string;
  metode_perhitungan: MetodePerhitungan;
  is_akhir_periode: boolean;
  penghasilan_neto_sebelumnya?: number; // Optional override untuk Baris 15 BPA2
  pph21_dipotong_sebelumnya?: number; // Optional override untuk Baris 21 BPA2
  komponen_penghasilan: KomponenPenghasilan;
}

export interface PPh21Dataset {
  app_version: string;
  exported_at: string;
  pegawai: PegawaiData;
  periode_bulanan: PeriodeBulan[];
}

// Calculation result structures
export interface HasilBulan {
  bulan: number;
  nama_bulan: string;
  metode_perhitungan: MetodePerhitungan;
  is_akhir_periode: boolean;
  bruto_total: number;
  pajak_sudah_dipotong: number;
  ter_rate?: number; // % if TER
  pph21_terutang: number;
  selisih: number; // pph21_terutang - pajak_sudah_dipotong (positif: kurang potong, negatif: lebih potong)
  // Details per component
  komponen: {
    k1_bruto: number;
    k1_pajak: number;
    k2_bruto: number;
    k2_pajak: number;
    k3_bruto: number;
    k3_pajak: number;
    k4_bruto: number;
    k4_pajak: number;
  };
}

export interface LapisanPajakDetail {
  lapisan: number;
  rentang: string;
  tarif: number;
  pkp_lapisan: number;
  pajak_lapisan: number;
}

export interface HasilAkhirPeriode {
  bulan_mulai: number;
  bulan_akhir: number;
  nama_bulan_mulai: string;
  nama_bulan_akhir: string;
  kode_masa: string; // e.g. '01 - 04' or '01 - 12'
  jumlah_bulan: number;
  total_bruto_akumulasi: number; // Baris 9
  total_gaji_akumulasi: number; // Baris 1
  total_tpp_akumulasi?: number;
  total_honor1_akumulasi?: number;
  total_honor2_akumulasi?: number;
  biaya_jabatan: number; // Baris 10
  max_biaya_jabatan: number;
  iuran_pensiun: number; // Baris 11
  total_pengurang: number; // Baris 13
  penghasilan_neto: number; // Baris 14: Jumlah Penghasilan Neto masa ini (9 - 13)
  penghasilan_neto_sebelumnya: number; // Baris 15: Penghasilan Neto dari Pemotongan Sebelumnya
  jumlah_penghasilan_neto_setahun: number; // Baris 16: Jumlah Penghasilan Neto untuk Perhitungan PPh 21 (Setahun / Disetahunkan) (14 + 15)
  ptkp: number; // Baris 17: PTKP
  status_ptkp: StatusPTKP;
  pkp: number; // Baris 18: PKP Setahun / Disetahunkan (16 - 17)
  pph21_pasal17_setahun: number; // Baris 19 & 20: PPh 21 Terutang Setahun / Disetahunkan
  pph21_dipotong_sebelumnya: number; // Baris 21: PPh 21 Dipotong dari Bukti Pemotongan Sebelumnya
  pph21_terutang_bukti_ini: number; // Baris 22: PPh 21 Terutang pada Bukti Pemotongan Ini (20 - 21)
  pajak_terutang_sebelumnya: number; // Baris 23: PPh 21 yang Telah Dipotong (pada bulan non-akhir di periode ini)
  pph21_terutang_bulan_terakhir: number; // Baris 24: PPh 21 Kurang (Lebih) Dipotong pada Masa Terakhir (22 - 23)
  total_pajak_sudah_dipotong_tahunan: number;
  selisih_tahunan: number; // pph21_terutang_bukti_ini - total_pajak_sudah_dipotong_tahunan
  lapisan_breakdown: LapisanPajakDetail[];
  rekap_bendahara_periode?: RekapitulasiBendahara[];
}

export interface RekapitulasiBendahara {
  npwp_bendahara: string;
  nama_keterangan: string;
  total_bruto: number;
  total_pajak_dipotong: number;
  persentase_bruto: number;
  daftar_komponen: string[];
}

export interface RingkasanTahunan {
  hasil_bulanan: HasilBulan[];
  daftar_akhir_periode: HasilAkhirPeriode[];
  akhir_periode?: HasilAkhirPeriode;
  total_bruto_setahun: number;
  total_pajak_dipotong_setahun: number;
  total_pph21_terutang_setahun: number;
  total_selisih_setahun: number;
  rekap_bendahara: RekapitulasiBendahara[];
}

// User & Auth & Logs
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface LogItem {
  id: string;
  timestamp: string;
  type: 'LOGIN' | 'CALCULATE' | 'IMPORT' | 'EXPORT';
  userEmail: string;
  details: string;
  meta?: Record<string, any>;
}

export interface QuotaState {
  todayKey: string; // YYYY-MM-DD
  usedToday: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
  defaultLimit?: number;
  bonusQuota?: number;
}

export interface UserBonusQuotaItem {
  email: string;
  bonus: number;
  totalLimit: number;
}

export interface EmailProcessSummary {
  email: string;
  totalCalculations: number;
  totalActions: number;
  uniqueNIKs: string[];
  lastActive: string;
}

export interface NIKProcessSummary {
  nik: string;
  nama: string;
  nip: string;
  instansi: string;
  totalCalculations: number;
  lastTotalBruto: number;
  lastTotalPajak: number;
  lastProcessedAt: string;
  processedByEmails: string[];
}

// Navigasi & Tab
export type TabType = 'dashboard' | 'ter-bulanan' | 'pegawai' | 'input' | 'hasil' | 'bpa2' | 'faq' | 'admin';

// Tipe Data PPh 21 TER Bulanan
export interface TerBulananKomponenItem {
  id: string;
  nama: string;
  bruto: number;
  keterangan: string;
}

export interface TerBulananInputState {
  penghasilan_1: TerBulananKomponenItem;
  penghasilan_2: TerBulananKomponenItem;
  penghasilan_3: TerBulananKomponenItem;
  penghasilan_4: TerBulananKomponenItem;
}

export interface HasilItemTerBulanan {
  id: string;
  nama: string;
  keterangan: string;
  bruto: number;
  ter_rate: number; // Dalam persen (%)
  pajak: number;
  netto: number;
}

export interface HasilTerBulananPerhitungan {
  items: HasilItemTerBulanan[];
  total_bruto_terpisah: number;
  total_pajak_terpisah: number;
  total_netto_terpisah: number;
  bruto_sebulan: number;
  ter_rate_gabungan: number;
  pajak_gabungan: number;
  netto_gabungan: number;
  selisih: number; // pajak_gabungan - total_pajak_terpisah (positif: kurang potong)
}

