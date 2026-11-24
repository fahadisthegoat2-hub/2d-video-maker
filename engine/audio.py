#!/usr/bin/env python3
# Procedural score + sound effects for a render. Everything is synthesized here (original, royalty-free).
# usage: audio.py cues.json OUTDIR  -> OUTDIR/music.wav, OUTDIR/sfx.wav
# cues.json: {"total": s, "bpm": 96, "levels": [[t0, t1, 0|1|2], ...], "cues": [{"t": s, "type": "boom"}, ...]}
import json, sys, wave
import numpy as np

SR = 44100
cfg = json.load(open(sys.argv[1])); out = sys.argv[2]
TOTAL = cfg['total'] + 1.5; N = int(TOTAL * SR)
rs = np.random.default_rng(7)

def tt(d): return np.arange(int(d * SR)) / SR
def env(n, a, r):  # attack seconds, exponential decay rate
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t * r)
def lp(x, k):  # cheap low-pass: moving average of k samples
    if k <= 1: return x
    return np.convolve(x, np.ones(k) / k, mode='same')
def hp(x, k): return x - lp(x, k)
def put(buf, t, sig, g=1.0):
    i = int(t * SR)
    if i >= len(buf) or i + len(sig) <= 0: return
    if i < 0: sig, i = sig[-i:], 0
    m = min(len(sig), len(buf) - i); buf[i:i + m] += sig[:m] * g
def note(f): return 440 * 2 ** ((f - 69) / 12)
def noise(d): return rs.standard_normal(int(d * SR))

# ---------------- instruments ----------------
def kick(g=1.0):
    t = tt(.6); f = 45 + 90 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 6) + lp(noise(.6), 6) * .15 * np.exp(-t * 60)) * g
def taiko(g=1.0, pitch=1.0):
    t = tt(1.0); f = (70 + 60 * np.exp(-t * 18)) * pitch; ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 4.5) + .5 * np.sin(ph * 1.5) * np.exp(-t * 7)
    skin = lp(noise(1.0), 10) * np.exp(-t * 25) * .6
    return (body + skin) * g
def shaker(g=1.0):
    t = tt(.09); return hp(noise(.09), 4) * np.exp(-t * 60) * .25 * g
def kalimba(m, g=1.0, d=1.4):
    t = tt(d); f = note(m)
    return (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12) + .15 * np.sin(2 * np.pi * f * 2 * t)) * env(len(t), .003, 3.2) * g
def pad(ms, d, g=1.0):
    t = tt(d); s = np.zeros_like(t)
    for m in ms:
        f = note(m)
        for det in (-.12, 0, .11):
            ff = f * 2 ** (det / 12); s += np.sin(2 * np.pi * ff * t) + .3 * np.sin(4 * np.pi * ff * t) + .12 * np.sin(6 * np.pi * ff * t)
    a = np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.0)
    return lp(s, 6) * a * g / (len(ms) * 3)
def brass(ms, d, g=1.0):
    t = tt(d); s = np.zeros_like(t)
    for m in ms:
        f = note(m); s += sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 8))
    return lp(s, 4) * env(len(t), .04, 2.2) * g / len(ms)

# ---------------- score ----------------
music = np.zeros(N)
bpm = cfg.get('bpm', 96); B = 60 / bpm
levels = cfg['levels']
def level_at(t):
    for a, b, l in levels:
        if a <= t < b: return l
    return levels[-1][2] if t >= levels[-1][1] else 0
# D minor: Dm - Bb - Gm - A   (2 bars each)
chords = [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]]
roots = [38, 34, 31, 33]
ost = [62, 65, 69, 65, 67, 65, 62, 60]  # kalimba ostinato (8ths)
bar = 4 * B; nb = int(TOTAL / bar) + 1
for b in range(nb):
    t0 = b * bar; ci = (b // 2) % 4
    if b % 2 == 0:
        put(music, t0, pad(chords[ci], bar * 2 + .8, .55))
        tdr = tt(bar * 2); f = note(roots[ci] - 12)
        put(music, t0, (np.sin(2 * np.pi * f * tdr) + .5 * np.sin(4 * np.pi * f * tdr)) * np.minimum(1, tdr / .5) * np.minimum(1, (bar * 2 - tdr) / .5) * .35)
    for k in range(16):  # 16th grid
        t = t0 + k * B / 4; L = level_at(t)
        if k % 2 == 0:
            m = ost[(k // 2) % 8] + (12 if L == 2 and k % 4 == 0 else 0)
            put(music, t, kalimba(m, .22 if L == 0 else .18))
        if L >= 1:
            put(music, t, shaker(1.0 if k % 4 == 2 else .55))
            if k in (0, 6, 10): put(music, t, kick(.9))
        if L >= 2:
            if k in (0, 3, 8, 11, 14): put(music, t, taiko(.55 if k else .8, 1.0 if k % 2 == 0 else 1.25))
            if k == 0 and b % 2 == 0: put(music, t, brass([chords[ci][0] - 12, chords[ci][0] - 5], bar * 1.5, .35))
# fade out at the end
fade = int(2.5 * SR); music[-fade:] *= np.linspace(1, 0, fade)

# ---------------- sound effects ----------------
def whoosh(d=.45):
    t = tt(d); n = noise(d); x = np.zeros_like(n)
    for k, w in ((40, .5), (14, .35), (5, .25)): x += lp(n, k) * w
    sh = np.sin(np.pi * t / d) ** 3; return hp(x, 3) * sh * 1.4
def boom():
    t = tt(2.2); f = 38 + 70 * np.exp(-t * 9); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 2.2) * 1.1 + lp(noise(2.2), 12) * np.exp(-t * 7) * .9 + hp(noise(2.2), 2) * np.exp(-t * 40) * .5
def thud():
    t = tt(.8); f = 55 + 80 * np.exp(-t * 20); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 6) * .8 + hp(noise(.8), 3) * np.exp(-t * 50) * .3
def clash():
    t = tt(1.1); s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * r) for f, r in ((2150, 5), (3470, 7), (5230, 9), (1310, 4)))
    return s * .22 + hp(noise(1.1), 2) * np.exp(-t * 45) * .7
def rumble(d=2.0):
    t = tt(d); return lp(noise(d), 120) * 6 * (t / d) ** 2 + hp(lp(noise(d), 8), 30) * (t / d) ** 3 * .8
def explosion2():
    t = tt(3.5); b = np.zeros_like(t); bb = boom(); b[:len(bb)] = bb
    return lp(noise(3.5), 30) * 4 * np.exp(-t * 1.5) + b * 1.2 + hp(noise(3.5), 2) * np.exp(-t * 12) * .6
def crickets(d):
    t = tt(d); s = np.zeros_like(t)
    for f, rate, ph in ((4300, 3.1, 0), (4700, 2.6, 1.3), (3900, 3.7, 2.1)):
        gate = (np.sin(2 * np.pi * rate * t + ph) > .3) * (np.sin(2 * np.pi * 38 * t) > 0)
        s += np.sin(2 * np.pi * f * t) * lp(gate.astype(float), 60) * .05
    return s * np.minimum(1, t / .5) * np.minimum(1, (d - t) / .5)
def birds(d):
    s = np.zeros(int(d * SR))
    for k in range(int(d * 1.5)):
        t0 = rs.uniform(0, d - .4); tc = tt(.25); f = rs.uniform(2500, 4200) * (1 + .4 * np.sin(np.pi * tc / .25))
        put(s, t0, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tc / .25) * .08)
    return s
def water(d):
    t = tt(d); return hp(lp(noise(d), 3), 40) * .35 * np.minimum(1, t / .4) * np.minimum(1, (d - t) / .6)
def riser(d=1.2):
    t = tt(d); f = 200 + 1400 * (t / d) ** 2; return (np.sin(2 * np.pi * np.cumsum(f) / SR) * .15 + hp(noise(d), 4) * .2) * (t / d) ** 2

sfx = np.zeros(N)
FX = {'whoosh': lambda c: whoosh(), 'boom': lambda c: boom(), 'thud': lambda c: thud(), 'clash': lambda c: clash(),
      'rumble': lambda c: rumble(c.get('d', 2.0)), 'explosion': lambda c: explosion2(), 'crickets': lambda c: crickets(c['d']),
      'birds': lambda c: birds(c['d']), 'water': lambda c: water(c['d']), 'riser': lambda c: riser(c.get('d', 1.2))}
for c in cfg['cues']:
    f = FX.get(c['type']);
    if f: put(sfx, c['t'] + c.get('off', 0), f(c), c.get('g', 1.0))

def write(name, x, peak):
    x = np.tanh(x / (np.max(np.abs(x)) + 1e-9) * 1.4) * peak
    st = np.stack([x, np.roll(x, 90)], 1)  # slight stereo width
    with wave.open(f'{out}/{name}', 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
write('music.wav', music, .55); write('sfx.wav', sfx, .9)
print('audio ->', out)
