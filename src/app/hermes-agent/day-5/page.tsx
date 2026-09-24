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

export default function HermesAgentDay5() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 5 · Mon, Oct 5, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        MCPs for Hermes
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          The Model Context Protocol (MCP) is how Hermes reaches out to external systems — a time server,
          a filesystem, a search engine, a database — as first-class tools rather than one-off custom code.
          Today is about registering real MCP servers and confirming Hermes actually calls them instead of
          guessing the answer itself.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Understand what an MCP server is and why Hermes talks to it over a standard protocol</li>
          <li>Register an MCP server with <code>hermes mcp add</code></li>
          <li>Force a question that can only be answered correctly by actually calling the tool</li>
          <li>Diagnose a broken MCP registration (bad path, wrong flag order) when it doesn&apos;t work</li>
        </ul>

        <h2 style={h2Style}>Lab: register and exercise an MCP server</h2>
        <p style={pStyle}>
          Register the time MCP server — a small, dependency-light server that&apos;s a good first target
          because a wrong answer is easy to spot:
        </p>
        <CodeBlock code={`$ hermes mcp add mcp-time --command uvx --args mcp-server-time`} />
        <p style={pStyle}>
          If <code>uvx</code> isn&apos;t on Hermes&apos;s PATH, register it with an absolute path instead —
          a real gotcha we hit in an earlier live session:
        </p>
        <CodeBlock code={`$ hermes mcp add mcp-time --command /home/jay/.local/bin/uvx --args --with 'mcp<1.10' mcp-server-time`} />
        <p style={pStyle}>
          Then ask a question that requires the tool, not a guess, to answer correctly:
        </p>
        <CodeBlock code={`$ hermes -z "What time is it right now in Calgary and in Bengaluru? Use your MCP time tool, do not guess." --cli --yolo`} />

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Oct 5, 2026 — which
            MCP servers we registered live and the real tool-call output.
          </p>
        </div>
      </div>
    </main>
  );
}
