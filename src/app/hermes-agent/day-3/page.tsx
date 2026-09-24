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

export default function HermesAgentDay3() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 3 · Wed, Sep 30, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        LLM Routing with Hermes
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          The DGX Spark&apos;s 128 GB of memory is enough to keep more than one model loaded at once —
          multiple 30B-parameter LLMs, or one much larger model up to roughly 200B parameters. Today is
          about treating that as a feature: routing a request to the right model for the job instead of
          sending everything to one general-purpose endpoint.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Register more than one local model endpoint with Hermes</li>
          <li>Understand the tradeoffs between a small fast model and a larger, slower one</li>
          <li>Route different kinds of prompts (quick lookup vs. multi-step reasoning) to different models</li>
          <li>Confirm routing behavior with real prompts against each backend</li>
        </ul>

        <h2 style={h2Style}>Lab: register and compare two local endpoints</h2>
        <p style={pStyle}>
          Reconfigure Hermes with a second custom provider pointing at a different local model, then send
          the same one-shot prompt to each and compare latency and answer quality:
        </p>
        <CodeBlock code={`$ hermes config`} />
        <CodeBlock code={`$ hermes -z "Summarize the tradeoffs between a 7B and a 30B parameter model in two sentences." --cli`} />

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Sep 30, 2026 — which
            two models we routed between, and what the actual latency/quality comparison looked like.
          </p>
        </div>
      </div>
    </main>
  );
}
