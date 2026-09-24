import Link from "next/link";

const SECTIONS = [
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Instructor Led Online Training" },
  { href: "/courses", label: "Courses" },
  { href: "/insights", label: "Insights" },
  { href: "/docs", label: "Docs" },
  { href: "/progress", label: "My Progress" },
];

const HERMES_DAYS = [
  { href: "/hermes-agent", label: "Hermes Agent" },
  { href: "/hermes-agent/day-1", label: "Day 1: Intro" },
  { href: "/hermes-agent/day-2", label: "Day 2: Fundamentals" },
  { href: "/hermes-agent/day-3", label: "Day 3: LLM Routing" },
  { href: "/hermes-agent/day-4", label: "Day 4: RAG" },
  { href: "/hermes-agent/day-5", label: "Day 5: MCPs" },
  { href: "/hermes-agent/day-6", label: "Day 6: Tool Calling" },
  { href: "/hermes-agent/day-7", label: "Day 7: Deploy" },
];

const FOUNDATIONS = [
  { href: "/intro-to-ai", label: "Intro to AI" },
  { href: "/week-1", label: "Week 1: LLMs" },
  { href: "/week-2", label: "Week 2: RAG" },
  { href: "/week-3", label: "Week 3: MCPs" },
  { href: "/week-4", label: "Week 4: Tool Calling" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {SECTIONS.map((item) => (
        <Link key={item.label} href={item.href} className="sidebar-link">
          {item.label}
        </Link>
      ))}
      <div className="sidebar-divider" />
      {HERMES_DAYS.map((item) => (
        <Link key={item.href} href={item.href} className="sidebar-link">
          {item.label}
        </Link>
      ))}
      <div className="sidebar-divider" />
      {FOUNDATIONS.map((item) => (
        <Link key={item.href} href={item.href} className="sidebar-link">
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
