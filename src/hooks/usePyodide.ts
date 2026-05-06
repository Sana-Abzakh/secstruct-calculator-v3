import { useState, useEffect, useRef, useCallback } from 'react';
import type { UsePyodideReturn, PyodideStatus, AnalysisResult, Solvent } from '../types';

// Vite raw import — the .py file is bundled as a string
// In the Vite project, add `?raw` to your import:
//   import analysisSrc from '../python/analysis.py?raw';
// For portability we accept it as an external prop instead.
declare const loadPyodide: (opts?: Record<string, unknown>) => Promise<{
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython:      (code: string) => unknown;
  globals:        { set: (k: string, v: unknown) => void };
}>;

let _pyodideInstance: Awaited<ReturnType<typeof loadPyodide>> | null = null;
let _initPromise: Promise<void> | null = null;

export function usePyodide(analysisSrc: string): UsePyodideReturn {
  const [status, setStatus] = useState<PyodideStatus>('idle');
  const pyRef = useRef<typeof _pyodideInstance>(null);

  useEffect(() => {
    if (_pyodideInstance) {
      pyRef.current = _pyodideInstance;
      setStatus('ready');
      return;
    }

    if (!_initPromise) {
      _initPromise = (async () => {
        setStatus('loading');
        try {
          const py = await loadPyodide();
          await py.runPythonAsync(analysisSrc);
          _pyodideInstance = py;
        } catch (e) {
          _initPromise = null; // allow retry
          throw e;
        }
      })();
    }

    _initPromise
      .then(() => {
        pyRef.current = _pyodideInstance;
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [analysisSrc]);

  const run = useCallback(
    async (content: string, filename: string, solvent: Solvent): Promise<AnalysisResult> => {
      if (!pyRef.current) throw new Error('Pyodide not ready');
      const py = pyRef.current;
      py.globals.set('_wc', content);
      py.globals.set('_wf', filename);
      py.globals.set('_ws', solvent);
      const raw = py.runPython('analyze_for_web(_wc, _wf, _ws)') as string;
      const result = JSON.parse(raw) as AnalysisResult & { error?: string };
      if (result.error) throw new Error(result.error);
      return result;
    },
    [],
  );

  return { status, run };
}
