import Link from "next/link";

const SECTIONS = [
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Instructor Led Online Training" },
  { href: "/courses", label: "Courses" },
];

const WEEKS = [
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
      {WEEKS.map((item) => (
        <Link key={item.href} href={item.href} className="sidebar-link">
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
