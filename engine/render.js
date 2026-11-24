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
const hasTTS = !flag('--novoice') && spawnSync('python3', ['-c', 'import edge_tts']).status === 0;
// per-scene delivery: tone: excited | serious | whisper | dramatic | hype
// ElevenLabs AI voice: set `tts: elevenlabs` + `eleven_voice: <voice id>` in the header, or pass --eleven <voice id>
// pre-made voice lines: --vo DIR (or `vo: DIR` in the header) with vo0.mp3, vo1.mp3 … one per scene
const VODIR = opt('--vo', meta.vo);
const ELEVEN = !flag('--novoice') && (opt('--eleven') || (meta.tts === 'elevenlabs' && (meta.eleven_voice || 'nPczCjzI2devNBz1zQrb')));
const TONE = { excited: ['+12%', '+6Hz', '+0%'], hype: ['+18%', '+10Hz', '+0%'], serious: ['-6%', '-6Hz', '+0%'], dramatic: ['-10%', '-8Hz', '+0%'], whisper: ['-8%', '-4Hz', '-35%'] };
const pct = (a, b) => (parseInt(a) + parseInt(b) >= 0 ? '+' : '') + (parseInt(a) + parseInt(b)) + '%';
scenes.forEach((sc, i) => {
  const words = sc.text ? sc.text.split(/\s+/).length : 0;
  let speech = words / 3.1;
  const pre = VODIR && path.join(VODIR, `vo${i}.mp3`);
  if (pre && sc.text && fs.existsSync(pre)) { const f = `${tmp}/vo${i}.mp3`; spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', pre, '-af', `silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=${meta.vspeed || 1.08}`, f]); sc.audio = f; speech = probe(f); }
  if (!sc.audio && ELEVEN && sc.text) {
    const f = `${tmp}/vo${i}.mp3`, raw = `${tmp}/vo${i}-raw.mp3`, vs = meta.stability ?? 0.5;
    const body = JSON.stringify({ text: (sc.say || sc.text).replace(/\*/g, ''), model_id: meta.model || 'eleven_v3', voice_settings: { stability: vs, similarity_boost: 0.8 } });
    const r = spawnSync('curl', ['-s', '-f', '-X', 'POST', `https://api.elevenlabs.io/v1/text-to-speech/${sc.voice || ELEVEN}?output_format=mp3_44100_128`, '-H', `xi-api-key: ${process.env.ELEVENLABS_API_KEY || 'proxy-injected'}`, '-H', 'Content-Type: application/json', '--data-binary', '@-', '-o', raw], { input: body, timeout: 120000 });
    if (r.status === 0 && probe(raw) > 0) { spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', `atempo=${meta.vspeed || 1.1},silenceremove=start_periods=1:start_threshold=-45dB`, f]); sc.audio = f; speech = probe(f); }
    else console.log(`  (ElevenLabs failed on scene ${i + 1}, falling back)`);
  }
  if (!sc.audio && hasTTS && sc.text) {
    const f = `${tmp}/vo${i}.mp3`;
    const [tr, tp, tv] = TONE[sc.tone] || ['+0%', '+0Hz', '+0%'];
    const r = spawnSync('python3', [path.join(__dirname, 'tts.py'), sc.voice || meta.voice || VOICE, pct(meta.rate || '+15%', tr), tp, tv, f, sc.text.replace(/\*/g, '')], { timeout: 60000 });
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

  // ---------- score + sfx (synthesized by audio.py), voice ducks the music ----------
  const genAudio = meta.music !== 'off' || meta.sfx !== 'off';
  if (genAudio && !opt('--music')) {
    const cues = [], levels = []; let t1 = 0;
    scenes.forEach((sc, i) => {
      const fx = String(sc.fx || ''), fight = fx.includes('shake') && sc.cast;
      levels.push([t1, t1 + sc.dur, sc.level ?? (sc.type === 'impact' || fight ? 2 : sc.tone === 'whisper' || sc.tone === 'dramatic' ? 0 : 1)]);
      if (i > 0) cues.push({ t: t1, type: 'whoosh', off: -.3, g: .5 });
      if (sc.type === 'impact') { const n = String(sc.word || '').split('|').filter(s => s.trim()).length || 1, gap = Math.min(.55, sc.dur * .7 / n); for (let k = 0; k < n; k++) cues.push({ t: t1 + k * gap, type: k ? 'thud' : 'boom', g: k ? .8 : 1 }); }
      if (sc.pop) String(sc.pop).split('|').forEach((p, k) => cues.push({ t: t1 + (sc.popAt ?? .25) + k * .35, type: 'thud', g: .7 }));
      if (sc.type === 'meteor') { const hit = sc.hit ?? Math.min(1.6, sc.dur * .35); cues.push({ t: t1, type: 'rumble', d: hit, g: .8 }, { t: t1 + hit, type: 'explosion' }); }
      if (sc.type === 'jungle') cues.push({ t: t1, type: sc.time === 'day' ? 'birds' : 'crickets', d: sc.dur });
      if (sc.type === 'wakanda' && !fight) cues.push({ t: t1, type: 'water', d: sc.dur, g: .4 });
      if (fight) { const n = Math.max(1, Math.round(sc.dur / (sc.cut || meta.cut || 1.8))); for (let k = 0; k < n; k++) cues.push({ t: t1 + k * sc.dur / n + .1, type: 'clash', g: .6 }); }
      if (String(sc.sfx || '').includes('riser')) cues.push({ t: t1 + sc.dur - 1.2, type: 'riser' });
      t1 += sc.dur;
    });
    fs.writeFileSync(`${tmp}/cues.json`, JSON.stringify({ total, bpm: meta.bpm || 96, levels, cues: meta.sfx === 'off' ? [] : cues }));
    const r = spawnSync('python3', [path.join(__dirname, 'audio.py'), `${tmp}/cues.json`, tmp], { stdio: 'inherit' });
    if (r.status !== 0) console.log('  (score/sfx unavailable — needs python3 + numpy)');
  }
  const inputs = ['-i', silent], filters = []; let k = 1, t0 = 0; const vo = [];
  scenes.forEach(sc => { if (sc.audio) { inputs.push('-i', sc.audio); filters.push(`[${k}:a]adelay=${Math.round(t0 * 1000 + 150)}|${Math.round(t0 * 1000 + 150)}[a${k}]`); vo.push(`[a${k}]`); k++; } t0 += sc.dur; });
  const music = opt('--music') || (meta.music && meta.music !== 'off' && meta.music !== 'auto' && fs.existsSync(meta.music) ? meta.music : fs.existsSync(`${tmp}/music.wav`) && meta.music !== 'off' ? `${tmp}/music.wav` : null);
  const sfxF = fs.existsSync(`${tmp}/sfx.wav`) && meta.sfx !== 'off' ? `${tmp}/sfx.wav` : null;
  const mixIn = [];
  if (vo.length) { filters.push(`${vo.join('')}amix=inputs=${vo.length}:normalize=0,volume=1.5,asplit=2[vo][vok]`); mixIn.push('[vo]'); }
  if (music) { inputs.push(...(opt('--music') ? ['-stream_loop', '-1'] : []), '-i', music); filters.push(`[${k}:a]volume=${opt('--music') ? .18 : .55},atrim=0:${total.toFixed(2)}[m0]`); k++;
    if (vo.length) { filters.push(`[m0][vok]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=400[m]`); } else filters.push('[m0]anull[m]'); mixIn.push('[m]'); }
  else if (vo.length) filters.push('[vok]anullsink');
  if (sfxF) { inputs.push('-i', sfxF); filters.push(`[${k}:a]volume=0.8[s]`); mixIn.push('[s]'); k++; }
  if (!mixIn.length) { fs.copyFileSync(silent, out); console.log('done ->', out); return; }
  filters.push(`${mixIn.join('')}amix=inputs=${mixIn.length}:normalize=0,alimiter=limit=0.95,afade=t=out:st=${Math.max(0, total - .8).toFixed(2)}:d=0.8[aout]`);
  const mx = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filters.join(';'), '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(total), out], { stdio: 'inherit' });
  if (mx.status !== 0) { fs.copyFileSync(silent, out); console.log('  (audio mix failed — wrote silent video)'); }
  console.log('done ->', out);
})();
