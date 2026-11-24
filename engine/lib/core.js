// shared drawing utilities
const C = document.getElementById('c'), X = C.getContext('2d');
const W = 1920, H = 1080, FONT = 'Fredoka, "DejaVu Sans", sans-serif', MONO = '"DejaVu Sans Mono", monospace';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t = clamp(t), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const expo = t => (t = clamp(t), t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const back = t => { t = clamp(t); const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const noise = (t, s = 0) => Math.sin(t * 1.3 + s) * .5 + Math.sin(t * 2.7 + s * 1.7) * .3 + Math.sin(t * 5.1 + s * 2.3) * .2;
function hex(c, k = 0) {
  if (!c || c[0] !== '#') return c;
  let n = parseInt(c.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
  const f = v => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function rr(x, y, w, h, r) { X.beginPath(); X.roundRect(x, y, w, h, r); }
function box(x, y, w, h, f, r = 0) { rr(x, y, w, h, r); X.fillStyle = f; X.fill(); }
function ell(x, y, rx, ry, fill, rot = 0) { X.beginPath(); X.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, 7); if (fill) { X.fillStyle = fill; X.fill(); } }
function line(x0, y0, x1, y1, col, w) { X.beginPath(); X.moveTo(x0, y0); X.lineTo(x1, y1); X.strokeStyle = col; X.lineWidth = w; X.stroke(); }
function glow(col, blur) { X.shadowColor = col; X.shadowBlur = blur; }
function noGlow() { X.shadowBlur = 0; X.shadowColor = 'transparent'; }
function lin(x0, y0, x1, y1, stops) { const g = X.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); return g; }
function rad(x, y, r0, r1, stops) { const g = X.createRadialGradient(x, y, r0, x, y, r1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); return g; }
const ACC = ['#ffcc33', '#ff3d6e', '#22d3ee', '#7b5cff'];

const PAL = {
  warm: { wall: '#e9d9b8', wood: '#7a4f30', woodD: '#563521', floor: '#8a5a38', rug: '#583443', rugB: '#d4a63c', light: 'rgba(255,214,150,', sky: ['#8ec5f5', '#c9e5fb'] },
  cool: { wall: '#d9dfe6', wood: '#4c5566', woodD: '#353c4a', floor: '#6e6a66', rug: '#2f4b6e', rugB: '#c9d3df', light: 'rgba(190,220,255,', sky: ['#6f8fb8', '#b9cbe0'] },
  night: { wall: '#5b5f7a', wood: '#3a2f3f', woodD: '#261d2a', floor: '#3a2e30', rug: '#3b2346', rugB: '#b08a3c', light: 'rgba(160,180,255,', sky: ['#0d1638', '#2a3566'] },
};

