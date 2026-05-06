// ── Domain types ─────────────────────────────────────────────────────────────

export type Solvent = 'H2O' | 'D2O';

export type StructureGroup =
  | 'β-Sheet'
  | 'α-Helix'
  | 'Random Coil'
  | 'β-Turns'
  | 'Unassigned'
  | 'Unassigned II';

export interface PeakDetail {
  peak:          number;
  area:          number;
  center:        number;
  detail_label:  string;
  group:         StructureGroup;
  sub:           string;
  pct:           number;
}

export interface AmideRegionData {
  details:       PeakDetail[];
  group_summary: Record<string, number>;
  total_area:    number;
  beta_sub?:     Record<string, number>;
  group_order:   string[];
}

export interface AnalysisResult {
  sample_name:  string;
  filename:     string;
  solvent:      Solvent;
  amide1:       AmideRegionData;
  amide2:       AmideRegionData;
  amide3:       AmideRegionData;
  ratio:        number | null;
}

// ── Pyodide hook types ───────────────────────────────────────────────────────

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface UsePyodideReturn {
  status:  PyodideStatus;
  run:     (content: string, filename: string, solvent: Solvent) => Promise<AnalysisResult>;
}
