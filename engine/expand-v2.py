# v2 shot planner: base scenes are already shot-sized. Tracks chapters from `chapcard` scenes, and splits long
# non-character scenes at a sentence so no plain background holds longer than ~8s. Timing totals are unchanged.
import re, sys
src, dst = sys.argv[1], sys.argv[2]
blocks = open(src).read().split('\n---\n'); head, body = blocks[0], blocks[1:]
MG = {'form', 'dossier', 'quote', 'meter', 'chapcard', 'rings', 'chaos', 'orbit', 'stat', 'timeline', 'kinetic', 'versus', 'burst', 'eyes', 'news', 'monitors'}
out, chap = [], ''
for b in body:
    lines = b.split('\n'); kv = [re.match(r'^(\w+): (.*)$', l) for l in lines]
    keys = [(m.group(1), m.group(2)) for m in kv if m]; text = ' '.join(l for l, m in zip(lines, kv) if not m and l.strip()); d = dict(keys)
    if d['scene'] == 'chapcard': chap = d['chap']
    dur, vod = float(d['dur']), float(d['vodur'])
    meta = [f'{a}: {v}' for a, v in keys if a not in ('dur', 'vodur')] + ([f'chap: {chap}'] if chap and d['scene'] != 'chapcard' else [])
    sents = re.findall(r'[^.!?]+[.!?]+', text)
    if dur > 8.5 and 'cast' not in d and d['scene'] not in MG and len(sents) > 1:
        tot = len(text); acc, cut = 0, 1
        for i, s in enumerate(sents):
            acc += len(s)
            if acc >= tot / 2: cut = max(1, min(len(sents) - 1, i + (1 if acc - len(s) / 2 < tot / 2 else 0))); break
        a, bb = ' '.join(x.strip() for x in sents[:cut]), ' '.join(x.strip() for x in sents[cut:])
        d1 = round(vod * len(a) / (len(a) + len(bb)), 3); d2 = round(dur - d1, 3)
        out.append('\n'.join([meta[0], f'dur: {d1}', f'vodur: {d1}'] + [m for m in meta[1:] if not m.startswith('hold:')] + [a]))
        out.append('\n'.join([meta[0], f'dur: {d2}', f'vodur: {round(vod - d1, 3)}', 'cam: 1.22', 'push: .1'] + [m for m in meta[1:] if not m.startswith(('music:', 'label:', 'teaser:'))] + [bb]))
    else:
        out.append('\n'.join([meta[0], f'dur: {dur}', f'vodur: {vod}'] + meta[1:] + [text]))
open(dst, 'w').write(head + '\n---\n' + '\n---\n'.join(out) + '\n')
print('shots:', len(out), 'total %.1fs' % sum(float(re.search(r'^dur: (.*)$', o, re.M).group(1)) for o in out))
