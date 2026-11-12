import sampleDummyData from '../../sample_data_pph21.json';
import { PPh21Dataset, PegawaiData, PeriodeBulan } from '../types';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Returns a completely clean, empty PPh21 dataset for fresh user input
 */
export function createEmptyDataset(): PPh21Dataset {
  const pegawai: PegawaiData = {
    nama: '',
    nik: '',
    npwp: '',
    nip: '',
    pangkat_golongan: '',
    jabatan: '',
    status_ptkp: 'TK/0',
    kategori_ter: 'A',
    persen_iuran_pensiun: 4.75,
    instansi: {
      nama_instansi: '',
      nama_bendahara_utama: '',
      nip_bendahara_utama: '',
      npwp_instansi_utama: '',
      kota_penandatangan: 'Jakarta'
    }
  };

  const periode_bulanan: PeriodeBulan[] = MONTH_NAMES.map((nama_bulan, idx) => {
    const bulan = idx + 1;
    const isDesember = bulan === 12;
    return {
      bulan,
      nama_bulan,
      metode_perhitungan: isDesember ? 'AKHIR_PERIODE' : 'TER_BULANAN',
      is_akhir_periode: isDesember,
      komponen_penghasilan: {
        penghasilan_1: {
          label: 'Gaji Plus Tunjangan Melekat',
          bruto: 0,
          pajak_dipotong: 0,
          npwp_bendahara: ''
        },
        penghasilan_2: {
          label: 'Tunjangan Tambahan Penghasilan (TPP)',
          bruto: 0,
          pajak_dipotong: 0,
          npwp_bendahara: ''
        },
        penghasilan_3: {
          label: 'Penghasilan Lainnya 1 (Upah Pungut / Honor)',
          bruto: 0,
          pajak_dipotong: 0,
          npwp_bendahara: ''
        },
        penghasilan_4: {
          label: 'Penghasilan Lainnya 2 (Honor Lintas OPD)',
          bruto: 0,
          pajak_dipotong: 0,
          npwp_bendahara: ''
        }
      }
    };
  });

  return {
    app_version: '1.0.0',
    exported_at: new Date().toISOString(),
    pegawai,
    periode_bulanan
  };
}

/**
 * Returns the official sample dummy template (from sample_data_pph21.json)
 */
export function getSampleDummyDataset(): PPh21Dataset {
  // Deep clone to avoid mutating the original
  return JSON.parse(JSON.stringify(sampleDummyData)) as PPh21Dataset;
}
