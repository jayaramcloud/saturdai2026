const REGISTRATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc85wV7CgYL6QUN-4xCjplm3ryfM4NOdJoZrVjjThtMO2bKKQ/viewform";

export default function Home() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "flex-end", padding: "1rem 0" }}>
        <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          Register Now
        </a>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "6rem 2rem" }}>
        <h1 className="title">
          SaturdAI<span className="gradient-accent">.</span>
        </h1>
        <p className="subtitle">Master AI Development Every Saturday</p>
        <p className="description">
          Learn to build with Claude, GPT, and modern AI tools.
          From prompt engineering to full-stack AI applications.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Get Started
          </a>
          <a href="#learn" className="btn btn-secondary">
            Learn More
          </a>
        </div>
      </section>

      {/* What You'll Learn */}
      <section id="learn" style={{ marginTop: "4rem" }}>
        <h2 className="section-title">What You&apos;ll Learn</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">📚</div>
            <h3>Week 1: Foundations</h3>
            <p>AI basics, prompt engineering, and understanding language models</p>
          </div>
          <div className="feature-card">
            <div className="icon">💻</div>
            <h3>Week 2–4: Building</h3>
            <p>Create AI-powered applications with modern frameworks and APIs</p>
          </div>
          <div className="feature-card">
            <div className="icon">🎯</div>
            <h3>Week 5+: Advanced</h3>
            <p>RAG, vector databases, fine-tuning, and production deployment</p>
          </div>
        </div>
      </section>

      {/* Ready to Start */}
      <section style={{ marginTop: "6rem", padding: "4rem 0" }}>
        <h2 className="section-title">Ready to Start?</h2>
        <div className="start-card">
          <h3>Join Our Next Saturday Session</h3>
          <p>Live coding sessions every Saturday at 10 AM PST</p>
          <ul className="benefits">
            <li>✓ Live instructor guidance</li>
            <li>✓ Hands-on coding exercises</li>
            <li>✓ Community support</li>
            <li>✓ Project-based learning</li>
          </ul>
          <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Sign Up Now
          </a>
        </div>
      </section>
    </main>
  );
}
