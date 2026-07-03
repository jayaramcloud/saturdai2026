import Link from "next/link";

const WEEKS = [
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
      <p className="description" style={{ margin: "0 auto 3rem" }}>
        Four weeks, twenty evenings, one curriculum — built and taught live, together.
      </p>
      <div className="features-grid">
        {WEEKS.map((item) => (
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
