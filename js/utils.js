const MONTHS = ['March', 'April', 'May'];

export function detectMonthFromFilename(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('march')) return 'March';
  if (lower.includes('april')) return 'April';
  if (lower.includes('may')) return 'May';
  return null;
}

export function monthFromDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return MONTHS[date.getMonth()];
}

export function normalizeQueue(queue = '') {
  return String(queue).replace(/^FT_use-/i, '');
}

export function toNumber(value) {
  if (value === null || value === undefined || value === '') return NaN;
  const normalized = String(value).replace(',', '.');
  return Number(normalized);
}

export { MONTHS };
