#!/usr/bin/env node
// Build the on-device MP4 renderer page from a script. The page draws every frame on the viewer's device and
// hardware-encodes H.264 + the pre-mixed AAC soundtrack into an MP4 (WebCodecs + mp4-muxer). Length is exact.
// Usage: node engine/build-render.js scripts/shadow.txt out/shadow-render.html --audio shadow-audio.json
// Publish with files {"<audio>": "out/<audio>"} and capabilities {downloads: true}.
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const src = args[0], out = args[1], audio = opt('--audio', 'audio.json');
const raw = fs.readFileSync(src, 'utf8'), name = (raw.match(/^name:\s*(.+)$/m) || [, 'video'])[1].trim();
const title = (raw.match(/^title:\s*(.+)$/m) || [, name])[1].trim().replace(/ From Day 1 to FINAL FORM$/i, '');
const libs = ['parse.js', 'lib/core.js', 'lib/classic.js', 'lib/world.js', 'lib/chars.js', 'lib/toons.js', 'lib/sonicworld.js', 'lib/mg2.js', 'lib/main.js'];
const engine = libs.map(f => `<script>\n// ---- ${f} ----\n${fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>`).join('\n');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = fs.readFileSync(path.join(__dirname, 'render-shell.html'), 'utf8')
  .split('__TITLE__').join(esc(title)).split('__NAME__').join(name.replace(/[^\w-]/g, ''))
  .replace("fetch('shadow-audio.json')", () => `fetch(${JSON.stringify(audio)})`)
  .replace('__ENGINE__', () => engine).replace('__SCRIPT_JSON__', () => JSON.stringify(raw).replace(/</g, '\\u003c'));
fs.writeFileSync(out, html); console.log(`renderer -> ${out} (${(html.length / 1024).toFixed(0)} KB)`);
