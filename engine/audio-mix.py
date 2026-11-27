import json, re, subprocess, sys, numpy as np
NAME = sys.argv[1] if len(sys.argv) > 1 else 'metal-sonic'; MS = NAME == 'metal-sonic'
ROOT = '/home/user/2d-video-maker'; VO = '/tmp/claude-0/vo' if MS else f'{ROOT}/out/{NAME}-vo'
SR = 44100
rng = np.random.default_rng(7)
d = json.load(open(f'{VO}/durs.json'))
starts = np.concatenate([[0], np.cumsum(d)])[:-1]; TOTAL = sum(d)
blocks = open(f'{ROOT}/scripts/{NAME}-base.txt').read().split('\n---\n')[1:]
S = []
for b in blocks:
    kv = dict(re.findall(r'^(\w+): (.*)$', b, re.M)); S.append(kv)
N = int((TOTAL + 2) * SR)
T = lambda sec: np.arange(int(sec * SR)) / SR
def env(n, a=.005, r=.2):
    e = np.ones(n); ai = max(1, int(a * SR)); ri = max(1, min(n, int(r * SR)))
    e[:ai] = np.linspace(0, 1, ai); e[-ri:] *= np.linspace(1, 0, ri); return e
def lp(x, k):  # cheap one-pole lowpass, k in (0,1)
    y = np.empty_like(x); acc = 0.0
    for i in range(0, len(x), 4096):
        seg = x[i:i + 4096]; out = np.empty_like(seg)
        for j, v in enumerate(seg): acc += k * (v - acc); out[j] = acc
        y[i:i + 4096] = out
    return y
def lpf(x, k):  # vectorised approx via repeated moving average
    w = max(1, int(1 / k))
    def ma(z):
        c = np.cumsum(np.concatenate([np.zeros(w), z])); y = (c[w:] - c[:-w]) / w
        return np.roll(y, -(w // 2))
    return ma(ma(x))
def noise(sec): return rng.uniform(-1, 1, int(sec * SR))
def sine(f, sec, ph=0): t = T(sec); return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(f, t.shape) / SR) + ph) if np.ndim(f) else np.sin(2 * np.pi * f * t + ph)
def sweep(f0, f1, sec): t = T(sec); f = f0 * (f1 / f0) ** (t / sec); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def norm(x, g=1): return x / (np.abs(x).max() + 1e-9) * g
# ---------------- 30 sound effects ----------------
FX = {}
n = noise(.6); FX['whoosh'] = norm(lpf(n, .02) * np.sin(np.linspace(0, np.pi, len(n))) ** 2)
t = T(1.2); FX['boom'] = norm(sweep(90, 30, 1.2) * np.exp(-t * 3) + .4 * lpf(noise(1.2), .01) * np.exp(-t * 6))
FX['zap'] = norm(np.sign(sweep(1800, 200, .35)) * env(int(.35 * SR), .002, .2) * .6)
t = T(2); FX['laserhum'] = norm((np.sin(2 * np.pi * 110 * t) + .5 * np.sign(np.sin(2 * np.pi * 220.5 * t))) * (.7 + .3 * np.sin(2 * np.pi * 6 * t)) * env(len(t), .3, .5))
t = T(2.5); FX['jet'] = norm(lpf(noise(2.5), .03) * .8 + .25 * sweep(600, 1400, 2.5)) * env(int(2.5 * SR), .3, .8)
t = T(2); FX['alarm'] = norm(np.sin(2 * np.pi * np.where((t * 2.5) % 1 < .5, 880, 660) * t) * env(len(t), .01, .1))
t = T(1); FX['ring'] = norm((np.sin(2 * np.pi * 1975 * t) + .6 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 6))
t = T(1.8); FX['explosion'] = norm(lpf(noise(1.8), .015) * np.exp(-t * 2.5) + .6 * sweep(70, 25, 1.8) * np.exp(-t * 2))
t = T(3); FX['thunder'] = norm(lpf(noise(3), .006) * (np.exp(-t * 1.2)) * (1 + .5 * np.sin(2 * np.pi * 3 * t)))
def clink(f): t = T(.25); return sum(np.sin(2 * np.pi * f * m * t) / m for m in (1, 2.76, 5.4)) * np.exp(-t * 25)
x = np.zeros(int(1.2 * SR))
for k in range(9): i = int(rng.uniform(0, 1) * SR); c = clink(rng.uniform(1800, 3200)); x[i:i + len(c)] += c[:len(x) - i]
FX['chains'] = norm(x)
x = noise(.5) * (rng.uniform(0, 1, int(.5 * SR)) > .97); FX['electric'] = norm(x + .3 * np.sign(sine(60, .5)) * noise(.5) * .3)
t = T(.15); FX['beep'] = norm(np.sin(2 * np.pi * 1320 * t) * env(len(t), .005, .03))
FX['scan'] = norm(sweep(300, 2400, 1.2) * env(int(1.2 * SR), .05, .2))
x = np.zeros(int(1 * SR))
for k in range(12): i = int(k * .08 * SR); c = np.sin(2 * np.pi * rng.uniform(900, 2200) * T(.04)) * env(int(.04 * SR), .002, .02); x[i:i + len(c)] += c
FX['data'] = norm(x)
t = T(.9); thump = lambda: np.sin(2 * np.pi * 55 * T(.18)) * np.exp(-T(.18) * 20)
x = np.zeros(len(t)); x[:len(thump())] += thump(); x[int(.25 * SR):int(.25 * SR) + len(thump())] += .8 * thump(); FX['heartbeat'] = norm(x)
t = T(2); FX['riser'] = norm((lpf(noise(2), .05) + sweep(200, 1600, 2)) * (t / 2) ** 2)
t = T(1.2); FX['subdrop'] = norm(sweep(70, 28, 1.2) * np.exp(-t * 1.5))
x = np.zeros(int(2 * SR))
for k in range(16): i = int(rng.uniform(0, 1.6) * SR); c = np.sin(2 * np.pi * rng.uniform(2500, 6000) * T(.3)) * np.exp(-T(.3) * 14); x[i:i + len(c)] += c
FX['sparkle'] = norm(x)
t = T(.25); FX['flash'] = norm(lpf(noise(.25), .2) * np.exp(-t * 30) + .5 * np.sin(2 * np.pi * 3000 * t) * np.exp(-t * 40))
x = np.zeros(int(1.6 * SR))
for k in range(16): i = int(k * .1 * SR); c = lpf(noise(.05), .1) * np.exp(-T(.05) * 60); x[i:i + len(c)] += c * (1 if k % 2 else .7)
FX['footsteps'] = norm(x)
t = T(2.2); FX['roar'] = norm(lpf(np.sign(np.sin(2 * np.pi * (70 + 20 * np.sin(2 * np.pi * 7 * t)) * t)) + .6 * noise(2.2), .02) * env(len(t), .2, .8))
t = T(1.2); FX['clang'] = norm(sum(np.sin(2 * np.pi * f * t) for f in (523, 1211, 1867, 2731)) * np.exp(-t * 5))
x = np.concatenate([np.sin(2 * np.pi * f * T(.09)) * env(int(.09 * SR), .005, .03) for f in (523, 659, 784, 1047, 1319, 1568)]); FX['powerup'] = norm(x)
FX['powerdown'] = norm(sweep(900, 80, 1.0) * env(int(SR), .01, .3))
x = np.zeros(int(.8 * SR))
for k in range(6): i = int(rng.uniform(0, .6) * SR); c = lpf(noise(.12), .3) * env(int(.12 * SR), .01, .08); x[i:i + len(c)] += c
FX['paper'] = norm(x)
t = T(4); FX['wind'] = norm(lpf(noise(4), .004) * (.6 + .4 * np.sin(2 * np.pi * .4 * t)) * env(len(t), 1, 1))
FX['cage'] = norm(np.concatenate([FX['clang'][:int(.4 * SR)] + FX['boom'][:int(.4 * SR)], FX['clang'][int(.4 * SR):] * .5]))
x = np.zeros(int(2 * SR))
for k in range(10): i = int(rng.uniform(0, 1.8) * SR); f = rng.uniform(300, 700); c = sweep(f, f * 2, .08) * env(int(.08 * SR), .005, .04); x[i:i + len(c)] += c
FX['bubbles'] = norm(x)
x = lpf(noise(3), .2) * (rng.uniform(0, 1, int(3 * SR)) > .995) * 3 + lpf(noise(3), .01) * .3; FX['fire'] = norm(x)
t = T(1.0); FX['gunshot'] = norm(np.concatenate([noise(.02) * 1.0, lpf(noise(.98), .05) * np.exp(-T(.98) * 7)]) + .6 * sweep(160, 40, 1.0) * np.exp(-t * 8))
FX['tick'] = norm(np.sin(2 * np.pi * 2000 * T(.03)) * env(int(.03 * SR), .001, .02))
print('sound effects:', len(FX))
import os; os.makedirs('/home/user/2d-video-maker/out/sfx', exist_ok=True)
for k, v in FX.items():
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', f'/home/user/2d-video-maker/out/sfx/{k}.wav'], input=v.astype(np.float32).tobytes())
# ---------------- place effects ----------------
fx = np.zeros(N)
def put(name, at, g=.5, loop_to=None):
    s = FX[name]
    if loop_to: reps = int(np.ceil((loop_to - at) * SR / len(s))) + 1; s = np.tile(s, reps)[:max(1, int((loop_to - at) * SR))]; s = s * env(len(s), .3, .5)
    i = int(at * SR); s = s[:N - i]; fx[i:i + len(s)] += s * g
used = set()
def P(name, at, g=.5, loop_to=None): used.add(name); put(name, at, g, loop_to)
for i, sc in enumerate(S):
    t0, t1 = starts[i], starts[i] + d[i]; ty = sc.get('scene', ''); cast = sc.get('cast', '')
    soft = sc.get('soft')
    if i and not soft: P('whoosh', t0 - .25, .2)
    if 'label' in sc and 'Chapter' in sc['label']: P('riser', t0 - 1.8, .15); P('boom', t0, .3)
    elif 'label' in sc: P('flash', t0 + .2, .3)
    if sc.get('alarm') and i: P('alarm', t0, .06, t1)
    if sc.get('cage'): P('cage', t0 + .3, .5)
    if sc.get('laser'): P('laserhum', t0, .2, t1); [P('zap', t0 + k, .25) for k in np.arange(.8, d[i] - .5, 2.3)]
    if 'fly' in cast and 'metal' in cast: P('jet', t0 + .1, .22)
    if 'run' in cast: P('footsteps', t0 + .2, .3); P('wind', t0, .15, t1)
    if ty == 'lab': P('bubbles', t0 + .5, .12); P('beep', t0 + 1.2, .15)
    if ty == 'monitors': P('scan', t0 + .3, .2); P('data', t0 + 1.6, .2)
    if ty == 'news': P('paper', t0 + .1, .4); P('flash', t0 + .5, .35)
    if ty == 'overlord': P('roar', t0 + .4, .35); P('thunder', t0 + 1.5, .35); P('explosion', t0 + d[i] * .6, .3)
    if ty == 'emeralds': P('sparkle', t0 + .2, .3);
    if sc.get('burst'): P('powerup', t0 + .2, .35); P('boom', t0 + .8, .4)
    if ty == 'wreck': P('fire', t0, .18, t1)
    if ty == 'fortress': P('wind', t0, .2, t1)
    if ty == 'zone' and sc.get('rings'): [P('ring', t0 + k, .25) for k in (1, 2.2, 3.1)]
    if ty == 'planet' and sc.get('metal'): P('clang', t0 + .8, .25)
    if ty == 'stat': [P('tick', t0 + k * .09, .25) for k in range(18)]; P('boom', t0 + 1.8, .4)
    if ty == 'timeline': [P('tick', t0 + .4 + k * .6, .3) for k in range(4)]
    if ty == 'ark' and not soft: P('beep', t0 + .8, .1)
    if ty == 'wreck': P('gunshot', t0 + .1, .7)
    if ty == 'eyes': P('heartbeat', t0 + .6, .45); P('heartbeat', t0 + 1.9, .45); P('flash', t0 + 1.3, .2)
    if ty == 'chapcard': P('riser', t0 - 1.6, .14); P('boom', t0 + .05, .4); P('whoosh', t0 + .2, .25)
    if ty == 'form': P('powerup', t0 + .05, .4); P('boom', t0 + .35, .45); P('sparkle', t0 + .5, .25); [P('tick', t0 + .8 + k * .12, .12) for k in range(8)]
    if ty == 'dossier': P('paper', t0 + .05, .4); P('data', t0 + .6, .15); P('data', t0 + 1.6, .12); P('clang', t0 + 1.6, .3) if sc.get('stamp') else None
    if ty == 'orbit': P('scan', t0 + .3, .15); P('alarm', t0, .05, t1) if sc.get('mode') == 'fall' else None
    if ty == 'chaos': P('subdrop', t0 + .45, .55); P('flash', t0 + .45, .3); P('heartbeat', t0 + 1.1, .25)
    if ty == 'rings' and float(sc.get('off', 99)) < d[i]: o = t0 + float(sc['off']); P('riser', o - 1.2, .2); P('clang', o, .5); P('explosion', o + .05, .5); P('electric', o + .2, .3)
    if ty == 'meter': P('riser', t0, .18); [P('tick', t0 + k * .07, .12) for k in range(16)]; (P('alarm', t0 + 1.2, .08, t0 + 2.6), P('boom', t0 + 1.2, .4)) if float(sc.get('mval', 0)) > 100 else None
    if sc.get('fx') == 'chaos': P('electric', t0 + .3, .15)
    if ty == 'fight': [(P('zap', t0 + k, .3), P('explosion' if j % 2 else 'boom', t0 + k + .42, .35)) for j, k in enumerate(np.arange(0, d[i] - .3, .85))]; P('roar', t0 + .2, .3) if sc.get('foe') in ('devildoom', 'biolizard') else None
    if sc.get('pod'): P('bubbles', t0 + .4, .15)
    if sc.get('beam'): P('laserhum', t0 + .5, .3, t0 + 3); P('explosion', t0 + 1.4, .5)
    if ty == 'comet': P('roar', t0 + .3, .25); P('thunder', t0 + 1.2, .25)
    if 'fly' in cast and 'aura' in cast: P('powerup', t0 + .2, .3)
    if ty == 'speedway' and 'fly' not in cast and 'run' not in cast: P('wind', t0, .1, t1)
shots = open(f'{ROOT}/scripts/{NAME}.txt').read().split('\n---\n')[1:]; st = 0.0
for b in shots:
    kv = dict(re.findall(r'^(\w+): (.*)$', b, re.M)); du = float(kv['dur']); ty = kv.get('scene')
    if st > .5 and not kv.get('soft') and not any(abs(st - x) < .05 for x in starts): P('whoosh', st - .2, .3)
    if ty == 'burst': P('whoosh', st - .15, .18)
    if ty == 'kinetic': [P('tick', st + k * .3, .1) for k in range(len(kv.get('kt', '').split()))]
    if ty == 'versus': P('clang', st + .1, .15)
    st += du
if MS: P('scan', 4.3, .08); P('ring', 4.9, .06); P('heartbeat', 6.2, .25); P('heartbeat', starts[85] + 1, .5); P('heartbeat', starts[85] + 2.2, .5)
if MS: P('electric', starts[54] + .5, .3); P('powerdown', starts[67] + .5, .35); P('chains', starts[44] + .6, .4); P('chains', starts[73] + .5, .3)
pass
print('effects used:', len(used), sorted(used))
# ---------------- music ----------------
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32).astype(np.float64); return x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * .13
U = '/root/.claude/uploads/3b627f92-e3d2-57e3-a6e3-7407732bd355/'
if MS: GH, EB, IJ = load(U + 'c2d2408a-Sonic_the_Hedgehog_OST_-_Green_Hill_Zone_mp3.pm.mp3'), load(U + '92b69d28-05._Boss_-_Egg_Breaker.mp3'), load(U + 'fd34db81-16._Iron_Jungle__Vocal_mix_1.mp3')
BPM = 100; beat = 60 / BPM
def note(f, sec, kind='pad'):
    t = T(sec)
    if kind == 'pad': return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.003 * t) + .3 * np.sin(2 * np.pi * f * .5 * t)) * env(len(t), .6, .8)
    if kind == 'pluck': return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t * 4)
    if kind == 'bass': return np.tanh(2 * np.sin(2 * np.pi * f * t)) * env(len(t), .01, .1)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def gen(style, sec):
    out = np.zeros(int(sec * SR) + SR)
    prog = {'tension': [45, 45, 46, 44], 'ambient': [57, 53, 48, 55], 'sad': [57, 53, 48, 52], 'action': [45, 43, 41, 43]}[style]
    bar = 4 * beat; i = 0; t = 0.0
    while t < sec:
        r = prog[i % 4]; chord = [r, r + 3 if style != 'ambient' else r + 4, r + 7]
        s = int(t * SR)
        pad = sum(note(hz(m + 12), bar + .5) for m in chord) * (.25 if style != 'action' else .15); out[s:s + len(pad)] += pad[:len(out) - s]
        for k in range(8 if style in ('ambient', 'sad') else 4):
            m = chord[k % 3] + 24 + (12 if k >= 4 and style == 'sad' else 0); p = note(hz(m), .8, 'pluck') * (.18 if style != 'tension' else .1)
            j = s + int(k * bar / (8 if style in ('ambient', 'sad') else 4) * SR); out[j:j + len(p)] += p[:max(0, len(out) - j)]
        if style in ('tension', 'action'):
            for k in range(8 if style == 'action' else 4):
                j = s + int(k * bar / (8 if style == 'action' else 4) * SR); b = note(hz(r - 12), .2, 'bass') * .35; out[j:j + len(b)] += b[:max(0, len(out) - j)]
        if style == 'action':
            for k in range(8):
                j = s + int(k * beat / 2 * SR)
                if k % 4 == 0: kk = np.sin(2 * np.pi * 55 * T(.15) * (1 + np.exp(-T(.15) * 30))) * np.exp(-T(.15) * 18) * .6; out[j:j + len(kk)] += kk[:max(0, len(out) - j)]
                if k % 4 == 2: sn = lpf(noise(.15), .3) * np.exp(-T(.15) * 25) * .35; out[j:j + len(sn)] += sn[:max(0, len(out) - j)]
                hh = noise(.03) * np.exp(-T(.03) * 120) * .12; out[j:j + len(hh)] += hh[:max(0, len(out) - j)]
        t += bar; i += 1
    return out[:int(sec * SR)] / (np.sqrt(np.mean(out ** 2)) + 1e-9) * .2
# sections: (first scene, source)
SECT = [(i, sc['music']) for i, sc in enumerate(S) if 'music' in sc] if not MS else [(0, 'tension'), (6, GH), (14, 'ambient'), (26, EB), (33, 'sad'), (36, 'tension'), (43, IJ), (58, 'action'), (60, EB), (68, 'sad'), (79, 'ambient'), (84, 'tension')]
mus = np.zeros(N)
for k, (sc0, srcm) in enumerate(SECT):
    a = starts[sc0]; b = starts[SECT[k + 1][0]] if k + 1 < len(SECT) else TOTAL + 1
    L = int((b - a + 1.5) * SR)
    seg = gen(srcm, b - a + 1.5) if isinstance(srcm, str) else np.tile(srcm, int(np.ceil(L / len(srcm))) + 1)[:L]
    seg = seg * env(len(seg), 1.2, 1.5); i = int(a * SR); mus[i:i + len(seg)] += seg[:N - i]
# ---------------- mix ----------------
v = np.fromfile(f'{VO}/voice.f32', np.float32).astype(np.float64); voice = np.zeros(N); voice[:len(v)] = v
venv = np.sqrt(lpf(voice ** 2, .0005)); duck = 1 - .8 * np.clip(venv / (venv.max() * .15 + 1e-9), 0, 1)
fade = np.clip(np.arange(N) / SR / 4.0, 0, 1) ** 2
mix = voice * 1.0 + mus * .28 * duck * fade + fx * .35
vr = np.sqrt(np.mean(voice[voice != 0] ** 2)); mr = np.sqrt(np.mean((mus * .28 * duck)[np.abs(voice) > .05] ** 2)); print('voice vs music under speech: %.1f dB' % (20 * np.log10(vr / mr)))
mix = np.tanh(mix * 1.1) * .92
mix[:int((TOTAL + .5) * SR)].astype(np.float32).tofile(f'{VO}/mix.f32')
print('mix seconds', round(TOTAL, 1))
