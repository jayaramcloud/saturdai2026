export default function AboutPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 className="section-title" style={{ marginBottom: "2rem" }}>
        About SaturdAI
      </h1>
      <p className="description" style={{ margin: "0 auto 1.5rem", maxWidth: 700 }}>
        SaturdAI is a free, community-led AI bootcamp. Though the sessions are instructor-led,
        the spirit is learning together — a group of curious minds building real AI skills side
        by side, every evening in July 2026. No prerequisites, no cost. Just curiosity.
      </p>
      <p className="description" style={{ margin: "0 auto 1.5rem", maxWidth: 700 }}>
        We meet every Saturday for a fresh start, then keep learning together on weekday
        evenings. Sessions are hands-on: you&apos;ll get remote access to a DGX Spark
        supercomputer running here in Calgary so everyone can experiment with real, large
        language models instead of just reading about them.
      </p>
      <p className="description" style={{ margin: "0 auto", maxWidth: 700 }}>
        Questions? Reach out any time at{" "}
        <a href="mailto:jayaram.linux@gmail.com" style={{ textDecoration: "underline" }}>
          jayaram.linux@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
