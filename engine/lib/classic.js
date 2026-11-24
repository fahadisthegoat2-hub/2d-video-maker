// detailed interior / industrial / MG backgrounds
function plank(x, y, w, h, col, r) { box(x, y, w, h, col, r || 0); }
function bgRoom(sc, t) {
  const p = PAL[sc.palette] || PAL.warm, R = rng(sc.seed), hz = H * .74;
  // ---- wall boards ----
  X.fillStyle = p.wall; X.fillRect(0, 0, W, hz);
  for (let x = 0, i = 0; x < W; x += 112, i++) {
    X.fillStyle = `rgba(${i % 2 ? '255,255,255,.05' : '0,0,0,.03'})`; X.fillRect(x, 0, 112, hz);
    X.fillStyle = 'rgba(0,0,0,.09)'; X.fillRect(x, 0, 3, hz); X.fillStyle = 'rgba(255,255,255,.18)'; X.fillRect(x + 3, 0, 2, hz);
  }
  X.fillStyle = lin(0, 0, 0, 240, ['rgba(40,20,0,.22)', 'rgba(40,20,0,0)']); X.fillRect(0, 0, W, 240);
  // ---- wainscot with framed panels ----
  const wy = H * .5;
  X.fillStyle = lin(0, wy, 0, hz, [p.wood, hex(p.wood, -.12)]); X.fillRect(0, wy, W, hz - wy);
  for (let x = 20; x < W; x += 210) {
    box(x, wy + 46, 180, hz - wy - 90, hex(p.wood, -.06), 3);
    line(x, wy + 46, x + 180, wy + 46, 'rgba(0,0,0,.3)', 4); line(x, wy + 46, x, hz - 44, 'rgba(0,0,0,.25)', 4);
    line(x, hz - 44, x + 180, hz - 44, 'rgba(255,220,180,.18)', 3); line(x + 180, wy + 46, x + 180, hz - 44, 'rgba(255,220,180,.14)', 3);
  }
  box(0, wy - 6, W, 22, p.woodD); box(0, wy - 6, W, 6, hex(p.woodD, .2)); box(0, wy + 16, W, 8, 'rgba(0,0,0,.2)');
  box(0, hz - 26, W, 26, p.woodD); box(0, hz - 26, W, 4, hex(p.woodD, .18));
  // ---- window ----
  const wx = 110, ww = 440, wh = H * .44;
  X.fillStyle = lin(0, 0, 0, wh, p.sky); X.fillRect(wx, 0, ww, wh);
  const roofs = ['#d99c80', '#c98a70', '#e0aa8c'];
  for (let i = 0; i < 8; i++) { const bx = wx + i * 58 - 10, bw = 50 + R() * 40, bh = 50 + R() * 110; X.fillStyle = roofs[i % 3]; X.fillRect(bx, wh - bh, bw, bh); X.beginPath(); X.moveTo(bx - 6, wh - bh); X.lineTo(bx + bw / 2, wh - bh - 30); X.lineTo(bx + bw + 6, wh - bh); X.fill(); X.fillRect(bx + bw * .7, wh - bh - 38, 10, 24); }
  X.save(); X.globalAlpha = .18; X.fillStyle = '#fff'; X.beginPath(); X.moveTo(wx + 60, 0); X.lineTo(wx + 140, 0); X.lineTo(wx + 40, wh); X.lineTo(wx - 40, wh); X.fill(); X.beginPath(); X.moveTo(wx + 280, 0); X.lineTo(wx + 310, 0); X.lineTo(wx + 210, wh); X.lineTo(wx + 180, wh); X.fill(); X.restore();
  X.strokeStyle = hex(p.woodD, .1); X.lineWidth = 22; X.strokeRect(wx, -12, ww, wh + 12);
  X.strokeStyle = 'rgba(0,0,0,.25)'; X.lineWidth = 4; X.strokeRect(wx + 11, -12, ww - 22, wh + 1);
  X.lineWidth = 12; X.strokeStyle = p.woodD; X.beginPath(); X.moveTo(wx + ww / 2, 0); X.lineTo(wx + ww / 2, wh); X.moveTo(wx, wh * .52); X.lineTo(wx + ww, wh * .52); X.stroke();
  // curtains (sway smoothly)
  for (const sd of [0, 1]) {
    const cx = sd ? wx + ww - 50 : wx - 60, sw = Math.sin(t * .9 + sd) * 7;
    for (let k = 0; k < 5; k++) {
      const x0 = cx + k * 22; X.beginPath(); X.moveTo(x0, 0); X.lineTo(x0 + 24, 0); X.quadraticCurveTo(x0 + 22 + sw, wh * .6, x0 + 24 + sw * 1.4 + (sd ? 8 : -8) * k * .5, wh + 60); X.lineTo(x0 + sw * 1.4 + (sd ? 8 : -8) * k * .5 - 2, wh + 60); X.closePath();
      X.fillStyle = k % 2 ? '#f4dcae' : '#ddb47a'; X.fill();
    }
    box(cx - 6, wh * .55, 124, 16, '#b0773c', 6);
  }
  box(0, -2, W * .34, 18, '#5a3a24', 4);                                                     // rod
  // sill + plant
  box(wx - 80, wh, ww + 160, 26, p.woodD, 3); box(wx - 80, wh, ww + 160, 6, hex(p.woodD, .25)); box(wx - 70, wh + 26, ww + 140, 10, 'rgba(0,0,0,.25)');
  const px = wx + 100;
  X.fillStyle = '#c2683e'; X.beginPath(); X.moveTo(px - 42, wh - 52); X.lineTo(px + 42, wh - 52); X.lineTo(px + 32, wh); X.lineTo(px - 32, wh); X.fill(); box(px - 46, wh - 60, 92, 14, '#d27a4c', 3); box(px + 10, wh - 46, 20, 44, 'rgba(0,0,0,.12)');
  for (let i = 0; i < 9; i++) { const a = -2.6 + i * .32 + Math.sin(t * 1.2 + i) * .03, L = 50 + (i % 3) * 14; X.save(); X.translate(px, wh - 60); X.rotate(a + Math.PI / 2); X.beginPath(); X.moveTo(0, 0); X.quadraticCurveTo(14, L * .5, 0, L); X.quadraticCurveTo(-14, L * .5, 0, 0); X.fillStyle = i % 2 ? '#4f8a3c' : '#5f9e48'; X.fill(); line(0, 4, 0, L - 6, 'rgba(0,0,0,.15)', 2); X.restore(); }
  for (let i = 0; i < 4; i++) { ell(px - 18 + i * 12, wh - 118 + (i % 2) * 10, 8, 8, '#d8382f'); ell(px - 20 + i * 12, wh - 121 + (i % 2) * 10, 2.5, 2.5, 'rgba(255,255,255,.7)'); }
  // ---- long-case clock ----
  const cx = W * .4;
  box(cx - 60, 0, 120, 330, p.woodD, 6); box(cx - 60, 0, 14, 330, 'rgba(255,255,255,.06)'); box(cx + 46, 0, 14, 330, 'rgba(0,0,0,.2)');
  box(cx - 72, -10, 144, 26, hex(p.woodD, -.2), 4); box(cx - 66, 322, 132, 14, hex(p.woodD, -.2), 3);
  ell(cx, 80, 48, 48, '#f5edda'); ell(cx, 80, 48, 48); X.strokeStyle = '#3a2a1a'; X.lineWidth = 5; X.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; line(cx + Math.cos(a) * 38, 80 + Math.sin(a) * 38, cx + Math.cos(a) * (i % 3 ? 42 : 34), 80 + Math.sin(a) * (i % 3 ? 42 : 34), '#2a2018', i % 3 ? 2 : 4); }
  X.lineCap = 'round'; line(cx, 80, cx + Math.cos(t * .05 - 1.2) * 24, 80 + Math.sin(t * .05 - 1.2) * 24, '#1a1410', 5); line(cx, 80, cx + Math.cos(t * .6 - 2.2) * 36, 80 + Math.sin(t * .6 - 2.2) * 36, '#1a1410', 3); ell(cx, 80, 5, 5, '#c9a24a');
  ell(cx - 18, 64, 14, 6, 'rgba(255,255,255,.4)', -.6);
  box(cx - 34, 142, 68, 170, '#1f1410', 4);
  X.save(); X.beginPath(); X.rect(cx - 34, 142, 68, 170); X.clip(); X.translate(cx, 146); X.rotate(Math.sin(t * 3.2) * .22); box(-3, 0, 6, 130, '#c9a24a'); glow('rgba(255,210,120,.6)', 14); ell(0, 138, 18, 18, '#e2b84e'); noGlow(); ell(-5, 133, 6, 6, '#f8e3a0'); X.restore();
  // ---- drawer cabinet ----
  const kx = W * .56, ky = 400, kw = 130;
  box(kx, ky, kw, hz - ky + 40, hex(p.woodD, .05)); box(kx - 8, ky - 16, kw + 16, 20, hex(p.woodD, -.15), 3); box(kx + kw - 16, ky, 16, hz - ky + 40, 'rgba(0,0,0,.2)');
  for (let i = 0; i < 9; i++) { const dy = ky + 14 + i * 44; box(kx + 10, dy, kw - 30, 36, hex(p.wood, -.02), 3); line(kx + 10, dy + 36, kx + kw - 20, dy + 36, 'rgba(0,0,0,.35)', 3); ell(kx + kw / 2 - 10, dy + 18, 6, 6, '#d6a83c'); ell(kx + kw / 2 - 12, dy + 16, 2, 2, '#fff3c0'); }
  // ---- pegboard + tools ----
  const bx = W * .7, by = 20, bw = W * .3 - 10, bh = 300;
  box(bx + 10, by + 10, bw, bh, 'rgba(0,0,0,.25)', 4); box(bx, by, bw, bh, hex(p.wood, .06), 4);
  X.fillStyle = 'rgba(0,0,0,.25)'; for (let gx = bx + 20; gx < bx + bw; gx += 26) for (let gy = by + 20; gy < by + bh; gy += 26) X.fillRect(gx, gy, 4, 4);
  box(bx + 14, by + 34, bw - 28, 10, '#3e2a1c', 3);
  for (let i = 0; i < 4; i++) { const tx = bx + 50 + i * 50; X.save(); X.translate(tx, by + 46); line(0, 0, -10, 70, '#9aa3ad', 8); line(8, 0, 14, 70, '#9aa3ad', 8); line(-10, 70, -16, 120, '#c48a3c', 10); line(14, 70, 18, 120, '#c48a3c', 10); ell(2, 4, 8, 8, '#6b7480'); X.restore(); }
  for (let i = 0; i < 5; i++) { const tx = bx + 50 + i * 44; line(tx, by + 170, tx, by + 230, '#b6bec8', 6); box(tx - 9, by + 228, 18, 40, '#d6a83c', 8); }
  X.strokeStyle = '#9aa3ad'; X.lineWidth = 8; X.strokeRect(bx + 290, by + 60, 90, 120); box(bx + 380, by + 160, 26, 70, '#c48a3c', 6);
  for (let i = 0; i < 2; i++) { const tx = bx + 440 + i * 70; box(tx - 5, by + 60, 10, 170, '#9aa3ad', 3); }
  for (let i = 0; i < 2; i++) { const tx = bx + 510 + i * 55; box(tx - 4, by + 80, 8, 150, '#c48a3c', 3); box(tx - 22, by + 60, 44, 24, '#9aa3ad', 4); }
  // ---- floor: perspective planks ----
  X.fillStyle = lin(0, hz, 0, H, [hex(p.floor, -.18), p.floor]); X.fillRect(0, hz, W, H - hz);
  const vx = W / 2, vy = hz - 900;
  for (let i = -16; i < 17; i++) { const xb = W / 2 + i * 150; X.beginPath(); X.moveTo(lerp(vx, xb, (hz - vy) / (H - vy)), hz); X.lineTo(xb, H); X.strokeStyle = 'rgba(0,0,0,.16)'; X.lineWidth = 3; X.stroke();
    if (i % 2) { X.fillStyle = 'rgba(255,255,255,.025)'; X.beginPath(); X.moveTo(lerp(vx, xb, (hz - vy) / (H - vy)), hz); X.lineTo(xb, H); X.lineTo(xb + 150, H); X.lineTo(lerp(vx, xb + 150, (hz - vy) / (H - vy)), hz); X.fill(); } }
  for (let k = 1; k < 7; k++) { const yy = hz + (H - hz) * Math.pow(k / 7, 1.5); for (let j = 0; j < 6; j++) { const xx = R() * W; line(xx, yy, xx + 2, yy + 12 * k / 3, 'rgba(0,0,0,.18)', 2); } }
  X.fillStyle = lin(0, hz, 0, hz + 60, ['rgba(0,0,0,.35)', 'rgba(0,0,0,0)']); X.fillRect(0, hz, W, 60);                 // AO
  // sunlight patch on floor
  X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = p.light + '.10)'; X.beginPath(); X.moveTo(wx + 380, hz + 20); X.lineTo(wx + 820, hz + 20); X.lineTo(wx + 1100, H); X.lineTo(wx + 500, H); X.fill(); X.restore();
  // ---- workbench ----
  const tx = W * .63, ty = H * .55, tw = W * .4;
  box(tx + 30, hz + 30, tw - 30, 30, 'rgba(0,0,0,.25)', 10);
  box(tx + 24, ty + 26, 34, hz - ty + 40, hex(p.woodD, -.1)); box(tx + tw - 70, ty + 26, 34, hz - ty + 40, hex(p.woodD, -.1));
  box(tx + 40, hz - 20, tw - 80, 18, hex(p.woodD, -.05)); box(tx + 300, hz - 110, 150, 90, '#9b6a45', 4); box(tx + 300, hz - 110, 150, 14, '#b07c52', 4);
  box(tx + 470, hz - 80, 80, 60, '#cfd5dc', 3); box(tx + 480, hz - 100, 60, 26, '#e7ebef', 3);
  box(tx, ty, tw, 26, p.woodD, 3); box(tx, ty, tw, 7, hex(p.woodD, .22), 3); box(tx + 10, ty + 26, tw - 20, 70, hex(p.woodD, -.08));
  box(tx + tw * .55, ty + 36, 200, 50, hex(p.wood, -.05), 3); ell(tx + tw * .55 + 100, ty + 61, 9, 9, '#d6a83c');
  // stool
  const sx2 = tx + tw * .55;
  box(sx2 - 8, ty - 230, 16, 230, '#4a3426', 3); ell(sx2, ty - 236, 90, 16, '#5b2e46'); ell(sx2, ty - 242, 90, 14, '#6e3a56'); box(sx2 - 50, ty - 8, 100, 10, '#3a2a1e', 4);
  // anvil
  X.save(); X.translate(tx + 130, ty); X.fillStyle = '#3c4350'; X.beginPath(); X.moveTo(-70, -46); X.lineTo(60, -46); X.quadraticCurveTo(110, -46, 120, -36); X.lineTo(50, -30); X.lineTo(36, -16); X.lineTo(50, 0); X.lineTo(-50, 0); X.lineTo(-36, -16); X.lineTo(-60, -30); X.closePath(); X.fill();
  box(-70, -50, 130, 10, '#5b6573', 3); box(-50, -50, 70, 4, '#e2b84e'); X.restore();
  // alcohol lamp with smooth flame
  const lx = tx + 300; ell(lx, ty - 26, 30, 26, 'rgba(180,215,235,.85)'); box(lx - 8, ty - 60, 16, 20, '#c9d3dc', 3);
  ell(lx - 10, ty - 34, 6, 10, 'rgba(255,255,255,.6)'); box(lx - 30, ty - 4, 60, 6, 'rgba(0,0,0,.2)', 3);
  X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(lx, ty - 90, 0, 160, ['rgba(255,190,90,.35)', 'rgba(255,190,90,0)']); X.fillRect(lx - 160, ty - 250, 320, 320); X.restore();
  const fl = 1 + noise(t * 6, 2) * .12; glow('#ffb040', 30); X.beginPath(); X.moveTo(lx, ty - 112 * fl); X.quadraticCurveTo(lx + 16, ty - 72, lx, ty - 60); X.quadraticCurveTo(lx - 16, ty - 72, lx, ty - 112 * fl); X.fillStyle = '#ffd36a'; X.fill(); noGlow(); ell(lx, ty - 72, 5, 9, '#fff6d8');
  // coil + loupe
  for (let i = 0; i < 5; i++) { X.beginPath(); X.arc(tx + tw - 110, ty - 40, 40 - i * 7, 0, 7); X.strokeStyle = i % 2 ? '#b8683e' : '#d4895a'; X.lineWidth = 6; X.stroke(); }
  X.beginPath(); X.arc(tx + 420, ty - 26, 18, 0, 7); X.strokeStyle = '#2b2b30'; X.lineWidth = 7; X.stroke(); line(tx + 436, ty - 16, tx + 452, ty - 4, '#2b2b30', 8);
  for (let i = 0; i < 6; i++) box(tx + 40 + R() * tw * .8, H - 60 - R() * 140, 14, 8, 'rgba(255,245,220,.6)', 2);
  // ---- rug ----
  X.beginPath(); X.moveTo(W * .02, H + 20); X.lineTo(W * .2, hz + 70); X.lineTo(W * .76, hz + 70); X.lineTo(W * .9, H + 20); X.closePath(); X.fillStyle = p.rug; X.fill();
  X.beginPath(); X.moveTo(W * .06, H + 20); X.lineTo(W * .215, hz + 86); X.lineTo(W * .745, hz + 86); X.lineTo(W * .865, H + 20); X.strokeStyle = p.rugB; X.lineWidth = 9; X.stroke();
  X.fillStyle = 'rgba(255,255,255,.04)'; X.beginPath(); X.moveTo(W * .2, hz + 70); X.lineTo(W * .76, hz + 70); X.lineTo(W * .7, hz + 160); X.lineTo(W * .25, hz + 160); X.fill();
  // ---- light shaft + dust ----
  X.save(); X.globalCompositeOperation = 'lighter';
  X.beginPath(); X.moveTo(wx, 0); X.lineTo(wx + ww, 0); X.lineTo(wx + ww + 820, H); X.lineTo(wx + 360, H); X.closePath();
  X.fillStyle = lin(wx, 0, wx + 700, H, [p.light + '.22)', p.light + '.0)']); X.fill(); X.restore();
  dust(sc, t, 60, 'rgba(255,240,200,');
}
function bgOutdoor(sc, t) {
  const R = rng(sc.seed), hz = H * .6;
  X.fillStyle = lin(0, 0, 0, hz, ['#6fb3e8', '#bfe0f7', '#eef6fb']); X.fillRect(0, 0, W, hz);
  X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(W * .82, H * .15, 0, 500, ['rgba(255,245,210,.9)', 'rgba(255,245,210,.25)', 'rgba(255,245,210,0)']); X.fillRect(0, 0, W, H); X.restore();
  for (let i = 0; i < 7; i++) { const cx = ((R() * W + t * (10 + i * 4)) % (W + 500)) - 250, cy = 60 + R() * 200, s = .6 + R() * .8; X.fillStyle = 'rgba(255,255,255,.92)'; for (let k = 0; k < 5; k++) ell(cx + k * 40 * s, cy - (k % 2) * 22 * s, 55 * s, 28 * s); X.fillStyle = 'rgba(160,190,220,.25)'; ell(cx + 80 * s, cy + 18 * s, 110 * s, 10 * s); }
  for (let i = 0; i < 3; i++) { const bx2 = (W * .3 + t * 40 + i * 70) % W, by2 = 160 + Math.sin(t + i) * 10; X.strokeStyle = '#556'; X.lineWidth = 3; X.beginPath(); X.moveTo(bx2 - 10, by2); X.quadraticCurveTo(bx2 - 5, by2 - 6 + Math.sin(t * 8 + i) * 4, bx2, by2); X.quadraticCurveTo(bx2 + 5, by2 - 6 + Math.sin(t * 8 + i) * 4, bx2 + 10, by2); X.stroke(); }
  // sea with drifting wave glyphs
  X.fillStyle = lin(0, hz - 90, 0, hz, ['#5aa0d4', '#3c82b8']); X.fillRect(0, hz - 90, W, 90);
  for (let row = 0; row < 3; row++) { X.fillStyle = row % 2 ? '#2f6e9f' : '#6db0de'; for (let x = -60; x < W + 60; x += 46) { const o = Math.sin(t * 1.6 + x * .04 + row) * 4, xx = x + (t * 12 * (row + 1)) % 46; X.beginPath(); X.moveTo(xx, hz - 60 + row * 22 + o); X.lineTo(xx + 23, hz - 78 + row * 22 + o); X.lineTo(xx + 46, hz - 60 + row * 22 + o); X.fill(); } }
  X.fillStyle = '#e8cf98'; X.beginPath(); X.moveTo(0, hz); for (let x = 0; x <= W; x += 40) X.lineTo(x, hz - 24 - Math.sin(x * .004) * 22); X.lineTo(W, hz + 10); X.lineTo(0, hz + 10); X.fill();
  X.fillStyle = '#7fa35a'; X.fillRect(0, hz - 6, W, 34);
  for (let i = 0; i < 6; i++) { const mx = 200 + i * 330; X.fillStyle = '#5f8a44'; X.beginPath(); X.moveTo(mx, hz + 4); X.quadraticCurveTo(mx + 60, hz - 40, mx + 120, hz + 4); X.fill(); }
  // poles + sagging wires (sway)
  const poles = [W * .17, W * .5, W * .83];
  poles.forEach(px => { box(px - 5, hz - 360, 10, 360, '#4a3a2c'); box(px - 60, hz - 340, 120, 10, '#4a3a2c'); ell(px - 50, hz - 346, 5, 7, '#cfd6dd'); ell(px + 50, hz - 346, 5, 7, '#cfd6dd'); });
  X.strokeStyle = '#2a2a2a'; X.lineWidth = 2; for (const off of [-50, 50]) { X.beginPath(); X.moveTo(-20, hz - 330); for (const px of poles) X.quadraticCurveTo(px - 160, hz - 290 + Math.sin(t * .8) * 3, px + off, hz - 345); X.quadraticCurveTo(W - 100, hz - 290, W + 20, hz - 330); X.stroke(); }
  // fence
  X.strokeStyle = 'rgba(40,50,40,.5)'; X.lineWidth = 2; for (let x = 0; x < W; x += 12) line(x, hz + 26, x, hz - 64, 'rgba(40,50,40,.45)', 2);
  for (let x = 0; x < W; x += 240) box(x, hz - 72, 8, 100, '#59615a'); box(0, hz - 70, W, 5, '#59615a');
  // ground
  X.fillStyle = lin(0, hz, 0, H, ['#e8e1d1', '#d4cbb6']); X.fillRect(0, hz + 26, W, H);
  for (let i = 0; i < 9; i++) line(0, hz + 50 + i * i * 9, W, hz + 50 + i * i * 9, 'rgba(0,0,0,.06)', 3);
  for (let i = -8; i < 9; i++) line(W / 2 + i * 60, hz + 26, W / 2 + i * 260, H, 'rgba(0,0,0,.04)', 2);
  box(0, hz + 300, W, 6, 'rgba(210,170,60,.5)');
  // building
  box(0, hz - 250, 430, 400, '#ddd6c8'); box(0, hz - 270, 470, 26, '#c6bead', 2); box(420, hz - 250, 14, 400, 'rgba(0,0,0,.12)');
  for (let y = hz - 240; y < hz + 140; y += 34) line(0, y, 430, y, 'rgba(0,0,0,.04)', 2);
  box(30, hz - 140, 170, 40, '#2b2f36'); box(110, hz + 10, 80, 140, '#3a4048'); ell(178, hz + 80, 4, 4, '#c9a24a');
  // scaffold tower
  const sx = W * .37, sh = 520;
  for (const dx of [0, 190]) box(sx + dx, hz + 60 - sh, 14, sh, '#f1ece0');
  for (let k = 0; k < 6; k++) { const yy = hz + 60 - sh + k * sh / 6; box(sx, yy, 204, 10, '#f1ece0'); line(sx + 7, yy + 5, sx + 197, yy + sh / 6, '#e6dfd0', 7); line(sx + 197, yy + 5, sx + 7, yy + sh / 6, '#e6dfd0', 7); }
  box(sx + 30, hz - 360, 150, 260, '#7d8590'); for (let k = 0; k < 14; k++) box(sx + 36 + k * 10, hz - 360, 4, 260, k % 2 ? '#5c636d' : '#9aa1aa');
  // platform + cylinders + crates + cart
  box(W * .1, hz + 120, 560, 70, '#8b9199', 3); box(W * .1, hz + 120, 560, 12, '#b3b8be', 3);
  for (const lx2 of [W * .12, W * .4]) { box(lx2, hz + 190, 12, 260, '#f1ece0'); } line(W * .12, hz + 200, W * .4, hz + 440, '#f1ece0', 10); line(W * .4, hz + 200, W * .12, hz + 440, '#f1ece0', 10);
  [['#5aa36a', 0], ['#e4e4e4', 50]].forEach(([cc, dx]) => { const cx2 = W * .47 + dx; box(cx2, hz - 30, 40, 150, cc, 18); box(cx2 + 12, hz - 46, 16, 20, hex(cc, -.3), 4); box(cx2 + 28, hz - 20, 8, 130, 'rgba(0,0,0,.15)', 4); });
  [['#d6453a', 0], ['#3b6fb0', 46]].forEach(([cc, dx]) => { const cx2 = W * .18 + dx; box(cx2, H - 290, 38, 150, cc, 18); box(cx2 + 11, H - 306, 16, 20, hex(cc, -.3), 4); });
  box(W * .16, H - 140, 120, 18, '#3a3a40', 4); ell(W * .17, H - 112, 20, 20, '#1e1e22'); ell(W * .23, H - 112, 20, 20, '#1e1e22');
  for (let i = 0; i < 3; i++) { const cx2 = 10 + i * 90, cy2 = H - 170 + (i === 1 ? -60 : 0); box(cx2, cy2, 86, 60, '#d9c38f', 3); box(cx2 + 36, cy2, 14, 60, '#c4ab73'); box(cx2 + 70, cy2, 16, 60, 'rgba(0,0,0,.1)'); }
  // haze
  X.fillStyle = lin(0, hz - 120, 0, hz, ['rgba(255,255,255,0)', 'rgba(255,255,255,.18)']); X.fillRect(0, hz - 120, W, 120);
}
function bgHall(sc, t) {
  X.fillStyle = lin(0, 0, 0, H, ['#f7ecd6', '#ecdab8']); X.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) {
    const x = 130 + i * 300; box(x, 50, 230, 600, '#fffaf0'); box(x, 50, 230, 600, lin(0, 50, 0, 650, ['rgba(255,240,210,.0)', 'rgba(210,180,130,.25)']));
    X.strokeStyle = '#d8c39a'; X.lineWidth = 8; X.strokeRect(x, 50, 230, 600); line(x + 115, 50, x + 115, 650, '#d8c39a', 5);
    for (let k = 1; k < 5; k++) line(x, 50 + k * 120, x + 230, 50 + k * 120, '#e2d2b0', 3);
    for (let k = 0; k < 3; k++) { const lx = x + 40 + k * 60; X.fillStyle = 'rgba(200,150,70,.35)'; X.beginPath(); X.moveTo(lx, 130 + k * 40); X.lineTo(lx + 16, 110 + k * 40); X.lineTo(lx + 30, 134 + k * 40); X.fill(); }
  }
  for (let i = 0; i < 7; i++) {
    const x = 70 + i * 300;
    for (let k = 0; k < 4; k++) { const sw = Math.sin(t * .8 + i + k) * 2; box(x + k * 22 + sw, 0, 24, 730, k % 2 ? '#a5523b' : '#c06a4f'); }
    box(x - 6, 380, 100, 14, '#d4a63c', 6); box(x - 10, 0, 110, 20, '#7a3324');
  }
  box(0, 650, W, 20, '#c9b28a'); X.fillStyle = '#6b3d2a'; X.fillRect(0, 670, W, H);
  // clock + sconce
  const cx = 600; box(cx - 26, 300, 52, 230, '#4a2c1e', 4); ell(cx, 340, 22, 22, '#f5edda'); line(cx, 340, cx + 12, 330, '#222', 3); X.save(); X.translate(cx, 375); X.rotate(Math.sin(t * 3) * .2); box(-2, 0, 4, 120, '#c9a24a'); ell(0, 124, 10, 10, '#e2b84e'); X.restore();
  glow('rgba(255,210,140,.9)', 40); ell(1290, 380, 14, 20, '#fff2cc'); noGlow(); box(1286, 396, 8, 50, '#c9a24a');
  // throne chair
  X.beginPath(); X.moveTo(W / 2 - 110, 720); X.lineTo(W / 2 - 110, 420); X.quadraticCurveTo(W / 2, 220, W / 2 + 110, 420); X.lineTo(W / 2 + 110, 720); X.fillStyle = lin(W / 2 - 110, 0, W / 2 + 110, 0, ['#4e3224', '#6e4a36', '#3e261b']); X.fill();
  X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 4; X.beginPath(); X.moveTo(W / 2, 300); X.quadraticCurveTo(W / 2 - 20, 500, W / 2, 700); X.stroke();
  // side chairs
  for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const kx = W / 2 + sx * (260 + k * 150), ky = 640 + k * 70, s = 1 + k * .35; box(kx - 70 * s, ky - 90 * s, 140 * s, 130 * s, '#6a3f2a', 18); for (let d = 0; d < 6; d++) ell(kx - 55 * s + d * 22 * s, ky - 70 * s, 4 * s, 4 * s, '#d6a83c'); }
  // table
  X.beginPath(); X.moveTo(W * .42, 680); X.lineTo(W * .58, 680); X.lineTo(W * .92, H + 10); X.lineTo(W * .08, H + 10); X.closePath(); X.fillStyle = lin(0, 680, 0, H, ['#4a2e22', '#2f1b13']); X.fill();
  X.fillStyle = 'rgba(255,255,255,.04)'; X.beginPath(); X.moveTo(W * .48, 680); X.lineTo(W * .52, 680); X.lineTo(W * .56, H); X.lineTo(W * .44, H); X.fill();
  for (let i = 0; i < 4; i++) { const k = i / 3, y = lerp(710, 990, k), dx = lerp(70, 300, k), sc2 = 1 + k * 1.2;
    for (const sx of [-1, 1]) {
      const px = W / 2 + sx * dx; box(px - 36 * sc2, y, 72 * sc2, 44 * sc2, '#f6f1e4', 3); line(px - 20 * sc2, y + 34 * sc2, px + 16 * sc2, y + 10 * sc2, '#2b3a66', 3 * sc2);
      line(px + sx * 60 * sc2, y + 20 * sc2, px + sx * 50 * sc2, y - 60 * sc2, '#222', 4 * sc2); ell(px + sx * 50 * sc2, y - 64 * sc2, 5 * sc2, 8 * sc2, '#a02020');
      box(px - sx * 70 * sc2, y - 30 * sc2, 22 * sc2, 34 * sc2, 'rgba(170,210,235,.7)', 4);
      if (i % 2) { ell(px + sx * 90 * sc2, y + 6 * sc2, 20 * sc2, 7 * sc2, '#f4f1ea'); box(px + sx * 90 * sc2 - 12 * sc2, y - 16 * sc2, 24 * sc2, 20 * sc2, '#fff', 4);
        X.strokeStyle = 'rgba(255,255,255,.5)'; X.lineWidth = 3; X.beginPath(); for (let s = 0; s < 20; s++) { const yy = y - 20 * sc2 - s * 3 * sc2; X.lineTo(px + sx * 90 * sc2 + Math.sin(t * 3 + s * .5) * 6 * sc2, yy); } X.stroke(); }
    } }
  X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 245 + i * 300; X.fillStyle = lin(x, 0, x, H, ['rgba(255,240,200,.2)', 'rgba(255,240,200,0)']); X.beginPath(); X.moveTo(x - 115, 50); X.lineTo(x + 115, 50); X.lineTo(x + 300, H); X.lineTo(x - 30, H); X.fill(); } X.restore();
  dust(sc, t, 60, 'rgba(255,240,200,');
}
function bgNetwork(sc, t, prog) {
  X.fillStyle = rad(W / 2, H / 2, 50, W * .8, ['#2a0f6e', '#1a0b4f', '#0b0526']); X.fillRect(0, 0, W, H);
  const R = rng(sc.seed); const nodes = [];
  for (let i = 0; i < 64; i++) { const a = R() * 6.283, d = 170 + Math.pow(R(), .8) * 880; nodes.push({ x: W / 2 + Math.cos(a) * d * 1.15, y: H / 2 + Math.sin(a) * d * .66, r: 9 + R() * 18, c: ['#7b5cff', '#2fd6ff', '#3aa0ff', '#a070ff'][Math.floor(R() * 4)], ph: R() * 7, d, a }); }
  for (let i = 0; i < 30; i++) { const bx = (R() * W + t * (8 + R() * 10)) % W, by = R() * H, br = 18 + R() * 40; ell(bx, by, br, br, `rgba(90,70,220,${.06 + R() * .08})`); }
  X.save(); X.globalCompositeOperation = 'lighter'; X.lineCap = 'round';
  nodes.forEach((n, i) => {
    const ap = expo(prog * 3.2 - n.d / 1000); if (ap <= 0) return;
    const nx = n.x + Math.sin(t * .7 + n.ph) * 10, ny = n.y + Math.cos(t * .6 + n.ph) * 10;
    // links: branch toward centre with smooth wavy curves
    const tx = i % 3 === 0 ? W / 2 : lerp(n.x, W / 2, .45) + Math.sin(n.ph) * 60, ty = i % 3 === 0 ? H / 2 : lerp(n.y, H / 2, .45) + Math.cos(n.ph) * 60;
    const c1x = lerp(nx, tx, .33) + Math.sin(n.ph * 2 + t * .4) * 70, c1y = lerp(ny, ty, .33) + Math.cos(n.ph + t * .3) * 70, c2x = lerp(nx, tx, .66) - Math.sin(n.ph) * 60, c2y = lerp(ny, ty, .66) - Math.cos(n.ph * 1.3) * 60;
    const drawTo = k => { X.beginPath(); X.moveTo(tx, ty); for (let s = 0; s <= 24 * k; s++) { const q = 1 - s / 24, u = 1 - q; X.lineTo(u * u * u * nx + 3 * u * u * q * c1x + 3 * u * q * q * c2x + q * q * q * tx, u * u * u * ny + 3 * u * u * q * c1y + 3 * u * q * q * c2y + q * q * q * ty); } };
    drawTo(ap); X.strokeStyle = 'rgba(70,90,255,.32)'; X.lineWidth = 14; X.stroke(); X.strokeStyle = 'rgba(130,100,255,.45)'; X.lineWidth = 5; X.stroke();
    if (ap >= 1) { const q = (t * .45 + n.ph) % 1, u = 1 - q; const px = u * u * u * tx + 3 * u * u * q * c2x + 3 * u * q * q * c1x + q * q * q * nx, py = u * u * u * ty + 3 * u * u * q * c2y + 3 * u * q * q * c1y + q * q * q * ny; glow('#6ff', 24); ell(px, py, 6, 6, 'rgba(180,255,255,.95)'); noGlow(); }
    if (ap >= 1) { const pr = n.r * back((prog * 3.2 - n.d / 1000 - .1) * 3) * (1 + Math.sin(t * 2 + n.ph) * .08); glow(n.c, 34); ell(nx, ny, pr, pr, n.c); noGlow(); ell(nx - pr * .3, ny - pr * .3, pr * .3, pr * .3, 'rgba(255,255,255,.35)'); }
  });
  X.fillStyle = rad(W / 2, H / 2, 0, 300, ['rgba(80,220,255,.8)', 'rgba(60,120,255,.25)', 'rgba(0,0,0,0)']); X.fillRect(0, 0, W, H); X.restore();
  hud(W / 2, H / 2, 150, t, 'rgba(150,230,255,', prog);
  box(W / 2 - 64, H / 2 - 32, 128, 64, '#fff', 32);
  X.strokeStyle = '#7b5cff'; X.lineWidth = 7; X.lineCap = 'round'; X.beginPath(); X.arc(W / 2 - 20, H / 2 + 12, 15, Math.PI, 0); X.moveTo(W / 2 + 35, H / 2 + 12); X.arc(W / 2 + 20, H / 2 + 12, 15, 0, Math.PI, true); X.stroke();
}
function bgSpace(sc, t, prog) {
  X.fillStyle = rad(W * .3, H * .3, 0, W, ['#1b1150', '#0c0830', '#04030f']); X.fillRect(0, 0, W, H);
  const R = rng(sc.seed); for (let i = 0; i < 380; i++) { const x = (R() * W - t * (2 + R() * 6) + W) % W, y = R() * H, s = R() * 2.6, tw = .5 + Math.sin(t * (1 + R() * 3) + i) * .5; X.fillStyle = `rgba(255,255,255,${.25 + tw * .75})`; X.fillRect(x, y, s, s); }
  X.save(); X.globalCompositeOperation = 'lighter'; ell(W * .2, H * .3, 520, 200, 'rgba(140,60,220,.13)', .3 + t * .01); ell(W * .8, H * .78, 620, 230, 'rgba(40,120,220,.12)', -.4); ell(W * .45, H * .1, 400, 120, 'rgba(255,90,150,.07)', .1); X.restore();
  const col = sc.color || '#2f6fd6', px = W * .62, py = H * .56, pr = 340 * (.85 + expo(prog * 2.5) * .15);
  X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = rad(px, py, pr * .9, pr * 1.35, ['rgba(90,180,255,.55)', 'rgba(90,180,255,0)']); X.fillRect(px - pr * 1.5, py - pr * 1.5, pr * 3, pr * 3); X.restore();
  X.save(); X.beginPath(); X.arc(px, py, pr, 0, 7); X.clip();
  X.fillStyle = lin(px - pr, py - pr, px + pr, py + pr, [hex(col, .35), col, '#0a1240']); X.fillRect(px - pr, py - pr, 2 * pr, 2 * pr);
  for (let i = 0; i < 9; i++) { X.fillStyle = i % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,30,80,.18)'; ell(px - pr + ((t * 18 + i * 130) % (2 * pr + 300)) - 150, py - pr + 60 + i * 72, 190, 18 + (i % 3) * 8); }
  X.fillStyle = 'rgba(4,4,24,.6)'; ell(px + pr * .6, py + pr * .35, pr * 1.1, pr * 1.25); X.restore();
  X.beginPath(); X.arc(px, py, pr, 3.4, 5.0); X.strokeStyle = 'rgba(200,240,255,.7)'; X.lineWidth = 4; X.stroke();
  const ma = t * .35, mx = px + Math.cos(ma) * 540, my = py + Math.sin(ma) * 150; if (Math.sin(ma) < 0 || true) { ell(mx, my, 42, 42, '#c9c3d6'); ell(mx + 12, my + 8, 34, 36, 'rgba(40,30,70,.5)'); ell(mx - 14, my - 10, 8, 8, 'rgba(0,0,0,.15)'); }
  hud(px, py, pr + 70, t, 'rgba(150,220,255,', prog);
}
function bgStat(sc, t, prog) {
  X.fillStyle = lin(0, 0, W, H, ['#0d1b3d', '#132a5c', '#0a1430']); X.fillRect(0, 0, W, H);
  grid(t, 'rgba(120,170,255,.07)');
  const R = rng(sc.seed); for (let i = 0; i < 16; i++) { const h = (80 + R() * 340) * expo(prog * 3 - i * .06); box(120 + i * 108, H - 120 - h, 64, h, i % 4 ? 'rgba(60,140,255,.18)' : 'rgba(255,190,60,.3)', 8); }
  hud(W / 2, H * .4, 330, t, 'rgba(140,200,255,', prog);
}
function bgTimeline(sc, t, prog) {
  X.fillStyle = rad(W / 2, H / 2, 0, W * .8, ['#18204a', '#0d1230', '#060818']); X.fillRect(0, 0, W, H);
  grid(t, 'rgba(120,160,255,.06)'); dust(sc, t, 80, 'rgba(120,200,255,');
}
function grid(t, col) { for (let x = -(t * 20) % 80; x < W; x += 80) line(x, 0, x, H, col, 2); for (let y = 0; y < H; y += 80) line(0, y, W, y, col, 2); }
function dust(sc, t, n, col) { const R = rng(sc.seed + 9); X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = (R() * W + Math.sin(t * .3 + i) * 40 + t * 8) % W, y = (R() * H - t * (6 + R() * 10) + H * 3) % H, s = 1 + R() * 3; X.fillStyle = col + (.15 + .3 * Math.sin(t + i) ** 2) + ')'; X.beginPath(); X.arc(x, y, s, 0, 7); X.fill(); } X.restore(); }
function hud(x, y, r, t, col, k = 1) {
  const a = expo(k * 2.5); if (a <= 0) return;
  X.save(); X.translate(x, y); X.globalAlpha = a; X.lineCap = 'butt';
  const rings = [[1, .35, [70, 18, 10, 18], 2.5], [.86, -.5, [4, 10], 2], [.74, .22, [180, 40], 5], [1.14, -.12, [2, 14], 3]];
  rings.forEach(([s, sp, dash, w], i) => { X.save(); X.rotate(t * sp + i); X.setLineDash(dash); X.strokeStyle = col + (.55 - i * .08) + ')'; X.lineWidth = w; X.beginPath(); X.arc(0, 0, r * s * a, 0, 6.283 * (i === 2 ? .7 : 1)); X.stroke(); X.restore(); });
  X.setLineDash([]); X.save(); X.rotate(-t * .2);
  for (let i = 0; i < 72; i++) { const an = i / 72 * 6.283, L = i % 6 ? 8 : 18; line(Math.cos(an) * r * 1.24, Math.sin(an) * r * 1.24, Math.cos(an) * (r * 1.24 + L), Math.sin(an) * (r * 1.24 + L), col + '.4)', 2); }
  X.restore(); X.restore(); X.globalAlpha = 1;
}
function timeline(sc, lt, t) {
  const ys = String(sc.years || '').split(',').map(s => s.trim()).filter(Boolean); if (!ys.length) return;
  const ev = String(sc.events || '').split('|').map(s => s.trim());
  const y0 = H * .48, x0 = W * .1, x1 = W * .9, k = ease(lt / 1.6), act = (sc.active || ys.length) - 1;
  line(x0, y0, x1, y0, 'rgba(255,255,255,.12)', 6);
  glow('#22d3ee', 20); X.strokeStyle = lin(x0, 0, x1, 0, ['#7b5cff', '#22d3ee']); X.lineWidth = 8; X.beginPath(); X.moveTo(x0, y0); X.lineTo(lerp(x0, x1, k), y0); X.stroke(); noGlow();
  ell(lerp(x0, x1, k), y0, 10, 10, '#fff');
  ys.forEach((yr, i) => {
    const q = ys.length > 1 ? i / (ys.length - 1) : .5, px = lerp(x0, x1, q), age = lt - q * 1.6, pk = back(age / .4); if (age <= 0) return;
    const on = i === act;
    if (on) hud(px, y0, 90, t, 'rgba(255,210,80,', clamp(age));
    glow(on ? '#ffcc33' : '#22d3ee', 30); ell(px, y0, 18 * pk, 18 * pk, on ? '#ffcc33' : '#22d3ee'); noGlow(); ell(px, y0, 7 * pk, 7 * pk, '#0d1230');
    X.globalAlpha = clamp(age / .3); X.textAlign = 'center'; X.font = `900 ${on ? 84 : 62}px ${FONT}`; X.fillStyle = on ? '#ffd35a' : '#fff'; X.fillText(yr, px, y0 - 90 - (1 - expo(age / .5)) * 40);
    if (ev[i]) { X.font = `600 36px ${FONT}`; X.fillStyle = 'rgba(220,230,255,.85)'; X.fillText(ev[i], px, y0 + 80 + (1 - expo(age / .5)) * 30); }
    X.textAlign = 'left'; X.globalAlpha = 1;
  });
}
