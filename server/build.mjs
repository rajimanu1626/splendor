import * as esbuild from 'esbuild';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, 'dist', 'index.mjs');
const distDir = dirname(out);
if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

await esbuild.build({
  entryPoints: [join(__dirname, 'index.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: out,
  external: ['express', 'socket.io', 'http'],
  sourcemap: true,
  target: 'node20',
});

console.log('Server built to', out);
