# Hermes Agent Day 6 — Tool Calling & Agent Loops (10 of 10 SVGs)

Ten 1600×900 slide-style SVGs covering multi-step agent loops with Hermes Agent, from a single
tool call up through debugging a real trace. Built to match the site's dark purple theme and the
same categorical palette used across week-1..4: blue `#5b7cfa`, teal `#0d9488`, amber `#d97706`,
magenta `#ec4899`, green `#16a34a`, violet `#8b5cf6`, red/pink `#f5576c`. Closely modeled on
`materials/week-4-tool-calling/`, the closest existing deck for this topic.

Rendered on the site at `/hermes-agent/day-6` via `Slideshow`
(`src/components/Slideshow.tsx`), above the day's existing lab content, served from
`public/slides/hermes-day-6/`.

1. **01-recap-and-goal.svg** — Day 5's single MCP tool call vs. today's goal of chaining many
   calls into a loop.
2. **02-call-vs-loop.svg** — side-by-side: a single tool call (three steps, done) vs. an agent
   loop (call → observe → decide → repeat/stop).
3. **03-the-loop-cycle.svg** — the four-step cycle every agent loop repeats, arranged in a
   circular diagram: call tool, observe result, decide next step, repeat or stop.
4. **04-yolo-flag.svg** — with vs. without `--yolo`: the confirmation pause it skips, and a
   warning to use it deliberately.
5. **05-worked-example-file-loop.svg** — the write-then-read-back lab exercise as a two-call
   chain with Hermes's final answer.
6. **06-worked-example-code-execution.svg** — the Fibonacci/primes code-execution lab as a
   four-step pipeline (write code → run → read output → use in answer), with real output shown.
7. **07-worked-example-delegation.svg** — the haiku subagent-delegation lab as a main-agent /
   subagent round trip, plus why delegation keeps context clean.
8. **08-when-loops-go-wrong.svg** — two failure modes: the infinite retry loop, and a
   confidently-wrong answer built on a misread intermediate result.
9. **09-debugging-the-loop.svg** — a mock trace log showing exactly how those failures are
   visible in the call sequence even when the final answer looks fine.
10. **10-recap-and-preview.svg** — five-point recap plus a lead-in to Day 7 (deploying a
    production Hermes agent).

Open any file directly in a browser to preview, or view in an SVG/vector editor (Figma,
Illustrator, Inkscape) to fine-tune.
