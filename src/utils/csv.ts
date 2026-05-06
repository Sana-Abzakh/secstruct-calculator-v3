import type { AnalysisResult } from '../types';

function triggerDL(content: string, filename: string, mime = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

// ── Single sample TXT ────────────────────────────────────────────────────────

export function downloadResultTXT(r: AnalysisResult): void {
  const { amide1: a1, amide2: a2, amide3: a3 } = r;
  const bs = a1.beta_sub ?? {};
  const S  = '='.repeat(65);
  const lines: string[] = [
    S,
    '  PROTEIN SECONDARY STRUCTURE CALCULATOR',
    `  Sample:  ${r.sample_name}`,
    `  File:    ${r.filename}`,
    `  Solvent: ${r.solvent}`,
    S, '',
    '  ── AMIDE I (1600–1700 cm⁻¹) ──',
    `  Total area: ${a1.total_area.toFixed(5)}`, '',
    '  Peak Detail:',
    `  ${'#'.padEnd(4)}  ${'Center'.padEnd(12)}  ${'Area'.padEnd(12)}  ${'Assignment'.padEnd(28)}  ${'Group'.padEnd(16)}  ${'%'.padStart(6)}`,
    '  ' + '-'.repeat(82),
  ];

  for (const d of a1.details) {
    lines.push(
      `  ${String(d.peak).padEnd(4)}  ${d.center.toFixed(2).padEnd(12)}  ${d.area.toFixed(5).padEnd(12)}  ${d.detail_label.padEnd(28)}  ${d.group.padEnd(16)}  ${d.pct.toFixed(2).padStart(6)}%`,
    );
  }

  lines.push('', '  Group Summary:');
  for (const g of a1.group_order) {
    if (g in a1.group_summary)
      lines.push(`  ${g.padEnd(30)}  ${a1.group_summary[g].toFixed(2).padStart(6)}%`);
  }

  lines.push(
    '', '  β-Sheet Breakdown:',
    `  Aggregated         : ${(bs.aggregated  ?? 0).toFixed(2)}%`,
    `  Parallel (Main)    : ${(bs.main        ?? 0).toFixed(2)}%`,
    `  Anti-parallel      : ${(bs.antiparallel ?? 0).toFixed(2)}%`,
  );

  if (r.ratio != null) lines.push('', `  α/β Ratio: ${r.ratio.toFixed(3)}`);

  if (a2.details?.length) {
    lines.push('', S, '  ── AMIDE II (1510–1580 cm⁻¹) ──', `  Total area: ${a2.total_area.toFixed(5)}`, '');
    for (const d of a2.details)
      lines.push(`  ${String(d.peak).padEnd(4)}  ${d.center.toFixed(2).padEnd(12)}  ${d.area.toFixed(5).padEnd(12)}  ${d.detail_label.padEnd(28)}  ${d.group.padEnd(16)}  ${d.pct.toFixed(2).padStart(6)}%`);
  }

  if (a3.details?.length) {
    lines.push('', S, '  ── AMIDE III (1220–1340 cm⁻¹) ──', `  Total area: ${a3.total_area.toFixed(5)}`, '');
    for (const d of a3.details)
      lines.push(`  ${String(d.peak).padEnd(4)}  ${d.center.toFixed(2).padEnd(12)}  ${d.area.toFixed(5).padEnd(12)}  ${d.detail_label.padEnd(28)}  ${d.group.padEnd(16)}  ${d.pct.toFixed(2).padStart(6)}%`);
  }

  lines.push('', S);
  triggerDL(lines.join('\n'), `${r.sample_name}_secondary_structure.txt`);
}

// ── Multi-sample comparison TXT ──────────────────────────────────────────────

export function downloadComparisonTXT(results: AnalysisResult[]): void {
  const groups = ['β-Sheet', 'α-Helix', 'Random Coil', 'β-Turns'];
  const S = '='.repeat(95);
  const lines: string[] = [S, '  MULTI-SAMPLE COMPARISON (Amide I)', S, ''];

  lines.push(
    `  ${'Sample'.padEnd(25)}  ${'Sol'.padEnd(5)}  ${groups.map(g => g.padEnd(12)).join('  ')}  ${'Agg.β'.padEnd(8)}  ${'Para.β'.padEnd(8)}  ${'Anti.β'.padEnd(8)}  ${'α/β'.padStart(6)}`,
    '  ' + '-'.repeat(95),
  );

  for (const r of results) {
    const gs = r.amide1.group_summary;
    const bs = r.amide1.beta_sub ?? {};
    lines.push(
      `  ${r.sample_name.padEnd(25)}  ${r.solvent.padEnd(5)}  ${groups.map(g => (gs[g] ?? 0).toFixed(2).padEnd(12)).join('  ')}  ${(bs.aggregated ?? 0).toFixed(2).padEnd(8)}  ${(bs.main ?? 0).toFixed(2).padEnd(8)}  ${(bs.antiparallel ?? 0).toFixed(2).padEnd(8)}  ${r.ratio != null ? r.ratio.toFixed(3).padStart(6) : '   N/A'}`,
    );
  }

  lines.push('', S);
  triggerDL(lines.join('\n'), 'comparison_secondary_structure.txt');
}

// ── Example CSV ──────────────────────────────────────────────────────────────

export function downloadExampleCSV(content: string): void {
  triggerDL(content, 'example_peakfit_output.csv', 'text/csv');
}
