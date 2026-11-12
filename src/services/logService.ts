import { LogItem } from '../types';
import { authService } from './authService';

const LOG_STORAGE_KEY = 'pph21_activity_logs';
const MAX_LOGS = 200;

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
      userEmail: user ? user.email : 'Tamu (Guest)',
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
