# assets/ – Visual & Palette Resources

This folder contains all pixel‑art assets and color palettes for the TAG gateway’s Roman bureaucracy scene.

## 📁 Structure

```
assets/
├─ board/
│   └─ chalkboard-border.png   ← chalkboard frame for the email form
└─ sprites/                    ← 32×32 pixel-art sprites
    ├─ gateway_closed.png
    ├─ gateway_open.png
    ├─ guard_after.png         ← used by html/success.html (Access Granted)
    ├─ guard_before.png        ← used by html/denied.html (Access Denied)
    ├─ keys_ring.png
    └─ rollerskate_wheel.png
```

---

## 🎨 Usage Snippets

### CSS – Border‑Image

```css
.chalkboard {
  border: 8px solid transparent;
  border-image: url('../assets/board/chalkboard-border.png') 8 fill stretch;
  background-color: #2f3e33; /* slate‑green surface */
}
```

> Note: the `.chalkboard` class actually shipped in `html/visual.html` does **not**
> currently use this border-image (it uses a plain solid border/background
> instead). This snippet documents an available asset and intended usage, not
> necessarily what's live today — see `html/README.md`.

### HTML – Sprite Reference

```html
<img
  src="assets/sprites/guard_before.png"
  width="32" height="32"
  alt="Guard awaiting pass"
/>
```

## 🛠️ Tips & Conventions

- File naming uses snake_case for sprites (e.g. `guard_before.png`), except the
  `board/` border image, which uses kebab-case (`chalkboard-border.png`).
- All sprites are 32×32 px, retro Game Boy style.
- The `board/` border can tile or stretch; seams are part of the aesthetic.
- Place any new pixel art under `sprites/` and update this README accordingly.
- Use nearest‑neighbor scaling in CSS to preserve pixel sharpness:

```css
img.pixel-art {
  image-rendering: pixelated;
}
```
