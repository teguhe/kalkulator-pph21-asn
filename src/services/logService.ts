import { LogItem, EmailProcessSummary, NIKProcessSummary } from '../types';
import { authService } from './authService';

const LOG_STORAGE_KEY = 'pph21_activity_logs';
const MAX_LOGS = 300;

class LogService {
  private logs: LogItem[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs(): void {
    try {
      const stored = localStorage.getItem(LOG_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch {
      this.logs = [];
    }
  }

  private saveLogs(): void {
    try {
      // Keep within MAX_LOGS to prevent quota overflow
      if (this.logs.length > MAX_LOGS) {
        this.logs = this.logs.slice(0, MAX_LOGS);
      }
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Could not save logs to localStorage', e);
    }
  }

  public recordLog(type: LogItem['type'], details: string, meta?: Record<string, any>): LogItem {
    const user = authService.getCurrentUser();
    const item: LogItem = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      type,
      userEmail: user ? user.email : 'Belum Login',
      details,
      meta
    };

    this.logs.unshift(item);
    this.saveLogs();
    return item;
  }

  public getLogs(): LogItem[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(LOG_STORAGE_KEY);
  }

  /**
   * Menghasilkan rekapitulasi proses berdasarkan akun email pengguna
   */
  public getProcessSummaryByEmail(): EmailProcessSummary[] {
    const map = new Map<string, {
      totalCalculations: number;
      totalActions: number;
      niks: Set<string>;
      lastActive: string;
    }>();

    for (const log of this.logs) {
      const email = log.userEmail || 'Belum Login';
      if (!map.has(email)) {
        map.set(email, {
          totalCalculations: 0,
          totalActions: 0,
          niks: new Set<string>(),
          lastActive: log.timestamp
        });
      }

      const item = map.get(email)!;
      item.totalActions++;
      if (log.type === 'CALCULATE') {
        item.totalCalculations++;
      }

      // Check NIK dari meta atau details
      const nik = log.meta?.nik;
      if (nik && nik !== '-' && nik !== 'Tanpa NIK') {
        item.niks.add(nik);
      }

      // Update waktu aktivitas terakhir
      if (new Date(log.timestamp).getTime() > new Date(item.lastActive).getTime()) {
        item.lastActive = log.timestamp;
      }
    }

    const results: EmailProcessSummary[] = [];
    map.forEach((val, email) => {
      results.push({
        email,
        totalCalculations: val.totalCalculations,
        totalActions: val.totalActions,
        uniqueNIKs: Array.from(val.niks),
        lastActive: val.lastActive
      });
    });

    return results.sort((a, b) => b.totalCalculations - a.totalCalculations || new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
  }

  /**
   * Menghasilkan rekapitulasi proses berdasarkan NIK pegawai yang dihitung
   */
  public getProcessSummaryByNIK(): NIKProcessSummary[] {
    const map = new Map<string, {
      nama: string;
      nip: string;
      instansi: string;
      totalCalculations: number;
      lastTotalBruto: number;
      lastTotalPajak: number;
      lastProcessedAt: string;
      emails: Set<string>;
    }>();

    for (const log of this.logs) {
      // Prioritaskan log perhitungan pajak atau log dengan data pegawai
      if (log.type !== 'CALCULATE' && !log.meta?.nik) continue;

      let nik = log.meta?.nik;
      if (!nik || nik === '-' || nik === 'Tanpa NIK') {
        const match = log.details.match(/NIK:\s*([0-9Xx\.\-]+)/i) || log.details.match(/\b\d{16}\b/);
        if (match) {
          nik = match[1] || match[0];
        } else if (log.meta?.nama) {
          nik = `Nama: ${log.meta.nama}`;
        } else {
          continue;
        }
      }

      if (!map.has(nik)) {
        map.set(nik, {
          nama: log.meta?.nama || 'Pegawai',
          nip: log.meta?.nip || '-',
          instansi: log.meta?.instansi || '-',
          totalCalculations: 0,
          lastTotalBruto: log.meta?.total_bruto || 0,
          lastTotalPajak: log.meta?.total_pajak || 0,
          lastProcessedAt: log.timestamp,
          emails: new Set<string>()
        });
      }

      const item = map.get(nik)!;
      if (log.type === 'CALCULATE') {
        item.totalCalculations++;
      }
      if (log.userEmail && log.userEmail !== 'Belum Login') {
        item.emails.add(log.userEmail);
      }

      // Ambil nilai terbaru jika log lebih baru
      if (new Date(log.timestamp).getTime() >= new Date(item.lastProcessedAt).getTime()) {
        item.lastProcessedAt = log.timestamp;
        if (log.meta?.nama) item.nama = log.meta.nama;
        if (log.meta?.nip) item.nip = log.meta.nip;
        if (log.meta?.instansi) item.instansi = log.meta.instansi;
        if (typeof log.meta?.total_bruto === 'number') item.lastTotalBruto = log.meta.total_bruto;
        if (typeof log.meta?.total_pajak === 'number') item.lastTotalPajak = log.meta.total_pajak;
      }
    }

    const results: NIKProcessSummary[] = [];
    map.forEach((val, nik) => {
      results.push({
        nik,
        nama: val.nama,
        nip: val.nip,
        instansi: val.instansi,
        totalCalculations: val.totalCalculations,
        lastTotalBruto: val.lastTotalBruto,
        lastTotalPajak: val.lastTotalPajak,
        lastProcessedAt: val.lastProcessedAt,
        processedByEmails: Array.from(val.emails)
      });
    });

    return results.sort((a, b) => new Date(b.lastProcessedAt).getTime() - new Date(a.lastProcessedAt).getTime());
  }

  public exportLogsToCSV(): string {
    const headers = ['ID', 'Waktu (ISO)', 'Tipe', 'Pengguna', 'Detail'];
    const rows = this.logs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.type}"`,
      `"${l.userEmail}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const logService = new LogService();
