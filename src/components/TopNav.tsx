import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/week-1", label: "Week 1" },
  { href: "/week-2", label: "Week 2" },
  { href: "/week-3", label: "Week 3" },
  { href: "/week-4", label: "Week 4" },
  { href: "/feed", label: "AI Feed" },
  { href: "/progress", label: "My Progress" },
];

export default async function TopNav() {
  const session = await auth();

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
      {session?.user ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span className="top-nav-user">{session.user.name?.split(" ")[0]}</span>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="btn btn-secondary btn-sm">
              Sign Out
            </button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit" className="btn btn-secondary btn-sm">
            Sign In
          </button>
        </form>
      )}
    </header>
  );
}
