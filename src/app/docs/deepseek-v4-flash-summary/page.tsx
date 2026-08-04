import type { CSSProperties } from "react";

const codeStyle: CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #33335a",
  borderRadius: 8,
  padding: "1rem",
  overflowX: "auto",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  marginBottom: "1.5rem",
};

const h2Style: CSSProperties = { color: "#ffffff", fontSize: "1.4rem", margin: "2rem 0 1rem" };
const pStyle: CSSProperties = { marginBottom: "1.5rem" };
const listStyle: CSSProperties = { marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 };
const noteStyle: CSSProperties = {
  background: "#2a2a4a",
  border: "1px solid #44447a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};

export default function DeepseekV4FlashSummary() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <a href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </a>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-08-02</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
        DeepSeek V4 Flash 0731 — Quick Summary
      </h1>
      <p style={{ color: "#8888aa", fontSize: "0.9rem", marginBottom: "2rem" }}>
        Participants: Jay Krish, Sanjay Jayaram
      </p>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <h2 style={h2Style}>The model</h2>
        <p style={pStyle}>
          DeepSeek V4 Flash is a 284-billion-parameter language model released on August 1, 2026. It&apos;s not
          the largest multi-trillion parameter model on the market, but it&apos;s the most price-competitive
          model available.
        </p>

        <h2 style={h2Style}>Pricing &amp; competitive advantage</h2>
        <p style={pStyle}>DeepSeek pricing, with a 30% launch discount:</p>
        <ul style={listStyle}>
          <li>Input: 9 cents per million tokens (normally 14 cents)</li>
          <li>Output: 18 cents per million tokens (normally 28 cents)</li>
        </ul>
        <div style={noteStyle}>
          <strong>Context:</strong> OpenAI slashed GPT 5.6 Luna prices by 80% the day before DeepSeek&apos;s
          release, yet DeepSeek is still cheaper for comparable performance. This has eroded OpenAI&apos;s
          profit margins on inference. Anthropic has stepped back from competing at this price point,
          focusing instead on larger, more expensive models.
        </div>

        <h2 style={h2Style}>Market landscape</h2>
        <p style={pStyle}>Multiple providers now serve DeepSeek:</p>
        <ul style={listStyle}>
          <li>Open Router</li>
          <li>Alibaba Cloud</li>
          <li>Fireworks</li>
          <li>Cloudflare (surprisingly)</li>
          <li>Akash ML</li>
        </ul>
        <p style={pStyle}>
          This represents a historic shift: competitors are openly serving each other&apos;s models, including
          Chinese and US companies.
        </p>

        <h2 style={h2Style}>Key features</h2>
        <ul style={listStyle}>
          <li>
            <strong>Cache pricing:</strong> 1.4 cents — a 50x discount on cached tokens vs. new ones, a huge
            advantage for conversational workloads.
          </li>
          <li>
            <strong>Speed:</strong> 71 tokens/second on some providers vs. 4 tokens/second on others.
          </li>
          <li>
            <strong>Benchmarks:</strong> Artificial Analysis rates it very close to the frontier for
            intelligence.
          </li>
        </ul>

        <h2 style={h2Style}>Local deployment</h2>
        <p style={pStyle}>
          Sanjay demonstrated downloading and running DeepSeek locally using <code>llama.cpp</code> on a
          single GPU with 128GB VRAM. After quantization (IQ3 compression), the model uses ~110GB, leaving
          minimal headroom.
        </p>
        <pre style={codeStyle}><code>{`~/llama.cpp/llama.cpp/build/bin/llama-server -hf unsloth/DeepSeek-V4-Flash-GGUF:UD-IQ3_XXS -ngl 999 --port 11434`}</code></pre>

        <h2 style={h2Style}>Bottom line</h2>
        <p style={pStyle}>
          DeepSeek V4 Flash represents a massive shift: for the first time, open-source models are cheaper,
          fast enough, and good enough for most commercial use cases, forcing the entire market to compete on
          price rather than exclusivity.
        </p>
      </div>
    </main>
  );
}
