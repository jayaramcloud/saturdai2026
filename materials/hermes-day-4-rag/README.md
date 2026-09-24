# Hermes Agent Day 4 — RAG with Hermes (10 of 10 SVGs)

Ten 1600×900 slide-style SVGs covering Retrieval-Augmented Generation, built for Day 4 of the
Agentic AI with Hermes Agent course (Fri, Oct 2, 2026). Matches the site's dark purple theme and
the same categorical palette used across the site: blue `#5b7cfa`, teal `#0d9488`, amber
`#d97706`, magenta `#ec4899`, green `#16a34a`, violet `#8b5cf6`, red/pink `#f5576c`. Visual
grammar (card layout, pipeline-diagram style, footer format) is deliberately reused from
`materials/week-2-rag/`, since RAG is the closest existing analog.

Rendered on the site at `/hermes-agent/day-4` via `Slideshow` (`src/components/Slideshow.tsx`),
served from `public/slides/hermes-day-4/`.

1. **01-recap-and-goal.svg** — recaps Day 3 (LLM routing) and states today's goal: routing
   picks the right model, but no model gets new knowledge without RAG.
2. **02-knowledge-cutoff.svg** — a timeline visual of the hard training-data cutoff, with what
   the model knows vs. doesn't.
3. **03-rag-pipeline.svg** — the six-step pipeline map: documents → chunk+embed → ChromaDB →
   Hermes calls the tool → top-k chunks → grounded answer.
4. **04-chromadb.svg** — ChromaDB as a standalone service: stores embeddings, runs similarity
   search, reachable by Hermes over MCP.
5. **05-retrieval-as-a-tool.svg** — contrasts manual copy-paste RAG against registering
   retrieval as an MCP tool Hermes calls on its own.
6. **06-grounded-question-flow.svg** — a traced example: question → tool call → chunks
   returned → cited answer.
7. **07-out-of-scope-question.svg** — side-by-side contrast of a confidently-wrong RAG answer
   vs. an honestly-uncertain one, and how prompting decides which happens.
8. **08-chunking-basics.svg** — small vs. large chunk size tradeoffs, precise-but-narrow vs.
   broad-but-noisy.
9. **09-common-pitfalls.svg** — three-card layout: wrong collection loaded, stale index,
   irrelevant retrieval, each with a guard.
10. **10-recap-and-next.svg** — five-point recap plus a preview of Day 5 (MCPs for Hermes).

Open any file directly in a browser to preview, or view in an SVG/vector editor (Figma,
Illustrator, Inkscape) to fine-tune.
