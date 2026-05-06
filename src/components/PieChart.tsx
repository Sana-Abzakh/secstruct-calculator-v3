import { useEffect, useRef } from 'react';
import { GROUP_COLORS } from '../constants/peaks';

interface Props {
  groupSummary: Record<string, number>;
  groupOrder:   string[];
  size?:        number;
}

export function PieChart({ groupSummary, groupOrder, size = 130 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const cx  = canvas.width  / 2;
    const cy  = canvas.height / 2;
    const rad = Math.min(cx, cy) - 3;

    const slices = groupOrder
      .filter(g => g in groupSummary && groupSummary[g] > 0)
      .map(g => ({ pct: groupSummary[g], col: (GROUP_COLORS[g] ?? { pie: '#aaa' }).pie }));

    const total = slices.reduce((s, sl) => s + sl.pct, 0);
    let angle   = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const sl of slices) {
      const sweep = (sl.pct / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rad, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle   = sl.col;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 2;
      ctx.stroke();
      angle += sweep;
    }

    // donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, rad * 0.42, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }, [groupSummary, groupOrder]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
}
