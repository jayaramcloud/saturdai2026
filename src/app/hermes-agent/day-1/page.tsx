import Link from "next/link";
import type { CSSProperties } from "react";

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

export default function HermesAgentDay1() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 1 · Fri, Sep 25, 2026 · Talk — no lab
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Intro to LLMs and Hermes
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A talk-only kickoff session — no hands-on lab today. Before anyone touches a terminal, we&apos;ll
          cover what a large language model actually is, why <strong>Hermes Agent</strong> (Nous
          Research&apos;s CLI coding/agent assistant) is the tool we&apos;re building around for this
          course, and what &quot;agentic AI&quot; means in practice versus just chatting with a model.
        </p>

        <h2 style={h2Style}>What we&apos;ll cover</h2>
        <ul style={listStyle}>
          <li>The big picture: what an LLM is, and what makes an <em>agent</em> different from a chatbot</li>
          <li>Why Hermes Agent is provider-agnostic — it talks to any OpenAI-compatible endpoint, local or cloud</li>
          <li>A first look at the hardware we&apos;ll be running on: the DGX Spark and Sanjay&apos;s Mac Mini</li>
          <li>A preview of the 7-session arc: fundamentals → routing → RAG → MCPs → tool calling → deployment</li>
          <li>Course logistics: schedule, time zones, and how to get set up before Day 2</li>
        </ul>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Get ready for Day 2:</strong> hands-on labs start Monday, Sep 28, with Hermes
            Fundamentals. Come to that session with Hermes Agent already installed if possible.
          </p>
        </div>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Sep 25, 2026.
          </p>
        </div>
      </div>
    </main>
  );
}
