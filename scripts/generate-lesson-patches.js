#!/usr/bin/env node
/**
 * Generate comprehensive lesson patch files for Terrain stats/geo lessons.
 * Usage: node scripts/generate-lesson-patches.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'lesson-patches');
const { buildDescriptiveStats } = require('./generate-descriptive-stats');
const { buildRegression } = require('./lesson-builders/regression');
const { buildTimeSeries } = require('./lesson-builders/time-series');
const { buildGeospatial } = require('./lesson-builders/geospatial');
const { buildGridded } = require('./lesson-builders/gridded-remote-sensing');

function esc(s) {
  return JSON.stringify(s);
}

function writeLesson(id, lesson) {
  const lines = ['module.exports = {'];
  lines.push('  title: ' + esc(lesson.title) + ',');
  lines.push("  track: '" + lesson.track + "', tool: '" + lesson.tool + "', level: '" + lesson.level + "', time: " + esc(lesson.time) + ',');
  lines.push('  lede: ' + esc(lesson.lede) + ',');
  lines.push('  learn: ' + JSON.stringify(lesson.learn, null, 2).replace(/\n/g, '\n  ') + ',');
  if (lesson.prereqs) lines.push('  prereqs: ' + JSON.stringify(lesson.prereqs) + ',');
  lines.push('  resources: ' + JSON.stringify(lesson.resources, null, 2).replace(/\n/g, '\n  ') + ',');
  if (lesson.unlock) lines.push('  unlock: ' + JSON.stringify(lesson.unlock) + ',');
  lines.push('  content: [');
  for (const b of lesson.content) {
    const parts = ['type: ' + esc(b.type)];
    if (b.text) parts.push('text: ' + esc(b.text));
    if (b.html) parts.push('html: ' + esc(b.html));
    if (b.lang) parts.push('lang: ' + esc(b.lang));
    if (b.code) parts.push('code: ' + esc(b.code));
    if (b.caption) parts.push('caption: ' + esc(b.caption));
    if (b.variant) parts.push('variant: ' + esc(b.variant));
    if (b.title) parts.push('title: ' + esc(b.title));
    if (b.hint) parts.push('hint: ' + esc(b.hint));
    if (b.items) parts.push('items: ' + JSON.stringify(b.items));
    if (b.head) parts.push('head: ' + JSON.stringify(b.head));
    if (b.rows) parts.push('rows: ' + JSON.stringify(b.rows));
    if (b.solution) {
      let sol = 'solution: { lang: ' + esc(b.solution.lang) + ', code: ' + esc(b.solution.code);
      if (b.solution.note) sol += ', note: ' + esc(b.solution.note);
      sol += ' }';
      parts.push(sol);
    }
    lines.push('    { ' + parts.join(', ') + ' },');
  }
  lines.push('  ]');
  lines.push('};');
  lines.push('');
  const file = path.join(OUT, id + '.js');
  fs.writeFileSync(file, lines.join('\n'));
  return lesson.content.length;
}

const BUILDERS = {
  'descriptive-stats': buildDescriptiveStats,
  'regression': buildRegression,
  'time-series': buildTimeSeries,
  'geospatial': buildGeospatial,
  'gridded-remote-sensing': buildGridded
};

if (require.main === module) {
  fs.mkdirSync(OUT, { recursive: true });
  const counts = {};
  for (const [id, fn] of Object.entries(BUILDERS)) {
    counts[id] = writeLesson(id, fn());
    console.log(id.padEnd(28), 'blocks:', counts[id]);
  }
}

module.exports = { writeLesson, BUILDERS, OUT };
