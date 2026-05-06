import { useState } from 'react';
// In your Vite project, use: import analysisSrc from './python/analysis.py?raw';
// For demo purposes we inline a placeholder reference here.
import type { AnalysisResult, Solvent } from './types';
import { usePyodide } from './hooks/usePyodide';
import { TopBar } from './components/TopBar';
import { DropZone } from './components/DropZone';
import { RefTables } from './components/RefTables';
import { ResultCard } from './components/ResultCard';
import { ComparisonTable } from './components/ComparisonTable';

// ── Vite raw import (add `?raw` suffix in your actual Vite project) ──────────
// import analysisSrc from './python/analysis.py?raw';
// For this scaffold we declare it as a const that would come from the import:
declare const __ANALYSIS_SRC__: string; // replaced at build time by Vite plugin
const analysisSrc =
  typeof __ANALYSIS_SRC__ !== 'undefined'
    ? __ANALYSIS_SRC__
    : '# analysis.py not injected — ensure Vite raw import is configured';

export default function App() {
  const [solvent, setSolvent]   = useState<Solvent>('H2O');
  const [results, setResults]   = useState<AnalysisResult[]>([]);
  const { status, run }         = usePyodide(analysisSrc);

  function handleResult(r: AnalysisResult) {
    setResults(prev => [...prev, r]);
  }

  return (
    <>
      {/* Sticky header */}
      <TopBar status={status} />

      {/* Init banner */}
      {status === 'loading' && (
        <div className="init-banner">
          <div className="spinner-xs" />
          <span>Initialising Pyodide — first load ~10 s, then cached…</span>
        </div>
      )}

      {/* Two-column layout */}
      <div className="split">
        {/* ── Left panel ── */}
        <aside className="panel-left">

          {/* Settings + upload */}
          <div className="card">
            <div className="card-title">
              <span className="card-title-dot" />
              Analysis settings &amp; upload
            </div>
            <DropZone
              solvent={solvent}
              onSolventChange={setSolvent}
              pyStatus={status}
              onResults={handleResult}
              run={run}
            />
          </div>

          {/* Reference tables */}
          <RefTables solvent={solvent} />

          {/* Signature */}
          <div className="signature">
            <div className="sig-rule" />
            <div className="sig-name">Sana A. E. Abzakh</div>
            <div className="sig-role">Secondary Structure Calculator · Amide I/II/III FTIR</div>
            <div className="sig-email">
              <a href="mailto:sanaabzakh262@gmail.com">sanaabzakh262@gmail.com</a>
            </div>
          </div>
        </aside>

        {/* ── Right panel ── */}
        <main className="panel-right">
          {results.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="section-label">Results</div>
              {results.map((r, i) => (
                <ResultCard key={`${r.sample_name}-${i}`} result={r} />
              ))}
              <ComparisonTable results={results} />
            </>
          )}
        </main>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 20h20M6 20V10M12 20V4M18 20v-6"/>
        </svg>
      </div>
      <h3>No results yet</h3>
      <p>
        Choose a solvent, upload PeakFit files.<br/>
        Each result shows Amide I, II, and III tabs<br/>
        with their own charts and percentages.
      </p>
    </div>
  );
}
