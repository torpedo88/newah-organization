# The printed QR code — do not break this URL

The current code encodes:

```
https://www.noancc.org/register/indrajatra
```

Version 5, error correction level **H** — roughly 30% of the code can be
creased, stained or obscured and still scan, which is what a poster actually
endures.

**Source of truth:** `docs/qr-register-print.png` (1960×1960).
Regenerated 2026-09-23 when the site moved to its own domain.

A printed QR code cannot be updated. Once posters, flyers or signs are out,
that URL has to keep resolving **forever**, or every printed code is dead with
no way to fix it.

## Codes printed before 2026-09-23

Earlier material encodes the old address:

```
https://newah-organization.vercel.app/register
```

**It still works**, and must continue to. Two redirects carry it:

1. `newah-organization.vercel.app/*` → `www.noancc.org/*` (host redirect)
2. `/register` → `/register/indrajatra` (path redirect)

Both live in `next.config.ts`. The previous image is kept alongside as
`qr-register-print-OLD-vercel-url.png` so anyone holding old material can
confirm what it points at.

## What is safe

- Redeploying, changing the framework, editing the page.
- Adding further domains. Vercel keeps every attached hostname working.
- Changing which host is canonical — **provided** the old one keeps redirecting
  rather than being removed.

## What breaks every printed code

- **Removing either redirect in `next.config.ts`.** The two above are the only
  thing keeping pre-2026-09-23 material alive. They are not tidy-up candidates.
- **Renaming the Vercel project.** The `.vercel.app` hostname derives from the
  project name, so a rename changes it and the old code dies.
- **Deleting the project**, or detaching `newah-organization.vercel.app` or
  `www.noancc.org` from it.
- **Letting `noancc.org` lapse.** Domain registration is now load-bearing for
  printed material; a missed renewal kills every current code.
- Removing or renaming the `/register/indrajatra` route without leaving a
  redirect behind.

## Before printing a new batch

Decode the actual file rather than trusting the generator, and confirm the
decoded string resolves:

```bash
# in a scratch dir
npm install jsqr pngjs
node -e '
const fs=require("fs"),{PNG}=require("pngjs"),jsQR=require("jsqr");
const p=PNG.sync.read(fs.readFileSync("docs/qr-register-print.png"));
console.log(jsQR(new Uint8ClampedArray(p.data),p.width,p.height).data);
'
```

Then scan the printed sheet with an actual phone. A code that decodes in
software can still fail on paper at the wrong size or contrast.
