import Link from "next/link";
import type { CSSProperties } from "react";

const noteStyle: CSSProperties = {
  background: "#2a2a4a",
  border: "1px solid #44447a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "2rem",
};

const DAYS = [
  {
    href: "/hermes-agent/day-1",
    day: "Day 1",
    date: "Fri, Sep 25, 2026",
    title: "Intro to LLMs and Hermes",
    icon: "🌐",
    description: "Talk only, no lab — the big picture on LLMs, what agentic AI means, and why Hermes Agent is our tool for the course.",
  },
  {
    href: "/hermes-agent/day-2",
    day: "Day 2",
    date: "Mon, Sep 28, 2026",
    title: "Hermes Fundamentals",
    icon: "🌱",
    description: "What Hermes Agent is, how it talks to any OpenAI-compatible endpoint, and getting it running against our local LLMs on the DGX Spark and Mac Mini.",
  },
  {
    href: "/hermes-agent/day-3",
    day: "Day 3",
    date: "Wed, Sep 30, 2026",
    title: "LLM Routing with Hermes",
    icon: "🔀",
    description: "Pointing Hermes at multiple local models and routing requests between them based on task.",
  },
  {
    href: "/hermes-agent/day-4",
    day: "Day 4",
    date: "Fri, Oct 2, 2026",
    title: "RAG with Hermes",
    icon: "📚",
    description: "Grounding Hermes Agent in real data instead of letting it guess.",
  },
  {
    href: "/hermes-agent/day-5",
    day: "Day 5",
    date: "Mon, Oct 5, 2026",
    title: "MCPs for Hermes",
    icon: "🔌",
    description: "Connecting Hermes Agent to external systems and tools over MCP.",
  },
  {
    href: "/hermes-agent/day-6",
    day: "Day 6",
    date: "Wed, Oct 7, 2026",
    title: "Tool Calling & Agent Loops",
    icon: "⚙️",
    description: "How Hermes decides to call a tool, reads the result, and loops until the task is actually done.",
  },
  {
    href: "/hermes-agent/day-7",
    day: "Day 7",
    date: "Fri, Oct 9, 2026",
    title: "Deploy a Production Hermes Agent",
    icon: "🚢",
    description: "Capstone: ship a Hermes agent that keeps running and working for you 24x7.",
  },
];

export default function HermesAgentCourse() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 className="section-title">Agentic AI with Hermes Agent</h1>
      <p className="description" style={{ margin: "0 auto 1.5rem" }}>
        A free, hands-on 2-week intensive. No prerequisites — just curiosity. Everyone welcome.
      </p>

      <div style={{ maxWidth: 700, margin: "0 auto 2rem", textAlign: "left" }}>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Schedule:</strong> Mon–Wed–Fri, 6–7pm MST (7 sessions), Fri Sep 25 – Fri Oct 9, 2026.
            Day 1 is a talk-only kickoff; hands-on labs run Day 2 through Day 7.
            <br />
            <strong>Time zones:</strong> 6pm MST (Calgary) · 5pm PST · 7pm EST · 7:30pm IST
          </p>
        </div>

        <p style={{ marginBottom: "1.5rem" }}>
          By the end, you&apos;ll have deployed a working Hermes agent — your own digital agent, working and
          learning for you 24x7. Three months ago, following Sanjay Jayaram&apos;s vision, we purchased a{" "}
          <strong>DGX Spark Supercomputer</strong> with a Blackwell GPU and 128 GB of memory, powered on here
          in Calgary — an NVIDIA® GB10 Grace Superchip with 6,144 CUDA cores capable of 1 Petaflop FP4
          compute, enough to run up to a 200-billion-parameter LLM or several 30-billion-parameter models at
          once. Sanjay also picked up a powerful Apple Mac Mini for local AI research after interning at
          Apple in Cupertino. We&apos;ll be setting up and demoing our AI research on both machines live
          during this course, and Sanjay will join some evenings to share what he&apos;s learned.
        </p>
      </div>

      <div className="features-grid">
        {DAYS.map((item) => (
          <Link href={item.href} key={item.href} className="feature-card" style={{ display: "block" }}>
            <div className="icon">{item.icon}</div>
            <h3>
              {item.day}: {item.title}
            </h3>
            <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>{item.date}</p>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: "4rem" }}>
        Hermes Agent Capability Map
      </h2>
      <p className="description" style={{ margin: "0 auto 1.5rem" }}>
        Everything Hermes Agent can do, on one page — tools, memory, skills, subagents, scheduling, MCP,
        providers, messaging, backends, and more. Click the image to open it full size.
      </p>
      <figure style={{ margin: 0 }}>
        <a href="/hermes-agent/hermes-agent-capabilities-v2.png" target="_blank" rel="noopener noreferrer">
          <img
            src="/hermes-agent/hermes-agent-capabilities-v2.png"
            alt="Mind map of Hermes Agent capabilities: the agent at the center with 15 branches — Built-in Tools (40+), Memory & Recall, Skills, Closed Learning Loop, Subagents & Orchestration, Scheduling / Cron, MCP Integration, Model Providers, Messaging Gateway, Terminal Backends, CLI & TUI, Context & Personality, Security & Safety, Deployment & Platforms, and Research & RL — each with a one-line summary and detailed feature boxes."
            style={{ width: "100%", height: "auto", borderRadius: 8, background: "#ffffff" }}
          />
        </a>
        <figcaption style={{ color: "#8888aa", fontSize: "0.85rem", marginTop: "0.75rem", textAlign: "center" }}>
          Want to edit it?{" "}
          <a href="/hermes-agent/hermes-agent-capabilities.drawio" download style={{ color: "#a0a0ff" }}>
            Download the editable draw.io file
          </a>
          .
        </figcaption>
      </figure>

      <h2 className="section-title" style={{ marginTop: "4rem" }}>
        Inside Hermes Agent
      </h2>
      <p className="description" style={{ margin: "0 auto 1.5rem" }}>
        How it all fits together: one agent loop — receive, think, act, observe — wrapped by entry points,
        swappable model providers, tools and skills, and memory, with each part tagged by the course day
        that covers it. Click the image to open it full size.
      </p>
      <figure style={{ margin: 0 }}>
        <a href="/hermes-agent/hermes-agent-anatomy.png" target="_blank" rel="noopener noreferrer">
          <img
            src="/hermes-agent/hermes-agent-anatomy.png"
            alt="Anatomy of Hermes Agent: at the center, the agent loop — 1 Receive, 2 Think, 3 Act, 4 Observe — repeating until the task is done. Entry points on the left (CLI/TUI, messaging gateway for Telegram, Discord, Slack, WhatsApp and Signal, and a cron scheduler), model providers on top (llama.cpp on DGX Spark, Ollama on Mac Mini, vLLM, OpenRouter, Nous Portal, cloud APIs) via one OpenAI-compatible API, capabilities on the right (built-in toolsets, MCP client, skills, subagents, execution backends), memory and knowledge below (MEMORY.md, USER.md, session search, RAG), plus safety controls, the ~/.hermes/ config layout, and a worked Telegram reminder example. Each part is tagged with the course day that covers it."
            style={{ width: "100%", height: "auto", borderRadius: 8, background: "#faf8f3" }}
          />
        </a>
        <figcaption style={{ color: "#8888aa", fontSize: "0.85rem", marginTop: "0.75rem", textAlign: "center" }}>
          Want to edit it?{" "}
          <a href="/hermes-agent/ai-landscape-and-hermes.drawio" download style={{ color: "#a0a0ff" }}>
            Download the editable draw.io file
          </a>{" "}
          (includes the full AI landscape map and a Hermes-vs-neighbors comparison as extra pages).
        </figcaption>
      </figure>
    </main>
  );
}
