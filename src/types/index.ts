import { StatusPTKP, KategoriTER } from '../../taxConstants';

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
  total_bruto_akumulasi: number;
  total_gaji_akumulasi: number;
  total_tpp_akumulasi?: number;
  total_honor1_akumulasi?: number;
  total_honor2_akumulasi?: number;
  biaya_jabatan: number;
  max_biaya_jabatan: number;
  iuran_pensiun: number;
  total_pengurang: number;
  penghasilan_neto: number;
  ptkp: number;
  status_ptkp: StatusPTKP;
  pkp: number;
  pph21_pasal17_setahun: number;
  pajak_terutang_sebelumnya: number; // bulan 1 s.d. (m-1)
  pph21_terutang_bulan_terakhir: number; // pph21_setahun - pajak_terutang_sebelumnya
  total_pajak_sudah_dipotong_tahunan: number;
  selisih_tahunan: number; // pph21_pasal17_setahun - total_pajak_sudah_dipotong_tahunan
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
