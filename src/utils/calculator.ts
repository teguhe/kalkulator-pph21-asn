import {
  PTKP_MAP,
  BIAYA_JABATAN_CONFIG,
  PASAL_17_BRACKETS,
  getTERRate,
  calculatePasal17Tax,
  StatusPTKP,
  KategoriTER
} from '../../taxConstants';

import {
  PegawaiData,
  PeriodeBulan,
  HasilBulan,
  HasilAkhirPeriode,
  LapisanPajakDetail,
  RekapitulasiBendahara,
  RingkasanTahunan,
  KomponenPenghasilan
} from '../types';

/**
 * Helper to compute split withholding breakdown for a specific list of months
 */
export function calculateSplitWithholdingForMonths(months: PeriodeBulan[], pegawai: PegawaiData): RekapitulasiBendahara[] {
  const rekapMap = new Map<string, RekapitulasiBendahara>();
  let grandTotalBruto = 0;
  let grandTotalPajakDipotong = 0;

  for (const b of months) {
    const kp = b.komponen_penghasilan;
    const items: { comp: any; name: string }[] = [
      { comp: kp.penghasilan_1, name: kp.penghasilan_1.label || 'Gaji Plus Tunjangan Melekat' },
      { comp: kp.penghasilan_2, name: kp.penghasilan_2.label || 'Tunjangan Tambahan Penghasilan (TPP)' },
      { comp: kp.penghasilan_3, name: kp.penghasilan_3.label || 'Penghasilan Lainnya 1' },
      { comp: kp.penghasilan_4, name: kp.penghasilan_4.label || 'Penghasilan Lainnya 2' },
    ];

    for (const item of items) {
      if ((item.comp.bruto || 0) > 0 || (item.comp.pajak_dipotong || 0) > 0) {
        let npwp = (item.comp.npwp_bendahara || '').trim();
        if (!npwp) {
          npwp = pegawai.instansi.npwp_instansi_utama || 'Instansi Utama';
        }

        const isUtama = npwp === pegawai.instansi.npwp_instansi_utama;
        const namaKet = isUtama
          ? `${pegawai.instansi.nama_instansi || 'Instansi Utama'} (Bendahara Utama)`
          : `Bendahara Pemotong Lainnya (${npwp})`;

        if (!rekapMap.has(npwp)) {
          rekapMap.set(npwp, {
            npwp_bendahara: npwp,
            nama_keterangan: namaKet,
            total_bruto: 0,
            total_pajak_dipotong: 0,
            persentase_bruto: 0,
            daftar_komponen: []
          });
        }

        const entry = rekapMap.get(npwp)!;
        entry.total_bruto += (item.comp.bruto || 0);
        entry.total_pajak_dipotong += (item.comp.pajak_dipotong || 0);
        if (!entry.daftar_komponen.includes(item.name)) {
          entry.daftar_komponen.push(item.name);
        }

        grandTotalBruto += (item.comp.bruto || 0);
        grandTotalPajakDipotong += (item.comp.pajak_dipotong || 0);
      }
    }
  }

  return Array.from(rekapMap.values()).map(r => ({
    ...r,
    persentase_bruto: grandTotalBruto > 0 ? (r.total_bruto / grandTotalBruto) * 100 : 0
  }));
}

/**
 * Calculates complete tax results for all 12 months, supporting MULTIPLE Akhir Periode
 * (e.g. Month 4 April as intermediate ending period AND Month 12 December as annual ending period)
 */
export function calculatePPh21(pegawai: PegawaiData, periode: PeriodeBulan[]): RingkasanTahunan {
  const hasilBulanan: HasilBulan[] = [];
  const daftarAkhirPeriode: HasilAkhirPeriode[] = [];

  // Check if any month is flagged as akhir periode; if none, default month 12 (index 11)
  const hasAnyAkhir = periode.some(b => b.is_akhir_periode || b.metode_perhitungan === 'AKHIR_PERIODE');

  // Track cumulative tax owed from month 1 onwards across all months
  let akumulasiPajakTerutang = 0;

  for (let i = 0; i < periode.length; i++) {
    const bulan = periode[i];
    const kp = bulan.komponen_penghasilan;
    
    const k1_bruto = kp.penghasilan_1.bruto || 0;
    const k1_pajak = kp.penghasilan_1.pajak_dipotong || 0;
    const k2_bruto = kp.penghasilan_2.bruto || 0;
    const k2_pajak = kp.penghasilan_2.pajak_dipotong || 0;
    const k3_bruto = kp.penghasilan_3.bruto || 0;
    const k3_pajak = kp.penghasilan_3.pajak_dipotong || 0;
    const k4_bruto = kp.penghasilan_4.bruto || 0;
    const k4_pajak = kp.penghasilan_4.pajak_dipotong || 0;

    const bruto_total = k1_bruto + k2_bruto + k3_bruto + k4_bruto;
    const pajak_sudah_dipotong = k1_pajak + k2_pajak + k3_pajak + k4_pajak;

    // A month is an Akhir Periode if explicitly marked OR if no month was marked and this is December
    const isAkhir = Boolean(
      bulan.is_akhir_periode || 
      bulan.metode_perhitungan === 'AKHIR_PERIODE' || 
      (!hasAnyAkhir && i === 11)
    );

    if (!isAkhir) {
      // TER Bulanan
      const ter_rate = getTERRate(pegawai.kategori_ter, bruto_total);
      const pph21_terutang = Math.floor(bruto_total * (ter_rate / 100));
      const selisih = pph21_terutang - pajak_sudah_dipotong;

      akumulasiPajakTerutang += pph21_terutang;

      hasilBulanan.push({
        bulan: bulan.bulan,
        nama_bulan: bulan.nama_bulan,
        metode_perhitungan: 'TER_BULANAN',
        is_akhir_periode: false,
        bruto_total,
        pajak_sudah_dipotong,
        ter_rate,
        pph21_terutang,
        selisih,
        komponen: {
          k1_bruto, k1_pajak,
          k2_bruto, k2_pajak,
          k3_bruto, k3_pajak,
          k4_bruto, k4_pajak
        }
      });
    } else {
      // AKHIR PERIODE (Pasal 17 Tahunan / Rekonsiliasi Kumulatif)
      // Cumulative months from month 1 through current month i+1
      const monthsUpToHere = periode.slice(0, i + 1);
      const jumlah_bulan = monthsUpToHere.length;
      const kode_masa = `01 - ${String(bulan.bulan).padStart(2, '0')}`;

      let total_bruto_akumulasi = 0;
      let total_gaji_akumulasi = 0;
      let total_tpp_akumulasi = 0;
      let total_honor1_akumulasi = 0;
      let total_honor2_akumulasi = 0;
      let total_pajak_sudah_dipotong_tahunan = 0;

      for (const m of monthsUpToHere) {
        const mkp = m.komponen_penghasilan;
        const g = mkp.penghasilan_1.bruto || 0;
        const t = mkp.penghasilan_2.bruto || 0;
        const h1 = mkp.penghasilan_3.bruto || 0;
        const h2 = mkp.penghasilan_4.bruto || 0;
        const mp = (mkp.penghasilan_1.pajak_dipotong || 0) + (mkp.penghasilan_2.pajak_dipotong || 0) + (mkp.penghasilan_3.pajak_dipotong || 0) + (mkp.penghasilan_4.pajak_dipotong || 0);

        total_bruto_akumulasi += (g + t + h1 + h2);
        total_gaji_akumulasi += g;
        total_tpp_akumulasi += t;
        total_honor1_akumulasi += h1;
        total_honor2_akumulasi += h2;
        total_pajak_sudah_dipotong_tahunan += mp;
      }

      // Biaya Jabatan: 5% dari Bruto, maksimal 500rb/bulan x jumlah_bulan (maks 6jt/thn)
      const max_biaya_jabatan = Math.min(jumlah_bulan * BIAYA_JABATAN_CONFIG.MAX_BULANAN, BIAYA_JABATAN_CONFIG.MAX_TAHUNAN);
      const biaya_jabatan = Math.min(Math.floor(total_bruto_akumulasi * BIAYA_JABATAN_CONFIG.RATE), max_biaya_jabatan);

      // Iuran Pensiun: % dari Gaji Pokok & Tunjangan Melekat
      const persenPensiun = typeof pegawai.persen_iuran_pensiun === 'number' ? pegawai.persen_iuran_pensiun : 4.75;
      const iuran_pensiun = Math.floor(total_gaji_akumulasi * (persenPensiun / 100));

      const total_pengurang = biaya_jabatan + iuran_pensiun;
      const penghasilan_neto = Math.max(0, total_bruto_akumulasi - total_pengurang);

      // PTKP Tahunan
      const ptkpConfig = PTKP_MAP[pegawai.status_ptkp] || PTKP_MAP['TK/0'];
      const ptkp = ptkpConfig.nilaiTahunan;

      // PKP (dibulatkan ribuan ke bawah)
      const pkp_raw = penghasilan_neto - ptkp;
      const pkp = pkp_raw > 0 ? Math.floor(pkp_raw / 1000) * 1000 : 0;

      // Hitung PPh 21 Pasal 17 & Lapisan Breakdown
      const { totalTax: pph21_pasal17_setahun, layers } = calculatePasal17Detailed(pkp);

      // PPh 21 Terutang di Bulan Akhir Periode ini:
      // = PPh 21 Pasal 17 Kumulatif s.d. bulan ini - Pajak yang telah terutang pada bulan-bulan sebelumnya
      const pajak_terutang_sebelumnya = akumulasiPajakTerutang;
      const pph21_terutang_bulan_terakhir = pph21_pasal17_setahun - pajak_terutang_sebelumnya;
      const selisih_bulan_ini = pph21_terutang_bulan_terakhir - pajak_sudah_dipotong;
      const selisih_tahunan = pph21_pasal17_setahun - total_pajak_sudah_dipotong_tahunan;

      // Update akumulasi pajak terutang for subsequent months
      akumulasiPajakTerutang += pph21_terutang_bulan_terakhir;

      // Split withholding khusus periode 1 s.d. bulan ini
      const rekapPeriode = calculateSplitWithholdingForMonths(monthsUpToHere, pegawai);

      const akhirObj: HasilAkhirPeriode = {
        bulan_mulai: 1,
        bulan_akhir: bulan.bulan,
        nama_bulan_mulai: 'Januari',
        nama_bulan_akhir: bulan.nama_bulan,
        kode_masa,
        jumlah_bulan,
        total_bruto_akumulasi,
        total_gaji_akumulasi,
        total_tpp_akumulasi,
        total_honor1_akumulasi,
        total_honor2_akumulasi,
        biaya_jabatan,
        max_biaya_jabatan,
        iuran_pensiun,
        total_pengurang,
        penghasilan_neto,
        ptkp,
        status_ptkp: pegawai.status_ptkp,
        pkp,
        pph21_pasal17_setahun,
        pajak_terutang_sebelumnya,
        pph21_terutang_bulan_terakhir,
        total_pajak_sudah_dipotong_tahunan,
        selisih_tahunan,
        lapisan_breakdown: layers,
        rekap_bendahara_periode: rekapPeriode
      };

      daftarAkhirPeriode.push(akhirObj);

      hasilBulanan.push({
        bulan: bulan.bulan,
        nama_bulan: bulan.nama_bulan,
        metode_perhitungan: 'AKHIR_PERIODE',
        is_akhir_periode: true,
        bruto_total,
        pajak_sudah_dipotong,
        pph21_terutang: pph21_terutang_bulan_terakhir,
        selisih: selisih_bulan_ini,
        komponen: {
          k1_bruto, k1_pajak,
          k2_bruto, k2_pajak,
          k3_bruto, k3_pajak,
          k4_bruto, k4_pajak
        }
      });
    }
  }

  // Rekapitulasi Bendahara Pemotong (Full Year Split Withholding)
  const rekapBendahara = calculateSplitWithholdingForMonths(periode, pegawai);

  const total_bruto_setahun = hasilBulanan.reduce((acc, h) => acc + h.bruto_total, 0);
  const total_pajak_dipotong_setahun = hasilBulanan.reduce((acc, h) => acc + h.pajak_sudah_dipotong, 0);
  const total_pph21_terutang_setahun = hasilBulanan.reduce((acc, h) => acc + h.pph21_terutang, 0);
  const total_selisih_setahun = total_pph21_terutang_setahun - total_pajak_dipotong_setahun;

  // The primary / latest akhir periode
  const primaryAkhirPeriode = daftarAkhirPeriode.length > 0 
    ? daftarAkhirPeriode[daftarAkhirPeriode.length - 1] 
    : undefined;

  return {
    hasil_bulanan: hasilBulanan,
    daftar_akhir_periode: daftarAkhirPeriode,
    akhir_periode: primaryAkhirPeriode,
    total_bruto_setahun,
    total_pajak_dipotong_setahun,
    total_pph21_terutang_setahun,
    total_selisih_setahun,
    rekap_bendahara: rekapBendahara
  };
}

/**
 * Detailed Pasal 17 progressive calculation with breakdown per bracket
 */
export function calculatePasal17Detailed(pkpInput: number): { totalTax: number; layers: LapisanPajakDetail[] } {
  const pkp = Math.max(0, Math.floor(pkpInput / 1000) * 1000);
  if (pkp <= 0) {
    return {
      totalTax: 0,
      layers: PASAL_17_BRACKETS.map((b, idx) => ({
        lapisan: idx + 1,
        rentang: formatBracketRange(b.min, b.max),
        tarif: b.rate * 100,
        pkp_lapisan: 0,
        pajak_lapisan: 0
      }))
    };
  }

  let remaining = pkp;
  let totalTax = 0;
  const layers: LapisanPajakDetail[] = [];

  for (let idx = 0; idx < PASAL_17_BRACKETS.length; idx++) {
    const bracket = PASAL_17_BRACKETS[idx];
    const rangeSize = bracket.max === Infinity ? remaining : bracket.max - bracket.min;
    const taxableInBracket = Math.min(remaining, rangeSize);
    
    let layerTax = 0;
    if (taxableInBracket > 0) {
      layerTax = Math.floor(taxableInBracket * bracket.rate);
      totalTax += layerTax;
      remaining -= taxableInBracket;
    }

    layers.push({
      lapisan: idx + 1,
      rentang: formatBracketRange(bracket.min, bracket.max),
      tarif: bracket.rate * 100,
      pkp_lapisan: taxableInBracket > 0 ? taxableInBracket : 0,
      pajak_lapisan: layerTax
    });
  }

  return { totalTax, layers };
}

function formatBracketRange(min: number, max: number): string {
  if (max === Infinity) {
    return `Di atas Rp ${(min / 1_000_000).toLocaleString('id-ID')} Juta`;
  }
  return `Rp ${(min / 1_000_000).toLocaleString('id-ID')} s.d. Rp ${(max / 1_000_000).toLocaleString('id-ID')} Juta`;
}
