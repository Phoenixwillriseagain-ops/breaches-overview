# Breaches Overview — Combined V2 + 3093 Analysis Dashboard

A unified SLA breach analysis dashboard that merges **V2 breach Excel files** (KSL-4, KM-1, KSL-5a, KM-2) with **3093 SLA detail CSV exports** (KSL-2a, KSL-2b, KSL-2c, KSL-3a, KSL-5b, KSL-6) across three months: **March, April, and May**.

## Why This Tool

The V2 breach tracker only captures KSL-4, KM-1, KSL-5a, and KM-2. The missing KSLs (KSL-2, KSL-3, KSL-5b, KSL-6) live in the 3093 SLA detail reports. This dashboard combines both sources into a single view, enabling cross-SLA language and queue trend analysis.

## File Inputs

| Zone | Files | Source |
|---|---|---|
| V2 Drop Zone | `V2-breaches-March-26.xlsx`, `V2-breaches-April.xlsx`, `V2-breaches.xlsx` | B03 Folder 3091 export |
| CSV Drop Zone | `3093-SLAs-Details-12.csv` (May), `3093-SLAs-Details-13.csv` (April), `3093-SLAs-Details-14.csv` (March) | B03 Folder 3093 export |

> Month is auto-detected from close dates — do not rely on file numbers alone.

## Project Structure

```
breaches-overview/
├── index.html              ← Landing / month selector hub
├── combined-analyzer.html  ← Main combined dashboard
├── js/
│   ├── v2-parser.js        ← Parses V2 Excel breach files
│   ├── csv-parser.js       ← Parses 3093 CSV SLA detail files
│   ├── merger.js           ← Joins both sources into unified BreachRecord[]
│   ├── breach-engine.js    ← Breach detection (Compare_Dir rules for 3093)
│   └── charts.js           ← Chart.js visualizations
└── styles.css              ← Shared design tokens (Nexus palette)
```

## Development Phases

- **Phase 1** — Dual-source data ingestion (V2 Excel + 3093 CSV)
- **Phase 2** — Combined dashboard (language heatmap, trend lines, queue breakdown)
- **Phase 3** — Automated alerts + action plan export
- **Phase 4** — Ecosystem integration with breaches-tracker

## Live URL

https://phoenixwillriseagain-ops.github.io/breaches-overview/

## Related Repos

- [breaches-tracker](https://github.com/Phoenixwillriseagain-ops/breaches-tracker) — V2 breach sorter and reporter
- [sla-breach-analyzer](https://github.com/Phoenixwillriseagain-ops/sla-breach-analyzer) — Single-file breach analysis
