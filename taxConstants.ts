/**
 * KONSTANTA & TABEL RESMI PERPAJAKAN PPh 21 (PP 58 Tahun 2023 & PMK 168 Tahun 2023)
 * Siap di-import langsung ke dalam project di Antigravity.
 */

export type StatusPTKP = 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3' | 'K/0' | 'K/1' | 'K/2' | 'K/3';
export type KategoriTER = 'A' | 'B' | 'C';

export interface PTKPConfig {
  status: StatusPTKP;
  nilaiTahunan: number;
  kategoriTER: KategoriTER;
  deskripsi: string;
}

export interface TERBracket {
  min: number;
  max: number; // Gunakan Infinity untuk lapisan tertinggi
  rate: number; // Dalam persen (contoh: 1.5 berarti 1.5%)
}

export interface Pasal17Bracket {
  min: number;
  max: number;
  rate: number; // Dalam desimal (contoh: 0.05 berarti 5%)
}

export const SUPER_ADMIN_EMAILS: readonly string[] = [
  'teguhe@gmail.com',
  'teguhe2@gmail.com'
];

export const QUOTA_CONFIG = {
  GUEST_DAILY_LIMIT: 3,
  USER_DAILY_LIMIT: 25,
  ADMIN_DAILY_LIMIT: Infinity,
};

export const BIAYA_JABATAN_CONFIG = {
  RATE: 0.05, // 5% dari Penghasilan Bruto
  MAX_BULANAN: 500_000,
  MAX_TAHUNAN: 6_000_000,
};

export const PTKP_MAP: Record<StatusPTKP, PTKPConfig> = {
  'TK/0': { status: 'TK/0', nilaiTahunan: 54_000_000, kategoriTER: 'A', deskripsi: 'Tidak Kawin, 0 Tanggungan' },
  'TK/1': { status: 'TK/1', nilaiTahunan: 58_500_000, kategoriTER: 'A', deskripsi: 'Tidak Kawin, 1 Tanggungan' },
  'TK/2': { status: 'TK/2', nilaiTahunan: 63_000_000, kategoriTER: 'B', deskripsi: 'Tidak Kawin, 2 Tanggungan' },
  'TK/3': { status: 'TK/3', nilaiTahunan: 67_500_000, kategoriTER: 'B', deskripsi: 'Tidak Kawin, 3 Tanggungan' },
  'K/0':  { status: 'K/0',  nilaiTahunan: 58_500_000, kategoriTER: 'A', deskripsi: 'Kawin, 0 Tanggungan' },
  'K/1':  { status: 'K/1',  nilaiTahunan: 63_000_000, kategoriTER: 'B', deskripsi: 'Kawin, 1 Tanggungan' },
  'K/2':  { status: 'K/2',  nilaiTahunan: 67_500_000, kategoriTER: 'B', deskripsi: 'Kawin, 2 Tanggungan' },
  'K/3':  { status: 'K/3',  nilaiTahunan: 72_000_000, kategoriTER: 'C', deskripsi: 'Kawin, 3 Tanggungan' },
};

// Tarif Efektif Rata-Rata (TER) Bulanan - Kategori A (TK/0, TK/1, K/0) - 44 Lapisan
export const TER_KATEGORI_A: TERBracket[] = [
  { min: 0, max: 5_400_000, rate: 0.0 },
  { min: 5_400_001, max: 5_650_000, rate: 0.25 },
  { min: 5_650_001, max: 5_950_000, rate: 0.5 },
  { min: 5_950_001, max: 6_300_000, rate: 0.75 },
  { min: 6_300_001, max: 6_750_000, rate: 1.0 },
  { min: 6_750_001, max: 7_500_000, rate: 1.25 },
  { min: 7_500_001, max: 8_550_000, rate: 1.5 },
  { min: 8_550_001, max: 9_650_000, rate: 1.75 },
  { min: 9_650_001, max: 10_050_000, rate: 2.0 },
  { min: 10_050_001, max: 10_350_000, rate: 2.25 },
  { min: 10_350_001, max: 10_700_000, rate: 2.5 },
  { min: 10_700_001, max: 11_050_000, rate: 3.0 },
  { min: 11_050_001, max: 11_600_000, rate: 3.5 },
  { min: 11_600_001, max: 12_500_000, rate: 4.0 },
  { min: 12_500_001, max: 13_750_000, rate: 5.0 },
  { min: 13_750_001, max: 15_100_000, rate: 6.0 },
  { min: 15_100_001, max: 16_950_000, rate: 7.0 },
  { min: 16_950_001, max: 19_750_000, rate: 8.0 },
  { min: 19_750_001, max: 24_150_000, rate: 9.0 },
  { min: 24_150_001, max: 26_450_000, rate: 10.0 },
  { min: 26_450_001, max: 28_000_000, rate: 11.0 },
  { min: 28_000_001, max: 30_050_000, rate: 12.0 },
  { min: 30_050_001, max: 32_400_000, rate: 13.0 },
  { min: 32_400_001, max: 35_400_000, rate: 14.0 },
  { min: 35_400_001, max: 39_100_000, rate: 15.0 },
  { min: 39_100_001, max: 43_850_000, rate: 16.0 },
  { min: 43_850_001, max: 47_800_000, rate: 17.0 },
  { min: 47_800_001, max: 51_400_000, rate: 18.0 },
  { min: 51_400_001, max: 56_300_000, rate: 19.0 },
  { min: 56_300_001, max: 62_200_000, rate: 20.0 },
  { min: 62_200_001, max: 68_600_000, rate: 21.0 },
  { min: 68_600_001, max: 77_500_000, rate: 22.0 },
  { min: 77_500_001, max: 89_000_000, rate: 23.0 },
  { min: 89_000_001, max: 103_000_000, rate: 24.0 },
  { min: 103_000_001, max: 125_000_000, rate: 25.0 },
  { min: 125_000_001, max: 157_000_000, rate: 26.0 },
  { min: 157_000_001, max: 206_000_000, rate: 27.0 },
  { min: 206_000_001, max: 337_000_000, rate: 28.0 },
  { min: 337_000_001, max: 454_000_000, rate: 29.0 },
  { min: 454_000_001, max: 550_000_000, rate: 30.0 },
  { min: 550_000_001, max: 695_000_000, rate: 31.0 },
  { min: 695_000_001, max: 910_000_000, rate: 32.0 },
  { min: 910_000_001, max: 1_400_000_000, rate: 33.0 },
  { min: 1_400_000_001, max: Infinity, rate: 34.0 },
];

// Tarif Efektif Rata-Rata (TER) Bulanan - Kategori B (TK/2, TK/3, K/1, K/2) - 40 Lapisan
export const TER_KATEGORI_B: TERBracket[] = [
  { min: 0, max: 6_200_000, rate: 0.0 },
  { min: 6_200_001, max: 6_500_000, rate: 0.25 },
  { min: 6_500_001, max: 6_850_000, rate: 0.5 },
  { min: 6_850_001, max: 7_300_000, rate: 0.75 },
  { min: 7_300_001, max: 9_200_000, rate: 1.0 },
  { min: 9_200_001, max: 10_750_000, rate: 1.5 },
  { min: 10_750_001, max: 11_250_000, rate: 2.0 },
  { min: 11_250_001, max: 11_600_000, rate: 2.5 },
  { min: 11_600_001, max: 12_600_000, rate: 3.0 },
  { min: 12_600_001, max: 13_600_000, rate: 4.0 },
  { min: 13_600_001, max: 14_950_000, rate: 5.0 },
  { min: 14_950_001, max: 16_400_000, rate: 6.0 },
  { min: 16_400_001, max: 18_450_000, rate: 7.0 },
  { min: 18_450_001, max: 21_850_000, rate: 8.0 },
  { min: 21_850_001, max: 26_000_000, rate: 9.0 },
  { min: 26_000_001, max: 27_700_000, rate: 10.0 },
  { min: 27_700_001, max: 29_350_000, rate: 11.0 },
  { min: 29_350_001, max: 31_450_000, rate: 12.0 },
  { min: 31_450_001, max: 33_950_000, rate: 13.0 },
  { min: 33_950_001, max: 37_100_000, rate: 14.0 },
  { min: 37_100_001, max: 41_100_000, rate: 15.0 },
  { min: 41_100_001, max: 45_800_000, rate: 16.0 },
  { min: 45_800_001, max: 49_500_000, rate: 17.0 },
  { min: 49_500_001, max: 53_800_000, rate: 18.0 },
  { min: 53_800_001, max: 58_500_000, rate: 19.0 },
  { min: 58_500_001, max: 64_000_000, rate: 20.0 },
  { min: 64_000_001, max: 71_000_000, rate: 21.0 },
  { min: 71_000_001, max: 80_000_000, rate: 22.0 },
  { min: 80_000_001, max: 93_000_000, rate: 23.0 },
  { min: 93_000_001, max: 109_000_000, rate: 24.0 },
  { min: 109_000_001, max: 129_000_000, rate: 25.0 },
  { min: 129_000_001, max: 163_000_000, rate: 26.0 },
  { min: 163_000_001, max: 211_000_000, rate: 27.0 },
  { min: 211_000_001, max: 374_000_000, rate: 28.0 },
  { min: 374_000_001, max: 459_000_000, rate: 29.0 },
  { min: 459_000_001, max: 555_000_000, rate: 30.0 },
  { min: 555_000_001, max: 704_000_000, rate: 31.0 },
  { min: 704_000_001, max: 957_000_000, rate: 32.0 },
  { min: 957_000_001, max: 1_405_000_000, rate: 33.0 },
  { min: 1_405_000_001, max: Infinity, rate: 34.0 },
];

// Tarif Efektif Rata-Rata (TER) Bulanan - Kategori C (K/3) - 41 Lapisan
export const TER_KATEGORI_C: TERBracket[] = [
  { min: 0, max: 6_600_000, rate: 0.0 },
  { min: 6_600_001, max: 6_950_000, rate: 0.25 },
  { min: 6_950_001, max: 7_350_000, rate: 0.5 },
  { min: 7_350_001, max: 7_800_000, rate: 0.75 },
  { min: 7_800_001, max: 8_850_000, rate: 1.0 },
  { min: 8_850_001, max: 9_800_000, rate: 1.25 },
  { min: 9_800_001, max: 10_950_000, rate: 1.5 },
  { min: 10_950_001, max: 11_200_000, rate: 1.75 },
  { min: 11_200_001, max: 12_050_000, rate: 2.0 },
  { min: 12_050_001, max: 12_950_000, rate: 3.0 },
  { min: 12_950_001, max: 14_150_000, rate: 4.0 },
  { min: 14_150_001, max: 15_550_000, rate: 5.0 },
  { min: 15_550_001, max: 17_050_000, rate: 6.0 },
  { min: 17_050_001, max: 19_500_000, rate: 7.0 },
  { min: 19_500_001, max: 22_700_000, rate: 8.0 },
  { min: 22_700_001, max: 26_600_000, rate: 9.0 },
  { min: 26_600_001, max: 28_100_000, rate: 10.0 },
  { min: 28_100_001, max: 30_100_000, rate: 11.0 },
  { min: 30_100_001, max: 32_600_000, rate: 12.0 },
  { min: 32_600_001, max: 35_400_000, rate: 13.0 },
  { min: 35_400_001, max: 38_900_000, rate: 14.0 },
  { min: 38_900_001, max: 43_000_000, rate: 15.0 },
  { min: 43_000_001, max: 47_400_000, rate: 16.0 },
  { min: 47_400_001, max: 51_200_000, rate: 17.0 },
  { min: 51_200_001, max: 55_800_000, rate: 18.0 },
  { min: 55_800_001, max: 60_400_000, rate: 19.0 },
  { min: 60_400_001, max: 66_700_000, rate: 20.0 },
  { min: 66_700_001, max: 74_500_000, rate: 21.0 },
  { min: 74_500_001, max: 83_200_000, rate: 22.0 },
  { min: 83_200_001, max: 95_600_000, rate: 23.0 },
  { min: 95_600_001, max: 110_000_000, rate: 24.0 },
  { min: 110_000_001, max: 134_000_000, rate: 25.0 },
  { min: 134_000_001, max: 169_000_000, rate: 26.0 },
  { min: 169_000_001, max: 221_000_000, rate: 27.0 },
  { min: 221_000_001, max: 390_000_000, rate: 28.0 },
  { min: 390_000_001, max: 463_000_000, rate: 29.0 },
  { min: 463_000_001, max: 561_000_000, rate: 30.0 },
  { min: 561_000_001, max: 709_000_000, rate: 31.0 },
  { min: 709_000_001, max: 965_000_000, rate: 32.0 },
  { min: 965_000_001, max: 1_419_000_000, rate: 33.0 },
  { min: 1_419_000_001, max: Infinity, rate: 34.0 },
];

export const TER_TABLES: Record<KategoriTER, TERBracket[]> = {
  A: TER_KATEGORI_A,
  B: TER_KATEGORI_B,
  C: TER_KATEGORI_C,
};

// Tarif Progresif Pasal 17 UU HPP (Untuk Perhitungan Akhir Periode / Desember)
export const PASAL_17_BRACKETS: Pasal17Bracket[] = [
  { min: 0, max: 60_000_000, rate: 0.05 },
  { min: 60_000_000, max: 250_000_000, rate: 0.15 },
  { min: 250_000_000, max: 500_000_000, rate: 0.25 },
  { min: 500_000_000, max: 5_000_000_000, rate: 0.30 },
  { min: 5_000_000_000, max: Infinity, rate: 0.35 },
];

/**
 * Helper: Mencari tarif TER (%) berdasarkan Kategori TER dan Total Penghasilan Bruto Sebulan
 */
export function getTERRate(kategori: KategoriTER, brutoSebulan: number): number {
  if (brutoSebulan <= 0) return 0;
  const table = TER_TABLES[kategori];
  const bracket = table.find((b) => brutoSebulan >= b.min && brutoSebulan <= b.max);
  return bracket ? bracket.rate : 34.0;
}

/**
 * Helper: Menghitung PPh 21 Setahun dengan Tarif Progresif Pasal 17 dari PKP (dibulatkan ribuan ke bawah)
 */
export function calculatePasal17Tax(pkpInput: number): number {
  const pkp = Math.max(0, Math.floor(pkpInput / 1000) * 1000);
  if (pkp <= 0) return 0;

  let remaining = pkp;
  let totalTax = 0;

  for (const bracket of PASAL_17_BRACKETS) {
    const rangeSize = bracket.max === Infinity ? remaining : bracket.max - bracket.min;
    const taxableInBracket = Math.min(remaining, rangeSize);
    if (taxableInBracket > 0) {
      totalTax += Math.floor(taxableInBracket * bracket.rate);
      remaining -= taxableInBracket;
    }
    if (remaining <= 0) break;
  }

  return totalTax;
}
