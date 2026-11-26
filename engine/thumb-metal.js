// Thumbnail: baby Metal Sonic (left) vs his final form (right). node engine/thumb-metal.js -> out/metal-sonic-thumb.png
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, 'scene.html')); await p.evaluate(() => window.fontsReady);
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  const png = await p.evaluate(() => {
    const t = 3.2, SPL = W * .5;
    const clipSide = (left, fn) => { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.beginPath(); if (left) { X.moveTo(0, 0); X.lineTo(SPL + 120, 0); X.lineTo(SPL - 120, H); X.lineTo(0, H); } else { X.moveTo(SPL + 120, 0); X.lineTo(W, 0); X.lineTo(W, H); X.lineTo(SPL - 120, H); } X.closePath(); X.clip(); fn(); X.restore(); };
    CAM = { cx: W / 2, cy: H / 2, z: 1 };
    // RIGHT: final form over the dragon
    clipSide(false, () => { bgOverlord({ seed: 4 }, t); X.setTransform(1, 0, 0, 1, 0, 0); glowC(W * .74, H * .55, 520, '255,40,40', .35);
      drawMetal({ metal: 1, x: .75, _y: H * 1.3, _s: 1.95, mood: 'angry', cape: '#7a1a2a', metalColor: '#4a3aa8', pose: 'point' }, t, false, true); });
    // LEFT: nursery
    clipSide(true, () => { X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = lin(0, 0, 0, H, ['#bfe6ff', '#ffe0f0']); X.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { const R = rng(i + 2), x = R() * SPL, y = R() * H * .8; X.save(); X.translate(x, y); X.rotate(R()); X.fillStyle = 'rgba(255,255,255,.8)'; X.beginPath(); for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5, r = k % 2 ? 9 : 22; X.lineTo(Math.cos(a) * r, Math.sin(a) * r); } X.fill(); X.restore(); }
      cloudP(W * .1, H * .18, .7, '#ffffff'); cloudP(W * .36, H * .1, .5, '#ffffff');
      for (let i = 0; i < 14; i++) box(i * 80 - 10, H * .55, 22, H * .4, '#f4d8a8', 10); box(-10, H * .53, SPL + 40, 36, '#e8c088', 16); box(-10, H * .92, SPL + 40, 40, '#e8c088', 16);
      ell(W * .25, H * .97, 420, 60, 'rgba(120,80,140,.25)');
      // baby: tiny body, giant head
      X.save(); X.translate(W * .25, H * .97); X.scale(1.35, 1.35);
      const B = '#3a6ae0', SIL = '#d6dce6';
      for (const sx of [-1, 1]) { ell(sx * 46, -40, 44, 30); fs('#e83a4a', 5); X.save(); ell(sx * 46, -40, 44, 30); X.clip(); box(sx * 46 - 8, -80, 16, 80, '#fff'); X.restore(); }
      ell(0, -120, 82, 76); fs(lin(-80, 0, 80, 0, ['#6a94ff', B, '#1e3c9a']), 6);
      ell(0, -116, 36, 36); fs('#f2b928', 5); ell(0, -116, 24, 24, '#2a160e'); ell(0, -116, 10, 10, '#ff8a3a');
      X.beginPath(); X.moveTo(-60, -170); X.quadraticCurveTo(0, -140, 60, -170); X.lineTo(50, -190); X.lineTo(-50, -190); X.closePath(); fs('#fff', 4); for (let k = 0; k < 4; k++) ell(-36 + k * 24, -176, 5, 5, '#ff9ac8');
      for (const sx of [-1, 1]) { X.save(); X.translate(sx * 78, -150); X.rotate(sx * -.5); ell(0, 34, 18, 34); fs(B, 5); ell(0, 70, 22, 20); fs('#fff', 5); X.restore(); }
      X.translate(0, -330); const R = 150;
      for (const [bx, by, tx, ty, w] of [[-.3, .3, -1.35, .7, .35], [-.25, -.1, -1.5, -.15, .4], [-.1, -.5, -1.25, -.9, .38]]) quill(bx * R, by * R, tx * R, ty * R, w * R, B);
      const ear = (bx, tx, ty) => { X.beginPath(); X.moveTo(bx - R * .32, -R * .55); X.lineTo(tx, ty); X.lineTo(bx + R * .32, -R * .7); X.closePath(); fs(B); X.beginPath(); X.moveTo(bx - R * .16, -R * .64); X.lineTo(tx + R * .02, ty + R * .2); X.lineTo(bx + R * .16, -R * .72); X.closePath(); X.fillStyle = '#f2b440'; X.fill(); };
      ear(-R * .2, -R * .3, -R * 1.45); ear(R * .45, R * .65, -R * 1.38);
      ell(0, 0, R, R * .98); fs(lin(-R, -R, R, R, ['#7aa4ff', B, '#1e3c9a']), 7); ell(-R * .35, -R * .55, R * .32, R * .16, 'rgba(255,255,255,.35)', -.5);
      X.beginPath(); X.ellipse(R * .36, R * .02, R * .62, R * .42, 0, 0, 7); fs('#07080f', 6);
      for (const [ex, ey, r] of [[R * .12, R * .02, R * .2], [R * .62, R * .04, R * .16]]) { X.save(); X.shadowColor = '#ff4a6a'; X.shadowBlur = 30; ell(ex, ey, r, r * 1.15, '#ff3a5a'); X.restore(); ell(ex, ey, r * .6, r * .7, '#3a0610'); ell(ex - r * .3, ey - r * .4, r * .32, r * .32, '#fff'); ell(ex + r * .3, ey + r * .3, r * .14, r * .14, '#fff'); }
      X.beginPath(); X.ellipse(R * .5, R * .58, R * .45, R * .26, 0, 0, 7); fs(lin(0, R * .3, 0, R * .9, ['#fff', SIL, '#9aa3b2']), 6);
      X.save(); X.translate(R * .85, R * .6); ell(0, 0, R * .2, R * .2); fs('#ff6aa8', 5); ell(R * .02, 0, R * .1, R * .1); fs('#f2d43a', 4); X.restore();
      ell(-R * .1, R * .45, R * .15, R * .08, 'rgba(255,120,160,.5)');
      X.restore(); });
    // split lightning
    X.setTransform(1, 0, 0, 1, 0, 0); X.beginPath(); X.moveTo(SPL + 120, -10); X.lineTo(SPL + 30, H * .35); X.lineTo(SPL + 80, H * .4); X.lineTo(SPL - 40, H * .7); X.lineTo(SPL, H * .72); X.lineTo(SPL - 120, H + 10);
    X.strokeStyle = '#fff'; X.lineWidth = 26; X.lineJoin = 'round'; X.shadowColor = '#ffd84a'; X.shadowBlur = 40; X.stroke(); X.shadowBlur = 0; X.strokeStyle = '#ffd84a'; X.lineWidth = 10; X.stroke();
    // text
    const word = (s, x, y, size, fill, rot = 0) => { X.save(); X.translate(x, y); X.rotate(rot); X.font = `700 ${size}px ${FONT}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.strokeStyle = '#000'; X.lineWidth = size * .22; X.strokeText(s, 0, 0); X.fillStyle = fill; X.fillText(s, 0, 0); X.restore(); };
    word('DAY 1', W * .2, H * .12, 190, '#ffffff', -.05);
    word('FINAL FORM', W * .74, H * .12, 170, '#ff3a3a', .04);
    // arrow
    X.save(); X.translate(W * .5, H * .86); X.rotate(-.08); X.beginPath(); X.moveTo(-150, -34); X.lineTo(70, -34); X.lineTo(70, -80); X.lineTo(170, 0); X.lineTo(70, 80); X.lineTo(70, 34); X.lineTo(-150, 34); X.closePath(); X.lineWidth = 22; X.lineJoin = 'round'; X.strokeStyle = '#000'; X.stroke(); X.fillStyle = '#ffd84a'; X.fill(); X.restore();
    return C.toDataURL('image/png');
  });
  fs.mkdirSync('out', { recursive: true }); fs.writeFileSync('out/metal-sonic-thumb.png', Buffer.from(png.split(',')[1], 'base64')); console.log('thumb -> out/metal-sonic-thumb.png'); await b.close();
})();
