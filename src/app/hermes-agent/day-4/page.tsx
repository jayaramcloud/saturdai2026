import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";

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
