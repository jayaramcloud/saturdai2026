export default function Week3Page() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem", textAlign: "center" }}>
      <div className="icon" style={{ fontSize: "3.5rem" }}>
        🔌
      </div>
      <h1 className="section-title">Week 3: MCPs</h1>
      <p className="description" style={{ margin: "0 auto 2rem", maxWidth: 650 }}>
        Connecting AI to external systems using the Model Context Protocol — giving models
        access to files, APIs, and tools beyond their training data.
      </p>
      <div className="start-card" style={{ textAlign: "left" }}>
        <h3 style={{ textAlign: "center" }}>Materials Coming Soon</h3>
        <p style={{ textAlign: "center" }}>
          Session notes, exercises, and recordings will be posted here after each live session.
          Join us Saturday to follow along live.
        </p>
      </div>
    </main>
  );
}
