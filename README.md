# 2D Video Maker

Turn a text script into an animated 2D YouTube video. All art, characters, lighting and motion graphics are drawn in code. No assets needed.

## Usage
```bash
pip install edge-tts            # optional: free AI voice-over (needs internet)
node engine/render.js scripts/example.txt            # -> out/example.mp4 (1080p30)
node engine/render.js my.txt out/my.mp4 --preview    # fast 15fps draft
node engine/render.js my.txt --still 5               # single frame at 5s
node engine/render.js my.txt --music bg.mp3 --voice en-US-GuyNeural
```

## Script format
Scenes are separated by `---`. Lines written as `key: value` set options. Any other line is narration. Narration becomes the captions and the voice-over.

| scene | look |
|---|---|
| `hook` | kinetic title slam, light rays, shake (use as scene 1) |
| `room` | cartoon interior, window light shaft, clock, workbench (`palette: warm/cool/royal`) |
| `outdoor` | sky, sun glow, sea, poles, drifting clouds |
| `hall` | grand meeting hall, long table |
| `network` | glowing neural net with traveling pulses (`label:` adds a title bar) |
| `space` | stars, nebula, lit planet (`color:`) |
| `robot` | neon robot, glowing eyes, glitch |
| `stat` | big count-up number (`value:`, `label:`, `prefix:`, `suffix:`) |

**Characters:** `cast: name(x=0.5, skin=tan, hair=#333, beard=#888, glasses, shirt=#fff, vest=#c86, suit=#223, tie=#a22, kid, helmet=#c22, mood=angry|happy|sad, prop=hammer|book|orb, bald, longhair, size=1, flip)`.
The `speaker:` character talks and gestures. If no speaker is set, the last character in the cast talks.

Other options: `title:` (kinetic text), `dur:` (seconds), `zoom:`, `pan:`, `nocap: 1`.
