# Voice each scene of a base script with edge-tts, then write dur/vodur into it and build the voice track.
# usage: python3 engine/tts-scenes.py scripts/x-base.txt out/x-vo   (needs edge-tts)
import asyncio, os, re, ssl, subprocess, sys, json
import aiohttp, edge_tts
src, vo = sys.argv[1], sys.argv[2]; os.makedirs(vo, exist_ok=True)
ca = '/root/.ccr/ca-bundle.crt'
if os.path.exists(ca):
    ctx = ssl.create_default_context(cafile=ca); orig = aiohttp.TCPConnector.__init__
    def patched(self, *a, **k): k['ssl'] = ctx; orig(self, *a, **k)
    aiohttp.TCPConnector.__init__ = patched
blocks = open(src).read().split('\n---\n'); head, body = blocks[0], blocks[1:]
hd = dict(re.findall(r'^(\w+): (.*)$', head, re.M)); voice, rate = hd.get('voice', 'en-US-AndrewNeural'), hd.get('rate', '+0%')
texts = [' '.join(l for l in b.split('\n') if l.strip() and not re.match(r'^\w+: ', l)) for b in body]
sem = asyncio.Semaphore(6)
async def one(i, t):
    f = f'{vo}/{i:03d}.mp3'
    if os.path.exists(f) and os.path.getsize(f) > 1000: return
    async with sem:
        for k in range(4):
            try: await edge_tts.Communicate(t, voice, rate=rate, proxy=os.environ.get('HTTPS_PROXY')).save(f); return
            except Exception as e: print('retry', i, e); await asyncio.sleep(2 + k * 3)
async def main(): await asyncio.gather(*(one(i, t) for i, t in enumerate(texts)))
asyncio.run(main())
SR = 44100; GAP = .6; out = []; durs = []
for i, b in enumerate(body):
    f = f'{vo}/{i:03d}.mp3'
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    import numpy as np; a = np.frombuffer(raw, np.float32)
    nz = np.where(np.abs(a) > .01)[0]; a = a[max(0, nz[0] - 800):nz[-1] + 2000] if len(nz) else a
    L = len(a) / SR; d = round(L + GAP, 3); durs.append(d)
    pad = np.zeros(int(d * SR), np.float32); pad[:len(a)] = a; out.append(pad)
    lines = [l for l in b.split('\n') if not re.match(r'^(dur|vodur): ', l)]
    lines.insert(1, 'dur: %.3f\nvodur: %.3f' % (d, L)); body[i] = '\n'.join(lines)
v = np.concatenate(out); v /= max(1e-6, np.abs(v).max()) / .9
v.tofile(f'{vo}/voice.f32'); json.dump(durs, open(f'{vo}/durs.json', 'w'))
open(src, 'w').write(head + '\n---\n' + '\n---\n'.join(body) + '\n')
print('scenes', len(durs), 'total %.1fs' % sum(durs))
