// FX pack 2: bosses (Devil Doom, Biolizard), Doom Wing wings, Chaos Spears, drones, baby Shadow, fight scenes,
// transitions, lower thirds, film post (grain, grade, light leaks).
const OL2 = '#120a16';
function poly(pts, fill, w = 6, st = OL2) { X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.closePath(); X.fillStyle = fill; X.fill(); if (w) { X.lineJoin = 'round'; X.strokeStyle = st; X.lineWidth = w; X.stroke(); } }
// ---------- DEVIL DOOM: horned many-eyed demon head ----------
function devilDoom(x, y, s, t, hurt) {
  X.save(); X.translate(x, y + Math.sin(t * 1.3) * 12 * s); X.scale(s, s);
  glowC(0, 0, 620, '255,30,60', .55);
  for (let i = 0; i < 8; i++) { const sx = i < 4 ? -1 : 1, k = i % 4, a = t * 1.6 + i; X.beginPath(); X.moveTo(sx * 200, 120 + k * 50); X.bezierCurveTo(sx * (380 + k * 40), 60 + k * 60 + Math.sin(a) * 60, sx * (460 + k * 30), 260 + k * 40 + Math.cos(a) * 70, sx * (560 + k * 50), 200 + k * 90 + Math.sin(a * 1.3) * 90); X.strokeStyle = OL2; X.lineWidth = 46 - k * 6; X.lineCap = 'round'; X.stroke(); X.strokeStyle = k % 2 ? '#4a1a3a' : '#3a1230'; X.lineWidth = 32 - k * 6; X.stroke(); }
  poly([[-420, 520], [-330, 180], [-250, 120], [250, 120], [330, 180], [420, 520]], '#24101e', 8);
  for (const sx of [-1, 1]) { X.beginPath(); X.moveTo(sx * 150, -200); X.bezierCurveTo(sx * 300, -360, sx * 420, -300, sx * 470, -520); X.bezierCurveTo(sx * 380, -330, sx * 280, -300, sx * 210, -130); X.closePath(); X.fillStyle = lin(0, -520, 0, -130, ['#e8dcc8', '#9a8aa8', '#5a4a6a']); X.fill(); X.strokeStyle = OL2; X.lineWidth = 8; X.stroke(); for (let k = 1; k < 5; k++) line(sx * (180 + k * 50), -180 - k * 60, sx * (200 + k * 55), -150 - k * 62, 'rgba(0,0,0,.3)', 5); }
  X.beginPath(); for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI, r = 300 + (i % 2 ? 40 : 0); X.lineTo(Math.cos(a) * r * 1.05, Math.sin(a) * r * .95 + 40); } X.lineTo(300, 200); X.quadraticCurveTo(0, 330, -300, 200); X.closePath();
  X.fillStyle = rad(-80, -120, 30, 420, ['#6a2a5a', '#3a1434', '#1a0816']); X.fill(); X.strokeStyle = OL2; X.lineWidth = 10; X.stroke();
  for (let i = 0; i < 6; i++) { const R = rng(i + 40); poly([[-260 + i * 100, -240 + R() * 30], [-230 + i * 100, -330 - R() * 60], [-200 + i * 100, -230]], '#4a1a40', 5); }
  const mo = .5 + .5 * Math.sin(t * 3); X.beginPath(); X.moveTo(-200, 120); X.quadraticCurveTo(0, 180 + mo * 60, 200, 120); X.quadraticCurveTo(0, 250 + mo * 90, -200, 120); X.fillStyle = '#ff5a1a'; X.fill(); glowC(0, 170, 220, '255,120,30', .7);
  for (let i = 0; i < 11; i++) { const tx = -180 + i * 36; poly([[tx, 125 + Math.abs(i - 5) * 4], [tx + 18, 175 + mo * 20], [tx + 36, 125 + Math.abs(i - 5) * 4]], '#f4ecd8', 3); }
  const eyes = [[0, -40, 70], [-150, -70, 42], [150, -70, 42], [-230, 10, 30], [230, 10, 30], [-90, -170, 28], [90, -170, 28], [0, -200, 24]];
  eyes.forEach(([ex, ey, r], i) => { const bl = hash(Math.floor(t * 3) + i * 7) > .93; ell(ex, ey, r * 1.25, r * (bl ? .15 : 1.05), OL2); if (!bl) { ell(ex, ey, r, r * .85, hurt ? '#ffffff' : '#ffd21a'); ell(ex + Math.sin(t + i) * r * .2, ey, r * .32, r * .7, '#c8001a'); glowC(ex, ey, r * 2.2, '255,200,40', .45); } });
  X.restore();
}
// ---------- BIOLIZARD ----------
function biolizard(x, y, s, t, hurt) {
  X.save(); X.translate(x, y); X.scale(s, s); const br = Math.sin(t * 2) * 8;
  glowC(0, -200, 520, '255,140,40', .3);
  X.beginPath(); X.moveTo(-520, 60); X.bezierCurveTo(-600, -120, -380, -300, -120, -280 - br); X.bezierCurveTo(140, -260, 300, -160, 330, 40); X.closePath(); X.fillStyle = lin(0, -300, 0, 60, [hurt ? '#ffffff' : '#d8642a', '#8a2a14', '#3a0e08']); X.fill(); X.strokeStyle = OL2; X.lineWidth = 10; X.stroke();
  for (let i = 0; i < 9; i++) { const R = rng(i + 3); ell(-420 + R() * 640, -220 + R() * 220, 18 + R() * 30, 12 + R() * 20, 'rgba(90,30,10,.55)'); }
  X.beginPath(); X.moveTo(150, -200); X.bezierCurveTo(300, -380, 360, -520 + br, 470, -560 + br); X.lineTo(560, -500 + br); X.bezierCurveTo(440, -420, 380, -260, 300, -60); X.closePath(); X.fillStyle = '#a8441e'; X.fill(); X.strokeStyle = OL2; X.lineWidth = 10; X.stroke();
  for (let i = 0; i < 8; i++) poly([[-420 + i * 90, -250 + Math.abs(i - 4) * 12], [-390 + i * 90, -330 + Math.abs(i - 4) * 10], [-360 + i * 90, -245 + Math.abs(i - 4) * 12]], '#5a1a0c', 5);
  X.save(); X.translate(520, -560 + br); X.rotate(.15); const jaw = 20 + 30 * (.5 + .5 * Math.sin(t * 2.5)); X.beginPath(); X.moveTo(-60, 20); X.lineTo(170, 30 + jaw); X.lineTo(40, 80 + jaw); X.closePath(); X.fillStyle = '#7a2010'; X.fill(); X.strokeStyle = OL2; X.lineWidth = 8; X.stroke(); X.beginPath(); X.moveTo(-40, 20); X.lineTo(150, 30 + jaw * .6); X.lineTo(150, 30); X.closePath(); X.fillStyle = '#ff4a1a'; X.fill(); for (let k = 0; k < 5; k++) poly([[10 + k * 30, 24], [22 + k * 30, 46], [34 + k * 30, 26]], '#f4ecd8', 3); ell(0, 0, 150, 92, '#b8521e'); X.strokeStyle = OL2; X.lineWidth = 10; X.stroke(); X.beginPath(); X.moveTo(40, 40); X.quadraticCurveTo(150, 60, 140, 20); X.strokeStyle = OL2; X.lineWidth = 7; X.stroke();
  ell(-10, -30, 34, 22, '#ffe23a'); ell(-6, -30, 8, 20, '#c8001a'); glowC(-10, -30, 90, '255,60,40', .7); X.restore();
  box(-330, -420 - br, 300, 150, '#5a6272', 24); X.strokeStyle = OL2; X.lineWidth = 8; X.strokeRect(-330, -420 - br, 300, 150); for (let i = 0; i < 4; i++) { box(-300 + i * 66, -390 - br, 40, 90, `rgba(120,255,180,${.5 + .4 * Math.sin(t * 4 + i)})`, 8); line(-280 + i * 66, -270 - br, -250 + i * 60, -200, '#2a2f3a', 14); }
  for (const lx of [-380, -80, 180]) { box(lx, -10, 90, 90, '#b8582a', 30); for (let c = 0; c < 3; c++) poly([[lx + 10 + c * 26, 70], [lx + 22 + c * 26, 110], [lx + 34 + c * 26, 70]], '#f4ecd8', 3); }
  X.restore();
}
// ---------- DOOM WING wings + chaos spear + drone ----------
function doomWings(x, y, s, t) {
  X.save(); X.translate(x, y); X.scale(s, s); const f = Math.sin(t * 5) * .08;
  for (const sx of [-1, 1]) { X.save(); X.scale(sx, 1); X.rotate(-f);
    const pts = [[20, 0], [260, -260], [520, -330], [470, -230], [560, -180], [440, -110], [520, -40], [380, -10], [420, 70], [220, 30]];
    X.save(); X.shadowColor = '#ff1a3a'; X.shadowBlur = 40; poly(pts, lin(0, -330, 500, 70, ['#5a0a22', '#1a0410', '#000000']), 10, '#ff2a4a'); X.restore();
    for (const [a, b] of [[[40, -10], [500, -300]], [[40, 0], [520, -160]], [[40, 10], [430, 40]]]) { line(a[0], a[1], b[0], b[1], 'rgba(255,30,60,.85)', 6); }
    X.restore(); }
  glowC(0, -80, 380, '255,20,50', .35); X.restore();
}
function chaosSpear(x0, y0, x1, y1, k, col = '255,230,90') {
  if (k <= 0 || k >= 1) return; const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k, a = Math.atan2(y1 - y0, x1 - x0);
  X.save(); X.globalCompositeOperation = 'lighter'; const g = X.createLinearGradient(x - Math.cos(a) * 320, y - Math.sin(a) * 320, x, y); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},.9)`);
  X.strokeStyle = g; X.lineWidth = 30; X.lineCap = 'round'; X.beginPath(); X.moveTo(x - Math.cos(a) * 320, y - Math.sin(a) * 320); X.lineTo(x, y); X.stroke(); X.restore();
  X.save(); X.translate(x, y); X.rotate(a); poly([[60, 0], [-40, -22], [-20, 0], [-40, 22]], '#fffbe0', 4, `rgb(${col})`); X.restore(); glowC(x, y, 110, col, .9);
}
function hitSpark(x, y, k, s = 1) { if (k < 0 || k > 1) return; X.save(); X.translate(x, y); X.scale(s, s); X.globalCompositeOperation = 'lighter'; const r = 60 + k * 260; for (let i = 0; i < 12; i++) { const a = i / 12 * 7 + k; line(Math.cos(a) * r * .4, Math.sin(a) * r * .4, Math.cos(a) * r, Math.sin(a) * r, `rgba(255,240,180,${1 - k})`, 10 * (1 - k) + 2); } ell(0, 0, 120 * (1 - k) + 20, 120 * (1 - k) + 20, `rgba(255,255,230,${1 - k})`); X.restore(); }
function drone(x, y, s, t, hurt) { X.save(); X.translate(x, y + Math.sin(t * 3 + x) * 14); X.scale(s, s); ell(0, 0, 90, 50, hurt ? '#fff' : '#4a5a4a'); X.strokeStyle = OL2; X.lineWidth = 7; X.stroke(); box(-110, -12, 220, 24, '#2a342a', 10); ell(30, 0, 22, 22, '#ff2a2a'); glowC(30, 0, 60, '255,40,40', .6); for (const px of [-120, 120]) { X.save(); X.translate(px, -20); X.scale(Math.cos(t * 30), 1); box(-50, -5, 100, 10, '#1a1a1a', 5); X.restore(); } X.restore(); }
// ---------- BABY SHADOW (crawling, diaper) ----------
function babyShadow(x, y, s, t) {
  const k = TOON.shadow, OUTc = '#14121c'; X.save(); X.translate(x, y); X.scale(s, s); const bob = Math.sin(t * 6) * 4;
  ell(0, 6, 150, 18, 'rgba(0,0,0,.22)');
  X.lineCap = 'round'; line(-70, -50, -120, -6, OUTc, 46); line(-70, -50, -120, -6, k.fur, 34); line(-120, -6, -190, -12, OUTc, 40); line(-120, -6, -190, -12, k.fur, 28);
  ell(-205, -24, 40, 28, '#f4f2ee'); X.strokeStyle = OUTc; X.lineWidth = 5; X.stroke(); box(-232, -36, 14, 26, '#d8283a', 4);
  ell(10, -80 + bob, 105, 66, k.fur); X.strokeStyle = OUTc; X.lineWidth = 6; X.stroke();
  X.beginPath(); X.moveTo(-110, -110 + bob); X.quadraticCurveTo(-150, -60, -100, -20); X.quadraticCurveTo(-40, 0, 10, -40); X.quadraticCurveTo(-10, -100, -110, -110 + bob); X.fillStyle = '#ffffff'; X.fill(); X.strokeStyle = OUTc; X.lineWidth = 6; X.stroke();
  line(-90, -95 + bob, -20, -60, '#cfe6ff', 8); ell(-14, -58, 10, 10, '#7ac8ff');
  for (const [sx, a] of [[1, .25], [0, -.1]]) { X.save(); X.translate(70 + sx * 30, -90 + bob); X.rotate(a); line(0, 0, 20, 80, OUTc, 40); line(0, 0, 20, 80, k.fur, 28); ell(30, 88, 34, 22, '#ffffff'); X.strokeStyle = OUTc; X.lineWidth = 5; X.stroke(); X.restore(); }
  ell(80, -110 + bob, 34, 24, '#ffffff'); X.strokeStyle = OUTc; X.lineWidth = 4; X.stroke();
  X.save(); X.translate(140, -175 + bob); X.rotate(-.12); toonHead({ toon: 'shadow', mood: 'happy' }, Object.assign({}, k, { mood: 'happy' }), k.fur, k.skin, t, false, 105, 3); X.restore();
  X.restore();
}
// ---------- FIGHT scene: `scene: fight`, `hero: shadow|supershadow|doomwing`, `foe: devildoom|biolizard|clones|drones` ----------
function bgFight(sc, t) {
  const lt = LT, foe = sc.foe || 'devildoom', hero = sc.hero || 'shadow', P = .85, n = Math.floor(lt / P), ph = lt % P, hitK = (ph - .42) / .35;
  X.setTransform(1, 0, 0, 1, 0, 0); const dark = foe === 'devildoom' || foe === 'clones';
  X.fillStyle = lin(0, 0, 0, H, foe === 'biolizard' ? ['#020a0e', '#06202a', '#0a3a3a'] : dark ? ['#1a0010', '#5a0a1a', '#ff3a1a'] : ['#0a1430', '#2a1a4a', '#ff7a2a']); X.fillRect(0, 0, W, H);
  if (foe === 'biolizard') { for (let i = 0; i < 6; i++) { box(i * 340 + 40, H * .1, 120, H * .7, '#0c2a30', 20); box(i * 340 + 60, H * .14, 80, H * .6, `rgba(80,255,170,${.18 + .08 * Math.sin(t * 2 + i)})`, 14); } }
  for (let i = 0; i < 7; i++) { const R = rng(i + 11); ell((R() * W * 1.4 + t * (30 + R() * 40)) % (W * 1.4) - W * .2, H * (.1 + R() * .5), 300 + R() * 300, 60 + R() * 50, dark ? 'rgba(20,0,10,.45)' : 'rgba(10,10,40,.4)'); }
  if (hash(Math.floor(t * 5)) > .86) { X.fillStyle = 'rgba(255,220,240,.25)'; X.fillRect(0, 0, W, H); let bx = W * hash(Math.floor(t * 5) + 3), by = 0; X.beginPath(); X.moveTo(bx, by); while (by < H * .6) { bx += (hash(by) - .5) * 160; by += 60; X.lineTo(bx, by); } X.strokeStyle = 'rgba(255,240,255,.9)'; X.lineWidth = 6; X.stroke(); }
  const R2 = rng(5); for (let i = 0; i < 40; i++) { const x = (R2() * W - t * (200 + R2() * 400)) % W; line((x + W) % W, R2() * H, (x + W) % W + 140, R2() * H * 0 + R2() * H, 'rgba(255,255,255,.05)', 3); }
  box(0, H * .9, W, H * .1, dark ? '#1a0610' : '#141024');
  const hurt = hitK > 0 && hitK < .25, fx = W * .7, fy = H * .4;
  if (foe === 'devildoom') devilDoom(fx, fy, .78, t, hurt);
  if (foe === 'biolizard') biolizard(W * .66, H * .95, .85, t, hurt);
  if (foe === 'drones') for (let i = 0; i < 5; i++) drone(W * (.55 + (i % 3) * .14), H * (.25 + Math.floor(i / 2) * .2), .9, t, hurt && i === n % 5);
  if (foe === 'clones') for (let i = 0; i < 7; i++) { const cx = W * (.5 + (i % 4) * .14 + (i > 3 ? .07 : 0)), cy = H * (i > 3 ? .98 : .7), cs = i > 3 ? .8 : .6; if (!(hurt && i === n % 7)) heroAt('mephiles', cx, cy, cs, t + i, 'smug', true); else hitSpark(cx, cy - 200 * cs, hitK * 4, .8); }
  const hx = W * .23, hy = H * .9, hs = 1.08;
  if (hero === 'doomwing') doomWings(hx, hy - 340, 1.0, t);
  const flash = ph < .12; X.save(); X.translate(hx, hy); X.rotate(-.05); X.translate(-hx, -hy);
  heroAt(hero === 'supershadow' ? 'supershadow' : 'shadowfly', hx, hy, hs, t, 'angry', false); X.restore();
  if (hero !== 'shadow') glowC(hx, hy - 330, 300, hero === 'doomwing' ? '255,30,60' : '255,220,90', .35);
  const sx = hx + 150, sy = hy - 330, tx = foe === 'biolizard' ? W * .72 : foe === 'devildoom' ? fx : W * .72, ty = foe === 'biolizard' ? H * .5 : foe === 'devildoom' ? fy : H * .5;
  if (flash) glowC(sx, sy, 160, '255,240,140', .8);
  for (let j = 0; j < 3; j++) chaosSpear(sx, sy + (j - 1) * 50, tx + (j - 1) * 80, ty + (j - 1) * 60, (ph - j * .06) / .42, hero === 'doomwing' ? '255,60,90' : '255,230,90');
  if (hitK > 0 && hitK < 1) hitSpark(tx, ty, hitK, 1.2);
  if (hitK > 0 && hitK < .08) { X.save(); X.globalCompositeOperation = 'difference'; X.fillStyle = '#fff'; X.fillRect(0, 0, W, H); X.restore(); }
}
Object.assign(SW_WORLD, { fight: bgFight }); SW_BLOOM.fight = .45;
// ---------- transitions (first ~0.3s of a shot), chosen per shot ----------
function transFX(sc, lt, i) {
  if (!i || sc.soft) return; const kind = sc.trans || ['flash', 'wipe', 'iris', 'whip', 'glitch', 'flash', 'wipe', 'whip'][Math.floor(hash(i * 3.7) * 8)];
  X.setTransform(1, 0, 0, 1, 0, 0);
  if (kind === 'flash' && lt < .12) { X.fillStyle = `rgba(255,255,255,${.55 * (1 - lt / .12)})`; X.fillRect(0, 0, W, H); }
  if (kind === 'wipe' && lt < .32) { const k = expo(lt / .32), cols = ['#ff3b4e', '#ffcc33', '#14121c']; cols.forEach((c, j) => { const off = W * 1.6 * Math.min(1, k * (1 + j * .25)); X.fillStyle = c; X.beginPath(); X.moveTo(off - 300, 0); X.lineTo(off + W, 0); X.lineTo(off + W - 300, H); X.lineTo(off - 600, H); X.closePath(); X.fill(); }); }
  if (kind === 'iris' && lt < .3) { const r = expo(lt / .3) * W * .8; X.fillStyle = '#05050a'; X.beginPath(); X.rect(0, 0, W, H); X.moveTo(W / 2 + r, H / 2); X.arc(W / 2, H / 2, r, 0, Math.PI * 2, true); X.fill(); X.strokeStyle = '#ffcc33'; X.lineWidth = 12; X.beginPath(); X.arc(W / 2, H / 2, r, 0, 7); X.stroke(); }
  if (kind === 'whip' && lt < .22) { const k = 1 - lt / .22; X.globalAlpha = .55 * k; for (let s = 1; s <= 4; s++) X.drawImage(C, -s * 60 * k, 0); X.globalAlpha = 1; const R = rng(i); for (let j = 0; j < 30; j++) line(0, R() * H, W, R() * H, `rgba(255,255,255,${.25 * k})`, 3 + R() * 6); }
  if (kind === 'glitch' && lt < .2) { const R = rng(Math.floor(lt * 60) + i); for (let j = 0; j < 9; j++) { const y = R() * H, h = 20 + R() * 90, dx = (R() - .5) * 160; X.drawImage(C, 0, y, W, h, dx, y, W, h); } X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = 'rgba(255,0,60,.12)'; X.fillRect(8, 0, W, H); X.fillStyle = 'rgba(0,200,255,.12)'; X.fillRect(-8, 0, W, H); X.restore(); }
}
// ---------- lower third: `lower: Name|Role` ----------
function lowerThird(sc, lt) {
  if (!sc.lower || lt > 4.2) return; const [nm, role = ''] = String(sc.lower).split('|'), k = expo(lt / .45), out = lt > 3.7 ? expo((lt - 3.7) / .4) : 0, x = 70 - out * 900;
  X.setTransform(1, 0, 0, 1, 0, 0); X.font = `700 64px ${FONT}`; const w = Math.max(X.measureText(nm.toUpperCase()).width, (X.font = `700 30px Roboto, sans-serif`, X.measureText(role.toUpperCase()).width * 1.7)) + 80, y = H * .66;
  X.save(); X.beginPath(); X.rect(x, y - 60, w * k, 150); X.clip();
  box(x, y - 56, w, 96, 'rgba(8,8,14,.88)', 6); box(x, y - 56, 12, 96, '#ff3b4e'); X.font = `700 30px Roboto, sans-serif`; box(x + 12, y + 40, X.measureText(role.toUpperCase()).width + 40, 44, '#ffcc33', 4);
  X.fillStyle = '#fff'; X.font = `700 64px ${FONT}`; X.textBaseline = 'middle'; X.fillText(nm.toUpperCase(), x + 36, y - 6);
  X.fillStyle = '#14121c'; X.font = `700 30px Roboto, sans-serif`; X.fillText(role.toUpperCase(), x + 30, y + 63); X.restore();
}
// ---------- film post: grade, light leak, grain ----------
const GRAIN = [0, 1, 2].map(s => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), d = g.createImageData(256, 256), R = rng(s + 99); for (let i = 0; i < d.data.length; i += 4) { const v = R() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; });
function postFX(sc, T, lt) {
  if (window.LITE) return; X.setTransform(1, 0, 0, 1, 0, 0);
  const warm = ['ark', 'quote', 'lab'].includes(sc.type) && sc.soft;
  X.save(); X.globalCompositeOperation = 'soft-light'; X.fillStyle = lin(0, 0, W, H, warm ? ['rgba(255,170,90,.35)', 'rgba(40,60,160,.25)'] : ['rgba(255,120,60,.22)', 'rgba(30,80,255,.28)']); X.fillRect(0, 0, W, H); X.restore();
  if (lt < 1.2 && hash((sc.idx || 0) * 1.7) > .55 && !sc.nocap) { const k = Math.sin(lt / 1.2 * Math.PI); X.save(); X.globalCompositeOperation = 'screen'; X.fillStyle = rad(W * (.1 + lt * .5), H * .1, 0, W * .5, [`rgba(255,140,60,${.35 * k})`, 'rgba(255,60,120,0)']); X.fillRect(0, 0, W, H); X.restore(); }
  X.save(); X.globalAlpha = .07; X.globalCompositeOperation = 'overlay'; const g = GRAIN[Math.floor(T * 24) % 3], p = X.createPattern(g, 'repeat'), o = hash(Math.floor(T * 24)) * 256; X.translate(-o, -o * .7); X.fillStyle = p; X.fillRect(0, 0, W + 256, H + 256); X.restore();
}

// ---------- ARK interior detail: pipes, consoles, door, light shafts ----------
function arkDetail(sc, t, wx, wy, wr) {
  cam(.3);
  for (const py of [H * .04, H * .1]) { box(-W, py, W * 3, 26, '#3a414e', 13); for (let i = -8; i < 30; i++) box(i * 180, py - 6, 22, 38, '#2a2f3a', 4); }
  for (let i = 0; i < 5; i++) { const x = -200 + i * 520; X.beginPath(); X.moveTo(x, H * .12); X.quadraticCurveTo(x + 120, H * .26 + Math.sin(t + i) * 6, x + 240, H * .12); X.strokeStyle = '#1a1e26'; X.lineWidth = 9; X.stroke(); }
  const dx = wx - wr - 330; box(dx, H * .3, 200, H * .56, '#20252e', 10); box(dx + 14, H * .32, 172, H * .52, '#2c323d', 6); line(dx + 100, H * .32, dx + 100, H * .84, '#14171d', 6);
  box(dx + 60, H * .26, 80, 26, sc.alarm && Math.floor(t * 2.5) % 2 ? '#ff2a2a' : '#3ddc84', 6); glowC(dx + 100, H * .27, 80, sc.alarm ? '255,40,40' : '60,220,130', .4);
  cam(.45);
  for (const cx of [wx - wr * .72, wx + wr * .72]) {
    X.beginPath(); X.moveTo(cx - 150, H * .86); X.lineTo(cx - 130, H * .7); X.lineTo(cx + 130, H * .7); X.lineTo(cx + 150, H * .86); X.closePath(); X.fillStyle = '#2a303b'; X.fill(); X.strokeStyle = '#11141a'; X.lineWidth = 5; X.stroke();
    box(cx - 110, H * .6, 220, 110, '#11141a', 10); box(cx - 100, H * .61, 200, 92, '#0a2a3a', 6);
    for (let r = 0; r < 4; r++) box(cx - 88, H * .625 + r * 20, 60 + 100 * hash(cx + r + Math.floor(t * 2)), 8, 'rgba(110,230,255,.7)', 3);
    for (let b = 0; b < 6; b++) ell(cx - 100 + b * 40, H * .74, 9, 6, ['#ff3b4e', '#ffcc33', '#3ddc84'][(b + Math.floor(t * 3 + cx)) % 3]);
    glowC(cx, H * .65, 160, '90,200,255', .22);
  }
  X.save(); X.globalCompositeOperation = 'lighter'; const sh = sc.view === 'moon' ? '230,230,210' : '120,170,255';
  for (let k = 0; k < 3; k++) { X.beginPath(); X.moveTo(wx - wr * .5 + k * wr * .4, wy - wr * .4); X.lineTo(wx - wr * .2 + k * wr * .4, wy - wr * .4); X.lineTo(wx + wr * .5 + k * wr * .5, H * .88); X.lineTo(wx + wr * .1 + k * wr * .5, H * .88); X.closePath(); X.fillStyle = `rgba(${sh},${.035 + .015 * Math.sin(t + k)})`; X.fill(); }
  X.restore();
  X.save(); X.globalAlpha = .1; X.beginPath(); X.moveTo(wx - wr * .6, wy - wr * .7); X.lineTo(wx - wr * .4, wy - wr * .7); X.lineTo(wx - wr * .9, wy + wr * .3); X.lineTo(wx - wr, wy + wr * .1); X.closePath(); X.fillStyle = '#fff'; X.fill(); X.restore();
}
