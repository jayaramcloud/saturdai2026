import Link from "next/link";

const FOUNDATIONS = [
  {
    href: "/intro-to-ai",
    week: "Intro to AI",
    title: "The Big Picture",
    icon: "🌐",
    description: "The big picture and everyday use cases",
  },
  {
    href: "/week-1",
    week: "Week 1",
    title: "LLMs",
    icon: "🧠",
    description: "Understanding and working with language models",
  },
  {
    href: "/week-2",
    week: "Week 2",
    title: "RAG",
    icon: "📚",
    description: "Grounding AI with actual knowledge",
  },
  {
    href: "/week-3",
    week: "Week 3",
    title: "MCPs",
    icon: "🔌",
    description: "Connecting AI to external systems",
  },
  {
    href: "/week-4",
    week: "Week 4",
    title: "Tool Calling",
    icon: "🛠️",
    description: "Making AI agents do real work",
  },
];

export default function CoursesPage() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 className="section-title">Courses</h1>

      <p className="description" style={{ margin: "0 auto 2rem" }}>
        Currently running — a free, live, hands-on intensive.
      </p>
      <Link
        href="/hermes-agent"
        className="feature-card"
        style={{ display: "block", maxWidth: 700, margin: "0 auto 5rem" }}
      >
        <div className="icon">🧑‍🚀</div>
        <h3>Agentic AI with Hermes Agent</h3>
        <p>
          7 sessions over 2 weeks: build and deploy a real Hermes agent — fundamentals, LLM
          routing, RAG, MCPs, tool calling, and a production deploy — on real hardware.
        </p>
      </Link>

      <h2 className="section-title" style={{ fontSize: "1.6rem" }}>
        Foundations
      </h2>
      <p className="description" style={{ margin: "0 auto 3rem" }}>
        The original self-paced curriculum — four weeks, twenty evenings, one arc through the
        basics of LLMs, RAG, MCPs, and tool calling.
      </p>
      <div className="features-grid">
        {FOUNDATIONS.map((item) => (
          <Link href={item.href} key={item.href} className="feature-card" style={{ display: "block" }}>
            <div className="icon">{item.icon}</div>
            <h3>
              {item.week}: {item.title}
            </h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
