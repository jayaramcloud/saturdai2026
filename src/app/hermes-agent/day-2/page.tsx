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
  {
    src: "/slides/hermes-day-2/11-hermes-bots.svg",
    alt: "Screenshot of the Hermes app's BOTS tab with a bot named Hermes answering 'why did the sandisk and western digital shares tanked today?' — after two Thought steps and 'Searched 2 queries' it explains that a Nikkei Asia report on Toshiba doubling HDD capacity hit Western Digital (~10%), Seagate (~10–14%) and SanDisk (~3.8%) — with four callouts: what a bot is, it uses tools, think-act-think, and still verify it",
    paragraph:
      "Before we wrap up, here's a look at where all of this is heading: a Hermes bot. A bot is a saved, named Hermes agent that lives under the BOTS tab with its own ongoing conversation, so you can come back to it and just ask. Here I asked it why SanDisk and Western Digital shares fell today — a question no model can answer from training data alone. Watch the trace above the answer: it thought, ran two live web searches, thought again, and only then wrote a structured explanation with the catalyst, per-stock moves, and market context. That think-act-think cycle is a small agent loop, the same idea we'll build up to on Day 6. One honest caution: the prices and percentages are claims the bot gathered from the web, so treat them like any other source and check them before you rely on them.",
  },
  {
    src: "/slides/hermes-day-2/12-hermes-capabilities.svg",
    alt: "Screenshot of the Hermes app's Capabilities page — tabs for Skills (57), Tools (25), Connectors and Plugins, a Discover panel listing 101.3K skills filterable by source (Built In, GitHub, HuggingFace, Anthropic, OpenAI, ClawHub and more), and skill cards with on/off toggles for apple-notes, apple-reminders, findmy, claude-code, codex, imessage, hermes-agent, opencode and computer-use — next to four callouts explaining what a skill is, the four kinds of capability, the skills marketplace, and agents delegating to other agents",
    paragraph:
      "The bot on the last slide could search the web because it had that capability switched on, and this is where those capabilities live. Hermes groups them into four kinds: skills, tools, connectors and plugins. A skill is a packaged how-to — a set of instructions plus the command-line program it drives — so the apple-notes skill teaches Hermes to create and search notes through the memo CLI, and flipping its toggle on is all it takes for the agent to start using it. You rarely have to write one yourself: the Discover panel lists over a hundred thousand skills from sources like GitHub, HuggingFace, Anthropic, OpenAI and ClawHub. Look closely at claude-code, codex and opencode — those skills let Hermes hand a coding job to an entirely different agent, and computer-use lets it drive the desktop itself. The model underneath hasn't changed at all; the agent got more useful because we gave it more hands. Notice the sidebar too — Messaging, WhatsApp and scheduled cron jobs mean Hermes can keep working when you're not at the keyboard, which is exactly where Day 7 is going.",
  },
  {
    src: "/slides/hermes-day-2/13-hermes-messaging.svg",
    alt: "Screenshot of the Hermes app's Messaging page with WhatsApp selected and marked Connected — 'Use Hermes through the bundled WhatsApp bridge with QR-based auth', no token required, an Allowed WhatsApp users field saved with one masked phone number, and the platform toggled Enabled — alongside a list of other platforms (Telegram, Discord, Slack, Mattermost, Matrix, Signal, BlueBubbles, Home Assistant, Email, SMS via Twilio, DingTalk, Feishu/Lark, Google Chat, WeCom, WeChat, QQ Bot), with four callouts on what messaging is, the three setup steps, locking it down, and other platforms",
    paragraph:
      "So far we've talked to Hermes from a terminal or the desktop app, but an agent is far more useful when it's reachable from wherever you already are. The Messaging page connects Hermes to chat platforms, and here it's hooked up to WhatsApp. Setup is three steps: start the WhatsApp bridge that ships with Hermes, scan the QR code with your phone on the first run the same way you'd link WhatsApp Web, and switch the platform to Enabled — there's no API token to paste in. The one setting you must not skip is Allowed WhatsApp users: it's a whitelist of phone numbers, and without it anyone who messages that number gets to use your agent, including whatever skills and files you've given it. WhatsApp is just one option — the same agent can sit behind Telegram, Discord, Slack, Signal, email, SMS and more, all with the same model and the same skills behind it.",
  },
  {
    src: "/slides/hermes-day-2/14-hermes-scheduled-jobs.svg",
    alt: "Screenshot of the Hermes Scheduled jobs window showing 5 jobs (Competitor news watch, Morning Brief, Remind me to stretch, Summarize all new news, Topic news digest) and a Blueprints list (Morning briefing, Important-mail monitor, Weekly review, Price & availability watch, Habit check-in and more); the selected Competitor news watch job runs on cron 0 9 * * *, next at 10/3/2026 9:00 AM, delivers to whatsapp, with a prompt that loads the competitor-news-monitor skill to watch GOOG, NVDA and APPL and send a cited digest of material events only, Pause and Trigger now buttons, and no runs yet — with four callouts on what a scheduled job is, cron frequency, delivery to WhatsApp, and blueprints",
    paragraph:
      "Everything up to now has been you asking and Hermes answering. Scheduled jobs flip that around: a job is just a saved prompt plus a schedule, and when the time comes Hermes runs it as a full agent turn — with its skills, web search and everything else switched on — then delivers the result to you. The schedule uses cron syntax: 0 9 * * * reads as minute 0, hour 9, every day, every month, every day of the week, so this competitor news watch fires at 9:00 every morning, and its next run is tomorrow. Its prompt loads a news-monitoring skill, watches a few companies for launches, pricing changes and executive moves, and only reports material events — staying silent on quiet days so it doesn't spam you. Delivery is set to WhatsApp, which is why the last slide mattered: the digest lands on your phone without you opening anything. You don't have to write these from scratch either; the blueprints on the left cover common patterns like a morning briefing, a price watch or a weekly review, and Trigger now lets you test one immediately instead of waiting until 9 AM.",
  },
  {
    src: "/slides/hermes-day-2/15-hermes-settings.svg",
    alt: "Screenshot of the Hermes Settings window on Settings > Model > Main model: provider set to custom, model MiMo-V2.6-Flash-RL-Sep2026, an Apply button, Reasoning default Medium, and a main model context window override of 0; the left menu lists Main model, Fallback models, Auxiliary models, Mixture of Agents, Chat, Appearance, Workspace, Safety, Browser, Passwords & Logins, Memory & Context, Voice, Advanced, Notifications, Billing, Providers, Gateways, Keyboard Shortcuts, Tools & Keys, Sessions and About — with four callouts on the main model, fallback/auxiliary/MoA models, reasoning and context, and the other menus",
    paragraph:
      "Every feature on the last few slides is configured from the Settings window, and the most important page in it is the one we already did by hand today. Settings, Model, Main model holds the same thing hermes config saved for us: the provider is set to custom, which means our own OpenAI-compatible endpoint, and below it is the model that endpoint serves. Changing it and clicking Apply only affects new sessions — to swap the model in a chat that's already open, use the model picker in the composer instead. Under the main model are three more ideas we'll return to later in the course: fallback models that take over if the main one fails, auxiliary models for smaller side jobs, and a Mixture of Agents that combines answers from several models. Reasoning sets how hard the model thinks by default — higher is slower but more thorough — and the context window override stays at 0 unless you need to correct a wrongly detected size. The rest of the menu maps onto what you've already seen: Gateways for messaging, Tools and Keys for capabilities, Safety and Memory and Context for how far the agent is allowed to go and what it remembers.",
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
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 2 · Mon, Sep 28, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Hermes Fundamentals
      </h1>

      <Slideshow slides={SLIDES} wide />

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
