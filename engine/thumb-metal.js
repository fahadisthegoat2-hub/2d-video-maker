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
    const frontMetal = (R) => {
      const B = '#2b55c8', BD = '#13286a', BL = '#6a92ff', O = '#05060c', SIL = '#c9d0dc';
      const P = (pts, fill, w = 6) => { X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x * R, y * R) : X.moveTo(x * R, y * R)); X.closePath(); fs(fill, w, O); };
      // body: torso, then arms + shoulders + chains
      P([[-.62, 1.0], [.62, 1.0], [.42, 2.6], [-.42, 2.6]], lin(-R, 0, R, 0, [BL, B, BD]));
      ell(0, 1.75 * R, R * .3, R * .3); fs('#f2b928', 6, O); ell(0, 1.75 * R, R * .2, R * .2, '#2a160e'); ell(0, 1.75 * R, R * .08, R * .08, '#ff7a2a'); glowC(0, 1.75 * R, R * .5, '255,120,40', .5);
      for (const sx of [-1, 1]) {
        X.lineCap = 'round'; line(sx * 1.0 * R, 1.25 * R, sx * 1.25 * R, 1.95 * R, O, R * .14); line(sx * 1.0 * R, 1.25 * R, sx * 1.25 * R, 1.95 * R, SIL, R * .08);
        P([[sx * 1.12, 1.9], [sx * 1.42, 1.9], [sx * 1.5, 2.7], [sx * 1.08, 2.7]], sx < 0 ? B : BD);
        ell(sx * 1.25 * R, 1.95 * R, R * .1, R * .1); fs(SIL, 5, O);
        box(sx * 1.29 * R - R * .25, 2.5 * R, R * .5, R * .16, '#f2b928', 8); X.strokeStyle = O; X.lineWidth = 5; X.stroke();
        ell(sx * .95 * R, 1.15 * R, R * .34, R * .3); fs(lin(-R, 0, R, 0, [BL, B, BD]), 6, O);
        for (let i = 0; i < 17; i++) { const k = i / 16, x = sx * (1.3 + k * .55) * R, y = (2.55 - k * 4.6) * R; X.save(); X.translate(x, y); X.rotate(sx * -.25 + (i % 2) * 1.57); X.beginPath(); X.ellipse(0, 0, R * .16, R * .08, 0, 0, 7); X.strokeStyle = O; X.lineWidth = R * .06; X.stroke(); X.strokeStyle = SIL; X.lineWidth = R * .03; X.stroke(); X.restore(); }
      }
      box(-R * .45, R * .9, R * .9, R * .2, SIL, R * .1); X.strokeStyle = O; X.lineWidth = 5; X.stroke();
      // spikes behind
      P([[-.45, -.55], [0, -2.05], [.45, -.55]], lin(0, -2 * R, 0, 0, [BL, B]));
      for (const sx of [-1, 1]) { P([[sx * .7, -.35], [sx * 1.75, -1.05], [sx * .95, .15]], sx < 0 ? B : BD); P([[sx * .85, .15], [sx * 1.7, .35], [sx * .8, .6]], BD); P([[sx * .3, -.85], [sx * .95, -1.35], [sx * .75, -.45]], B); }
      // ears
      for (const sx of [-1, 1]) { P([[sx * .35, -.8], [sx * .95, -1.45], [sx * .85, -.45]], sx < 0 ? B : BD); P([[sx * .5, -.8], [sx * .88, -1.25], [sx * .8, -.6]], '#f2b440', 0); }
      // dome
      ell(0, 0, R, R * .95); fs(lin(-R, -R, R, R, [BL, B, BD]), 7, O); ell(-R * .35, -R * .55, R * .4, R * .2, 'rgba(255,255,255,.3)', -.4); X.save(); ell(0, 0, R, R * .95); X.clip(); X.fillStyle = lin(0, -R, 0, R * .3, ['rgba(0,0,10,.0)', 'rgba(0,0,10,.45)']); X.fillRect(-R, -R, 2 * R, 1.3 * R); X.restore();
      // visor with V brow
      X.beginPath(); X.moveTo(-.9 * R, .15 * R); X.lineTo(-.6 * R, -.12 * R); X.lineTo(0, .2 * R); X.lineTo(.6 * R, -.12 * R); X.lineTo(.9 * R, .15 * R); X.quadraticCurveTo(.88 * R, .6 * R, .55 * R, .72 * R); X.lineTo(-.55 * R, .72 * R); X.quadraticCurveTo(-.88 * R, .6 * R, -.9 * R, .15 * R); X.closePath(); fs(O, 6);
      for (const sx of [-1, 1]) { X.save(); X.beginPath(); X.moveTo(sx * .08 * R, .3 * R); X.lineTo(sx * .62 * R, .02 * R); X.lineTo(sx * .9 * R, .7 * R); X.lineTo(sx * .08 * R, .7 * R); X.closePath(); X.clip(); X.shadowColor = '#ff1a1a'; X.shadowBlur = 50; ell(sx * .4 * R, .34 * R, R * .2, R * .17, '#ff2a1a'); X.shadowBlur = 0; ell(sx * .4 * R, .34 * R, R * .11, R * .1, '#3a0404'); ell(sx * .4 * R, .34 * R, R * .05, R * .05, '#ffb08a'); X.restore(); glowC(sx * .4 * R, .34 * R, R * .55, '255,30,20', .55); }
      // muzzle + nose pointing down at viewer
      X.beginPath(); X.moveTo(-.5 * R, .62 * R); X.quadraticCurveTo(0, .5 * R, .5 * R, .62 * R); X.quadraticCurveTo(.55 * R, .9 * R, .12 * R, 1.0 * R); X.lineTo(0, 1.22 * R); X.lineTo(-.12 * R, 1.0 * R); X.quadraticCurveTo(-.55 * R, .9 * R, -.5 * R, .62 * R); X.closePath(); fs(lin(0, .5 * R, 0, 1.2 * R, ['#f2f4f8', SIL, '#6a7282']), 6, O);
      for (const sx of [-1, 1]) screw(sx * .32 * R, .74 * R, R * .06);
    };
    clipSide(false, () => { X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = rad(W * .76, H * .45, 50, W * .55, ['#2a0a10', '#0c0208', '#000']); X.fillRect(0, 0, W, H);
      for (let i = 0; i < 50; i++) { const R = rng(i + 9); ell(SPL - 100 + R() * W * .6, R() * H, 2 + R() * 3, 2 + R() * 3, `rgba(255,${90 + R() * 90 | 0},40,${.3 + R() * .6})`); }
      for (const pass of [0, 1]) { X.setTransform(1, 0, 0, 1, 0, 0); X.translate(W * .75, H * .5); X.rotate(.03); if (!pass) X.filter = 'drop-shadow(0 0 22px #ff5a1a) drop-shadow(0 0 50px #ff2a10)'; frontMetal(275); X.filter = 'none'; }
      X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = lin(0, 0, 0, H, ['rgba(0,0,0,.35)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,.5)']); X.fillRect(SPL - 200, 0, W, H); });
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
    const fit = (s, max, size) => { do { X.font = `700 ${size}px ${FONT}`; size -= 4; } while (X.measureText(s).width * 1.12 > max); return size + 4; };
    word('DAY 1', W * .22, H * .13, fit('DAY 1', W * .36, 180), '#ffffff', -.05);
    word('FINAL FORM', W * .75, H * .13, fit('FINAL FORM', W * .4, 160), '#ff3a3a', .03);
    // arrow
    X.save(); X.translate(W * .5, H * .86); X.rotate(-.08); X.beginPath(); X.moveTo(-150, -34); X.lineTo(70, -34); X.lineTo(70, -80); X.lineTo(170, 0); X.lineTo(70, 80); X.lineTo(70, 34); X.lineTo(-150, 34); X.closePath(); X.lineWidth = 22; X.lineJoin = 'round'; X.strokeStyle = '#000'; X.stroke(); X.fillStyle = '#ffd84a'; X.fill(); X.restore();
    return C.toDataURL('image/png');
  });
  fs.mkdirSync('out', { recursive: true }); fs.writeFileSync('out/metal-sonic-thumb.png', Buffer.from(png.split(',')[1], 'base64')); console.log('thumb -> out/metal-sonic-thumb.png'); await b.close();
})();
