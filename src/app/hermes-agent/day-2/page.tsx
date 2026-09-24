import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";
import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/hermes-day-2/01-recap-and-goal.svg",
    alt: "Two panels: a Day 1 recap checklist on the left, and today's goal — get Hermes talking to a real local LLM end to end — on the right",
    paragraph:
      "Day 1 was a talk: what an LLM is, why Hermes Agent is provider-agnostic, a first look at the DGX Spark and Mac Mini, and the shape of the next six sessions. Day 2 is where the hands-on labs actually start. Today's goal is narrow and concrete: point Hermes at a local model, send it a real prompt, and confirm the whole chain works with a health check — nothing more advanced than that yet.",
  },
  {
    src: "/slides/hermes-day-2/02-provider-agnostic.svg",
    alt: "Hermes Agent box in the center with arrows fanning out to three endpoint boxes: local DGX Spark, local Mac Mini, and a cloud provider, all speaking an OpenAI-compatible /v1 API",
    paragraph:
      "Hermes Agent doesn't care where the model actually runs — it only needs an OpenAI-compatible /v1 endpoint to talk to. That's what lets the exact same CLI and the exact same commands work identically against a llama-server instance on the DGX Spark, a local server on Sanjay's Mac Mini, or a hosted cloud API. For this course we'll almost always be pointing it at our own hardware.",
  },
  {
    src: "/slides/hermes-day-2/03-local-vs-cloud.svg",
    alt: "Side-by-side comparison of a local DGX Spark endpoint (no API key, works offline, data stays local) against a cloud hosted API (needs a key, needs internet, data leaves the machine), each with an example base URL",
    paragraph:
      "Running local versus cloud isn't just a preference — the practical differences are real. A local endpoint on the DGX Spark needs no API key, works with no internet connection at all, and keeps every request on our own network, at the cost of being limited by our own GPU memory. A cloud endpoint trades that independence for effectively unlimited model size, in exchange for an API key, a network dependency, and requests that leave your machine. Today we're using the local one.",
  },
  {
    src: "/slides/hermes-day-2/04-hermes-config-flow.svg",
    alt: "Four-step flow diagram: run hermes config, choose custom provider, enter base URL and model, config saved — plus a note on using a placeholder API key value for local servers",
    paragraph:
      "Configuring Hermes is a short wizard: run hermes config, choose a custom provider instead of a built-in one, enter the base URL and model name for the local llama-server instance, and it's saved to Hermes's config file for every future call to reuse. If the wizard insists on an API key even though the local server doesn't check one, a placeholder value like not-needed satisfies the prompt without doing anything real — that's different from a wrong key against a real cloud provider, which produces an actual authentication error.",
  },
  {
    src: "/slides/hermes-day-2/05-one-shot-round-trip.svg",
    alt: "The hermes -z one-shot CLI command flowing from the terminal to Hermes Agent to llama-server on the DGX Spark and back, with a callout on what to look for in the response",
    paragraph:
      "The real test is a single one-shot command: hermes -z with a prompt and --cli. Your terminal sends the prompt, Hermes wraps it according to the saved config and sends an HTTP request to the /v1 endpoint, llama-server generates a response on the DGX Spark, and it streams back to print in your terminal. The tell that it actually worked: the answer should name our local model, not GPT-4 or Claude — if it does, you're not accidentally talking to a cloud fallback.",
  },
  {
    src: "/slides/hermes-day-2/06-chat-template-cycle.svg",
    alt: "Pipeline diagram: plain-text prompt, chat template applied, tokenized, sent to the model, with a callout explaining why a mismatched template silently degrades output instead of crashing",
    paragraph:
      "There's a hidden step between what you type and what the model sees: the chat template. Your plain prompt gets wrapped in model-specific markup, then tokenized, before the model ever generates a response. Every model family expects its own exact template, and getting it wrong doesn't crash anything — it just quietly produces rambling, confused, or broken-tool-calling output. This exact mismatch was the root cause behind several confusing failures in earlier live Hermes sessions, which is why hermes doctor checks for it automatically.",
  },
  {
    src: "/slides/hermes-day-2/07-hermes-doctor.svg",
    alt: "Four-panel grid of what hermes doctor checks: endpoint reachable, chat template correct, dependencies present, and model responds — framed as a five-second habit to build",
    paragraph:
      "hermes doctor is the fastest way to catch a broken setup before it wastes time: it confirms the endpoint is reachable, the chat template matches the model, dependencies like uvx that MCP servers need are on PATH, and the model actually responds to a real test prompt. The habit worth building starting today, not just for this one lab: run it before every new lab in this course. Five seconds now beats twenty minutes of confused debugging later when an MCP server or RAG tool mysteriously doesn't work.",
  },
  {
    src: "/slides/hermes-day-2/08-common-pitfalls.svg",
    alt: "Three red warning panels: wrong endpoint URL, missing API key placeholder, and mismatched chat template, each with its symptom, fix, and which hermes doctor check would catch it",
    paragraph:
      "Three things are most likely to go wrong today. A wrong endpoint URL shows up as a connection refused error or a silent cloud fallback — check the port and the /v1 suffix. A missing API key placeholder blocks hermes config from saving at all — any placeholder value works for a local server. And a mismatched chat template produces a model that rambles or ignores instructions instead of failing outright — the hardest of the three to notice, and exactly what hermes doctor's chat template check exists to catch.",
  },
  {
    src: "/slides/hermes-day-2/09-hermes-vs-chat-ui.svg",
    alt: "Side-by-side comparison of ChatGPT/Claude web (single conversation, manual copy-paste, no filesystem or MCP access) against Hermes Agent CLI (scriptable, file access, MCP tools, agent loops)",
    paragraph:
      "It's worth being explicit about why this course uses a CLI agent instead of a chat window. ChatGPT and Claude's web interfaces are excellent for open-ended thinking with zero setup, but they can't touch your filesystem, can't connect to MCP tool servers, and can't run multi-step agent loops on their own. Hermes Agent trades that simplicity for exactly the capabilities this course is built around: scriptable calls, file access, MCP tools, and agent loops — the foundation for every remaining day.",
  },
  {
    src: "/slides/hermes-day-2/10-recap-and-preview.svg",
    alt: "Day 2 recap checklist next to a preview panel for Day 3: LLM Routing, describing running multiple local models on the DGX Spark's 128GB of memory and routing requests between them",
    paragraph:
      "By the end of today you have a real, working connection from Hermes Agent to a local LLM: a provider-agnostic setup, a saved config, a verified round trip, an understanding of why chat templates matter, and a clean bill of health from hermes doctor. Day 3 builds directly on this: the DGX Spark's 128 GB of memory can hold more than one model at once, and we'll register a second local endpoint and start routing requests to whichever model actually fits the task.",
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

export default function HermesAgentDay2() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 2 · Mon, Sep 28, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Hermes Fundamentals
      </h1>

      <Slideshow slides={SLIDES} />

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          <strong>Hermes Agent</strong> is our vehicle for this course because it doesn&apos;t need a hosted
          API key — it talks to any OpenAI-compatible endpoint, which means it works against a local{" "}
          <code>llama-server</code> instance on our <strong>DGX Spark</strong> or Sanjay&apos;s{" "}
          <strong>Mac Mini</strong> exactly the same way it would against a cloud model. Today is about
          getting comfortable with what Hermes is and getting it talking to a local LLM end to end.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Understand what Hermes Agent is and why it&apos;s provider-agnostic</li>
          <li>Point Hermes at a local, OpenAI-compatible endpoint instead of a cloud provider</li>
          <li>Run a first one-shot prompt and confirm the round trip actually works</li>
          <li>Run <code>hermes doctor</code> to sanity-check the setup before building on it</li>
        </ul>

        <h2 style={h2Style}>Lab: point Hermes at a local model</h2>
        <p style={pStyle}>
          Configure Hermes with a custom provider pointing at the local endpoint we&apos;ll be running on
          the DGX Spark:
        </p>
        <CodeBlock code={`$ hermes config`} />
        <p style={pStyle}>
          Then run a single prompt to completion with <code>--cli</code> to confirm it&apos;s actually
          talking to our local model and not a cloud fallback:
        </p>
        <CodeBlock code={`$ hermes -z "In one sentence, who are you and what model are you running on?" --cli`} />
        <p style={pStyle}>
          Finally, run the built-in health check — this is the fastest way to catch a broken endpoint,
          missing dependency, or misconfigured chat template before it wastes time later in the course:
        </p>
        <CodeBlock code={`$ hermes doctor`} />

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Sep 28, 2026 — actual
            hardware used (DGX Spark vs. Mac Mini), model loaded, and real command output.
          </p>
        </div>
      </div>
    </main>
  );
}
