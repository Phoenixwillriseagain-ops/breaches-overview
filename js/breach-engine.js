export const MISSING_KSLS = ['KSL-2a', 'KSL-2b', 'KSL-2c', 'KSL-3a', 'KSL-5b', 'KSL-6'];

export function classifyRecord(record) {
  return {
    ...record,
    source_group: record.source === '3093' && MISSING_KSLS.includes(record.sla_code) ? 'Missing-KSL' : record.source,
    month_key: `${record.month || 'Unknown'}-${record.sla_code || 'Unknown'}`
  };
}
