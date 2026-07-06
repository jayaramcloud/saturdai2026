# Week 3 — MCPs (10 of 10 SVGs)

Ten 1600×900 slide-style SVGs introducing the Model Context Protocol (MCP)
for beginners, from a user's point of view. Built to match the site's dark
purple theme (see `src/app/globals.css`) using the same CVD-validated
categorical palette as Day 1: blue `#5b7cfa`, teal `#0d9488`, amber
`#d97706`, magenta `#ec4899`, green `#16a34a`, violet `#8b5cf6`, red/pink
`#f5576c`.

Rendered on the site at `/week-3` via `Slideshow` (`src/components/Slideshow.tsx`),
served from `public/slides/week-3/`.

1. **01-why-mcps.svg** — the N×M integration problem before MCP, and MCP
   as a shared standard ("a USB-C port for AI apps").
2. **02-client-server-architecture.svg** — a host app (e.g. Claude Desktop)
   running an MCP client that connects to multiple MCP servers.
3. **03-three-primitives.svg** — the three things a server exposes:
   Resources (read), Tools (act), and Prompts (reusable templates).
4. **04-connection-and-discovery.svg** — the handshake: client connects,
   asks "what can you do?", server lists its tools/resources/prompts.
5. **05-real-world-example.svg** — a concrete GitHub MCP server exposing
   `create_issue`, `list_pull_requests`, and a `repo://readme` resource.
6. **06-tool-call-flow.svg** — the full round trip: user asks → LLM picks
   a tool → client forwards it → server executes → LLM answers.
7. **07-security-and-permissions.svg** — the consent flow before a tool
   runs, plus a warning box of risks to watch for (over-broad access,
   prompt injection, untrusted servers).
8. **08-mcp-vs-custom-integration.svg** — comparison table: one-off custom
   integrations vs. a standard, reusable MCP server.
9. **09-building-your-first-server.svg** — a five-step conceptual roadmap
   from defining scope to testing a server live in Claude Desktop/Code.
10. **10-recap-and-exercise.svg** — five-point recap plus a three-step
    live exercise (pick a server → connect it → trigger a tool call).

Open any file directly in a browser to preview, or view in an SVG/vector
editor (Figma, Illustrator, Inkscape) to fine-tune.
