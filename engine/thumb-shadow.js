// Thumbnail: Day-1 Shadow in his capsule (left) vs Final Form (right). node engine/thumb-shadow.js -> out/shadow-thumb.png (1280x720)
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.goto('file://' + path.join(__dirname, 'scene.html')); await p.evaluate(() => window.fontsReady);
  const png = await p.evaluate(() => {
    const t = 2.4, SPL = W * .44; LT = 3; CAM = { cx: W / 2, cy: H / 2, z: 1 };
    const side = (left, fn) => { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.beginPath(); if (left) { X.moveTo(0, 0); X.lineTo(SPL + 110, 0); X.lineTo(SPL - 110, H); X.lineTo(0, H); } else { X.moveTo(SPL + 110, 0); X.lineTo(W, 0); X.lineTo(W, H); X.lineTo(SPL - 110, H); } X.closePath(); X.clip(); fn(); X.restore(); };
    // LEFT: day one, small and dark inside the ARK capsule
    side(true, () => {
      X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = rad(W * .22, H * .35, 0, W * .6, ['#7ae8ff', '#1fa8ff', '#1a4cff']); X.fillRect(0, 0, W, H);
      for (let i = 0; i < 14; i++) { X.save(); X.translate(W * .22, H * .45); X.rotate(i * Math.PI / 7 + .1); X.beginPath(); X.moveTo(0, 0); X.lineTo(-70, -1400); X.lineTo(70, -1400); X.closePath(); X.fillStyle = 'rgba(255,255,255,.12)'; X.fill(); X.restore(); }
      X.fillStyle = lin(0, H * .82, 0, H, ['#ff7ad8', '#c23aff']); X.beginPath(); X.ellipse(W * .22, H * 1.08, W * .42, H * .3, 0, 0, 7); X.fill(); X.strokeStyle = '#fff'; X.lineWidth = 8; X.stroke();
      const R = rng(4); for (let i = 0; i < 40; i++) { const x = R() * W * .5, y = R() * H * .8, c = ['#ff4fd8', '#ffe23a', '#3dff8a', '#ffffff', '#ff7a2a'][i % 5]; X.save(); X.translate(x, y); X.rotate(R() * 6); box(-8, -4, 16, 8, c, 3); X.restore(); }
      for (const [x, y, k] of [[W * .1, H * .32, 1], [W * .37, H * .28, .8], [W * .3, H * .55, .6]]) { X.save(); X.translate(x, y); X.scale(k, k); X.beginPath(); X.moveTo(0, 18); X.bezierCurveTo(-46, -14, -22, -46, 0, -22); X.bezierCurveTo(22, -46, 46, -14, 0, 18); X.fillStyle = '#ff3a8a'; X.fill(); X.strokeStyle = '#fff'; X.lineWidth = 6; X.stroke(); X.restore(); }
      outlined(() => heroAt('maria', W * .37, H * .99, 1.3, 3.2, 'happy', true), 10);
      outlined(() => babyShadow(W * .14, H * .96, .92, 1.3), 10);
      X.save(); X.translate(W * .27, H * .89); ell(0, 0, 52, 52, '#ffe23a'); X.beginPath(); X.arc(0, 0, 52, -.6, 1.2); X.lineTo(0, 0); X.fillStyle = '#ff3a5a'; X.fill(); X.beginPath(); X.arc(0, 0, 52, 2.4, 3.9); X.lineTo(0, 0); X.fillStyle = '#2a8cff'; X.fill(); X.beginPath(); X.arc(0, 0, 52, 0, 7); X.strokeStyle = '#14121c'; X.lineWidth = 7; X.stroke(); ell(-16, -20, 12, 8, 'rgba(255,255,255,.7)'); X.restore();
    });
    // RIGHT: final form, gold, rings flying off
    side(false, () => {
      X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = lin(0, 0, 0, H, ['#12000a', '#6a0614', '#ff2a10']); X.fillRect(0, 0, W, H);
      for (let i = 0; i < 18; i++) { X.save(); X.translate(W * .72, H * .3); X.rotate(i * Math.PI / 9); X.beginPath(); X.moveTo(0, 0); X.lineTo(-50, -1500); X.lineTo(50, -1500); X.closePath(); X.fillStyle = 'rgba(255,60,40,.08)'; X.fill(); X.restore(); }
      devilDoom(W * .82, H * .3, .72, 1.2, false);
      let bx = W * .6, by = 0; X.beginPath(); X.moveTo(bx, by); for (let k = 0; k < 9; k++) { bx += (hash(k * 3.1) - .5) * 140; by += 70; X.lineTo(bx, by); } X.strokeStyle = 'rgba(255,240,255,.9)'; X.lineWidth = 7; X.stroke();
      doomWings(W * .62, H * .66, 1.15, 1.0);
      glowC(W * .62, H * .7, 420, '255,40,40', .5);
      outlined(() => heroAt('supershadow', W * .6, H * 1.16, 1.4, 2.4, 'angry', false), 12);
      for (let j = 0; j < 3; j++) chaosSpear(W * .66, H * .58, W * .82 + (j - 1) * 70, H * .36 + (j - 1) * 50, .5 + j * .1, '255,230,90');
      hitSpark(W * .83, H * .42, .55, .9);
      for (const [x, y, r] of [[W * .95, H * .72, .5], [W * .53, H * .2, -.6]]) { X.save(); X.translate(x, y); X.rotate(r); box(-30, -90, 60, 180, '#f2b928', 22); box(-11, -90, 22, 180, '#ffe27a', 10); X.restore(); glowC(x, y, 120, '255,230,140', .6); }
      for (let i = 0; i < 50; i++) { const R = rng(i + 9); ell(W * (.45 + R() * .55), H * R(), 3 + R() * 5, 3 + R() * 5, R() > .5 ? 'rgba(255,80,60,.9)' : 'rgba(255,220,90,.9)'); }
    });
    X.setTransform(1, 0, 0, 1, 0, 0); X.beginPath(); X.moveTo(SPL + 110, -10); X.lineTo(SPL - 110, H + 10); X.strokeStyle = '#fff'; X.lineWidth = 22; X.shadowColor = '#000'; X.shadowBlur = 30; X.stroke(); X.shadowBlur = 0;
    const label = (s, x, y, size, col, rot) => { X.save(); X.translate(x, y); X.rotate(rot); X.font = `700 ${size}px ${FONT}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.strokeStyle = '#000'; X.lineWidth = size * .28; X.strokeText(s, 0, 0); X.fillStyle = col; X.fillText(s, 0, 0); X.restore(); };
    label('DAY 1', W * .2, H * .13, 190, '#fff', -.05);
    label('FINAL FORM', W * .7, H * .88, 200, '#ffe23a', -.04);
    const v = X.getImageData(0, 0, W, H), d = v.data; for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], bb = d[i + 2], l = .3 * r + .59 * g + .11 * bb; for (let k = 0; k < 3; k++) { const v = l + (d[i + k] - l) * 1.35; d[i + k] = Math.max(0, Math.min(255, (v - 128) * 1.08 + 132)); } } X.putImageData(v, 0, 0);
    return C.toDataURL('image/png');
  });
  fs.mkdirSync(path.join(__dirname, '..', 'out'), { recursive: true });
  const big = path.join(__dirname, '..', 'out', 'shadow-thumb-1080.png'), out = path.join(__dirname, '..', 'out', 'shadow-thumb.png');
  fs.writeFileSync(big, Buffer.from(png.split(',')[1], 'base64'));
  spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', big, '-vf', 'scale=1280:720', out]); console.log('thumbnail ->', out);
  await b.close();
})();
