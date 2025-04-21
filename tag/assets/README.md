README.md
# assets/ – Visual & Palette Resources

This folder contains all pixel‑art assets and color palettes for the TAG gateway’s Roman bureaucracy scene.

## 📁 Structure


# assets/ – Visual & Palette Resources

This folder contains all pixel‑art assets and color palettes for the TAG gateway’s Roman bureaucracy scene.

## 📁 Structure

---

## 🎨 Usage Snippets

### CSS – Border‑Image

```css
.chalkboard {
  border: 8px solid transparent;
  border-image: url('../assets/board/chalkboard_border.png') 8 fill stretch;
  background-color: #2f3e33; /* slate‑green surface */
}

### HTML – Sprite Reference
```
  <img
    src="assets/sprites/guard_before.png"
    width="32" height="32"
    alt="Guard awaiting pass"
  />

##  🛠️ Tips & Conventions
File naming uses snake_case for clarity.

All sprites are 32×32 px, retro Game Boy style.

The board/ border can tile or stretch; seams are part of the aesthetic.

Place any new pixel art under sprites/ and update this README accordingly.

Use nearest‑neighbor scaling in CSS to preserve pixel sharpness:

`````
img.pixel-art {
  image-rendering: pixelated;
}

