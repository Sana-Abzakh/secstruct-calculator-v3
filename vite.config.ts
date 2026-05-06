import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Custom plugin: inject analysis.py source as a build-time constant
function injectPySrc() {
  return {
    name: 'inject-py-src',
    config() {
      const pyPath = path.resolve(__dirname, 'src/python/analysis.py');
      const src    = fs.existsSync(pyPath)
        ? JSON.stringify(fs.readFileSync(pyPath, 'utf-8'))
        : '"# analysis.py not found"';
      return {
        define: {
          __ANALYSIS_SRC__: src,
        },
      };
    },
  };
}

export default defineConfig({
  base: '/secstruct-calculator-v3/',
  plugins: [react(), injectPySrc()],
});
