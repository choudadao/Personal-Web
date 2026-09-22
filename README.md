# Personal About page

A Three.js About page inspired by the interaction structure at gionatannese.com/about.

This repository is also the working foundation for a multilingual personal portfolio focused on job seeking, freelance work, creative projects, and interactive experiments. Before continuing on another computer or in a new AI session, read `AGENTS.md`, `docs/PROJECT_MEMORY.md`, and `docs/CURRENT_STATE.md`. Editable portfolio planning content is stored in `content/个人作品网站内容管理.xlsx`.

Run `npm run dev`, then open http://127.0.0.1:4173/about.

## Replace your assets

Edit `dist/content.js` to change the monogram, intro, chapters, closing, real contact links and avatar settings.

- `avatar.url`: local GLB URL; currently `/assets/avatar.glb`.
- `avatar.scale`: relative visual scale.
- `avatar.rotationY`: base orientation in radians.
- `avatar.offsetY`: vertical adjustment.
- `avatar.matcap`: optional MatCap for the fallback character; the uploaded avatar uses its own original textures with scene lighting.

The current avatar is a static textured user-supplied model. Pointer rotation and click recoil are procedural. Facial animation is not claimed. When animation clips are supplied later, idle/blink and hit/shake named clips are picked up by the loader; custom naming can be mapped in `loadAvatar()`.

To replace fonts, update `@font-face` in `dist/style.css` and keep the `Editorial` family name, or update the text renderer accordingly. Content remains available as semantic HTML for assistive technology and WebGL fallback.

## Model optimization

The source file is not modified. Run `node scripts/optimize-avatar.mjs "path/to/original.glb"` to generate the smaller web copy. This project uses local vendored Three.js; production has no CDN runtime dependency.

Validation and known fidelity differences are recorded in `docs/IMPLEMENTATION.md` and `docs/qa-report.json`.

## Material comparison

`/` and `/about` now open the marble direction so old links remain valid. `/marble` uses polished procedural black marble, with a monochrome graphite surface shift inside the soft circular pointer mask. `/mirror` remains the second public material experiment. Both retain pointer/orientation tracking, blue hover light, click waves, refraction, and text avoidance. Touch and hold the avatar to shift the surface locally on mobile.

The colored material version was withdrawn after visual review because it did not support the intended portfolio tone. Its source textures remain embedded in the supplied model asset for future experiments, but the public interface does not expose that version.

The premium Textures.com PBR0429 file is not included. The default is an independently authored procedural approximation. To use your licensed maps, put web-ready files in `dist/assets/` and set `avatar.marble.albedo` / `roughness` in `dist/content.js`; albedo uses triplanar projection. `radius`, `mobileRadius` and `feather` are CSS pixels.

## Camera mirror comparison

`/mirror` adds polished chrome with optional live camera reflection. It keeps the existing pointer/gyro tracking, blue hover, click ripple and text avoidance. The other versions never instantiate the camera controller.

Click Enable camera on an HTTPS URL (or localhost). Camera access requests video only, never a microphone. Video is rendered locally; no frames are uploaded or recorded. Switch camera requests the opposite facing mode when available. Stop, page exit, hidden tab and WebGL loss release the stream. Returning to the page requires explicitly enabling the camera again. Denied permission, missing hardware or playback failure leaves a studio-lit chrome model with a retry message.

The camera supplies only one view. Reflection directions are computed from the actual mesh normals and mapped into that live frame as an approximate environment. This is not a 360-degree capture, AR world reconstruction or physically exact mirror.

The referenced Poliigon Shiny Chrome 3157 is Premium. Its downloadable maps are not bundled. Clean PBR chrome approximates its finish; licensed maps can be configured via `avatar.mirror.albedo`, `normal`, `roughnessMap` and `metalnessMap`.
