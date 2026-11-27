// Comic-style hero rigs: `toon=sonic|amy|tails|shadow` and `egg` (the doctor). Faces right; `flip` mirrors.
const TOON = {
  sonic: { fur: '#2a5fd8', skin: '#f2c391', eye: '#3aa64a', arm: 'skin', belly: 'skin', shoe: '#d8283a', strap: '#f4f2ee', quills: 'sonic', mood: 'happy' },
  amy: { fur: '#f27aa9', skin: '#f5c99c', eye: '#3aa64a', arm: 'skin', leg: 'skin', dress: '#d8283a', shoe: '#d8283a', strap: '#f4f2ee', quills: 'amy', lashes: 1 },
  tails: { fur: '#f39b2c', skin: '#fff6ee', eye: '#3a86d8', arm: 'fur', fluff: 1, belly: 'skin', shoe: '#d8283a', strap: '#f4f2ee', quills: 'tails', tails: 1, mood: 'happy' },
  shadow: { fur: '#1f1c25', stripe: '#d8283a', skin: '#f2c391', eye: '#d8283a', arm: 'fur', fluff: 1, shoe: '#f4f2ee', strap: '#d8283a', quills: 'shadow', rings: '#f2b928', mood: 'angry' },
};
TOON.mephiles = Object.assign({}, TOON.shadow, { fur: '#2e3a5a', stripe: '#8ad8ff', eye: '#6ae8ff', strap: '#8ad8ff', rings: '#8ad8ff', mood: 'smug' });
const TD = { legH: 104, bodyH: 92, bw: 88, R: 116, arm: 56 }, ED = { legH: 78, bodyH: 200, bw: 230, R: 100, arm: 72 };
function toonDims(c) { return c.egg ? ED : c.metal ? MD : TD; }
const OUT = '#14121c';
function pose(c, t, speaking, id) {
  const beat = Math.floor(t / (speaking ? .7 : 2.2) + hash(id));
  const pname = c.pose && !speaking ? c.pose : speaking ? TALK[Math.floor(hash(beat * 1.9 + id) * TALK.length)] : IDLE[Math.floor(hash(beat * 1.3 + id) * IDLE.length)];
  return { p: POSES[pname] || POSES.rest, tilt: (hash(beat * 3.7 + id) - .5) * (speaking ? .14 : .05) };
}
function tube(x0, y0, x1, y1, col, w) { X.lineCap = 'round'; line(x0, y0, x1, y1, OUT, w + 8); line(x0, y0, x1, y1, col, w); }
function glove(y, sx, ring) {
  if (ring) { box(-17, y - 30, 34, 10, ring, 4); X.strokeStyle = OUT; X.lineWidth = 3; X.stroke(); }
  box(-16, y - 22, 32, 14, '#fbfbfd', 6); X.strokeStyle = OUT; X.lineWidth = 4; X.stroke();
  ell(0, y + 4, 24, 22); fs('#fbfbfd', 4); X.beginPath(); X.arc(0, y + 6, 12, .3, 2.8); X.strokeStyle = 'rgba(20,18,28,.35)'; X.lineWidth = 3; X.stroke();
  X.save(); X.translate(-sx * 20, y - 2); X.rotate(sx * .8); ell(0, 6, 9, 13); fs('#fbfbfd', 4); X.restore();
}
function shoe(fx, col, strap, dk, ring) {
  X.beginPath(); X.moveTo(fx - 40, -2); X.quadraticCurveTo(fx - 46, -42, fx - 6, -40); X.quadraticCurveTo(fx + 50, -38, fx + 54, -10); X.quadraticCurveTo(fx + 54, 2, fx + 40, 2); X.closePath(); fs(dk ? hex(col, -.2) : col);
  X.save(); X.clip(); box(fx - 10, -44, 20, 48, dk ? hex(strap, -.15) : strap); box(fx - 50, -8, 112, 12, hex(col, -.45)); ell(fx + 22, -28, 13, 5, 'rgba(255,255,255,.35)'); X.restore();
  if (ring) { box(fx - 26, -50, 40, 12, ring, 5); X.strokeStyle = OUT; X.lineWidth = 3; X.stroke(); }
}
function peelOut(cx, cy, r, col, t) { X.save(); X.translate(cx, cy); for (let i = 0; i < 4; i++) { X.rotate(t * 40 + i * .8); X.beginPath(); X.ellipse(0, 0, r, r * .55, 0, 0, 7); X.fillStyle = i % 2 ? hex(col, -.2) : col; X.globalAlpha = .5; X.fill(); } X.globalAlpha = 1; X.beginPath(); X.ellipse(0, 0, r, r * .55, 0, 0, 7); X.strokeStyle = 'rgba(255,255,255,.6)'; X.lineWidth = 5; X.setLineDash([24, 18]); X.lineDashOffset = -t * 400; X.stroke(); X.setLineDash([]); X.restore(); for (let k = 0; k < 3; k++) line(cx - r - 30 - k * 40, cy - 20 + k * 20, cx - r - 120 - k * 40, cy - 20 + k * 20, 'rgba(255,255,255,.5)', 4); }
const RUN = [.9, .5, -.9, -.5];
function drawToon(c, t, speaking, close) {
  const k = TOON[c.toon] || TOON.sonic, s = c._s || (c.size || 1), x = c.x * W, y = c._y ?? (c.y || .88) * H, id = c.x * 91 + c.toon.length;
  const fur = c.fur || k.fur, skin = k.skin, armC = k.arm === 'fur' ? fur : skin, legC = k.leg === 'skin' ? skin : fur;
  const { legH, bodyH, bw, R, arm: L } = TD, shY = -legH - bodyH, hipY = -legH;
  let { p: [ru, rf, lu, lf], tilt } = pose(c, t, speaking, id); const hover = c.fly ? Math.sin(t * 4) * 10 - 60 : 0;
  if (c.run) [ru, rf, lu, lf] = RUN;
  X.save(); X.translate(x, y); X.scale(s * (c.flip ? -1 : 1), s);
  ell(0, 0, bw * .9, 16, 'rgba(20,15,30,.3)'); X.translate(0, hover); if (c.run || c.fly && !k.tails) X.rotate(.2);
  if (c.aura) { c.aura = '255,220,90'; glowC(0, -legH - bodyH / 2, 330, c.aura, .7); for (let i = 0; i < 10; i++) { const a = i * .63 + t * 3; line(Math.cos(a) * 140, -200 + Math.sin(a) * 200, Math.cos(a) * 220, -200 + Math.sin(a) * 300, `rgba(${c.aura},.5)`, 5); } }
  // tails (behind)
  if (k.tails) for (let i = 0; i < 2; i++) {
    X.save(); X.translate(-bw * .3, hipY - 10); X.rotate(c.fly ? t * 14 + i * Math.PI : -.5 - i * .5 + Math.sin(t * 3 + i) * .12);
    X.beginPath(); X.moveTo(0, -14); X.quadraticCurveTo(-90, -70, -150, -30); X.quadraticCurveTo(-130, 10, -70, 22); X.quadraticCurveTo(-30, 24, 0, 14); X.closePath(); fs(i ? hex(fur, -.12) : fur);
    X.save(); X.clip(); ell(-150, -26, 50, 40, '#fff6ee'); X.restore(); X.restore();
  }
  // legs + shoes
  if (c.run) { tube(0, hipY, 10, hipY + 40, legC, 14); peelOut(14, -48, 62, k.shoe, t); } else for (const sx of [-1, 1]) { const lx = sx * 22; tube(lx, hipY, lx + 4, -34, sx < 0 ? hex(legC, -.15) : legC, 14); box(lx - 14, -52, 36, 18, sx < 0 ? '#dcdce4' : '#fbfbfd', 8); X.strokeStyle = OUT; X.lineWidth = 3; X.stroke(); shoe(lx + 18, k.shoe, k.strap, sx < 0, k.rings); }
  X.save(); X.translate(0, hipY); X.rotate(tilt * .3); X.translate(0, -hipY);
  // torso
  if (k.dress) {
    X.beginPath(); X.moveTo(-bw * .38, shY + 8); X.lineTo(bw * .38, shY + 8); X.lineTo(bw * .85, hipY + 18); X.quadraticCurveTo(0, hipY + 40, -bw * .85, hipY + 18); X.closePath(); fs(k.dress);
    X.beginPath(); X.moveTo(-bw * .85, hipY + 18); X.quadraticCurveTo(0, hipY + 40, bw * .85, hipY + 18); X.lineTo(bw * .8, hipY + 6); X.quadraticCurveTo(0, hipY + 28, -bw * .8, hipY + 6); X.closePath(); fs('#f4f2ee', 3);
  } else {
    X.beginPath(); X.ellipse(0, shY + bodyH * .55, bw * .46, bodyH * .62, 0, 0, 7); fs(fur);
    if (k.belly) ell(bw * .08, shY + bodyH * .62, bw * .3, bodyH * .45, k.belly === 'skin' ? skin : '#fff6ee');
  }
  if (k.fluff) { X.beginPath(); X.moveTo(-bw * .3, shY + 4); for (let i = 0; i <= 6; i++) X.lineTo(-bw * .3 + i * bw * .1, shY + (i % 2 ? 52 : 30)); X.lineTo(bw * .3, shY + 4); X.closePath(); fs('#fbfbfd', 4); }
  const armF = (sx, u, f) => {
    X.save(); X.translate(sx * (bw / 2 - 10), shY + 14); X.rotate(sx * u);
    tube(0, 0, 0, L, sx > 0 ? hex(armC, -.1) : armC, 13); X.translate(0, L); X.rotate(sx * f); tube(0, 0, 0, L * .75, sx > 0 ? hex(armC, -.1) : armC, 13);
    if (sx > 0 && c.prop === 'hammer') { X.save(); X.translate(0, L * .75 + 16); X.rotate(Math.PI * .85); box(-7, -10, 14, 120, '#e8b923', 5); X.strokeStyle = OUT; X.lineWidth = 3; X.stroke(); box(-56, 100, 112, 70, '#d8283a', 12); X.lineWidth = 5; X.stroke(); box(-62, 96, 18, 78, '#f2c43a', 6); X.stroke(); box(44, 96, 18, 78, '#f2c43a', 6); X.stroke(); X.restore(); }
    glove(L * .75 + 16, sx, k.rings); X.restore();
  };
  armF(-1, lu, lf);
  X.save(); X.translate(0, shY - R * .78); X.rotate(tilt); toonHead(c, k, fur, skin, t, speaking, R, id); X.restore();
  armF(1, ru, rf);
  X.restore(); X.restore();
}
function quill(bx, by, tx, ty, w, col, bend = .9) { X.beginPath(); X.moveTo(bx, by - w); X.quadraticCurveTo((bx + tx) / 2, (by + ty) / 2 - w * bend, tx, ty); X.quadraticCurveTo((bx + tx) / 2, (by + ty) / 2 + w * .5, bx, by + w); X.closePath(); fs(col); }
function toonHead(c, k, fur, skin, t, speaking, R, id) {
  const mood = c.mood || k.mood || 'neutral', D = hex(fur, -.22), Lt = hex(fur, .18), q = k.quills;
  if (q === 'sonic' || q === 'shadow') {
    const up = q === 'shadow' ? -.55 : 0, set = [[-.3, .5, -1.7, 1.05 + up * .3, .42, D], [-.3, .05, -2.15, .2 + up, .5, hex(fur, -.12)], [-.2, -.4, -2.05, -.8 + up, .5, fur], [.05, -.65, -1.15, -1.75 + up * .2, .46, Lt]];
    for (const [bx, by, tx, ty, w, col] of set) { quill(bx * R, by * R, tx * R, ty * R, w * R, col); if (k.stripe) { X.save(); X.clip(); quill(bx * R, by * R + w * R * .15, tx * R, ty * R, w * R * .32, k.stripe, .2); X.restore(); } }
  } else if (q === 'amy') {
    for (const [bx, by, tx, ty] of [[-.4, -.1, -1.35, .85], [-.35, .3, -1.15, 1.15], [-.3, -.5, -1.4, .3]]) quill(bx * R, by * R, tx * R, ty * R, R * .32, D, -.3);
  }
  const ear = (bx, tx, ty, col) => { X.beginPath(); X.moveTo(bx - R * .3, -R * .6); X.lineTo(tx, ty); X.lineTo(bx + R * .3, -R * .7); X.closePath(); fs(col); X.beginPath(); X.moveTo(bx - R * .15, -R * .68); X.lineTo(tx + R * .02, ty + R * .24); X.lineTo(bx + R * .15, -R * .74); X.closePath(); X.fillStyle = k.stripe ? '#f2b0a0' : '#f5c9b0'; X.fill(); };
  ear(-R * .1, -R * .12, -R * 1.45, D); ear(R * .48, R * .6, -R * 1.38, fur);
  if (k.lashes) { X.beginPath(); X.arc(0, -R * .05, R * 1.02, Math.PI * 1.12, Math.PI * 1.75); X.strokeStyle = OUT; X.lineWidth = R * .16; X.stroke(); X.strokeStyle = '#d8283a'; X.lineWidth = R * .11; X.stroke(); }
  ell(0, 0, R, R * .98); fs(lin(-R, -R, R, R, [Lt, fur, D]), 6);
  ell(-R * .35, -R * .55, R * .3, R * .15, 'rgba(255,255,255,.22)', -.5);
  if (k.quills === 'tails') { for (const [bx, tx, ty] of [[-.2, -.15, -1.45], [.1, .25, -1.5], [.35, .7, -1.3]]) quill(bx * R, -R * .7, tx * R, ty * R, R * .16, fur, .4); ell(-R * .85, R * .4, R * .2, R * .14, '#fff6ee'); }
  // muzzle
  const mz = k.quills === 'tails' ? '#fff6ee' : skin;
  X.beginPath(); X.moveTo(-R * .08, R * .32); X.quadraticCurveTo(R * .4, R * .18, R * .9, R * .26); X.quadraticCurveTo(R * 1.28, R * .34, R * 1.18, R * .6); X.quadraticCurveTo(R * 1.05, R * .86, R * .6, R * .9); X.quadraticCurveTo(R * .08, R * .92, -R * .1, R * .66); X.quadraticCurveTo(-R * .2, R * .45, -R * .08, R * .32); X.closePath(); fs(mz, 5);
  // eyes: one joined white shape
  const bp = (t + hash(id) * 5) % 3.8, blink = bp < .15;
  const eyes = () => { X.beginPath(); X.moveTo(R * .2, -R * .5); X.bezierCurveTo(R * -.22, -R * .52, R * -.22, R * .32, R * .18, R * .32); X.quadraticCurveTo(R * .44, R * .3, R * .5, R * .12); X.quadraticCurveTo(R * .58, R * .32, R * .76, R * .3); X.bezierCurveTo(R * 1.06, R * .28, R * 1.02, -R * .44, R * .74, -R * .44); X.quadraticCurveTo(R * .55, -R * .44, R * .48, -R * .3); X.quadraticCurveTo(R * .4, -R * .52, R * .2, -R * .5); X.closePath(); };
  eyes(); X.fillStyle = blink ? fur : '#fff'; X.fill();
  if (!blink) {
    X.save(); eyes(); X.clip();
    for (const [ex, ey, r] of [[R * .3, -R * .02, R * .17], [R * .8, 0, R * .14]]) { ell(ex, ey, r * .8, r * 1.15, k.eye); ell(ex + r * .1, ey + r * .1, r * .4, r * .65, '#0d0b12'); ell(ex - r * .2, ey - r * .4, r * .22, r * .22, '#fff'); }
    X.fillStyle = fur;
    if (mood === 'angry') { X.beginPath(); X.moveTo(-R * .1, -R * .5); X.lineTo(R * .95, -R * .05); X.lineTo(R * .95, -R * .6); X.closePath(); X.fill(); }
    else if (mood === 'sad' || mood === 'worried') { X.beginPath(); X.moveTo(-R * .1, -R * .1); X.lineTo(R * .95, -R * .4); X.lineTo(R * .95, -R * .6); X.lineTo(-R * .1, -R * .6); X.closePath(); X.fill(); }
    else if (mood === 'smug') { X.beginPath(); X.moveTo(-R * .2, -R * .3); X.lineTo(R * 1.05, -R * .18); X.lineTo(R * 1.05, -R * .6); X.lineTo(-R * .2, -R * .6); X.closePath(); X.fill(); }
    X.restore();
  } else { X.beginPath(); X.moveTo(-R * .02, R * .05); X.quadraticCurveTo(R * .45, R * .18, R * .86, R * .05); X.strokeStyle = OUT; X.lineWidth = 4; X.stroke(); }
  eyes(); X.strokeStyle = OUT; X.lineWidth = 5; X.stroke();
  if (k.lashes) { X.lineWidth = 5; X.lineCap = 'round'; for (let i = 0; i < 3; i++) line(R * (.84 + i * .05), -R * (.36 - i * .1), R * (1.0 + i * .06), -R * (.5 - i * .12), OUT, 5); }
  if (k.quills === 'amy') for (const [bx, tx, ty] of [[.0, .25, -.05], [.3, .55, -.15], [-.2, -.05, -.05]]) quill(bx * R, -R * .62, tx * R, ty * R, R * .17, fur, -.5);
  // nose + mouth
  ell(R * 1.2, R * .36, R * .11, R * .09); fs('#0d0b12', 3); ell(R * 1.17, R * .32, R * .04, R * .025, 'rgba(255,255,255,.7)');
  const mx = R * .68, my = R * .62;
  if (speaking) {
    const v = Math.floor(hash(Math.floor(t * 10) * 7.3 + id) * 4), h = [.04, .13, .2, .1][v];
    X.beginPath(); X.ellipse(mx, my, R * .2, R * h, -.15, 0, 7); fs('#4a1015', 3); if (h > .1) { X.save(); X.clip(); ell(mx, my + R * h, R * .12, R * h * .6, '#d8566a'); X.restore(); }
  } else if (mood === 'angry') { box(mx - R * .2, my - R * .06, R * .4, R * .13, '#fff', 4); X.strokeStyle = OUT; X.lineWidth = 3; X.stroke(); line(mx - R * .2, my, mx + R * .2, my, OUT, 2); }
  else { X.beginPath(); X.moveTo(mx - R * .25, my - R * .02); X.quadraticCurveTo(mx, my + (mood === 'sad' || mood === 'worried' ? -R * .06 : R * .14), mx + R * .22, my - R * .1); X.strokeStyle = OUT; X.lineWidth = 5; X.lineCap = 'round'; X.stroke(); }
}
// ---------- the doctor: egg body, huge mustache, goggles ----------
function drawEgg(c, t, speaking, close) {
  const s = c._s || (c.size || 1), x = c.x * W, y = c._y ?? (c.y || .88) * H, id = c.x * 91 + 9;
  const { legH, bodyH, bw, R, arm: L } = ED, shY = -legH - bodyH, hipY = -legH;
  const { p: [ru, rf, lu, lf], tilt } = pose(c, t, speaking, id);
  X.save(); X.translate(x, y); X.scale(s * (c.flip ? -1 : 1), s);
  ell(0, 0, bw * .6, 18, 'rgba(20,15,30,.3)');
  for (const sx of [-1, 1]) { tube(sx * 34, hipY - 20, sx * 36, -30, '#22202a', 22); X.beginPath(); X.ellipse(sx * 36 + 14, -18, 42, 20, 0, Math.PI, 0); X.lineTo(sx * 36 + 56, 2); X.lineTo(sx * 36 - 28, 2); X.closePath(); fs('#1a1820'); box(sx * 36 - 24, -44, 48, 14, '#8a8f9c', 5); X.strokeStyle = OUT; X.lineWidth = 3; X.stroke(); }
  X.save(); X.translate(0, hipY); X.rotate(tilt * .3); X.translate(0, -hipY);
  const cy = shY + bodyH * .55;
  ell(0, cy, bw * .5, bodyH * .58); fs(lin(-bw / 2, 0, bw / 2, 0, ['#e8433c', '#c8261f', '#8f1612']), 6);
  X.save(); ell(0, cy, bw * .5, bodyH * .58); X.clip();
  box(-bw * .14, shY - 10, bw * .28, bodyH + 40, '#22202a'); for (const sx of [-1, 1]) box(sx * bw * .14 - (sx > 0 ? 0 : 10), shY - 10, 10, bodyH + 40, '#f2c43a');
  box(-bw, hipY - 34, bw * 2, 26, '#22202a'); box(-18, hipY - 36, 36, 30, '#d0d4dc', 5);
  for (let i = 0; i < 2; i++) { box(-bw * .4, cy - 30 + i * 30, 26, 8, '#f2c43a', 3); box(bw * .4 - 26, cy - 30 + i * 30, 26, 8, '#f2c43a', 3); }
  X.restore();
  const armF = (sx, u, f) => { X.save(); X.translate(sx * bw * .42, shY + 50); X.rotate(sx * u); tube(0, 0, 0, L, sx > 0 ? '#b01f19' : '#d8302a', 30); X.translate(0, L); X.rotate(sx * f); tube(0, 0, 0, L * .8, sx > 0 ? '#b01f19' : '#d8302a', 30); glove(L * .8 + 18, sx); X.restore(); };
  armF(-1, lu, lf);
  // head
  X.save(); X.translate(0, shY - R * .55); X.rotate(tilt);
  ell(0, 0, R, R * .95); fs(lin(-R, -R, R, R, ['#ffd9c4', '#f3b79a', '#d98f74']), 6);
  ell(-R * .3, -R * .5, R * .35, R * .16, 'rgba(255,255,255,.35)', -.4);
  // goggles on the forehead
  X.beginPath(); X.arc(0, 0, R * .98, Math.PI * 1.15, Math.PI * 1.85); X.strokeStyle = OUT; X.lineWidth = R * .2; X.stroke(); X.strokeStyle = '#3a3a44'; X.lineWidth = R * .14; X.stroke();
  for (const gx of [-R * .1, R * .42]) { ell(gx, -R * .78, R * .22, R * .17); fs('#9aa3b2', 4); ell(gx, -R * .78, R * .15, R * .11, '#4a9ae0'); ell(gx - R * .05, -R * .82, R * .05, R * .03, 'rgba(255,255,255,.8)'); }
  // eyes behind small blue glasses
  const blink = (t + hash(id) * 5) % 3.6 < .15;
  for (const [ex, ey] of [[R * .05, -R * .2], [R * .5, -R * .2]]) { ell(ex, ey, R * .17, R * .14); fs('rgba(90,170,240,.55)', 4); if (blink) line(ex - R * .08, ey, ex + R * .08, ey, OUT, 4); else ell(ex + R * .03, ey, R * .045, R * .07, OUT); }
  line(R * .22, -R * .2, R * .33, -R * .2, OUT, 4);
  // nose + mouth + mustache
  if (speaking) { const h = [.05, .14, .2, .1][Math.floor(hash(Math.floor(t * 10) * 7.3 + id) * 4)]; ell(R * .3, R * .55, R * .22, R * h); fs('#4a1015', 3); }
  for (const sx of [-1, 1]) { X.beginPath(); X.moveTo(R * .28, R * .18); X.bezierCurveTo(R * .28 + sx * R * .5, R * .05, R * .28 + sx * R * 1.0, R * .25, R * .28 + sx * R * 1.15, R * .1); X.bezierCurveTo(R * .28 + sx * R * 1.1, R * .5, R * .28 + sx * R * .5, R * .55, R * .28, R * .42); X.closePath(); fs(sx < 0 ? '#d8691e' : '#ef7f28', 5); }
  ell(R * .3, R * .12, R * .2, R * .18); fs('#f7a98a', 5);
  X.restore();
  armF(1, ru, rf);
  X.restore(); X.restore();
}
