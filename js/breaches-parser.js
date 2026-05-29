import { detectMonthFromFilename } from './utils.js';

function findHeaderRow(rows) {
  return rows.findIndex(row => row.some(cell => String(cell || '').trim() === 'Incident Ticket'));
}

export function parseBreachesWorkbook(fileName, workbook) {
  const records = [];
  const fallbackMonth = detectMonthFromFilename(fileName);

  workbook.SheetNames
    .filter(name => name !== 'Instructions')
    .forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      const headerIndex = findHeaderRow(rows);
      if (headerIndex === -1) return;

      const headers = rows[headerIndex].map(value => String(value).trim());
      const dataRows = rows.slice(headerIndex + 1).filter(row => row.some(Boolean));

      dataRows.forEach(row => {
        const item = Object.fromEntries(headers.map((header, i) => [header, row[i] ?? '']));
        const excluded = Number(item.Excluded || 0) === 1;

        records.push({
          source: 'breaches',
          month: fallbackMonth,
          sla_code: sheetName,
          incident_ticket: item['Incident Ticket'] || '',
          status: item.Status || '',
          queue: item.Queue || '',
          queue_normalized: item.Queue || '',
          iso_language: item.ISO_Language || '',
          topic: item.TOPIC || '',
          breach_description: item.Breach_Description || '',
          excluded,
          is_breach: !excluded,
          raw: item
        });
      });
    });

  return records;
}
