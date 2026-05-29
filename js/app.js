import { parseBreachesWorkbook } from './breaches-parser.js';
import { parseSLACsv } from './sla-parser.js';
import { mergeRecords, buildSummary } from './merger.js';

const breachesInput = document.getElementById('breachesFiles');
const csvInput = document.getElementById('slaFiles');
const runButton = document.getElementById('runMerge');
const breachesStatus = document.getElementById('breachesStatus');
const csvStatus = document.getElementById('slaStatus');
const summaryOutput = document.getElementById('summaryOutput');
const previewOutput = document.getElementById('previewOutput');

let breachesRecords = [];
let slaRecords = [];

async function readFileAsArrayBuffer(file) {
  return await file.arrayBuffer();
}

async function readFileAsText(file) {
  return await file.text();
}

breachesInput?.addEventListener('change', async event => {
  const files = Array.from(event.target.files || []);
  const parsed = [];

  for (const file of files) {
    const buffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(buffer, { type: 'array' });
    parsed.push(...parseBreachesWorkbook(file.name, workbook));
  }

  breachesRecords = parsed;
  breachesStatus.textContent = `${files.length} file(s) loaded — ${breachesRecords.length} parsed rows.`;
});

csvInput?.addEventListener('change', async event => {
  const files = Array.from(event.target.files || []);
  const parsed = [];

  for (const file of files) {
    const text = await readFileAsText(file);
    parsed.push(...parseSLACsv(file.name, text));
  }

  slaRecords = parsed;
  csvStatus.textContent = `${files.length} file(s) loaded — ${slaRecords.length} parsed rows.`;
});

runButton?.addEventListener('click', () => {
  const merged = mergeRecords(breachesRecords, slaRecords);
  const summary = buildSummary(merged);

  summaryOutput.textContent = JSON.stringify(summary, null, 2);
  previewOutput.textContent = JSON.stringify(merged.slice(0, 10), null, 2);
});
