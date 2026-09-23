# Pulling components from UI registries

What was verified in this project, so the next one does not rediscover it.

## React Bits — works, installs through shadcn

```bash
npx shadcn@latest add "@react-bits/BlurText-TS-TW"
```

The registry returns proper shadcn JSON and the CLI writes the file. Three
things it does that need correcting every time:

**1. It has no `"use client"`.** Components are written for a generic React
setup, not the App Router, so a component using `useState`/`useEffect`/`useRef`
fails the build with *"You're importing a module that depends on `useRef` into
a React Server Component"*. Add the directive.

**2. It pins `motion@^12` and will downgrade you.** This project runs
`motion@13`; the install silently moved it to `^12.43.0`. The pin is
conservative — the component compiled and rendered unchanged on 13. Restore the
version afterwards and re-run the build:

```bash
pnpm add motion@^13
```

**3. It lands outside `components/ui`.** The CLI writes to `components/` from
the registry's own path. Move it and rename to the project's convention.

### `motion` vs `framer-motion`

`motion` is the same library renamed; `motion/react` is the modern import path
and what registries expect. This project migrated its single `framer-motion`
import and dropped the old package rather than carrying both — two copies of
the same animation library in one bundle is the thing to avoid.

## Licence — matters for client work

React Bits is **MIT + Commons Clause**, not plain MIT:

> use, copy, modify, merge, publish, and distribute the Software **as part of
> an application, website, or product** … so long as you do not sell,
> sublicense, or redistribute **the components themselves**.

Building client sites with it is fine, including commercially, and handing over
the repo is fine. Selling a starter template or UI kit that bundles the
components is not. Keep them at the project layer, not baked into something
that is itself a product.

## The others from the same list

| | |
|---|---|
| **Uiverse** | MIT, community CSS/Tailwind snippets. Zero risk, copy-paste, but most use raw values and need porting to the design tokens. |
| **Unicorn Studio** | Free tier watermarks the site; ~$168/yr removes it and grants a commercial licence. Same category as `@paper-design/shaders-react`, which this project already uses for free — you would be paying for the visual editor. |
| **Mobbin** | Screenshots of real apps, no code. ~$10–17/mo, has an MCP. Design research, not integration. |

## Treat registry components as starting points

Two components pasted in from registries during this project needed real work
before they were safe:

- One targeted an **older version of its own shader library** and did not
  compile — `backgroundColor` and `wireframe` no longer exist.
- One **trapped keyboard users**: it called `scrollTo(0,0)` on every scroll
  until an animation completed, with no release.

Before shipping anything from a registry, check it in this order: does it
compile against the installed versions; does it respect
`prefers-reduced-motion`; can it be used with a keyboard; does it use project
tokens rather than hard-coded colours. See `components/ui/shader-hero.tsx` for
what that ends up looking like.
