import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";
import Slideshow, { type Slide } from "@/components/Slideshow";

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

const SLIDES: Slide[] = [
  {
    src: "/slides/hermes-day-5/01-recap-and-goal.svg",
    alt: "Two-panel recap: Day 4 grounded Hermes in real data with RAG; Day 5's goal is connecting Hermes to real external systems over MCP",
    paragraph:
      "Day 4 taught Hermes to know things by grounding it in real documents through RAG — but that was still a read-only, passive skill. Today is about teaching Hermes to reach things: a clock, a filesystem, a search engine, a database, all through one standard protocol called MCP. By the end of the session, Hermes will answer questions it could only get right by actually calling a tool, not by knowing or guessing the answer in advance.",
  },
  {
    src: "/slides/hermes-day-5/02-what-is-mcp.svg",
    alt: "Diagram of Hermes Agent connecting through an MCP server to four example external systems: time server, filesystem, web search, and database",
    paragraph:
      "MCP (Model Context Protocol) sits between Hermes and every external system it might need to touch, so each new integration doesn't require custom, one-off code. A single MCP server can expose a time lookup, file access, web search, or database queries, and Hermes talks to all of them the same way — through the same protocol, regardless of what's on the other end.",
  },
  {
    src: "/slides/hermes-day-5/03-hermes-mcp-add.svg",
    alt: "Anatomy of the hermes mcp add command broken into three labeled parts: the server name, --command, and --args",
    paragraph:
      "Registering a new MCP server with Hermes comes down to one command with three parts: a name you choose to refer to the server going forward, the --command that actually launches it, and the --args passed to that command. Flag order matters here — anything meant for hermes mcp add itself has to come before --args, since everything after that point gets handed straight to the server instead.",
  },
  {
    src: "/slides/hermes-day-5/04-worked-example-time-server.svg",
    alt: "Worked example showing the hermes mcp add command for mcp-server-time, followed by a prompt asking for the current time in two cities, followed by the expected grounded answer",
    paragraph:
      "The time server is a good first target because it's small, has few dependencies, and a wrong answer is easy to spot. After registering it with hermes mcp add, asking Hermes for the current time in two different cities forces it to actually call the tool rather than reason its way to a guess — and the expected result is a real, current answer for both cities, not something memorized from training data.",
  },
  {
    src: "/slides/hermes-day-5/05-the-path-gotcha.svg",
    alt: "Before/after comparison: registering a server with a bare command like uvx that breaks silently versus registering it with an absolute path that works reliably",
    paragraph:
      "A command like uvx that works fine in your own shell can still fail inside Hermes if Hermes runs with a narrower PATH than you're used to — and the failure tends to be silent, not a clear error. The fix is to find the binary's real location with something like which uvx, then register that exact absolute path instead of relying on PATH resolution at all — a real gotcha hit in an earlier live session.",
  },
  {
    src: "/slides/hermes-day-5/06-verify-not-guess.svg",
    alt: "Comparison of a silent guess with no tool call versus a verified tool call checked against Hermes's own trace and a real clock",
    paragraph:
      "A confidently wrong answer looks identical to a correctly grounded one until you check — the model can just as easily reason its way to a plausible time as call the actual tool. The habit worth building is checking Hermes's own trace or verbose output for the real tool invocation, and cross-checking the answer against a real clock, at least for the first few runs, exactly the same lesson from Day 4's RAG session applied to tools instead of documents.",
  },
  {
    src: "/slides/hermes-day-5/07-tour-of-servers.svg",
    alt: "Grid of four example MCP servers — filesystem, web search, database, and GitHub — each registered the same way as the time server",
    paragraph:
      "The time server is just one of dozens of ready-made MCP servers available: a filesystem server for reading and writing real files, a web search server for pulling current information the model's training data can't have, a database server for structured queries, and a GitHub server for issues and pull requests. Every one of them registers with the exact same hermes mcp add command — only the name, command, and arguments change.",
  },
  {
    src: "/slides/hermes-day-5/08-security-consideration.svg",
    alt: "Warning box explaining that an MCP server is a real capability grant, with three mitigations: scope narrowly, trust the source, and watch --yolo",
    paragraph:
      "Registering an MCP server isn't a cosmetic step — it's handing the model a real capability. A filesystem server scoped to your whole home directory can read or write anything in it, and a database server with write access can delete rows just as easily as query them. Scope every server to the narrowest directory, account, or permission it actually needs, only register servers from sources you trust, and be especially careful combining a write-capable server with --yolo, which skips the confirmation prompts that would otherwise catch a mistake.",
  },
  {
    src: "/slides/hermes-day-5/09-common-pitfalls.svg",
    alt: "Four common MCP pitfalls: wrong flag order, missing dependency, PATH not found, and the server crashing silently",
    paragraph:
      "Nearly every broken MCP registration traces back to one of four things: a flag meant for hermes mcp add placed after --args so it gets silently forwarded to the server instead; a missing or unpinned dependency the server package needs; a command that isn't on Hermes's PATH even though it works in your own shell; or a misconfigured server that starts and exits without a clear error. When a tool call fails, running hermes doctor first is the fastest way to surface which of these it actually is.",
  },
  {
    src: "/slides/hermes-day-5/10-recap-and-preview.svg",
    alt: "Five-point recap of MCP fundamentals alongside a preview of Day 6: Tool Calling and Agent Loops",
    paragraph:
      "Hermes can now reach out, not just recall: MCP is one protocol connecting it to many external systems, hermes mcp add registers a server in one line, PATH issues are the most common first failure, tool calls should always be verified rather than trusted blindly, and every server is a capability grant that deserves narrow scoping. Tomorrow builds directly on this — Day 6 is about chaining several tool calls together into a real agent loop, where Hermes calls a tool, reads the result, decides what's next, and keeps going until the task is actually finished.",
  },
];

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

      <Slideshow slides={SLIDES} />

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
