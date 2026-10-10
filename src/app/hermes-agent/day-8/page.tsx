import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";
import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/hermes-day-8/01-why-a-server-in-the-middle.svg",
    alt: "Two boxes: the unsafe shortcut of putting the AI key in the web page's JavaScript, where every visitor can copy it, versus the safe pattern of a small server in the middle that holds the key as a secret",
    paragraph:
      "The first rule of any public chatbot is that the browser never calls the AI directly. If it did, the secret API key would have to ship inside the web page, where anyone can copy it from View Source and spend your money, and a key committed to a public repository is typically found by bots within minutes. The safe pattern puts a small server in the middle: the browser talks only to your server, and the server holds the key, checks every question, and talks to the AI on the visitor's behalf.",
  },
  {
    src: "/slides/hermes-day-8/02-three-part-architecture.svg",
    alt: "Architecture diagram: a browser sends a question to a Cloudflare Worker at /api/ask, which validates it, rate limits it, adds a system prompt and history, attaches the secret key and calls the Claude API; the reply returns the same way. A secret key box and a static files box sit below the Worker",
    paragraph:
      "There are three parts. The chat page runs in the visitor's browser and only ever sends questions to your own site. The Cloudflare Worker at /api/ask is the part you control: it validates the question, adds instructions and recent history, attaches the secret key, and calls the Claude API. Claude writes the answer, which flows back through the Worker to the page. The key is stored as a Worker secret on Cloudflare, and the site's pages, CSS, and JavaScript are served separately from the same project.",
  },
  {
    src: "/slides/hermes-day-8/03-anatomy-of-one-request.svg",
    alt: "Five boxes in a row: Send, Check, Prepare, Ask, Show, describing what happens from pressing Send to the reply appearing on the page",
    paragraph:
      "When someone presses Send, the page posts the question plus a short history to /api/ask. The Worker checks it is valid JSON, a non-empty string, and at most 600 characters, then prepares the call by adding a system prompt and the last six messages so follow-up questions make sense. It calls Claude with the secret key, the model name, and a 450-token cap on the answer, and the page finally renders the reply, turning bold and lists into safe page elements without ever using innerHTML. If anything fails, the visitor sees a friendly message and never the raw error or the key.",
  },
  {
    src: "/slides/hermes-day-8/04-safety-and-cost-controls.svg",
    alt: "Six boxes listing safety and cost controls: secret stays server-side, limit the input, keep it on topic, display safely, cap the spend, protect privacy",
    paragraph:
      "None of the six controls is exotic, but together they make a public chatbot safe to leave running. The key stays server-side as a Wrangler secret, input is limited to 600 characters with only the last six messages of history sent, and a system prompt keeps the model on topic and tells it to ignore instructions hidden inside a question. Replies are drawn as text nodes so any HTML in an answer is displayed and never executed, a small model with 450-token answers plus a monthly limit set on the key in the console caps the spend, and conversations stay in the browser with a notice not to share personal data.",
  },
  {
    src: "/slides/hermes-day-8/05-honest-limits.svg",
    alt: "Two boxes: a limit found by testing, where the in-memory rate limit did not cap requests in a live test, and how to make it stronger with Cloudflare rate-limiting rules, a Durable Object, or Turnstile",
    paragraph:
      "Testing the live site found a real flaw. The built-in rate limit keeps its counters in each Worker copy's memory, and Cloudflare runs many copies at once, so in a live test ten quick requests from one address all succeeded even though the limit was set to eight. That makes it a speed bump rather than a cap, which is why the monthly spend limit on the key is the control that actually protects you. Stronger options are Cloudflare's rate-limiting rules, a Durable Object that counts per visitor, or a Turnstile bot check, and keep in mind that API keys expire and must be rotated by re-running the secret command.",
  },
  {
    src: "/slides/hermes-day-8/06-where-to-go-next.svg",
    alt: "Six extension ideas: stream the answer, add RAG, mock-interview mode, add tools over MCP, save conversations, and run a local model",
    paragraph:
      "Every extension reuses something from earlier in the course. Stream the answer word by word instead of waiting for all of it, ground replies in your own documents with RAG as on Day 4, or add tools over MCP as on Days 5 and 6. You could build a mock-interview mode where the bot asks the questions, save conversations behind sign-in with a clear privacy notice, or swap the Claude call for a model running on your own DGX Spark or Mac Mini. The pattern stays the same throughout: a server in the middle that checks, adds context, and holds the secrets.",
  },
];

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
const warnStyle: CSSProperties = {
  background: "#3a2222",
  border: "1px solid #6a3a3a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};

export default function HermesAgentDay8() {
  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 8 · Bonus session
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Build a Chatbot
      </h1>

      <Slideshow slides={SLIDES} wide />

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A bonus session after the capstone. Instead of an agent that runs on your own machine, this one
          builds a chatbot that anyone on the internet can use: a web page, a small server that holds the
          secret API key, and a language model that writes the answers. It is the same pattern behind most
          public AI assistants, and it comes with the safety and cost controls a public endpoint needs.
        </p>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Try the finished chatbot:</strong>{" "}
            <a
              href="https://jayaram.preparingforinterviews.com/ask"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#a0a0ff" }}
            >
              jayaram.preparingforinterviews.com/ask
            </a>{" "}
            is a live AI career coach built exactly this way, and{" "}
            <a
              href="https://jayaram.preparingforinterviews.com/day8"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#a0a0ff" }}
            >
              its Day 8 page
            </a>{" "}
            has a full diagram and build steps. Its source is public at{" "}
            <a
              href="https://github.com/jayaramcloud/jayaram-app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#a0a0ff" }}
            >
              github.com/jayaramcloud/jayaram-app
            </a>
            .
          </p>
        </div>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Explain why a chatbot must never call the AI from the browser, and what a server in the middle does</li>
          <li>Create an API key, set a spend limit, and store the key as a secret instead of in code</li>
          <li>Write a small Worker that validates a question, calls the model, and returns the answer</li>
          <li>Apply safety and cost controls: input limits, an on-topic system prompt, safe display, and a spend cap</li>
          <li>Test honestly, including the parts that do not work as hoped</li>
        </ul>

        <h2 style={h2Style}>Lab: build the chatbot</h2>
        <p style={pStyle}>
          First create a key in the Anthropic Console: add billing credit, set a monthly spend limit, then
          choose API Keys and Create Key. The key is shown only once. Store it as a secret on your Worker;
          the command prompts for the value, so it never goes into a file or the repo:
        </p>
        <CodeBlock code={`$ npx wrangler secret put ANTHROPIC_API_KEY`} />
        <p style={pStyle}>
          Then point the Worker config at your code while still serving the static pages, sending only
          /api/* requests to the Worker:
        </p>
        <CodeBlock
          code={`{
  "name": "my-chatbot",
  "main": "src/worker.js",
  "assets": { "directory": "./public", "binding": "ASSETS", "run_worker_first": ["/api/*"] },
  "vars": { "CLAUDE_MODEL": "claude-haiku-5-5" }
}`}
        />
        <p style={pStyle}>
          The heart of the Worker is one call to the Messages API. The key is read from the environment,
          never written in the file:
        </p>
        <CodeBlock
          code={`const upstream = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: env.CLAUDE_MODEL,
    max_tokens: 450,
    system: SYSTEM_PROMPT,
    messages: [...history, { role: "user", content: question }],
  }),
});`}
        />
        <p style={pStyle}>
          Finally, check the deployed endpoint end to end with a real question, then confirm the key does
          not appear in anything the site serves:
        </p>
        <CodeBlock
          code={`$ curl -s -X POST https://YOUR-SITE/api/ask \\
    -H 'content-type: application/json' \\
    -d '{"question":"How do I answer: Tell me about yourself?"}'

$ curl -s https://YOUR-SITE/ | grep -c "sk-ant"
0`}
        />

        <div style={warnStyle}>
          <p style={{ margin: 0 }}>
            <strong>Cost and safety:</strong> a public chatbot spends real money on every question. Set a
            monthly limit on the key in the Anthropic Console before you publish the page, and remember that
            keys expire. Never paste a key into a chat, a screenshot, or a file in a public repository.
          </p>
        </div>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session.
          </p>
        </div>
      </div>
    </main>
  );
}
