# Week 2 — RAG (10 of 10 SVGs)

Ten 1600×900 slide-style SVGs covering Retrieval-Augmented Generation for
beginners, from a user's point of view. Built to match the site's dark
purple theme (see `src/app/globals.css`) using the same CVD-validated
categorical palette as Day 1: blue `#5b7cfa`, teal `#0d9488`, amber
`#d97706`, magenta `#ec4899`, green `#16a34a`, violet `#8b5cf6`, red/pink
`#f5576c`.

Rendered on the site at `/week-2` via `Slideshow` (`src/components/Slideshow.tsx`),
served from `public/slides/week-2/`.

1. **01-why-rag.svg** — the knowledge-cutoff / stale-knowledge problem
   LLMs have on their own, contrasted with how RAG grounds answers in
   fresh, private documents.
2. **02-rag-pipeline-overview.svg** — the single most important "map"
   slide: Documents → Chunking → Embeddings → Vector Database → Retrieval
   → LLM Answer.
3. **03-chunking.svg** — a long document being split into smaller pieces,
   plus the chunk-size tradeoff (too big = imprecise, too small = missing
   context).
4. **04-embeddings.svg** — a 2D scatter-plot-style visual showing how
   text becomes a vector, with semantically similar words ("dog",
   "puppy") landing close together and unrelated ones far apart.
5. **05-vector-databases.svg** — how a vector DB stores embeddings and
   runs nearest-neighbor similarity search, with a side panel naming
   real examples (Pinecone, Chroma, pgvector, Weaviate, Qdrant).
6. **06-retrieval-step.svg** — the query gets embedded too, then the
   database returns the top-k most similar chunks with example scored
   results.
7. **07-augmented-prompt.svg** — how retrieved chunks get inserted into
   the LLM's context window alongside the original question, reusing the
   conversation-loop visual style from Day 1.
8. **08-rag-vs-finetuning.svg** — a comparison table contrasting when to
   use RAG (fresh/private knowledge, cheap to update) vs. fine-tuning
   (behavior/style changes, expensive, static).
9. **09-common-pitfalls.svg** — three-card layout covering irrelevant
   retrieval, stale index, and hallucination despite RAG, each with a
   one-line guard.
10. **10-recap-and-exercise.svg** — five-point recap of the pipeline plus
    a three-step live exercise (pick documents → ask a question only they
    can answer → compare with/without the retrieved paragraph).

Open any file directly in a browser to preview, or view in an SVG/vector
editor (Figma, Illustrator, Inkscape) to fine-tune.
