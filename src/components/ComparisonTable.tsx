import type { AnalysisResult } from '../types';
import { downloadComparisonTXT } from '../utils/csv';

interface Props {
  results: AnalysisResult[];
}

const GROUPS = ['β-Sheet', 'α-Helix', 'Random Coil', 'β-Turns'] as const;

export function ComparisonTable({ results }: Props) {
  if (results.length < 2) return null;

  return (
    <div className="result-card">
      <div className="result-card-title">
        Comparison — {results.length} samples
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sample</th>
              <th>Solvent</th>
              {GROUPS.map(g => <th key={g}>{g}</th>)}
              <th>Agg.β%</th>
              <th>Para.β%</th>
              <th>Anti.β%</th>
              <th>α/β</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const gs = r.amide1.group_summary;
              const bs = r.amide1.beta_sub ?? {};
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{r.sample_name}</td>
                  <td>
                    <span style={{
                      fontSize: 9, fontFamily: 'var(--mono)',
                      background: 'var(--forest)', color: '#fff',
                      padding: '1px 5px', borderRadius: 3,
                    }}>
                      {r.solvent}
                    </span>
                  </td>
                  {GROUPS.map(g => <td key={g}>{(gs[g] ?? 0).toFixed(2)}%</td>)}
                  <td>{(bs.aggregated   ?? 0).toFixed(2)}%</td>
                  <td>{(bs.main         ?? 0).toFixed(2)}%</td>
                  <td>{(bs.antiparallel ?? 0).toFixed(2)}%</td>
                  <td>{r.ratio != null ? r.ratio.toFixed(3) : 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="dl-row">
        <button className="btn primary" onClick={() => downloadComparisonTXT(results)}>
          <DownloadIcon /> Download comparison TXT
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
