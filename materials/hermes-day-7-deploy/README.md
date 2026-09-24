# Hermes Agent Day 7 — Deploy a Production Hermes Agent (10 of 10 SVGs)

Ten 1600×900 slide-style SVGs for the capstone session of the Agentic AI with Hermes Agent
course (Fri, Oct 9, 2026). Built to match the site's dark purple theme (see
`src/app/globals.css`) using the same categorical palette as the week decks: blue `#5b7cfa`,
teal `#0d9488`, amber `#d97706`, magenta `#ec4899`, green `#16a34a`, violet `#8b5cf6`,
red/pink `#f5576c`.

Rendered on the site at `/hermes-agent/day-7` via `Slideshow`
(`src/components/Slideshow.tsx`), above the existing lab/notes content on that page, served
from `public/slides/hermes-day-7/`.

1. **01-six-day-recap.svg** — the six prior days as a pipeline (Fundamentals → Routing → RAG →
   MCPs → Tool Calling), with today's Deploy step highlighted as where they all combine.
2. **02-what-is-production.svg** — side-by-side comparison of a one-shot `hermes -z` command
   versus a systemd-managed production service.
3. **03-hermes-doctor-preflight.svg** — a checklist of what `hermes doctor` verifies before any
   deploy step is attempted.
4. **04-packaging-config.svg** — three inputs (model endpoint, MCP servers, RAG collection)
   flowing into one config bundle that a systemd service reads.
5. **05-systemd-service.svg** — an annotated `hermes-agent.service` unit file next to what
   `enable --now`, `Restart=on-failure`, and `status` each actually do.
6. **06-capstone-task.svg** — one prompt fanning out into three exercised skills (RAG lookup,
   MCP tool call, agent loop) and back into a single answer.
7. **07-monitoring-restart-policy.svg** — the crash → systemd restart → logged-not-lost flow
   that makes an overnight failure a non-event.
8. **08-what-you-built.svg** — a hub-and-spoke diagram of the finished agent's five combined
   capabilities.
9. **09-where-to-go-next.svg** — six concrete extension ideas for continuing after the course.
10. **10-course-wrapup.svg** — a six-point recap of the full course plus a closing thank-you.

Open any file directly in a browser to preview, or view in an SVG/vector editor (Figma,
Illustrator, Inkscape) to fine-tune.
