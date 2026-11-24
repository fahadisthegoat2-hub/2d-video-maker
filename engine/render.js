#!/usr/bin/env node
// Usage: node engine/render.js scripts/example.txt [out.mp4] [--preview] [--fps 30] [--voice en-US-GuyNeural] [--music file.mp3] [--still 3.5]
const fs = require('fs'), path = require('path'), { spawn, spawnSync } = require('child_process');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const flag = k => args.includes(k);
const scriptPath = args[0];
if (!scriptPath) { console.log('usage: node engine/render.js <script.txt> [out.mp4] [--preview] [--voice NAME] [--music FILE]'); process.exit(1); }
const out = args[1] && !args[1].startsWith('--') ? args[1] : 'out/' + path.basename(scriptPath).replace(/\.\w+$/, '') + '.mp4';
const FPS = +opt('--fps', flag('--preview') ? 15 : 30);
const VOICE = opt('--voice', 'en-US-AndrewNeural');
const tmp = fs.mkdtempSync('/tmp/v2d-');
fs.mkdirSync(path.dirname(out), { recursive: true });

const { parseScript } = require('./parse');
const { meta, scenes } = parseScript(fs.readFileSync(scriptPath, 'utf8'));

// ---------- voice-over (edge-tts if available) ----------
const probe = f => +spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).stdout.toString().trim() || 0;
const hasTTS = !flag('--novoice') && spawnSync('which', ['edge-tts']).status === 0;
scenes.forEach((sc, i) => {
  const words = sc.text ? sc.text.split(/\s+/).length : 0;
  let speech = words / 3.1;
  if (hasTTS && sc.text) {
    const f = `${tmp}/vo${i}.mp3`;
    const r = spawnSync('edge-tts', ['--voice', sc.voice || meta.voice || VOICE, '--rate', meta.rate || '+15%', '--text', sc.text.replace(/\*/g, ''), '--write-media', f], { timeout: 60000 });
    if (r.status === 0 && fs.existsSync(f) && probe(f) > 0) { sc.audio = f; speech = probe(f); }
    else if (i === 0) console.log('  (voice unavailable — rendering silent with captions)');
  }
  sc.speech = speech;
  sc.dur = sc.dur || Math.max(1.6, speech + .15);
});
const total = scenes.reduce((a, s) => a + s.dur, 0);
console.log(`${scenes.length} scenes, ${total.toFixed(1)}s @ ${FPS}fps, voice: ${scenes.some(s => s.audio) ? 'yes' : 'no'}`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, 'scene.html'));
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message));
  await page.evaluate(() => window.fontsReady);
  await page.evaluate(([s, f, m]) => setup(s, f, m), [scenes, FPS, meta]);

  if (opt('--still')) { // quick single-frame check
    for (const ts of opt('--still').split(',')) {
      const d = await page.evaluate(t => frame(t, .92), +ts);
      const f = out.replace(/\.mp4$/, `-${ts}.jpg`); fs.writeFileSync(f, Buffer.from(d.split(',')[1], 'base64')); console.log('still ->', f);
    }
    await browser.close(); return;
  }

  const silent = `${tmp}/video.mp4`;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', flag('--preview') ? 'ultrafast' : 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.ceil(total * FPS);
  for (let n = 0; n < N; n++) {
    const d = await page.evaluate(([t, q]) => frame(t, q), [n / FPS, .9]);
    if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (n % FPS === 0) process.stdout.write(`\r  frame ${n}/${N}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
  console.log('\n  encoding audio...');

  // ---------- audio mix: voice placed at scene starts + optional music ducked ----------
  const inputs = ['-i', silent], filters = []; let k = 1, t0 = 0; const labels = [];
  scenes.forEach(sc => { if (sc.audio) { inputs.push('-i', sc.audio); filters.push(`[${k}:a]adelay=${Math.round(t0 * 1000 + 150)}|${Math.round(t0 * 1000 + 150)}[a${k}]`); labels.push(`[a${k}]`); k++; } t0 += sc.dur; });
  const music = opt('--music', meta.music);
  if (music && fs.existsSync(music)) { inputs.push('-stream_loop', '-1', '-i', music); filters.push(`[${k}:a]volume=0.12,atrim=0:${total}[m]`); labels.push('[m]'); k++; }
  if (!labels.length) { fs.copyFileSync(silent, out); console.log('done ->', out); return; }
  filters.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0,afade=t=out:st=${Math.max(0, total - .8)}:d=.8[aout]`);
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filters.join(';'), '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(total), out], { stdio: 'inherit' });
  console.log('done ->', out);
})();
