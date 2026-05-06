import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import type { Solvent, PyodideStatus, AnalysisResult } from '../types';
import { SOLVENT_NOTES, EXAMPLE_CSV } from '../constants/peaks';
import { downloadExampleCSV } from '../utils/csv';

interface Props {
  solvent:          Solvent;
  onSolventChange:  (s: Solvent) => void;
  pyStatus:         PyodideStatus;
  onResults:        (r: AnalysisResult) => void;
  run:              (content: string, filename: string, solvent: Solvent) => Promise<AnalysisResult>;
}

interface Chip { name: string; solvent: Solvent; count: number }

export function DropZone({ solvent, onSolventChange, pyStatus, onResults, run }: Props) {
  const inputRef    = useRef<HTMLInputElement>(null);
  const [dragging, setDragging]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [loadMsg,  setLoadMsg]    = useState('');
  const [error,    setError]      = useState<string | null>(null);
  const [chips,    setChips]      = useState<Chip[]>([]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    if (pyStatus !== 'ready') { setError('Python engine not ready yet.'); return; }
    setError(null);

    for (const file of Array.from(files)) {
      setLoading(true);
      setLoadMsg(`Processing ${file.name}…`);
      try {
        const text   = await file.text();
        const result = await run(text, file.name, solvent);
        onResults(result);
        const total = result.amide1.details.length + result.amide2.details.length + result.amide3.details.length;
        setChips(prev => [...prev, { name: result.sample_name, solvent, count: total }]);
      } catch (e) {
        setError(`${file.name}: ${(e as Error).message}`);
      }
    }
    setLoading(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.target.value = '';
  }

  return (
    <div className="dropzone-section">
      {/* Solvent toggle */}
      <div className="solvent-row">
        <span className="solvent-label">Solvent:</span>
        <div className="solvent-toggle">
          {(['H2O', 'D2O'] as Solvent[]).map(s => (
            <button
              key={s}
              className={`solvent-btn${solvent === s ? ' active' : ''}`}
              onClick={() => onSolventChange(s)}
            >
              {s === 'H2O' ? 'H₂O' : 'D₂O'}
            </button>
          ))}
        </div>
      </div>
      <div className="solvent-note">{SOLVENT_NOTES[solvent]}</div>

      {/* Example download */}
      <div className="example-row">
        <span className="example-label">
          <strong>Example CSV</strong> — PeakFit format (Peak Type, a0, a1)
        </span>
        <button className="btn gold sm" onClick={() => downloadExampleCSV(EXAMPLE_CSV)}>
          <DownloadIcon /> Download
        </button>
      </div>

      {/* Drop target */}
      <div
        className={`dropzone${dragging ? ' drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload PeakFit CSV files"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          multiple
          style={{ display: 'none' }}
          onChange={onChange}
        />
        <div className="drop-icon">
          <UploadIcon />
        </div>
        <div className="drop-title">Drop files or click to browse</div>
        <div className="drop-sub">.csv · multiple files supported</div>
      </div>

      {/* File chips */}
      {chips.length > 0 && (
        <div className="file-chips">
          {chips.map((c, i) => (
            <div key={i} className="file-chip">
              <CheckIcon />
              {c.name} [{c.solvent}] ({c.count} peaks)
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loader-wrap visible">
          <div className="spinner" />
          <span>{loadMsg}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert error visible">
          <InfoIcon />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// ── Inline SVG helpers ───────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
