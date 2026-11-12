import { PPh21Dataset, RingkasanTahunan, UserProfile, QuotaState } from '../types';
import { createEmptyDataset, getSampleDummyDataset } from '../utils/defaults';
import { calculatePPh21 } from '../utils/calculator';
import { authService } from '../services/authService';
import { quotaService } from '../services/quotaService';
import { logService } from '../services/logService';
import { PTKP_MAP } from '../../taxConstants';

const DATASET_STORAGE_KEY = 'pph21_saved_dataset';

type TabType = 'pegawai' | 'input' | 'hasil' | 'bpa2' | 'faq' | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

class AppState {
  public dataset: PPh21Dataset;
  public calculation: RingkasanTahunan;
  public activeTab: TabType = 'pegawai';
  public activeMonth: number = 1; // 1 to 12
  public currentUser: UserProfile | null = null;
  public quotaState: QuotaState;
  public toasts: ToastMessage[] = [];
  public selectedBpa2NPWP: string = 'ALL'; // 'ALL' or specific NPWP

  private listeners: (() => void)[] = [];

  constructor() {
    this.dataset = this.loadInitialDataset();
    this.currentUser = authService.getCurrentUser();
    this.quotaState = quotaService.getQuotaState();
    this.calculation = calculatePPh21(this.dataset.pegawai, this.dataset.periode_bulanan);

    // Listen to auth changes
    authService.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.quotaState = quotaService.getQuotaState();
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
    // PRD 3.5: "Aplikasi dimulai dengan data kosong, dilengkapi tombol Load Template Dummy ASN/PNS untuk sampel perhitungan."
    return createEmptyDataset();
  }

  public saveDatasetToStorage(): void {
    try {
      localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(this.dataset));
    } catch (e) {
      console.warn('Could not save dataset to localStorage', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public notify(): void {
    this.quotaState = quotaService.getQuotaState();
    this.listeners.forEach(cb => cb());
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

  public showToast(type: ToastMessage['type'], title: string, message: string): void {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    const toast: ToastMessage = { id, type, title, message };
    this.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.notify();
    }, 4500);
  }

  public removeToast(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  // Pegawai updates
  public updatePegawai(field: keyof PPh21Dataset['pegawai'], value: any): void {
    (this.dataset.pegawai as any)[field] = value;

    // Automatic TER Category synchronization when PTKP changes
    if (field === 'status_ptkp') {
      const ptkpConf = PTKP_MAP[value as keyof typeof PTKP_MAP];
      if (ptkpConf) {
        this.dataset.pegawai.kategori_ter = ptkpConf.kategoriTER;
      }
    }

    this.recalculateTax(false);
    this.saveDatasetToStorage();
    this.notify();
  }

  public updateInstansi(field: keyof PPh21Dataset['pegawai']['instansi'], value: string): void {
    this.dataset.pegawai.instansi[field] = value;
    this.recalculateTax(false);
    this.saveDatasetToStorage();
    this.notify();
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
  public updateBulanMetode(bulanNum: number, isAkhir: boolean): void {
    const bulanIndex = bulanNum - 1;
    if (this.dataset.periode_bulanan[bulanIndex]) {
      this.dataset.periode_bulanan[bulanIndex].is_akhir_periode = isAkhir;
      this.dataset.periode_bulanan[bulanIndex].metode_perhitungan = isAkhir ? 'AKHIR_PERIODE' : 'TER_BULANAN';
      this.recalculateTax(false);
      this.saveDatasetToStorage();
      this.notify();
    }
  }

  public updateKomponen(
    bulanNum: number,
    compKey: 'penghasilan_1' | 'penghasilan_2' | 'penghasilan_3' | 'penghasilan_4',
    field: 'bruto' | 'pajak_dipotong' | 'npwp_bendahara' | 'label',
    value: any
  ): void {
    const bulanIndex = bulanNum - 1;
    const b = this.dataset.periode_bulanan[bulanIndex];
    if (b && b.komponen_penghasilan[compKey]) {
      (b.komponen_penghasilan[compKey] as any)[field] = value;
      this.recalculateTax(false);
      this.saveDatasetToStorage();
      this.notify();
    }
  }

  public copyMonthToAllSubsequent(sourceMonthNum: number): void {
    const sourceIndex = sourceMonthNum - 1;
    const source = this.dataset.periode_bulanan[sourceIndex];
    if (!source) return;

    for (let i = sourceIndex + 1; i < 12; i++) {
      const target = this.dataset.periode_bulanan[i];
      // Keep target's akhir periode status intact
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

  // Tax calculation with Quota checks
  public recalculateTax(consumeQuotaCount: boolean = false): boolean {
    if (consumeQuotaCount) {
      if (!quotaService.canCalculate()) {
        this.showToast('error', 'Batas Kuota Tercapai', 'Kuota perhitungan Anda hari ini telah habis. Silakan login dengan Google atau hubungi admin.');
        return false;
      }
      quotaService.consumeQuota();
      this.quotaState = quotaService.getQuotaState();

      // Record calculation log
      logService.recordLog(
        'CALCULATE',
        `Perhitungan PPh 21: ${this.dataset.pegawai.nama || 'Tanpa Nama'} (${this.dataset.pegawai.status_ptkp})`,
        {
          nama: this.dataset.pegawai.nama,
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
    this.dataset = getSampleDummyDataset();
    this.recalculateTax(false);
    this.saveDatasetToStorage();
    logService.recordLog('IMPORT', 'Memuat data template dummy bawaan ASN/PNS (sample_data_pph21.json)');
    this.showToast('success', 'Template Dummy Dimuat', 'Data ASN/PNS contoh (Budi Santoso, S.Kom., M.T.) berhasil dimuat lengkap dengan 12 bulan penghasilan.');
    this.notify();
  }

  // Reset to empty
  public resetToEmpty(): void {
    this.dataset = createEmptyDataset();
    this.recalculateTax(false);
    this.saveDatasetToStorage();
    this.showToast('info', 'Data Dikosongkan', 'Semua isian telah direset ke data kosong baru.');
    this.notify();
  }

  // Load from parsed & validated JSON
  public loadImportedDataset(dataset: PPh21Dataset): void {
    this.dataset = dataset;
    this.recalculateTax(false);
    this.saveDatasetToStorage();
    logService.recordLog('IMPORT', `Mengimpor file JSON data pegawai: ${dataset.pegawai.nama}`);
    this.showToast('success', 'Impor Sukses', `Data PPh 21 untuk ${dataset.pegawai.nama} berhasil dimuat.`);
    this.notify();
  }
}

export const appState = new AppState();
