#!/usr/bin/env node
// Build a self-contained on-device player (one HTML file) from a script.
// Usage: node engine/build-player.js scripts/example.txt [out/example-player.html] [--title "My Video"]
// Publish the result as a claude.ai Artifact with capabilities {tts:{}, downloads:true}.
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const src = args[0]; if (!src) { console.log('usage: node engine/build-player.js <script.txt> [out.html] [--title T]'); process.exit(1); }
const out = args[1] && !args[1].startsWith('--') ? args[1] : 'out/' + path.basename(src).replace(/\.\w+$/, '') + '-player.html';
const raw = fs.readFileSync(src, 'utf8');
const title = opt('--title', (raw.match(/^title:\s*(.+)$/m) || [])[1] || path.basename(src).replace(/\.\w+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
const libs = ['parse.js', 'lib/core.js', 'lib/classic.js', 'lib/world.js', 'lib/chars.js', 'lib/toons.js', 'lib/sonicworld.js', 'lib/main.js'];
const engine = libs.map(f => `<script>\n// ---- ${f} ----\n${fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>`).join('\n');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = fs.readFileSync(path.join(__dirname, 'player-shell.html'), 'utf8')
  .split('__TITLE__').join(esc(title))
  .replace('__ENGINE__', () => engine)
  .replace('__SCRIPT_JSON__', () => JSON.stringify(raw).replace(/</g, '\\u003c'));
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
console.log(`player -> ${out} (${(html.length / 1024).toFixed(0)} KB)`);
