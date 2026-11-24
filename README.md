# 2D Video Maker

Turns a text script into an animated 2D explainer video. Every background, character and effect is drawn in code.

**Style:** chunky big-headed characters with limited, choppy animation (12fps held poses and snapping mouth shapes), detailed paper-cut backgrounds with parallax, hard cuts between wide, medium and close-up shots, name labels with arrows, and illustrated motion-graphic scenes.

## Install as a Claude Code plugin
Any Claude Code session opened on this repo, including on iPad or phone in the Claude app, turns the plugin on automatically through `.claude/settings.json`.

To use it in other projects:
```
/plugin install 2d-video-maker --marketplace fahadisthegoat2-hub/2d-video-maker
```
Then just ask: *"make a video about the history of the printing press"*.

**Skills**
| skill | what it covers |
|---|---|
| `make-video` | end to end: topic → script → check → player artifact and MP4 |
| `video-script` | exact script format reference |
| `story-and-pacing` | hooks, pacing, shot rhythm, character design |
| `render-video` | on-device player, MP4 render, stills, troubleshooting |
| `add-scene` | extending the engine with new places, props, outfits and poses |

## Play on your device (iPad, phone, desktop)
```bash
node engine/build-player.js scripts/example.txt     # -> out/example-player.html
```
Publish that file as a claude.ai Artifact. It renders the video live on the device you open it on, lets you edit the script and update the video instantly, and its **Export video** button records a video file on the device. The voice plays live but is not included in exported files; use the MP4 render below for a file with voice.

## Setup and usage (MP4 render)
```bash
npm install                     # fonts
pip install edge-tts            # optional free AI voice-over (needs internet)
node engine/render.js scripts/example.txt                 # -> out/example.mp4
node engine/render.js my.txt --preview                    # fast 15fps draft
node engine/render.js my.txt --still 2,8,15               # preview frames at those seconds
node engine/render.js my.txt --music bg.mp3 --voice en-US-GuyNeural
```

## Script format
Scenes are separated by `---`. Lines written as `key: value` set options. Any other line is narration, which becomes the voice-over and the captions.

### Scenes
| scene | what it looks like | options |
|---|---|---|
| `camp` | mountains, forest, tents, wagon, campfire, bunting | `time: night`, `snow: 1`, `castle: 1` |
| `castle` | castle at night, moon, lit windows, clouds | |
| `throne` | palace throne room, columns, blue braziers | |
| `shop` | interior with shelves, bottles, tapestry and window (close-ups) | |
| `room` / `hall` / `outdoor` | workshop, meeting hall, industrial yard | `palette: warm/cool/night` |
| `earth` | globe with a pin and a place label | `place: Name`, `zoom: 0.5` |
| `sun` | star with surface cells and solar flares | |
| `portraits` | two characters in glowing circles over moving blobs | first 2 characters in `cast` |
| `space`, `network`, `stat`, `timeline` | motion graphics | `value:`, `years:`, `events:` |

Any scene can also use `label: Text` (ribbon title), `dur:` (seconds), `push:` (camera push-in), `captions: off` (set once in the header).

### Characters
```
cast: name(x=0.4, kid, skin=light|tan|medium|brown|dark, hair=#333, hairstyle=short|swept|long|bun|curly|bald,
           beard=#888, old, glasses, outfit=shirt|vest|apron|tunic|dress|robe|suit, shirt=#fff, color2=#a33,
           pants=#444, hat=helmet|scarf|crown|hood|cap, cape=#523, mood=angry|happy|sad|worried,
           prop=sword|hammer|torch|book|orb|fish|basket, size=1, tag=his name)
speaker: name
shots: wide, close, react, medium     # optional; cuts automatically every ~1.8s (set `cut: 2.5` per scene or in the header to change)
```
- `close` frames the speaker. `react` cuts to another character's face.
- `tag` shows a big name label with an arrow pointing at the character during their close-ups.
