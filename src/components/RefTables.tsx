import { useState } from 'react';
import type { Solvent } from '../types';
import { REF_TABLES } from '../constants/peaks';

interface Props {
  solvent: Solvent;
}

export function RefTables({ solvent }: Props) {
  const [selected, setSelected] = useState<Solvent>(solvent);
  const rows = REF_TABLES[selected];

  return (
    <>
      {/* Amide I reference */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-dot" />
          Amide I peak assignment
        </div>
        <div className="ref-dropdown-row">
          <span className="ref-dropdown-label">Table:</span>
          <select
            className="ref-select"
            value={selected}
            onChange={e => setSelected(e.target.value as Solvent)}
          >
            <option value="H2O">H₂O</option>
            <option value="D2O">D₂O</option>
          </select>
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Range (cm⁻¹)</th>
              <th>Assignment</th>
              <th>Group</th>
              <th>Mean frequencies</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td><strong>{r.range}</strong></td>
                <td><span className={`badge ${r.badge}`}>{r.label}</span></td>
                <td>{r.group}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>
                  {r.frequencies}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Amide II & III reference */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-dot" />
          Amide II &amp; III reference
        </div>
        <table className="ref-table">
          <thead><tr><th>Region</th><th>Range (cm⁻¹)</th><th>Assignment</th></tr></thead>
          <tbody>
            <tr>
              <td style={{ color: 'var(--blue)', fontWeight: 600 }}>Amide II</td>
              <td>~1545</td>
              <td><span className="badge badge-helix">α-Helix</span></td>
            </tr>
            <tr>
              <td style={{ color: 'var(--blue)', fontWeight: 600 }}>Amide II</td>
              <td>~1530</td>
              <td><span className="badge badge-beta">β-Sheet</span></td>
            </tr>
            <tr>
              <td style={{ color: 'var(--blue)', fontWeight: 600 }}>Amide II</td>
              <td>1528; 1577</td>
              <td><span className="badge badge-turn">β-Turn</span></td>
            </tr>
            <tr>
              <td style={{ color: 'var(--purple)', fontWeight: 600 }}>Amide III</td>
              <td>1293–1331</td>
              <td><span className="badge badge-helix">α-Helix</span></td>
            </tr>
            <tr>
              <td style={{ color: 'var(--purple)', fontWeight: 600 }}>Amide III</td>
              <td>1223–1251</td>
              <td><span className="badge badge-beta">β-Sheet</span></td>
            </tr>
            <tr>
              <td style={{ color: 'var(--purple)', fontWeight: 600 }}>Amide III</td>
              <td>1244–1290</td>
              <td><span className="badge badge-coil">Unord.+Turn</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
