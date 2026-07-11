import Link from "next/link";

export default function CronVsAgenticAiInsight() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/insights" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All insights
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-10</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Cron Jobs vs. Agentic AI
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={{ marginBottom: "1.5rem" }}>Here&apos;s the full picture:</p>

        <p style={{ marginBottom: "1.5rem" }}>
          Agents are just configuration files. Most commonly YAML, JSON, or Python code. They
          contain four things:
        </p>
        <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 }}>
          <li>
            <strong>Goal</strong> — Natural language description of what you want
            (&quot;backup database daily&quot;)
          </li>
          <li>
            <strong>Tools</strong> — List of available functions (shell commands, HTTP calls,
            file I/O, etc.)
          </li>
          <li>
            <strong>LLM config</strong> — Where and how to reach the LLM
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              <li>
                <code>api_key</code>: Your authentication token (e.g., <code>sk-ant-...</code>)
              </li>
              <li>
                <code>endpoint</code>: The URL (e.g.,{" "}
                <code>https://api.anthropic.com/v1/messages</code>)
              </li>
              <li>
                <code>model</code>: Which model to use (e.g., <code>claude-sonnet-4-6</code>)
              </li>
              <li>Other params like temperature, max_tokens</li>
            </ul>
          </li>
          <li>
            <strong>Loop logic</strong> — The reasoning → action → observation → feedback cycle
          </li>
        </ul>

        <img
          src="/insights/agent-files-structure-and-config.svg"
          alt="Diagram of agent files, structure, and LLM connectivity: agent file format on the left, architecture components in the middle, runtime with API endpoint and authentication on the right"
          style={{
            width: "100%",
            maxWidth: 500,
            display: "block",
            margin: "0 auto 2rem",
            background: "#ffffff",
            borderRadius: 12,
            padding: "1rem",
          }}
        />

        <h2 style={{ color: "#ffffff", fontSize: "1.4rem", margin: "2rem 0 1rem" }}>
          How the agent knows where the LLM is
        </h2>
        <p style={{ marginBottom: "1.5rem" }}>
          The <code>api_key</code> and <code>endpoint</code> URL are hardcoded in the config file
          (or loaded from environment variables for security). At runtime, when the agent needs to
          reason, it:
        </p>
        <ol style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 }}>
          <li>Prepares a request with the current context</li>
          <li>
            Adds an <code>Authorization: Bearer sk-ant-...</code> header
          </li>
          <li>Makes an HTTPS POST to the endpoint</li>
          <li>The LLM server verifies the key, processes it, returns a response</li>
          <li>Agent parses the response and continues the loop</li>
        </ol>

        <p style={{ marginBottom: "1.5rem" }}>
          That&apos;s it. The agent doesn&apos;t &quot;learn&quot;—it&apos;s stateless. Every time
          it runs (or starts a new session), it loads the config file fresh and starts over. If you
          want true learning, you&apos;d need to:
        </p>
        <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 }}>
          <li>Save successful agent trajectories to a dataset</li>
          <li>Fine-tune the LLM offline on those trajectories</li>
          <li>Deploy the updated LLM to the agent config</li>
        </ul>

        <p>
          The agent itself is remarkably simple: glorified orchestration layer is fair. But that
          orchestration—deciding what to do based on observations and reasoning—is exactly what
          cron jobs can&apos;t do.
        </p>
      </div>
    </main>
  );
}
