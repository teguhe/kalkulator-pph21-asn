import { PPh21Dataset, PegawaiData, PeriodeBulan, StatusPTKP, KategoriTER } from '../types';
import { PTKP_MAP } from '../../taxConstants';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData?: PPh21Dataset;
}

const VALID_PTKP = Object.keys(PTKP_MAP) as StatusPTKP[];
const VALID_TER: KategoriTER[] = ['A', 'B', 'C'];

export function validatePPh21Dataset(raw: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      valid: false,
      errors: ['File bukan merupakan objek JSON yang valid.'],
      warnings: []
    };
  }

  const obj = raw as Record<string, any>;

  // Check version / metadata
  if (!obj.app_version) {
    warnings.push('Field "app_version" tidak ditemukan. Aplikasi akan menggunakan versi default 1.0.0.');
  }

  // 1. Validasi Pegawai
  if (!obj.pegawai || typeof obj.pegawai !== 'object') {
    errors.push('Objek "pegawai" wajib ada dalam file JSON.');
  } else {
    const p = obj.pegawai;
    if (!p.nama || typeof p.nama !== 'string' || p.nama.trim().length === 0) {
      errors.push('Field "pegawai.nama" wajib diisi dengan teks nama yang valid.');
    }
    if (!p.status_ptkp || !VALID_PTKP.includes(p.status_ptkp)) {
      errors.push(`Field "pegawai.status_ptkp" tidak valid. Harus salah satu dari: ${VALID_PTKP.join(', ')}.`);
    }
    if (p.kategori_ter && !VALID_TER.includes(p.kategori_ter)) {
      warnings.push(`Kategori TER "${p.kategori_ter}" tidak standar. Akan diselaraskan otomatis berdasarkan PTKP.`);
    }
    if (typeof p.persen_iuran_pensiun !== 'number' || p.persen_iuran_pensiun < 0 || p.persen_iuran_pensiun > 100) {
      warnings.push('Persentase iuran pensiun tidak valid atau kosong. Diatur ke default 4.75%.');
    }

    // Validasi Instansi
    if (!p.instansi || typeof p.instansi !== 'object') {
      warnings.push('Objek "pegawai.instansi" kosong atau tidak lengkap.');
    }
  }

  // 2. Validasi Periode Bulanan
  if (!Array.isArray(obj.periode_bulanan)) {
    errors.push('Field "periode_bulanan" harus berupa array data 12 bulan.');
  } else if (obj.periode_bulanan.length !== 12) {
    errors.push(`Field "periode_bulanan" harus berisi tepat 12 bulan (ditemukan ${obj.periode_bulanan.length} bulan).`);
  } else {
    for (let i = 0; i < 12; i++) {
      const b = obj.periode_bulanan[i];
      const bulanNum = i + 1;
      if (!b || typeof b !== 'object') {
        errors.push(`Data bulan ke-${bulanNum} tidak valid (bukan objek).`);
        continue;
      }
      if (b.bulan !== bulanNum) {
        warnings.push(`Nomor bulan pada urutan ke-${bulanNum} tertulis ${b.bulan}. Telah diselaraskan ke bulan ${bulanNum}.`);
      }
      if (!b.komponen_penghasilan || typeof b.komponen_penghasilan !== 'object') {
        errors.push(`Bulan ke-${bulanNum} tidak memiliki objek "komponen_penghasilan".`);
        continue;
      }

      // Periksa 4 komponen penghasilan
      const kp = b.komponen_penghasilan;
      const comps = ['penghasilan_1', 'penghasilan_2', 'penghasilan_3', 'penghasilan_4'] as const;

      for (const compKey of comps) {
        const comp = kp[compKey];
        if (!comp || typeof comp !== 'object') {
          errors.push(`Bulan ${bulanNum}: Komponen "${compKey}" tidak valid.`);
        } else {
          if (typeof comp.bruto !== 'number' || isNaN(comp.bruto) || comp.bruto < 0) {
            errors.push(`Bulan ${bulanNum} (${compKey}): Nilai "bruto" harus berupa angka >= 0.`);
          }
          if (typeof comp.pajak_dipotong !== 'number' || isNaN(comp.pajak_dipotong) || comp.pajak_dipotong < 0) {
            errors.push(`Bulan ${bulanNum} (${compKey}): Nilai "pajak_dipotong" harus berupa angka >= 0.`);
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      warnings
    };
  }

  // Sanitize and normalize to fully typed PPh21Dataset
  const p = obj.pegawai;
  const statusPTKP = (VALID_PTKP.includes(p.status_ptkp) ? p.status_ptkp : 'TK/0') as StatusPTKP;
  const expectedTER = PTKP_MAP[statusPTKP].kategoriTER;
  const kategoriTER: KategoriTER = (p.kategori_ter && VALID_TER.includes(p.kategori_ter)) ? p.kategori_ter : expectedTER;

  const sanitizedPegawai: PegawaiData = {
    nama: String(p.nama || '').trim(),
    nik: String(p.nik || '').trim(),
    npwp: String(p.npwp || '').trim(),
    nip: String(p.nip || '').trim(),
    pangkat_golongan: String(p.pangkat_golongan || '').trim(),
    jabatan: String(p.jabatan || '').trim(),
    status_ptkp: statusPTKP,
    kategori_ter: kategoriTER,
    persen_iuran_pensiun: typeof p.persen_iuran_pensiun === 'number' && !isNaN(p.persen_iuran_pensiun) ? p.persen_iuran_pensiun : 4.75,
    instansi: {
      nama_instansi: String(p.instansi?.nama_instansi || '').trim(),
      nama_bendahara_utama: String(p.instansi?.nama_bendahara_utama || '').trim(),
      nip_bendahara_utama: String(p.instansi?.nip_bendahara_utama || '').trim(),
      npwp_instansi_utama: String(p.instansi?.npwp_instansi_utama || '').trim(),
      kota_penandatangan: String(p.instansi?.kota_penandatangan || '').trim() || 'Jakarta',
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const sanitizedPeriode: PeriodeBulan[] = obj.periode_bulanan.map((b: any, idx: number) => {
    const bulanIndex = idx + 1;
    const kp = b.komponen_penghasilan || {};
    const isAkhir = Boolean(b.is_akhir_periode || b.metode_perhitungan === 'AKHIR_PERIODE' || (bulanIndex === 12 && !obj.periode_bulanan.some((x: any, xidx: number) => xidx < 11 && (x.is_akhir_periode || x.metode_perhitungan === 'AKHIR_PERIODE'))));

    const cleanComp = (compRaw: any, defaultLabel: string) => ({
      label: String(compRaw?.label || defaultLabel).trim(),
      bruto: Math.max(0, Number(compRaw?.bruto) || 0),
      pajak_dipotong: Math.max(0, Number(compRaw?.pajak_dipotong) || 0),
      npwp_bendahara: String(compRaw?.npwp_bendahara || '').trim()
    });

    return {
      bulan: bulanIndex,
      nama_bulan: monthNames[idx],
      metode_perhitungan: isAkhir ? 'AKHIR_PERIODE' : 'TER_BULANAN',
      is_akhir_periode: isAkhir,
      komponen_penghasilan: {
        penghasilan_1: cleanComp(kp.penghasilan_1, 'Gaji Plus Tunjangan Melekat'),
        penghasilan_2: cleanComp(kp.penghasilan_2, 'Tunjangan Tambahan Penghasilan (TPP)'),
        penghasilan_3: cleanComp(kp.penghasilan_3, 'Penghasilan Lainnya 1 (Upah Pungut / Honor)'),
        penghasilan_4: cleanComp(kp.penghasilan_4, 'Penghasilan Lainnya 2 (Honor Lintas OPD)')
      }
    };
  });

  return {
    valid: true,
    errors: [],
    warnings,
    sanitizedData: {
      app_version: String(obj.app_version || '1.0.0'),
      exported_at: String(obj.exported_at || new Date().toISOString()),
      pegawai: sanitizedPegawai,
      periode_bulanan: sanitizedPeriode
    }
  };
}
