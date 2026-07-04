const REGISTRATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc85wV7CgYL6QUN-4xCjplm3ryfM4NOdJoZrVjjThtMO2bKKQ/viewform";

const MEET_URL = "https://meet.google.com/nsd-qztm-psr";
const CONTACT_EMAIL = "jayaram.linux@gmail.com";

const CURRICULUM = [
  {
    week: "Week 1",
    title: "LLMs",
    icon: "🧠",
    description: "Understanding and working with language models",
  },
  {
    week: "Week 2",
    title: "RAG",
    icon: "📚",
    description: "Grounding AI with actual knowledge",
  },
  {
    week: "Week 3",
    title: "MCPs",
    icon: "🔌",
    description: "Connecting AI to external systems",
  },
  {
    week: "Week 4",
    title: "Tool Calling",
    icon: "🛠️",
    description: "Making AI agents do real work",
  },
];

export default function Home() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      {/* Calendar invite banner */}
      <div className="invite-banner">
        📅 Want to join the live sessions? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="invite-banner-link">
          {CONTACT_EMAIL}
        </a>{" "}
        and I&apos;ll add you to the calendar invite.
      </div>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "5rem 2rem 2rem" }}>
        <h1 className="title">
          SaturdAI<span className="gradient-accent">.</span>
        </h1>
        <p className="subtitle">A Free AI Bootcamp — Learn, Build &amp; Grow Together</p>
        <p className="description">
          Let&apos;s begin a journey to learn AI — building and effectively using AI from scratch.
          Though I&apos;ll lead this, it&apos;s learning together: a community of curious minds
          building AI skills side by side. No prerequisites. Just curiosity.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={MEET_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Join Saturday&apos;s Kickoff
          </a>
          <a href="#curriculum" className="btn btn-secondary">
            See What We&apos;re Building
          </a>
        </div>
        <p className="hero-note">
          Saturday is a short introductory meet-and-greet to get acquainted and set the stage —
          the real hands-on work happens Monday–Friday evenings.
        </p>
      </section>

      {/* Event banner */}
      <section className="event-banner">
        <div className="event-banner-item">
          <span className="event-banner-label">When</span>
          <span className="event-banner-value">Mon–Fri · 6:00–8:00 PM MST</span>
        </div>
        <div className="event-banner-item">
          <span className="event-banner-label">Intro Meetup</span>
          <span className="event-banner-value">Saturday, July 4 · 8:00 AM MST</span>
        </div>
        <div className="event-banner-item">
          <span className="event-banner-label">Cost</span>
          <span className="event-banner-value">Free · Open to Everyone</span>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" style={{ marginTop: "5rem" }}>
        <h2 className="section-title">What We&apos;re Building Together</h2>
        <div className="features-grid">
          {CURRICULUM.map((item) => (
            <div className="feature-card" key={item.week}>
              <div className="icon">{item.icon}</div>
              <h3>
                {item.week}: {item.title}
              </h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DGX Spark */}
      <section style={{ marginTop: "5rem" }}>
        <h2 className="section-title">Learning on a Real Supercomputer</h2>
        <div className="spark-card">
          <p className="spark-intro">
            Last month, following Sanjay Jayaram&apos;s vision, we purchased a{" "}
            <strong>DGX Spark Supercomputer</strong>{" "}
            with a Blackwell GPU and powered it on here in Calgary. I&apos;ll share remote access
            with everyone joining, and we&apos;ll learn together on this mini supercomputer.
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
          <h3>Saturday: Let&apos;s Meet First</h3>
          <p>
            A short kickoff to introduce ourselves, meet the group, and set the stage — then the
            real work begins Monday through Friday.
          </p>
          <ul className="benefits">
            <li>✓ Intro meetup: Saturday, July 4 · 8:00 AM MST</li>
            <li>✓ Hands-on sessions: Mon–Fri · 6:00–8:00 PM MST</li>
            <li>✓ 5:00–7:00 PM PST · 8:00–10:00 PM EST · 5:30–7:30 AM IST (next day)</li>
            <li>✓ Live, hands-on, instructor-led — but learning together</li>
            <li>✓ Remote access to a DGX Spark supercomputer</li>
            <li>✓ 20 weekday evenings, completely free, open to everyone</li>
          </ul>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <a href={MEET_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Join Saturday&apos;s Kickoff
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
          On Canada Day 2026, let&apos;s commit to learning — and growing — together. 🍁
        </p>
      </section>
    </main>
  );
}
