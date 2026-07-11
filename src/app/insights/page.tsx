import Link from "next/link";

const INSIGHTS = [
  {
    href: "/insights/cron-vs-agentic-ai",
    date: "2026-07-10",
    title: "Cron Jobs vs. Agentic AI",
    icon: "⏰",
    description:
      "Agents are just config files — a goal, tools, an LLM endpoint, and a reasoning loop. That loop is what cron jobs can't do.",
  },
];

export default function InsightsPage() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 className="section-title">Insights</h1>
      <p className="description" style={{ margin: "0 auto 3rem" }}>
        Short write-ups from the day-to-day of learning AI — one insight at a time.
      </p>
      <div className="features-grid">
        {INSIGHTS.map((item) => (
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
