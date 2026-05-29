import { monthFromDate, normalizeQueue, toNumber } from './utils.js';

const COLUMN_MAP = {
  'SLA Kennzahl': 'sla_code',
  'SLA Kennzahl Name': 'sla_name',
  'SLA Kennzahl Vergleichsart': 'compare_dir',
  'Anzahl SLAs Kennzahl Zähler vor SR': 'numerator',
  'Anzahl SLAs Kennzahl Nenner vor SR': 'denominator',
  'Element geschlossen am': 'date_closed',
  'Element eingegangen am': 'date_received',
  'Element Status': 'status',
  'Incident Element Supportsprache': 'iso_language',
  'Incident Element Supportsprache Name EN': 'language_name',
  'Incident Ticket': 'incident_ticket',
  'Ticket Gruppe': 'queue',
  'KM Anwendung': 'topic'
};

function mapRow(row) {
  const mapped = {};
  Object.entries(COLUMN_MAP).forEach(([source, target]) => {
    mapped[target] = row[source] ?? '';
  });
  return mapped;
}

export function parse3093Csv(fileName, csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false
  });

  return result.data
    .map(mapRow)
    .map(row => {
      const numerator = toNumber(row.numerator);
      const denominator = toNumber(row.denominator);
      const compareDir = toNumber(row.compare_dir);
      const month = monthFromDate(row.date_closed);

      let isBreach = false;
      if (compareDir === 1) isBreach = numerator < denominator;
      if (compareDir === -1) isBreach = numerator > 0;

      return {
        source: '3093',
        file_name: fileName,
        month,
        sla_code: row.sla_code,
        sla_name: row.sla_name,
        compare_dir: compareDir,
        numerator,
        denominator,
        incident_ticket: row.incident_ticket,
        status: row.status,
        queue: row.queue,
        queue_normalized: normalizeQueue(row.queue),
        iso_language: row.iso_language,
        language_name: row.language_name,
        topic: row.topic,
        excluded: false,
        is_breach: Boolean(isBreach),
        raw: row
      };
    })
    .filter(row => ['March', 'April', 'May'].includes(row.month));
}
