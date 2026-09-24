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

export default function HermesAgentDay6() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 6 · Wed, Oct 7, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Tool Calling &amp; Agent Loops
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          Calling one tool once is easy. An <strong>agent loop</strong> is what happens when Hermes calls a
          tool, reads the result, decides it needs another tool (or the same one again) to finish the job,
          and keeps going until the task is actually done — code execution, file I/O, and delegating
          sub-tasks all included.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Distinguish a single tool call from a multi-step agent loop</li>
          <li>Use <code>--yolo</code> deliberately and understand what it skips (confirmation prompts)</li>
          <li>Run a task that requires Hermes to write, execute, and act on code output in one loop</li>
          <li>Delegate a sub-task to a subagent and inspect what comes back</li>
        </ul>

        <h2 style={h2Style}>Lab: a real multi-step agent loop</h2>
        <p style={pStyle}>
          Give Hermes a task that requires writing a file, then reading it back — two tool calls chained
          into one loop:
        </p>
        <CodeBlock code={`$ hermes -z "Create a file at /tmp/hermes-demo.txt containing some text, then read it back and show me the contents." --cli --yolo`} />
        <p style={pStyle}>
          Then push further with code execution as the tool, which forces Hermes to actually run something
          rather than just narrate an answer:
        </p>
        <CodeBlock code={`$ hermes -z "Use Python code execution to compute the 25th Fibonacci number and the first 10 prime numbers. Show your work." --cli --yolo`} />
        <p style={pStyle}>Finally, delegate a sub-task to a subagent and inspect what it returns:</p>
        <CodeBlock code={`$ hermes -z "Delegate a subagent to write a haiku about local LLMs, then show me what the subagent returned." --cli --yolo`} />

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Oct 7, 2026 — real
            output from each step, and any loop that didn&apos;t behave as expected.
          </p>
        </div>
      </div>
    </main>
  );
}
