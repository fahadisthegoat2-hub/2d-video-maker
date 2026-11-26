// =====================================================================
//  CHUNKY CHARACTERS — big heads, stocky bodies, LIMITED ANIMATION.
//  Everything here receives stepped time (12fps): poses HOLD, then SNAP.
// =====================================================================
const SKIN = { pale: '#f6d7bf', light: '#f1c6a2', tan: '#e2a77e', medium: '#c4875a', brown: '#94603e', dark: '#5f3b26' };
// [rightUpper, rightFore, leftUpper, leftFore]  (+ = toward body, - = away)
const POSES = {
  rest: [.08, .1, .08, .1], hips: [-.5, 2.2, -.5, 2.2], explain: [-.25, -1.5, .08, .1], chest: [-.3, -1.5, .15, 2.0],
  point: [-1.85, -.2, .08, .1], open: [-.6, -.9, -.6, -.9], shrug: [-.35, -2.0, -.35, -2.0], fist: [-.15, -2.4, .1, .1],
  wave: [-2.4, -.6, .08, .1], hold: [-.2, -1.2, -.2, -1.2], think: [.1, .1, -.1, -2.6], cross: [.2, 2.3, .2, 2.3],
};
const TALK = ['explain', 'chest', 'open', 'explain', 'point', 'shrug', 'chest', 'hold'];
const IDLE = ['rest', 'rest', 'hips', 'rest', 'cross'];
function charDims(c) {
  if (c.metal || c.toon || c.egg) return toonDims(c);
  const kid = !!c.kid; return kid ? { kid, legH: 66, bodyH: 120, bw: 118, R: 102, arm: 54 } : { kid, legH: 92, bodyH: 168, bw: 150, R: 110, arm: 66 };
}
// world-space head center for camera framing
function headOf(c, sc) { const d = charDims(c), s = charScale(c, sc); return { x: c.x * W, y: charY(c, sc) - (d.legH + d.bodyH + d.R * .8) * s, r: d.R * s }; }

function drawChar(c, t, speaking, close) {
  if (c.metal) return drawMetal(c, t, speaking, close);
  if (c.toon) return drawToon(c, t, speaking, close);
  if (c.egg) return drawEgg(c, t, speaking, close);
  const d = charDims(c), s = c._s || (c.size || 1), x = c.x * W, y = c._y ?? (c.y || .88) * H;
  const skin = SKIN[c.skin] || c.skin || SKIN.light, shirt = c.shirt || '#efe6d2', pants = c.pants || '#4a4038';
  const col2 = c.color2 || c.vest || c.apron || c.tabard || '#7a2a2a', outfit = c.outfit || (c.vest ? 'vest' : c.apron ? 'apron' : c.tabard ? 'tunic' : 'shirt');
  const id = c.x * 91 + (c.name || '').length * 7;
  // ---- held pose (changes on beats, never tweens) ----
  const beat = Math.floor(t / (speaking ? .7 : 2.2) + hash(id));
  const pname = c.pose && !speaking ? c.pose : speaking ? TALK[Math.floor(hash(beat * 1.9 + id) * TALK.length)] : IDLE[Math.floor(hash(beat * 1.3 + id) * IDLE.length)];
  const [ru, rf, lu, lf] = POSES[pname] || POSES.rest;
  const lean = (hash(beat * 2.3 + id) - .5) * (speaking ? .06 : .02), tilt = (hash(beat * 3.7 + id) - .5) * (speaking ? .16 : .06);
  const { legH, bodyH, bw, R } = d, shY = -legH - bodyH, hipY = -legH;
  X.save(); X.translate(x, y); X.scale(s * (c.flip ? -1 : 1), s);
  ell(0, 0, bw * .75, 16, 'rgba(20,15,30,.28)');
  // ---- cape (behind) ----
  if (c.cape) { X.beginPath(); X.moveTo(-bw * .45, shY + 10); X.lineTo(bw * .45, shY + 10); X.lineTo(bw * .75, -6); X.lineTo(-bw * .75, -6); X.closePath(); X.fillStyle = hex(c.cape, -.2); X.fill(); }
  // ---- legs / skirt ----
  const long = outfit === 'dress' || outfit === 'robe';
  if (!long) for (const sx of [-1, 1]) { box(sx * 28 - 21, hipY - 10, 42, legH - 2, sx > 0 ? hex(pants, -.15) : pants, 10); if (d.kid) box(sx * 28 - 20, hipY + legH * .45, 40, legH * .45, sx > 0 ? '#8d8c8a' : '#a7a6a3', 6); }
  for (const sx of [-1, 1]) { X.beginPath(); X.ellipse(sx * 32, -12, 34, 17, 0, Math.PI, 0); X.lineTo(sx * 32 + 34, -4); X.lineTo(sx * 32 - 34, -4); X.closePath(); X.fillStyle = '#3a2a22'; X.fill(); box(sx * 32 - 34, -8, 68, 8, '#22180f', 4); ell(sx * 32 + sx * 12, -20, 10, 4, 'rgba(255,255,255,.15)'); }
  if (long) { X.beginPath(); X.moveTo(-bw * .44, hipY - 20); X.lineTo(bw * .44, hipY - 20); X.lineTo(bw * .58, -14); X.quadraticCurveTo(0, -4, -bw * .58, -14); X.closePath(); X.fillStyle = col2; X.fill(); box(bw * .1, hipY - 20, bw * .4, legH + 6, 'rgba(0,0,0,.1)'); box(-bw * .56, -26, bw * 1.12, 10, hex(col2, -.25), 4); if (outfit === 'robe') box(-6, hipY - 20, 12, legH, '#d6a83c'); }
  X.save(); X.translate(0, hipY); X.rotate(lean); X.translate(0, -hipY);
  // ---- torso ----
  const torso = () => { X.beginPath(); X.moveTo(-bw / 2 + 4, hipY + 6); X.lineTo(-bw / 2, shY + 34); X.quadraticCurveTo(-bw / 2, shY, -bw / 2 + 36, shY); X.lineTo(bw / 2 - 36, shY); X.quadraticCurveTo(bw / 2, shY, bw / 2, shY + 34); X.lineTo(bw / 2 - 4, hipY + 6); X.closePath(); };
  const top = outfit === 'tunic' ? '#9aa0a8' : shirt;
  torso(); X.fillStyle = top; X.fill();
  X.save(); torso(); X.clip();
  box(bw * .18, shY, bw * .4, bodyH + 10, 'rgba(0,0,0,.09)');
  if (outfit === 'tunic') { for (let r = 0; r < 12; r++) for (let k = 0; k < 8; k++) ell(-bw / 2 + k * 22 + (r % 2) * 11, shY + r * 15, 7, 5, 'rgba(0,0,0,.08)'); }
  else { line(0, shY + 20, 0, hipY, 'rgba(0,0,0,.12)', 3); for (let i = 0; i < 3; i++) ell(5, shY + 46 + i * 38, 3.5, 3.5, 'rgba(0,0,0,.3)'); }
  if (outfit === 'vest') for (const sx of [-1, 1]) { X.beginPath(); X.moveTo(sx * 18, shY); X.lineTo(sx * (bw / 2 + 2), shY); X.lineTo(sx * (bw / 2 + 2), hipY + 8); X.lineTo(sx * 14, hipY + 8); X.lineTo(sx * 12, shY + 70); X.closePath(); X.fillStyle = sx < 0 ? col2 : hex(col2, -.14); X.fill(); line(sx * 30, hipY - 40, sx * 56, hipY - 40, hex(col2, -.3), 3); }
  if (outfit === 'apron') { box(-bw * .36, shY + 44, bw * .72, bodyH + 60, col2, 10); box(-bw * .36, shY + 44, bw * .72, 8, hex(col2, -.15)); line(-bw * .3, shY + 44, -bw * .2, shY, hex(col2, -.1), 9); line(bw * .3, shY + 44, bw * .2, shY, hex(col2, -.1), 9); box(-bw * .18, hipY - 50, bw * .36, 34, hex(col2, -.12), 5); }
  if (outfit === 'tunic') { box(-bw * .34, shY - 2, bw * .68, bodyH + 70, col2, 6); box(bw * .05, shY, bw * .29, bodyH + 70, 'rgba(0,0,0,.12)'); X.beginPath(); X.moveTo(0, shY + 40); X.lineTo(22, shY + 74); X.lineTo(0, shY + 108); X.lineTo(-22, shY + 74); X.closePath(); X.fillStyle = '#e8b923'; X.fill(); }
  if (outfit === 'suit') { for (const sx of [-1, 1]) { X.beginPath(); X.moveTo(sx * 14, shY); X.lineTo(sx * (bw / 2 + 2), shY); X.lineTo(sx * (bw / 2 + 2), hipY + 8); X.lineTo(sx * 4, hipY + 8); X.lineTo(sx * 4, shY + 90); X.closePath(); X.fillStyle = sx < 0 ? col2 : hex(col2, -.15); X.fill(); } X.beginPath(); X.moveTo(-8, shY + 6); X.lineTo(8, shY + 6); X.lineTo(11, shY + 100); X.lineTo(0, shY + 114); X.lineTo(-11, shY + 100); X.closePath(); X.fillStyle = c.tie || '#2c5aa0'; X.fill(); }
  if (outfit === 'dress' || outfit === 'robe') { box(-bw / 2, hipY - 30, bw, 18, hex(col2, -.2)); }
  if (outfit !== 'dress' && outfit !== 'robe' && !c.nobelt) { box(-bw / 2, hipY - 18, bw, 18, '#3a2618'); box(-11, hipY - 20, 22, 22, '#d6a83c', 3); box(-6, hipY - 15, 12, 12, '#3a2618', 2); }
  if (c.medal) { box(-bw * .3, shY + 40, 14, 22, '#1f2a44', 2); ell(-bw * .3 + 7, shY + 72, 10, 10, '#d6a83c'); }
  if (c.necklace) { X.beginPath(); X.arc(0, shY - 10, 50, .5, 2.64); X.strokeStyle = c.necklace === true ? '#d6a83c' : c.necklace; X.lineWidth = 6; X.stroke(); }
  X.restore();
  if (c.collar !== 0) { X.fillStyle = hex(top, .25); X.beginPath(); X.moveTo(-34, shY - 2); X.lineTo(-2, shY + 26); X.lineTo(-4, shY); X.fill(); X.beginPath(); X.moveTo(34, shY - 2); X.lineTo(2, shY + 26); X.lineTo(4, shY); X.fill(); }
  // ---- arms + hands ----
  const sleeve = outfit === 'tunic' ? '#9aa0a8' : outfit === 'suit' ? col2 : shirt, L = d.arm;
  const arm = (sx, u, f) => {
    X.save(); X.translate(sx * (bw / 2 - 12), shY + 24); X.rotate(sx * u);
    X.lineCap = 'round'; X.strokeStyle = sx > 0 ? hex(sleeve, -.12) : sleeve; X.lineWidth = 36;
    X.beginPath(); X.moveTo(0, 0); X.lineTo(0, L); X.stroke();
    X.translate(0, L); X.rotate(sx * f); X.beginPath(); X.moveTo(0, 0); X.lineTo(0, L * .9); X.stroke();
    if (outfit !== 'tunic') box(-19, L * .8, 38, 13, hex(sleeve, .1), 6);
    hand(sx, L * .9 + 20, hex(skin, sx > 0 ? -.07 : 0), close);
    if (sx > 0 && c.prop) drawProp(c.prop, t, L * .9 + 20);
    X.restore();
  };
  arm(-1, lu, lf); arm(1, ru, rf);
  // ---- head ----
  X.save(); X.translate(0, shY - R * .8); X.rotate(tilt); drawHead(c, t, speaking, skin, R, id, close, pname); X.restore();
  X.restore(); X.restore();
}
function hand(sx, y, col, close) {
  X.fillStyle = col;
  for (let k = 0; k < 4; k++) { const a = -.5 + k * .33; X.save(); X.translate(Math.sin(a) * 12, y + 8); X.rotate(-a); rr(-5.5, 0, 11, 22, 5.5); X.fill(); X.restore(); }
  ell(0, y, 22, 20, col); X.save(); X.translate(-sx * 18, y - 4); X.rotate(sx * .9); rr(-6, -4, 12, 22, 6); X.fillStyle = col; X.fill(); X.restore();
  if (close) { X.strokeStyle = 'rgba(0,0,0,.12)'; X.lineWidth = 2; X.beginPath(); X.arc(0, y + 2, 10, .4, 2.6); X.stroke(); }
}
function drawProp(p, t, y) {
  X.save(); X.translate(0, y);
  if (p === 'hammer') { X.rotate(Math.PI + .2); box(-6, -10, 12, 130, '#7a4f30', 4); box(-34, 108, 68, 36, '#8f99a6', 5); box(-34, 108, 68, 10, '#c4ccd6', 5); }
  else if (p === 'sword') { X.rotate(Math.PI + .3); box(-5, -24, 10, 30, '#5a3a24', 3); box(-24, 4, 48, 10, '#d6a83c', 3); X.beginPath(); X.moveTo(-9, 14); X.lineTo(9, 14); X.lineTo(5, 210); X.lineTo(0, 228); X.lineTo(-5, 210); X.closePath(); X.fillStyle = '#dfe4ea'; X.fill(); line(0, 18, 0, 210, 'rgba(0,0,0,.12)', 3); }
  else if (p === 'book') { X.rotate(-.2); box(-40, -46, 80, 60, '#7b2f2f', 4); box(-36, -42, 72, 52, '#f2ead8', 3); }
  else if (p === 'torch') { X.rotate(Math.PI); box(-7, -10, 14, 120, '#5a3a24', 4); const k = Math.floor(TS * 12); for (const [cc, w, h] of [['#e8452c', 26, 70], ['#ffb02e', 18, 50], ['#fff1a8', 9, 28]]) { X.beginPath(); X.moveTo(-w, 110); X.quadraticCurveTo(-w, 140, (hash(k) - .5) * 14, 110 + h + hash(k + 3) * 16); X.quadraticCurveTo(w, 140, w, 110); X.closePath(); X.fillStyle = cc; X.fill(); } }
  else if (p === 'orb') { glow('#7fffd0', 40); ell(0, -24, 26, 26, '#b6ffe6'); noGlow(); }
  else if (p === 'fish') { X.rotate(-1.3); X.beginPath(); X.ellipse(0, 0, 90, 28, 0, 0, 7); X.fillStyle = '#d65a4a'; X.fill(); X.beginPath(); X.moveTo(80, 0); X.lineTo(130, -30); X.lineTo(130, 30); X.fill(); ell(-60, -6, 7, 7, '#fff'); for (let i = 0; i < 5; i++) line(-30 + i * 22, -24, -36 + i * 22, 24, 'rgba(255,220,180,.6)', 4); }
  else if (p === 'basket') { box(-60, -10, 120, 70, '#e0892e', 14); for (let i = 0; i < 4; i++) line(-56, 4 + i * 16, 56, 4 + i * 16, '#c06a1a', 3); for (let i = 0; i < 6; i++) ell(-40 + i * 16, -10, 9, 9, '#b0203c'); }
  X.restore();
}
function headShape(R) { X.beginPath(); X.moveTo(0, -R * 1.02); X.bezierCurveTo(R * 1.02, -R * 1.02, R * 1.06, R * .2, R * .78, R * .72); X.quadraticCurveTo(R * .45, R * 1.04, 0, R * 1.04); X.quadraticCurveTo(-R * .45, R * 1.04, -R * .78, R * .72); X.bezierCurveTo(-R * 1.06, R * .2, -R * 1.02, -R * 1.02, 0, -R * 1.02); X.closePath(); }
function drawHead(c, t, speaking, skin, R, id, close, pname) {
  const hairC = c.hair || '#2a2220', mood = c.mood || 'neutral', sk = k => hex(skin, k);
  const style = c.bald ? 'bald' : c.hairstyle || 'short', hat = c.hat || (c.helmet ? 'helmet' : null);
  if (style === 'long' || style === 'bun') { box(-R * .98, -R * .5, R * 1.96, R * 1.6, hex(hairC, -.1), R * .5); }
  if (hat === 'hood') { X.beginPath(); X.arc(0, -R * .05, R * 1.25, Math.PI * .85, Math.PI * 2.15); X.lineTo(R * 1.1, R * 1.3); X.lineTo(-R * 1.1, R * 1.3); X.closePath(); X.fillStyle = hex(c.hood || '#2f7a3a', -.15); X.fill(); }
  for (const sx of [-1, 1]) { ell(sx * R * .98, R * .12, R * .17, R * .23, sk(-.06)); ell(sx * R * 1.0, R * .12, R * .08, R * .13, sk(-.2)); }
  headShape(R); X.fillStyle = sk(0); X.fill();
  X.save(); headShape(R); X.clip(); ell(R * .95, R * .25, R * .5, R * 1.3, sk(-.08)); ell(0, R * 1.18, R, R * .32, sk(-.1)); ell(-R * .35, -R * .55, R * .45, R * .25, 'rgba(255,255,255,.12)'); X.restore();
  ell(-R * .55, R * .38, R * .2, R * .11, 'rgba(235,110,90,.18)'); ell(R * .55, R * .38, R * .2, R * .11, 'rgba(235,110,90,.14)');
  if (c.mask) { X.save(); headShape(R); X.clip(); box(-R * 1.1, -R * .6, R * 2.2, R * 1.8, c.mask === true ? '#9aa0a8' : c.mask); box(-R * .7, R * .1, R * .3, R * .9, 'rgba(0,0,0,.08)'); X.restore(); }
  if (c.old) { X.strokeStyle = sk(-.25); X.lineWidth = 3; X.lineCap = 'round'; for (let i = 0; i < 2; i++) { X.beginPath(); X.moveTo(-R * .35, -R * .62 - i * 14); X.quadraticCurveTo(0, -R * .68 - i * 14, R * .35, -R * .62 - i * 14); X.stroke(); } }
  // beard
  const beard = c.beard === true ? hairC : c.beard;
  if (beard) {
    X.beginPath(); X.moveTo(-R * .95, R * .02); X.quadraticCurveTo(-R * 1.0, R * .85, -R * .4, R * 1.12); X.quadraticCurveTo(0, R * 1.32, R * .4, R * 1.12); X.quadraticCurveTo(R * 1.0, R * .85, R * .95, R * .02);
    X.quadraticCurveTo(R * .7, R * .42, 0, R * .44); X.quadraticCurveTo(-R * .7, R * .42, -R * .95, R * .02); X.fillStyle = beard; X.fill();
    X.save(); X.clip(); ell(R * .7, R * .7, R * .5, R * .6, 'rgba(0,0,0,.1)'); const r = rng(id); X.strokeStyle = 'rgba(0,0,0,.14)'; X.lineWidth = 2.5; for (let i = 0; i < 46; i++) { const bx = (r() - .5) * R * 1.8, by = R * (.45 + r() * .75); X.beginPath(); X.moveTo(bx, by); X.lineTo(bx + 2, by + 8); X.stroke(); } X.restore();
  }
  // eyes: big white ovals, small pupils (snap direction)
  const bp = (t + hash(id) * 5) % 3.6, blink = bp < .17;
  const look = c.look ?? (c.x < .5 ? .6 : -.6), gl = close && speaking ? 0 : (Math.floor(t / 1.5 + id) % 4 === 0 ? -look : look);
  const ex = R * .34, ey = -R * .08, erx = R * (c.kid ? .3 : .27), ery = R * (c.kid ? .36 : .33);
  for (const sx of [-1, 1]) {
    X.save(); X.translate(sx * ex, ey);
    if (blink || c.eyes === 'closed') { X.beginPath(); X.arc(0, 0, erx * .8, .2, Math.PI - .2); X.strokeStyle = '#2a1a14'; X.lineWidth = 5; X.stroke(); }
    else {
      ell(0, 0, erx, ery, '#fff'); X.save(); X.clip(); ell(0, ery * .95, erx * 1.1, ery * .45, '#e6e3ea');
      const px = gl * erx * .38, py = R * .04, pr = R * (c.kid ? .1 : .085);
      ell(px, py, pr, pr * 1.05, '#1a1412'); ell(px - pr * .35, py - pr * .4, pr * .38, pr * .38, '#fff');
      if (mood === 'angry') { X.rotate(sx * -.45); box(-erx * 1.5, -ery * 2.2, erx * 3, ery * 1.75, sk(-.04)); }
      if (mood === 'sad' || mood === 'worried') { X.rotate(sx * .4); box(-erx * 1.5, -ery * 2.3, erx * 3, ery * 1.75, sk(-.04)); }
      if (c.sleepy) box(-erx * 1.5, -ery * 1.5, erx * 3, ery * 1.4, sk(-.04));
      X.restore();
      ell(0, 0, erx, ery); X.strokeStyle = 'rgba(60,40,30,.45)'; X.lineWidth = 3; X.stroke();
    }
    X.restore();
  }
  if (c.mask) { for (const sx of [-1, 1]) { box(sx * ex - erx * 1.1, ey - ery * .5, erx * 2.2, ery * .9, '#1a1a1a', 10); } }
  // brows
  const ba = mood === 'angry' ? .45 : mood === 'sad' || mood === 'worried' ? -.4 : mood === 'happy' ? -.1 : .05;
  const raise = speaking && hash(Math.floor(t * 3) + id) > .75 ? R * .08 : 0;
  for (const sx of [-1, 1]) { X.save(); X.translate(sx * ex, ey - ery - R * .14 - raise); X.rotate(sx * ba); rr(-R * .24, -R * .055, R * .48, R * .11, R * .055); X.fillStyle = c.brows || hex(hairC, -.25); X.fill(); X.restore(); }
  // nose
  X.beginPath(); X.arc(R * .02, R * .3, R * .1, -.2, Math.PI * .9); X.strokeStyle = sk(-.25); X.lineWidth = 3.5; X.lineCap = 'round'; X.stroke();
  // mustache
  if (beard) { X.fillStyle = hex(beard, -.08); X.beginPath(); X.moveTo(0, R * .44); X.quadraticCurveTo(-R * .35, R * .32, -R * .5, R * .6); X.quadraticCurveTo(-R * .2, R * .52, 0, R * .56); X.quadraticCurveTo(R * .2, R * .52, R * .5, R * .6); X.quadraticCurveTo(R * .35, R * .32, 0, R * .44); X.fill(); }
  // mouth — viseme swaps at ~10/s (choppy lip flap)
  const my = R * .64;
  if (c.mask) { box(-R * .3, my - R * .1, R * .6, R * .18, '#1a1a1a', 4); for (let i = -2; i <= 2; i++) box(i * R * .11 - 3, my - R * .08, 6, R * .14, '#cfd3d8'); }
  else if (speaking) {
    const v = Math.floor(hash(Math.floor(t * 10) * 7.3 + id) * 5), sh = [[.16, .02], [.15, .1], [.2, .17], [.11, .15], [.21, .09]][v];
    if (v === 0) line(-R * sh[0], my, R * sh[0], my, '#3b1a16', 5);
    else { X.beginPath(); X.ellipse(0, my, R * sh[0], R * sh[1], 0, 0, 7); X.fillStyle = '#3b1512'; X.fill(); X.save(); X.clip(); ell(0, my + R * sh[1], R * sh[0] * .7, R * sh[1] * .6, '#c4564f'); if (v !== 3) box(-R * sh[0], my - R * sh[1], R * sh[0] * 2, R * sh[1] * .5, '#fff'); X.restore(); }
  } else if (mood === 'angry') { box(-R * .24, my - R * .08, R * .48, R * .17, '#fff', 5); X.strokeStyle = '#3b1a16'; X.lineWidth = 3; rr(-R * .24, my - R * .08, R * .48, R * .17, 5); X.stroke(); line(-R * .24, my, R * .24, my, '#3b1a16', 2); for (let i = -2; i <= 2; i++) line(i * R * .08, my - R * .08, i * R * .08, my + R * .09, '#3b1a16', 2); }
  else if (mood === 'happy') { X.beginPath(); X.moveTo(-R * .22, my - R * .04); X.quadraticCurveTo(0, my + R * .28, R * .22, my - R * .04); X.closePath(); X.fillStyle = '#3b1512'; X.fill(); box(-R * .2, my - R * .05, R * .4, R * .06, '#fff', 3); }
  else { const cv = mood === 'sad' || mood === 'worried' ? -R * .08 : R * .02; X.beginPath(); X.moveTo(-R * .14, my); X.quadraticCurveTo(0, my + cv, R * .14, my - R * .01); X.strokeStyle = '#3b1a16'; X.lineWidth = 4.5; X.stroke(); }
  // hair
  const hd = hex(hairC, -.2), hl = hex(hairC, .18);
  if (!hat || hat === 'scarf' || hat === 'crown') {
    // hair cap: always covers the skull top so no forehead/scalp peeks above the hair
    if (style !== 'bald' && style !== 'none') { X.save(); headShape(R * 1.04); X.clip(); box(-R * 1.2, -R * 1.2, R * 2.4, R * .62, style === 'curly' ? hd : hairC); X.restore(); }
    if (style === 'bald') { for (const sx of [-1, 1]) { X.beginPath(); X.ellipse(sx * R * .86, R * .02, R * .17, R * .34, sx * .2, 0, 7); X.fillStyle = hairC; X.fill(); } }
    else if (style === 'swept') { X.beginPath(); X.moveTo(-R * .98, R * .1); X.bezierCurveTo(-R * 1.15, -R * 1.2, R * .2, -R * 1.5, R * .9, -R * .8); X.quadraticCurveTo(R * 1.15, -R * .3, R * .98, R * .15); X.quadraticCurveTo(R * .7, -R * .55, R * .1, -R * .62); X.quadraticCurveTo(-R * .6, -R * .6, -R * .98, R * .1); X.fillStyle = hairC; X.fill(); X.save(); X.clip(); X.strokeStyle = hd; X.lineWidth = 4; for (let i = 0; i < 6; i++) { X.beginPath(); X.moveTo(-R * .8 + i * R * .3, -R * .55); X.quadraticCurveTo(-R * .4 + i * R * .25, -R * 1.2, R * .3 + i * R * .2, -R * 1.1); X.stroke(); } X.restore(); }
    else if (style === 'curly') { for (let i = 0; i < 11; i++) { const a = Math.PI * (1.02 + i * .1); ell(Math.cos(a) * R * .92, Math.sin(a) * R * .92 - R * .1, R * .3, R * .28, i % 2 ? hairC : hd); } }
    else if (style !== 'none') { X.beginPath(); X.moveTo(-R * .99, R * .12); X.bezierCurveTo(-R * 1.12, -R * 1.25, R * 1.12, -R * 1.35, R * .99, R * .1); X.quadraticCurveTo(R * .9, -R * .5, R * .45, -R * .58); X.quadraticCurveTo(R * .15, -R * .4, -R * .1, -R * .6); X.quadraticCurveTo(-R * .5, -R * .45, -R * .8, -R * .45); X.quadraticCurveTo(-R * .95, -R * .2, -R * .99, R * .12); X.fillStyle = hairC; X.fill(); X.save(); X.clip(); ell(R * .7, -R * .4, R * .55, R, hd); X.strokeStyle = hl; X.lineWidth = 4; X.lineCap = 'round'; for (let i = 0; i < 3; i++) { X.beginPath(); X.moveTo(-R * .5 + i * R * .32, -R * 1.0); X.quadraticCurveTo(-R * .35 + i * R * .32, -R * .85, -R * .2 + i * R * .32, -R * .72); X.stroke(); } X.restore(); }
    if (style === 'bun') ell(0, -R * 1.12, R * .38, R * .32, hairC);
  }
  if (hat === 'helmet') { const hc = c.helmetColor || '#a9b0ba'; X.beginPath(); X.arc(0, -R * .15, R * 1.06, Math.PI * 1.05, Math.PI * 1.95); X.closePath(); X.fillStyle = lin(-R, 0, R, 0, [hex(hc, .2), hc, hex(hc, -.3)]); X.fill(); box(-R * 1.12, -R * .32, R * 2.24, R * .2, hex(hc, -.15), 8); for (let i = 0; i < 7; i++) ell(-R * .9 + i * R * .3, -R * .22, 3.5, 3.5, hex(hc, -.4)); box(-R * .05, -R * 1.05, R * .1, R * .75, hex(hc, .3)); ell(-R * .45, -R * .7, R * .18, R * .08, 'rgba(255,255,255,.4)', -.5); }
  if (hat === 'scarf') { const sc2 = c.scarf || '#2e5a9a'; X.beginPath(); X.moveTo(-R * 1.02, -R * .1); X.bezierCurveTo(-R * 1.1, -R * 1.25, R * 1.1, -R * 1.25, R * 1.02, -R * .1); X.quadraticCurveTo(0, -R * .55, -R * 1.02, -R * .1); X.fillStyle = sc2; X.fill(); box(-R * 1.0, -R * .3, R * 2.0, R * .16, hex(sc2, -.15), 8); ell(R * 1.0, -R * .2, R * .16, R * .12, hex(sc2, -.2)); X.beginPath(); X.moveTo(R * 1.02, -R * .16); X.lineTo(R * 1.3, R * .25); X.lineTo(R * 1.1, R * .28); X.closePath(); X.fill(); for (let i = 0; i < 5; i++) ell(-R * .6 + i * R * .3, -R * .75, 5, 5, 'rgba(255,255,255,.5)'); }
  if (hat === 'crown') { X.beginPath(); X.moveTo(-R * .62, -R * .78); for (let i = 0; i <= 4; i++) { X.lineTo(-R * .62 + i * R * .31, -R * (i % 2 ? 1.05 : 1.32)); } X.lineTo(R * .62, -R * .78); X.closePath(); X.fillStyle = '#e8b923'; X.fill(); box(-R * .66, -R * .86, R * 1.32, R * .14, '#c9961e', 4); ell(0, -R * .79, 7, 7, '#c0304a'); }
  if (hat === 'cap') { X.beginPath(); X.arc(0, -R * .3, R * .98, Math.PI, 0); X.closePath(); X.fillStyle = c.capColor || '#5a3a24'; X.fill(); box(-R * 1.05, -R * .36, R * 2.1, R * .14, hex(c.capColor || '#5a3a24', -.2), 6); }
  if (c.glasses) { const gc = c.glasses === true ? '#2a2a2a' : c.glasses; X.lineWidth = 6; X.strokeStyle = gc; for (const sx of [-1, 1]) { X.beginPath(); X.ellipse(sx * ex, ey, erx * 1.2, ery * 1.12, 0, 0, 7); X.stroke(); } line(-ex + erx * 1.2, ey, ex - erx * 1.2, ey, gc, 5); }
}

// ---------- METAL: custom robot rig (cast option `metal`) ----------
const MD = { legH: 118, bodyH: 104, bw: 96, R: 120, arm: 60 };
function fs(fill, w = 5, st = '#0d1230') { X.fillStyle = fill; X.fill(); X.lineJoin = 'round'; X.strokeStyle = st; X.lineWidth = w; X.stroke(); }
function screw(x, y, r) { ell(x, y, r, r); fs(lin(x - r, y - r, x + r, y + r, ['#f4f6fa', '#9aa3b2']), 3); line(x - r * .6, y - r * .3, x + r * .6, y + r * .3, '#5a6272', 3); }
function drawMetal(c, t, speaking, close) {
  const s = c._s || (c.size || 1), x = c.x * W, y = c._y ?? (c.y || .88) * H, id = c.x * 91 + 3;
  const B = c.metalColor || '#2b55c8', BD = hex(B, -.35), BL = hex(B, .3), SIL = '#c9d0dc', SILD = '#7d8697';
  const { legH, bodyH, bw, R } = MD, shY = -legH - bodyH, hipY = -legH;
  const beat = Math.floor(t / (speaking ? .7 : 2.2) + hash(id));
  const pname = c.pose && !speaking ? c.pose : speaking ? TALK[Math.floor(hash(beat * 1.9 + id) * TALK.length)] : IDLE[Math.floor(hash(beat * 1.3 + id) * IDLE.length)];
  const [ru, rf, lu, lf] = POSES[pname] || POSES.rest;
  const tilt = (hash(beat * 3.7 + id) - .5) * (speaking ? .14 : .05), hover = c.fly ? Math.sin(t * 3) * 10 - 40 : 0;
  X.save(); X.translate(x, y); X.scale(s * (c.flip ? -1 : 1), s);
  ell(0, 0, bw * .9, 16, 'rgba(20,15,30,.3)');
  X.translate(0, hover);
  if (c.cape) { X.beginPath(); X.moveTo(-bw * .5, shY + 8); X.lineTo(bw * .5, shY + 8); X.lineTo(bw * .9, -10); X.lineTo(-bw * .9, -10); X.closePath(); fs(hex(c.cape, -.15)); }
  // legs: silver thigh rods, ball knees, blue shins, big red shoes
  for (const sx of [-1, 1]) {
    const dk = sx < 0, kx = sx * 24, ky = hipY + legH * .45;
    X.lineCap = 'round'; line(sx * 20, hipY, kx, ky, '#0d1230', 18); line(sx * 20, hipY, kx, ky, dk ? SILD : SIL, 11);
    X.beginPath(); X.moveTo(kx - 17, ky); X.lineTo(kx + 17, ky); X.lineTo(kx + 13, -30); X.lineTo(kx - 13, -30); X.closePath(); fs(dk ? BD : B);
    ell(kx, ky, 14, 14); fs(dk ? SILD : SIL, 4);
    const fx = kx + 16; box(fx - 30, -40, 44, 14, SIL, 5); X.strokeStyle = '#0d1230'; X.lineWidth = 4; X.stroke();
    X.beginPath(); X.moveTo(fx - 42, -4); X.quadraticCurveTo(fx - 46, -40, fx - 10, -36); X.quadraticCurveTo(fx + 44, -34, fx + 50, -8); X.quadraticCurveTo(fx + 50, 2, fx + 38, 2); X.lineTo(fx - 38, 2); X.closePath(); fs(dk ? '#a51c2a' : '#d82b3a');
    X.save(); X.clip(); box(fx - 8, -42, 18, 46, '#f4f2ee'); box(fx - 50, -8, 110, 12, dk ? '#6a1018' : '#8c1622'); ell(fx + 18, -26, 14, 5, 'rgba(255,255,255,.35)'); X.restore();
  }
  X.save(); X.translate(0, hipY); X.rotate(tilt * .3); X.translate(0, -hipY);
  // torso + pelvis
  box(-bw * .3, hipY - 16, bw * .6, 28, SILD, 10); X.strokeStyle = '#0d1230'; X.lineWidth = 4; X.stroke();
  X.beginPath(); X.moveTo(-bw / 2, shY + 18); X.quadraticCurveTo(-bw / 2, shY, -bw / 2 + 22, shY); X.lineTo(bw / 2 - 22, shY); X.quadraticCurveTo(bw / 2, shY, bw / 2, shY + 18); X.lineTo(bw * .34, hipY - 6); X.quadraticCurveTo(0, hipY + 10, -bw * .34, hipY - 6); X.closePath(); fs(lin(-bw / 2, 0, bw / 2, 0, [BL, B, BD]));
  // chest jet engine
  const ey = shY + bodyH * .42, er = 34, glow = speaking ? .7 + .3 * Math.sin(t * 20) : .55;
  ell(0, ey, er, er); fs('#f2b928', 5); ell(0, ey, er * .72, er * .72, '#2a160e');
  X.save(); X.translate(0, ey); X.rotate(t * 9); for (let i = 0; i < 8; i++) { X.rotate(Math.PI / 4); X.beginPath(); X.moveTo(0, 0); X.lineTo(er * .68, -6); X.lineTo(er * .68, 6); X.closePath(); X.fillStyle = '#d0601e'; X.fill(); } X.restore();
  ell(0, ey, er * .3, er * .3, `rgba(255,${120 + glow * 100 | 0},40,${glow})`); ell(0, ey, er * .14, er * .14, '#1a0c08');
  // arms: silver rods, ball joints, blue forearms, yellow cuff, claws
  const L = MD.arm;
  const arm = (sx, u, f) => {
    X.save(); X.translate(sx * (bw / 2 - 4), shY + 16); X.rotate(sx * u); X.lineCap = 'round';
    line(0, 0, 0, L, '#0d1230', 16); line(0, 0, 0, L, sx > 0 ? SILD : SIL, 9);
    X.translate(0, L); X.rotate(sx * f);
    X.beginPath(); X.moveTo(-14, 4); X.lineTo(14, 4); X.lineTo(10, L * .85); X.lineTo(-10, L * .85); X.closePath(); fs(sx > 0 ? BD : B);
    ell(0, 0, 13, 13); fs(SIL, 4);
    box(-15, L * .8, 30, 14, '#f2b928', 4); X.strokeStyle = '#0d1230'; X.lineWidth = 3; X.stroke();
    const hy = L * .8 + 22; ell(0, hy, 15, 13); fs(SIL, 4);
    for (let k = 0; k < 3; k++) { const a = -.45 + k * .45; X.save(); X.translate(Math.sin(a) * 10, hy + 6); X.rotate(-a); line(0, 0, 0, 30, '#0d1230', 9); line(0, 0, 0, 30, SIL, 5); ell(0, 15, 5, 5, SILD); X.beginPath(); X.moveTo(-4, 30); X.lineTo(4, 30); X.lineTo(0, 40); X.closePath(); fs('#e8ecf2', 2); X.restore(); }
    X.save(); X.translate(-sx * 14, hy); X.rotate(sx * .9); line(0, 0, 0, 22, '#0d1230', 9); line(0, 0, 0, 22, SIL, 5); X.restore();
    X.restore();
  };
  // shoulders behind head-neck
  arm(-1, lu, lf);
  // neck collar
  box(-bw * .36, shY - 16, bw * .72, 26, SIL, 12); X.strokeStyle = '#0d1230'; X.lineWidth = 4; X.stroke(); screw(-bw * .26, shY - 3, 7); screw(bw * .26, shY - 3, 7);
  for (const sx of [-1, 1]) { ell(sx * bw / 2, shY + 12, 20, 18); fs(sx < 0 ? B : BD); }
  // ---- head ----
  X.save(); X.translate(0, shY - R * .8); X.rotate(tilt); metalHead(c, t, speaking, R, B, BD, BL, SIL, SILD, id); X.restore();
  arm(1, ru, rf);
  X.restore(); X.restore();
}
function metalHead(c, t, speaking, R, B, BD, BL, SIL, SILD, id) {
  // back quills (sweep back-left; faces right)
  const quill = (bx, by, tx, ty, w, col) => { X.beginPath(); X.moveTo(bx, by - w); X.quadraticCurveTo((bx + tx) / 2, (by + ty) / 2 - w * .9, tx, ty); X.quadraticCurveTo((bx + tx) / 2, (by + ty) / 2 + w * .5, bx, by + w); X.closePath(); fs(col); };
  quill(-R * .3, R * .45, -R * 1.7, R * 1.0, R * .45, BD);
  quill(-R * .3, R * .02, -R * 2.15, R * .15, R * .55, hex(B, -.2));
  quill(-R * .2, -R * .4, -R * 2.05, -R * .85, R * .55, B);
  quill(R * .05, -R * .65, -R * 1.2, -R * 1.75, R * .5, BL);
  // ears
  const ear = (bx, tx, ty, col) => { X.beginPath(); X.moveTo(bx - R * .3, -R * .6); X.lineTo(tx, ty); X.lineTo(bx + R * .3, -R * .7); X.closePath(); fs(col); X.beginPath(); X.moveTo(bx - R * .16, -R * .68); X.lineTo(tx + R * .02, ty + R * .22); X.lineTo(bx + R * .16, -R * .74); X.closePath(); X.fillStyle = '#f2b440'; X.fill(); };
  ear(-R * .05, -R * .05, -R * 1.5, BD); ear(R * .5, R * .62, -R * 1.42, B);
  // dome
  ell(0, 0, R, R * .98); fs(lin(-R, -R, R, R, [BL, B, BD]), 6);
  ell(-R * .35, -R * .55, R * .35, R * .18, 'rgba(255,255,255,.28)', -.5);
  // black visor: top edge slants down toward the snout (angry brow)
  X.beginPath(); X.moveTo(-R * .22, R * .05); X.quadraticCurveTo(-R * .25, -R * .42, R * .05, -R * .44); X.lineTo(R * .97, -R * .06); X.quadraticCurveTo(R * 1.05, R * .3, R * .85, R * .42); X.lineTo(-R * .05, R * .42); X.quadraticCurveTo(-R * .26, R * .3, -R * .22, R * .05); X.closePath(); fs('#07080f', 5);
  const on = speaking ? (hash(Math.floor(t * 10) + id) > .3 ? 1 : .7) : (Math.floor(t * 2.3 + id) % 9 === 0 ? .4 : 1);
  X.save(); X.shadowColor = '#ff1a1a'; X.shadowBlur = 34 * on;
  for (const [ex, ey, rx, ry] of [[R * .2, R * .06, R * .16, R * .24], [R * .7, R * .12, R * .1, R * .18]]) {
    X.save(); X.beginPath(); X.moveTo(ex - rx * 1.6, ey - ry * .35 - (ex - rx * 1.6) * .38 + ex * .38); X.lineTo(ex + rx * 1.6, ey - ry * .35 - (ex + rx * 1.6) * .38 + ex * .38 + R * .02); X.lineTo(ex + rx * 2, ey + ry * 2); X.lineTo(ex - rx * 2, ey + ry * 2); X.closePath(); X.clip();
    ell(ex, ey, rx, ry, `rgba(255,36,28,${on})`); ell(ex, ey, rx * .62, ry * .66, '#2a0606'); ell(ex, ey, rx * .34, ry * .4, `rgba(255,110,70,${on})`); X.restore();
  }
  X.restore();
  // silver muzzle + pointed nose + cheek screw
  X.beginPath(); X.moveTo(-R * .05, R * .38); X.quadraticCurveTo(R * .4, R * .28, R * .9, R * .36); X.quadraticCurveTo(R * 1.15, R * .38, R * 1.22, R * .5); X.quadraticCurveTo(R * 1.12, R * .7, R * .8, R * .8); X.quadraticCurveTo(R * .3, R * .98, -R * .02, R * .72); X.quadraticCurveTo(-R * .2, R * .55, -R * .05, R * .38); X.closePath(); fs(lin(0, R * .3, 0, R * .9, ['#f2f4f8', SIL, SILD]), 5);
  line(R * .5, R * .66, R * .95, R * .6, 'rgba(13,18,48,.5)', 3);
  screw(R * .08, R * .52, R * .1);
}
