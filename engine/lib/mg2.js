// Motion-graphics pack 2: form unlocks, dossiers, orbit maps, Chaos Control, quote cards, inhibitor rings, gauges, chapter cards, particle FX.
const MGACC = { red: ['#e0122e', '#ff5a3a'], gold: ['#f2b928', '#fff0a0'], blue: ['#1e5aff', '#7ad0ff'], purple: ['#7c3aed', '#e879f9'], green: ['#16a34a', '#86efac'] };
const acc = sc => MGACC[sc.accent] || MGACC.red;
function txt(s, x, y, size, col, align = 'left', w = 700, stroke = 0) {
  X.font = `${w} ${size}px ${FONT}`; X.textAlign = align; X.textBaseline = 'middle'; X.lineJoin = 'round';
  if (stroke) { X.strokeStyle = '#000'; X.lineWidth = stroke; X.strokeText(s, x, y); } X.fillStyle = col; X.fillText(s, x, y); X.textAlign = 'left';
}
function techBg(sc, t, c1) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = rad(W * .35, H * .5, 0, W * .9, [hex(c1, -.55), '#07070d']); X.fillRect(0, 0, W, H);
  X.strokeStyle = 'rgba(255,255,255,.05)'; X.lineWidth = 2; const s = 70, off = (t * 20) % s;
  for (let x = -s; x < W + s; x += s) { X.beginPath(); X.moveTo(x + off, 0); X.lineTo(x + off, H); X.stroke(); }
  for (let y = -s; y < H + s; y += s) { X.beginPath(); X.moveTo(0, y + off); X.lineTo(W, y + off); X.stroke(); }
  for (let i = 0; i < 40; i++) { const R = rng(i + 3), x = R() * W, y = (R() * H - t * (20 + R() * 40)) % H; ell(x, (y + H) % H, 2, 2, `rgba(255,255,255,${.1 + R() * .25})`); }
}
// ---------- FORM UNLOCKED ----------
function bgForm(sc, t) {
  const lt = LT, [c1, c2] = acc(sc), n = +sc.form || 1, tot = +sc.forms || 6; techBg(sc, t, c1);
  X.save(); X.translate(W * .3, H * .5); X.rotate(t * .25); for (let i = 0; i < 18; i++) { X.rotate(Math.PI / 9); X.beginPath(); X.moveTo(0, 0); X.lineTo(-60, -1400); X.lineTo(60, -1400); X.closePath(); X.fillStyle = `rgba(${i % 2 ? '255,255,255' : '0,0,0'},.05)`; X.fill(); } X.restore();
  glowC(W * .3, H * .5, 520, c1 === '#f2b928' ? '255,210,80' : '255,50,60', .45 + .1 * Math.sin(t * 4));
  const k = back(Math.min(1, lt / .45)); X.save(); X.translate(W * .3, H * .62); X.scale(k, k); X.translate(-W * .3, -H * .62);
  outlined(() => heroAt(sc.hero || 'shadow', W * .27, H * .98, 1.3, t, sc.mood || 'angry', false), 10); X.restore();
  // header
  const hk = expo(lt / .4); X.globalAlpha = hk; txt(`FORM ${n}`, W * .56, H * .2 - (1 - hk) * 40, 64, c2, 'left', 700); X.globalAlpha = 1;
  const nm = String(sc.fname || 'UNKNOWN').toUpperCase(); X.font = `700 136px ${FONT}`; const sz = Math.min(136, 136 * W * .4 / X.measureText(nm).width), nk = Math.min(1, Math.max(0, (lt - .2) / .3));
  X.save(); X.translate(W * .56, H * .33); X.scale(1 + (1 - nk) * .6, 1 + (1 - nk) * .6); X.globalAlpha = nk; txt(nm, 0, 0, sz, '#fff', 'left', 700, 22); X.restore();
  if (sc.sub) { X.globalAlpha = expo((lt - .5) / .4); txt(sc.sub, W * .56, H * .44, 40, 'rgba(255,255,255,.8)', 'left', 600); X.globalAlpha = 1; }
  // stat bars
  String(sc.bars || 'SPEED:60,POWER:50,CHAOS:40').split(',').forEach((b, i) => {
    const [lab, v] = b.split(':'), y = H * .54 + i * 92, bk = expo((lt - .7 - i * .15) / .8), w = W * .34;
    txt(lab.trim(), W * .56, y, 34, 'rgba(255,255,255,.85)', 'left', 700); box(W * .56, y + 26, w, 26, 'rgba(255,255,255,.12)', 13);
    const fw = w * Math.min(1, (+v || 0) / 100) * bk; X.fillStyle = lin(W * .56, 0, W * .56 + w, 0, [c1, c2]); X.beginPath(); X.roundRect(W * .56, y + 26, Math.max(26, fw), 26, 13); X.fill();
    if (+v > 100 && bk > .95) { txt('MAX+', W * .56 + w + 20, y + 40, 34, c2, 'left', 700); }
  });
  // tracker
  box(0, H * .8, W, H * .2, 'rgba(5,5,12,.82)'); const tx0 = W * .1, tx1 = W * .9, ty = H * .9, labels = String(sc.track || '').split('|');
  line(tx0, ty, tx1, ty, 'rgba(255,255,255,.18)', 6); line(tx0, ty, tx0 + (tx1 - tx0) * ((n - 1) / (tot - 1)) * expo(lt / 1), ty, c2, 6);
  for (let i = 0; i < tot; i++) { const x = tx0 + (tx1 - tx0) * i / (tot - 1), on = i < n, cur = i === n - 1; if (cur) glowC(x, ty, 60, '255,220,120', .5 + .3 * Math.sin(t * 6)); ell(x, ty, cur ? 20 : 14, cur ? 20 : 14, on ? (cur ? '#fff' : c2) : '#2a2a36'); if (labels[i]) txt(i < n ? labels[i] : '???', x, ty - 46, 30, on ? '#fff' : 'rgba(255,255,255,.35)', 'center', 700); }
  if (lt < .5) { const s = 1 + (1 - lt / .5) * .3; X.save(); X.globalAlpha = 1 - lt / .5; X.translate(W / 2, H / 2); X.scale(s, s); txt('FORM UNLOCKED', 0, 0, 150, '#fff', 'center', 700, 30); X.restore(); }
}
// ---------- DOSSIER ----------
function bgDossier(sc, t) {
  const lt = LT, [c1, c2] = acc(sc); techBg(sc, t, '#1e3a8a');
  const k = expo(lt / .45), fx = W * .1, fy = H * .14 + (1 - k) * 200, fw = W * .8, fh = H * .72; X.globalAlpha = k;
  box(fx + 14, fy + 18, fw, fh, 'rgba(0,0,0,.4)', 18); box(fx + 40, fy - 50, 340, 70, '#c9a86a', 14); box(fx, fy, fw, fh, '#d9bd84', 18); box(fx + 24, fy + 24, fw - 48, fh - 48, '#efe3c4', 10);
  txt('FILE #' + String(1000 + (sc.idx || 0) * 37).slice(-4), fx + 70, fy - 16, 30, '#5a4520', 'left', 700);
  const px = fx + 70, py = fy + 70, pw = fw * .32, ph = fh - 140; box(px - 10, py - 10, pw + 20, ph + 20, '#fff', 6);
  X.save(); X.beginPath(); X.rect(px, py, pw, ph); X.clip(); X.fillStyle = lin(0, py, 0, py + ph, [hex(c1, -.3), hex(c1, -.65)]); X.fillRect(px, py, pw, ph);
  for (let y = py; y < py + ph; y += 40) line(px, y, px + pw, y, 'rgba(255,255,255,.06)', 2);
  if (sc.hero === 'none') { X.fillStyle = 'rgba(0,0,0,.55)'; X.beginPath(); X.ellipse(px + pw / 2, py + ph * .42, pw * .26, pw * .3, 0, 0, 7); X.fill(); X.beginPath(); X.ellipse(px + pw / 2, py + ph * 1.02, pw * .45, ph * .38, 0, 0, 7); X.fill(); txt('?', px + pw / 2, py + ph * .44, 200, 'rgba(255,255,255,.85)', 'center', 700); } else {} const hum = sc.hero === 'gerald' || sc.hero === 'maria' || sc.hero === 'doctor'; if (sc.hero !== 'none') heroAt(sc.hero || 'shadow', px + pw / 2, py + ph * (hum ? 1.12 : 1.2), hum ? 1.3 : 1.25, t, sc.mood, false); X.restore();
  const tx = px + pw + 70; txt(String(sc.name || '').toUpperCase(), tx, fy + 110, 92, '#1a1a1a', 'left', 700);
  line(tx, fy + 170, fx + fw - 70, fy + 170, '#1a1a1a', 4);
  String(sc.fields || '').split('|').filter(Boolean).forEach((f, i) => {
    const [a, b = ''] = f.split(':'), age = lt - .5 - i * .45; if (age < 0) return; const ch = Math.floor(Math.min(1, age / .5) * b.length), y = fy + 240 + i * 82;
    txt(a.trim().toUpperCase(), tx, y, 30, '#8a6a30', 'left', 700); txt(b.trim().slice(0, ch) + (ch < b.trim().length && Math.floor(t * 6) % 2 ? '|' : ''), tx + 300, y, 40, '#1a1a1a', 'left', 600);
  });
  X.globalAlpha = 1;
  if (sc.stamp) { const sa = lt - (sc.stampAt ? +sc.stampAt : 1.6); if (sa > 0) { const s = sa < .15 ? 2.2 - 1.2 * sa / .15 : 1; X.save(); X.translate(fx + fw - 330, fy + fh - 130); X.rotate(-.18); X.scale(s, s); X.globalAlpha = Math.min(1, sa / .1) * .9; X.strokeStyle = c1; X.lineWidth = 12; X.font = `700 96px ${FONT}`; const sw = X.measureText(sc.stamp).width + 60; X.strokeRect(-sw / 2, -70, sw, 140); txt(String(sc.stamp), 0, 4, 96, c1, 'center', 700); X.restore(); } }
}
// ---------- ORBIT MAP ----------
function arkIcon(x, y, s, t) { X.save(); X.translate(x, y); X.scale(s, s); ell(0, 0, 60, 60, '#9aa3b2'); X.beginPath(); X.arc(0, 0, 60, Math.PI * .1, Math.PI * .9); X.fillStyle = '#5a6272'; X.fill(); box(-110, -6, 220, 12, '#7a8392', 6); ell(0, 0, 22, 22, '#2a2f3a'); ell(0, 0, 10, 10, `rgba(120,255,150,${.5 + .5 * Math.sin(t * 5)})`); X.restore(); }
function tag(s, x, y, col = '#fff') { X.font = `700 34px ${FONT}`; const w = X.measureText(s).width + 36; box(x - w / 2, y - 26, w, 52, 'rgba(0,0,0,.65)', 26); txt(s, x, y + 2, 34, col, 'center', 700); }
function bgOrbit(sc, t) {
  const lt = LT, mode = sc.mode || 'ark'; X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = '#03040c'; X.fillRect(0, 0, W, H); stars(sc.seed, 260, t, H);
  const z = 1 + lt * .03, ex = W * .5, ey = H * .55; X.translate(W / 2, H / 2); X.scale(z, z); X.translate(-W / 2, -H / 2);
  earthBall(ex, ey, 230, t * 4); tag(mode === 'capsule' ? 'PRISON ISLAND' : 'EARTH', ex, ey + 290);
  const rx = 620, ry = 230; X.setLineDash([14, 14]); X.lineDashOffset = -t * 30; X.strokeStyle = 'rgba(160,200,255,.4)'; X.lineWidth = 4; X.beginPath(); X.ellipse(ex, ey, rx, ry, -.15, 0, 7); X.stroke(); X.setLineDash([]);
  if (mode !== 'comet') { moonBall(W * .87, H * .2, 70, !!sc.bite); tag('MOON', W * .87, H * .2 + 110); }
  const a = mode === 'ark' ? t * .25 : -2.4, ax = ex + Math.cos(a) * rx * Math.cos(.15) - Math.sin(a) * ry * Math.sin(-.15), ay = ey + Math.sin(a) * ry + Math.cos(a) * rx * Math.sin(-.15);
  if (mode === 'fall') { const k = expo(lt / (sc.dur * .9)), fx = ax + (ex - ax) * k * .6, fy = ay + (ey - ay) * k * .6; for (let i = 0; i < 10; i++) ell(fx - (fx - ax) * i / 10, fy - (fy - ay) * i / 10, 14 - i, 14 - i, `rgba(255,120,40,${.5 - i * .04})`); glowC(fx, fy, 160, '255,80,40', .6); arkIcon(fx, fy, .9, t); tag('IMPACT IN ' + Math.max(0, Math.ceil(27 - lt * 3)) + ' MIN', fx, fy - 120, '#ff6a5a'); }
  else { arkIcon(ax, ay, .9, t); tag('SPACE COLONY ARK', ax, ay - 110); }
  if (mode === 'capsule') { const k = Math.min(1, lt / (sc.dur * .85)), cx = ax + (ex + 120 - ax) * k, cy = ay + (ey - 160 - ay) * k - Math.sin(k * Math.PI) * 120; X.setLineDash([10, 12]); X.strokeStyle = 'rgba(255,90,90,.8)'; X.lineWidth = 5; X.beginPath(); X.moveTo(ax, ay); X.quadraticCurveTo((ax + ex) / 2, Math.min(ay, ey) - 200, ex + 120, ey - 160); X.stroke(); X.setLineDash([]); glowC(cx, cy, 80, '120,255,200', .7); box(cx - 16, cy - 28, 32, 56, '#bfefff', 16); }
  if (mode === 'comet') { const k = expo(lt / (sc.dur * .9)), cx = W * 1.1 - (W * 1.1 - W * .78) * k, cy = H * .1 + (H * .28 - H * .1) * k; for (let i = 0; i < 20; i++) ell(cx + i * 22, cy - i * 9, 40 - i * 1.6, 30 - i * 1.2, `rgba(200,30,60,${.35 - i * .015})`); ell(cx, cy, 60, 44, '#2a0e22'); ell(cx, cy, 20, 12, '#ffdf3a'); tag('BLACK COMET', cx, cy + 90, '#ff6a7a'); }
}
// ---------- CHAOS CONTROL (time freeze) ----------
function bgChaos(sc, t) {
  const lt = LT; X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = rad(W / 2, H / 2, 0, W * .8, ['#3a2a7a', '#120a2a', '#05030c']); X.fillRect(0, 0, W, H);
  const frz = lt > .5; X.save(); X.translate(W / 2, H * .45); const R = 430; X.globalAlpha = .55; X.strokeStyle = '#c8b8ff'; X.lineWidth = 8; X.beginPath(); X.arc(0, 0, R, 0, 7); X.stroke();
  for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, l = i % 5 ? 20 : 50; line(Math.cos(a) * (R - l), Math.sin(a) * (R - l), Math.cos(a) * R, Math.sin(a) * R, '#c8b8ff', i % 5 ? 3 : 7); }
  const sp = frz ? -Math.max(0, 1 - (lt - .5) / .6) * 30 : 30, ha = (frz ? .5 * 30 - (lt - .5) * 10 * Math.max(0, 1 - (lt - .5) / .6) : lt * sp);
  X.lineCap = 'round'; line(0, 0, Math.cos(ha) * R * .8, Math.sin(ha) * R * .8, '#fff', 12); line(0, 0, Math.cos(ha / 12) * R * .5, Math.sin(ha / 12) * R * .5, '#fff', 18); X.globalAlpha = 1; X.restore();
  for (let k = 0; k < 4; k++) { const r = ((lt * 700 + k * 380) % 1600); X.beginPath(); X.arc(W / 2, H * .55, r, 0, 7); X.strokeStyle = `rgba(160,255,190,${.5 * (1 - r / 1600)})`; X.lineWidth = 10; X.stroke(); }
  for (let i = 0; i < 26; i++) { const Rr = rng(i + 61), x = Rr() * W, y = Rr() * H * .8, drift = frz ? 0 : lt * 300; X.save(); X.translate(x + drift * (Rr() - .5), y + drift * .3); X.rotate(Rr() * 7 + (frz ? 0 : lt * 3)); box(-12 - Rr() * 20, -8, 24 + Rr() * 40, 16, `rgba(180,170,220,${.35 + Rr() * .3})`, 4); X.restore(); }
  outlined(() => heroAt(sc.hero || 'shadow', W / 2, H * 1.06, 1.6, frz ? 0 : t, 'angry', false), 10);
  glowC(W * .58, H * .62, 120, '80,255,140', .8 + .2 * Math.sin(t * 8)); gem(W * .58, H * .62, .55, '#3ad86a');
  X.fillStyle = `rgba(120,90,255,${frz ? .18 : .06})`; X.fillRect(0, 0, W, H);
  if (lt > .45 && lt < .62) { X.fillStyle = `rgba(255,255,255,${.8 * (1 - (lt - .45) / .17)})`; X.fillRect(0, 0, W, H); }
}
// ---------- QUOTE CARD (cinematic, quiet) ----------
function bgQuote(sc, t) {
  const lt = LT, q = String(sc.q || ''), sp = (sc.speech || sc.dur) * .85; X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = '#050507'; X.fillRect(0, 0, W, H);
  if (sc.hero && sc.ghost) { X.save(); X.globalAlpha = .22; X.translate(W * .78, 0); heroAt(sc.hero, 0, H * 1.25, 1.6, 0, sc.mood || 'sad', true); X.restore(); X.fillStyle = lin(W * .5, 0, W, 0, ['#050507', 'rgba(5,5,7,0)']); X.fillRect(W * .5, 0, W * .5, H); }
  for (let i = 0; i < 120; i++) { const R = rng(i + Math.floor(t * 12) * 131); ell(R() * W, R() * H, 1.4, 1.4, `rgba(255,255,255,${R() * .12})`); }
  X.font = `600 76px ${FONT}`; const words = q.split(' '), lines = []; let cur = '';
  words.forEach(w => { if (X.measureText(cur + ' ' + w).width > W * .62 && cur) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }); if (cur) lines.push(cur);
  const shown = Math.floor(Math.min(1, lt / sp) * q.length); let used = 0; const y0 = H * .46 - (lines.length - 1) * 50;
  if (q.trim()) txt('“', W * .12, y0 - 90, 200, acc(sc)[0], 'left', 700);
  lines.forEach((ln, i) => { const s = ln.slice(0, Math.max(0, shown - used)); used += ln.length + 1; txt(s, W * .16, y0 + i * 100, 76, '#f4f1ea', 'left', 600); });
  if (sc.who) { X.globalAlpha = expo((lt - sp) / .6); txt('— ' + String(sc.who).toUpperCase(), W * .16, y0 + lines.length * 100 + 40, 40, acc(sc)[1], 'left', 700); X.globalAlpha = 1; }
}
// ---------- INHIBITOR RINGS ----------
function bgRings(sc, t) {
  const lt = LT, off = +(sc.off ?? 1.8), gone = lt > off; burstBg(sc, t, gone ? '#e0122e' : '#2a2238', gone ? '#ffb02e' : '#4a3a6a'); X.setTransform(1, 0, 0, 1, 0, 0);
  X.save(); X.translate(W * .38, H * .62); X.rotate(-.45); const sh = gone ? Math.sin(t * 60) * 6 : 0; X.translate(sh, 0);
  box(-900, -110, 1100, 220, '#1f1c25', 110); box(-900, -40, 1100, 20, '#d8283a', 10); ell(250, 0, 170, 150, '#f4f2ee'); ell(300, -40, 70, 60, '#ffffff');
  if (!gone || lt < off + .05) { for (const dx of [80]) { ell(dx, 0, 46, 128, '#a87a12'); box(dx - 40, -128, 80, 256, '#f2b928', 30); for (let i = 0; i < 4; i++) line(dx - 30 + i * 20, -120, dx - 30 + i * 20, 120, 'rgba(255,255,255,.35)', 4); ell(dx + 40, 0, 20, 128, '#ffd85a'); } }
  else { const a = lt - off, rx = 80 + a * 1400, ry = -a * 900 + a * a * 1200; X.save(); X.translate(rx, ry); X.rotate(a * 14); box(-40, -128, 80, 256, '#f2b928', 30); X.restore(); for (let i = 0; i < 14; i++) { const ang = i / 14 * 7 + t * 3, r = 160 + (a * 900) % 500; line(80 + Math.cos(ang) * 60, Math.sin(ang) * 60, 80 + Math.cos(ang) * r, Math.sin(ang) * r, 'rgba(255,240,160,.8)', 8); } glowC(80, 0, 500, '255,220,120', .9); }
  X.restore();
  if (!gone) { const k = expo((lt - .3) / .4); X.globalAlpha = k; line(W * .43, H * .43, W * .55, H * .26, '#fff', 6); txt('INHIBITOR RING', W * .56, H * .24, 64, '#fff', 'left', 700, 16); X.globalAlpha = 1; }
  else { const k = back(Math.min(1, (lt - off) / .35)); X.save(); X.translate(W * .68, H * .3); X.scale(k, k); X.rotate(-.06); txt(sc.boom || 'LIMITS OFF', 0, 0, 130, '#fff', 'center', 700, 28); X.restore(); }
}
// ---------- GAUGE ----------
function bgMeter(sc, t) {
  const lt = LT, [c1, c2] = acc(sc); techBg(sc, t, c1); const cx = W / 2, cy = H * .64, R = 420, v = Math.min(1.12, (+sc.mval || 50) / 100);
  const k = lt < 1.2 ? expo(lt / 1.2) : 1, cur = v * k + (lt > 1.2 ? Math.sin(lt * 30) * .006 : 0), a0 = Math.PI, a1 = Math.PI * 2;
  X.lineCap = 'round'; X.strokeStyle = 'rgba(255,255,255,.12)'; X.lineWidth = 60; X.beginPath(); X.arc(cx, cy, R, a0, a1); X.stroke();
  X.strokeStyle = lin(cx - R, 0, cx + R, 0, ['#22d3ee', '#f2b928', c1]); X.beginPath(); X.arc(cx, cy, R, a0, a0 + Math.PI * Math.min(1, cur)); X.stroke();
  for (let i = 0; i <= 20; i++) { const a = a0 + Math.PI * i / 20; line(cx + Math.cos(a) * (R - 70), cy + Math.sin(a) * (R - 70), cx + Math.cos(a) * (R - (i % 5 ? 95 : 120)), cy + Math.sin(a) * (R - (i % 5 ? 95 : 120)), 'rgba(255,255,255,.6)', i % 5 ? 4 : 8); }
  const na = a0 + Math.PI * Math.min(1.05, cur); line(cx, cy, cx + Math.cos(na) * (R - 40), cy + Math.sin(na) * (R - 40), '#fff', 14); ell(cx, cy, 36, 36, '#fff'); ell(cx, cy, 18, 18, c1);
  if (cur > 1) { glowC(cx + R, cy, 260, '255,60,60', .7); txt('OVERLOAD', cx + R * .7, cy - R * .9, 54, '#ff5a5a', 'center', 700, 12); }
  txt(String(sc.mlabel || 'POWER').toUpperCase(), cx, cy - R - 90, 60, 'rgba(255,255,255,.85)', 'center', 700);
  X.globalAlpha = expo((lt - .5) / .5); txt(String(sc.mtext || ''), cx, cy + 170, 120, '#fff', 'center', 700, 24); X.globalAlpha = 1;
}
// ---------- CHAPTER CARD ----------
function bgChapcard(sc, t) {
  const lt = LT, [n, nm, tot] = String(sc.chap || '1|START|8').split('|'), [c1, c2] = acc(sc); X.setTransform(1, 0, 0, 1, 0, 0);
  X.fillStyle = '#07070d'; X.fillRect(0, 0, W, H);
  const k = expo(lt / .35); X.save(); X.beginPath(); X.moveTo(0, H * .62); X.lineTo(W * k, H * .38); X.lineTo(W * k, H * .52); X.lineTo(0, H * .76); X.closePath(); X.fillStyle = lin(0, 0, W, 0, [c1, c2]); X.fill(); X.restore();
  for (let i = 0; i < 50; i++) { const R = rng(i + 7), x = (R() * W + t * 200 * (R() + .2)) % W, y = R() * H; line(x, y, x - 120, y, 'rgba(255,255,255,.08)', 2); }
  const s1 = lt < .25 ? 2.4 - 1.4 * lt / .25 : 1; X.save(); X.translate(W * .1, H * .3); X.scale(s1, s1); X.globalAlpha = Math.min(1, lt / .15); txt('CHAPTER ' + n, 0, 0, 90, c2, 'left', 700); X.restore();
  const title = String(nm).toUpperCase(); X.font = `700 170px ${FONT}`; const fs = Math.min(170, 170 * W * .8 / X.measureText(title).width); X.font = `700 ${fs}px ${FONT}`; let x = W * .1;
  for (let i = 0; i < title.length; i++) { const ch = title[i], a = lt - .25 - i * .035, cw = X.measureText(ch).width; if (a > 0) { const kk = back(Math.min(1, a / .25)); X.save(); X.translate(x + cw / 2, H * .5); X.scale(kk, kk); txt(ch, 0, 0, fs, '#fff', 'center', 700, 26); X.restore(); } x += cw; }
  for (let i = 0; i < +tot; i++) { const on = i < +n; box(W * .1 + i * 70, H * .7, 50, 12, on ? c2 : 'rgba(255,255,255,.2)', 6); }
}
Object.assign(SW_WORLD, { form: bgForm, dossier: bgDossier, orbit: bgOrbit, chaos: bgChaos, quote: bgQuote, rings: bgRings, meter: bgMeter, chapcard: bgChapcard });
Object.assign(SW_BLOOM, { form: .3, dossier: .05, orbit: .35, chaos: .45, quote: 0, rings: .35, meter: .3, chapcard: .2 });
// ---------- particle FX overlay (`fx: chaos|embers|dust|rain|speed`) ----------
function drawFX(sc, t) {
  const kind = sc.fx; if (!kind) return; X.setTransform(1, 0, 0, 1, 0, 0);
  if (kind === 'chaos') { X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 60; i++) { const R = rng(i + 17), x = W * (.2 + R() * .6) + Math.sin(t * 2 + i) * 30, y = H - ((t * (120 + R() * 200) + R() * H) % H); ell(x, y, 3 + R() * 5, 3 + R() * 5, R() > .5 ? 'rgba(255,60,60,.8)' : 'rgba(255,220,90,.8)'); } const Rl = rng(Math.floor(t * 10)); for (let k = 0; k < 3; k++) { let x = W * (.35 + Rl() * .3), y = H * (.3 + Rl() * .4); X.beginPath(); X.moveTo(x, y); for (let s = 0; s < 6; s++) { x += (Rl() - .5) * 120; y += (Rl() - .5) * 120; X.lineTo(x, y); } X.strokeStyle = 'rgba(255,90,90,.7)'; X.lineWidth = 4; X.stroke(); } X.restore(); }
  if (kind === 'embers') { X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 70; i++) { const R = rng(i + 5), x = (R() * W + Math.sin(t + i) * 60), y = H - ((t * (60 + R() * 120) + R() * H) % H); ell(x, y, 2 + R() * 4, 2 + R() * 4, `rgba(255,${120 + R() * 100 | 0},40,${.5 + R() * .4})`); } X.restore(); }
  if (kind === 'dust') for (let i = 0; i < 60; i++) { const R = rng(i + 9), x = (R() * W + t * 20) % W, y = (R() * H + Math.sin(t * .5 + i) * 30); ell(x, y, 2 + R() * 2, 2 + R() * 2, `rgba(220,230,255,${.08 + R() * .15})`); }
  if (kind === 'rain') for (let i = 0; i < 140; i++) { const R = rng(i + 3), x = (R() * W * 1.2 + t * 300) % (W * 1.2) - W * .1, y = (R() * H + t * 1400) % H; line(x, y, x - 14, y + 44, 'rgba(180,200,255,.35)', 2); }
  if (kind === 'speed') { const R = rng(Math.floor(t * 12)); for (let i = 0; i < 30; i++) { const y = R() * H, x = R() * W, w = 200 + R() * 500; line(x, y, x + w, y, `rgba(255,255,255,${.1 + R() * .25})`, 2 + R() * 4); } }
}
