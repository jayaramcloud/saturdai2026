import Link from "next/link";
import VideoGrid from "@/components/VideoGrid";

const REGISTRATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc85wV7CgYL6QUN-4xCjplm3ryfM4NOdJoZrVjjThtMO2bKKQ/viewform";

const MEET_URL = "https://meet.google.com/nsd-qztm-psr";
const CONTACT_EMAIL = "jayaram.linux@gmail.com";

const CURRICULUM = [
  {
    href: "/hermes-agent/day-1",
    day: "Day 1",
    date: "Fri, Sep 25",
    title: "Intro to LLMs and Hermes",
    icon: "🌐",
    description: "Talk only, no lab — the big picture on LLMs and why Hermes Agent is our tool.",
  },
  {
    href: "/hermes-agent/day-2",
    day: "Day 2",
    date: "Mon, Sep 28",
    title: "Hermes Fundamentals",
    icon: "🌱",
    description: "Getting Hermes Agent running against our local LLMs on real hardware.",
  },
  {
    href: "/hermes-agent/day-3",
    day: "Day 3",
    date: "Wed, Sep 30",
    title: "LLM Routing with Hermes",
    icon: "🔀",
    description: "Routing requests across multiple local models based on the task.",
  },
  {
    href: "/hermes-agent/day-4",
    day: "Day 4",
    date: "Fri, Oct 2",
    title: "RAG with Hermes",
    icon: "📚",
    description: "Grounding Hermes Agent with real data instead of letting it guess.",
  },
  {
    href: "/hermes-agent/day-5",
    day: "Day 5",
    date: "Mon, Oct 5",
    title: "MCPs for Hermes",
    icon: "🔌",
    description: "Connecting Hermes Agent to external systems and tools over MCP.",
  },
  {
    href: "/hermes-agent/day-6",
    day: "Day 6",
    date: "Wed, Oct 7",
    title: "Tool Calling & Agent Loops",
    icon: "⚙️",
    description: "How Hermes calls a tool, reads the result, and loops until the task is done.",
  },
  {
    href: "/hermes-agent/day-7",
    day: "Day 7",
    date: "Fri, Oct 9",
    title: "Deploy a Production Agent",
    icon: "🚢",
    description: "Capstone: ship a Hermes agent that keeps working for you 24x7.",
  },
];

export default function Home() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", padding: "0.5rem 2rem 2rem" }}>
        <h1 className="title">
          SaturdAI<span className="gradient-accent">.</span>
        </h1>
        <p className="subtitle">Hands-on Agentic AI with Hermes Agent</p>
        <p className="description">
          A free, live, instructor-led 2-week intensive. Build and deploy a real Hermes agent —
          fundamentals, LLM routing, RAG, MCPs, tool calling, and a production deploy — running
          against real local LLMs on a DGX Spark supercomputer and an Apple Mac Mini. No
          prerequisites. Just curiosity. Everyone welcome.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Register Now
          </a>
          <a href="#curriculum" className="btn btn-secondary">
            See the 7-Day Curriculum
          </a>
        </div>
        <p className="hero-note">
          Mon–Wed–Fri, 6–7pm MST, Fri Sep 25 – Fri Oct 9, 2026. Day 1 is a talk-only kickoff —
          hands-on labs run Day 2 through Day 7.
        </p>
      </section>

      {/* Recorded sessions */}
      <section style={{ marginTop: "3rem" }}>
        <h2 className="section-title">Watch the Recordings</h2>
        <VideoGrid />
      </section>

      {/* Event banner */}
      <section className="event-banner">
        <div className="event-banner-item">
          <span className="event-banner-label">When</span>
          <span className="event-banner-value">Mon–Wed–Fri · 6:00–7:00 PM MST</span>
        </div>
        <div className="event-banner-item">
          <span className="event-banner-label">Dates</span>
          <span className="event-banner-value">Fri, Sep 25 – Fri, Oct 9, 2026</span>
        </div>
        <div className="event-banner-item">
          <span className="event-banner-label">Cost</span>
          <span className="event-banner-value">Free · Open to Everyone</span>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" style={{ marginTop: "5rem" }}>
        <h2 className="section-title">The 7-Day Curriculum</h2>
        <div className="features-grid">
          {CURRICULUM.map((item) => (
            <Link href={item.href} className="feature-card" key={item.href} style={{ display: "block" }}>
              <div className="icon">{item.icon}</div>
              <h3>
                {item.day}: {item.title}
              </h3>
              <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>{item.date}</p>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/hermes-agent" className="btn btn-secondary">
            Full Course Overview
          </Link>
        </div>
      </section>

      {/* Hardware */}
      <section style={{ marginTop: "5rem" }}>
        <h2 className="section-title">Learning on Real Hardware</h2>
        <div className="spark-card">
          <p className="spark-intro">
            Three months ago, following Sanjay Jayaram&apos;s vision, we purchased a{" "}
            <strong>DGX Spark Supercomputer</strong> with a Blackwell GPU and powered it on here in
            Calgary. Sanjay also picked up a powerful Apple Mac Mini for local AI research after
            interning at Apple in Cupertino. We&apos;ll set up and demo our AI research on both
            machines live during this course, and Sanjay will join some evenings to share what
            he&apos;s learned.
          </p>
          <div className="spark-specs">
            <div className="spark-spec">
              <span className="spark-spec-value">128 GB</span>
              <span className="spark-spec-label">Memory</span>
            </div>
            <div className="spark-spec">
              <span className="spark-spec-value">6,144</span>
              <span className="spark-spec-label">CUDA Cores</span>
            </div>
            <div className="spark-spec">
              <span className="spark-spec-value">1 PFLOP</span>
              <span className="spark-spec-label">FP4 Compute</span>
            </div>
            <div className="spark-spec">
              <span className="spark-spec-value">200B</span>
              <span className="spark-spec-label">Max Params Supported</span>
            </div>
          </div>
          <p className="spark-footnote">
            Powered by the NVIDIA® GB10 Grace Superchip — capable of running a single 200-billion
            parameter model, or multiple 30-billion parameter LLMs at once.
          </p>
        </div>
      </section>

      {/* Meeting details */}
      <section style={{ marginTop: "6rem", padding: "4rem 0" }} id="join">
        <h2 className="section-title">Ready to Start?</h2>
        <div className="start-card">
          <h3>Hands-On. Real Infrastructure. Real Agents.</h3>
          <p>
            By the end, you&apos;ll have deployed a working Hermes agent — your own digital agent,
            working and learning for you 24x7.
          </p>
          <ul className="benefits">
            <li>✓ Starting Fri, Sep 25, 2026 — Mon–Wed–Fri, 6:00–7:00 PM MST</li>
            <li>✓ 5:00–6:00 PM PST · 7:00–8:00 PM EST · 7:30–8:30 AM IST (next day)</li>
            <li>✓ Live, hands-on, instructor-led</li>
            <li>✓ Remote access to a DGX Spark supercomputer and Mac Mini</li>
            <li>✓ 7 sessions, completely free, open to everyone</li>
          </ul>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <a href={MEET_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Join Live Session
            </a>
            <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Register Now
            </a>
          </div>
          <p className="meet-dial">
            Or dial (CA) +1 604-774-8372 · PIN 218 444 587
          </p>
        </div>
      </section>

      {/* Contact / closing */}
      <section style={{ marginTop: "4rem", padding: "0 0 4rem", textAlign: "center" }}>
        <p className="description" style={{ marginBottom: "0.5rem" }}>
          Want to join or have any other questions? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ textDecoration: "underline" }}>
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="description">
          Starting this Friday — let&apos;s commit to learning, building, and shipping real agents
          together. 🧠
        </p>
      </section>
    </main>
  );
}
