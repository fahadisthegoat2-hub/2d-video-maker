// =====================================================================
//  DIRECTOR — shots (wide / medium / close), hard cuts, labels, captions
// =====================================================================
let SCENES = [], META = {}, TS = 0, LT = 0, CAM = { cx: W / 2, cy: H / 2, z: 1 };
const SCENE_DEF = {
  camp: { y: .87, s: .6 }, castle: { y: .96, s: .45 }, throne: { y: .86, s: .5 }, shop: { y: 1.02, s: 1.25, shots: ['close', 'medium', 'close'] },
  room: { y: .95, s: 1 }, outdoor: { y: .93, s: 1 }, hall: { y: .98, s: 1 },
};
const WORLD = { camp: bgCamp, castle: bgCastle, throne: bgThrone, shop: bgShop, earth: bgEarth, sun: bgSun, portraits: bgPortraits };
const CLASSIC = { room: bgRoom, outdoor: bgOutdoor, hall: bgHall, network: bgNetwork, space: bgSpace, stat: bgStat, timeline: bgTimeline };
if (typeof SW_WORLD !== 'undefined') { Object.assign(WORLD, SW_WORLD); Object.assign(SCENE_DEF, SW_DEF); }
const charScale = (c, sc) => (c.size || 1) * (sc.charScale || (SCENE_DEF[sc.type] || {}).s || 1);
const charY = (c, sc) => (c.y || sc.ground || (SCENE_DEF[sc.type] || {}).y || .9) * H;

// parallax camera: d=0 far (barely moves), d=1 foreground
function cam(d) {
  const z = 1 + (CAM.z - 1) * d, cx = lerp(W / 2, CAM.cx, d), cy = lerp(H / 2, CAM.cy, d);
  X.setTransform(1, 0, 0, 1, 0, 0); X.translate(W / 2, H / 2); X.scale(z, z); X.translate(-cx, -cy);
}
function clampCam(c) { const hw = W / 2 / c.z, hh = H / 2 / c.z; c.cx = clamp(c.cx, hw, W - hw); c.cy = clamp(c.cy, hh, H - hh); return c; }
function shotAt(sc, lt) {
  const push = 1 + (sc.push ?? .05) * ease(lt / sc.dur);
  const cast = (sc.cast || []).filter(c => !c.hidden);
  if (!cast.length || sc.type === 'portraits' || !SCENE_DEF[sc.type]) return { cx: W / 2, cy: H / 2, z: (sc.cam || 1) * (1 + (sc.push ?? .06) * ease(lt / sc.dur)), name: 'wide' };
  const list = sc.shots ? String(sc.shots).split(',').map(s => s.trim()) : sc.shot ? [sc.shot] : (SCENE_DEF[sc.type].shots || (sc.dur > 2.8 ? ['wide', 'close', 'medium', 'close', 'react'] : ['medium']));
  const n = Math.max(1, Math.round(sc.dur / (sc.cut || META.cut || 1.8))), seg = sc.dur / n, k = Math.min(n - 1, Math.floor(lt / seg)), sp = (lt - k * seg) / seg;
  const name = list[k % list.length], speaker = cast.find(c => c.name === sc.speaker) || cast[0];
  const others = cast.filter(c => c !== speaker), sub = 1 + .05 * ease(sp);
  if (name === 'close' || name === 'react') {
    const who = name === 'react' && others.length ? others[k % others.length] : speaker, h = headOf(who, sc);
    const z = clamp(190 / h.r, 1.3, 3.3) * sub, cy = Math.min(h.y + h.r * 1.0, h.y - h.r * 1.45 + H / 2 / z);
    return Object.assign(clampCam({ cx: h.x + (h.x < W / 2 ? 1 : -1) * W * .12 / z, cy, z }), { name, who });
  }
  if (name === 'medium') {
    const xs = cast.map(c => c.x * W), d = charDims(cast[0]), hgt = (d.legH + d.bodyH + d.R * 1.8) * charScale(cast[0], sc), gy = charY(cast[0], sc);
    const span = Math.max(...xs) - Math.min(...xs) + 320 * charScale(cast[0], sc);
    const z = Math.min(clamp(.8 * H / hgt, 1.15, 2.6), W * .92 / span) * sub;
    return Object.assign(clampCam({ cx: (Math.max(...xs) + Math.min(...xs)) / 2, cy: gy - hgt * .5, z }), { name });
  }
  const v = (sc.idx || 0) % 4; return Object.assign(clampCam({ cx: W / 2 + [0, -1, 1, 0][v] * W * .05, cy: H / 2 + [0, .02, .02, -.02][v] * H, z: (sc.cam || 1) * push * [1, 1.1, 1.12, 1.05][v] }), { name: 'wide' });
}
// world -> screen
const toScreen = (x, y) => ({ x: (x - CAM.cx) * CAM.z + W / 2, y: (y - CAM.cy) * CAM.z + H / 2 });

// ---------- labels ----------
function nameTag(text, hx, hy, hr, age) {
  if (age < 0) return; const k = back(Math.floor(age * 12) / 12 / .3);   // pops on 2s, like the rest
  const left = hx > W / 2, tx = left ? hx - hr * 1.25 : hx + hr * 1.25, ty = hy - hr * .45;
  X.save(); X.translate(tx, ty); X.scale(k, k);
  X.font = `700 112px ${FONT}`; X.textAlign = left ? 'right' : 'left'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.fillStyle = 'rgba(0,0,0,.35)'; X.fillText(text, 4, 6); X.fillStyle = '#fff'; X.fillText(text, 0, 0);
  const tw = X.measureText(text).width, ax = left ? -tw * .55 : tw * .55, bx = left ? -10 : 10;
  X.strokeStyle = '#fff'; X.lineWidth = 7; X.lineCap = 'round'; X.beginPath(); X.moveTo(ax, 70); X.quadraticCurveTo(ax, 150, bx + (left ? 40 : -40) * 0 + (left ? 30 : -30), 150); X.stroke();
  const ex = bx + (left ? 30 : -30), dir = left ? 1 : -1; X.beginPath(); X.moveTo(ex + dir * 6, 150); X.lineTo(ex - dir * 18, 132); X.moveTo(ex + dir * 6, 150); X.lineTo(ex - dir * 18, 168); X.stroke();
  X.restore(); X.textAlign = 'left';
}
function ribbon(text, age) {
  if (!text) return; const k = expo(age / .5); X.font = `600 74px ${FONT}`; const tw = X.measureText(text).width + 140, x = W / 2, y = 190;
  X.save(); X.translate(x, y + (1 - k) * -40); X.globalAlpha = k;
  const band = (w, h, col, dy) => { X.beginPath(); X.moveTo(-w / 2, -h / 2 + dy); X.lineTo(w / 2, -h / 2 + dy); X.lineTo(w / 2 + 40, dy); X.lineTo(w / 2, h / 2 + dy); X.lineTo(-w / 2, h / 2 + dy); X.lineTo(-w / 2 - 40, dy); X.closePath(); X.fillStyle = col; X.fill(); };
  band(tw, 104, 'rgba(0,0,0,.35)', 12); band(tw, 104, '#0e5674', 0); band(tw - 30, 78, '#136a8e', 0);
  X.fillStyle = '#9fd8ef'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(text, 0, 4); X.restore(); X.textAlign = 'left';
}
function bigNumber(sc, lt) {
  const v = parseFloat(String(sc.value).replace(/,/g, '')) || 0, k = expo(lt / 1.8), cur = v * k;
  const str = (sc.prefix || '') + (v >= 100 ? Math.round(cur).toLocaleString('en-US') : cur.toFixed(1)) + (sc.suffix || '');
  X.font = `700 ${str.length > 9 ? 190 : 240}px ${FONT}`; X.textAlign = 'center'; X.textBaseline = 'middle';
  X.fillStyle = 'rgba(0,0,0,.3)'; X.fillText(str, W / 2 + 6, H * .42 + 10); X.fillStyle = '#ffd35a'; X.fillText(str, W / 2, H * .42);
  if (sc.caption2 || sc.unit) { X.font = `600 70px ${FONT}`; X.fillStyle = `rgba(255,255,255,${expo((lt - .4) / .5)})`; X.fillText(sc.caption2 || sc.unit, W / 2, H * .42 + 170); }
  X.textAlign = 'left';
}

// ---------- captions (YouTube CC look) ----------
function captions(sc, lt) {
  if (META.captions === 'off' || sc.nocap || !sc.words || !sc.words.length) return;
  X.font = `500 50px Roboto, Arial, sans-serif`; X.textBaseline = 'middle';
  if (!sc.capLines) { sc.capLines = []; let cur = []; sc.words.forEach(w => { cur.push(w); if (X.measureText(cur.map(q => q.w).join(' ')).width > W * .5) { cur.pop(); sc.capLines.push(cur); cur = [w]; } }); if (cur.length) sc.capLines.push(cur); }
  let li = 0; sc.capLines.forEach((ln, i) => { if (lt >= ln[0].t) li = i; });
  const pair = sc.capLines.slice(li - (li % 2), li - (li % 2) + 2);
  pair.forEach((ln, i) => { const s = ln.map(q => q.w).join(' '), w = X.measureText(s).width, y = H - 128 + i * 66 - (pair.length - 1) * 33, x = W / 2 - w / 2; box(x - 14, y - 32, w + 28, 64, 'rgba(8,8,8,.78)', 3); X.fillStyle = '#fff'; X.fillText(s, x, y + 2); });
}

// ---------- post ----------
const BL = (() => { const c = document.createElement('canvas'); c.width = 480; c.height = 270; return c; })(), BX = BL.getContext('2d');
const FILTER_OK = (() => { try { const g = document.createElement('canvas').getContext('2d'); g.filter = 'blur(2px)'; return g.filter === 'blur(2px)'; } catch (e) { return false; } })();
function bloom(a) { if (a <= 0 || !FILTER_OK || window.LITE) return; BX.filter = 'blur(8px) brightness(.62) contrast(2.4)'; BX.clearRect(0, 0, 480, 270); BX.drawImage(C, 0, 0, 480, 270); X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalCompositeOperation = 'screen'; X.globalAlpha = a; X.drawImage(BL, 0, 0, W, H); X.restore(); }
const BLOOM = { camp: .25, castle: .35, throne: .2, shop: .15, earth: .35, sun: .4, portraits: .25, network: .45, space: .4 };

// ---------- compositor ----------
function renderAt(T) {
  let i = 0, start = 0; while (i < SCENES.length - 1 && T >= start + SCENES[i].dur) { start += SCENES[i].dur; i++; }
  const sc = SCENES[i], lt = T - start, prog = clamp(lt / sc.dur), toEnd = sc.dur - lt;
  TS = Math.floor(T * 12) / 12; LT = lt;                      // characters + fire etc. animate on 12fps
  CAM = shotAt(sc, lt);
  if (i > 0 && lt < .3) CAM.z *= 1 + .1 * (1 - lt / .3) ** 2;
  const act = sc.shake || sc.laser || sc.alarm || sc.burst || sc.type === 'overlord' || (sc.type === 'speedway' && (sc.speed ?? 1400) > 600);
  if (act) { const a = (sc.type === 'overlord' || sc.laser ? 9 : 5) / CAM.z; CAM.cx += Math.sin(T * 47) * a + Math.sin(T * 31) * a; CAM.cy += Math.cos(T * 43) * a; }
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
  if (WORLD[sc.type]) WORLD[sc.type](sc, T, prog); else { cam(1); (CLASSIC[sc.type] || bgCamp)(sc, T, prog); }
  if (sc.type !== 'portraits') {
    cam(1);
    const speaking = c => sc.speaker === c.name && lt > .15 && lt < (sc.speech || sc.dur) + .15;
    [...(sc.cast || [])].sort((a, b) => charY(a, sc) - charY(b, sc)).forEach(c => { c._s = charScale(c, sc); c._y = charY(c, sc); drawChar(c, TS, speaking(c), CAM.z > 2); });
    if (typeof SW_FG !== 'undefined' && SW_FG[sc.type]) { cam(1); SW_FG[sc.type](sc, T); }
    if (sc.type === 'camp' && sc.snow) snowfall(sc.seed + 1, T, 50, 1.4);
  }
  X.setTransform(1, 0, 0, 1, 0, 0);
  if (sc.dim) { X.fillStyle = `rgba(0,0,0,${sc.dim})`; X.fillRect(0, 0, W, H); }
  { const g = ['rgba(0,0,0,0)', 'rgba(255,140,60,.07)', 'rgba(60,120,255,.07)', 'rgba(200,60,255,.05)'][(sc.idx || 0) % 4]; X.fillStyle = g; X.fillRect(0, 0, W, H); }
  bloom(sc.bloom ?? BLOOM[sc.type] ?? (typeof SW_BLOOM !== 'undefined' ? SW_BLOOM[sc.type] : undefined) ?? .15);
  X.fillStyle = rad(W / 2, H / 2, H * .5, W * .75, ['rgba(0,0,0,0)', 'rgba(0,0,0,.3)']); X.fillRect(0, 0, W, H);
  // labels
  if ((CAM.name === 'close' || CAM.name === 'react') && CAM.who && CAM.who.tag) {
    const h = headOf(CAM.who, sc), p = toScreen(h.x, h.y); const segStart = lt - (lt % (sc.dur / Math.max(1, Math.round(sc.dur / (sc.cut || META.cut || 1.8)))));
    nameTag(String(CAM.who.tag), p.x, p.y, h.r * CAM.z, lt - segStart - .2);
  }
  if (sc.type === 'stat') bigNumber(sc, lt);
  if (sc.type === 'timeline') timeline(sc, lt, T);
  ribbon(sc.label, lt - .2);
  if (sc.chap) { const [n, nm, tot0] = String(sc.chap).split('|'), tot = +tot0 || 10, s = `CH ${n}/${tot} · ${nm.toUpperCase()}`; X.font = `700 34px ${FONT}`; const w = X.measureText(s).width + 44; box(36, 34, w, 58, 'rgba(10,12,24,.72)', 29); box(36, 34, 12 + (w - 12) * (+n / tot), 6, '#ffd23a', 3); X.fillStyle = '#fff'; X.textBaseline = 'middle'; X.fillText(s, 58, 66); X.textBaseline = 'alphabetic'; }
  if (sc.teaser) { const k = Math.min(1, lt / .2); X.save(); X.translate(W - 60, 70); X.rotate(.05); X.scale(k, k); X.font = `700 54px ${FONT}`; const tw = X.measureText('COMING UP').width; box(-tw - 50, -36, tw + 50, 76, '#ffd23a', 12); X.fillStyle = '#111'; X.textAlign = 'right'; X.textBaseline = 'middle'; X.fillText('COMING UP', -25, 4); X.restore(); X.textAlign = 'left'; X.textBaseline = 'alphabetic'; }
  captions(sc, lt);
  if (i > 0 && lt < .12) { X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = `rgba(255,255,255,${.55 * (1 - lt / .12)})`; X.fillRect(0, 0, W, H); }
  if (i === 0 && lt < .4) { X.fillStyle = `rgba(0,0,0,${1 - lt / .4})`; X.fillRect(0, 0, W, H); }
  if (i === SCENES.length - 1 && toEnd < .8) { X.fillStyle = `rgba(0,0,0,${1 - toEnd / .8})`; X.fillRect(0, 0, W, H); }
}
function prep(sc) {
  const toks = (sc.text || '').replace(/\*/g, '').split(/\s+/).filter(Boolean);
  const total = toks.reduce((a, w) => a + w.length + 2, 0) || 1, sp = sc.speech || sc.dur; let acc = 0;
  sc.words = toks.map(w => { const o = { w, t: .15 + acc / total * sp }; acc += w.length + 2; return o; });
}
window.setup = (scenes, fps, meta) => { SCENES = scenes; META = meta || {}; SCENES.forEach((s, k) => { s.idx = k; prep(s); }); };
window.frame = (T, q) => { renderAt(T); return C.toDataURL('image/jpeg', q || .92); };
