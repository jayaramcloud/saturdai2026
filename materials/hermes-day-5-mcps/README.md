# Hermes Agent, Day 5 — MCPs for Hermes (10 of 10 SVGs)

Ten 1600×900 slide-style SVGs teaching MCP (Model Context Protocol) as it applies to Hermes
Agent specifically, following on from Day 4's RAG session. Built to match the site's dark
purple theme (see `src/app/globals.css`) using the same categorical palette as the rest of the
site: blue `#5b7cfa`, teal `#0d9488`, amber `#d97706`, magenta `#ec4899`, green `#16a34a`,
violet `#8b5cf6`, red/pink `#f5576c`.

Rendered on the site at `/hermes-agent/day-5` via `Slideshow` (`src/components/Slideshow.tsx`),
served from `public/slides/hermes-day-5/`, above the existing lab/objectives content on that
page.

1. **01-recap-and-goal.svg** — Day 4 recap (RAG grounded Hermes in data) vs. today's goal
   (connect Hermes to real external systems over MCP).
2. **02-what-is-mcp.svg** — Hermes Agent connecting through an MCP server to four example
   external systems: time server, filesystem, web search, database.
3. **03-hermes-mcp-add.svg** — anatomy of the `hermes mcp add` command, broken into its three
   parts (name, `--command`, `--args`).
4. **04-worked-example-time-server.svg** — the full worked example: register `mcp-server-time`,
   then ask a question that forces a real tool call.
5. **05-the-path-gotcha.svg** — before/after comparison of the PATH problem: `--command uvx`
   breaking silently vs. registering with an absolute path.
6. **06-verify-not-guess.svg** — silent guess vs. verified tool call, tying back to Day 4's
   "confidently wrong is worse than honest uncertainty" lesson.
7. **07-tour-of-servers.svg** — a grid of other useful MCP servers (filesystem, web search,
   database, GitHub) and the point that they all register the same way.
8. **08-security-consideration.svg** — an MCP server as a real capability grant, with three
   concrete mitigations: scope narrowly, trust the source, watch `--yolo`.
9. **09-common-pitfalls.svg** — the four most common registration failures: flag order, missing
   dependency, PATH not found, server crashing silently.
10. **10-recap-and-preview.svg** — five-point recap plus a preview of Day 6 (Tool Calling &
    Agent Loops).

Open any file directly in a browser to preview, or view in an SVG/vector editor (Figma,
Illustrator, Inkscape) to fine-tune.
