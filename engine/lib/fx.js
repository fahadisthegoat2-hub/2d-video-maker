// =====================================================================
//  FX — jungle, futuristic city, meteor/crystal, comic impact text,
//  and overlays (scene-cut flash, shake, speed lines, pop words).
// =====================================================================
function leaf(x, y, len, w, ang, col) { X.save(); X.translate(x, y); X.rotate(ang); X.beginPath(); X.moveTo(0, 0); X.quadraticCurveTo(len * .5, -w, len, 0); X.quadraticCurveTo(len * .5, w, 0, 0); X.fillStyle = col; X.fill(); X.beginPath(); X.moveTo(0, 0); X.lineTo(len * .9, 0); X.strokeStyle = 'rgba(0,0,0,.25)'; X.lineWidth = 3; X.stroke(); X.restore(); }
function frond(x, y, s, ang, col) {
  X.save(); X.translate(x, y); X.rotate(ang); X.scale(s, s);
  X.beginPath(); X.moveTo(0, 0); X.quadraticCurveTo(130, -70, 280, -20); X.strokeStyle = hex(col, -.3); X.lineWidth = 9; X.stroke();
  for (let i = 1; i < 10; i++) { const u = i / 10, px = 280 * u, py = -70 * Math.sin(u * Math.PI) * .9 - 20 * u, l = 130 * (1 - u * .55); leaf(px, py, l, 24, -1.25 + u * .35, col); leaf(px, py, l, 24, 1.15 - u * .25, hex(col, -.14)); }
  X.restore();
}
function bush(x, y, s, col, seed) { const R = rng(seed); for (let i = 0; i < 9; i++) leaf(x, y, (150 + R() * 90) * s, 46 * s, -Math.PI * (.12 + .76 * i / 8) + (R() - .5) * .2, i % 2 ? col : hex(col, -.15)); }
function eyesAt(x, y, s, t, i, col = '#ffd84a') {
  const blink = hash(Math.floor(t * 1.6) * 7 + i) < .18; if (blink) return;
  X.save(); glow(col, 24); for (const sx of [-1, 1]) { X.save(); X.translate(x + sx * 26 * s, y); X.beginPath(); X.moveTo(-16 * s, 0); X.quadraticCurveTo(0, -12 * s, 16 * s, 2 * s); X.quadraticCurveTo(0, 8 * s, -16 * s, 0); X.fillStyle = col; X.fill(); box(-2.5 * s, -7 * s, 5 * s, 13 * s, '#111'); X.restore(); } noGlow(); X.restore();
}
function fireflies(seed, t, n, col = '255,240,140') { const R = rng(seed); X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = (R() * W + Math.sin(t * .7 + i) * 60) % W, y = H * (.35 + R() * .55) + Math.cos(t * .9 + i * 2) * 30, a = .3 + .7 * Math.sin(t * 3 + i) ** 2; X.fillStyle = rad(x, y, 0, 18, [`rgba(${col},${a})`, `rgba(${col},0)`]); X.fillRect(x - 18, y - 18, 36, 36); } X.restore(); }

// ---------- night jungle ----------
function bgJungle(sc, t) {
  const day = sc.time === 'day', sw = Math.sin(TS * 2.4) * .04;
  cam(0); skyFill(day ? '#3a8f8a' : '#0a0820', day ? '#c9e6a8' : '#30185a'); if (!day) stars(sc.seed, 160, t, H * .45);
  const mx = W * .7, my = H * .24; X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(mx, my, 60, 420, [day ? 'rgba(255,250,210,.5)' : 'rgba(190,160,255,.45)', 'rgba(0,0,0,0)']); X.fillRect(mx - 420, my - 420, 840, 840); X.restore();
  ell(mx, my, 110, 110, day ? '#fff6cf' : '#efe6ff'); if (!day) { ell(mx - 30, my - 20, 22, 22, '#d8cdf5'); ell(mx + 35, my + 30, 14, 14, '#d8cdf5'); }
  cam(.1); hills(sc.seed, H, H * .5, 50, day ? '#2f6a5a' : '#1c1540', 70);
  cam(.22); for (let i = 0; i < 9; i++) { const x = hash(sc.seed + i) * W, w = 26 + hash(i * 3) * 30; box(x, H * .2, w, H, day ? '#2a4a3a' : '#171a30'); } hills(sc.seed + 2, H, H * .6, 40, day ? '#245a42' : '#15213a', 90);
  X.fillStyle = lin(0, H * .5, 0, H * .8, ['rgba(160,120,255,0)', day ? 'rgba(230,255,230,.35)' : 'rgba(150,110,255,.22)', 'rgba(160,120,255,0)']); X.fillRect(-W, H * .5, W * 3, H * .3);
  cam(.45); const mid = day ? '#1f5a3e' : '#18323a'; [[.05, .72], [.25, .7], [.45, .74], [.68, .7], [.9, .73]].forEach(([x, y], i) => bush(W * x, H * y, 1.1, mid, sc.seed + i));
  if (!day) [[.14, .6], [.36, .63], [.58, .58], [.8, .62]].forEach(([x, y], i) => eyesAt(W * x, H * y, .8, t, i + sc.seed));
  cam(1); hills(sc.seed + 5, H * 1.2, H * .86, 18, day ? '#2e3a22' : '#121a22', 120);
  for (let i = 0; i < 14; i++) { const x = hash(i * 5.7 + sc.seed) * W; leaf(x, H * .9, 60 + hash(i) * 50, 14, -Math.PI / 2 + (hash(i * 2) - .5) * 1.2 + sw, day ? '#3a6a2a' : '#1c3a30'); }
  if (!day) fireflies(sc.seed, t, 26);
  const fg = day ? '#0f2a1c' : '#070d12';
  frond(-60, H * .15, 1.4, .5 + sw, fg); frond(-80, H * .55, 1.6, -.25 - sw, fg); frond(W + 60, H * .1, 1.4, Math.PI - .5 - sw, fg); frond(W + 80, H * .6, 1.5, Math.PI + .3 + sw, fg);
  for (const vx of [W * .2, W * .78]) { X.beginPath(); X.moveTo(vx, -20); X.quadraticCurveTo(vx + 40 + sw * 300, H * .2, vx + 10, H * .38); X.strokeStyle = fg; X.lineWidth = 8; X.stroke(); for (let k = 1; k < 6; k++) leaf(vx + 20 + sw * 200 * k / 6, H * .07 * k, 40, 12, k % 2 ? .6 : 2.5, fg); }
}

// ---------- futuristic city hidden in the jungle ----------
function bgWakanda(sc, t) {
  const night = sc.time === 'night';
  cam(0); X.fillStyle = lin(0, 0, 0, H, night ? ['#060818', '#1a1448', '#3a2470'] : ['#2b1055', '#8a2f6a', '#f59a4e']); X.fillRect(-W, -H, W * 3, H * 3); stars(sc.seed, night ? 200 : 60, t, H * .4);
  const sx = W * .5, sy = H * .56; X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(sx, sy, 80, 600, [night ? 'rgba(150,110,255,.35)' : 'rgba(255,200,120,.6)', 'rgba(0,0,0,0)']); X.fillRect(sx - 600, sy - 600, 1200, 1200); X.restore();
  if (!night) ell(sx, sy, 170, 170, '#ffd98a');
  cam(.06); range(sc.seed, H * .8, H * .32, 90, night ? '#241a50' : '#5c2c6c', null, 260);
  cam(.14); range(sc.seed + 3, H * .8, H * .45, 70, night ? '#1c1540' : '#3f1f58', null, 200);
  // waterfall between cliffs
  const wx = W * .16; box(wx - 130, H * .28, 80, H * .6, night ? '#18122e' : '#2e1a44'); box(wx + 50, H * .3, 90, H * .6, night ? '#18122e' : '#2e1a44');
  X.save(); X.beginPath(); X.rect(wx - 50, H * .3, 100, H * .5); X.clip(); box(wx - 50, H * .3, 100, H * .5, '#7fd6ff'); const k = Math.floor(TS * 12); for (let i = 0; i < 14; i++) { const lx = wx - 46 + (i * 37 % 92), ly = H * .3 + ((k * 22 + i * 61) % (H * .5)); box(lx, ly, 6, 60 + (i % 3) * 30, 'rgba(255,255,255,.7)', 3); } X.restore();
  for (let i = 0; i < 6; i++) ell(wx - 60 + i * 24, H * .8 + Math.sin(t * 3 + i) * 6, 40, 22, 'rgba(230,245,255,.75)');
  // towers
  cam(.24); const R = rng(sc.seed + 11), base = H * .78, list = [];
  for (let i = 0; i < 16; i++) list.push([W * (.26 + .72 * i / 15) + (R() - .5) * 60, 50 + R() * 80, 220 + R() * 430, R()]);
  list.sort((a, b) => a[1] - b[1]).forEach(([x, w, h, r], i) => {
    const col = night ? '#251e48' : '#3a2a5e', top = base - h;
    box(x - w / 2, top, w, h, col, w * .45); box(x, top, w / 2, h, 'rgba(0,0,0,.18)', [0, w * .45, 0, 0]);
    for (let j = 0; j < h / 46 - 1; j++) box(x - w * .3, top + 40 + j * 46, w * .6, 9, hash(i * 9 + j + Math.floor(t * .5) * (r > .7)) > .3 ? (night ? '#c9a8ff' : '#ffd9a8') : 'rgba(0,0,0,.2)', 4);
    if (r > .45) { ell(x, top + h * .25, w * .95, 14, hex(col, .15)); ell(x, top + h * .25 - 6, w * .8, 10, '#2f8a5a'); }
    if (r > .6) { line(x, top, x, top - 70 - r * 60, hex(col, .2), 6); ell(x, top - 70 - r * 60, 8, 8, '#e8b923'); }
    ell(x - w * .1, top + 14, w * .35, 12, '#2f8a5a');
  });
  // maglev + flying craft
  const ty = H * .62; X.beginPath(); X.moveTo(-50, ty + 30); X.quadraticCurveTo(W * .5, ty - 50, W + 50, ty + 30); X.strokeStyle = night ? '#4a3a80' : '#6a4a8a'; X.lineWidth = 12; X.stroke();
  const tp = ((t * .18) % 1.3) - .15; for (let c2 = 0; c2 < 4; c2++) { const u = tp - c2 * .035, px = -50 + (W + 100) * u, py = ty + 30 - 4 * 80 * u * (1 - u) - 14; box(px - 34, py - 16, 64, 26, '#e8e2ff', 12); box(px - 26, py - 10, 48, 8, '#7b5cff', 3); }
  for (let i = 0; i < 3; i++) { const u = ((t * (.07 + i * .02) + i * .37) % 1.2) - .1, px = W * u, py = H * (.18 + i * .09) + Math.sin(t * 2 + i) * 10; X.save(); X.translate(px, py); X.fillStyle = lin(-140, 0, 0, 0, ['rgba(180,140,255,0)', 'rgba(180,140,255,.6)']); X.fillRect(-140, -4, 140, 8); X.beginPath(); X.moveTo(40, 0); X.lineTo(-30, -18); X.lineTo(-20, 0); X.lineTo(-30, 18); X.closePath(); X.fillStyle = '#e6e0ff'; X.fill(); ell(10, -4, 12, 6, '#7b5cff'); X.restore(); }
  cam(.5); hills(sc.seed + 7, H * 1.1, H * .76, 26, night ? '#10301f' : '#1d4a32', 80);
  for (let i = 0; i < 7; i++) bush(W * (i / 6), H * .8, .7, night ? '#123a28' : '#245a3a', sc.seed + i * 3);
  // plaza the cast stands on
  cam(1); X.fillStyle = night ? '#1e1838' : '#3a2f55'; X.fillRect(-W, H * .84, W * 3, H); box(-W, H * .84, W * 3, 10, '#7b5cff');
  for (let i = -6; i <= 6; i++) { X.beginPath(); X.moveTo(W / 2 + i * 60, H * .85); X.lineTo(W / 2 + i * 260, H); X.strokeStyle = 'rgba(180,140,255,.25)'; X.lineWidth = 3; X.stroke(); }
  for (const px of [W * .06, W * .94]) { box(px - 12, H * .5, 24, H * .34, '#2a2448'); box(px - 26, H * .5, 52, 16, '#e8b923', 4); warmGlow(px, H * .5, 140, .5, '180,140,255'); }
}

// ---------- meteor strike -> glowing crystal ----------
function crystal(x, y, h, w, ang, col) { X.save(); X.translate(x, y); X.rotate(ang); X.beginPath(); X.moveTo(-w / 2, 0); X.lineTo(-w / 2, -h * .75); X.lineTo(0, -h); X.lineTo(w / 2, -h * .75); X.lineTo(w / 2, 0); X.closePath(); X.fillStyle = col; X.fill(); X.beginPath(); X.moveTo(0, 0); X.lineTo(0, -h); X.lineTo(w / 2, -h * .75); X.lineTo(w / 2, 0); X.closePath(); X.fillStyle = 'rgba(0,0,0,.22)'; X.fill(); X.beginPath(); X.moveTo(-w * .3, -h * .2); X.lineTo(-w * .3, -h * .7); X.strokeStyle = 'rgba(255,255,255,.55)'; X.lineWidth = 5; X.stroke(); X.restore(); }
function bgMeteor(sc, t, prog) {
  const lt = LT, hit = sc.hit ?? Math.min(1.6, sc.dur * .35), gx = W * .5, gy = H * .74, after = lt - hit;
  cam(0); skyFill('#05030f', '#2a1250'); stars(sc.seed, 260, t, H * .75);
  cam(.15); range(sc.seed, H, H * .5, 80, '#1a1238', null, 260);
  cam(.4); hills(sc.seed + 1, H, H * .66, 30, '#122a24', 100); for (let i = 0; i < 8; i++) bush(W * (i / 7), H * .7, .6, '#0f2a22', i + sc.seed);
  cam(1); hills(sc.seed + 2, H * 1.2, gy + 10, 12, '#0c1a16', 160);
  if (after < 0) {
    const u = clamp(lt / hit), sx = lerp(W * 1.15, gx, u), sy = lerp(-H * .2, gy - 30, u), ang = Math.atan2(gy + H * .2, gx - W * 1.15);
    X.save(); X.translate(sx, sy); X.rotate(ang); X.globalCompositeOperation = 'lighter';
    X.fillStyle = lin(-700, 0, 0, 0, ['rgba(255,120,40,0)', 'rgba(255,150,60,.5)', 'rgba(255,230,180,.95)']); X.beginPath(); X.moveTo(0, -46); X.lineTo(-700, 0); X.lineTo(0, 46); X.fill();
    X.fillStyle = lin(-380, 0, 0, 0, ['rgba(170,120,255,0)', 'rgba(200,160,255,.8)']); X.beginPath(); X.moveTo(0, -24); X.lineTo(-380, 0); X.lineTo(0, 24); X.fill(); X.restore();
    ell(sx, sy, 48, 44, '#3a2a4a'); ell(sx - 10, sy - 10, 18, 14, '#9b7cff'); warmGlow(sx, sy, 260, .7, '255,190,120');
    for (let i = 0; i < 12; i++) { const k = hash(i + Math.floor(TS * 12)); ell(sx - Math.cos(ang) * (60 + k * 240) + (hash(i * 3) - .5) * 60, sy - Math.sin(ang) * (60 + k * 240) + (hash(i * 7) - .5) * 60, 5, 5, '#ffd08a'); }
    return;
  }
  // shockwave + crystals
  X.save(); X.globalCompositeOperation = 'lighter'; for (let r = 0; r < 3; r++) { const a = after - r * .15; if (a < 0 || a > 1.2) continue; X.beginPath(); X.ellipse(gx, gy, a * 1400, a * 260, 0, 0, 7); X.strokeStyle = `rgba(200,160,255,${(1 - a / 1.2) * .8})`; X.lineWidth = 26 * (1 - a / 1.2) + 2; X.stroke(); } X.restore();
  const g = back(after / .5);
  X.save(); X.translate(gx, gy); X.scale(g, g);
  ell(0, 0, 280, 50, '#1a1028'); ell(0, -6, 240, 36, '#2a1a40');
  const pulse = .6 + .4 * Math.sin(t * 4); warmGlow(0, -120, 420, .55 * pulse, '170,120,255');
  [[-150, 130, 50, -.35], [-80, 220, 70, -.15], [0, 300, 90, 0], [85, 230, 66, .18], [160, 140, 48, .4], [-30, 160, 46, -.05], [45, 170, 44, .1]].forEach(([x, h, w, a], i) => crystal(x, 0, h, w, a, i % 2 ? '#8f6bff' : '#b39cff'));
  X.restore();
  X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const R2 = hash(i * 4.1), life = (t * (.3 + R2 * .4) + R2) % 1, x = gx + (hash(i * 9.7) - .5) * 520, y = gy - 40 - life * 520; X.fillStyle = `rgba(190,160,255,${(1 - life) * .9})`; X.save(); X.translate(x, y); X.rotate(Math.PI / 4); X.fillRect(-5, -5, 10, 10); X.restore(); } X.restore();
  for (let r = 0; r < 3; r++) { const a = ((t * .6 + r / 3) % 1); X.beginPath(); X.ellipse(gx, gy - 140, 200 + a * 300, 60 + a * 90, 0, 0, 7); X.strokeStyle = `rgba(180,140,255,${(1 - a) * .5})`; X.lineWidth = 5; X.stroke(); }
  if (after < .12) { cam(0); X.fillStyle = `rgba(255,255,255,${1 - after / .12})`; X.fillRect(0, 0, W, H); }
}

// ---------- comic-style kinetic text ----------
function slamText(str, x, y, size, age, col, tilt = -.05) {
  if (age < 0) return; const k = expo(age / .16), s = lerp(2.6, 1, k) * (1 + .06 * Math.max(0, 1 - age / .4) * Math.sin(age * 40));
  X.save(); X.translate(x, y); X.rotate(tilt); X.scale(s, s); X.globalAlpha = clamp(age / .06);
  X.font = `700 ${size}px ${FONT}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.letterSpacing = `${Math.round(size * .05)}px`;
  X.fillStyle = '#000'; X.fillText(str, 14, 16); X.strokeStyle = '#0a0612'; X.lineWidth = size * .1; X.strokeText(str, 0, 0);
  X.fillStyle = col; X.fillText(str, 0, 0); X.save(); X.beginPath(); X.rect(-W, -size, W * 2, size * .48); X.clip(); X.fillStyle = 'rgba(255,255,255,.88)'; X.fillText(str, 0, 0); X.restore();
  X.letterSpacing = '0px'; X.restore();
}
function burst(cx, cy, t, c1, c2, n = 20) { X.save(); X.translate(cx, cy); X.rotate(t * .25); for (let i = 0; i < n; i++) { X.beginPath(); X.moveTo(0, 0); X.arc(0, 0, W * 1.3, i * 2 * Math.PI / n, (i + .5) * 2 * Math.PI / n); X.closePath(); X.fillStyle = i % 2 ? c1 : c2; X.fill(); } X.restore(); }
function halftone(col, cx, cy) { X.fillStyle = col; for (let y = 0; y < H; y += 34) for (let x = (y / 34 % 2) * 17; x < W; x += 34) { const d = Math.hypot(x - cx, y - cy) / W, r = clamp(d * 14 - 2, 0, 11); if (r > .5) { X.beginPath(); X.arc(x, y, r, 0, 7); X.fill(); } } }
function speedLines(t, n = 46, col = 'rgba(255,255,255,.85)', inner = .42) { const k = Math.floor(t * 12), cx = W / 2, cy = H / 2; X.save(); X.fillStyle = col; for (let i = 0; i < n; i++) { const a = hash(i * 13.1 + k) * 7, r0 = W * (inner + hash(i * 3.3 + k) * .25), w = .006 + hash(i * 5.5 + k) * .012; X.beginPath(); X.moveTo(cx + Math.cos(a - w) * W * 1.2, cy + Math.sin(a - w) * W * 1.2); X.lineTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); X.lineTo(cx + Math.cos(a + w) * W * 1.2, cy + Math.sin(a + w) * W * 1.2); X.fill(); } X.restore(); }
function bgImpact(sc, t) {
  const lt = LT, col = sc.color || '#b48cff', words = String(sc.word || '').split('|').map(s => s.trim()).filter(Boolean), n = words.length || 1;
  const gap = Math.min(.55, (sc.dur * .7) / n), cur = Math.min(n - 1, Math.floor(lt / gap));
  cam(0); X.fillStyle = sc.bg || '#120a24'; X.fillRect(0, 0, W, H);
  burst(W / 2, H / 2, t, hex(sc.bg || '#120a24', .06), hex(col, -.55), 22);
  X.fillStyle = rad(W / 2, H / 2, 0, H * .7, [hex(col, -.2), 'rgba(0,0,0,0)']); X.globalAlpha = .55; X.fillRect(0, 0, W, H); X.globalAlpha = 1;
  halftone('rgba(0,0,0,.35)', W / 2, H / 2); speedLines(t, 40, 'rgba(255,255,255,.18)', .38);
  const sh = Math.max(0, 1 - (lt - cur * gap) / .3) * 22; X.save(); X.translate((hash(Math.floor(t * 30)) - .5) * sh, (hash(Math.floor(t * 30) + 7) - .5) * sh);
  const lines = words.slice(0, cur + 1), stack = sc.stack !== 0 && n <= 4;
  (stack ? lines : [words[cur]]).forEach((w, j) => {
    const i = stack ? j : cur, size = Math.min(300, 2000 / Math.max(4, w.length)) * (stack && n > 2 ? .72 : 1), rows = stack ? n : 1;
    const y = H * .46 + (stack ? (j - (rows - 1) / 2) * size * 1.02 : 0);
    slamText(w, W / 2, y, size, lt - i * gap, i % 2 ? '#ffffff' : col, i % 2 ? .04 : -.05);
  });
  X.restore();
  if (sc.sub) { const a = expo((lt - .35) / .4); X.save(); X.globalAlpha = a; X.font = `600 64px ${FONT}`; X.textAlign = 'center'; const tw = X.measureText(sc.sub).width + 80; box(W / 2 - tw / 2, H * .8 - 50 + (1 - a) * 40, tw, 96, '#0a0612', 14); X.fillStyle = col; X.fillText(sc.sub, W / 2, H * .8 + 20 + (1 - a) * 40); X.restore(); }
  const fa = lt - cur * gap; if (fa < .08) { X.fillStyle = `rgba(255,255,255,${(1 - fa / .08) * .7})`; X.fillRect(0, 0, W, H); }
}

// ---------- overlays used by every scene ----------
function fxBefore(sc, lt, T, idx) {
  // camera punch at every scene cut + optional shake
  if (idx > 0) CAM.z *= 1 + .07 * (1 - expo(lt / .3));
  const fx = String(sc.fx || '');
  if (fx.includes('shake')) { const a = 14 / CAM.z; CAM.cx += (hash(Math.floor(T * 24)) - .5) * a * 2; CAM.cy += (hash(Math.floor(T * 24) + 3) - .5) * a * 2; }
}
function fxAfter(sc, lt, T, idx) {
  X.setTransform(1, 0, 0, 1, 0, 0);
  const fx = String(sc.fx || '');
  if (fx.includes('lines')) speedLines(T, 50, 'rgba(255,255,255,.55)', .5);
  if (fx.includes('purple')) { X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(W / 2, H * .6, 0, H, ['rgba(140,90,255,.25)', 'rgba(0,0,0,0)']); X.fillRect(0, 0, W, H); X.restore(); }
  if (sc.pop) { const parts = String(sc.pop).split('|'); parts.forEach((p, i) => slamText(p.trim(), W / 2 + (i - (parts.length - 1) / 2) * 0, H * .66 + i * 150, Math.min(150, 1300 / Math.max(5, p.length)), lt - (sc.popAt ?? .25) - i * .35, sc.popColor || '#ffd35a', -.04)); }
  if (idx > 0 && lt < .07 && sc.type !== 'impact') { X.fillStyle = `rgba(255,255,255,${(1 - lt / .07) * .55})`; X.fillRect(0, 0, W, H); }
}
