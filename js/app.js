import { parseV2Workbook } from './v2-parser.js';
import { parse3093Csv } from './csv-parser.js';
import { mergeRecords, buildSummary } from './merger.js';

const v2Input = document.getElementById('v2Files');
const csvInput = document.getElementById('csvFiles');
const runButton = document.getElementById('runMerge');
const v2Status = document.getElementById('v2Status');
const csvStatus = document.getElementById('csvStatus');
const summaryOutput = document.getElementById('summaryOutput');
const previewOutput = document.getElementById('previewOutput');

let v2Records = [];
let csvRecords = [];

async function readFileAsArrayBuffer(file) {
  return await file.arrayBuffer();
}

async function readFileAsText(file) {
  return await file.text();
}

v2Input?.addEventListener('change', async event => {
  const files = Array.from(event.target.files || []);
  const parsed = [];

  for (const file of files) {
    const buffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(buffer, { type: 'array' });
    parsed.push(...parseV2Workbook(file.name, workbook));
  }

  v2Records = parsed;
  v2Status.textContent = `${files.length} file(s) loaded — ${v2Records.length} parsed rows.`;
});

csvInput?.addEventListener('change', async event => {
  const files = Array.from(event.target.files || []);
  const parsed = [];

  for (const file of files) {
    const text = await readFileAsText(file);
    parsed.push(...parse3093Csv(file.name, text));
  }

  csvRecords = parsed;
  csvStatus.textContent = `${files.length} file(s) loaded — ${csvRecords.length} parsed rows.`;
});

runButton?.addEventListener('click', () => {
  const merged = mergeRecords(v2Records, csvRecords);
  const summary = buildSummary(merged);

  summaryOutput.textContent = JSON.stringify(summary, null, 2);
  previewOutput.textContent = JSON.stringify(merged.slice(0, 10), null, 2);
});
