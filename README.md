# SecStruct Calculator — Modular React + Vite + TypeScript

Refactored from a single 800-line HTML file into a proper project.

## Project structure

```
src/
├── python/
│   └── analysis.py          # ① Pure science. Edit peak ranges here.
├── types/
│   └── index.ts             # ② Shared TypeScript types
├── constants/
│   └── peaks.ts             # ③ Group colours, badge classes, ref tables, example CSV
├── hooks/
│   └── usePyodide.ts        # ④ Pyodide lifecycle hook  →  { status, run }
├── utils/
│   └── csv.ts               # ⑤ Download helpers (TXT / comparison TXT / example CSV)
├── components/
│   ├── TopBar.tsx            # ⑥ Sticky header + engine status badge
│   ├── DropZone.tsx          # ⑦ Solvent toggle + file drop + chips + alerts
│   ├── PieChart.tsx          # ⑧ Canvas donut chart (pure, no side-effects)
│   ├── AmidePanel.tsx        # ⑨ One amide region: metrics, pie, β-breakdown, tables
│   ├── ResultCard.tsx        # ⑩ Full per-sample card (amide I/II/III tabs)
│   ├── ComparisonTable.tsx   # ⑪ Multi-sample comparison table
│   └── RefTables.tsx         # ⑫ Amide I/II/III assignment reference cards
├── App.tsx                  # Root — wires state + layout
├── main.tsx                 # createRoot entry
└── index.css                # All CSS variables & styles (extracted verbatim)
```

## Getting started

```bash
npm install
npm run dev
```

## Changing peak assignment ranges

Open **`src/python/analysis.py`** and edit `ASSIGNMENT_H2O` / `ASSIGNMENT_D2O`.
The Vite plugin (`vite.config.ts → injectPySrc`) reads the file at build time
and injects it as `__ANALYSIS_SRC__`, which `usePyodide` passes to Pyodide on init.
No HTML digging required.

## How `usePyodide` works

```ts
const { status, run } = usePyodide(analysisSrc);
// status: 'idle' | 'loading' | 'ready' | 'error'
// run(content, filename, solvent) → Promise<AnalysisResult>
```

The hook keeps a module-level singleton so Pyodide is only initialised once
even if the component remounts.

## Adding a new amide region

1. Add assignment table in `analysis.py`
2. Add group order constant in `analysis.py`
3. Call `calc()` in `analyze_for_web()` and include in return JSON
4. Add a new tab in `ResultCard.tsx`
5. Add colour entry in `constants/peaks.ts → GROUP_COLORS`
