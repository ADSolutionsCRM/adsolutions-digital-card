from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "portraits" / "andreas-contact-branded.jpg"
OUT = ROOT / "card" / "andreas" / "icons"
OUT.mkdir(parents=True, exist_ok=True)

img = Image.open(SOURCE).convert("RGB")
square = ImageOps.fit(img, (1024, 1024), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

for size, name in [
    (180, "apple-touch-icon.png"),
    (192, "icon-192.png"),
    (512, "icon-512.png"),
]:
    icon = square.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(OUT / name, format="PNG", optimize=True)

print("Built Home Screen / PWA icons from ADSolutions branded portrait.")
