import Link from "next/link";

const DOCS = [
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
