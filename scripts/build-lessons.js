#!/usr/bin/env node
/**
 * Splice lesson patch files into lessons-data.js
 * Usage: node scripts/build-lessons.js
 *
 * Patch files live in scripts/lesson-patches/<lesson-id>.js
 * Each file exports a single lesson object (module.exports = { ... })
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'lessons-data.js');
const PATCH_DIR = path.join(__dirname, 'lesson-patches');

const ORDER = [
  'python-fundamentals', 'r-fundamentals', 'notebooks-colab', 'git-github',
  'pandas', 'tidyverse', 'data-cleaning', 'apis-csv-json',
  'matplotlib-seaborn', 'ggplot2', 'maps', 'data-storytelling',
  'descriptive-stats', 'regression', 'time-series',
  'geospatial', 'gridded-remote-sensing'
];

function loadLesson(id) {
  const file = path.join(PATCH_DIR, id + '.js');
  if (!fs.existsSync(file)) {
    console.warn('SKIP (no patch):', id);
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

// Load existing python-fundamentals if no patch
let existing = {};
try {
  const vm = require('vm');
  const src = fs.readFileSync(DATA, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  existing = sandbox.window.LESSONS || {};
} catch (e) {
  console.error('Failed to read existing lessons-data.js:', e.message);
  process.exit(1);
}

const LESSONS = {};
for (const id of ORDER) {
  const patched = loadLesson(id);
  LESSONS[id] = patched || existing[id];
  if (!LESSONS[id]) {
    console.error('Missing lesson:', id);
    process.exit(1);
  }
}

function esc(s) {
  return JSON.stringify(s);
}

function blockToJS(b) {
  const parts = [`type: ${esc(b.type)}`];
  if (b.text) parts.push(`text: ${esc(b.text)}`);
  if (b.html) parts.push(`html: ${esc(b.html)}`);
  if (b.lang) parts.push(`lang: ${esc(b.lang)}`);
  if (b.code) parts.push(`code: ${esc(b.code)}`);
  if (b.caption) parts.push(`caption: ${esc(b.caption)}`);
  if (b.variant) parts.push(`variant: ${esc(b.variant)}`);
  if (b.title) parts.push(`title: ${esc(b.title)}`);
  if (b.hint) parts.push(`hint: ${esc(b.hint)}`);
  if (b.items) parts.push(`items: ${JSON.stringify(b.items)}`);
  else if (b.type === 'steps' && b.steps) parts.push(`items: ${JSON.stringify(b.steps)}`);
  if (b.head) parts.push(`head: ${JSON.stringify(b.head)}`);
  if (b.rows) parts.push(`rows: ${JSON.stringify(b.rows)}`);
  if (b.solution) {
    const s = b.solution;
    let sol = `solution: { lang: ${esc(s.lang)}, code: ${esc(s.code)}`;
    if (s.note) sol += `, note: ${esc(s.note)}`;
    sol += ' }';
    parts.push(sol);
  }
  return `{ ${parts.join(', ')} }`;
}

function lessonToJS(id, L) {
  const lines = [];
  lines.push(`  '${id}': {`);
  lines.push(`    title: ${esc(L.title)},`);
  lines.push(`    track: '${L.track}', tool: '${L.tool}', level: '${L.level}', time: ${esc(L.time)},`);
  lines.push(`    lede: ${esc(L.lede)},`);
  lines.push(`    learn: ${JSON.stringify(L.learn, null, 2).replace(/\n/g, '\n    ')},`);
  if (L.prereqs) lines.push(`    prereqs: ${JSON.stringify(L.prereqs)},`);
  lines.push(`    resources: ${JSON.stringify(L.resources, null, 2).replace(/\n/g, '\n    ')},`);
  if (L.unlock) lines.push(`    unlock: ${JSON.stringify(L.unlock)},`);
  lines.push(`    content: [`);
  for (const b of L.content) {
    // fix steps type alias
    if (b.type === 'steps' && b.steps && !b.items) b.items = b.steps;
    lines.push(`      ${blockToJS(b)},`);
  }
  lines.push(`    ]`);
  lines.push(`  }`);
  return lines.join('\n');
}

const header = `/* ===========================================================================
   Terrain — Skills curriculum lesson content
   Rendered by lesson.html via ?id=<key>.
   Generated/updated by scripts/build-lessons.js
   =========================================================================== */

window.LESSON_ORDER = ${JSON.stringify(ORDER, null, 2)};

window.LESSONS = {
`;

const body = ORDER.map(id => lessonToJS(id, LESSONS[id])).join(',\n\n');
const footer = `\n};\n`;

fs.writeFileSync(DATA, header + body + footer);
console.log('Wrote', DATA);

// Stats
for (const id of ORDER) {
  const c = LESSONS[id].content;
  console.log(id.padEnd(28), 'blocks:', c.length, 'h2:', c.filter(b => b.type === 'h2').length);
}
