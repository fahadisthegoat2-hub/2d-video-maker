// Shared script parser — used by render.js (MP4) and build-player.js (on-device artifact).
// Blocks separated by '---'. "key: value" lines set options; other lines are narration.
function parseCast(s) {
  const res = []; const re = /(\w+)\s*(?:\(([^)]*)\))?/g; let m;
  while ((m = re.exec(s))) {
    const c = { name: m[1] };
    (m[2] || '').split(',').map(x => x.trim()).filter(Boolean).forEach(kv => {
      const [k, v] = kv.split('=').map(x => x.trim());
      c[k] = v === undefined ? true : isNaN(+v) ? v : +v;
    });
    res.push(c);
  }
  return res;
}
function parseScript(raw) {
  const meta = {}; let seed = 7;
  const scenes = raw.split(/^---\s*$/m).map(b => b.trim()).filter(Boolean).map(b => {
    const sc = { text: '' };
    b.split('\n').forEach(line => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m && m[1] !== 'text') { const k = m[1], v = m[2].trim(); sc[k] = k === 'cast' ? parseCast(v) : isNaN(+v) || v === '' ? v : +v; }
      else sc.text += ' ' + (m ? m[2] : line).trim();
    });
    sc.text = sc.text.trim(); sc.seed = seed += 101;
    return sc;
  }).filter(sc => { if (sc.video) { Object.assign(meta, sc); return false; } return true; });
  scenes.forEach(sc => { sc.type = sc.scene || 'room'; delete sc.scene; if (!sc.speaker && sc.cast && sc.cast.length) sc.speaker = sc.cast[sc.cast.length - 1].name; });
  return { meta, scenes };
}
// timing without recorded audio: ~3.1 words/sec narration
function estimateTiming(scenes, wps = 3.1) {
  scenes.forEach(sc => { const words = sc.text ? sc.text.split(/\s+/).length : 0; sc.dur = +sc.dur || 0; sc.speech = +sc.vodur || +sc.speech || words / wps; sc.dur = sc.dur || Math.max(1.6, sc.speech + .15); });
  return scenes;
}
if (typeof module !== 'undefined') module.exports = { parseScript, parseCast, estimateTiming };
