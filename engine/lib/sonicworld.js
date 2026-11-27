// Sonic-world sets: lab, planet, speedway, zone, fortress, overlord, emeralds, monitors, news, wreck.
// Each draws its own parallax layers with cam(d). FG_* draw in front of the cast.
function glowC(x, y, r, col, a = .6) { X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(x, y, 0, r, [`rgba(${col},${a})`, `rgba(${col},${a * .35})`, `rgba(${col},0)`]); X.fillRect(x - r, y - r, r * 2, r * 2); X.restore(); }
function rivetPanel(x, y, w, h, col) { box(x, y, w, h, col, 6); X.strokeStyle = hex(col, -.35); X.lineWidth = 4; X.strokeRect(x + 2, y + 2, w - 4, h - 4); for (const [a, b] of [[x + 14, y + 14], [x + w - 14, y + 14], [x + 14, y + h - 14], [x + w - 14, y + h - 14]]) ell(a, b, 5, 5, hex(col, .25)); box(x + w * .6, y, w * .4, h, 'rgba(0,0,0,.12)'); }
function hazard(x, y, w, h) { X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); box(x, y, w, h, '#f2c43a'); X.fillStyle = '#1a1a1a'; for (let i = -2; i < w / 40 + 2; i++) { X.beginPath(); X.moveTo(x + i * 40, y + h); X.lineTo(x + i * 40 + 20, y + h); X.lineTo(x + i * 40 + 20 + h, y); X.lineTo(x + i * 40 + h, y); X.closePath(); X.fill(); } X.restore(); }
function eggEmblem(x, y, s) { X.save(); X.translate(x, y); X.scale(s, s); ell(0, 0, 60, 60, '#d8283a'); ell(0, 0, 48, 48, '#f2c43a'); ell(0, -6, 26, 30, '#ffe2c8'); for (const sx of [-1, 1]) { X.beginPath(); X.moveTo(0, 8); X.quadraticCurveTo(sx * 30, -2, sx * 40, 10); X.quadraticCurveTo(sx * 26, 24, 0, 16); X.fillStyle = '#e07a28'; X.fill(); } ell(-8, -12, 6, 6, '#1a1a1a'); ell(8, -12, 6, 6, '#1a1a1a'); X.restore(); }
function sky2(a, b, c) { X.fillStyle = lin(0, 0, 0, H, c ? [a, b, c] : [a, b]); X.fillRect(-W, -H, W * 3, H * 3); }
function scroll(x, speed, t, span) { return ((x - speed * t) % span + span) % span; }

// ---------- LAB ----------
function bgLab(sc, t) {
  cam(0); sky2('#0c1220', '#18233a');
  cam(.15); for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) rivetPanel(-200 + i * 280, -60 + j * 220, 270, 210, j % 2 ? '#202c42' : '#1c273b');
  // giant monitor wall
  cam(.3); const mx = W * .28, my = H * .1, mw = W * .44, mh = H * .4;
  box(mx - 24, my - 24, mw + 48, mh + 48, '#0a0e16', 16); box(mx, my, mw, mh, '#06263a', 6);
  X.save(); X.beginPath(); X.rect(mx, my, mw, mh); X.clip();
  X.strokeStyle = 'rgba(80,200,255,.18)'; X.lineWidth = 2; for (let i = 0; i < 20; i++) { line(mx + i * 44, my, mx + i * 44, my + mh, 'rgba(80,200,255,.15)', 2); line(mx, my + i * 34, mx + mw, my + i * 34, 'rgba(80,200,255,.15)', 2); }
  if (sc.screen === 'sonic' || sc.screen === 'shadow' || sc.screen === 'metal' || !sc.screen) {
    X.save(); X.translate(mx + mw * .5, my + mh * .55); X.scale(.9, .9); X.globalAlpha = .9;
    const c = sc.screen === 'sonic' || sc.screen === 'shadow' ? { toon: sc.screen, mood: 'smug' } : null;
    if (c) toonHead(c, TOON[sc.screen], '#2a8ad8', '#9fdcff', t, false, 120, 1); else metalHead({}, t, false, 120, '#2a7ad8', '#123a70', '#6ac8ff', '#bfefff', '#5aa0c8', 2);
    X.restore();
    X.save(); X.beginPath(); X.arc(mx + mw * .5, my + mh * .55, 210, t * 2, t * 2 + 4.5); X.strokeStyle = 'rgba(120,230,255,.7)'; X.lineWidth = 4; X.stroke(); X.restore();
  }
  X.font = `700 40px ${FONT}`; X.fillStyle = '#7fe6ff'; X.fillText(sc.title || 'PROJECT: METAL', mx + 30, my + 56);
  X.font = `500 26px Roboto, sans-serif`; X.fillStyle = 'rgba(127,230,255,.8)'; for (let i = 0; i < 5; i++) X.fillText((sc.data ? String(sc.data).split('|') : ['SPEED  MACH 1.2', 'ARMOR  99.8%', 'ENGINE  ONLINE', 'TARGET  SONIC', 'OBEY  TRUE'])[i] || '', mx + 30, my + 110 + i * 36);
  const sy = my + ((t * 140) % mh); box(mx, sy, mw, 6, 'rgba(160,240,255,.35)');
  for (let y = my; y < my + mh; y += 6) box(mx, y, mw, 2, 'rgba(0,0,0,.18)');
  X.restore(); glowC(mx + mw / 2, my + mh / 2, mw * .7, '60,180,255', .18);
  eggEmblem(mx + mw / 2, my - 70, .7);
  // capsules
  cam(.5); for (const cx of [W * .1, W * .9]) {
    box(cx - 110, H * .1, 220, 40, '#3a4458', 10); box(cx - 110, H * .72, 220, 60, '#3a4458', 10);
    box(cx - 90, H * .1 + 40, 180, H * .62 - 40, 'rgba(60,255,160,.22)');
    for (let i = 0; i < 10; i++) { const by = H * .72 - ((t * 80 + i * 90) % (H * .58)); ell(cx - 60 + (i * 37) % 120, by, 6 + i % 3 * 3, 6 + i % 3 * 3, 'rgba(200,255,220,.5)'); }
    box(cx - 90, H * .1 + 40, 30, H * .62 - 40, 'rgba(255,255,255,.12)'); glowC(cx, H * .42, 260, '60,255,160', .25);
    for (let k = 0; k < 3; k++) line(cx - 40 + k * 40, H * .1, cx - 40 + k * 40, -60, '#2a3244', 16);
  }
  // floor
  cam(1);
  box(-W, H * .78, W * 3, H, '#141a26'); for (let i = -6; i < 30; i++) line(W / 2 + (i - 12) * 160, H * .78, W / 2 + (i - 12) * 320, H * 1.2, 'rgba(120,160,220,.12)', 3);
  for (let j = 0; j < 4; j++) line(-W, H * (.82 + j * .06), W * 2, H * (.82 + j * .06), 'rgba(120,160,220,.1)', 3);
  hazard(-W, H * .78 - 18, W * 3, 18);
  // alarm lights
  if (sc.alarm) for (const ax of [W * .22, W * .78]) { const on = Math.sin(t * 8) > 0; ell(ax, H * .06, 26, 20, on ? '#ff3030' : '#801818'); if (on) glowC(ax, H * .1, 420, '255,40,40', .35); }
}
function FG_lab(sc, t) {
  if (sc.cage) { const cx = sc.cage * W, s = 1; for (let i = 0; i < 9; i++) line(cx - 230 + i * 57, H * .3, cx - 230 + i * 57, H * .9, '#5a6478', 12); box(cx - 250, H * .27, 500, 40, '#3a4458', 10); box(cx - 250, H * .88, 500, 34, '#3a4458', 8); hazard(cx - 250, H * .88, 500, 12); }
  if (sc.alarm && Math.sin(t * 8) > 0) { X.fillStyle = 'rgba(255,0,0,.08)'; X.fillRect(-W, -H, W * 3, H * 3); }
}
// ---------- LITTLE PLANET ----------
function planetBall(x, y, r, t, metal) {
  X.save(); X.translate(x, y);
  glowC(0, 0, r * 1.6, metal ? '255,90,60' : '255,240,180', .3);
  ell(0, 0, r, r); X.fillStyle = lin(-r, -r, r, r, metal ? ['#9aa3b2', '#6a7282', '#3a404c'] : ['#7fe08a', '#3aa85a', '#1e6a3a']); X.fill();
  X.save(); ell(0, 0, r, r); X.clip();
  if (metal) { for (let i = -5; i < 6; i++) { line(-r, i * r * .2, r, i * r * .2 + 20, 'rgba(30,30,40,.4)', 4); line(i * r * .2, -r, i * r * .2 + 20, r, 'rgba(30,30,40,.4)', 4); } for (let i = 0; i < 4; i++) { const a = i * 1.6 + .4, px = Math.cos(a) * r * .55, py = Math.sin(a) * r * .55; box(px - 18, py - 50, 36, 60, '#4a505c', 4); smoke(px, py - 60, t + i, .5, 'rgba(90,80,90,'); ell(px, py - 10, 7, 7, Math.sin(t * 6 + i) > 0 ? '#ff3a2a' : '#601010'); } }
  else { ell(-r * .3, -r * .2, r * .45, r * .3, '#58c26a'); ell(r * .35, r * .3, r * .4, r * .25, '#2e8a4a'); ell(r * .1, -r * .55, r * .3, r * .15, '#f2e0a0'); for (let i = 0; i < 14; i++) { const a = i * .9, rr2 = r * (.3 + (i % 4) * .15); ell(Math.cos(a) * rr2, Math.sin(a) * rr2, 8, 8, ['#ff7aa8', '#ffd94a', '#ffffff'][i % 3]); } ell(-r * .5, r * .1, r * .18, r * .12, '#4ab8f0'); }
  ell(r * .35, r * .35, r * .9, r * .9, 'rgba(0,0,0,.25)'); ell(-r * .4, -r * .45, r * .35, r * .2, 'rgba(255,255,255,.25)', -.6);
  X.restore(); X.beginPath(); X.arc(0, 0, r, 0, 7); X.strokeStyle = 'rgba(20,30,40,.6)'; X.lineWidth = 5; X.stroke(); X.restore();
}
function chain(x0, y0, x1, y1, sag, n) { for (let i = 0; i <= n; i++) { const k = i / n, x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * sag; X.save(); X.translate(x, y); X.rotate(Math.atan2(y1 - y0, x1 - x0) + (i % 2) * 1.57); X.beginPath(); X.ellipse(0, 0, 18, 9, 0, 0, 7); X.strokeStyle = '#3a3a44'; X.lineWidth = 7; X.stroke(); X.strokeStyle = '#9aa3b2'; X.lineWidth = 3; X.stroke(); X.restore(); } }
function bgPlanet(sc, t) {
  const m = !!sc.metal;
  const pv = (sc.idx || 0) % 3; cam(0); sky2(m ? '#2a1a3a' : ['#5ab4ff', '#ff9a6a', '#3a5ab0'][pv], m ? '#7a3a4a' : ['#bfe6ff', '#ffc89a', '#9ab0f0'][pv], m ? '#e0703a' : ['#ffe9b8', '#ffe0b0', '#ffd0e0'][pv]); if (m) stars(sc.seed, 80, t, H * .4);
  cam(.06); const cd = t * 10; for (let i = 0; i < 4; i++) cloudP((W * (.15 + i * .3) + cd * (1 + i * .3)) % (W + 600) - 200, H * (.12 + (i % 2) * .14), .8, m ? '#6a4a5a' : '#ffffff');
  cam(.12); range(sc.seed, H * .66, H * .3, 100, m ? '#4a3a5a' : '#7a9ad0', m ? null : '#eef4ff', 340);
  cam(.2); const px = W * .42, py = H * .3; chain(px + 140, py + 200, W * .9, H * .5, 80, 26); planetBall(px, py + Math.sin(t) * 8, 230, t, m);
  cam(.3); X.beginPath(); X.moveTo(W * .7, H * .7); X.lineTo(W * .9, H * .46); X.lineTo(W * 1.15, H * .7); X.closePath(); X.fillStyle = m ? '#3a2a3a' : '#5a7a9a'; X.fill(); X.beginPath(); X.moveTo(W * .9, H * .46); X.lineTo(W * .95, H * .55); X.lineTo(W * .86, H * .53); X.closePath(); X.fillStyle = '#fff'; X.fill();
  // lake
  cam(.45); box(-W, H * .66, W * 3, H * .2, lin(0, H * .66, 0, H * .86, m ? ['#5a3a5a', '#2a1a2a'] : ['#7ad0ff', '#2a7ad0']));
  for (let i = 0; i < 40; i++) { const lx = scroll(i * 97, -20, t, W + 200) - 100, ly = H * .68 + (i % 7) * 22; line(lx, ly, lx + 40 + (i % 3) * 20, ly, 'rgba(255,255,255,.35)', 3); }
  ell(px, H * .7, 200, 18, 'rgba(255,255,255,.15)');
  cam(1); box(-W, H * .9, W * 3, H, m ? '#3a3440' : '#4caa4a'); hills(sc.seed + 3, H * .95, H * .8, 20, m ? '#3a3440' : '#4caa4a', 220);
  if (!m) for (let i = 0; i < 18; i++) { const fx = (i * 131) % W, fy = H * .86 + (i % 4) * 30; line(fx, fy, fx, fy - 40, '#2e7a2e', 4); ell(fx, fy - 44, 12, 12, '#ffd94a'); ell(fx, fy - 44, 5, 5, '#8a4a1a'); }
  else for (let i = 0; i < 8; i++) { const fx = (i * 271) % W; box(fx, H * .82, 60, 120, '#2a2a34', 4); box(fx + 10, H * .84, 12, 12, Math.sin(t * 5 + i) > 0 ? '#ff4a2a' : '#401010'); }
}
// ---------- STARDUST SPEEDWAY ----------
function bgSpeedway(sc, t) {
  const sp = sc.speed ?? 1400;
  const sv = (sc.idx || 0) % 3; cam(0); sky2(['#120a2e', '#0a1a2e', '#2a0a1e'][sv], ['#3a1a6a', '#1a3a6a', '#6a1a3a'][sv], ['#d0508a', '#50a0d0', '#e0703a'][sv]); stars(sc.seed, 260, t, H * .7);
  ell(W * .8, H * .2, 90, 90, '#ffe8f4'); glowC(W * .8, H * .2, 300, '255,180,230', .35);
  cam(.08); for (let i = 0; i < 26; i++) { const bx = scroll(i * 110, sp * .05, t, W + 300) - 150, bh = 120 + (i * 53) % 220; box(bx, H * .62 - bh, 90, bh + 40, '#2a1450'); for (let k = 0; k < 6; k++) if ((i + k) % 3) box(bx + 14 + (k % 2) * 40, H * .62 - bh + 20 + Math.floor(k / 2) * 40, 18, 18, ['#ffd94a', '#ff7ad8', '#7af0ff'][k % 3]); }
  cam(.18); for (let i = 0; i < 7; i++) { const gx = scroll(i * 330, sp * .12, t, W + 400) - 200, gy = H * (.2 + (i % 3) * .1); X.save(); X.translate(gx, gy); X.rotate(t * (i % 2 ? 1 : -1)); for (let k = 0; k < 8; k++) { X.rotate(Math.PI / 4); box(-10, -46, 20, 22, '#c08ae0', 3); } ell(0, 0, 34, 34, '#c08ae0'); ell(0, 0, 14, 14, '#3a1a6a'); X.restore(); }
  // laser
  if (sc.laser) { const lx = W * .02 + Math.sin(t * 3) * 30; X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = lin(lx - 160, 0, lx + 160, 0, ['rgba(255,40,40,0)', 'rgba(255,60,40,.9)', 'rgba(255,255,220,1)', 'rgba(255,60,40,.9)', 'rgba(255,40,40,0)']); X.fillRect(lx - 160, -H, 320, H * 3); X.restore(); glowC(lx, H * .7, 500, '255,60,40', .5); }
  // highway
  cam(.6); for (let i = 0; i < 8; i++) { const sx2 = scroll(i * 300, sp * .6, t, W + 600) - 300; box(sx2, H * .8, 40, H * .4, '#3a1a5a'); }
  cam(1); box(-W, H * .82, W * 3, 70, '#4a2a7a'); box(-W, H * .82, W * 3, 10, '#ff7ad8'); box(-W, H * .89, W * 3, 16, '#2a1050');
  for (let i = 0; i < 20; i++) { const dx = scroll(i * 220, sp, t, W + 440) - 220; box(dx, H * .855, 110, 8, '#ffd94a', 4); }
  for (let i = 0; i < 6; i++) { const lx = scroll(i * 420, sp, t, W + 840) - 420; box(lx, H * .46, 12, H * .36, '#2a1050'); box(lx - 30, H * .45, 72, 14, '#2a1050', 6); ell(lx + 30, H * .47, 16, 10, '#fff4c8'); glowC(lx + 30, H * .5, 160, '255,240,180', .35); }
  box(-W, H * .9, W * 3, H * .2, '#170a30');
}
function FG_speedway(sc, t) { if ((sc.speed ?? 1400) > 600) speedLines(sc, t); }
function speedLines(sc, t) { const R = rng(Math.floor(t * 12)); for (let i = 0; i < 26; i++) { const y = R() * H * .85, x = R() * W, w = 150 + R() * 400; line(x, y, x + w, y, `rgba(255,255,255,${.12 + R() * .25})`, 2 + R() * 4); } }
// ---------- CHECKERED ISLAND ZONE ----------
function palm(x, y, h, t) { X.lineCap = 'round'; X.beginPath(); X.moveTo(x, y); X.quadraticCurveTo(x + h * .15, y - h * .5, x + h * .05, y - h); X.strokeStyle = '#8a5a2a'; X.lineWidth = h * .07; X.stroke(); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .55 + Math.sin(t * 1.5 + k) * .05; X.save(); X.translate(x + h * .05, y - h); X.rotate(a); X.beginPath(); X.moveTo(0, 0); X.quadraticCurveTo(h * .25, -h * .12, h * .45, h * .08); X.quadraticCurveTo(h * .25, -h * .02, 0, 0); X.fillStyle = k % 2 ? '#2e9a3a' : '#3ab84a'; X.fill(); X.restore(); } }
function checkerCliff(x, y, w, h) { X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); const s = 60; for (let i = 0; i < w / s + 1; i++) for (let j = 0; j < h / s + 1; j++) box(x + i * s, y + j * s, s, s, (i + j) % 2 ? '#b8682a' : '#8a4a1a'); X.restore(); box(x - 10, y - 26, w + 20, 40, '#3ab84a', 14); for (let i = 0; i < w / 30; i++) ell(x + i * 30 + 15, y + 12, 16, 12, '#2e9a3a'); }
function bgZone(sc, t) {
  const sp = sc.speed ?? 0;
  cam(0); sky2('#2a8ae8', '#7ac8ff', '#d8f0ff');
  cam(.05); for (let i = 0; i < 5; i++) cloudP(scroll(i * 420, sp * .03 - 15, t, W + 600) - 250, H * (.1 + (i % 3) * .08), .9, '#ffffff');
  cam(.1); box(-W, H * .55, W * 3, H * .2, lin(0, H * .55, 0, H * .7, ['#3a9ae8', '#1a5ab0'])); for (let i = 0; i < 30; i++) { const lx = scroll(i * 130, 30, t, W + 200) - 100; line(lx, H * .58 + (i % 5) * 20, lx + 50, H * .58 + (i % 5) * 20, 'rgba(255,255,255,.5)', 3); }
  for (let i = 0; i < 3; i++) { const ix = scroll(W * (.2 + i * .35), sp * .05, t, W + 600) - 300; checkerCliff(ix, H * .42, 260, H * .2); palm(ix + 130, H * .42, 160, t); }
  cam(.4); for (let i = 0; i < 4; i++) { const cx = scroll(i * 560, sp * .4, t, W + 1100) - 500; checkerCliff(cx, H * .58 + (i % 2) * 40, 380, H * .5); palm(cx + 80, H * .58 + (i % 2) * 40, 260, t); }
  // loop
  const lx = scroll(W * .7, sp * .4, t, W + 1100) - 500; X.beginPath(); X.arc(lx, H * .45, 170, 0, 7); X.strokeStyle = '#8a4a1a'; X.lineWidth = 46; X.stroke(); X.strokeStyle = '#3ab84a'; X.lineWidth = 14; X.stroke();
  cam(1); box(-W, H * .86, W * 3, H, '#8a4a1a'); for (let i = 0; i < 40; i++) { const gx = scroll(i * 80, sp, t, W + 160) - 80; box(gx, H * .9, 40, 40, '#b8682a'); box(gx + 40, H * .94, 40, 40, '#b8682a'); }
  box(-W, H * .85, W * 3, 26, '#3ab84a'); for (let i = 0; i < 12; i++) { const fx = scroll(i * 170 + 40, sp, t, W + 340) - 170; line(fx, H * .85, fx, H * .78, '#2e7a2e', 5); for (let k = 0; k < 6; k++) ell(fx + Math.cos(k + t) * 14, H * .76 + Math.sin(k + t) * 14, 9, 9, '#ffd94a'); ell(fx, H * .76, 9, 9, '#8a4a1a'); }
  if (sc.rings) for (let i = 0; i < 6; i++) { const rx = scroll(i * 160, sp, t, W + 320) - 160, ry = H * .62 + Math.sin(i) * 40, w = Math.abs(Math.cos(t * 4 + i)); X.beginPath(); X.ellipse(rx, ry, 26 * w + 3, 26, 0, 0, 7); X.strokeStyle = '#f2c43a'; X.lineWidth = 9; X.stroke(); }
}
function FG_zone(sc, t) { if ((sc.speed ?? 0) > 600) speedLines(sc, t); }
// ---------- FLYING FORTRESS ----------
let GUNMODE = false;
function gunEmblem(x, y, s) { X.save(); X.translate(x, y); X.scale(s, s); ell(0, 0, 60, 60, '#2a3a2a'); ell(0, 0, 50, 50, '#c8c8b0'); X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 18 : 42; X.lineTo(Math.cos(a) * r, Math.sin(a) * r); } X.closePath(); X.fillStyle = '#2a3a2a'; X.fill(); X.restore(); }
function airship(x, y, s, t) { X.save(); X.translate(x, y); X.scale(s, s); ell(0, 0, 240, 70, '#5a606c'); box(-240, -10, 480, 20, '#d8283a'); ell(0, -30, 200, 30, 'rgba(255,255,255,.12)'); box(-60, -120, 120, 70, '#4a505c', 10); for (let i = 0; i < 3; i++) box(-40 + i * 30, -100, 16, 16, '#ffd94a'); for (const px of [-200, 200]) { X.save(); X.translate(px, -70); X.scale(Math.cos(t * 20), 1); box(-60, -6, 120, 12, '#2a2a30', 6); X.restore(); line(px, -70, px, -30, '#2a2a30', 8); } (GUNMODE ? gunEmblem(0, 20, .35) : eggEmblem(0, 20, .35)); for (let i = 0; i < 5; i++) ell(-160 + i * 80, 46, 10, 6, '#ff6a2a'); X.restore(); }
function bgFortress(sc, t) {
  GUNMODE = !!sc.gun; cam(0); if (sc.gun) sky2('#0a1018', '#1a2a3a', '#3a4a5a'); else sky2('#2a1a4a', '#c0506a', '#ffb04a');
  cam(.05); for (let i = 0; i < 6; i++) cloudP(scroll(i * 380, 260, t, W + 700) - 300, H * (.25 + (i % 3) * .15), .9 + (i % 2) * .4, sc.gun ? (i % 2 ? '#2a3a4a' : '#34465a') : i % 2 ? '#e8a0a0' : '#f4c0a0');
  cam(.15); airship(scroll(W * .2, 40, t, W + 800) - 300, H * .25 + Math.sin(t) * 10, .55, t); airship(scroll(W * .75, 60, t, W + 800) - 300, H * .4 + Math.sin(t + 2) * 10, .4, t);
  cam(.3); for (let i = 0; i < 5; i++) cloudP(scroll(i * 500, 520, t, W + 900) - 400, H * .7, 1.4, sc.gun ? '#2a3644' : '#f0d0c0');
  cam(1); box(-W, H * .8, W * 3, H, '#3a404c'); for (let i = -10; i < 30; i++) box(i * 160, H * .8, 150, H, i % 2 ? '#454c5a' : '#3a404c'); hazard(-W, H * .8, W * 3, 16); GUNMODE = false;
  for (let i = -4; i < 20; i++) { box(i * 120, H * .62, 12, H * .18, '#2a2e38'); } box(-W, H * .61, W * 3, 14, '#2a2e38', 6);
  box(W * .82, H * .5, 220, 80, '#2a2e38', 14); box(W * .9, H * .46, 260, 40, '#1a1e28', 10); ell(W * .86, H * .58, 50, 50, '#4a505c');
}
function FG_fortress(sc, t) { const R = rng(Math.floor(t * 12)); for (let i = 0; i < 12; i++) { const y = R() * H, x = R() * W; line(x, y, x - 200, y, 'rgba(255,240,230,.18)', 2); } }
// ---------- METAL OVERLORD ----------
function bgOverlord(sc, t) {
  cam(0); sky2('#1a0608', '#6a1010', '#d04a1a');
  const flash = hash(Math.floor(t * 4)) > .85; if (flash) { X.fillStyle = 'rgba(255,230,220,.35)'; X.fillRect(-W, -H, W * 3, H * 3); }
  cam(.05); for (let i = 0; i < 6; i++) cloudP(scroll(i * 400, 30, t, W + 700) - 300, H * (.1 + (i % 3) * .12), 1.2, '#3a0a10');
  cam(.25); X.save(); X.translate(W * .55, H * .52 + Math.sin(t * 1.4) * 20); const fl = Math.sin(t * 2.2) * .25;
  for (const sx of [-1, 1]) { X.save(); X.scale(sx, 1); X.rotate(-fl * sx); X.beginPath(); X.moveTo(80, -80); X.lineTo(700, -420); X.lineTo(620, -180); X.lineTo(760, -120); X.lineTo(560, 0); X.lineTo(660, 120); X.lineTo(160, 60); X.closePath(); X.fillStyle = sx > 0 ? '#3a3f6a' : '#2a2e52'; X.fill(); X.strokeStyle = '#11132a'; X.lineWidth = 8; X.stroke(); for (let k = 0; k < 4; k++) line(140, -40 + k * 30, 600 - k * 40, -360 + k * 120, '#4a5090', 6); X.restore(); }
  ell(0, 80, 230, 280, '#3a3f6a'); X.strokeStyle = '#11132a'; X.lineWidth = 8; X.stroke(); ell(0, 60, 90, 90, '#f2b928'); ell(0, 60, 60, 60, '#3a1408'); glowC(0, 60, 200, '255,140,40', .6);
  X.beginPath(); X.moveTo(-50, -150); X.quadraticCurveTo(-40, -380, 60, -420); X.lineTo(120, -380); X.quadraticCurveTo(40, -330, 50, -150); X.closePath(); X.fillStyle = '#3a3f6a'; X.fill(); X.stroke();
  X.save(); X.translate(90, -420); X.beginPath(); X.moveTo(-80, -40); X.lineTo(160, 0); X.lineTo(-60, 70); X.closePath(); X.fillStyle = '#4a508a'; X.fill(); X.stroke(); for (const [qx, qy] of [[-60, -40], [-80, 0], [-60, 50]]) { X.beginPath(); X.moveTo(qx, qy); X.lineTo(qx - 140, qy - 40); X.lineTo(qx - 20, qy + 20); X.closePath(); X.fill(); X.stroke(); }
  ell(30, 0, 24, 12, '#ff2a2a'); glowC(30, 0, 120, '255,40,40', .8); X.restore();
  X.restore();
  cam(.6); for (let i = 0; i < 6; i++) { const bx = i * 360 - 100; X.beginPath(); X.moveTo(bx, H); X.lineTo(bx + 40, H * .7 - (i % 3) * 60); X.lineTo(bx + 160, H * .75); X.lineTo(bx + 220, H * .64); X.lineTo(bx + 300, H); X.closePath(); X.fillStyle = '#1a0a0e'; X.fill(); smoke(bx + 150, H * .66, t + i, 1.2, 'rgba(40,20,20,'); glowC(bx + 160, H * .78, 140, '255,120,40', .4); }
  cam(1); for (let i = 0; i < 30; i++) { const R = rng(i), x = (R() * W + t * 40) % W, y = H - ((t * (60 + R() * 80) + R() * H) % H); ell(x, y, 3, 3, 'rgba(255,170,80,.8)'); }
}
// ---------- CHAOS EMERALDS ----------
function gem(x, y, s, col) { X.save(); X.translate(x, y); X.scale(s, s); X.beginPath(); X.moveTo(0, -50); X.lineTo(40, -20); X.lineTo(26, 40); X.lineTo(-26, 40); X.lineTo(-40, -20); X.closePath(); X.fillStyle = col; X.fill(); X.strokeStyle = hex(col, -.4); X.lineWidth = 4; X.stroke(); X.beginPath(); X.moveTo(-40, -20); X.lineTo(0, -6); X.lineTo(40, -20); X.moveTo(0, -6); X.lineTo(0, 40); X.strokeStyle = 'rgba(255,255,255,.4)'; X.lineWidth = 3; X.stroke(); X.beginPath(); X.moveTo(-18, -38); X.lineTo(-4, -32); X.lineTo(-26, -16); X.closePath(); X.fillStyle = 'rgba(255,255,255,.6)'; X.fill(); X.restore(); }
function bgEmeralds(sc, t) {
  cam(0); sky2('#05030f', '#140a2e'); stars(sc.seed, 300, t, H);
  cam(.3); const cx = W / 2, cy = H * .45, burst = sc.burst ? Math.min(1, (t % 100) * 0 + 1) : 0;
  X.save(); X.translate(cx, cy); X.rotate(t * .2); for (let i = 0; i < 24; i++) { X.rotate(Math.PI / 12); X.beginPath(); X.moveTo(0, 0); X.lineTo(-40, -1400); X.lineTo(40, -1400); X.closePath(); X.fillStyle = i % 2 ? 'rgba(255,230,140,.06)' : 'rgba(255,255,255,.03)'; X.fill(); } X.restore();
  glowC(cx, cy, 500, sc.burst ? '255,220,120' : '200,220,255', sc.burst ? .8 : .35);
  const cols = ['#3ad86a', '#e8384a', '#3a8ae8', '#f2d43a', '#4ae8f0', '#b04ae8', '#f4f4f4'];
  cols.forEach((c, i) => { const a = t * .6 + i / 7 * Math.PI * 2, r = sc.burst ? 360 : 300, gx = cx + Math.cos(a) * r, gy = cy + Math.sin(a) * r * .5; glowC(gx, gy, 120, c === '#f4f4f4' ? '255,255,255' : [[58, 216, 106], [232, 56, 74], [58, 138, 232], [242, 212, 58], [74, 232, 240], [176, 74, 232]][i].join(','), .5); gem(gx, gy, 1 + Math.sin(t * 3 + i) * .05, c); });
  cam(1); for (let i = 0; i < 50; i++) { const R = rng(i + 7), a = R() * 7 + t * (.2 + R() * .4), r = 100 + ((t * 120 + R() * 900) % 900); ell(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .6, 3, 3, 'rgba(255,230,160,.8)'); }
}
// ---------- SCAN MONITORS ----------
function bgMonitors(sc, t) {
  cam(0); sky2('#03100a', '#062018');
  const list = String(sc.heroes || 'sonic,tails,amy,shadow,metal,sonic').split(',').map(s => s.trim());
  const cols = 3, rows = Math.ceil(list.length / cols), one = rows === 1, mw = one ? W * .29 : W * .27, mh = one ? H * .46 : H * .32, gx = (W - cols * mw - (cols - 1) * 40) / 2, gy = one ? H * .26 : H * .12;
  cam(.4); list.forEach((who, i) => {
    const x = gx + (i % cols) * (mw + 40), y = gy + Math.floor(i / cols) * (mh + 40); box(x - 14, y - 14, mw + 28, mh + 28, '#111a16', 12); box(x, y, mw, mh, '#04281a', 4);
    X.save(); X.beginPath(); X.rect(x, y, mw, mh); X.clip();
    for (let k = 0; k < 14; k++) line(x + k * 40, y, x + k * 40, y + mh, 'rgba(60,255,140,.12)', 2);
    X.save(); X.translate(x + mw * .45, y + mh * .6); X.scale(.85, .85); X.globalAlpha = .95;
    if (who === 'metal') metalHead({}, t, false, 110, '#2b55c8', '#1a3070', '#5a80e8', '#c9d0dc', '#7d8697', 3); else { const k2 = TOON[who] || TOON.sonic; toonHead({ toon: who, mood: k2.mood }, k2, k2.fur, k2.skin, t, false, 110, i); }
    X.restore();
    X.fillStyle = 'rgba(60,255,140,.22)'; X.fillRect(x, y, mw, mh);
    const prog = Math.min(1, ((t * .5 + i * .17) % 1.4)), sy = y + prog * mh; box(x, sy - 3, mw, 6, 'rgba(160,255,200,.9)'); glowC(x + mw / 2, sy, mw * .5, '60,255,140', .3);
    for (let yy = y; yy < y + mh; yy += 6) box(x, yy, mw, 2, 'rgba(0,0,0,.2)');
    X.font = `700 30px ${FONT}`; X.fillStyle = '#7affb8'; X.fillText(who.toUpperCase(), x + 18, y + 40); X.font = `500 24px Roboto, sans-serif`; X.fillText('DATA ' + Math.floor(prog / 1.0 * 100 > 100 ? 100 : prog * 100) + '%', x + 18, y + mh - 20);
    X.restore();
  });
}
// ---------- NEWSPAPER ----------
function bgNews(sc, t) {
  cam(0); sky2('#3a2a20', '#20160f'); for (let i = 0; i < 12; i++) line(0, i * 100, W, i * 100 + 30, 'rgba(0,0,0,.2)', 30);
  cam(.6); X.save(); X.translate(W / 2, H * .48); X.rotate(-.06 + Math.sin(t * .5) * .01); const pw = 1100, ph = 760;
  box(-pw / 2 + 16, -ph / 2 + 20, pw, ph, 'rgba(0,0,0,.4)'); box(-pw / 2, -ph / 2, pw, ph, '#f2ead8');
  X.font = `700 70px Georgia, serif`; X.fillStyle = '#1a1a1a'; X.textAlign = 'center'; X.fillText('THE STATION SQUARE TIMES', 0, -ph / 2 + 90); line(-pw / 2 + 40, -ph / 2 + 115, pw / 2 - 40, -ph / 2 + 115, '#1a1a1a', 4);
  const hl = sc.headline || 'EGGMAN ATTACKS AGAIN'; let fz = 96; do { X.font = `700 ${fz}px ${FONT}`; fz -= 4; } while (X.measureText(hl).width > pw - 80); X.fillText(sc.headline || 'EGGMAN ATTACKS AGAIN', 0, -ph / 2 + 230);
  box(-pw / 2 + 50, -ph / 2 + 280, 480, 360, '#c8c0b0'); X.save(); X.translate(-pw / 2 + 290, -ph / 2 + 480); X.scale(1.1, 1.1); airship(0, 0, .7, t); X.restore();
  for (let i = 0; i < 12; i++) box(pw / 2 - 500, -ph / 2 + 290 + i * 28, 440 - (i % 3) * 40, 12, '#9a9488', 3);
  X.restore(); X.textAlign = 'left';
}
// ---------- WRECKAGE ----------
function bgWreck(sc, t) {
  cam(0); sky2('#1a1430', '#4a2a4a', '#c0603a'); stars(sc.seed, 60, t, H * .4);
  cam(.15); range(sc.seed, H * .7, H * .4, 80, '#2a1a2a', null, 300);
  cam(.35); for (let i = 0; i < 5; i++) { smoke(W * (.1 + i * .2), H * .62, t + i * 3, 1.6, 'rgba(60,50,60,'); }
  cam(1); box(-W, H * .8, W * 3, H, '#2a2228'); for (let i = 0; i < 14; i++) { const R = rng(i + 3), x = R() * W, y = H * (.78 + R() * .12); X.save(); X.translate(x, y); X.rotate(R() * 2 - 1); box(-60 - R() * 40, -14, 120 + R() * 80, 28, i % 3 ? '#4a505c' : '#3a3f6a', 4); X.restore(); }
  for (let i = 0; i < 4; i++) { const fx = W * (.15 + i * .25); campfire(fx, H * .86, .35, t); glowC(fx, H * .82, 180, '255,140,60', .4); }
}
const SW_WORLD = { lab: bgLab, planet: bgPlanet, speedway: bgSpeedway, zone: bgZone, fortress: bgFortress, overlord: bgOverlord, emeralds: bgEmeralds, monitors: bgMonitors, news: bgNews, wreck: bgWreck };
const SW_FG = { lab: FG_lab, speedway: FG_speedway, zone: FG_zone, fortress: FG_fortress };
const SW_DEF = { lab: { y: .9, s: .9 }, planet: { y: .92, s: .8 }, speedway: { y: .86, s: .85 }, zone: { y: .88, s: .85 }, fortress: { y: .86, s: .85 }, overlord: { y: .95, s: .8 }, emeralds: { y: .95, s: .9 }, wreck: { y: .9, s: .85 } };
const SW_BLOOM = { lab: .35, planet: .25, speedway: .5, zone: .15, fortress: .25, overlord: .5, emeralds: .6, monitors: .45, news: .05, wreck: .35 };

// ---------- MOTION GRAPHICS: kinetic text, hero burst, versus ----------
const HEROES = {
  metal: { metal: 1 }, neo: { metal: 1, cape: '#7a1a2a', metalColor: '#4a3aa8' }, sonic: { toon: 'sonic', mood: 'smug' }, amy: { toon: 'amy', mood: 'happy' },
  tails: { toon: 'tails', mood: 'happy', fly: 1 }, shadow: { toon: 'shadow' }, doctor: { egg: 1 }, mephiles: { toon: 'mephiles' }, supershadow: { toon: 'shadow', fur: '#f4e9a0', aura: 1, mood: 'angry', fly: 1 },
  maria: { kid: 1, skin: 'light', hair: '#f4d25a', hairstyle: 'long', headband: '#2a4aa8', iris: '#3aa0f0', outfit: 'dress', shirt: '#a8d8f4', color2: '#a8d8f4', jacket: '#3a5ab8', mood: 'happy' }, gerald: { old: 1, skin: 'light', hair: '#e8e4dc', bald: 1, mustache: '#f4f0e8', glasses: 1, outfit: 'robe', shirt: '#f4f4f4', color2: '#d8d8d8' }, super: { toon: 'sonic', fur: '#f2c43a', aura: 1, mood: 'angry', fly: 1 },
};
const MGPAL = [['#ff3a5a', '#ffb02e'], ['#2a6aff', '#22d3ee'], ['#8a2be2', '#ff4fd8'], ['#ff6a00', '#ffd400'], ['#00b894', '#a3ff3a'], ['#e11d48', '#7c3aed']];
function heroAt(name, x, y, s, t, mood, flip) {
  const c = Object.assign({ name, x: x / W, _y: y, _s: s, flip: !!flip }, HEROES[name] || HEROES.metal); if (mood) c.mood = mood;
  if (c.aura) c.aura = '255,220,90'; X.save(); drawChar(c, t, false, true); X.restore();
}
function burstBg(sc, t, c1, c2) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = rad(W / 2, H / 2, 0, W * .7, [c2, c1, hex(c1, -.5)]); X.fillRect(0, 0, W, H);
  X.save(); X.translate(W / 2, H * .5); X.rotate(t * .35); for (let i = 0; i < 28; i++) { X.rotate(Math.PI / 14); X.beginPath(); X.moveTo(0, 0); X.lineTo(-70, -1500); X.lineTo(70, -1500); X.closePath(); X.fillStyle = i % 2 ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.08)'; X.fill(); } X.restore();
  X.fillStyle = 'rgba(0,0,0,.14)'; for (let y = 0; y < H; y += 36) for (let x = (y / 36) % 2 * 18; x < W; x += 36) { const r = 3 + 6 * Math.hypot(x - W / 2, y - H / 2) / W; X.beginPath(); X.arc(x, y, r, 0, 7); X.fill(); }
}
// Fast sticker outline: draw on a transparent layer, stamp a white silhouette around it (canvas filters are ~10s/frame in software)
const OL = [0, 1].map(() => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; });
function outlined(draw, r) {
  const [bg, hero] = OL, bx = bg.getContext('2d'), hx = hero.getContext('2d'), m = X.getTransform();
  bx.clearRect(0, 0, W, H); bx.drawImage(C, 0, 0); X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, W, H); X.restore();
  draw(); hx.clearRect(0, 0, W, H); hx.drawImage(C, 0, 0);
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, W, H); X.drawImage(bg, 0, 0);
  bx.clearRect(0, 0, W, H); bx.drawImage(hero, 0, 0); bx.globalCompositeOperation = 'source-in'; bx.fillStyle = '#fff'; bx.fillRect(0, 0, W, H); bx.globalCompositeOperation = 'source-over';
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; X.drawImage(bg, Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r)); }
  X.drawImage(hero, 0, 0); X.restore(); X.setTransform(m);
}
function bgBurst(sc, t) {
  const lt = LT, pal = MGPAL[(sc.idx || 0) % MGPAL.length]; burstBg(sc, t, pal[0], pal[1]);
  const k = Math.min(1, lt / .35), pop = 1 + .25 * Math.max(0, 1 - lt / .35) * Math.sin(lt * 30), zoom = 1 + lt * .03;
  const R2 = rng(Math.floor(t * 12)); for (let i = 0; i < 24; i++) { const a = R2() * 7, r0 = 300 + R2() * 300; line(W / 2 + Math.cos(a) * r0, H * .55 + Math.sin(a) * r0, W / 2 + Math.cos(a) * (r0 + 500), H * .55 + Math.sin(a) * (r0 + 500), 'rgba(255,255,255,.5)', 4); }
  X.save(); X.translate(W / 2, H * .55); X.scale(k * pop * zoom, k * pop * zoom); X.rotate((sc.idx % 2 ? -1 : 1) * .04 + Math.sin(lt * 2) * .02); X.translate(-W / 2, -H * .55);
  outlined(() => heroAt(sc.hero, W / 2, H * 1.05, sc.hero === 'doctor' || sc.hero === 'maria' || sc.hero === 'gerald' ? 1.3 : 1.75, t, sc.mood, sc.flip), 12);
  X.restore();
}
function bgKinetic(sc, t) {
  const lt = LT, pal = MGPAL[((sc.idx || 0) + 3) % MGPAL.length];
  X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = lin(0, 0, W, H, [hex(pal[0], -.55), hex(pal[1], -.6)]); X.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) { const R2 = rng(i + (sc.idx || 0)), x = (R2() * W + t * (40 + R2() * 80)) % (W + 400) - 200, y = R2() * H, s = 80 + R2() * 220; X.save(); X.translate(x, y); X.rotate(t * (R2() - .5)); X.strokeStyle = `rgba(255,255,255,${.08 + R2() * .1})`; X.lineWidth = 10; i % 2 ? X.strokeRect(-s / 2, -s / 2, s, s) : (X.beginPath(), X.arc(0, 0, s / 2, 0, 7), X.stroke()); X.restore(); }
  const words = String(sc.kt || '').toUpperCase().split(/\s+/).filter(Boolean), per = Math.min(.32, (sc.dur * .6) / Math.max(1, words.length));
  X.font = `700 150px ${FONT}`; const lines = []; let cur = [];
  words.forEach(w => { cur.push(w); if (X.measureText(cur.join(' ')).width > W * .78) { cur.pop(); lines.push(cur); cur = [w]; } }); if (cur.length) lines.push(cur);
  let wi = 0; const lh = 170, y0 = H * .48 - (lines.length - 1) * lh / 2;
  lines.forEach((ln, li) => { const full = X.measureText(ln.join(' ')).width; let x = W / 2 - full / 2;
    ln.forEach(w => { const age = lt - wi * per, ww = X.measureText(w + ' ').width;
      if (age > 0) { const k = Math.min(1, age / .18), s = k < 1 ? .4 + .9 * k : 1 + .08 * Math.exp(-(age - .18) * 8) * Math.cos((age - .18) * 25), hot = /[A-Z]{5,}/.test(w) && wi % 2 === 0;
        X.save(); X.translate(x + ww / 2, y0 + li * lh); X.scale(s, s); X.rotate((wi % 3 - 1) * .03); X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
        X.strokeStyle = '#000'; X.lineWidth = 26; X.strokeText(w, 0, 0); X.fillStyle = hot ? pal[1] : '#fff'; X.fillText(w, 0, 0); X.restore(); }
      x += ww; wi++; }); });
  X.textAlign = 'left'; X.textBaseline = 'alphabetic';
}
function bgVersus(sc, t) {
  const lt = LT, [a, b] = String(sc.vs || 'sonic,metal').split('/'), k = Math.min(1, lt / .4), e = 1 - Math.pow(1 - k, 3);
  X.setTransform(1, 0, 0, 1, 0, 0);
  X.save(); X.beginPath(); X.moveTo(0, 0); X.lineTo(W * .56, 0); X.lineTo(W * .44, H); X.lineTo(0, H); X.closePath(); X.clip(); burstBg(sc, t, '#1e5aff', '#7ad0ff'); X.setTransform(1, 0, 0, 1, 0, 0); heroAt(a, W * .24 - (1 - e) * 700, H * .97, 1.3, t, 'angry', false); X.restore();
  X.save(); X.beginPath(); X.moveTo(W * .56, 0); X.lineTo(W, 0); X.lineTo(W, H); X.lineTo(W * .44, H); X.closePath(); X.clip(); burstBg(sc, t, '#e0122e', '#ff9a3a'); X.setTransform(1, 0, 0, 1, 0, 0); heroAt(b, W * .76 + (1 - e) * 700, H * .97, 1.3, t, 'angry', true); X.restore();
  X.beginPath(); X.moveTo(W * .56, -10); X.lineTo(W * .49, H * .45); X.lineTo(W * .53, H * .5); X.lineTo(W * .44, H + 10); X.strokeStyle = '#fff'; X.lineWidth = 22; X.shadowColor = '#ffe23a'; X.shadowBlur = 40; X.stroke(); X.shadowBlur = 0;
  const vk = Math.max(0, Math.min(1, (lt - .3) / .2)), vs = vk < 1 ? 3 - 2 * vk : 1 + .05 * Math.sin(lt * 10);
  X.save(); X.translate(W / 2, H * .45); X.scale(vs, vs); X.rotate(-.08); X.font = `700 260px ${FONT}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.globalAlpha = vk; X.strokeStyle = '#000'; X.lineWidth = 40; X.strokeText('VS', 0, 0); X.fillStyle = '#ffe23a'; X.fillText('VS', 0, 0); X.restore(); X.textAlign = 'left';
}
Object.assign(SW_WORLD, { burst: bgBurst, kinetic: bgKinetic, versus: bgVersus }); Object.assign(SW_BLOOM, { burst: .2, kinetic: .2, versus: .25 });
// ---------- COLD OPEN: eyes power on in the dark ----------
function bgEyes(sc, t) {
  const lt = LT - .7; X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
  const z = 1 + lt * .05, R = 330 * z, cx = W * .5 - R * .45, cy = H * .55;
  X.save(); X.translate(cx, cy); metalHead({}, 0, false, R, '#1d3a8a', '#0b1840', '#3a5ab0', '#8a93a4', '#4a5262', 1); X.restore();
  X.fillStyle = 'rgba(0,0,0,.86)'; X.fillRect(0, 0, W, H);
  X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(cx + R * .3, cy - R * 1.1, 0, R * 1.4, ['rgba(80,120,255,.25)', 'rgba(80,120,255,0)']); X.fillRect(0, 0, W, H); X.restore();
  const on = lt < .5 ? 0 : lt < .62 ? 1 : lt < .75 ? .15 : lt < .9 ? 1 : lt < 1 ? .4 : Math.min(1, .7 + (lt - 1) * .6);
  if (on > 0) for (const [ex, ey, k] of [[cx + R * .2, cy + R * .06, 1], [cx + R * .7, cy + R * .12, .75]]) {
    glowC(ex, ey, 260 * k * on, '255,25,15', .8 * on); ell(ex, ey, R * .14 * k, R * .2 * k, `rgba(255,40,25,${on})`); ell(ex, ey, R * .06 * k, R * .09 * k, `rgba(255,200,170,${on})`);
    if (lt > 1.1) { X.save(); X.globalCompositeOperation = 'lighter'; const fw = 700 * k * Math.min(1, (lt - 1.1) * 2); const g = X.createLinearGradient(ex - fw, 0, ex + fw, 0); g.addColorStop(0, 'rgba(255,40,20,0)'); g.addColorStop(.5, 'rgba(255,210,190,.9)'); g.addColorStop(1, 'rgba(255,40,20,0)'); X.fillStyle = g; X.fillRect(ex - fw, ey - 3, fw * 2, 6); X.restore(); }
  }
  for (let i = 0; i < 30; i++) { const R2 = rng(i + 5), x = (R2() * W + t * 15) % W, y = (R2() * H - t * (10 + R2() * 20) % H + H) % H; ell(x, y, 1.5, 1.5, `rgba(200,210,255,${.1 + R2() * .2})`); }
}
Object.assign(SW_WORLD, { eyes: bgEyes }); SW_BLOOM.eyes = .6;

// ---------- SHADOW: Space Colony ARK, Black Comet, shadow cold open ----------
function earthBall(x, y, r, t) {
  glowC(x, y, r * 1.5, '90,160,255', .35); X.save(); X.beginPath(); X.arc(x, y, r, 0, 7); X.clip();
  X.fillStyle = rad(x - r * .3, y - r * .3, 0, r * 1.2, ['#5ab0ff', '#1f5ec8', '#0a1e4a']); X.fillRect(x - r, y - r, r * 2, r * 2);
  for (let i = 0; i < 9; i++) { const R = rng(i + 31), cx = x + ((R() * 2.4 - 1.2 + t * .02) % 2.4 + 2.4) % 2.4 * r - 1.2 * r, cy = y + (R() - .5) * r * 1.4; ell(cx, cy, r * (.15 + R() * .25), r * (.1 + R() * .18), i % 3 ? '#3aa14a' : '#c8a35a'); }
  for (let i = 0; i < 8; i++) { const R = rng(i + 77), cx = x + ((R() * 2.4 - 1.2 + t * .035) % 2.4 + 2.4) % 2.4 * r - 1.2 * r, cy = y + (R() - .5) * r * 1.6; ell(cx, cy, r * (.2 + R() * .2), r * .04, 'rgba(255,255,255,.55)'); }
  X.fillStyle = rad(x + r * .45, y + r * .4, r * .2, r * 1.1, ['rgba(0,0,20,0)', 'rgba(0,0,20,.75)']); X.fillRect(x - r, y - r, r * 2, r * 2); X.restore();
}
function moonBall(x, y, r, bite) {
  glowC(x, y, r * 1.4, '230,230,210', .25); X.save(); X.beginPath(); X.arc(x, y, r, 0, 7); X.clip(); X.fillStyle = rad(x - r * .3, y - r * .3, 0, r * 1.2, ['#f4f2e6', '#b8b4a4', '#6a685e']); X.fillRect(x - r, y - r, r * 2, r * 2);
  for (let i = 0; i < 10; i++) { const R = rng(i + 3); ell(x + (R() - .5) * r * 1.4, y + (R() - .5) * r * 1.4, r * (.06 + R() * .1), r * (.06 + R() * .1), 'rgba(80,78,70,.35)'); }
  if (bite) { X.globalCompositeOperation = 'destination-out'; X.beginPath(); X.arc(x + r * .95, y - r * .2, r * .62, 0, 7); X.fill(); X.globalCompositeOperation = 'source-over'; } X.restore();
  if (bite) { X.beginPath(); X.arc(x + r * .95, y - r * .2, r * .62, 2.2, 4.1); X.strokeStyle = 'rgba(255,140,60,.8)'; X.lineWidth = 6; X.stroke(); }
}
function bgArk(sc, t) {
  cam(0); sky2('#02030a', '#070a1c'); stars(sc.seed, 260, t, H);
  const view = sc.view || 'earth', wx = W * .5, wy = H * .42, wr = H * .5;
  cam(.08); if (view === 'moon') moonBall(wx + 120, wy, 220, !!sc.beam && LT > 1.2); else earthBall(wx, wy + H * .55, H * .75, t);
  if (sc.beam) { const k = Math.max(0, Math.min(1, (LT - .6) / .4)); if (k > 0) { X.save(); X.globalCompositeOperation = 'lighter'; const g = X.createLinearGradient(0, H * .55, wx, wy); g.addColorStop(0, 'rgba(120,255,120,.0)'); g.addColorStop(1, 'rgba(160,255,160,.9)'); X.strokeStyle = g; X.lineWidth = 40 * k + 10 * Math.sin(t * 40); X.beginPath(); X.moveTo(-100, H * .8); X.lineTo(wx + 120, wy); X.stroke(); X.restore(); glowC(wx + 120, wy, 300 * k, '180,255,160', .7); } }
  // hull frame with round window
  cam(.3); X.save(); X.beginPath(); X.rect(-W, -H, W * 3, H * 3); X.moveTo(wx + wr, wy); X.arc(wx, wy, wr, 0, Math.PI * 2, true); X.closePath(); X.clip();
  for (let i = 0; i < 10; i++) for (let j = 0; j < 5; j++) rivetPanel(-300 + i * 260, -80 + j * 230, 250, 220, (i + j) % 2 ? '#2a2f3a' : '#262a34');
  X.restore(); X.beginPath(); X.arc(wx, wy, wr, 0, 7); X.strokeStyle = '#4a5262'; X.lineWidth = 36; X.stroke(); X.strokeStyle = '#8a93a4'; X.lineWidth = 8; X.stroke();
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; ell(wx + Math.cos(a) * wr, wy + Math.sin(a) * wr, 12, 12, '#bfc6d2'); }
  line(wx - wr, wy, wx + wr, wy, 'rgba(140,150,170,.35)', 6); line(wx, wy - wr, wx, wy + wr, 'rgba(140,150,170,.35)', 6);
  // floor
  cam(.6); box(-W, H * .86, W * 3, H * .3, '#1a1d24'); for (let i = 0; i < 30; i++) line(-W + i * 140, H * .86, -W + i * 140 - 60, H * 1.1, 'rgba(255,255,255,.05)', 3); box(-W, H * .86, W * 3, 8, '#5a6272');
  if (sc.pod) { const px = W * .78, py = H * .62; glowC(px, py, 260, '120,255,200', .45 + .1 * Math.sin(t * 3)); box(px - 110, py - 190, 220, 400, '#3a4250', 100); box(px - 84, py - 160, 168, 320, 'rgba(120,255,200,.35)', 84); line(px - 50, py - 120, px - 50, py + 100, 'rgba(255,255,255,.4)', 6); box(px - 130, py + 190, 260, 40, '#2a2f3a', 8); }
  if (sc.alarm && Math.floor(t * 2.5) % 2) { X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = 'rgba(255,20,20,.16)'; X.fillRect(0, 0, W, H); }
}
function bgComet(sc, t) {
  cam(0); sky2('#0a0006', '#2a0418', '#5a0a1a'); stars(sc.seed, 160, t, H);
  cam(.15); X.save(); X.translate(W * .52, H * .42 + Math.sin(t * .8) * 14); X.rotate(-.15);
  glowC(0, 0, 640, '255,40,60', .35); X.beginPath(); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, r = 380 + (hash(i + 9) - .5) * 120; X.lineTo(Math.cos(a) * r * 1.3, Math.sin(a) * r * .8); } X.closePath(); X.fillStyle = rad(-80, -80, 40, 520, ['#5a2a4a', '#2a0e22', '#12040c']); X.fill();
  for (let i = 0; i < 14; i++) { const R = rng(i + 50); ell((R() - .5) * 800, (R() - .5) * 420, 20 + R() * 40, 12 + R() * 20, 'rgba(255,60,80,' + (.3 + .3 * Math.sin(t * 3 + i)) + ')'); }
  const open = Math.min(1, LT / .8); ell(0, 0, 150, 90 * open, '#ffdf3a'); ell(0, 0, 42, 70 * open, '#c80a1a'); glowC(0, 0, 260, '255,200,40', .5 * open); X.restore();
  cam(.7); for (let i = 0; i < 9; i++) { const R = rng(i + 90), x = ((R() * W * 1.4 + t * 260 * (R() + .5)) % (W * 1.6)) - W * .3, y = H * (.55 + R() * .4); X.save(); X.translate(x, y); X.rotate(-.5); ell(0, 0, 50, 16, '#1a0a14'); ell(16, 0, 8, 6, '#ff2a3a'); X.restore(); }
}
// Cold open variant: `scene: eyes` + `who: shadow`
const _eyesMetal = bgEyes;
function bgEyesWho(sc, t) {
  if (sc.who !== 'shadow') return _eyesMetal(sc, t);
  const lt = LT - .7; X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
  const z = 1 + Math.max(0, lt) * .04; X.save(); X.translate(W / 2, H * .5); X.scale(z, z); X.translate(-W / 2, -H * .5);
  heroAt('shadow', W * .5, H * 2.55, 4.2, 0, 'angry', false); X.restore();
  X.fillStyle = 'rgba(0,0,0,.84)'; X.fillRect(0, 0, W, H);
  X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(W * .5, -H * .2, 0, W * .7, ['rgba(255,40,60,.22)', 'rgba(255,40,60,0)']); X.fillRect(0, 0, W, H); X.restore();
  const on = lt < .5 ? 0 : lt < .62 ? 1 : lt < .75 ? .15 : lt < .9 ? 1 : lt < 1 ? .4 : Math.min(1, .7 + (lt - 1) * .6);
  const ex = sc.ex ? String(sc.ex).split(',').map(Number) : [.555, .43, .69, .44];
  if (on > 0) for (const [px, py, k] of [[ex[0], ex[1], 1], [ex[2], ex[3], .8]]) {
    const x = (W / 2 + (px * W - W / 2) * z), y = H * .5 + (py * H - H * .5) * z; glowC(x, y, 240 * k * on, '255,20,40', .8 * on);
    X.save(); X.translate(x, y); X.rotate(-.12); ell(0, 0, 46 * k, 30 * k, `rgba(255,30,50,${on})`); ell(6, 0, 16 * k, 22 * k, `rgba(255,210,200,${on})`); X.restore();
    if (lt > 1.1) { X.save(); X.globalCompositeOperation = 'lighter'; const fw = 700 * k * Math.min(1, (lt - 1.1) * 2), g = X.createLinearGradient(x - fw, 0, x + fw, 0); g.addColorStop(0, 'rgba(255,30,40,0)'); g.addColorStop(.5, 'rgba(255,210,200,.9)'); g.addColorStop(1, 'rgba(255,30,40,0)'); X.fillStyle = g; X.fillRect(x - fw, y - 3, fw * 2, 6); X.restore(); }
  }
}
Object.assign(SW_WORLD, { ark: bgArk, comet: bgComet, eyes: bgEyesWho }); Object.assign(SW_BLOOM, { ark: .35, comet: .4 });
