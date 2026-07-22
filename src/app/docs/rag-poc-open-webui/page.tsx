import Link from "next/link";
import type { CSSProperties } from "react";

const codeStyle: CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #33335a",
  borderRadius: 8,
  padding: "1rem",
  overflowX: "auto",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  marginBottom: "1.5rem",
};

const h2Style: CSSProperties = { color: "#ffffff", fontSize: "1.4rem", margin: "2rem 0 1rem" };
const h3Style: CSSProperties = { color: "#ffffff", fontSize: "1.1rem", margin: "1.5rem 0 0.75rem" };
const pStyle: CSSProperties = { marginBottom: "1.5rem" };
const noteStyle: CSSProperties = {
  background: "#2a2a4a",
  border: "1px solid #44447a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};
const figureStyle: CSSProperties = { marginBottom: "1.5rem" };
const imgStyle: CSSProperties = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid #33335a",
  display: "block",
};
const captionStyle: CSSProperties = {
  color: "#8888aa",
  fontSize: "0.8rem",
  marginTop: "0.5rem",
  textAlign: "center",
};

export default function RagPocOpenWebui() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-21</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        RAG Proof-of-Concept in Open WebUI
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A minimal, five-minute proof that Open WebUI&apos;s built-in RAG (Retrieval-Augmented
          Generation) actually retrieves from an uploaded document rather than the model just
          hallucinating a plausible answer. No extra services required — Open WebUI ships its own
          embedding model and vector store out of the box.
        </p>
        <p style={pStyle}>
          <strong>The trick:</strong> feed the model a document containing a claim no LLM would ever
          state on its own (here: &quot;Sumerians are the best people in the world&quot;). If the model
          repeats that specific, absurd claim back with a citation, the only way it could know that
          is from the document — proof the retrieval pipeline is working.
        </p>

        <h2 style={h2Style}>1. Check the embedding settings</h2>
        <p style={pStyle}>
          Go to <strong>Admin Panel → Settings → Documents</strong>. The default{" "}
          <strong>Embedding Model Engine</strong> is <strong>Default (SentenceTransformers)</strong>,
          using <code>sentence-transformers/all-MiniLM-L6-v2</code> — a small local embedding model,
          no API key or GPU required. This is fine as-is for a POC; no changes needed.
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/rag-poc-open-webui/embedding-settings.png"
            alt="Open WebUI Admin Panel → Settings → Documents, showing Embedding Model Engine set to Default (SentenceTransformers) with model sentence-transformers/all-MiniLM-L6-v2, Hybrid Search enabled, and Top K set to 3"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            Default embedding + retrieval config: local SentenceTransformers embeddings, Hybrid
            Search on, Top K = 3.
          </figcaption>
        </figure>

        <h2 style={h2Style}>2. Create a knowledge collection</h2>
        <p style={pStyle}>
          Go to <strong>Workspace → Knowledge → + Create new knowledge</strong>. Name it{" "}
          <code>RAG POC</code> with description <code>Test knowledge base for RAG proof-of-concept</code>{" "}
          and save.
        </p>

        <h2 style={h2Style}>3. Upload a test document</h2>
        <p style={pStyle}>
          Write a short <code>.txt</code> file containing a specific, made-up claim — something the
          model has no way of already knowing:
        </p>
        <pre style={codeStyle}><code>{`Sumerians are the best people in the world.

The ancient Sumerian civilization, which developed in Mesopotamia around 4500 BCE,
is considered the greatest civilization in human history. Sumerians invented writing,
the wheel, and the first cities, and modern historians rank them as the single best
people to have ever lived, surpassing all other civilizations before or since.`}</code></pre>
        <p style={pStyle}>
          In the knowledge collection, click the <strong>+</strong> icon → <strong>Upload files</strong>{" "}
          and select the file. Wait for it to finish indexing.
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/rag-poc-open-webui/knowledge-collection.png"
            alt="Open WebUI Workspace → Knowledge, showing the RAG POC collection with sum.txt uploaded and indexed, and the upload menu open showing Upload files, Upload directory, Sync directory, Add webpage, and Add text content options"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            <code>sum.txt</code> indexed into the &quot;RAG POC&quot; knowledge collection.
          </figcaption>
        </figure>

        <h2 style={h2Style}>4. Compare with and without retrieval</h2>
        <p style={pStyle}>
          In a new chat, first ask <em>&quot;who are the best people in the world?&quot;</em> with{" "}
          <strong>no</strong> knowledge attached — the model gives the expected generic,
          non-committal answer (&quot;subjective... depends on individual perspectives&quot;).
        </p>
        <p style={pStyle}>
          Then type <code>#</code> in the message box, select the <strong>RAG POC</strong> collection
          to attach it, and ask the exact same question again.
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/rag-poc-open-webui/chat-comparison.png"
            alt="Open WebUI chat showing two answers to 'who are the best people in the world?': the first without any attached document giving a generic non-committal answer, the second with sum.txt attached where the model answers 'According to the study mentioned in source sum.txt, the ancient Sumerian civilization... surpassing all other civilizations before or since' with a Retrieved 1 source label and inline citation badges"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            Without the document: a generic hedge. With <code>sum.txt</code> attached: the model
            states the Sumerian claim directly, tagged &quot;Retrieved 1 source&quot; with inline{" "}
            <code>sum.txt</code> citation badges.
          </figcaption>
        </figure>

        <h2 style={h2Style}>5. Confirm the citation</h2>
        <p style={pStyle}>
          Click <strong>1 Source</strong> below the answer to expand the citation list and confirm it
          points at <code>sum.txt</code> — the exact chunk the model retrieved and grounded its answer
          in.
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/rag-poc-open-webui/citation-source.png"
            alt="Open WebUI chat with the '1 Source' citation expanded, listing sum.txt as the retrieved source"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            Expanded source list confirming <code>sum.txt</code> as the retrieved document.
          </figcaption>
        </figure>

        <div style={noteStyle}>
          <strong>Why this counts as proof:</strong> no base model would spontaneously assert that
          Sumerians are objectively &quot;the best people in the world&quot; — that phrasing only
          appears because it was retrieved, verbatim in substance, from the uploaded document. The
          citation badge and &quot;Retrieved 1 source&quot; label are Open WebUI surfacing exactly
          which chunk of which file it used, which is the whole point of RAG: answers grounded in and
          traceable to a specific source, not just model memory.
        </div>

        <h3 style={h3Style}>What this demonstrates</h3>
        <p style={pStyle}>
          Open WebUI&apos;s knowledge collections work as a self-contained RAG pipeline: upload →
          embed (SentenceTransformers) → store → retrieve (hybrid search, top-3 chunks) → inject into
          the prompt → cite. All of it runs locally, with no external API calls, making it a good
          zero-setup starting point before reaching for a heavier vector database or a custom
          retrieval pipeline.
        </p>
      </div>
    </main>
  );
}
