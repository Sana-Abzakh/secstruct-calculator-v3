import { useState } from 'react';
import type { AmideRegionData } from '../types';
import { GROUP_COLORS, METRIC_CLASS } from '../constants/peaks';
import { PieChart } from './PieChart';

interface Props {
  data:      AmideRegionData;
  showBeta?: boolean;
  ratio?:    number | null;
}

export function AmidePanel({ data, showBeta = false, ratio }: Props) {
  const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('summary');

  const { details, group_summary: gs, total_area: tot, beta_sub: bs = {}, group_order: go } = data;

  if (!details || details.length === 0) {
    return <div className="no-data">No peaks detected in this region.</div>;
  }

  const metricGroups = go.filter(g => !g.startsWith('Unassigned') && g in gs);

  return (
    <div className="amide-panel-content">
      {/* Metrics row */}
      <div className="metrics-row">
        {metricGroups.map(g => (
          <div key={g} className={`metric ${METRIC_CLASS[g as keyof typeof METRIC_CLASS] ?? ''}`}>
            <div className="metric-val">{(gs[g] ?? 0).toFixed(1)}%</div>
            <div className="metric-lbl">{g}</div>
          </div>
        ))}
      </div>

      {/* Pie + legend */}
      <div className="vis-row">
        <div className="pie-canvas-wrap">
          <PieChart groupSummary={gs} groupOrder={go} size={130} />
        </div>
        <div className="pie-legend">
          {go.filter(g => g in gs && gs[g] > 0).map(g => (
            <div key={g} className="pie-legend-row">
              <div className="pie-swatch" style={{ background: (GROUP_COLORS[g] ?? { pie: '#aaa' }).pie }} />
              <span className="pie-legend-name">{g}</span>
              <span className="pie-legend-pct">{gs[g].toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* α/β ratio chip */}
      {showBeta && ratio != null && (
        <div className="ratio-chip">
          α/β ratio: <strong>{ratio.toFixed(3)}</strong>
          &nbsp;&nbsp;α {(gs['α-Helix'] ?? 0).toFixed(2)}% / β {(gs['β-Sheet'] ?? 0).toFixed(2)}%
        </div>
      )}

      {/* β-Sheet breakdown */}
      {showBeta && (
        <div className="beta-breakdown">
          <div className="beta-breakdown-title">
            β-Sheet Breakdown — Total {(gs['β-Sheet'] ?? 0).toFixed(2)}%
          </div>
          <div className="beta-breakdown-rows">
            {[
              { key: 'aggregated',   label: 'Aggregated',        range: '1600–1627 cm⁻¹' },
              { key: 'main',         label: 'Parallel (Main)',    range: '1628–1642 cm⁻¹' },
              { key: 'antiparallel', label: 'Anti-parallel',      range: '1680–1695 cm⁻¹' },
            ].map(({ key, label, range }) => (
              <div key={key} className="beta-sub">
                <div className="beta-sub-val">{(bs[key] ?? 0).toFixed(1)}%</div>
                <div className="beta-sub-lbl">{label}<br/>{range}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="region-divider" />

      {/* Sub-tabs */}
      <div className="sub-tabs">
        {(['summary', 'detail'] as const).map(tab => (
          <button
            key={tab}
            className={`sub-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'summary' ? 'Group Summary' : 'Peak Detail'}
          </button>
        ))}
      </div>

      {/* Group summary table */}
      {activeTab === 'summary' && (
        <div className="sub-panel active">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Group</th><th>% Contribution</th></tr></thead>
              <tbody>
                {go.filter(g => g in gs).map(g => (
                  <tr key={g}>
                    <td>
                      <span className={`badge ${(GROUP_COLORS[g] ?? { badge: 'badge-unassigned' }).badge}`}>
                        {g}
                      </span>
                    </td>
                    <td>{gs[g].toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="area-note">Total area: {tot.toFixed(5)} &nbsp;|&nbsp; {details.length} peaks</p>
        </div>
      )}

      {/* Peak detail table */}
      {activeTab === 'detail' && (
        <div className="sub-panel active">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Center (cm⁻¹)</th><th>Area</th>
                  <th>Assignment</th><th>Group</th><th>%</th>
                </tr>
              </thead>
              <tbody>
                {details.map(d => (
                  <tr key={d.peak}>
                    <td>{d.peak}</td>
                    <td>{d.center.toFixed(2)}</td>
                    <td>{d.area.toFixed(5)}</td>
                    <td>
                      <span className={`badge ${(GROUP_COLORS[d.group] ?? { badge: 'badge-unassigned' }).badge}`}>
                        {d.detail_label}
                      </span>
                    </td>
                    <td>{d.group}</td>
                    <td>{d.pct.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
