<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SaturdAI site

Next.js 16 + TypeScript site for a free AI bootcamp, deployed as a **Cloudflare Worker** (not Pages) via `@opennextjs/cloudflare`, with a D1 database (binding `DB`) for progress tracking.

## Deploying

There is no CI. Every deploy is manual and ships straight to production (saturdai.com and www.saturdai.com — no staging):

```
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
```

**Never run this without the user's explicit go-ahead.** Land and verify changes locally first (`npm run dev` + a Playwright screenshot — `chromium-cli` is not installed in this environment), then wait to be told to commit/push/deploy.

## Week slide decks

`src/app/week-1..4/page.tsx` each render a 10-slide teaching deck via the shared `src/components/Slideshow.tsx` component (`Slide[] = {src, alt, paragraph}[]`). SVG sources live in `materials/<week-name>/*.svg`; the served copies live in `public/slides/week-N/*.svg` — **keep both in sync** when adding or editing slides. All slides share one visual style (1600×900 viewBox, dark purple gradients, a fixed categorical palette) — copy an existing slide as your template rather than inventing a new look. Paragraphs below each slide should be full multi-sentence prose, not clipped one-liners.
