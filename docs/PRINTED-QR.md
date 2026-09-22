# The printed QR code — do not break this URL

Physical QR codes have been printed pointing at:

```
https://newah-organization.vercel.app/register
```

A printed code cannot be updated. Once posters, flyers or signs are out, that
hostname has to keep resolving **forever**, or every printed code is dead with
no way to fix it.

## What is safe

- **Adding a custom domain** (e.g. noanc.org). Vercel keeps the project's
  `.vercel.app` hostname working alongside any custom domain, so printed codes
  keep working. New printed material should use the custom domain; old material
  keeps working through this one.
- Redeploying, changing the framework, editing the page — none of that touches
  the hostname.

## What breaks every printed code

- **Renaming the Vercel project.** The default hostname is derived from the
  project name: rename `newah-organization` and the URL changes.
- **Deleting the project**, or deleting that domain from the project.
- **Transferring the project** to another account or team, which can reassign
  the hostname if the name is already taken there.
- Removing or redirecting away the `/register` route.

## If a rename ever becomes unavoidable

Put a permanent redirect in place from the old hostname to the new one *before*
the rename, and verify a printed code still resolves end to end. Do not rely on
remembering — test an actual physical code with a phone.

## The source of truth

`brag-output-*/qr-register-print.png` — 1960x1960, QR version 6, error
correction level H (~30% of the code can be damaged and still scan).

It was verified by decoding, not by trusting the encoder: the generated file,
the rendered video frame, and the final H.264-encoded MP4 all decode to the URL
above.

To regenerate or verify:

```bash
uv run --with "qrcode[pil]" --with opencv-python-headless --with numpy python - <<'EOF'
import qrcode, cv2
from qrcode.constants import ERROR_CORRECT_H
URL = "https://newah-organization.vercel.app/register"
qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=40, border=4)
qr.add_data(URL); qr.make(fit=True)
qr.make_image(fill_color="black", back_color="white").convert("RGB").save("qr.png")
print(cv2.QRCodeDetector().detectAndDecode(cv2.imread("qr.png"))[0] == URL)
EOF
```
