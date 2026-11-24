// =====================================================================
//  WORLD — illustrated, paper-cut environments with parallax layers.
//  cam(d): d=0 sky (static) … d=1 foreground. TS = stepped (choppy) time.
// =====================================================================
const FLAG_COLS = ['#c0392b', '#e8b923', '#2e6fb5', '#3c8d5a', '#e67e22'];
function E(cx, cy, rx, ry) { X.moveTo(cx + rx, cy); X.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); }
function paper(path, col, d = 8, dcol) { X.save(); X.translate(0, d); path(); X.fillStyle = dcol || hex(col, -.25); X.fill(); X.restore(); path(); X.fillStyle = col; X.fill(); }
function cloudP(x, y, s, col) {
  paper(() => { X.beginPath(); X.rect(x - 175 * s, y - 34 * s, 350 * s, 34 * s); E(x - 100 * s, y - 42 * s, 85 * s, 42 * s); E(x + 5 * s, y - 72 * s, 108 * s, 72 * s); E(x + 108 * s, y - 40 * s, 76 * s, 40 * s); }, col, 16 * s, hex(col, -.16));
}
function skyFill(top, bot) { X.fillStyle = lin(0, 0, 0, H, [top, bot]); X.fillRect(-W, -H, W * 3, H * 3); }
function stars(seed, n, t, yMax = H * .7) { const R = rng(seed); for (let i = 0; i < n; i++) { const x = R() * W, y = R() * yMax, s = 1.5 + R() * 2.5, tw = .55 + .45 * Math.sin(t * (1 + R() * 2) + i); X.fillStyle = `rgba(255,255,255,${tw})`; X.fillRect(x, y, s, s); if (i % 23 === 0) { X.fillRect(x - 5, y + 1, 12, 1); X.fillRect(x + 1, y - 5, 1, 12); } } }
function range(seed, yb, ytop, yvar, col, snow, step = 300) {
  const R = rng(seed), pts = []; let x = -260, up = R() < .5;
  while (x < W + 460) { pts.push([x, up ? ytop + R() * yvar : ytop + yvar + 90 + R() * 110]); x += step * .55 + R() * step * .6; up = !up; }
  const path = () => { X.beginPath(); X.moveTo(pts[0][0], yb); pts.forEach(p => X.lineTo(p[0], p[1])); X.lineTo(pts[pts.length - 1][0], yb); X.closePath(); };
  path(); X.fillStyle = col; X.fill();
  for (let i = 0; i < pts.length - 1; i++) if (pts[i][1] < pts[i + 1][1]) { X.beginPath(); X.moveTo(pts[i][0], pts[i][1]); X.lineTo(pts[i + 1][0], pts[i + 1][1]); X.lineTo(pts[i + 1][0], yb); X.lineTo(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * .25, yb); X.closePath(); X.fillStyle = 'rgba(0,0,10,.10)'; X.fill(); }
  if (snow) { X.save(); path(); X.clip(); X.beginPath(); pts.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.strokeStyle = snow; X.lineWidth = 40; X.lineJoin = 'miter'; X.stroke(); X.restore(); }
  return pts;
}
function hills(seed, yb, ytop, amp, col, step = 140) {
  const R = rng(seed), pts = []; for (let x = -300; x < W + 400; x += step * (.6 + R() * .8)) pts.push([x, ytop + Math.sin(x * .0035 + seed) * amp + R() * amp * .5]);
  X.beginPath(); X.moveTo(-300, yb); pts.forEach(p => X.lineTo(p[0], p[1])); X.lineTo(W + 400, yb); X.closePath(); X.fillStyle = col; X.fill();
  for (let i = 0; i < pts.length - 1; i += 2) { X.beginPath(); X.moveTo(pts[i][0], pts[i][1]); X.lineTo(pts[i + 1][0], pts[i + 1][1]); X.lineTo(pts[i + 1][0] - 40, yb); X.closePath(); X.fillStyle = i % 4 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'; X.fill(); }
}
function pine(x, y, h, col, snow) {
  box(x - h * .035, y - h * .16, h * .07, h * .17, '#4a3426');
  for (let i = 0; i < 3; i++) {
    const by = y - h * .12 - i * h * .25, hw = h * (.3 - i * .07), th = h * .44, mid = by - h * .03;
    X.beginPath(); X.moveTo(x, by - th); X.lineTo(x - hw, by); X.lineTo(x, mid); X.closePath(); X.fillStyle = col; X.fill();
    X.beginPath(); X.moveTo(x, by - th); X.lineTo(x, mid); X.lineTo(x + hw, by); X.closePath(); X.fillStyle = hex(col, -.22); X.fill();
    if (snow) { X.strokeStyle = snow; X.lineWidth = h * .035; X.lineJoin = 'round'; X.beginPath(); X.moveTo(x - hw, by); X.lineTo(x, mid); X.lineTo(x + hw * .6, by - h * .012); X.stroke(); X.beginPath(); X.moveTo(x, by - th); X.lineTo(x - hw * .22, by - th * .72); X.lineTo(x + hw * .18, by - th * .76); X.fillStyle = snow; X.fill(); }
  }
}
function forest(seed, y0, y1, n, h0, h1, col, snow, haze) {
  const R = rng(seed), trees = []; for (let i = 0; i < n; i++) trees.push([R() * (W + 200) - 100, y0 + R() * (y1 - y0), R()]);
  trees.sort((a, b) => a[1] - b[1]).forEach(([x, y, r]) => pine(x, y, lerp(h0, h1, (y - y0) / (y1 - y0 || 1)) * (.8 + r * .4), col, snow));
  if (haze) { X.fillStyle = haze; X.fillRect(-W, y0 - h1, W * 3, y1 - y0 + h1 + 40); }
}
function tufts(seed, y0, y1, n, col, flowers) {
  const R = rng(seed); X.strokeStyle = col; X.lineWidth = 3; X.lineCap = 'round';
  for (let i = 0; i < n; i++) { const x = R() * W, y = y0 + R() * (y1 - y0), s = .6 + (y - y0) / (y1 - y0 + 1); X.beginPath(); X.moveTo(x - 7 * s, y - 10 * s); X.lineTo(x - 3 * s, y); X.lineTo(x, y - 13 * s); X.lineTo(x + 3 * s, y); X.lineTo(x + 7 * s, y - 10 * s); X.stroke(); if (flowers && i % 4 === 0) ell(x + 14, y - 4, 3, 3, ['#f5f0e0', '#f2a6b8', '#f7d65a'][i % 3]); }
}
function smoke(x, y, t, s = 1, col = 'rgba(225,225,230,') {
  for (let i = 0; i < 9; i++) { const q = ((t * .28 + i / 9) % 1), r = (16 + q * 58) * s; ell(x + Math.sin(q * 5 + i) * 26 * s + q * 40 * s, y - q * 380 * s, r, r * .9, col + (.55 * (1 - q)) + ')'); }
}
function warmGlow(x, y, r, a = .5, col = '255,170,80') { X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(x, y, 0, r, [`rgba(${col},${a})`, `rgba(${col},${a * .3})`, `rgba(${col},0)`]); X.fillRect(x - r, y - r, r * 2, r * 2); X.restore(); }
function snowfall(seed, t, n, size = 1) { const R = rng(seed); X.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < n; i++) { const sp = 30 + R() * 60, x = (R() * W + Math.sin(t * .8 + i) * 30) % W, y = (R() * H + t * sp) % H, s = (1.5 + R() * 3) * size; X.beginPath(); X.arc(x, y, s, 0, 7); X.fill(); } }

// ---------------- props ----------------
function tent(x, y, s, col, night, snow) {
  X.save(); X.translate(x, y); X.scale(s, s);
  line(-280, 8, 0, -250, 'rgba(60,45,30,.6)', 2.5); line(0, -250, 390, 10, 'rgba(60,45,30,.6)', 2.5); box(-284, 4, 8, 12, '#5a4030', 2); box(386, 6, 8, 12, '#5a4030', 2);
  X.beginPath(); X.moveTo(0, -250); X.lineTo(150, -236); X.lineTo(330, -8); X.lineTo(170, 0); X.closePath(); X.fillStyle = hex(col, -.2); X.fill();
  X.beginPath(); X.moveTo(0, -250); X.lineTo(-175, 0); X.lineTo(170, 0); X.closePath(); X.fillStyle = col; X.fill();
  X.save(); X.clip(); for (let i = -6; i < 7; i++) line(i * 30, 0, 0, -250, 'rgba(0,0,0,.05)', 3); X.restore();
  X.beginPath(); X.moveTo(0, -205); X.lineTo(-58, 0); X.lineTo(58, 0); X.closePath(); X.fillStyle = night ? lin(0, -200, 0, 0, ['#ffcf7a', '#c86a2a']) : '#2c1f16'; X.fill();
  X.beginPath(); X.moveTo(0, -205); X.lineTo(-58, 0); X.lineTo(-92, 0); X.closePath(); X.fillStyle = hex(col, .12); X.fill();
  X.beginPath(); X.moveTo(0, -205); X.lineTo(58, 0); X.lineTo(80, 0); X.closePath(); X.fillStyle = hex(col, -.1); X.fill();
  // patches with stitches
  [[-120, -70, 40, 34, '#9c3b2c'], [70, -120, 34, 30, '#3d6a8a'], [200, -90, 44, 36, '#7a5c2e']].forEach(([px, py, w, h, c]) => { box(px, py, w, h, c, 3); X.setLineDash([4, 4]); X.strokeStyle = 'rgba(255,240,210,.7)'; X.lineWidth = 2; X.strokeRect(px + 4, py + 4, w - 8, h - 8); X.setLineDash([]); });
  box(-4, -268, 8, 26, '#5a4030', 2);
  if (snow) { X.beginPath(); X.moveTo(0, -252); X.lineTo(-62, -165); X.quadraticCurveTo(-30, -150, 0, -172); X.quadraticCurveTo(70, -150, 105, -170); X.lineTo(150, -238); X.closePath(); X.fillStyle = '#f2f5fa'; X.fill(); }
  box(-175, -6, 505, 10, 'rgba(0,0,0,.18)', 4);
  X.restore();
}
function barrel(x, y, s) { X.save(); X.translate(x, y); X.scale(s, s); ell(0, 0, 52, 12, 'rgba(0,0,0,.25)'); X.beginPath(); X.moveTo(-40, -120); X.quadraticCurveTo(-56, -60, -40, 0); X.lineTo(40, 0); X.quadraticCurveTo(56, -60, 40, -120); X.closePath(); X.fillStyle = lin(-50, 0, 50, 0, ['#8a5a32', '#a8703f', '#6a4224']); X.fill(); for (const by of [-104, -60, -16]) box(-50, by, 100, 9, '#3a3a40', 3); ell(0, -120, 40, 10, '#7a4e2c'); ell(0, -120, 32, 7, '#5f3a20'); X.restore(); }
function crate(x, y, w, h, col = '#b98d56') { box(x, y - h, w, h, col, 3); for (let k = 1; k < 4; k++) line(x, y - h + k * h / 4, x + w, y - h + k * h / 4, 'rgba(0,0,0,.18)', 2); X.save(); X.beginPath(); X.rect(x, y - h, w, h); X.clip(); line(x, y, x + w, y - h, hex(col, -.15), 10); X.restore(); X.strokeStyle = hex(col, -.3); X.lineWidth = 4; X.strokeRect(x + 2, y - h + 2, w - 4, h - 4); box(x + w - 10, y - h, 10, h, 'rgba(0,0,0,.12)'); }
function sack(x, y, s, col = '#c9b07a') { X.save(); X.translate(x, y); X.scale(s, s); X.beginPath(); X.moveTo(-30, 0); X.quadraticCurveTo(-44, -60, -14, -78); X.lineTo(14, -78); X.quadraticCurveTo(44, -60, 30, 0); X.closePath(); X.fillStyle = col; X.fill(); box(-16, -84, 32, 10, hex(col, -.25), 4); ell(12, -38, 10, 26, 'rgba(0,0,0,.1)'); X.restore(); }
function logPile(x, y, s) { X.save(); X.translate(x, y); X.scale(s, s); box(-10, -10, 180, 10, 'rgba(0,0,0,.2)', 5); for (let r = 0; r < 3; r++) for (let k = 0; k < 4 - r; k++) { const cx = k * 40 + r * 20 + 12, cy = -22 - r * 36; ell(cx, cy, 20, 19, '#8a5a32'); ell(cx, cy, 14, 13, '#d9a86a'); ell(cx, cy, 6, 6, '#b98448'); } X.restore(); }
function lanternPost(x, y, s, t, night) { X.save(); X.translate(x, y); X.scale(s, s); box(-4, -230, 8, 230, '#2e2a28'); X.beginPath(); X.arc(30, -230, 30, Math.PI, 0); X.strokeStyle = '#2e2a28'; X.lineWidth = 7; X.stroke(); box(48, -200, 24, 40, night ? '#ffd78a' : '#f3e2b5', 4); X.strokeStyle = '#2e2a28'; X.lineWidth = 3; X.strokeRect(48, -200, 24, 40); box(44, -206, 32, 8, '#2e2a28', 3); X.restore(); if (night) warmGlow(x + 60 * s, y - 180 * s, 120 * s, .5); }
function bunting(x0, y0, x1, y1, sag, t, n) {
  X.strokeStyle = 'rgba(60,45,30,.8)'; X.lineWidth = 2; X.beginPath(); X.moveTo(x0, y0); X.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + sag, x1, y1); X.stroke();
  for (let i = 0; i < n; i++) { const q = (i + .5) / n, u = 1 - q, px = u * u * x0 + 2 * u * q * (x0 + x1) / 2 + q * q * x1, py = u * u * y0 + 2 * u * q * ((y0 + y1) / 2 + sag) + q * q * y1, sw = Math.sin(TS * 4 + i) * 3;
    X.beginPath(); X.moveTo(px - 13, py); X.lineTo(px + 13, py); X.lineTo(px + sw, py + 30); X.closePath(); X.fillStyle = FLAG_COLS[i % 5]; X.fill(); }
}
function clothesline(x0, x1, y, t) {
  box(x0 - 4, y - 150, 8, 150, '#5a4030'); box(x1 - 4, y - 150, 8, 150, '#5a4030'); line(x0, y - 150, x0 - 30, y, 'rgba(60,45,30,.5)', 2);
  X.strokeStyle = '#3a2e26'; X.lineWidth = 2; X.beginPath(); X.moveTo(x0, y - 140); X.quadraticCurveTo((x0 + x1) / 2, y - 110, x1, y - 140); X.stroke();
  const items = [['shirt', '#f0ece2'], ['shirt', '#a33a30'], ['pants', '#3d5a8a'], ['shirt', '#4f7a4a'], ['sock', '#c9a24a']];
  items.forEach(([k, c], i) => { const q = (i + 1) / (items.length + 1), px = lerp(x0, x1, q), py = y - 140 + Math.sin(q * Math.PI) * 30, sw = Math.sin(TS * 3 + i) * .05; X.save(); X.translate(px, py); X.rotate(sw);
    if (k === 'shirt') { X.beginPath(); X.moveTo(-20, 0); X.lineTo(20, 0); X.lineTo(32, 14); X.lineTo(22, 22); X.lineTo(20, 50); X.lineTo(-20, 50); X.lineTo(-22, 22); X.lineTo(-32, 14); X.closePath(); X.fillStyle = c; X.fill(); }
    else if (k === 'pants') { X.beginPath(); X.moveTo(-18, 0); X.lineTo(18, 0); X.lineTo(20, 58); X.lineTo(4, 58); X.lineTo(0, 18); X.lineTo(-4, 58); X.lineTo(-20, 58); X.closePath(); X.fillStyle = c; X.fill(); }
    else { box(-6, 0, 12, 30, c, 3); box(-6, 22, 22, 10, c, 4); } X.restore(); });
}
function campfire(x, y, s, t) {
  X.save(); X.translate(x, y); X.scale(s, s);
  ell(0, 4, 190, 46, 'rgba(70,45,30,.55)');
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283, sx = Math.cos(a) * 120, sy = Math.sin(a) * 34; box(sx - 26, sy - 22, 52, 34, i % 2 ? '#7c8088' : '#90949c', 10); box(sx - 26, sy - 22, 52, 10, 'rgba(255,255,255,.12)', 8); }
  X.save(); X.rotate(-.35); box(-80, -24, 160, 26, '#5a3a24', 12); X.restore(); X.save(); X.rotate(.35); box(-80, -24, 160, 26, '#6a4428', 12); X.restore();
  // flame: shape swaps on stepped time (choppy, like hand-drawn fire)
  const k = Math.floor(TS * 12), fl = (sc, col, w, h) => { X.beginPath(); X.moveTo(-w, -10); for (let i = 0; i <= 6; i++) { const q = i / 6, xx = lerp(-w, w, q), tip = (i % 2 ? .55 : 1) * h * (.75 + hash(k * 7 + i + sc) * .45); X.lineTo(xx - w * .08, -tip); X.lineTo(lerp(-w, w, q + 1 / 12), -tip * .45); } X.lineTo(w, -10); X.closePath(); X.fillStyle = col; X.fill(); };
  fl(1, '#e8452c', 85, 190); fl(2, '#f7941d', 62, 140); fl(3, '#ffd34d', 36, 85);
  X.restore();
  warmGlow(x, y - 70 * s, 420 * s, .55); warmGlow(x, y - 60 * s, 160 * s, .5, '255,220,140');
  for (let i = 0; i < 14; i++) { const q = (t * .5 + i / 14) % 1; ell(x + Math.sin(i * 3 + q * 6) * 50 * s, y - 120 * s - q * 320 * s, 3 * s, 3 * s, `rgba(255,${180 + i * 4},90,${1 - q})`); }
}
function tripodPot(x, y, s) { X.save(); X.translate(x, y); X.scale(s, s); X.lineCap = 'round'; line(-150, 20, 0, -330, '#2a2422', 9); line(150, 20, 0, -330, '#2a2422', 9); line(20, -10, 0, -330, '#2a2422', 7); line(0, -330, 0, -230, '#2a2422', 3); ell(0, -190, 62, 50, '#25211f'); box(-66, -238, 132, 14, '#3a3432', 6); ell(-20, -205, 14, 22, 'rgba(255,255,255,.08)'); X.restore(); }
function wagon(x, y, s, t, night, snow) {
  X.save(); X.translate(x, y); X.scale(s, s);
  line(220, -90, 420, -20, '#5a3a24', 10); line(210, -60, 420, -4, '#5a3a24', 10);
  ell(20, 6, 300, 26, 'rgba(0,0,0,.22)');
  box(-250, -330, 470, 230, '#a8342a', 6); box(-250, -330, 470, 230, lin(-250, 0, 220, 0, ['rgba(255,255,255,.06)', 'rgba(0,0,0,.12)']), 6);
  for (const px of [-232, 92]) { X.strokeStyle = '#d6a83c'; X.lineWidth = 4; X.strokeRect(px, -310, 110, 190); }
  box(-250, -112, 470, 16, '#5a1f18'); box(-250, -340, 470, 14, '#d6a83c', 4);
  // roof
  X.beginPath(); X.moveTo(-275, -335); X.quadraticCurveTo(-20, -430, 245, -335); X.closePath(); X.fillStyle = '#2f6b4f'; X.fill(); box(-275, -345, 520, 16, '#255a41', 4);
  if (snow) { X.beginPath(); X.moveTo(-280, -342); X.quadraticCurveTo(-20, -446, 250, -342); X.quadraticCurveTo(-20, -400, -280, -342); X.fillStyle = '#f4f7fb'; X.fill(); }
  X.fillStyle = '#f2ead4'; for (let i = 0; i < 26; i++) { X.beginPath(); X.moveTo(-270 + i * 20, -330); X.lineTo(-260 + i * 20, -316); X.lineTo(-250 + i * 20, -330); X.fill(); }
  box(130, -470, 22, 100, '#2a2422', 3); box(124, -478, 34, 12, '#3a3432', 3);
  // window w/ shutters + flowers
  box(-120, -290, 120, 110, night ? '#ffd88a' : '#f6e2a8', 4); line(-60, -290, -60, -180, '#5a1f18', 6); line(-120, -235, 0, -235, '#5a1f18', 6); box(-120, -290, 120, 110, 'rgba(0,0,0,0)'); X.strokeStyle = '#5a1f18'; X.lineWidth = 6; X.strokeRect(-120, -290, 120, 110);
  box(-160, -292, 36, 114, '#2f6b4f', 3); box(4, -292, 36, 114, '#2f6b4f', 3); box(-130, -182, 140, 22, '#6a3a24', 3);
  for (let i = 0; i < 8; i++) { ell(-118 + i * 17, -188, 9, 9, ['#e84a5f', '#f7d65a', '#ffffff', '#e84a5f'][i % 4]); ell(-118 + i * 17, -178, 6, 4, '#3c8d5a'); }
  // sun emblem
  X.save(); X.translate(150, -230); for (let i = 0; i < 12; i++) { X.rotate(Math.PI / 6); X.beginPath(); X.moveTo(-6, -34); X.lineTo(0, -54); X.lineTo(6, -34); X.fillStyle = '#e8b923'; X.fill(); } ell(0, 0, 30, 30, '#e8b923'); ell(0, 0, 22, 22, '#f2cd4a'); X.restore();
  // wheels
  for (const wx of [-170, 140]) { X.save(); X.translate(wx, -50); ell(0, 0, 82, 82, '#4a2e1c'); ell(0, 0, 70, 70, '#a8342a'); ell(0, 0, 62, 62, 'rgba(0,0,0,0)'); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; line(0, 0, Math.cos(a) * 66, Math.sin(a) * 66, '#7a4a2a', 7); } ell(0, 0, 66, 66); X.strokeStyle = '#6a3a22'; X.lineWidth = 10; X.stroke(); ell(0, 0, 16, 16, '#d6a83c'); X.restore(); }
  X.restore();
  smoke(x + 141 * s, y - 480 * s, t, s * 1.1);
  if (night) warmGlow(x - 60 * s, y - 235 * s, 200 * s, .45);
}
function dirtPath(x0, y0, x1, y1, w0, w1, col) {
  X.beginPath(); X.moveTo(x0 - w0, y0); X.bezierCurveTo(x0 - w0 + 60, lerp(y0, y1, .5), x1 - w1 - 120, lerp(y0, y1, .7), x1 - w1, y1); X.lineTo(x1 + w1, y1); X.bezierCurveTo(x1 + w1 - 100, lerp(y0, y1, .7), x0 + w0 + 40, lerp(y0, y1, .5), x0 + w0, y0); X.closePath(); X.fillStyle = col; X.fill();
  for (const o of [-.45, .45]) { X.beginPath(); X.moveTo(x0 + w0 * o, y0); X.bezierCurveTo(x0 + w0 * o + 50, lerp(y0, y1, .5), x1 + w1 * o - 110, lerp(y0, y1, .7), x1 + w1 * o, y1); X.strokeStyle = hex(col, -.15); X.lineWidth = 6; X.stroke(); }
}

// ---------------- scenes ----------------
function bgCamp(sc, t) {
  const night = sc.time === 'night', snow = !!sc.snow || night;
  const P = night ? { sky: ['#0b1433', '#26345e'], mtn: '#34447a', ridge: '#8796c4', h1: '#27365e', h2: '#1f2d50', tree: '#1f4146', tree2: '#18343a', ground: '#dfe6f0', g2: '#c4cfe0', cloud: '#2c3a6a', path: '#b8c2d4' }
    : { sky: ['#8fb7e0', '#c9dcef'], mtn: '#8d9cbc', ridge: '#f2f5fa', h1: '#7d9a86', h2: '#6f8f73', tree: '#4f7a52', tree2: '#3f6a44', ground: snow ? '#e8edf4' : '#7f9c5e', g2: snow ? '#d3dcea' : '#748f55', cloud: '#e9eef5', path: snow ? '#cbd3df' : '#9b8466' };
  cam(0); skyFill(...P.sky); if (night) { stars(sc.seed, 260, t); ell(W * .2, H * .2, 46, 46, '#fdf6dc'); X.save(); X.globalCompositeOperation = 'lighter'; ell(W * .2, H * .2, 90, 90, 'rgba(160,180,255,.18)'); X.restore(); }
  cam(.06); const cd = t * 6; cloudP((W * .3 + cd) % (W + 600) - 200, H * .16, 1, P.cloud); cloudP((W * .78 + cd * .7) % (W + 600) - 200, H * .1, .75, P.cloud); cloudP((W * .05 + cd * .5) % (W + 600) - 200, H * .3, .6, P.cloud);
  cam(.14); range(sc.seed, H * .7, H * .2, 120, P.mtn, P.ridge, 360);
  if (sc.castle) { X.fillStyle = night ? '#2a3660' : '#7f8eb0'; const cx = W * .28, cy = H * .3; X.fillRect(cx - 80, cy - 60, 160, 90); for (const dx of [-80, -20, 40, 80]) { X.fillRect(cx + dx - 14, cy - 120, 28, 70); X.beginPath(); X.moveTo(cx + dx - 18, cy - 120); X.lineTo(cx + dx, cy - 165); X.lineTo(cx + dx + 18, cy - 120); X.fill(); } }
  cam(.28); hills(sc.seed + 1, H * .78, H * .5, 30, P.h1);
  cam(.4); forest(sc.seed + 2, H * .53, H * .6, 60, 70, 110, P.tree, snow && '#e9eef5', night ? 'rgba(20,30,60,.25)' : 'rgba(200,215,230,.25)');
  cam(.55); hills(sc.seed + 3, H * .8, H * .58, 18, P.h2, 200); forest(sc.seed + 4, H * .6, H * .64, 26, 140, 190, P.tree2, snow && '#f2f5fa');
  cam(1);
  const hz = H * .63; X.fillStyle = lin(0, hz, 0, H, [P.g2, P.ground]); X.fillRect(-W, hz, W * 3, H);
  dirtPath(W * .96, H + 20, W * .78, hz + 8, 170, 30, P.path);
  tufts(sc.seed, hz + 20, H, snow ? 0 : 160, hex(P.ground, -.2), !snow);
  if (snow) { const R = rng(sc.seed + 8); for (let i = 0; i < 40; i++) ell(R() * W, hz + 30 + R() * (H - hz), 14, 3, 'rgba(120,140,180,.25)'); }
  clothesline(W * .05, W * .2, H * .71, t);
  lanternPost(W * .21, H * .73, .8, t, night); lanternPost(W * .6, H * .72, .8, t, night);
  tent(W * .26, H * .73, .78, '#c9a46c', night, snow); tent(W * .5, H * .71, .62, '#d2b07a', night, snow);
  bunting(W * .14, H * .5, W * .44, H * .54, 50, t, 12); bunting(W * .44, H * .54, W * .72, H * .53, 46, t, 12);
  wagon(W * .74, H * .79, .7, t, night, snow);
  barrel(W * .16, H * .81, .9); crate(W * .2, H * .8, 110, 90); crate(W * .21, H * .8 - 90, 90, 70, '#c49a62'); sack(W * .3, H * .8, .9); sack(W * .335, H * .805, .8, '#d6c08a');
  logPile(W * .52, H * .8, .9);
  ell(W * .56, H * .84, 300, 70, night ? 'rgba(90,70,60,.35)' : 'rgba(110,80,50,.35)');
  tripodPot(W * .56, H * .84, .75); campfire(W * .56, H * .84, .75, t);
  if (sc.smoke !== 0) smoke(W * .56, H * .7, t, 1.3);
  if (snow) snowfall(sc.seed, t, night ? 160 : 100);
  if (night) { cam(0); X.fillStyle = 'rgba(10,20,60,.12)'; X.fillRect(0, 0, W, H); }
}
function bgCastle(sc, t) {
  cam(0); skyFill('#0a1230', '#1c2a58'); stars(sc.seed, 320, t, H * .8);
  const mx = W * .27, my = H * .38; X.save(); X.globalCompositeOperation = 'lighter'; ell(mx, my, 150, 150, 'rgba(130,150,255,.18)'); ell(mx, my, 100, 100, 'rgba(160,180,255,.2)'); X.restore(); ell(mx, my, 70, 70, '#fbf3d9'); ell(mx + 18, my - 12, 12, 12, 'rgba(0,0,0,.06)'); ell(mx - 20, my + 18, 16, 16, 'rgba(0,0,0,.05)');
  cam(.08); const cd = t * 8; [[.35, .12, 1.1], [.78, .2, 1.2], [.12, .45, .8], [.9, .55, .7], [.55, .05, .7]].forEach(([x, y, s], i) => cloudP((W * x + cd * (1 + i * .2)) % (W + 700) - 250, H * y, s, '#2a3a6e'));
  cam(.18); range(sc.seed, H, H * .55, 160, '#25335f', '#6d7fb5', 420);
  cam(.55);
  const wallC = '#3b4062', wallL = '#474d72', roofC = '#2a2c3e', k = Math.floor(TS * 12);
  const win = (x, y, w, h, i) => { X.beginPath(); X.moveTo(x, y + h); X.lineTo(x, y + w / 2); X.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); X.lineTo(x + w, y + h); X.closePath(); const f = .85 + hash(k * 3 + i) * .15; X.fillStyle = `rgba(255,${200 + 30 * f | 0},110,${f})`; X.fill(); line(x + w / 2, y + 6, x + w / 2, y + h, 'rgba(120,70,30,.6)', 2); box(x - 3, y + h, w + 6, 5, 'rgba(255,255,255,.2)'); };
  const tower = (cx, top, w, base, roofH, flag) => {
    box(cx - w / 2, top, w, base - top, wallL); box(cx + w * .1, top, w * .4, base - top, 'rgba(0,0,0,.15)');
    for (let i = 0; i < 5; i++) box(cx - w / 2 - 6 + i * (w + 12) / 5, top - 22, (w + 12) / 5 - 10, 24, wallL);
    box(cx - w / 2 - 6, top, w + 12, 12, '#555b82');
    X.beginPath(); X.moveTo(cx - w / 2 - 14, top - 22); X.lineTo(cx, top - 22 - roofH); X.lineTo(cx + w / 2 + 14, top - 22); X.closePath(); X.fillStyle = roofC; X.fill();
    X.beginPath(); X.moveTo(cx, top - 22 - roofH); X.lineTo(cx + w / 2 + 14, top - 22); X.lineTo(cx, top - 22); X.closePath(); X.fillStyle = 'rgba(0,0,0,.25)'; X.fill();
    if (flag) { line(cx, top - 22 - roofH, cx, top - 70 - roofH, '#222', 3); const fw = Math.sin(TS * 5 + cx) * 6; X.beginPath(); X.moveTo(cx, top - 70 - roofH); X.quadraticCurveTo(cx + 25, top - 66 - roofH + fw, cx + 54, top - 60 - roofH + fw); X.lineTo(cx, top - 50 - roofH); X.fillStyle = '#b8332e'; X.fill(); }
  };
  const base = H * .98;
  box(W * .25, H * .62, W * .5, base - H * .62, wallC);
  const R = rng(sc.seed); for (let i = 0; i < 90; i++) box(W * .25 + R() * W * .5, H * .64 + R() * (base - H * .66), 20 + R() * 26, 9, 'rgba(0,0,0,.12)', 2);
  for (let i = 0; i < 28; i++) box(W * .25 + i * W * .5 / 28, H * .62 - 22, W * .5 / 28 - 12, 24, wallC);
  tower(W * .5, H * .26, 130, H * .62, 120, true);
  box(W * .42, H * .4, W * .16, H * .58, wallL); for (let i = 0; i < 9; i++) box(W * .42 - 6 + i * W * .16 / 9, H * .4 - 22, W * .16 / 9 - 10, 24, wallL);
  tower(W * .38, H * .36, 90, H * .62, 110, false); tower(W * .62, H * .36, 90, H * .62, 110, false);
  tower(W * .25, H * .55, 150, base, 150, true); tower(W * .75, H * .55, 150, base, 150, true);
  let wi = 0; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) win(W * .455 + c * 60, H * .45 + r * 95, 30, 54, wi++);
  win(W * .5 - 15, H * .3, 30, 54, wi++); win(W * .5 - 15, H * .37, 30, 50, wi++); win(W * .38 - 13, H * .41, 26, 46, wi++); win(W * .62 - 13, H * .41, 26, 46, wi++);
  for (const x of [W * .25, W * .75]) { win(x - 16, H * .62, 32, 58, wi++); win(x - 16, H * .82, 32, 58, wi++); X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 6; X.beginPath(); X.moveTo(x, H * .73); X.lineTo(x, H * .79); X.moveTo(x - 12, H * .755); X.lineTo(x + 12, H * .755); X.stroke(); }
  for (const x of [W * .33, W * .67]) { win(x - 14, H * .8, 28, 50, wi++); X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 5; X.beginPath(); X.moveTo(x, H * .68); X.lineTo(x, H * .74); X.moveTo(x - 10, H * .7); X.lineTo(x + 10, H * .7); X.stroke(); }
  // gate
  const gx = W * .5; X.beginPath(); X.moveTo(gx - 70, base); X.lineTo(gx - 70, H * .86); X.lineTo(gx, H * .8); X.lineTo(gx + 70, H * .86); X.lineTo(gx + 70, base); X.closePath(); X.fillStyle = '#5a5f82'; X.fill();
  X.beginPath(); X.moveTo(gx - 54, base); X.lineTo(gx - 54, H * .87); X.lineTo(gx, H * .82); X.lineTo(gx + 54, H * .87); X.lineTo(gx + 54, base); X.closePath(); X.fillStyle = '#0d0f1c'; X.fill();
  for (let i = -4; i <= 4; i++) line(gx + i * 12, H * .84, gx + i * 12, base, '#3a3f5c', 4); for (let j = 0; j < 4; j++) line(gx - 54, H * .88 + j * 22, gx + 54, H * .88 + j * 22, '#3a3f5c', 3);
  for (const s of [-1, 1]) { ell(gx + s * 95, H * .88, 7, 7, '#ffb347'); warmGlow(gx + s * 95, H * .88, 60, .6); }
  for (let i = 0; i < 6; i++) { ell(W * .3 + i * W * .08, H * .615, 6, 6, '#ffb347'); warmGlow(W * .3 + i * W * .08, H * .615, 40, .4); }
  cam(.9);
  const R2 = rng(sc.seed + 3); X.fillStyle = '#1b2547';
  for (let i = 0; i < 9; i++) { const bx = i < 5 ? i * 110 - 40 : W - (i - 4) * 120 + 20, bh = 60 + R2() * 50, by = H - bh; ell(bx + 40, H, 110, 70 + R2() * 40, '#22305a'); X.fillStyle = '#1b2547'; X.fillRect(bx, by, 80, bh); X.beginPath(); X.moveTo(bx - 10, by); X.lineTo(bx + 40, by - 50); X.lineTo(bx + 90, by); X.fill(); if (i % 2) { box(bx + 30, by + 20, 16, 22, '#ffcf7a', 2); } }
  snowfall(sc.seed, t, 40, .7);
}
function bgThrone(sc, t) {
  cam(0); skyFill('#0d1a44', '#2a3d7a'); stars(sc.seed, 200, t, H * .5);
  X.save(); X.globalCompositeOperation = 'lighter'; X.beginPath(); X.arc(W / 2, H * 1.7, H * 1.5, Math.PI * 1.15, Math.PI * 1.85); X.strokeStyle = 'rgba(120,200,255,.35)'; X.lineWidth = 16; X.stroke(); X.restore();
  cam(.12); cloudP(W * .2, H * .32, 1.1, '#dfe6f2'); cloudP(W * .82, H * .28, 1.2, '#dfe6f2'); range(sc.seed, H * .7, H * .3, 80, '#7d8fb8', '#f2f5fa', 300);
  cam(.25); forest(sc.seed + 1, H * .5, H * .58, 50, 70, 100, '#2f6a52', '#f2f5fa');
  // white spires
  [[.14, .18], [.3, .1], [.68, .1], [.86, .16], [.5, .05]].forEach(([x, top]) => { const cx = W * x, w = 70; box(cx - w / 2, H * top + 80, w, H * .6, '#e8ecf4'); box(cx, H * top + 80, w / 2, H * .6, 'rgba(0,0,0,.08)'); X.beginPath(); X.moveTo(cx - w / 2 - 10, H * top + 80); X.lineTo(cx, H * top - 40); X.lineTo(cx + w / 2 + 10, H * top + 80); X.fillStyle = '#d6b45a'; X.fill(); X.beginPath(); X.moveTo(cx, H * top - 40); X.lineTo(cx + w / 2 + 10, H * top + 80); X.lineTo(cx, H * top + 80); X.fillStyle = 'rgba(0,0,0,.12)'; X.fill(); for (let k = 0; k < 4; k++) box(cx - 6, H * top + 120 + k * 60, 12, 20, '#ffe7a3', 3); });
  cam(.6);
  // gold sun-ring behind throne
  X.save(); X.translate(W / 2, H * .42); X.rotate(t * .05); for (let i = 0; i < 16; i++) { X.rotate(Math.PI / 8); X.beginPath(); X.moveTo(-14, -230); X.lineTo(0, -300); X.lineTo(14, -230); X.fillStyle = '#e2bf55'; X.fill(); } X.beginPath(); X.arc(0, 0, 220, 0, 7); X.strokeStyle = '#e2bf55'; X.lineWidth = 26; X.stroke(); X.beginPath(); X.arc(0, 0, 186, 0, 7); X.strokeStyle = 'rgba(226,191,85,.5)'; X.lineWidth = 8; X.stroke(); X.restore();
  // throne
  const tx = W / 2;
  box(tx - 170, H * .18, 340, H * .5, '#f1ede2', 6); box(tx + 60, H * .18, 110, H * .5, 'rgba(0,0,0,.06)');
  X.beginPath(); X.moveTo(tx - 190, H * .19); X.lineTo(tx, H * .09); X.lineTo(tx + 190, H * .19); X.closePath(); X.fillStyle = '#f6f2e8'; X.fill(); ell(tx, H * .15, 24, 24, '#d6a83c'); ell(tx, H * .15, 14, 14, '#f6f2e8');
  box(tx - 130, H * .23, 260, H * .3, '#d6a83c', 4); box(tx - 118, H * .24, 236, H * .28, '#2f8a4a', 3);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const dx = tx - 84 + c * 56, dy = H * .29 + r * 90; X.beginPath(); X.moveTo(dx, dy - 22); X.lineTo(dx + 14, dy); X.lineTo(dx, dy + 22); X.lineTo(dx - 14, dy); X.fillStyle = '#e8c45a'; X.fill(); }
  for (const s of [-1, 1]) { box(tx + s * 210 - 40, H * .42, 80, H * .26, '#ebe6d8', 4); ell(tx + s * 210, H * .42, 34, 34, '#d6a83c'); ell(tx + s * 210 - 10, H * .41, 10, 10, '#f6e3a0'); }
  // floor + steps
  cam(1);
  X.fillStyle = '#efe9dc'; X.fillRect(-W, H * .66, W * 3, H);
  for (let i = 0; i < 6; i++) { const y = H * .66 + i * 46, w = 700 + i * 160; box(W / 2 - w / 2, y, w, 46, i % 2 ? '#f4efe4' : '#e9e2d2'); box(W / 2 - w / 2, y, w, 6, '#d6b45a'); }
  X.beginPath(); X.moveTo(W / 2 - 90, H * .66); X.lineTo(W / 2 + 90, H * .66); X.lineTo(W / 2 + 260, H); X.lineTo(W / 2 - 260, H); X.closePath(); X.fillStyle = '#d9b44c'; X.fill(); X.strokeStyle = '#b8922e'; X.lineWidth = 6; X.stroke();
  // columns
  for (const cx of [W * .05, W * .18, W * .82, W * .95]) { box(cx - 60, 0, 120, H * .9, '#f2eee4'); for (let k = -2; k <= 2; k++) line(cx + k * 20, 0, cx + k * 20, H * .9, 'rgba(0,0,0,.06)', 4); box(cx + 20, 0, 40, H * .9, 'rgba(0,0,0,.06)'); box(cx - 72, H * .86, 144, 50, '#e6e0d2', 3); box(cx - 72, H * .86, 144, 8, '#d6b45a'); box(cx - 66, H * .3, 132, 12, '#d6b45a'); X.beginPath(); X.moveTo(cx - 40, H * .3 + 12); X.lineTo(cx, H * .3 + 50); X.lineTo(cx + 40, H * .3 + 12); X.strokeStyle = '#d6b45a'; X.lineWidth = 8; X.stroke(); }
  // braziers w/ blue fire (choppy) + lanterns
  const k = Math.floor(TS * 12);
  for (const bx of [W * .1, W * .9]) { box(bx - 50, H * .7, 100, 160, '#ebe6d8', 4); box(bx - 80, H * .68, 160, 26, '#d6b45a', 6); for (let i = 0; i < 4; i++) { const h = 110 + hash(k + i * 5 + bx) * 70, xx = bx - 54 + i * 36; X.beginPath(); X.moveTo(xx - 22, H * .68); X.lineTo(xx + (hash(k + i) - .5) * 12, H * .68 - h); X.lineTo(xx + 22, H * .68); X.fillStyle = i % 2 ? '#9fd4ff' : '#cfeaff'; X.fill(); } warmGlow(bx, H * .62, 220, .45, '120,190,255'); }
  for (const lx of [W * .3, W * .7]) { box(lx - 6, H * .38, 12, H * .3, '#d6b45a'); box(lx - 26, H * .32, 52, 70, '#fff1c2', 6); X.strokeStyle = '#c99a2e'; X.lineWidth = 5; X.strokeRect(lx - 26, H * .32, 52, 70); X.beginPath(); X.moveTo(lx - 34, H * .32); X.lineTo(lx, H * .28); X.lineTo(lx + 34, H * .32); X.fillStyle = '#d6a83c'; X.fill(); warmGlow(lx, H * .36, 120, .4); }
  X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const R = hash(i * 9.1); X.fillStyle = `rgba(255,230,150,${.4 + .4 * Math.sin(t * 2 + i)})`; X.save(); X.translate(W * R, (H * hash(i * 3.3) - t * 20 + H) % H); X.rotate(Math.PI / 4); X.fillRect(-5, -5, 10, 10); X.restore(); } X.restore();
}
function bgShop(sc, t) {
  cam(.3);
  X.fillStyle = '#6e4a2e'; X.fillRect(-W, -H, W * 3, H * 3);
  for (let x = -200; x < W + 200; x += 90) { box(x, 0, 88, H, x % 180 ? '#74502f' : '#6a4629'); line(x, 0, x, H, 'rgba(0,0,0,.2)', 3); }
  // window right
  const wx = W * .74, ww = 360, wy = H * .08, wh = H * .7;
  X.save(); X.beginPath(); X.rect(wx, wy, ww, wh); X.clip(); skyFill('#8cc0ea', '#d8ebf8'); range(sc.seed, wy + wh, wy + wh * .35, 80, '#7f90b8', '#f2f5fa', 160); forest(sc.seed + 4, wy + wh * .8, wy + wh * .95, 14, 80, 120, '#3f6a44'); X.restore();
  X.strokeStyle = '#4a2e1c'; X.lineWidth = 18; X.strokeRect(wx, wy, ww, wh); line(wx + ww / 2, wy, wx + ww / 2, wy + wh, '#4a2e1c', 10);
  for (const s of [0, 1]) { const cx = s ? wx + ww - 60 : wx - 40; for (let k = 0; k < 4; k++) box(cx + k * 25 + Math.sin(t + k) * 2, wy - 20, 26, wh + 60, k % 2 ? '#e6cf9c' : '#d7b97e'); }
  // tapestry
  const tx = W * .44, ty = H * .06, tw = 460, th = H * .62;
  box(tx, ty, tw, th, '#9a2a2a', 4); X.strokeStyle = '#d6a83c'; X.lineWidth = 10; X.strokeRect(tx + 18, ty + 18, tw - 36, th - 36);
  const dm = (x, y, s, c) => { X.beginPath(); X.moveTo(x, y - s); X.lineTo(x + s, y); X.lineTo(x, y + s); X.lineTo(x - s, y); X.closePath(); X.fillStyle = c; X.fill(); };
  dm(tx + tw / 2, ty + th / 2, 150, '#2d6a8a'); dm(tx + tw / 2, ty + th / 2, 110, '#e7c25c'); dm(tx + tw / 2, ty + th / 2, 70, '#9a2a2a'); dm(tx + tw / 2, ty + th / 2, 30, '#f2ead4');
  for (let i = 0; i < 6; i++) { dm(tx + 60 + i * 68, ty + 50, 16, '#e7c25c'); dm(tx + 60 + i * 68, ty + th - 50, 16, '#e7c25c'); }
  for (let i = 0; i < 30; i++) line(tx + 10 + i * 15, ty + th, tx + 10 + i * 15, ty + th + 26, '#d6a83c', 4);
  // herb / lemon garland
  X.strokeStyle = '#3a5a2a'; X.lineWidth = 4; X.beginPath(); X.moveTo(-50, 30); X.quadraticCurveTo(W * .2, 90, W * .45, 30); X.stroke();
  for (let i = 0; i < 12; i++) { const q = i / 11, x = lerp(-50, W * .45, q), y = 30 + Math.sin(q * Math.PI) * 60; ell(x, y + 16, 12, 16, i % 3 ? '#e6c945' : '#5e8a3a'); }
  // shelves w/ bottles
  cam(.6);
  const sx = W * .02, sw = W * .38;
  for (let r = 0; r < 3; r++) {
    const sy = H * (.3 + r * .22); box(sx, sy, sw, 18, '#4a2e1c', 3); box(sx, sy + 18, sw, 8, 'rgba(0,0,0,.3)');
    const R = rng(sc.seed + r);
    for (let x = sx + 20; x < sx + sw - 50;) {
      const kind = Math.floor(R() * 4), cols = ['#7b3fa0', '#3f7ab5', '#4a9a6a', '#c0562c', '#d6a83c', '#5a5fa0'], c = cols[Math.floor(R() * cols.length)];
      if (kind === 0) { box(x, sy - 120, 46, 110, c, 12); box(x + 14, sy - 150, 18, 34, c, 4); box(x + 10, sy - 158, 26, 10, '#8a5a32', 3); box(x + 6, sy - 80, 34, 30, '#f2ead4', 2); box(x + 6, sy - 110, 8, 60, 'rgba(255,255,255,.25)', 4); x += 62; }
      else if (kind === 1) { ell(x + 30, sy - 40, 30, 38, c); box(x + 20, sy - 96, 20, 24, c, 4); box(x + 16, sy - 104, 28, 10, '#8a5a32', 3); ell(x + 18, sy - 52, 6, 14, 'rgba(255,255,255,.3)'); x += 70; }
      else if (kind === 2) { box(x, sy - 70, 60, 70, hex(c, .2), 8); box(x - 4, sy - 80, 68, 14, '#8a5a32', 4); box(x + 10, sy - 50, 40, 22, '#f2ead4', 2); x += 76; }
      else { box(x, sy - 150, 30, 150, c, 10); box(x + 8, sy - 175, 14, 30, c, 3); box(x + 5, sy - 145, 6, 120, 'rgba(255,255,255,.25)', 3); x += 44; }
    }
  }
  // counter + mortar + scale
  cam(1);
  box(-100, H * .8, W + 200, H * .3, '#5a3a24'); box(-100, H * .8, W + 200, 16, '#7a5234');
  ell(W * .28, H * .79, 80, 20, '#7d8590'); X.beginPath(); X.moveTo(W * .28 - 80, H * .79); X.quadraticCurveTo(W * .28, H * .9, W * .28 + 80, H * .79); X.fillStyle = '#9aa1aa'; X.fill(); X.save(); X.translate(W * .28 + 20, H * .78); X.rotate(.5); box(-12, -140, 24, 150, '#c7ccd3', 10); X.restore();
  box(W * .1, H * .62, 10, H * .18, '#b8922e'); line(W * .1 - 90, H * .63, W * .1 + 100, H * .63, '#b8922e', 6); for (const s of [-1, 1]) { line(W * .1 + s * 90, H * .63, W * .1 + s * 70, H * .7, '#b8922e', 2); line(W * .1 + s * 90, H * .63, W * .1 + s * 110, H * .7, '#b8922e', 2); ell(W * .1 + s * 90, H * .7, 40, 10, '#d6a83c'); }
  warmGlow(W * .85, H * .3, 600, .25, '255,240,200');
}
function bgEarth(sc, t, prog) {
  cam(0); skyFill('#05081c', '#0d1234'); stars(sc.seed, 360, t, H);
  X.save(); X.globalCompositeOperation = 'lighter'; ell(W * .2, H * .3, 520, 200, 'rgba(120,60,200,.10)', .3); X.restore();
  const sx = W * .82, sy = H * .16; X.save(); X.translate(sx, sy); X.rotate(t * .2); for (let i = 0; i < 12; i++) { X.rotate(Math.PI / 6); X.beginPath(); X.moveTo(-8, -40); X.lineTo(0, -66); X.lineTo(8, -40); X.fillStyle = '#ffcf4a'; X.fill(); } X.restore(); warmGlow(sx, sy, 160, .6, '255,210,90'); ell(sx, sy, 38, 38, '#fff1b0');
  const cx = (t * 120) % (W + 600) - 300; line(cx, H * .12, cx - 160, H * .12 - 40, 'rgba(200,230,255,.5)', 4); ell(cx, H * .12, 6, 6, '#fff');
  cam(.4); const ma = t * .25; ell(W * .5 + Math.cos(ma) * 640, H * .5 + Math.sin(ma) * 200, 40, 40, '#cfd3e0'); ell(W * .5 + Math.cos(ma) * 640 + 10, H * .5 + Math.sin(ma) * 200 + 8, 32, 34, 'rgba(30,30,60,.35)');
  cam(1);
  const ex = W / 2, ey = H * .54, er = 360 * (1 + (sc.zoom ?? .25) * ease(prog));
  X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(ex, ey, er * .95, er * 1.25, ['rgba(80,170,255,.6)', 'rgba(80,170,255,0)']); X.fillRect(ex - er * 1.4, ey - er * 1.4, er * 2.8, er * 2.8); X.restore();
  ell(ex, ey, er + 14, er + 14, '#2a8ae0');
  X.save(); X.beginPath(); X.arc(ex, ey, er, 0, 7); X.clip();
  X.fillStyle = lin(ex - er, ey - er, ex + er, ey + er, ['#2f8fd8', '#1f6bb8', '#123f80']); X.fillRect(ex - er, ey - er, er * 2, er * 2);
  // continents: seeded blobs, slowly rotating
  const R = rng(sc.seed + 77), rot = t * 14;
  for (let i = 0; i < 9; i++) { const bx = ((R() * er * 3 + rot) % (er * 3)) - er * 1.5 + ex, by = ey + (R() - .5) * er * 1.5, br = er * (.18 + R() * .28);
    X.beginPath(); for (let a = 0; a < 6.283; a += .4) { const rr2 = br * (.7 + hash(i * 13 + a * 3) * .45); X.lineTo(bx + Math.cos(a) * rr2 * 1.2, by + Math.sin(a) * rr2); } X.closePath(); X.fillStyle = i % 3 === 0 ? '#d8b469' : '#4f9a4a'; X.fill(); X.fillStyle = 'rgba(0,0,0,.08)'; X.fill(); }
  for (let i = 0; i < 6; i++) ell(((R() * er * 3 + rot * 1.4) % (er * 3)) - er * 1.5 + ex, ey + (R() - .5) * er * 1.6, 70 + R() * 60, 16, 'rgba(255,255,255,.7)');
  X.fillStyle = rad(ex - er * .35, ey - er * .35, er * .1, er * 1.2, ['rgba(255,255,255,.18)', 'rgba(0,0,0,0)', 'rgba(0,0,40,.55)']); X.fillRect(ex - er, ey - er, er * 2, er * 2);
  X.restore();
  if (sc.place) {
    const px = ex + er * .12, py = ey - er * .28, pk = back((prog - .15) * 6);
    if (pk > 0) { X.save(); X.translate(px, py); X.scale(pk, pk); ell(0, 0, 14, 14, '#1b1b1b'); ell(0, 0, 8, 8, '#e8452c'); line(0, 0, 0, -70, '#1b1b1b', 4); box(0, -70, 46, 26, '#1b1b1b'); box(4, -66, 38, 18, '#e8452c'); X.restore();
      X.font = `700 ${90}px ${FONT}`; X.lineJoin = 'round'; X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 10; X.strokeText(sc.place, px + 70, py + 30); X.fillStyle = '#fff'; X.fillText(sc.place, px + 70, py + 30); }
  }
}
function bgSun(sc, t, prog) {
  cam(0); skyFill('#120a24', '#1c0f30'); stars(sc.seed, 300, t, H);
  cam(.6); const cx = W / 2, cy = H / 2, r = 330 * (1 + .1 * ease(prog));
  for (let layer = 0; layer < 2; layer++) { X.save(); X.translate(cx, cy); X.rotate(t * (layer ? -.04 : .06)); for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283 + layer * .12, L = r * (1.35 + hash(i * 7 + layer) * .5 + Math.sin(TS * 2 + i) * .04); X.beginPath(); X.moveTo(Math.cos(a - .08) * r * .9, Math.sin(a - .08) * r * .9); X.lineTo(Math.cos(a) * L, Math.sin(a) * L); X.lineTo(Math.cos(a + .08) * r * .9, Math.sin(a + .08) * r * .9); X.fillStyle = layer ? '#e8521e' : '#f7941d'; X.fill(); } X.restore(); }
  for (let i = 0; i < 3; i++) { const a = -1 + i * 2.1 + t * .03; X.beginPath(); X.arc(cx + Math.cos(a) * r * 1.02, cy + Math.sin(a) * r * 1.02, r * .3, a + 1.2, a + 5.1, true); X.strokeStyle = '#f7a93c'; X.lineWidth = 22; X.stroke(); X.strokeStyle = '#ffe08a'; X.lineWidth = 6; X.stroke(); }
  warmGlow(cx, cy, r * 1.8, .45);
  X.save(); X.beginPath(); X.arc(cx, cy, r, 0, 7); X.clip(); X.fillStyle = '#d9561c'; X.fillRect(cx - r, cy - r, r * 2, r * 2);
  // granulation cells, squashed toward the limb for a sphere feel
  const R = rng(sc.seed); for (let i = 0; i < 520; i++) { const a = R() * 6.283, d = Math.sqrt(R()), u = d * r, x = cx + Math.cos(a) * u, y = cy + Math.sin(a) * u, sz = 18 * (1 - d * d * .7), hot = .5 + .5 * Math.sin(t * 1.5 + i);
    X.save(); X.translate(x, y); X.rotate(a); X.scale(1 - d * .6, 1); X.beginPath(); for (let k = 0; k < 6; k++) X.lineTo(Math.cos(k * 1.047) * sz, Math.sin(k * 1.047) * sz); X.closePath(); X.fillStyle = hot > .7 ? '#fff0b0' : hot > .35 ? '#ffc15a' : '#f2892e'; X.fill(); X.restore(); }
  [[-.45, -.25, 34], [-.3, -.12, 18], [.38, .42, 26]].forEach(([dx, dy, sz]) => { ell(cx + dx * r, cy + dy * r, sz * 1.5, sz * 1.2, '#5a1a0a'); ell(cx + dx * r, cy + dy * r, sz * .8, sz * .6, '#1a0805'); });
  X.fillStyle = rad(cx, cy, r * .5, r, ['rgba(0,0,0,0)', 'rgba(120,20,0,.45)']); X.fillRect(cx - r, cy - r, r * 2, r * 2); X.restore();
  cam(.9); const pa = t * .3; ell(cx + Math.cos(pa) * 720, cy + Math.sin(pa) * 300, 60, 60, '#8a4a3a'); ell(cx + Math.cos(pa) * 720 + 18, cy + Math.sin(pa) * 300, 50, 58, 'rgba(10,5,20,.5)');
  for (let i = 0; i < 6; i++) { const q = (t * .1 + i / 6) % 1, x = lerp(W * .05, W * .35, q), y = H * .45 + Math.sin(q * 6 + i) * 30; box(x, y, 30 - i * 3, 26 - i * 3, '#f7a93c', 8); }
}
function bgPortraits(sc, t) {
  cam(0); skyFill('#1e1240', '#2a1650');
  const blob = (x, y, r, col, s) => { X.beginPath(); for (let a = 0; a <= 6.3; a += .3) { const rr2 = r * (1 + .18 * Math.sin(a * 3 + t * .8 + s) + .1 * Math.sin(a * 5 - t + s)); X.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } X.closePath(); X.fillStyle = col; X.fill(); };
  const R = rng(sc.seed); for (let i = 0; i < 9; i++) blob(R() * W, R() * H, 120 + R() * 140, i % 2 ? 'rgba(40,50,200,.55)' : 'rgba(80,30,160,.5)', i);
  const circles = [[W * .3, H * .55, 330], [W * .69, H * .42, 330]];
  (sc.cast || []).slice(0, 2).forEach((c, i) => {
    const [x, y, r] = circles[i];
    X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(x, y, r * .8, r * 1.5, ['rgba(255,110,40,.45)', 'rgba(255,110,40,0)']); X.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2); X.restore();
    blob(x, y, r * 1.12, '#1d2fd0', i * 4);
    X.save(); X.beginPath(); X.arc(x, y, r, 0, 7); X.clip();
    X.fillStyle = lin(0, y - r, 0, y + r, i ? ['#efe3b8', '#bfe8d0', '#5fc9b0'] : ['#7fd6c0', '#3f9a7a', '#2d6a4a']); X.fillRect(x - r, y - r, r * 2, r * 2);
    if (i) { for (let k = 0; k < 5; k++) line(x - r, y + r * .35 + k * 30, x + r, y + r * .35 + k * 30, 'rgba(255,255,255,.3)', 4); for (let k = 0; k < 4; k++) { X.strokeStyle = '#d9b45a'; X.lineWidth = 6; X.beginPath(); X.moveTo(x + r * .55 + k * 20, y + r * .3); X.quadraticCurveTo(x + r * .5 + k * 20, y - r * .1, x + r * .6 + k * 22, y - r * .3); X.stroke(); } }
    else { for (let k = 0; k < 10; k++) ell(x - r + k * 70, y + r * .75, 70, 50, k % 2 ? '#2f8a4a' : '#3fa05a'); for (let k = 0; k < 8; k++) ell(x - r * .7 + k * 55, y + r * .55 + (k % 2) * 30, 9, 9, '#c0304a'); }
    const cc = Object.assign({}, c, { x: x / W, y: (y + r * 1.15) / H, size: (c.size || 1) * 1.25 });
    drawChar(cc, TS, sc.speaker === c.name && LT < (sc.speech || sc.dur), true);
    X.restore();
    const g = X.createConicGradient(t * .6 + i, x, y); ['#ffd23f', '#ff7a1a', '#ff3d6e', '#2a3ad0', '#7b5cff', '#ffd23f'].forEach((cl, k, a) => g.addColorStop(k / (a.length - 1), cl));
    X.beginPath(); X.arc(x, y, r + 10, 0, 7); X.strokeStyle = g; X.lineWidth = 20; X.stroke();
    X.setLineDash([180, 60]); X.lineDashOffset = -t * 60; X.beginPath(); X.arc(x, y, r + 36, 0, 7); X.strokeStyle = 'rgba(255,210,63,.8)'; X.lineWidth = 8; X.stroke(); X.setLineDash([]);
  });
}
