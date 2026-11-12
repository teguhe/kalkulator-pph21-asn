/**
 * Utilities for formatting numbers, Rupiah currency, NPWP, and dates
 */

export function formatRupiah(value: number | string | undefined | null): string {
  const num = typeof value === 'number' ? value : Number(value) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(value: number | string | undefined | null): string {
  const num = typeof value === 'number' ? value : Number(value) || 0;
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(num);
}

export function parseFormattedNumber(str: string): number {
  if (!str) return 0;
  // Strip everything except digits and minus
  const cleaned = str.replace(/[^\d-]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function formatNPWP(npwp: string): string {
  const clean = npwp.replace(/\D/g, '');
  if (clean.length === 15) {
    // Standard 15-digit NPWP format: 00.000.000.0-000.000
    return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}.${clean.slice(8, 9)}-${clean.slice(9, 12)}.${clean.slice(12, 15)}`;
  }
  if (clean.length === 16) {
    // 16-digit format / NIK: 0000 0000 0000 0000
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)} ${clean.slice(12, 16)}`;
  }
  return npwp;
}

export function formatDateIndo(dateStr?: string | Date): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export function formatTimestampIndo(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const date = formatDateIndo(d);
    const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${date} ${time} WIB`;
  } catch {
    return isoStr;
  }
}
