import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";
import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/hermes-day-4/01-recap-and-goal.svg",
    alt: "Two-panel recap: Day 3 covered LLM routing between models; Day 4's goal is grounding Hermes in real data with RAG since routing alone gives no model new knowledge",
    paragraph:
      "Day 3 taught Hermes to pick the right model for a task, but routing alone doesn't give any model new knowledge — every model still only knows what it was trained on. Today closes that gap with Retrieval-Augmented Generation: standing up a vector store loaded with real documents, wiring it into Hermes as a tool, and testing both a grounded question and one the documents don't cover.",
  },
  {
    src: "/slides/hermes-day-4/02-knowledge-cutoff.svg",
    alt: "Timeline diagram showing a hard training-data cutoff line, with everything before it known to the model and everything after it — including our own course documents — unknown",
    paragraph:
      "Every LLM has a hard training-data cutoff — a line in time past which it simply has no information, whether that's this morning's news or a private document it never saw. Asked about anything past that line, a model either says so honestly or, worse, fills the gap with a fluent, confident-sounding guess. RAG exists specifically to let a model look past that line by retrieving real, current documents before it answers.",
  },
  {
    src: "/slides/hermes-day-4/03-rag-pipeline.svg",
    alt: "Six-step RAG pipeline diagram: documents, chunk and embed, ChromaDB vector store, Hermes calls the retrieval tool, top-k chunks returned, grounded answer",
    paragraph:
      "The RAG pipeline is one map worth memorizing: documents get chunked and embedded into vectors ahead of time and stored in ChromaDB, then live, every time a question comes in, Hermes calls the retrieval tool, gets back the top-k most relevant chunks, and writes an answer that's grounded in — and can cite — that retrieved text instead of its own frozen training data.",
  },
  {
    src: "/slides/hermes-day-4/04-chromadb.svg",
    alt: "ChromaDB shown as a standalone container with three connected capabilities: stores embeddings, runs similarity search, and is reachable by Hermes over MCP",
    paragraph:
      "ChromaDB runs as its own standalone service, not baked into the model. It stores every chunk of our course material as a vector alongside its source text, answers similarity-search queries by finding the nearest-neighbor chunks by meaning rather than keyword match, and is exposed over MCP so Hermes can call it as a tool in the middle of a conversation.",
  },
  {
    src: "/slides/hermes-day-4/05-retrieval-as-a-tool.svg",
    alt: "Contrast of manual copy-paste RAG, where the user searches and pastes results by hand, against registering retrieval as an MCP tool that Hermes calls on its own",
    paragraph:
      "The old way of doing RAG was manual: search the vector store yourself, copy the results into the chat, then hope you grabbed the right passage before asking your question. Registering retrieval as an MCP tool with hermes mcp add flips that — you just ask your question in plain English, and Hermes decides on its own that it needs to call the retrieval tool before it can answer correctly, every single time.",
  },
  {
    src: "/slides/hermes-day-4/06-grounded-question-flow.svg",
    alt: "Traced four-step flow of a grounded question: the user asks about MCP servers, Hermes calls the retrieval tool, ChromaDB returns the top-k chunks, and Hermes answers with a citation",
    paragraph:
      "Tracing one real question end to end: you ask what the course material says about MCP servers, Hermes calls chroma-rag's query function behind the scenes, ChromaDB returns the five most relevant passages ranked by similarity, and Hermes's final answer is written from those passages and can point back to exactly which one it used — a citation, not a guess.",
  },
  {
    src: "/slides/hermes-day-4/07-out-of-scope-question.svg",
    alt: "Side-by-side contrast of a confidently-wrong RAG answer built from weak retrieved chunks versus an honestly-uncertain answer that admits the documents don't cover the question",
    paragraph:
      "RAG doesn't automatically remove the guessing problem — how you prompt it decides which outcome you get. If retrieval returns weak or irrelevant chunks and Hermes still writes a fluent, confident answer anyway, that's arguably worse than no RAG at all, since it looks grounded without being grounded. Instructing Hermes to answer only from what it actually retrieved, and to say so when nothing relevant comes back, is what makes an honest 'I don't know' the outcome instead.",
  },
  {
    src: "/slides/hermes-day-4/08-chunking-basics.svg",
    alt: "Side-by-side comparison of small document chunks (precise but narrow, losing surrounding context) versus large chunks (broad but noisy, diluting the retrieved signal)",
    paragraph:
      "Chunk size is one of the biggest levers in whether retrieval actually helps. Small chunks let retrieval pinpoint the exact sentence that matters, but can lose the surrounding context that makes that sentence meaningful. Large chunks preserve that context but bring back a lot of text the question didn't ask about, diluting the signal and eating into the model's context window — there's no universally correct size, only a tradeoff to make deliberately.",
  },
  {
    src: "/slides/hermes-day-4/09-common-pitfalls.svg",
    alt: "Three-card layout of common RAG pitfalls: wrong collection loaded, stale index after documents change, and irrelevant retrieval, each paired with a guard against it",
    paragraph:
      "Three things quietly break RAG in practice: pointing the retrieval tool at the wrong collection, so it's confidently answering from last week's documents instead of today's; a stale index, where source documents changed but the vector store was never re-embedded; and retrieval simply returning irrelevant chunks that don't answer the question at all. The guard for the first two is checking the collection name and re-running ingestion whenever docs change; the guard for the third is instructing Hermes to say so instead of guessing.",
  },
  {
    src: "/slides/hermes-day-4/10-recap-and-next.svg",
    alt: "Five-point recap of RAG fundamentals alongside a preview of Day 5: MCPs for Hermes, generalizing the retrieval-as-a-tool pattern to any external system",
    paragraph:
      "Today's five takeaways: LLMs freeze at training time, RAG's pipeline runs chunk, embed, store, then retrieve, ChromaDB is the vector store doing the storing and searching, Hermes calls retrieval as an MCP tool rather than through manual copy-paste, and honest uncertainty beats a fluent guess every time. Day 5 generalizes exactly this pattern — retrieval was our first MCP tool, and Monday we register more of them to reach any external system Hermes needs to touch.",
  },
];

const h2Style: CSSProperties = { color: "#ffffff", fontSize: "1.4rem", margin: "2rem 0 1rem" };
const pStyle: CSSProperties = { marginBottom: "1.5rem" };
const listStyle: CSSProperties = { marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 };
const noteStyle: CSSProperties = {
  background: "#2a2a4a",
  border: "1px solid #44447a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};
const warnStyle: CSSProperties = {
  background: "#3a2222",
  border: "1px solid #6a3a3a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};

export default function HermesAgentDay4() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 4 · Fri, Oct 2, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        RAG with Hermes
      </h1>

      <Slideshow slides={SLIDES} />

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A local LLM only knows what it was trained on — ask it about a document it&apos;s never seen and
          it will either say so or, worse, confidently guess. Today grounds Hermes Agent in real data
          instead: standing up a vector store, feeding it real documents, and connecting Hermes to it as a
          tool it can query before answering.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Stand up a standalone vector store (ChromaDB) and load it with real documents</li>
          <li>Wire retrieval into Hermes as a tool it can call, not a manual copy-paste step</li>
          <li>Ask Hermes questions that require the retrieved context to answer correctly</li>
          <li>Deliberately test a question the documents don&apos;t cover, to see how Hermes handles it</li>
        </ul>

        <h2 style={h2Style}>Lab: ground Hermes in a real document set</h2>
        <p style={pStyle}>
          With a ChromaDB instance already loaded with course material (following the same setup as{" "}
          <Link href="/docs/chromadb-rag-open-webui" style={{ color: "#a0a0ff" }}>
            our earlier ChromaDB RAG walkthrough
          </Link>
          ), register it as an MCP tool Hermes can call, then ask it a grounded question:
        </p>
        <CodeBlock code={`$ hermes mcp add chroma-rag --command uvx --args mcp-server-chroma`} />
        <CodeBlock code={`$ hermes -z "Using the retrieval tool, what does our course material say about MCP servers? Cite what you found." --cli --yolo`} />

        <div style={warnStyle}>
          <p style={{ margin: 0 }}>
            <strong>Before running this live:</strong> confirm which document set is loaded into the vector
            store — pointing the RAG tool at the wrong collection produces a confidently wrong answer
            instead of an honest &quot;I don&apos;t know,&quot; which is worse for teaching than no RAG at
            all.
          </p>
        </div>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Oct 2, 2026 —
            document set used, the real grounded answer we got, and what happened on the out-of-scope
            question.
          </p>
        </div>
      </div>
    </main>
  );
}
