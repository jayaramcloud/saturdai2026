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

export default function HermesAgentDay7() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 7 · Fri, Oct 9, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Deploy a Production Hermes Agent
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          The capstone. Everything from the earlier sessions — a local model, RAG grounding, MCP tools, and
          multi-step agent loops — comes together into one Hermes agent that keeps running on its own,
          instead of only existing for the length of a one-shot <code>hermes -z</code> command.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Run <code>hermes doctor</code> as a pre-flight check before deploying anything</li>
          <li>Package the agent&apos;s configuration (endpoint, MCP servers, RAG tool) so it survives a restart</li>
          <li>Run Hermes as a long-lived background service rather than a one-shot CLI call</li>
          <li>Confirm the deployed agent still answers correctly end to end — model, RAG, and tools together</li>
        </ul>

        <h2 style={h2Style}>Lab: ship a working agent</h2>
        <p style={pStyle}>Start with a health check to make sure nothing is broken before deploying:</p>
        <CodeBlock code={`$ hermes doctor`} />
        <p style={pStyle}>
          Then bring up the agent as a persistent background service on the DGX Spark (or Mac Mini),
          instead of a one-off terminal session that dies when the laptop closes:
        </p>
        <CodeBlock code={`$ sudo systemctl enable --now hermes-agent.service
$ sudo systemctl status hermes-agent.service`} />
        <p style={pStyle}>
          Finally, run an end-to-end check against the deployed agent that exercises everything built this
          course — grounded retrieval, an MCP tool call, and a multi-step loop, in one prompt:
        </p>
        <CodeBlock code={`$ hermes -z "Using your retrieval tool, look up what our course material says about deploying agents, then use your MCP time tool to log the current timestamp next to that answer." --cli --yolo`} />

        <div style={warnStyle}>
          <p style={{ margin: 0 }}>
            <strong>Before this session:</strong> confirm the exact service-manager setup we&apos;ll actually
            use on the DGX Spark and Mac Mini (systemd unit file, working directory, restart policy) — the
            commands above are the target shape, not yet verified against our real hardware.
          </p>
        </div>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Oct 9, 2026 — the real
            deployment approach used and confirmation the agent kept running afterward.
          </p>
        </div>
      </div>
    </main>
  );
}
