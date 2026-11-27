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
      X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = rad(W * .2, H * .55, 0, W * .5, ['#14324a', '#060a12']); X.fillRect(0, 0, W, H);
      glowC(W * .21, H * .58, 380, '120,255,200', .5); box(W * .21 - 190, H * .14, 380, H * .8, '#2a3240', 190); box(W * .21 - 160, H * .18, 320, H * .72, 'rgba(120,255,200,.22)', 160);
      outlined(() => heroAt('shadow', W * .21, H * .92, .95, t, 'worried', false), 8);
      line(W * .21 - 110, H * .25, W * .21 - 110, H * .8, 'rgba(255,255,255,.35)', 8);
    });
    // RIGHT: final form, gold, rings flying off
    side(false, () => {
      burstBg({}, t, '#c0102a', '#ffb02e'); X.setTransform(1, 0, 0, 1, 0, 0);
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
    const v = X.getImageData(0, 0, W, H), d = v.data; for (let i = 0; i < d.length; i += 4) { for (let k = 0; k < 3; k++) { const c = d[i + k] / 255; d[i + k] = Math.min(255, 255 * (c + (c - .5) * .12) * 1.03); } } X.putImageData(v, 0, 0);
    return C.toDataURL('image/png');
  });
  fs.mkdirSync(path.join(__dirname, '..', 'out'), { recursive: true });
  const big = path.join(__dirname, '..', 'out', 'shadow-thumb-1080.png'), out = path.join(__dirname, '..', 'out', 'shadow-thumb.png');
  fs.writeFileSync(big, Buffer.from(png.split(',')[1], 'base64'));
  spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', big, '-vf', 'scale=1280:720', out]); console.log('thumbnail ->', out);
  await b.close();
})();
