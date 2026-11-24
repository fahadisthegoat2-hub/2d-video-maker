---
name: video-script
description: Exact reference for the 2d-video-maker script format, covering every scene type, character option, shot and label. Read before writing or editing any video script (.txt) for this engine.
---

# Script format

A script is a plain text file. Scenes are separated by a line containing only `---`. A line written as `key: value` sets an option, and every other line is narration. Narration becomes the voice-over and the captions, and it sets the scene's length at about 3 words per second.

The optional first block is the header, marked with `video: yes`:
```
video: yes
title: The Boy From The Mountains
voice: en-US-AndrewNeural      # edge-tts voice for MP4 renders
rate: +15%                     # voice speed
cut: 1.8                       # seconds per shot (lower = faster cuts)
captions: off                  # hide burned-in captions
```

## Scene types (`scene:`)
| type | contents | extra keys |
|---|---|---|
| `camp` | snowy mountains, pine forest, tents, wagon, campfire, bunting, clothesline | `time: night`, `snow: 1`, `castle: 1` |
| `castle` | castle at night, moon, lit windows, waving flags, village | none |
| `throne` | palace throne room, columns, gold steps, blue braziers | none |
| `shop` | interior with bottle shelves, tapestry and window (good for close-ups) | none |
| `room` | detailed workshop with clock, pegboard and workbench | `palette: warm/cool/night` |
| `hall` | grand meeting hall with a long table | none |
| `outdoor` | industrial yard by the sea | none |
| `earth` | spinning globe with pin and place label | `place: Name`, `zoom: 0.5` |
| `sun` | star with surface cells and flares | none |
| `portraits` | first two cast members inside glowing animated circles | none |
| `space` | planet, nebula, moon | `color: #hex` |
| `network` | glowing node network | none |
| `stat` | big count-up number | `value: 8000000000`, `unit: people`, `prefix: $`, `suffix: %` |
| `timeline` | animated year markers | `years: 1929, 1945`, `events: Born \| War`, `active: 2` |
| `jungle` | layered jungle, moon, glowing eyes, fireflies, swaying fronds | `time: day` |
| `wakanda` | futuristic city in the jungle: towers, waterfall, maglev, flying craft, plaza | `time: night` |
| `meteor` | meteor streaks in, impact flash + shockwave, glowing crystal cluster | `hit: 1.6` (seconds) |
| `impact` | comic kinetic text: words slam in one by one over a ray burst | `word: HE IS\|A KING`, `sub:`, `color:`, `bg:` |

Every scene also accepts:
- `pop: WORD` slams a big comic word over the scene (`popColor:`, `popAt:`).
- `fx: shake, lines, purple` adds camera shake, speed lines or a purple glow.
- `tone: excited|hype|serious|dramatic|whisper` sets the MP4 voice delivery for that scene.
- `label: Text` for a ribbon title banner.
- `dur: 4` to force the length in seconds.
- `push: 0.08` to set how far the camera pushes in.
- `cut: 2.5` to set the seconds per shot for that scene.

## Characters (`cast:`)
```
cast: name(x=0.4, option=value, flag), other(x=0.6, ...)
speaker: name
```
- **Position:** `x` runs from 0 (left) to 1 (right). `y` overrides the ground line. `size` defaults to 1. `flip` mirrors the character.
- **Body:** `kid`, `skin=pale|light|tan|medium|brown|dark` (or a hex value), `old` (wrinkles).
- **Hair:** `hair=#hex`, `hairstyle=short|swept|long|bun|curly|none`, `bald`, `beard=#hex`, `glasses`.
- **Clothes:**
  - `outfit=armor` is a dark bodysuit with glowing seams (`glow=#hex`).
  - `outfit=shirt|vest|apron|tunic|dress|robe|suit`
  - `shirt=#hex`, `pants=#hex`
  - `color2=#hex` colours the vest, apron, tabard, skirt, robe or jacket.
  - `tie=#hex`, `cape=#hex`, `medal`, `necklace`
- **Headwear:**
  - `hat=helmet|scarf|crown|hood|cap`
  - `scarf=#hex`, `hood=#hex`, `capColor=#hex`, `helmetColor=#hex`
  - `mask` draws a metal faceplate.
- **Acting:**
  - `mood=neutral|angry|happy|sad|worried`
  - `pose=rest|hips|cross|point|wave|think` applies when the character is not speaking.
  - `look=-1..1` sets eye direction.
- **Props:** `prop=sword|hammer|torch|book|orb|fish|basket`.
- **Name label:** `tag=werner` shows a big white name with an arrow during that character's close-ups.

The `speaker` talks and gestures, with mouth flaps and pose changes. If no speaker is set, the last character in the cast talks.

## Shots
With a cast, scenes cut automatically every `cut` seconds through `wide, close, medium, close, react`. Override with:
```
shots: wide, close, react, medium
```
- `close` frames the speaker.
- `react` frames another cast member.
- `medium` frames the group.
- `wide` shows the whole set.

The `shop` scene defaults to close-ups.

## Example
```
---
scene: camp
time: night
cast: mother(x=0.32, hat=scarf, outfit=dress, color2=#8a2a24), father(x=0.45, beard=#3a2a20, vest=#5a3a7a, tag=the father)
speaker: father
His people were travelers. They lived in tents and wagons.
---
scene: earth
place: Valdoria
They lived in a small country called Valdoria.
```
Characters in `camp` should stand at `x` 0.25–0.5 or 0.62–0.7. The campfire is at 0.56.
