# Personal About page

A Three.js About page inspired by the interaction structure at gionatannese.com/about.

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
