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
    // ---- hero render: Metal Sonic built as its own lit layer ----
    const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return [c, c.getContext('2d')]; };
    const FR = 285, fcx = W * .765, fcy = H * .4, BS = .62;
    const frontMetal = (R) => {
      const B = '#2b55c8', BD = '#16307a', BL = '#6a92ff', O = '#05060c', SIL = '#c9d0dc';
      const P = (pts, fill, w = 6) => { X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x * R, y * R) : X.moveTo(x * R, y * R)); X.closePath(); fs(fill, w, O); };
      const metalG = () => lin(-R, 0, R, 0, [BL, B, BD]);
      X.save(); X.translate(0, R * .95); X.scale(BS, BS); X.translate(0, -R * .95);
      // torso + engine
      X.beginPath(); X.moveTo(-.62 * R, 1.05 * R); X.lineTo(.62 * R, 1.05 * R); X.quadraticCurveTo(.6 * R, 2.0 * R, .36 * R, 2.7 * R); X.lineTo(-.36 * R, 2.7 * R); X.quadraticCurveTo(-.6 * R, 2.0 * R, -.62 * R, 1.05 * R); X.closePath(); fs(metalG(), 6, O);
      ell(0, 1.72 * R, R * .3, R * .3); fs('#f2b928', 6, O); ell(0, 1.72 * R, R * .21, R * .21, '#2a160e');
      X.save(); X.translate(0, 1.72 * R); for (let i = 0; i < 8; i++) { X.rotate(Math.PI / 4); X.beginPath(); X.moveTo(0, 0); X.lineTo(R * .2, -R * .04); X.lineTo(R * .2, R * .04); X.closePath(); X.fillStyle = '#d0601e'; X.fill(); } X.restore(); ell(0, 1.72 * R, R * .07, R * .07, '#ffb04a');
      // arms hanging, shackled
      for (const sx of [-1, 1]) {
        X.lineCap = 'round'; line(sx * .95 * R, 1.2 * R, sx * 1.28 * R, 1.95 * R, O, R * .13); line(sx * .95 * R, 1.2 * R, sx * 1.28 * R, 1.95 * R, SIL, R * .075);
        X.beginPath(); X.moveTo(sx * 1.14 * R, 1.95 * R); X.lineTo(sx * 1.44 * R, 1.95 * R); X.lineTo(sx * 1.52 * R, 2.62 * R); X.lineTo(sx * 1.1 * R, 2.62 * R); X.closePath(); fs(sx < 0 ? B : BD, 6, O);
        ell(sx * 1.28 * R, 1.95 * R, R * .1, R * .1); fs(SIL, 5, O);
        box(sx * 1.31 * R - R * .3, 2.55 * R, R * .6, R * .2, '#5a6272', 8); X.strokeStyle = O; X.lineWidth = 6; X.stroke(); box(sx * 1.31 * R - R * .3, 2.6 * R, R * .6, R * .06, '#9aa3b2');
        for (let k = 0; k < 3; k++) { X.save(); X.translate(sx * (1.2 + k * .1) * R, 2.78 * R); X.rotate(sx * (.1 - k * .1)); line(0, 0, 0, R * .3, O, R * .06); line(0, 0, 0, R * .3, SIL, R * .03); X.restore(); }
        ell(sx * .95 * R, 1.15 * R, R * .34, R * .3); fs(metalG(), 6, O);
      }
      X.restore();
      box(-R * .42, R * .88, R * .84, R * .22, SIL, R * .1); X.strokeStyle = O; X.lineWidth = 5; X.stroke(); screw(-R * .28, R * .99, R * .05); screw(R * .28, R * .99, R * .05);
      // quills + ears
      P([[-.5, -.5], [-.05, -2.0], [.5, -.5]], lin(0, -2 * R, 0, 0, [BL, B]));
      for (const sx of [-1, 1]) { P([[sx * .65, -.45], [sx * 1.85, -1.2], [sx * .95, .1]], sx < 0 ? B : BD); P([[sx * .85, .05], [sx * 1.9, .2], [sx * .85, .55]], BD); P([[sx * .28, -.85], [sx * 1.05, -1.6], [sx * .72, -.5]], B); }
      for (const sx of [-1, 1]) { P([[sx * .3, -.78], [sx * .9, -1.5], [sx * .86, -.42]], sx < 0 ? B : BD); P([[sx * .45, -.78], [sx * .85, -1.3], [sx * .8, -.58]], '#f2b440', 0); }
      // dome
      ell(0, 0, R, R * .95); fs(lin(-R, -R, R, R, [BL, B, BD]), 7, O);
      // visor, V brow, low on the face (head lowered)
      X.beginPath(); X.moveTo(-.93 * R, .22 * R); X.lineTo(-.55 * R, .02 * R); X.lineTo(0, .32 * R); X.lineTo(.55 * R, .02 * R); X.lineTo(.93 * R, .22 * R); X.quadraticCurveTo(.88 * R, .66 * R, .52 * R, .78 * R); X.lineTo(-.52 * R, .78 * R); X.quadraticCurveTo(-.88 * R, .66 * R, -.93 * R, .22 * R); X.closePath(); fs(O, 6);
      for (const sx of [-1, 1]) { X.save(); X.beginPath(); X.moveTo(sx * .1 * R, .4 * R); X.lineTo(sx * .58 * R, .12 * R); X.lineTo(sx * .9 * R, .8 * R); X.lineTo(sx * .1 * R, .8 * R); X.closePath(); X.clip(); ell(sx * .42 * R, .46 * R, R * .2, R * .16, '#ff2a1a'); ell(sx * .42 * R, .46 * R, R * .11, R * .09, '#3a0404'); ell(sx * .42 * R, .46 * R, R * .045, R * .045, '#ffc0a0'); X.restore(); }
      // muzzle seen from the front: rounded, nose pointing at the viewer
      X.beginPath(); X.moveTo(-.4 * R, .72 * R); X.quadraticCurveTo(0, .62 * R, .4 * R, .72 * R); X.quadraticCurveTo(.36 * R, .92 * R, .1 * R, 1.0 * R); X.quadraticCurveTo(0, 1.16 * R, -.1 * R, 1.0 * R); X.quadraticCurveTo(-.36 * R, .92 * R, -.4 * R, .72 * R); X.closePath(); fs(lin(0, .65 * R, 0, 1.05 * R, ['#f4f6fa', SIL, '#6a7282']), 6, O);
      X.beginPath(); X.moveTo(0, .74 * R); X.lineTo(.1 * R, 1.0 * R); X.quadraticCurveTo(0, 1.16 * R, -.1 * R, 1.0 * R); X.closePath(); X.fillStyle = 'rgba(40,46,60,.35)'; X.fill(); ell(-.16 * R, .76 * R, R * .12, R * .035, 'rgba(255,255,255,.85)'); for (const sx of [-1, 1]) screw(sx * .26 * R, .8 * R, R * .045);
    };
    X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, W, H); X.translate(fcx, fcy); frontMetal(FR); X.setTransform(1, 0, 0, 1, 0, 0);
    const hs = 1, hx = fcx, hy = fcy + 318;
    const [Lc, L] = mk(); L.drawImage(C, 0, 0);
    // shading: darken lower/left, keep top-right lit
    L.globalCompositeOperation = 'source-atop';
    let g = L.createLinearGradient(fcx, fcy - 500, fcx, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(5,5,20,.2)'); g.addColorStop(1, 'rgba(0,0,10,.55)'); L.fillStyle = g; L.fillRect(0, 0, W, H);
    // metallic specular streaks
    { const R0 = FR, cx0 = fcx, cy0 = fcy; L.globalCompositeOperation = 'source-atop';
      let hg = L.createRadialGradient(cx0 - R0 * .3, cy0 - R0 * .6, 10, cx0 - R0 * .3, cy0 - R0 * .6, R0 * .7); hg.addColorStop(0, 'rgba(255,255,255,.55)'); hg.addColorStop(1, 'rgba(255,255,255,0)'); L.fillStyle = hg; L.fillRect(0, 0, W, H);
      L.lineCap = 'round'; for (const [r, a0, a1, w, al] of [[.86, 3.9, 4.9, 16, .55], [.74, 4.0, 4.6, 7, .4]]) { L.beginPath(); L.arc(cx0, cy0, R0 * r, a0 - .4, a1 - .6); L.strokeStyle = `rgba(255,255,255,${al})`; L.lineWidth = w; L.stroke(); } }
    // rim light (orange) on the outer edge
    const [Rc, Rl] = mk(); Rl.drawImage(Lc, 0, 0); Rl.globalCompositeOperation = 'source-in'; Rl.fillStyle = '#ff7a2a'; Rl.fillRect(0, 0, W, H); Rl.globalCompositeOperation = 'destination-out'; Rl.drawImage(Lc, -16, 10);
    L.globalCompositeOperation = 'lighter'; L.globalAlpha = .9; L.drawImage(Rc, 0, 0); L.globalAlpha = 1;
    const [Bc, Bl] = mk(); Bl.drawImage(Lc, 0, 0); Bl.globalCompositeOperation = 'source-in'; Bl.fillStyle = '#ff9a6a'; Bl.fillRect(0, 0, W, H); Bl.globalCompositeOperation = 'destination-out'; Bl.drawImage(Lc, 12, 12);
    L.globalAlpha = .55; L.drawImage(Bc, 0, 0); L.globalAlpha = 1; L.globalCompositeOperation = 'source-over';
    const eyes = [[fcx - FR * .42, fcy + FR * .46, .85], [fcx + FR * .42, fcy + FR * .46, .85]], wr = [[fcx - FR * (1.31 * BS), fcy + FR * (.95 + (2.62 - .95) * BS)], [fcx + FR * (1.31 * BS), fcy + FR * (.95 + (2.62 - .95) * BS)]];
    const chainLink = (Z, x0, y0, x1, y1, n, sz) => { for (let i = 0; i <= n; i++) { const k = i / n, x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * 40; Z.save(); Z.translate(x, y); Z.rotate(Math.atan2(y1 - y0, x1 - x0) + (i % 2) * 1.57); Z.beginPath(); Z.ellipse(0, 0, sz, sz * .5, 0, 0, 7); Z.strokeStyle = '#05060c'; Z.lineWidth = sz * .42; Z.stroke(); const gg = Z.createLinearGradient(-sz, -sz, sz, sz); gg.addColorStop(0, '#f4f6fa'); gg.addColorStop(.5, '#8a93a4'); gg.addColorStop(1, '#3a404c'); Z.strokeStyle = gg; Z.lineWidth = sz * .22; Z.stroke(); Z.restore(); } };
    X.clearRect(0, 0, W, H);
    clipSide(false, () => { X.setTransform(1, 0, 0, 1, 0, 0);
      X.fillStyle = rad(W * .8, H * .45, 40, W * .6, ['#4a0a0c', '#16030a', '#020104']); X.fillRect(0, 0, W, H);
      for (let i = 0; i < 9; i++) { const R2 = rng(i + 40); X.fillStyle = `rgba(80,20,20,${.12 + R2() * .1})`; X.beginPath(); X.ellipse(SPL + R2() * W * .5, H * (.6 + R2() * .5), 300 + R2() * 300, 140 + R2() * 120, 0, 0, 7); X.fill(); }
      
      X.filter = 'blur(28px)'; X.globalAlpha = .9; X.drawImage(Rc, 0, 0); X.drawImage(Rc, 0, 0); X.filter = 'none'; X.globalAlpha = 1;
      X.save(); X.filter = 'drop-shadow(0 0 40px rgba(255,60,20,.8))'; X.drawImage(Lc, 0, 0); X.restore();
      chainLink(X, wr[0][0], wr[0][1], SPL - 40, H * .05, 16, 36); chainLink(X, wr[1][0], wr[1][1], W + 40, H * .05, 16, 36);
      for (const [ex, ey, k] of eyes) { glowC(ex, ey, 260 * k, '255,30,20', .7); X.save(); X.globalCompositeOperation = 'lighter'; const fg = X.createLinearGradient(ex - 520 * k, 0, ex + 520 * k, 0); fg.addColorStop(0, 'rgba(255,40,20,0)'); fg.addColorStop(.5, 'rgba(255,220,200,.95)'); fg.addColorStop(1, 'rgba(255,40,20,0)'); X.fillStyle = fg; X.fillRect(ex - 520 * k, ey - 4 * k, 1040 * k, 8 * k); X.restore(); ell(ex, ey, 14 * k, 14 * k, 'rgba(255,255,240,.95)'); }
      for (let i = 0; i < 80; i++) { const R2 = rng(i + 9), x = SPL - 100 + R2() * W * .6, y = R2() * H, r = 1.5 + R2() * 4; X.save(); X.globalCompositeOperation = 'lighter'; ell(x, y, r, r, `rgba(255,${90 + R2() * 110 | 0},40,${.4 + R2() * .6})`); X.restore(); }
      X.fillStyle = rad(W * .78, H * .5, H * .5, W * .6, ['rgba(0,0,0,0)', 'rgba(0,0,0,.55)']); X.fillRect(SPL - 200, 0, W, H);
    });
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
    // grain
    { const id = X.getImageData(0, 0, W, H), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * 18; d[i] += n; d[i + 1] += n; d[i + 2] += n; } X.putImageData(id, 0, 0); }
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
