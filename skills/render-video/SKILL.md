---
name: render-video
description: Render or deliver a 2d-video-maker script. Build the on-device player artifact that plays and exports on iPad, phone or desktop, render a full MP4 with voice-over, or produce preview stills. Use when the user asks to render, export, preview or re-publish a video, or when a render fails.
---

# Rendering

`ROOT="${CLAUDE_PLUGIN_ROOT:-$(git rev-parse --show-toplevel)}"`

## A. On-device player (default, works everywhere)
```bash
node "$ROOT/engine/build-player.js" scripts/x.txt out/x-player.html [--title "Name"]
```
- This writes one self-contained HTML file of about 120 KB. It needs no install, and its fonts come from Google Fonts.
- Publish it with the Artifact tool, using `capabilities: {"tts": {}, "downloads": true}` and `icon: "film"`.
- To update the same artifact later, publish the same file path again (in the same session), or pass `url` (from another session).
- **On the device:**
  - Play renders frames live with requestAnimationFrame.
  - If frames take more than 40ms, the player switches to lite mode, which drops the glow.
  - Safari skips the glow entirely because it can't do canvas blur.
  - The voice uses Claude TTS where offered. Otherwise it uses the device's speech synthesis, which is how it works on iPad.
- **Export video** records the canvas in real time with MediaRecorder: MP4 on Safari, WebM on Chrome. **Save video** then hands the file over through the `downloads` capability.
- The voice is **not** inside exported files, because browsers can't record speech synthesis. Say so if the user asks for a file with sound, and offer the MP4 render (B).

## B. MP4 with voice (cloud session or a desktop machine)
```bash
(cd "$ROOT" && [ -d node_modules ] || npm install --silent)   # fonts
pip install -q edge-tts                                        # optional voice
node "$ROOT/engine/render.js" scripts/x.txt out/x.mp4 [--preview] [--music bg.mp3] [--voice en-US-GuyNeural] [--novoice]
```
- Needs Chromium with Playwright, and ffmpeg. Claude Code cloud sessions have both.
- Renders at 1920x1080 and 30fps, roughly 2 minutes of render time per minute of video. `--preview` renders at 15fps on the fast preset.
- If edge-tts can't reach its service, the render continues silently with captions. Report that.
- Send the MP4 to the user.

## C. Stills for checking
```bash
node "$ROOT/engine/render.js" scripts/x.txt out/x.mp4 --novoice --still 1,5,9
```
Writes `out/x-1.jpg` and so on. To make a contact sheet:
```bash
ffmpeg -i a.jpg -i b.jpg -filter_complex hstack sheet.jpg
```

## Troubleshooting
- `PAGE ERROR:` lines point to a JavaScript bug in `engine/lib/*.js`. Fix it there, because both A and B use the same code.
- A blank or black frame usually means an unknown `scene:` type. Check the spelling against the `video-script` skill.
