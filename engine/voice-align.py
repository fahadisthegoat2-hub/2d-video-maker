import json, re, difflib
L=[l.strip() for l in open('/home/user/2d-video-maker/scripts/metal-sonic-tts.txt') if l.strip()]
parts=[range(0,26),range(26,59),range(59,88)]
TAGS="ominous short pause whispers whisper dramatic serious curious calm impressed amused laughs laugh sarcastic warm excited mischievously intense mysterious amazed evil sad cheerful playful softly tense cold inspired happy sighs sigh angry shocked nervous shouting hopeful thoughtful deep voice menacing".split()
norm=lambda w: re.sub(r"[^a-z']","",w.lower())
res={'scenes':[], 'cuts':[]}
for p,rg in enumerate(parts,1):
    asr=[(norm(re.sub(r'\(\d\)','',w)),s,e) for w,s,e in json.load(open(f'/tmp/claude-0/vo/p{p}.json')) if not w.startswith(('<','['))]
    asr=[a for a in asr if a[0]]
    ref=[];own=[]
    for i in rg:
        for w in L[i].split(): ref.append(norm(w)); own.append(i)
    sm=difflib.SequenceMatcher(None,[a[0] for a in asr],ref,autojunk=False)
    first={}
    matched=set()
    for a,b,n in sm.get_matching_blocks():
        for k in range(n):
            matched.add(a+k); sc=own[b+k]; first.setdefault(sc, asr[a+k][1])
    # scene starts: first matched word; fill gaps by interpolation
    starts=[first.get(i) for i in rg]
    for k in range(len(starts)):
        if starts[k] is None: starts[k]=starts[k-1]+2 if k else 0
    res['scenes'].append(starts)
    for k,(w,s,e) in enumerate(asr):
        if k in matched: continue
        if max(difflib.SequenceMatcher(None,w,t).ratio() for t in TAGS)>=.8: res['cuts'].append((p,s,e,w))
    print('part',p,'matched',len(matched),'/',len(asr),'ref',len(ref))
json.dump(res,open('/tmp/claude-0/vo/align.json','w'))
print(len(res['cuts']),'tag cuts:',' '.join(c[3] for c in res['cuts']))
