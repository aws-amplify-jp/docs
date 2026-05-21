#!/usr/bin/env node
/**
 * Translates MDX files from upstream/src/pages to src/pages using Claude Haiku.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=xxx node scripts/translate.mjs              # all files
 *   ANTHROPIC_API_KEY=xxx node scripts/translate.mjs --dry-run    # estimate cost
 *   ANTHROPIC_API_KEY=xxx node scripts/translate.mjs --file upstream/src/pages/foo/index.mdx
 */
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'upstream/src/pages');
const TARGET_DIR = path.join(ROOT, 'src/pages');

const DRY_RUN = process.argv.includes('--dry-run');
const FILE_ARGS = (() => {
  const files = [];
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--file' && process.argv[i + 1]) files.push(process.argv[i + 1]);
  }
  return files.length > 0 ? files : null;
})();
const CONCURRENCY = (() => {
  const i = process.argv.indexOf('--concurrency');
  return i !== -1 ? parseInt(process.argv[i + 1], 10) : 5;
})();

// Model selection: --model flag overrides auto-selection.
// Auto: files > 40 KB use claude-sonnet-4-6 (64k output); smaller files use claude-haiku-4-5.
const MODEL_ARG = (() => {
  const i = process.argv.indexOf('--model');
  return i !== -1 ? process.argv[i + 1] : null;
})();
const DEFAULT_SMALL_MODEL = 'claude-haiku-4-5';
const DEFAULT_LARGE_MODEL = 'claude-sonnet-4-6';
const LARGE_FILE_THRESHOLD = 40_000; // bytes

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY && !DRY_RUN) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is required');
  process.exit(1);
}

const client = DRY_RUN ? null : new Anthropic();

const SYSTEM_PROMPT = `You are a technical documentation translator specializing in AWS Amplify documentation. Translate MDX documentation from English to Japanese.

Rules:
- Translate all human-readable text: headings, paragraphs, list items, descriptions, inline text
- PRESERVE without any modification:
  - All import/export statements (lines starting with "import" or "export")
  - Fenced code blocks (content between triple backticks including the language tag)
  - Inline code (content between single backticks)
  - JSX component tags, prop names, and prop values
  - "export const meta = { ... }" JavaScript blocks — EXCEPTION: translate the string values of "title" and "description" keys only
  - URLs, file paths, package names, identifier names
- Maintain all MDX structure, newlines, and formatting exactly as-is
- Output ONLY the translated MDX file content, no commentary or explanation`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// MDX block splitter — used for dry-run char counting
function splitMDX(content) {
  const segments = [];
  const lines = content.split('\n');
  let i = 0;
  let buffer = [];

  const flush = (type) => {
    if (buffer.length > 0) {
      segments.push({ type, content: buffer.join('\n') });
      buffer = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      flush('markdown');
      buffer.push(line);
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buffer.push(lines[i++]);
      if (i < lines.length) buffer.push(lines[i++]);
      flush('code');
      continue;
    }

    if (/^import\s/.test(line)) {
      flush('markdown');
      buffer.push(line);
      while (
        i + 1 < lines.length &&
        !lines[i].trimEnd().endsWith(';') &&
        !lines[i].trimEnd().endsWith("'") &&
        !lines[i].trimEnd().endsWith('"')
      ) {
        i++;
        buffer.push(lines[i]);
      }
      i++;
      flush('import');
      continue;
    }

    if (/^export\s/.test(line)) {
      flush('markdown');
      buffer.push(line);
      i++;
      let depth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      while (i < lines.length && depth > 0) {
        const l = lines[i];
        depth += (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
        buffer.push(l);
        i++;
      }
      if (depth === 0 && buffer.length === 1) {
        while (i < lines.length && lines[i].trim() !== '') buffer.push(lines[i++]);
      }
      flush('export');
      continue;
    }

    buffer.push(line);
    i++;
  }

  flush('markdown');
  return segments;
}

async function translateFile(srcPath, destPath) {
  try {
    await fs.access(destPath);
    return { status: 'skipped' };
  } catch {}

  const content = await fs.readFile(srcPath, 'utf-8');

  if (DRY_RUN) {
    const segments = splitMDX(content);
    const chars = segments
      .filter((s) => s.type === 'markdown' && s.content.trim())
      .reduce((sum, s) => sum + s.content.length, 0);
    return { status: 'would-translate', chars };
  }

  const model = MODEL_ARG ?? (content.length > LARGE_FILE_THRESHOLD ? DEFAULT_LARGE_MODEL : DEFAULT_SMALL_MODEL);
  const maxTokens = model === DEFAULT_LARGE_MODEL ? 64000 : 16384;

  // Retry on rate limit
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const message = await client.messages.stream({
        model,
        max_tokens: maxTokens,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content }],
      }).finalMessage();

      if (message.stop_reason === 'max_tokens') {
        console.warn(`  ⚠ max_tokens hit for ${path.basename(srcPath)} (model: ${model}, max: ${maxTokens}) — falling back to English original`);
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.writeFile(destPath, content);
        return { status: 'translated', model, inputTokens: message.usage.input_tokens, outputTokens: 0, cacheRead: message.usage.cache_read_input_tokens ?? 0 };
      }

      const translated = message.content.find((b) => b.type === 'text')?.text;
      if (!translated) throw new Error('No text in response');

      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.writeFile(destPath, translated);

      return {
        status: 'translated',
        model,
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        cacheRead: message.usage.cache_read_input_tokens ?? 0,
      };
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        const wait = Math.min((attempt + 1) * 30_000, 120_000);
        console.warn(`  Rate limited. Waiting ${wait / 1000}s...`);
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}

async function walk(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(p)));
    else if (/\.mdx?$/.test(entry.name)) files.push(p);
  }
  return files;
}

// --- Main ---
let files;
if (FILE_ARGS) {
  files = FILE_ARGS.map((f) => path.resolve(f));
} else {
  files = await walk(SOURCE_DIR);
}

console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Processing ${files.length} files... (concurrency: ${CONCURRENCY})`);

const counts = {};
let totalInputTokens = 0;
let totalOutputTokens = 0;
let totalChars = 0;
let completed = 0;

const queue = [...files.entries()];

const workers = Array.from({ length: Math.min(CONCURRENCY, files.length) }, async () => {
  while (true) {
    const item = queue.shift();
    if (!item) break;
    const [, file] = item;
    const rel = path.relative(SOURCE_DIR, file);
    const dest = path.join(TARGET_DIR, rel);

    try {
      const result = await translateFile(file, dest);
      counts[result.status] = (counts[result.status] ?? 0) + 1;
      completed++;

      if (result.status === 'translated') {
        totalInputTokens += result.inputTokens;
        totalOutputTokens += result.outputTokens;
        console.log(
          `[${completed}/${files.length}] translated: ${rel}` +
            ` (model:${result.model} in:${result.inputTokens} out:${result.outputTokens} cached:${result.cacheRead})`
        );
      } else if (result.status === 'would-translate') {
        totalChars += result.chars ?? 0;
      }
    } catch (err) {
      counts.error = (counts.error ?? 0) + 1;
      completed++;
      console.error(`[${completed}/${files.length}] ERROR: ${rel} — ${err.message}`);
    }
  }
});

await Promise.all(workers);

console.log(`\nSummary: ${JSON.stringify(counts)}`);

if (DRY_RUN && totalChars > 0) {
  // ~3 chars/token for English MDX; Japanese output is roughly similar
  const estInput = Math.ceil(totalChars / 3);
  const estOutput = Math.ceil(estInput * 0.85);
  const cost = (estInput / 1_000_000) * 1.0 + (estOutput / 1_000_000) * 5.0;
  console.log(`Est. input tokens : ${estInput.toLocaleString()}`);
  console.log(`Est. output tokens: ${estOutput.toLocaleString()}`);
  console.log(`Est. cost (Haiku) : ~$${cost.toFixed(2)}`);
} else if (totalInputTokens > 0) {
  const cost = (totalInputTokens / 1_000_000) * 1.0 + (totalOutputTokens / 1_000_000) * 5.0;
  console.log(`Total input tokens : ${totalInputTokens.toLocaleString()}`);
  console.log(`Total output tokens: ${totalOutputTokens.toLocaleString()}`);
  console.log(`Actual cost        : ~$${cost.toFixed(2)}`);
}
