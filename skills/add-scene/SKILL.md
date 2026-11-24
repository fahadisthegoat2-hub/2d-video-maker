---
name: add-scene
description: Extend the 2d-video-maker engine with a new scene type (location or motion graphic), prop, outfit, hat or character pose, in the engine's paper-cut style. Use when a script needs a place or object the engine does not have yet, for example a city, ocean, battlefield, classroom or spaceship.
---

# Extending the engine

All drawing is Canvas 2D code in `engine/lib/`, at a fixed 1920x1080 world size (`W`, `H`).

| file | holds |
|---|---|
| `core.js` | helpers: `box`, `ell`, `line`, `lin`, `rad`, `hex(color, ±k)` shade, `rng(seed)`, `hash`, `ease`/`expo`/`back` |
| `world.js` | illustrated scenes and props: `paper()`, `cloudP`, `range` (snowy mountains), `hills`, `pine`/`forest`, `tent`, `wagon`, `campfire`, `smoke`, `warmGlow`, `snowfall` |
| `chars.js` | `drawChar`, `POSES`, outfits, hats, props (`drawProp`) |
| `classic.js` | older detailed scenes: room, hall, outdoor, network, space, stat, timeline |
| `main.js` | director: shots and camera, `SCENE_DEF`, `WORLD` registry, labels, captions, compositor |

## Add a scene
1. Write `function bgCity(sc, t, prog) { … }` in `world.js`.
2. Draw back to front, setting a parallax layer with `cam(d)` before each group:
   - `cam(0)` sky
   - `cam(.1–.2)` far mountains and skyline
   - `cam(.3–.6)` mid layers
   - `cam(1)` the ground and props the characters stand on
3. Use `sc.seed` with `rng()` for stable layouts. Never use `Math.random()`, which makes frames flicker.
4. Animate flames, flags and other hand-drawn wobble with **`TS`**, the stepped 12fps time, so it stays choppy. Use `t` only for smooth drift such as clouds, snow and smoke.
5. For the paper-cut look:
   - Fill flat colours.
   - Darken the shadow side with `hex(col, -.2)`.
   - Use `paper(pathFn, col, depth)` for shapes with a darker underside.
   - Add `warmGlow()` around light sources.
6. Register it in `main.js`:
   - `WORLD.city = bgCity`
   - If characters stand in it, add `SCENE_DEF.city = { y: <ground 0-1>, s: <char scale> }`.
   - Optionally add `BLOOM.city`.
7. Document it in `skills/video-script/SKILL.md`. Then check it:
   ```bash
   node engine/render.js test.txt out/t.mp4 --novoice --still 1,3
   ```
   Look at the stills.

## Add a prop, hat or outfit
- **Props:** add a branch in `drawProp(p, t, y)` in `chars.js`. It draws at the hand, where +y points away from the elbow.
- **Hats:** add a branch near the `hat === …` blocks in `drawHead`. `R` is the head radius.
- **Outfits:** add a branch next to `outfit === 'apron'` inside the torso clip.
- **Poses:** add a `[rightUpper, rightFore, leftUpper, leftFore]` angle set to `POSES`. Positive angles move toward the body. Add it to `TALK` so speakers use it.

## Style rules
- Characters animate on held poses with no tweening. That limited animation is the house style.
- Keep scenes detailed: at least 15–25 distinct props or features, with layered depth and one light source.
- Use original designs only, with no copyrighted characters or logos.
- After changing `engine/`, rebuild any published player (`build-player.js`) so it includes the new code.
