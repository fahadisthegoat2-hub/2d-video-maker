import json, subprocess, numpy as np
A=json.load(open('/tmp/claude-0/vo/align.json'))
SKIP={'these','cause','said','used','war','old','intends'}
U='/root/.claude/uploads/3b627f92-e3d2-57e3-a6e3-7407732bd355/'
src=[U+'f8857e73-Generated_Audio_November_27_2026_-_3_18PM.wav',U+'b19f9fb9-Generated_Audio_November_27_2026_-_3_25PM.wav',U+'d954e8a7-Generated_Audio_November_27_2026_-_3_28PM.wav']
SR=44100
def load(f): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,dtype=np.float32).copy()
out=[]; scenes=[]; t0=0.0; GAP=.5; ncut=0
for p in (1,2,3):
    a=load(src[p-1]); dur=len(a)/SR
    cuts=sorted([(max(0,s-.05),e+.07) for q,s,e,w in A['cuts'] if q==p and w not in SKIP])
    m=[]
    for s,e in cuts:
        if m and s<=m[-1][1]+.2: m[-1]=(m[-1][0],max(m[-1][1],e))
        else: m.append((s,e))
    ncut+=len(m)
    keep=np.ones(len(a),bool)
    for s,e in m:
        i0,i1=int(s*SR),int(e*SR); keep[i0:i1]=False
        # 10ms fades around the cut
        f=int(.01*SR); a[max(0,i0-f):i0]*=np.linspace(1,0,len(a[max(0,i0-f):i0])); a[i1:i1+f]*=np.linspace(0,1,len(a[i1:i1+f]))
    newt=lambda t: t-sum(min(e,t)-s for s,e in m if s<t)
    starts=[newt(x) for x in A['scenes'][p-1]]; starts[0]=0
    b=a[keep]; L=len(b)/SR
    for k,s in enumerate(starts):
        e=starts[k+1] if k+1<len(starts) else L
        scenes.append(max(1.2,e-s))
    scenes[-1]+=GAP
    out.append(b); out.append(np.zeros(int(GAP*SR),np.float32))
v=np.concatenate(out); v/=max(1e-6,np.abs(v).max())/0.9
v.astype(np.float32).tofile('/tmp/claude-0/vo/voice.f32')
json.dump(scenes,open('/tmp/claude-0/vo/durs.json','w'))
print('cuts',ncut,'voice',round(len(v)/SR,1),'scenes',len(scenes),'sum',round(sum(scenes),1))
