import Link from "next/link";

const REGISTRATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc85wV7CgYL6QUN-4xCjplm3ryfM4NOdJoZrVjjThtMO2bKKQ/viewform";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/week-1", label: "Week 1" },
  { href: "/week-2", label: "Week 2" },
  { href: "/week-3", label: "Week 3" },
  { href: "/week-4", label: "Week 4" },
];

export default function TopNav() {
  return (
    <header className="top-nav">
      <Link href="/" className="top-nav-brand">
        SaturdAI<span className="gradient-accent">.</span>
      </Link>
      <nav className="top-nav-links">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="top-nav-link">
            {link.label}
          </Link>
        ))}
      </nav>
      <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
        Register Now
      </a>
    </header>
  );
}
