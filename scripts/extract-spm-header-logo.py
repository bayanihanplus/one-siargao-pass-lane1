from pathlib import Path
import sys

try:
    from PIL import Image, ImageChops
except Exception:
    print("Pillow is required. Install with: python3 -m pip install Pillow")
    sys.exit(1)

src = Path("frontend/public/osp/one-siargao-pass.png")
out = Path("frontend/public/osp/one-siargao-pass-logo.png")

if not src.exists():
    print(f"STOP: source asset not found: {src}")
    sys.exit(1)

img = Image.open(src).convert("RGBA")
w, h = img.size

left = int(w * 0.065)
top = int(h * 0.085)
right = int(w * 0.235)
bottom = int(h * 0.200)

crop = img.crop((left, top, right, bottom))

bg = Image.new("RGBA", crop.size, (255, 255, 255, 255))
diff = ImageChops.difference(crop, bg)
bbox = diff.getbbox()

if bbox:
    crop = crop.crop(bbox)

pad = 16
final = Image.new("RGBA", (crop.width + pad * 2, crop.height + pad * 2), (255, 255, 255, 0))
final.paste(crop, (pad, pad), crop)

out.parent.mkdir(parents=True, exist_ok=True)
final.save(out)

print(f"CREATED: {out}")
print(f"SIZE: {final.width}x{final.height}")
