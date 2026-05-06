import type { PyodideStatus } from '../types';

interface Props {
  status: PyodideStatus;
}

const STATUS_LABEL: Record<PyodideStatus, string> = {
  idle:    '⏳ loading engine…',
  loading: '⏳ initialising…',
  ready:   '✓ Python ready',
  error:   '✗ engine error',
};

export function TopBar({ status }: Props) {
  return (
    <header className="top-bar">
      <div className="logo">
        <div className="logo-mark">
          <svg viewBox="0 0 26 26" fill="none">
            <line x1="3" y1="21" x2="23" y2="21" stroke="#0C3B2E" strokeWidth="1.3" strokeLinecap="round"/>
            <rect x="4"    y="16" width="2"   height="5"  rx=".8" fill="#0C3B2E" opacity=".5"/>
            <rect x="7.5"  y="12" width="2"   height="9"  rx=".8" fill="#0C3B2E" opacity=".7"/>
            <rect x="11"   y="6"  width="2.5" height="15" rx=".8" fill="#0C3B2E"/>
            <rect x="15"   y="10" width="2"   height="11" rx=".8" fill="#0C3B2E" opacity=".75"/>
            <rect x="18.5" y="14" width="2"   height="7"  rx=".8" fill="#0C3B2E" opacity=".45"/>
            <path d="M9.5 4 C10.5 2.5,12 5.5,13.5 4 C15 2.5,16.5 5.5,17.5 4" stroke="#0C3B2E" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div className="logo-text">
          <div className="logo-title">SecStruct Calculator</div>
          <div className="logo-sub">Amide I · II · III · FTIR · H₂O / D₂O</div>
        </div>
      </div>
      <span className={`badge-engine${status === 'ready' ? ' ready' : ''}`}>
        {STATUS_LABEL[status]}
      </span>
    </header>
  );
}
