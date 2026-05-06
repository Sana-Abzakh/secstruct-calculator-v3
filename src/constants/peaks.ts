import type { StructureGroup } from '../types';

// ── Group display config ─────────────────────────────────────────────────────

export const GROUP_COLORS: Record<string, { pie: string; badge: string }> = {
  'β-Sheet':       { pie: '#0C3B2E', badge: 'badge-beta'        },
  'α-Helix':       { pie: '#6D9773', badge: 'badge-helix'       },
  'Random Coil':   { pie: '#BB8A52', badge: 'badge-coil'        },
  'β-Turns':       { pie: '#FFBA00', badge: 'badge-turn'        },
  'Unassigned':    { pie: '#8b1a1a', badge: 'badge-unassigned'  },
  'Unassigned II': { pie: '#aaaaaa', badge: 'badge-unassigned'  },
};

export const METRIC_CLASS: Partial<Record<StructureGroup, string>> = {
  'β-Sheet':     'm-forest',
  'α-Helix':     'm-sage',
  'Random Coil': 'm-tan',
  'β-Turns':     'm-gold',
};

// ── Amide I peak assignment reference tables ─────────────────────────────────

export interface RefRow {
  range:      string;
  label:      string;
  group:      string;
  badge:      string;
  tolerance:  string;
  frequencies: string;
}

export const REF_TABLES: Record<'H2O' | 'D2O', RefRow[]> = {
  H2O: [
    { range: '1600–1627.9',  label: 'Aggregated β-Sheet',   group: 'β-Sheet',    badge: 'badge-beta-agg',  tolerance: '±2', frequencies: '1624±1.0, 1627±2.0'                              },
    { range: '1628–1642.9',  label: 'β-Sheet (Main)',        group: 'β-Sheet',    badge: 'badge-beta',      tolerance: '±2', frequencies: '1633±2.0, 1638±2.0, 1642±1.0'                    },
    { range: '1643–1649.4',  label: 'Random Coil',           group: 'Random Coil',badge: 'badge-coil',      tolerance: '',   frequencies: '1648±2.0'                                         },
    { range: '1649.5–1659.9',label: 'α-Helix',               group: 'α-Helix',    badge: 'badge-helix',     tolerance: '±3', frequencies: '1656±2.0'                                         },
    { range: '1660–1689.9',  label: 'β-Turns & Loops',       group: 'β-Turns',    badge: 'badge-turn',      tolerance: '',   frequencies: '1667±1.0, 1675±1.0'                               },
    { range: '1690–1700',    label: 'Anti-parallel β-Sheet', group: 'β-Sheet',    badge: 'badge-beta-anti', tolerance: '±2', frequencies: '1680±2.0, 1685±2.0, 1691±2.0, 1696±2.0'          },
  ],
  D2O: [
    { range: '1600–1625.9',  label: 'Aggregated β-Sheet',   group: 'β-Sheet',    badge: 'badge-beta-agg',  tolerance: '±2', frequencies: '1624±4.0'                                         },
    { range: '1630–1642.9',  label: 'β-Sheet (Main)',        group: 'β-Sheet',    badge: 'badge-beta',      tolerance: '±2', frequencies: '1631±3.0, 1637±3.0'                               },
    { range: '1643–1649.4',  label: 'Random Coil',           group: 'Random Coil',badge: 'badge-coil',      tolerance: '',   frequencies: '1645±4.0'                                         },
    { range: '1649.5–1659.9',label: 'α-Helix',               group: 'α-Helix',    badge: 'badge-helix',     tolerance: '±3', frequencies: '1653±4.0'                                         },
    { range: '1660–1679.9',  label: 'β-Turns & Loops',       group: 'β-Turns',    badge: 'badge-turn',      tolerance: '',   frequencies: '1663±4.0, 1671±3.0'                               },
    { range: '1680–1695',    label: 'Anti-parallel β-Sheet', group: 'β-Sheet',    badge: 'badge-beta-anti', tolerance: '±2', frequencies: '1675±5.0, 1683±2.0, 1689±2.0, 1694±2.0'          },
  ],
};

// ── Example CSV content ──────────────────────────────────────────────────────

export const EXAMPLE_CSV = `Peak  Type,a0,a1
1  Gauss Area,1.59058735,1487.10655
2  Gauss Area,1.92563363,1510.16619
3  Gauss Area,2.82564455,1529.90185
4  Gauss Area,3.7231001,1549.42688
5  Gauss Area,2.44687929,1569.22292
6  Gauss Area,2.09969959,1587.17638
7  Gauss Area,1.80231056,1603.71957
8  Gauss Area,1.56965764,1615.06068
9  Gauss Area,3.23420479,1628.15919
10  Gauss Area,4.50951954,1641.82573
11  Gauss Area,5.75423649,1658.12803
12  Gauss Area,3.14674435,1674.97106
13  Gauss Area,2.0568764,1690.26538
14  Gauss Area,1.25212566,1710.00948`;

// ── Solvent descriptions ─────────────────────────────────────────────────────

export const SOLVENT_NOTES: Record<'H2O' | 'D2O', string> = {
  H2O: 'H₂O: Amide I (1600–1700), Amide II (1510–1580), Amide III (1220–1340)',
  D2O: 'D₂O: Amide I (1600–1700), Amide II (1510–1580), Amide III (1220–1340)',
};
