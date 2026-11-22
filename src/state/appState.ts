import { 
  PPh21Dataset, 
  RingkasanTahunan, 
  UserProfile, 
  QuotaState, 
  TabType,
  TerBulananInputState,
  HasilTerBulananPerhitungan,
  HasilItemTerBulanan
} from '../types';
import { createEmptyDataset, getSampleDummyDataset } from '../utils/defaults';
import { calculatePPh21 } from '../utils/calculator';
import { authService } from '../services/authService';
import { quotaService } from '../services/quotaService';
import { logService } from '../services/logService';
import { PTKP_MAP, getTERRate } from '../../taxConstants';

const DATASET_STORAGE_KEY = 'pph21_saved_dataset';
const TER_BULANAN_STORAGE_KEY = 'pph21_saved_ter_bulanan';
const TER_BULANAN_CALC_STORAGE_KEY = 'pph21_saved_ter_bulanan_calc';
const SIDEBAR_COLLAPSED_KEY = 'pph21_sidebar_collapsed';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

function createDefaultTerBulananInput(): TerBulananInputState {
  return {
    penghasilan_1: { id: 'p1', nama: 'Gaji Plus Tunjangan Melekat', bruto: 0, keterangan: 'Bendahara Gaji' },
    penghasilan_2: { id: 'p2', nama: 'Tunjangan Tambahan Penghasilan (TPP)', bruto: 0, keterangan: 'Bendahara TPP' },
    penghasilan_3: { id: 'p3', nama: 'Penghasilan Lainnya 1 (Upah Pungut / Honor)', bruto: 0, keterangan: 'Bendahara OPD 1' },
    penghasilan_4: { id: 'p4', nama: 'Penghasilan Lainnya 2 (Honorarium Kegiatan)', bruto: 0, keterangan: 'Bendahara OPD 2' },
  };
}

class AppState {
  public dataset: PPh21Dataset;
  public calculation: RingkasanTahunan;
  public activeTab: TabType = 'dashboard';
  public isSidebarMobileOpen: boolean = false;
  public isSidebarCollapsed: boolean = false;
  public terBulananInput: TerBulananInputState;
  public terBulananCalculation: HasilTerBulananPerhitungan | null = null;
  public isTerBulananDirty: boolean = false;
  public activeMonth: number = 1; // 1 to 12
  public currentUser: UserProfile | null = null;
  public quotaState: QuotaState;
  public toasts: ToastMessage[] = [];
  public selectedBpa2NPWP: string = 'ALL'; // 'ALL' or specific NPWP
  public selectedBpa2PeriodMonth: number = 0; // 0 = default to latest akhir periode
  public selectedHasilRekonsiliasiMonth: number = 0; // 0 = default to latest akhir periode

  private listeners: (() => void)[] = [];
  private toastListeners: (() => void)[] = [];

  constructor() {
    this.dataset = this.loadInitialDataset();
    this.terBulananInput = this.loadInitialTerBulananInput();
    this.terBulananCalculation = this.loadInitialTerBulananCalc();
    this.isSidebarCollapsed = this.loadInitialSidebarCollapsed();
    this.currentUser = authService.getCurrentUser();
    this.quotaState = quotaService.getQuotaState();
    this.calculation = calculatePPh21(this.dataset.pegawai, this.dataset.periode_bulanan);

    // Listen to auth changes
    authService.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.quotaState = quotaService.getQuotaState();
      if (user) {
        this.activeTab = 'dashboard';
      }
      this.notify();
    });
  }

  private loadInitialDataset(): PPh21Dataset {
    try {
      const stored = localStorage.getItem(DATASET_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return createEmptyDataset();
  }

  private loadInitialTerBulananInput(): TerBulananInputState {
    try {
      const stored = localStorage.getItem(TER_BULANAN_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return createDefaultTerBulananInput();
  }

  public saveDatasetToStorage(): void {
    try {
      localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(this.dataset));
    } catch (e) {
      console.warn('Could not save dataset to localStorage', e);
    }
  }

  public saveTerBulananToStorage(): void {
    try {
      localStorage.setItem(TER_BULANAN_STORAGE_KEY, JSON.stringify(this.terBulananInput));
    } catch (e) {
      console.warn('Could not save ter bulanan to localStorage', e);
    }
  }

  private loadInitialTerBulananCalc(): HasilTerBulananPerhitungan | null {
    try {
      const stored = localStorage.getItem(TER_BULANAN_CALC_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return null;
  }

  public saveTerBulananCalcToStorage(): void {
    try {
      if (this.terBulananCalculation) {
        localStorage.setItem(TER_BULANAN_CALC_STORAGE_KEY, JSON.stringify(this.terBulananCalculation));
      } else {
        localStorage.removeItem(TER_BULANAN_CALC_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not save ter bulanan calc to localStorage', e);
    }
  }

  private loadInitialSidebarCollapsed(): boolean {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public toggleSidebarMobile(open?: boolean): void {
    this.isSidebarMobileOpen = typeof open === 'boolean' ? open : !this.isSidebarMobileOpen;
    this.notify();
  }

  public toggleSidebarCollapse(collapsed?: boolean): void {
    this.isSidebarCollapsed = typeof collapsed === 'boolean' ? collapsed : !this.isSidebarCollapsed;
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(this.isSidebarCollapsed));
    } catch (e) {
      console.warn('Could not save sidebar collapsed state', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public subscribeToast(listener: () => void): () => void {
    this.toastListeners.push(listener);
    return () => {
      this.toastListeners = this.toastListeners.filter(l => l !== listener);
    };
  }

  public notify(): void {
    this.quotaState = quotaService.getQuotaState();
    this.listeners.forEach(cb => cb());
  }

  public notifyToast(): void {
    this.toastListeners.forEach(cb => cb());
  }

  public setActiveTab(tab: TabType): void {
    this.activeTab = tab;
    this.notify();
  }

  public setActiveMonth(m: number): void {
    if (m >= 1 && m <= 12) {
      this.activeMonth = m;
      this.notify();
    }
  }

  public setSelectedBpa2NPWP(npwp: string): void {
    this.selectedBpa2NPWP = npwp;
    this.notify();
  }

  public setSelectedBpa2PeriodMonth(month: number): void {
    this.selectedBpa2PeriodMonth = month;
    this.notify();
  }

  public setSelectedHasilRekonsiliasiMonth(month: number): void {
    this.selectedHasilRekonsiliasiMonth = month;
    this.notify();
  }

  public getActiveBpa2Result() {
    const list = this.calculation.daftar_akhir_periode || [];
    if (list.length === 0) {
      return this.calculation.akhir_periode;
    }
    if (this.selectedBpa2PeriodMonth > 0) {
      const match = list.find(p => p.bulan_akhir === this.selectedBpa2PeriodMonth);
      if (match) return match;
    }
    // Default to the latest period
    return list[list.length - 1];
  }

  public getActiveHasilRekonsiliasiResult() {
    const list = this.calculation.daftar_akhir_periode || [];
    if (list.length === 0) {
      return this.calculation.akhir_periode;
    }
    if (this.selectedHasilRekonsiliasiMonth > 0) {
      const match = list.find(p => p.bulan_akhir === this.selectedHasilRekonsiliasiMonth);
      if (match) return match;
    }
    // Default to the latest period
    return list[list.length - 1];
  }

  public showToast(type: ToastMessage['type'], title: string, message: string): void {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    const toast: ToastMessage = { id, type, title, message };
    this.toasts.push(toast);
    this.notifyToast();

    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.notifyToast();
    }, 4500);
  }

  public removeToast(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notifyToast();
  }

  // Pegawai updates
  public updatePegawai(field: keyof PPh21Dataset['pegawai'], value: any, shouldNotify: boolean = false): void {
    (this.dataset.pegawai as any)[field] = value;

    // Automatic TER Category synchronization when PTKP changes
    if (field === 'status_ptkp') {
      const ptkpConf = PTKP_MAP[value as keyof typeof PTKP_MAP];
      if (ptkpConf) {
        this.dataset.pegawai.kategori_ter = ptkpConf.kategoriTER;
      }
      this.isTerBulananDirty = true;
    }

    this.recalculateTax(false);
    this.saveDatasetToStorage();
    if (shouldNotify) {
      this.notify();
    }
  }

  public updateInstansi(field: keyof PPh21Dataset['pegawai']['instansi'], value: string, shouldNotify: boolean = false): void {
    this.dataset.pegawai.instansi[field] = value;
    this.recalculateTax(false);
    this.saveDatasetToStorage();
    if (shouldNotify) {
      this.notify();
    }
  }

  public syncMainNPWPToAllComponents(): void {
    const mainNPWP = this.dataset.pegawai.instansi.npwp_instansi_utama;
    if (!mainNPWP) {
      this.showToast('warning', 'NPWP Kosong', 'Silakan isi NPWP Instansi Utama terlebih dahulu.');
      return;
    }

    for (const b of this.dataset.periode_bulanan) {
      if (!b.komponen_penghasilan.penghasilan_1.npwp_bendahara) {
        b.komponen_penghasilan.penghasilan_1.npwp_bendahara = mainNPWP;
      }
      if (!b.komponen_penghasilan.penghasilan_2.npwp_bendahara) {
        b.komponen_penghasilan.penghasilan_2.npwp_bendahara = mainNPWP;
      }
    }

    this.recalculateTax(false);
    this.saveDatasetToStorage();
    this.showToast('success', 'NPWP Disinkronkan', 'NPWP Instansi Utama telah diterapkan ke Komponen Gaji dan TPP seluruh bulan.');
    this.notify();
  }

  // Monthly updates
  public updateBulanMetode(bulanNum: number, isAkhir: boolean, shouldNotify: boolean = true): void {
    const bulanIndex = bulanNum - 1;
    if (this.dataset.periode_bulanan[bulanIndex]) {
      this.dataset.periode_bulanan[bulanIndex].is_akhir_periode = isAkhir;
      this.dataset.periode_bulanan[bulanIndex].metode_perhitungan = isAkhir ? 'AKHIR_PERIODE' : 'TER_BULANAN';
      this.recalculateTax(false);
      this.saveDatasetToStorage();
      if (shouldNotify) {
        this.notify();
      }
    }
  }

  public updateKomponen(
    bulanNum: number,
    compKey: 'penghasilan_1' | 'penghasilan_2' | 'penghasilan_3' | 'penghasilan_4',
    field: 'bruto' | 'pajak_dipotong' | 'npwp_bendahara' | 'label',
    value: any,
    shouldNotify: boolean = false
  ): void {
    const bulanIndex = bulanNum - 1;
    const b = this.dataset.periode_bulanan[bulanIndex];
    if (b && b.komponen_penghasilan[compKey]) {
      (b.komponen_penghasilan[compKey] as any)[field] = value;
      this.recalculateTax(false);
      this.saveDatasetToStorage();
      if (shouldNotify) {
        this.notify();
      }
    }
  }

  public copyMonthToAllSubsequent(sourceMonthNum: number): void {
    const sourceIndex = sourceMonthNum - 1;
    const source = this.dataset.periode_bulanan[sourceIndex];
    if (!source) return;

    for (let i = sourceIndex + 1; i < 12; i++) {
      const target = this.dataset.periode_bulanan[i];
      target.komponen_penghasilan.penghasilan_1 = JSON.parse(JSON.stringify(source.komponen_penghasilan.penghasilan_1));
      target.komponen_penghasilan.penghasilan_2 = JSON.parse(JSON.stringify(source.komponen_penghasilan.penghasilan_2));
      target.komponen_penghasilan.penghasilan_3 = JSON.parse(JSON.stringify(source.komponen_penghasilan.penghasilan_3));
      target.komponen_penghasilan.penghasilan_4 = JSON.parse(JSON.stringify(source.komponen_penghasilan.penghasilan_4));
    }

    this.recalculateTax(false);
    this.saveDatasetToStorage();
    this.showToast('success', 'Berhasil Disalin', `Data dari Bulan ${source.nama_bulan} berhasil disalin ke seluruh bulan berikutnya.`);
    this.notify();
  }

  public clearMonth(bulanNum: number): void {
    const b = this.dataset.periode_bulanan[bulanNum - 1];
    if (!b) return;

    b.komponen_penghasilan.penghasilan_1.bruto = 0;
    b.komponen_penghasilan.penghasilan_1.pajak_dipotong = 0;
    b.komponen_penghasilan.penghasilan_2.bruto = 0;
    b.komponen_penghasilan.penghasilan_2.pajak_dipotong = 0;
    b.komponen_penghasilan.penghasilan_3.bruto = 0;
    b.komponen_penghasilan.penghasilan_3.pajak_dipotong = 0;
    b.komponen_penghasilan.penghasilan_4.bruto = 0;
    b.komponen_penghasilan.penghasilan_4.pajak_dipotong = 0;

    this.recalculateTax(false);
    this.saveDatasetToStorage();
    this.showToast('info', 'Bulan Dikosongkan', `Nilai penghasilan bulan ${b.nama_bulan} telah direset.`);
    this.notify();
  }

  // --- METODE PPh TER BULANAN ---
  public updateTerBulananKomponen(
    compKey: 'penghasilan_1' | 'penghasilan_2' | 'penghasilan_3' | 'penghasilan_4',
    field: 'nama' | 'bruto' | 'keterangan',
    value: any,
    shouldNotify: boolean = false
  ): void {
    if (this.terBulananInput[compKey]) {
      (this.terBulananInput[compKey] as any)[field] = value;
      this.isTerBulananDirty = true;
      this.saveTerBulananToStorage();
      if (shouldNotify) {
        this.notify();
      }
    }
  }

  public computeTerBulanan(): HasilTerBulananPerhitungan {
    const kat = this.dataset.pegawai.kategori_ter || 'A';
    const keys: ('penghasilan_1' | 'penghasilan_2' | 'penghasilan_3' | 'penghasilan_4')[] = [
      'penghasilan_1', 'penghasilan_2', 'penghasilan_3', 'penghasilan_4'
    ];

    let total_bruto_terpisah = 0;
    let total_pajak_terpisah = 0;
    let total_netto_terpisah = 0;

    const items: HasilItemTerBulanan[] = keys.map(k => {
      const comp = this.terBulananInput[k];
      const bruto = Math.max(0, comp.bruto || 0);
      const ter_rate = getTERRate(kat, bruto);
      const pajak = Math.floor(bruto * (ter_rate / 100));
      const netto = bruto - pajak;

      total_bruto_terpisah += bruto;
      total_pajak_terpisah += pajak;
      total_netto_terpisah += netto;

      return {
        id: comp.id,
        nama: comp.nama,
        keterangan: comp.keterangan || '',
        bruto,
        ter_rate,
        pajak,
        netto
      };
    });

    const bruto_sebulan = total_bruto_terpisah;
    const ter_rate_gabungan = getTERRate(kat, bruto_sebulan);
    const pajak_gabungan = Math.floor(bruto_sebulan * (ter_rate_gabungan / 100));
    const netto_gabungan = bruto_sebulan - pajak_gabungan;
    const selisih = pajak_gabungan - total_pajak_terpisah;

    return {
      items,
      total_bruto_terpisah,
      total_pajak_terpisah,
      total_netto_terpisah,
      bruto_sebulan,
      ter_rate_gabungan,
      pajak_gabungan,
      netto_gabungan,
      selisih
    };
  }

  public getTerBulananCalculation(): HasilTerBulananPerhitungan {
    if (!this.terBulananCalculation) {
      this.terBulananCalculation = this.computeTerBulanan();
      this.saveTerBulananCalcToStorage();
    }
    return this.terBulananCalculation;
  }

  public calculateTerBulananWithQuota(): boolean {
    if (!this.currentUser) {
      this.showToast('warning', 'Wajib Login', 'Silakan masuk dengan Akun Google terlebih dahulu untuk melakukan perhitungan.');
      if (typeof document !== 'undefined') {
        document.getElementById('modal-login')?.classList.remove('hidden');
      }
      return false;
    }

    if (!quotaService.canCalculate()) {
      this.showToast('error', 'Batas Kuota Tercapai', `Kuota perhitungan Anda hari ini telah habis (${this.quotaState.limit}x per hari).`);
      return false;
    }

    // Kurangi kuota perhitungan
    quotaService.consumeQuota();
    this.quotaState = quotaService.getQuotaState();

    // Lakukan perhitungan
    const calc = this.computeTerBulanan();
    this.terBulananCalculation = calc;
    this.isTerBulananDirty = false;
    this.saveTerBulananCalcToStorage();

    // Masukkan ke log audit
    const nama = this.dataset.pegawai.nama || 'Tanpa Nama';
    const nik = this.dataset.pegawai.nik || '-';
    const nip = this.dataset.pegawai.nip || '-';
    const instansi = this.dataset.pegawai.instansi?.nama_instansi || '-';
    const ptkp = this.dataset.pegawai.status_ptkp;
    const kat = this.dataset.pegawai.kategori_ter;

    logService.recordLog(
      'CALCULATE',
      `Perhitungan PPh 21 TER Bulanan: ${nama} (${ptkp} - TER ${kat})`,
      {
        modul: 'TER_BULANAN',
        nama,
        nik,
        nip,
        instansi,
        status_ptkp: ptkp,
        kategori_ter: kat,
        total_bruto: calc.bruto_sebulan,
        total_pajak: calc.pajak_gabungan,
        total_pajak_terpisah: calc.total_pajak_terpisah,
        selisih: calc.selisih,
        komponen: {
          penghasilan_1: { nama: this.terBulananInput.penghasilan_1.nama, bruto: this.terBulananInput.penghasilan_1.bruto, pajak: calc.items[0].pajak },
          penghasilan_2: { nama: this.terBulananInput.penghasilan_2.nama, bruto: this.terBulananInput.penghasilan_2.bruto, pajak: calc.items[1].pajak },
          penghasilan_3: { nama: this.terBulananInput.penghasilan_3.nama, bruto: this.terBulananInput.penghasilan_3.bruto, pajak: calc.items[2].pajak },
          penghasilan_4: { nama: this.terBulananInput.penghasilan_4.nama, bruto: this.terBulananInput.penghasilan_4.bruto, pajak: calc.items[3].pajak }
        }
      }
    );

    this.showToast('success', 'Perhitungan Berhasil', 'PPh 21 TER bulanan berhasil dihitung dan dicatat ke log.');
    this.notify();
    return true;
  }

  public copyTerBulananToMonth(monthNum: number): void {
    if (!this.terBulananCalculation) {
      this.showToast('warning', 'Belum Dihitung', 'Silakan klik tombol "Hitung PPh 21 Bulanan" terlebih dahulu sebelum menyalin data ke Form 2.');
      return;
    }

    const bulanIndex = monthNum - 1;
    const b = this.dataset.periode_bulanan[bulanIndex];
    if (!b) return;

    const calc = this.terBulananCalculation;
    const keys: ('penghasilan_1' | 'penghasilan_2' | 'penghasilan_3' | 'penghasilan_4')[] = [
      'penghasilan_1', 'penghasilan_2', 'penghasilan_3', 'penghasilan_4'
    ];

    keys.forEach((key, idx) => {
      const src = this.terBulananInput[key];
      const itemCalc = calc.items[idx];
      b.komponen_penghasilan[key].label = src.nama;
      b.komponen_penghasilan[key].bruto = src.bruto;
      b.komponen_penghasilan[key].pajak_dipotong = itemCalc.pajak;
    });

    this.recalculateTax(false);
    this.saveDatasetToStorage();
    this.showToast('success', 'Tersalin ke Form 2', `Data 4 penghasilan berhasil disalin ke Bulan ${b.nama_bulan} pada Form 2.`);
    this.notify();
  }

  public loadMonthIntoTerBulanan(monthNum: number): void {
    const bulanIndex = monthNum - 1;
    const b = this.dataset.periode_bulanan[bulanIndex];
    if (!b) return;

    const kp = b.komponen_penghasilan;
    this.terBulananInput.penghasilan_1.bruto = kp.penghasilan_1.bruto || 0;
    this.terBulananInput.penghasilan_1.nama = kp.penghasilan_1.label || 'Gaji Plus Tunjangan Melekat';
    
    this.terBulananInput.penghasilan_2.bruto = kp.penghasilan_2.bruto || 0;
    this.terBulananInput.penghasilan_2.nama = kp.penghasilan_2.label || 'Tunjangan Tambahan Penghasilan (TPP)';

    this.terBulananInput.penghasilan_3.bruto = kp.penghasilan_3.bruto || 0;
    this.terBulananInput.penghasilan_3.nama = kp.penghasilan_3.label || 'Penghasilan Lainnya 1 (Upah Pungut / Honor)';

    this.terBulananInput.penghasilan_4.bruto = kp.penghasilan_4.bruto || 0;
    this.terBulananInput.penghasilan_4.nama = kp.penghasilan_4.label || 'Penghasilan Lainnya 2 (Honorarium Kegiatan)';

    this.terBulananCalculation = this.computeTerBulanan();
    this.isTerBulananDirty = false;
    this.saveTerBulananToStorage();
    this.saveTerBulananCalcToStorage();
    this.showToast('info', 'Data Dimuat', `Data 4 penghasilan dari Bulan ${b.nama_bulan} dimuat dan dihitung otomatis.`);
    this.notify();
  }

  public loadDummyTerBulanan(): void {
    this.terBulananInput = {
      penghasilan_1: { id: 'p1', nama: 'Gaji Plus Tunjangan Melekat', bruto: 5500000, keterangan: 'Bendahara Gaji' },
      penghasilan_2: { id: 'p2', nama: 'Tunjangan Tambahan Penghasilan (TPP)', bruto: 6000000, keterangan: 'Bendahara TPP' },
      penghasilan_3: { id: 'p3', nama: 'Penghasilan Lainnya 1 (Upah Pungut)', bruto: 1500000, keterangan: 'Bendahara Bapenda' },
      penghasilan_4: { id: 'p4', nama: 'Penghasilan Lainnya 2 (Honorarium Pokja)', bruto: 1000000, keterangan: 'Bendahara Panitia Kegiatan' },
    };
    this.terBulananCalculation = this.computeTerBulanan();
    this.isTerBulananDirty = false;
    this.saveTerBulananToStorage();
    this.saveTerBulananCalcToStorage();
    this.showToast('info', 'Sampel TER Bulanan Dimuat', 'Data simulasi 4 komponen penghasilan ASN dimuat dan dihitung otomatis.');
    this.notify();
  }

  public clearTerBulanan(): void {
    this.terBulananInput.penghasilan_1.bruto = 0;
    this.terBulananInput.penghasilan_2.bruto = 0;
    this.terBulananInput.penghasilan_3.bruto = 0;
    this.terBulananInput.penghasilan_4.bruto = 0;
    this.terBulananCalculation = this.computeTerBulanan();
    this.isTerBulananDirty = false;
    this.saveTerBulananToStorage();
    this.saveTerBulananCalcToStorage();
    this.showToast('info', 'Input Dikosongkan', 'Seluruh nilai bruto pada perhitungan TER bulanan telah direset ke Rp 0.');
    this.notify();
  }


  // Tax calculation with Quota checks
  public recalculateTax(consumeQuotaCount: boolean = false): boolean {
    if (consumeQuotaCount) {
      if (!this.currentUser) {
        this.showToast('warning', 'Wajib Login', 'Silakan masuk dengan Akun Google terlebih dahulu untuk melakukan perhitungan.');
        document.getElementById('modal-login')?.classList.remove('hidden');
        return false;
      }

      if (!quotaService.canCalculate()) {
        this.showToast('error', 'Batas Kuota Tercapai', `Kuota perhitungan Anda hari ini telah habis (${this.quotaState.limit}x per hari).`);
        return false;
      }
      quotaService.consumeQuota();
      this.quotaState = quotaService.getQuotaState();

      // Record calculation log
      const nama = this.dataset.pegawai.nama || 'Tanpa Nama';
      const nik = this.dataset.pegawai.nik || '-';
      const nip = this.dataset.pegawai.nip || '-';
      const instansi = this.dataset.pegawai.instansi?.nama_instansi || '-';

      logService.recordLog(
        'CALCULATE',
        `Perhitungan PPh 21: ${nama} (NIK: ${nik})`,
        {
          nama,
          nik,
          nip,
          instansi,
          status_ptkp: this.dataset.pegawai.status_ptkp,
          total_bruto: this.calculation.total_bruto_setahun,
          total_pajak: this.calculation.total_pph21_terutang_setahun
        }
      );
    }

    this.calculation = calculatePPh21(this.dataset.pegawai, this.dataset.periode_bulanan);
    return true;
  }

  // Load Template Dummy
  public loadDummyTemplate(): void {
    if (!this.currentUser) {
      this.showToast('warning', 'Wajib Login', 'Silakan masuk dengan Akun Google terlebih dahulu untuk memuat template dummy.');
      document.getElementById('modal-login')?.classList.remove('hidden');
      return;
    }

    this.dataset = getSampleDummyDataset();
    this.terBulananInput = {
      penghasilan_1: { id: 'p1', nama: 'Gaji Plus Tunjangan Melekat', bruto: 5500000, keterangan: 'Bendahara Gaji' },
      penghasilan_2: { id: 'p2', nama: 'Tunjangan Tambahan Penghasilan (TPP)', bruto: 6000000, keterangan: 'Bendahara TPP' },
      penghasilan_3: { id: 'p3', nama: 'Penghasilan Lainnya 1 (Upah Pungut)', bruto: 1500000, keterangan: 'Bendahara Bapenda' },
      penghasilan_4: { id: 'p4', nama: 'Penghasilan Lainnya 2 (Honorarium Pokja)', bruto: 1000000, keterangan: 'Bendahara Panitia Kegiatan' },
    };
    this.terBulananCalculation = this.computeTerBulanan();
    this.isTerBulananDirty = false;
    this.saveTerBulananToStorage();
    this.saveTerBulananCalcToStorage();
    this.recalculateTax(false);
    this.saveDatasetToStorage();
    logService.recordLog('IMPORT', `Memuat data template dummy bawaan ASN: ${this.dataset.pegawai.nama} (NIK: ${this.dataset.pegawai.nik || '-'})`, {
      nama: this.dataset.pegawai.nama,
      nik: this.dataset.pegawai.nik,
      nip: this.dataset.pegawai.nip,
      instansi: this.dataset.pegawai.instansi?.nama_instansi
    });
    this.showToast('success', 'Template Dummy Dimuat', 'Data ASN contoh (Budi Santoso, S.Kom., M.T.) berhasil dimuat lengkap dengan 12 bulan penghasilan.');
    this.notify();
  }

  // Reset to empty
  public resetToEmpty(): void {
    if (!this.currentUser) {
      this.showToast('warning', 'Wajib Login', 'Silakan masuk dengan Akun Google terlebih dahulu.');
      document.getElementById('modal-login')?.classList.remove('hidden');
      return;
    }

    this.dataset = createEmptyDataset();
    this.terBulananInput = createDefaultTerBulananInput();
    this.terBulananCalculation = this.computeTerBulanan();
    this.isTerBulananDirty = false;
    this.saveTerBulananToStorage();
    this.saveTerBulananCalcToStorage();
    this.recalculateTax(false);
    this.saveDatasetToStorage();
    this.showToast('info', 'Data Dikosongkan', 'Semua isian telah direset ke data kosong baru.');
    this.notify();
  }

  // Load from parsed & validated JSON
  public loadImportedDataset(dataset: PPh21Dataset): void {
    if (!this.currentUser) {
      this.showToast('warning', 'Wajib Login', 'Silakan masuk dengan Akun Google terlebih dahulu.');
      document.getElementById('modal-login')?.classList.remove('hidden');
      return;
    }

    this.dataset = dataset;
    this.recalculateTax(false);
    this.saveDatasetToStorage();
    logService.recordLog('IMPORT', `Mengimpor file JSON data pegawai: ${dataset.pegawai.nama} (NIK: ${dataset.pegawai.nik || '-'})`, {
      nama: dataset.pegawai.nama,
      nik: dataset.pegawai.nik,
      nip: dataset.pegawai.nip,
      instansi: dataset.pegawai.instansi?.nama_instansi
    });
    this.showToast('success', 'Impor Sukses', `Data PPh 21 untuk ${dataset.pegawai.nama} berhasil dimuat.`);
    this.notify();
  }
}

export const appState = new AppState();
