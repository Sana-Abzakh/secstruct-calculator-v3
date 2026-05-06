import { useState } from 'react';
import type { AnalysisResult } from '../types';
import { AmidePanel } from './AmidePanel';
import { downloadResultTXT } from '../utils/csv';

interface Props {
  result: AnalysisResult;
}

type AmideTab = 'amide1' | 'amide2' | 'amide3';

const AMIDE_TABS: { key: AmideTab; label: string; range: string; pip: string }[] = [
  { key: 'amide1', label: 'Amide I',   range: '1600–1700 cm⁻¹', pip: 'i'   },
  { key: 'amide2', label: 'Amide II',  range: '1480–1575 cm⁻¹', pip: 'ii'  },
  { key: 'amide3', label: 'Amide III', range: '1220–1340 cm⁻¹', pip: 'iii' },
];

export function ResultCard({ result }: Props) {
  const [activeAmide, setActiveAmide] = useState<AmideTab>('amide1');

  const isEmpty = (key: AmideTab) =>
    !result[key]?.details?.length;

  return (
    <div className="result-card">
      <div className="result-card-title">
        {result.sample_name}
        <span className="result-card-file">{result.filename}</span>
        <span className="result-card-solvent">{result.solvent}</span>
      </div>

      {/* Amide region tabs */}
      <div className="amide-tabs">
        {AMIDE_TABS.map(({ key, label, range, pip }) => (
          <button
            key={key}
            className={`amide-tab${activeAmide === key ? ' active' : ''}`}
            style={isEmpty(key) ? { opacity: 0.4 } : undefined}
            onClick={() => setActiveAmide(key)}
          >
            <span className={`amide-tab-pip ${pip}`} />
            {label}&nbsp;
            <span className="amide-range">{range}</span>
            {isEmpty(key) && (
              <span style={{ fontSize: 8, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>(none)</span>
            )}
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div style={{ paddingTop: '1rem' }}>
        {activeAmide === 'amide1' && (
          <AmidePanel data={result.amide1} showBeta ratio={result.ratio} />
        )}
        {activeAmide === 'amide2' && (
          isEmpty('amide2')
            ? <div className="no-data">No Amide II peaks detected (1480–1575 cm⁻¹) in this file.</div>
            : <AmidePanel data={result.amide2} />
        )}
        {activeAmide === 'amide3' && (
          isEmpty('amide3')
            ? <div className="no-data">No Amide III peaks detected (1220–1340 cm⁻¹) in this file.</div>
            : <AmidePanel data={result.amide3} />
        )}
      </div>

      <div className="dl-row">
        <button className="btn" onClick={() => downloadResultTXT(result)}>
          <DownloadIcon /> Download TXT
        </button>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
