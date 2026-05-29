import { classifyRecord } from './breach-engine.js';

export function mergeRecords(v2Records, csvRecords) {
  return [...v2Records, ...csvRecords].map(classifyRecord);
}

export function buildSummary(records) {
  const total = records.length;
  const breaches = records.filter(item => item.is_breach).length;
  const byMonth = Object.fromEntries(
    ['March', 'April', 'May'].map(month => [month, records.filter(item => item.month === month && item.is_breach).length])
  );
  const bySource = records.reduce((acc, item) => {
    acc[item.source_group] = (acc[item.source_group] || 0) + 1;
    return acc;
  }, {});

  return { total, breaches, byMonth, bySource };
}
