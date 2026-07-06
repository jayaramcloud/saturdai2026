# Week 4 — Tool Calling (10 of 10 SVGs)

Ten 1600×900 slide-style SVGs covering tool calling and agents, from "the
model can only produce text" up through multi-step agents and safety. Built
to match the site's dark purple theme (see `src/app/globals.css`) using the
same CVD-validated categorical palette as Day 1: blue `#5b7cfa`, teal
`#0d9488`, amber `#d97706`, magenta `#ec4899`, green `#16a34a`, violet
`#8b5cf6`, red/pink `#f5576c`.

Rendered on the site at `/week-4` via `Slideshow` (`src/components/Slideshow.tsx`),
served from `public/slides/week-4/`.

1. **01-what-is-tool-calling.svg** — side-by-side comparison of "text only"
   (the model can only guess) vs. "text + real actions" (the model calls a
   tool and gets a real result back).
2. **02-tool-calling-loop.svg** — the full cycle: user asks → model decides
   & picks a tool + arguments → your code executes it → the result returns
   to the model → the model answers, with a note on multi-tool chains.
3. **03-defining-a-tool-schema.svg** — an annotated `get_weather` tool
   definition broken into its parts: name, description, parameters
   (JSON-Schema-style), and required fields.
4. **04-multi-step-agents.svg** — a roadmap-style chain of three tool calls
   (flight status → weather → email) built from a single user request.
5. **05-error-handling-and-retries.svg** — a failed tool call flowing back
   to the model as a structured error, plus common causes and graceful
   recovery options (retry, ask, fall back, report).
6. **06-agents-vs-tool-calling.svg** — comparison table of a single tool
   call vs. an agent loop across shape, planning, tool use, progress
   checks, and good-fit use cases.
7. **07-real-world-example.svg** — a concrete scenario: check the weather
   for a hike, then decide whether to book a calendar event, with a
   flowchart decision branch.
8. **08-safety-and-human-in-the-loop.svg** — the pause-for-confirmation
   flow for risky/irreversible actions, plus a guardrail pattern and a list
   of actions that deserve human approval.
9. **09-limitations.svg** — three failure modes: hallucinated tool calls,
   wrong arguments, and cost/latency, each with a one-line guard.
10. **10-recap-and-exercise.svg** — five-point recap of the key ideas plus
    a three-step live exercise (describe a tool → have an assistant use
    it → give it a bad request and observe).

Open any file directly in a browser to preview, or view in an SVG/vector
editor (Figma, Illustrator, Inkscape) to fine-tune.
