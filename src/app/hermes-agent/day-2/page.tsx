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

export default function HermesAgentDay2() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 2 · Mon, Sep 28, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Hermes Fundamentals
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          <strong>Hermes Agent</strong> is our vehicle for this course because it doesn&apos;t need a hosted
          API key — it talks to any OpenAI-compatible endpoint, which means it works against a local{" "}
          <code>llama-server</code> instance on our <strong>DGX Spark</strong> or Sanjay&apos;s{" "}
          <strong>Mac Mini</strong> exactly the same way it would against a cloud model. Today is about
          getting comfortable with what Hermes is and getting it talking to a local LLM end to end.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Understand what Hermes Agent is and why it&apos;s provider-agnostic</li>
          <li>Point Hermes at a local, OpenAI-compatible endpoint instead of a cloud provider</li>
          <li>Run a first one-shot prompt and confirm the round trip actually works</li>
          <li>Run <code>hermes doctor</code> to sanity-check the setup before building on it</li>
        </ul>

        <h2 style={h2Style}>Lab: point Hermes at a local model</h2>
        <p style={pStyle}>
          Configure Hermes with a custom provider pointing at the local endpoint we&apos;ll be running on
          the DGX Spark:
        </p>
        <CodeBlock code={`$ hermes config`} />
        <p style={pStyle}>
          Then run a single prompt to completion with <code>--cli</code> to confirm it&apos;s actually
          talking to our local model and not a cloud fallback:
        </p>
        <CodeBlock code={`$ hermes -z "In one sentence, who are you and what model are you running on?" --cli`} />
        <p style={pStyle}>
          Finally, run the built-in health check — this is the fastest way to catch a broken endpoint,
          missing dependency, or misconfigured chat template before it wastes time later in the course:
        </p>
        <CodeBlock code={`$ hermes doctor`} />

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Sep 28, 2026 — actual
            hardware used (DGX Spark vs. Mac Mini), model loaded, and real command output.
          </p>
        </div>
      </div>
    </main>
  );
}
