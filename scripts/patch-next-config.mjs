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

// Ensure basePath: '/docs' is set
if (!content.includes("basePath: '/docs'")) {
  content = content.replace(
    /(\s*output:\s*'export',)/,
    "$1\n    basePath: '/docs',"
  );
  changed = true;
  console.log('patch-next-config: added basePath /docs');
} else {
  console.log('patch-next-config: basePath already set, skipping');
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
