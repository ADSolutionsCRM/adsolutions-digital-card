from pathlib import Path
from io import BytesIO
import base64
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PORTRAIT = ROOT / "assets" / "portraits" / "ChatGPT Image Sep 22, 2026, 02_45_11 PM.png"
OUTPUT = ROOT / "card" / "andreas" / "contact.vcf"

def fold_vcard_line(line: str, width: int = 74) -> str:
    if len(line) <= width:
        return line
    chunks = [line[:width]]
    pos = width
    continuation_width = width - 1
    while pos < len(line):
        chunks.append(line[pos:pos + continuation_width])
        pos += continuation_width
    return "\r\n ".join(chunks)

img = Image.open(PORTRAIT).convert("RGB")
w, h = img.size

# Tight head-and-shoulders crop tuned to the approved ADSolutions portrait.
left = round(w * 0.375)
top = round(h * 0.056)
right = round(w * 0.818)
bottom = round(h * 0.499)
photo = img.crop((left, top, right, bottom)).resize((320, 320), Image.Resampling.LANCZOS)

buf = BytesIO()
photo.save(buf, format="JPEG", quality=82, optimize=True, progressive=True)
photo_b64 = base64.b64encode(buf.getvalue()).decode("ascii")

lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Demetriou;Andreas;;;",
    "FN:Andreas Demetriou",
    "ORG:ADSolutions",
    "TITLE:Founder",
    "TEL;TYPE=CELL,VOICE:+35796551277",
    "EMAIL;TYPE=INTERNET,WORK:info@adsolutionsglobal.com",
    "URL;TYPE=WORK:https://adsolutionsglobal.com",
    "URL;TYPE=LinkedIn:https://www.linkedin.com/in/andreas-demetriou-b472a7a3",
    "URL;TYPE=Instagram:https://instagram.com/adsolutions.hq",
    "URL;TYPE=WhatsApp:https://wa.me/35796551277",
    "NOTE:Strategy · Innovation · Growth",
    fold_vcard_line("PHOTO;ENCODING=b;TYPE=JPEG:" + photo_b64),
    "END:VCARD",
]
OUTPUT.write_bytes(("\r\n".join(lines) + "\r\n").encode("utf-8"))
print(f"Built {OUTPUT} with embedded JPEG contact photo ({len(buf.getvalue())} bytes).")
