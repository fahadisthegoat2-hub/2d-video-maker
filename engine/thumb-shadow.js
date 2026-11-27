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
      outlined(() => heroAt('maria', W * .3, H * .99, 1.5, 3.2, 'happy', true), 10);
      outlined(() => heroAt('shadow', W * .13, H * .99, .78, 1.1, 'happy', false), 10);
      X.save(); X.translate(W * .215, H * .8); ell(0, 0, 58, 58, '#ffe23a'); X.beginPath(); X.arc(0, 0, 58, -.6, 1.2); X.lineTo(0, 0); X.fillStyle = '#ff3a5a'; X.fill(); X.beginPath(); X.arc(0, 0, 58, 2.4, 3.9); X.lineTo(0, 0); X.fillStyle = '#2a8cff'; X.fill(); X.beginPath(); X.arc(0, 0, 58, 0, 7); X.strokeStyle = '#14121c'; X.lineWidth = 7; X.stroke(); ell(-18, -22, 14, 9, 'rgba(255,255,255,.7)'); X.restore();
    });
    // RIGHT: final form, gold, rings flying off
    side(false, () => {
      burstBg({}, t, '#ff0a3c', '#ffd21a'); X.setTransform(1, 0, 0, 1, 0, 0);
      glowC(W * .7, H * .55, 640, '255,220,120', .85);
      X.save(); X.translate(W * .7, H * .6); X.scale(1.12, 1.12); X.translate(-W * .7, -H * .6);
      outlined(() => heroAt('supershadow', W * .7, H * 1.18, 1.95, t, 'angry', true), 14); X.restore();
      for (const [x, y, r] of [[W * .9, H * .2, .5], [W * .5, H * .26, -.6]]) { X.save(); X.translate(x, y); X.rotate(r); box(-32, -96, 64, 192, '#f2b928', 24); box(-12, -96, 24, 192, '#ffe27a', 12); X.restore(); glowC(x, y, 120, '255,230,140', .6); }
      for (let i = 0; i < 22; i++) { const a = i / 22 * 7, r0 = 380; line(W * .7 + Math.cos(a) * r0, H * .5 + Math.sin(a) * r0, W * .7 + Math.cos(a) * (r0 + 380), H * .5 + Math.sin(a) * (r0 + 380), 'rgba(255,245,200,.45)', 6); }
    });
    X.setTransform(1, 0, 0, 1, 0, 0); X.beginPath(); X.moveTo(SPL + 110, -10); X.lineTo(SPL - 110, H + 10); X.strokeStyle = '#fff'; X.lineWidth = 22; X.shadowColor = '#000'; X.shadowBlur = 30; X.stroke(); X.shadowBlur = 0;
    const label = (s, x, y, size, col, rot) => { X.save(); X.translate(x, y); X.rotate(rot); X.font = `700 ${size}px ${FONT}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.strokeStyle = '#000'; X.lineWidth = size * .28; X.strokeText(s, 0, 0); X.fillStyle = col; X.fillText(s, 0, 0); X.restore(); };
    label('DAY 1', W * .2, H * .13, 190, '#fff', -.05);
    label('FINAL FORM', W * .68, H * .87, 200, '#ffe23a', -.04);
    const v = X.getImageData(0, 0, W, H), d = v.data; for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], bb = d[i + 2], l = .3 * r + .59 * g + .11 * bb; for (let k = 0; k < 3; k++) { const v = l + (d[i + k] - l) * 1.35; d[i + k] = Math.max(0, Math.min(255, (v - 128) * 1.08 + 132)); } } X.putImageData(v, 0, 0);
    return C.toDataURL('image/png');
  });
  fs.mkdirSync(path.join(__dirname, '..', 'out'), { recursive: true });
  const big = path.join(__dirname, '..', 'out', 'shadow-thumb-1080.png'), out = path.join(__dirname, '..', 'out', 'shadow-thumb.png');
  fs.writeFileSync(big, Buffer.from(png.split(',')[1], 'base64'));
  spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', big, '-vf', 'scale=1280:720', out]); console.log('thumbnail ->', out);
  await b.close();
})();
