import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";
import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/hermes-day-7/01-six-day-recap.svg",
    alt: "Pipeline of the six prior days (Fundamentals, Routing, RAG, MCPs, Tool Calling) with today's Deploy step highlighted as where they all combine",
    paragraph:
      "None of the last five days were building separate toys — each one is a component of the same agent: Hermes talking to a local model, routing between models, grounding answers in real documents, calling external tools over MCP, and chaining tool calls into a loop. Today we stop assembling parts and start running the whole thing, unattended, for real.",
  },
  {
    src: "/slides/hermes-day-7/02-what-is-production.svg",
    alt: "Side-by-side comparison of one-shot Hermes (dies when the terminal closes) versus production Hermes (a managed background service that survives restarts and crashes)",
    paragraph:
      "A one-shot hermes -z command is perfect for a lab exercise: it runs once, prints an answer, and exits, with nothing to restart it if it crashes. A production agent is different — it runs as a managed service, keeps running after you log out, has its configuration saved so it survives a restart, and comes back on its own if it crashes. That gap is exactly what today closes.",
  },
  {
    src: "/slides/hermes-day-7/03-hermes-doctor-preflight.svg",
    alt: "Checklist of what hermes doctor verifies before deployment: endpoint reachable, chat template correct, MCP servers registered, credentials present, disk and memory headroom",
    paragraph:
      "hermes doctor is a pre-flight check, not a post-mortem: it verifies the model endpoint is reachable, the chat template is correct (a wrong one silently breaks tool calling), every MCP server from Day 5 responds, no required config is missing, and there's enough headroom on the DGX Spark or Mac Mini to run unattended. A green run here is the go/no-go gate before touching a systemd unit file at all.",
  },
  {
    src: "/slides/hermes-day-7/04-packaging-config.svg",
    alt: "Three inputs — model endpoint, MCP servers, RAG collection — flowing into one config bundle that a systemd service reads on every start",
    paragraph:
      "Everything Hermes learned across five days — the model endpoint from Day 2, the MCP servers from Day 5, the RAG collection pointer from Day 4 — gets packaged into one config bundle written to disk once and read every time the service starts. That's what \"survives a restart\" actually means in practice, instead of re-typing configuration into a terminal each time.",
  },
  {
    src: "/slides/hermes-day-7/05-systemd-service.svg",
    alt: "An annotated hermes-agent.service systemd unit file next to explanations of enable --now, Restart=on-failure, and systemctl status",
    paragraph:
      "systemd replaces the terminal window as the thing keeping Hermes alive. systemctl enable --now starts the agent immediately and again on every boot, Restart=on-failure brings the process back up automatically a few seconds after any crash, and systemctl status is the everyday health check for whether it's up and for how long.",
  },
  {
    src: "/slides/hermes-day-7/06-capstone-task.svg",
    alt: "One prompt fanning out into three exercised skills — a RAG lookup, an MCP tool call, and an agent loop — recombining into a single final answer",
    paragraph:
      "The capstone task is one prompt that exercises three skills at once: a RAG lookup against the Day 4 ChromaDB collection, a real MCP tool call to the Day 5 time server instead of a guessed timestamp, and the Day 6 agent loop chaining both results into a single answer. If this works against the deployed service — not a terminal session — every piece from this course is confirmed live at once.",
  },
  {
    src: "/slides/hermes-day-7/07-monitoring-restart-policy.svg",
    alt: "Flow diagram: a process crash triggers systemd's Restart=on-failure policy, which auto-restarts the service and logs the crash to journalctl for later review",
    paragraph:
      "A restart policy doesn't prevent crashes — it makes them survivable without anyone being awake to fix them. When the process crashes, systemd notices the failing exit code, restarts it five seconds later with the same config bundle, and journalctl keeps the crash reason on record. The right response to an overnight failure is checking journalctl -u hermes-agent in the morning, not a pager alert at 3am.",
  },
  {
    src: "/slides/hermes-day-7/08-what-you-built.svg",
    alt: "Hub-and-spoke diagram of the finished agent's five combined capabilities: routing between models, retrieving real documents, calling external tools, looping until done, and running 24x7",
    paragraph:
      "What you built by the end of today is a single agent that routes between models to pick the right size for the job, retrieves real documents instead of guessing, calls external tools over MCP instead of hallucinating results, loops through multi-step tasks instead of stopping at one reply, and keeps running 24x7 as a deployed service — your own digital agent, working and learning for you.",
  },
  {
    src: "/slides/hermes-day-7/09-where-to-go-next.svg",
    alt: "Six extension ideas for after the course: more MCP servers, a bigger RAG collection, a larger routed model, scheduled tasks, a monitoring dashboard, and sharing what you build",
    paragraph:
      "The course ends today, but the agent doesn't have to: register more MCP servers for calendars, email, or your own APIs; point the RAG collection at your own notes or codebase; try a larger routed model now that you know the DGX Spark has the memory for it; add a scheduled task so the agent acts without being asked; wrap the status and logs into a small dashboard; and email jayaram.linux@gmail.com if you want what you build featured on saturdai.com.",
  },
  {
    src: "/slides/hermes-day-7/10-course-wrapup.svg",
    alt: "Six-point recap of the full course arc plus a closing thank-you message",
    paragraph:
      "Seven sessions, one working, deployed Hermes agent: Hermes talks to any OpenAI-compatible endpoint, routing sends requests to the right model, RAG grounds answers in real documents, MCP servers connect it to real external systems, agent loops chain tool calls until a task is done, and deployment keeps it working after you log off. Thank you for building with us — your digital agent is running, now go put it to work.",
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

export default function HermesAgentDay7() {
  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 7 · Fri, Oct 9, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Deploy a Production Hermes Agent
      </h1>

      <Slideshow slides={SLIDES} wide />

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
