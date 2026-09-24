# Day 3: LLM Routing with Hermes — Deck Narrative

10 slides walking from "why route at all" to "here's how we measure it," ending with a
concrete recap and a hook into Day 4 (RAG).

1. **Recap & goal** — Day 2 ended with one Hermes, one model; today's arc is one Hermes,
   many models, chosen deliberately per task.
2. **DGX Spark memory** — the 128GB unified memory budget is the enabling constraint: it's
   what makes keeping two models resident (instead of swapping) practical.
3. **Small vs. large tradeoffs** — a straight pros/cons comparison, framed as "suited to
   different jobs" rather than "one is better."
4. **Registering a second provider** — the mechanical step: `hermes config` now points at
   two local endpoints instead of one.
5. **Routing decision diagram** — the three-stage flow (prompt → classify → pick a model)
   that frames the rest of the deck. Explicitly notes today's "classification" is manual,
   not an automated router — keeps the lab honest about its own simplification.
6. **Example: quick lookup** — routed to the small model, with the actual `hermes -z`
   command we'll run live.
7. **Example: complex reasoning** — the mirror-image case, routed to the large model, same
   command structure for a direct comparison.
8. **Latency vs. quality table** — the two examples turned into a side-by-side comparison
   table across four metrics, ending on the "neither wins outright" takeaway.
9. **Common routing mistakes** — three real failure patterns (always-big-model,
   never-spot-checking, never-actually-comparing) each with a one-line fix.
10. **Recap & Day 4 preview** — four-bullet summary, then a hook into RAG: even the large
    model only knows what it was trained on.

Visual template copied from `materials/day-1-intro-to-llms/` (1600×900 viewBox, dark purple
gradient background, same categorical palette — blue/teal/green/orange/purple/pink/red per
section). Slide 5's three-stage flow reuses the arrow/loop pattern from
`materials/day-1-intro-to-llms/05-conversation-loop.svg`.
