# Day 2: Hermes Fundamentals — slide deck narrative

Ten slides carrying the arc of Day 2 of the Agentic AI with Hermes Agent course
(Mon, Sep 28, 2026): from "we talked about it Day 1" to "it's actually running."

1. **Recap and goal** — bridges Day 1's talk-only intro into today's hands-on goal.
2. **Provider-agnostic** — Hermes as a hub that can point at any OpenAI-compatible endpoint.
3. **Local vs. cloud** — side-by-side comparison of the DGX Spark endpoint we'll use today
   vs. a hosted cloud API we won't.
4. **hermes config flow** — the four-step wizard that saves a custom provider.
5. **One-shot round trip** — the actual `hermes -z ... --cli` command and what happens end to end.
6. **Chat template cycle** — the hidden formatting step between your prompt and the model,
   and why getting it wrong causes silent quality problems rather than a crash.
7. **hermes doctor** — the four things the health check verifies, framed as a habit to build
   from Day 2 onward, not a one-off.
8. **Common pitfalls** — the three most likely ways today's lab breaks, matched to which
   `hermes doctor` check would have caught each one.
9. **Hermes vs. chat UI** — positions the CLI against ChatGPT/Claude web to make clear why
   this course needs an agent tool, not just a chatbot.
10. **Recap and preview** — closes the loop on Day 2 and previews Day 3 (LLM routing across
    multiple local models), keeping the "you are here" narrative continuous across days.

Visual language matches `materials/day-1-intro-to-llms/`: 1600×900 viewBox, dark purple
gradient background (`#0f0f1e` → `#1a1a2e`), the same categorical palette (blue `#5b7cfa`,
teal `#0d9488`, orange `#d97706`, pink `#ec4899`, purple `#8b5cf6`/`#c4b5fd`), and the same
footer convention (`SaturdAI · Hermes Agent · Day 2: Fundamentals` / `n / 10`).
