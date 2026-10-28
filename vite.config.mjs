import { defineExtensionConfig } from '@pterodactyl/sdk/vite';
import fs from 'node:fs';
import path from 'node:path';

let currentHash = '';
try {
  const currentPath = path.resolve(import.meta.dirname, '../../extension-assets/mc-helper/_current');
  if (fs.existsSync(currentPath)) {
    currentHash = fs.readFileSync(currentPath, 'utf-8').trim();
  }
} catch (e) {
}

const config = defineExtensionConfig({ entry: 'src/client/index.tsx' });

export default {
  ...config,
  build: {
    ...config.build,
    outDir: currentHash
      ? path.resolve(import.meta.dirname, `../../extension-assets/mc-helper/${currentHash}`)
      : 'dist',
    emptyOutDir: false,
  },
};