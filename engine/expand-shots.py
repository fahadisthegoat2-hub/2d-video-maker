# Split each narration scene into ~3s shots with varied motion graphics, keeping total timing identical.
import re, sys
src, dst = sys.argv[1], sys.argv[2]
blocks = open(src).read().split('\n---\n'); head, body = blocks[0], blocks[1:]
HD = dict(re.findall(r'^(\w+): (.*)$', head, re.M)); SH = HD.get('name') == 'shadow'; NCH = HD.get('chapters', '10')
def parse(b):
    kv, txt = [], []
    for l in b.split('\n'):
        m = re.match(r'^(\w+): (.*)$', l); (kv if m else txt).append((m.group(1), m.group(2)) if m else l)
    return kv, ' '.join(t for t in txt if t.strip())
def pieces(text, k):
    sents = re.findall(r'[^.!?]+[.!?]+', text) or [text]
    while len(sents) < k:
        i = max(range(len(sents)), key=lambda j: len(sents[j])); s = sents[i]; c = [m.end() for m in re.finditer(r',\s', s)]
        if not c: break
        cut = min(c, key=lambda p: abs(p - len(s) / 2)); sents[i:i + 1] = [s[:cut], s[cut:]]
    k = min(k, len(sents)); tot = sum(len(s) for s in sents); out, cur, acc = [], [], 0
    for s in sents:
        cur.append(s); acc += len(s)
        if len(out) < k - 1 and acc >= tot * (len(out) + 1) / k: out.append(' '.join(x.strip() for x in cur)); cur = []
    if cur: out.append(' '.join(x.strip() for x in cur))
    return out
def hero_from(cast, text):
    c = cast or ''
    if SH:
        if 'f4e9a0' in c or 'Super Shadow' in text: return 'supershadow'
        for key, h in (('Maria', 'maria'), ('Gerald', 'gerald'), ('Eggman', 'doctor'), ('Metal', 'metal'), ('Shadow', 'shadow'), ('Sonic', 'sonic')):
            if key in text: return h
        names = re.findall(r'(\w+)\(', c); return names[0] if names and names[0] in ('maria', 'gerald', 'sonic', 'shadow', 'doctor') else 'shadow'
    if 'f2c43a' in c: return 'super'
    if 'metalColor' in c: return 'neo'
    names = re.findall(r'(\w+)\(', c)
    for key, h in (('Super Sonic', 'super'), ('golden', 'super'), ('Eggman', 'doctor'), ('doctor', 'doctor'), ('Amy', 'amy'), ('Tails', 'tails'), ('Shadow', 'shadow'), ('Neo', 'neo'), ('Metal', 'metal'), ('Sonic', 'sonic')):
        if key in text: return h
    return {'doctor': 'doctor', 'sonic': 'sonic', 'amy': 'amy', 'tails': 'tails', 'shadow': 'shadow'}.get(names[0] if names else '', 'metal')
def punch(t):
    ss = [s.strip(' ,') for s in re.findall(r'[^.!?]+[.!?]?', t) if s.strip()]
    s = min(ss, key=lambda x: abs(len(x.split()) - 5)) if ss else t
    w = re.sub(r'[.!?]+$', '', s).split(); return ' '.join(w[:8]) + ('...' if len(w) > 8 else '')
out, last = [], None
chap = ''
TEASE = {1: [['scene: comet', 'teaser: 1'], ['scene: burst', 'hero: supershadow', 'teaser: 1']], 2: [['scene: versus', 'vs: sonic/shadow', 'teaser: 1'], ['scene: emeralds', 'burst: 1', 'teaser: 1'], ['scene: burst', 'hero: shadow']]} if SH else {1: [['scene: overlord', 'teaser: 1'], ['scene: burst', 'hero: neo', 'teaser: 1']], 2: [['scene: versus', 'vs: super/neo', 'teaser: 1'], ['scene: emeralds', 'burst: 1', 'teaser: 1'], ['scene: burst', 'hero: metal']]}
for idx, b in enumerate(body):
    kv, text = parse(b); d = dict(kv)
    m = re.match(r'Chapter (\d+): (.*)', d.get('label', ''))
    if m: chap = '%s|%s|%s' % (m.group(1), m.group(2), NCH)
    dur = float(d['dur']); k = max(1, round(dur / 3.0))
    ch = pieces(text, k); k = len(ch); tot = sum(len(c) for c in ch)
    durs = [dur * len(c) / tot for c in ch]
    vs_ok = ('sonic' in d.get('cast', '') and 'metal' in d.get('cast', '')) or ('Sonic' in text and 'Metal' in text) or ('Shadow' in text and 'Metal' in text and not SH) or (SH and 'Sonic' in text and 'Shadow' in text)
    if idx == 0:
        ch = pieces(text, 3); first = ch[0]; cut = first.index(',') + 1; ch = [first[:cut].strip(), first[cut:].strip()] + ch[1:]
        k = len(ch); tot = sum(len(c) for c in ch); durs = [dur * len(c) / tot for c in ch]
    plan = ['orig']; cyc = ['burst', 'kinetic', 'orig2', 'burst', 'kinetic'] if d['scene'] not in ('stat', 'timeline', 'news', 'monitors') else ['kinetic', 'burst', 'orig2']
    if vs_ok and idx % 2 == 0: cyc = ['versus'] + cyc
    for j in range(1, k): plan.append(cyc[(j - 1) % len(cyc)])
    if idx == 0: plan = ['dark', 'eyes', 'orig', 'kinetic'][:k]
    for j, (c, du) in enumerate(zip(ch, durs)):
        p = plan[j]; last_chunk = j == k - 1; vd = du - (.6 if last_chunk else 0)
        if p == 'orig': lines = ['%s: %s' % (a, v) for a, v in kv if a not in ('dur', 'vodur')]
        elif p == 'orig2':
            lines = ['%s: %s' % (a, v) for a, v in kv if a not in ('dur', 'vodur', 'label', 'shots')]
            if 'cast' in d: lines.append('shots: ' + ['close, react', 'medium, close', 'react, wide'][j % 3])
        elif p == 'eyes': lines = ['scene: eyes'] + (['who: shadow'] if SH else [])
        elif p == 'dark' and SH: lines = ['scene: ark', 'pod: 1', 'bloom: .1', 'cam: 1.15', 'dim: .6']
        elif p == 'dark': lines = ['scene: lab', 'title: SYSTEM OFFLINE', 'screen: none', 'bloom: .1', 'cam: 1.15', 'dim: .55']
        elif p == 'burst': h = hero_from(d.get('cast'), c); lines = ['scene: burst', 'hero: ' + h] + (['flip: 1'] if j % 2 else [])
        elif p == 'kinetic': lines = ['scene: kinetic', 'kt: ' + punch(c), 'nocap: 1']
        elif SH: lines = ['scene: versus', 'vs: sonic/' + ('supershadow' if 'f4e9a0' in d.get('cast', '') else 'shadow')]
        else:
            a = 'shadow' if ('Shadow' in text and 'Sonic' not in text) else ('super' if 'golden' in text or 'f2c43a' in d.get('cast', '') else 'sonic')
            lines = ['scene: versus', 'vs: %s/%s' % (a, 'neo' if 'metalColor' in d.get('cast', '') or 'Neo' in text else 'metal')]
        if idx in TEASE and 0 <= j - (1 if idx == 1 else 0) < len(TEASE[idx]): lines = TEASE[idx][j - (1 if idx == 1 else 0)][:]
        if chap: lines.append('chap: ' + chap)
        lines.insert(1, 'dur: %.3f\nvodur: %.3f' % (du, max(.8, vd)))
        out.append('\n'.join(lines) + '\n' + c)
open(dst, 'w').write(head + '\n---\n' + '\n---\n'.join(out) + '\n')
print('shots:', len(out))
