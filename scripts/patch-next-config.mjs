#!/usr/bin/env node
// Applies local overrides to upstream/next.config.mjs before each build.
// Re-run automatically via `submodule:build`; safe to re-run multiple times.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = path.join(ROOT, 'upstream', 'next.config.mjs');

let content = fs.readFileSync(CONFIG, 'utf-8');
let changed = false;

// Remove basePath (GitHub Pages serves from /<repo-name>/ already)
if (content.includes("basePath:")) {
  content = content.replace(/\s*basePath:\s*['"][^'"]*['"],?/g, '');
  changed = true;
  console.log('patch-next-config: removed basePath');
} else {
  console.log('patch-next-config: no basePath found, skipping');
}

// Redirect distDir to <project-root>/docs  (upstream/ is one level below root)
if (!content.includes("distDir: '../docs'")) {
  content = content.replace(
    /distDir:\s*['"][^'"]+['"]/,
    "distDir: '../docs'"
  );
  changed = true;
  console.log('patch-next-config: set distDir to ../docs');
} else {
  console.log('patch-next-config: distDir already set, skipping');
}

if (changed) fs.writeFileSync(CONFIG, content);
