import Link from "next/link";

const DOCS = [
  {
    href: "/docs/deepseek-v4-flash-summary",
    date: "2026-08-02",
    title: "DeepSeek V4 Flash 0731 — Quick Summary",
    icon: "🐳",
    description:
      "A discussion with Sanjay on DeepSeek V4 Flash's launch pricing, the wider market shakeup it's causing among providers, and a live local deployment on a single 128GB-VRAM GPU with llama.cpp.",
  },
  {
    href: "/docs/hermes-agent-open-webui",
    date: "2026-07-27",
    title: "Adding a Hermes Agent Alongside Open WebUI",
    icon: "🪽",
    description:
      "Running NousResearch's Hermes-3-Llama-3.2-3B locally for real tool-calling — VRAM constraints, a chat-template gotcha that silently broke tool calls, and a temperature fix, wired into the existing mcpo MCP bridge.",
  },
  {
    href: "/docs/chromadb-rag-open-webui",
    date: "2026-07-24",
    title: "Standalone ChromaDB for RAG in Open WebUI",
    icon: "🗄️",
    description:
      "Running ChromaDB as its own server instead of Open WebUI's embedded store, reconfiguring Open WebUI to talk to it over HTTP, and proving retrieval by querying the vector DB directly with three sample docs (.txt, .md, .pdf).",
  },
  {
    href: "/docs/rag-poc-open-webui",
    date: "2026-07-21",
    title: "RAG Proof-of-Concept in Open WebUI",
    icon: "📚",
    description:
      "A five-minute proof that Open WebUI's built-in RAG actually retrieves from an uploaded document — a knowledge collection, a deliberately absurd test claim, and a before/after chat comparison with citations.",
  },
  {
    href: "/docs/open-webui-class-workbook",
    date: "2026-07-17",
    title: "45-Minute Class Workbook: Open WebUI Configuration",
    icon: "📋",
    description:
      "A run-of-show pulling from the admin guide and MCP/tools docs: talk for 2 minutes on a config, make the change live, show the behavior change. Six segments, timed.",
  },
  {
    href: "/docs/open-webui-admin-guide",
    date: "2026-07-16",
    title: "20 Things to Administer in Open WebUI",
    icon: "⚙️",
    description:
      "Controls panel Advanced Params (temperature, top_p, mirostat, and more) plus a tour of Settings, Admin Panel, and every sidebar shortcut, with a one-liner example for each.",
  },
  {
    href: "/docs/mcp-and-tools-open-webui",
    date: "2026-07-16",
    title: "Tool Calling & MCP in Open WebUI",
    icon: "🔧",
    description:
      "Live-in-class walkthrough: a native Open WebUI tool, then a real MCP server bridged in via mcpo, including every gotcha hit along the way.",
  },
  {
    href: "/docs/llama-cpp-open-webui-setup",
    date: "2026-07-14",
    title: "llama.cpp + Open WebUI Setup",
    icon: "🖥️",
    description:
      "GPU-accelerated local inference with llama.cpp and CUDA, fronted by Open WebUI, reachable remotely via Tailscale and SSH.",
  },
  {
    href: "/docs/hp-laptop-setup",
    date: "2026-07-14",
    title: "HP Laptop: llama.cpp + CUDA Setup",
    icon: "💻",
    description:
      "Downloading a Ministral 3B model, rebuilding llama.cpp with CUDA, and tuning GPU layer offload to fit laptop VRAM.",
  },
  {
    href: "/docs/hp-workstation-deployment-2",
    date: "2026-07-15",
    title: "HP Workstation Deployment (Part 2)",
    icon: "🧩",
    description:
      "Adding a second, isolated Open WebUI plus two more models (Gemma 3 4B, Qwen2.5 3B) — with every mistake and lesson learned along the way.",
  },
];

export default function DocsPage() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 className="section-title">Docs</h1>
      <p className="description" style={{ margin: "0 auto 3rem" }}>
        Setup notes and command logs from building out our local AI infrastructure.
      </p>
      <div className="features-grid">
        {DOCS.map((item) => (
          <Link href={item.href} key={item.href} className="feature-card" style={{ display: "block", textAlign: "left" }}>
            <div className="icon">{item.icon}</div>
            <p style={{ color: "#8888aa", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{item.date}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
