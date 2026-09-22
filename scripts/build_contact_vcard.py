from pathlib import Path
from io import BytesIO
import base64
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PORTRAIT = ROOT / "assets" / "portraits" / "andreas-contact-branded.jpg"
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
photo = img.resize((700, 700), Image.Resampling.LANCZOS)

buf = BytesIO()
photo.save(buf, format="JPEG", quality=94, optimize=True, progressive=True)
photo_b64 = base64.b64encode(buf.getvalue()).decode("ascii")

lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//ADSolutions//Digital Card//EN",
    "UID:adsolutions-andreas-demetriou-001",
    "N:Demetriou;Andreas;;;",
    "FN:Andreas Demetriou",
    "ORG:ADSolutions",
    "TITLE:Founder",
    "TEL;TYPE=CELL,VOICE:+35796551277",
    "EMAIL;TYPE=INTERNET,WORK:andreas.demetriou@adsolutionsglobal.com",
    "URL;TYPE=WORK:https://adsolutionsglobal.com",
    "URL;TYPE=LinkedIn:https://www.linkedin.com/in/andreas-demetriou-b472a7a3",
    "URL;TYPE=Instagram:https://instagram.com/adsolutions.hq",
    "URL;TYPE=WhatsApp:https://wa.me/35796551277",
    "NOTE:Strategy · Innovation · Growth",
    fold_vcard_line("PHOTO;ENCODING=b;TYPE=JPEG:" + photo_b64),
    "END:VCARD",
]
OUTPUT.write_bytes(("\r\n".join(lines) + "\r\n").encode("utf-8"))
print(f"Built {OUTPUT} with dedicated embedded contact photo ({len(buf.getvalue())} bytes).")
