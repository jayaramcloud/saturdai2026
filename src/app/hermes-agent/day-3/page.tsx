import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";
import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/hermes-day-3/01-recap-and-goal.svg",
    alt: "Two side-by-side cards: Day 2 recap (one Hermes, one model) on the left, arrow pointing to today's goal (one Hermes, many models) on the right",
    paragraph:
      "Day 2 got Hermes talking to exactly one local model, end to end. Today builds on that by registering a second local provider alongside the first, so Hermes has a real choice to make instead of a single fixed backend. The goal isn't complexity for its own sake — it's routing each prompt to the model that actually fits the job, and measuring that choice with real latency and quality numbers instead of assuming.",
  },
  {
    src: "/slides/hermes-day-3/02-dgx-spark-memory.svg",
    alt: "128GB unified memory card showing two options: several 30B-parameter models loaded side by side, or one ~200B-parameter model, next to a card describing the NVIDIA GB10 Grace Superchip's 6,144 CUDA cores and 1 Petaflop FP4 compute",
    paragraph:
      "None of today's routing is possible without enough memory to keep more than one model warm at once. The DGX Spark's 128GB of unified memory means several 30B-parameter models can sit loaded simultaneously, or a single much larger model can take their place — either way, switching between backends doesn't mean paying a multi-second unload/reload penalty on every request the way it would on a smaller machine.",
  },
  {
    src: "/slides/hermes-day-3/03-small-vs-large-tradeoffs.svg",
    alt: "Two-column comparison: a small 7B-8B model (fast, cheap, good for lookups and routing, but weaker at long reasoning) versus a large 30B-200B model (deep, capable, better at nuance, but slower and heavier)",
    paragraph:
      "Neither size of model is simply \"better\" — they're suited to different jobs. A small model answers almost instantly and is cheap to run many of in parallel, which makes it a great default for lookups, formatting, and routing decisions, but it's more likely to skip steps on a genuinely hard reasoning task. A large model reasons more reliably through ambiguity and multi-step problems, at the cost of slower responses and a bigger share of that 128GB memory budget. The fix isn't picking a favorite — it's routing each prompt to whichever one actually needs to answer it.",
  },
  {
    src: "/slides/hermes-day-3/04-registering-second-provider.svg",
    alt: "hermes config box branching into two provider cards: local-small (7B model on port 8081) and local-large (30B model on port 8082), both OpenAI-compatible endpoints",
    paragraph:
      "Mechanically, this is one more pass through hermes config: instead of overwriting the existing provider, we add a second one — a local-large endpoint alongside the local-small one already configured on Day 2. Both are just OpenAI-compatible /v1 routes on different ports, both running on the DGX Spark at the same time. Once both are registered, picking between them becomes a per-request decision rather than a limitation.",
  },
  {
    src: "/slides/hermes-day-3/05-routing-decision-diagram.svg",
    alt: "Three-stage flow diagram: an incoming prompt, a classify step asking what kind of task it is, branching to either local-small for simple/quick tasks or local-large for complex/multi-step tasks",
    paragraph:
      "Every prompt in today's lab passes through the same three-stage decision: it arrives, we classify what kind of task it actually is — a quick lookup, a multi-step reasoning problem, something tool-heavy — and then we pick the backend that fits. Today that classification step is us, reading the prompt and choosing a flag; that's a deliberate simplification for the lab, not a production-grade automatic router, but the shape of the decision is the same one a real router would automate later.",
  },
  {
    src: "/slides/hermes-day-3/06-example-quick-lookup.svg",
    alt: "A quick time-lookup prompt routed to local-small (7B), with the hermes -z command specifying --provider local-small",
    paragraph:
      "\"What time is it right now in Calgary and Bengaluru?\" is a single fact behind a single tool call, with no multi-step planning required — exactly the kind of prompt the small model handles well. We'll run this live with hermes -z ... --cli --provider local-small and time the response, which becomes our baseline for the comparison on the next slide.",
  },
  {
    src: "/slides/hermes-day-3/07-example-complex-reasoning.svg",
    alt: "A multi-step vendor comparison prompt routed to local-large (30B), with the hermes -z command specifying --provider local-large",
    paragraph:
      "Asking Hermes to read two vendor quotes, compare their tradeoffs, and recommend one with reasoning requires several dependent steps — read, compare, weigh, justify — that a small model tends to shortcut by just picking one without the comparison. We'll run the same style of command against local-large this time and use the same stopwatch, expecting a slower response but checking whether the reasoning actually holds up under it.",
  },
  {
    src: "/slides/hermes-day-3/08-latency-vs-quality.svg",
    alt: "Comparison table across four metrics — time to first token, factual lookup quality, multi-step reasoning quality, and memory footprint — for local-small versus local-large",
    paragraph:
      "Turning the last two examples into a table makes the tradeoff concrete: the small model wins on time-to-first-token and ties on simple factual lookups, while the large model pulls ahead specifically on multi-step reasoning quality, at the cost of a bigger memory footprint. Neither backend wins outright — the small model is the better default, and the large model is the deliberate exception for tasks that actually need it.",
  },
  {
    src: "/slides/hermes-day-3/09-common-routing-mistakes.svg",
    alt: "Three routing mistakes: always defaulting to the big model just in case, never re-checking a confident-but-wrong small-model answer, and loading both models but never actually comparing them",
    paragraph:
      "Three habits are worth catching before they become defaults. Always routing to the big model \"just in case\" pays a latency and memory cost on every simple lookup for no quality gain. Never spot-checking the small model's confident-sounding answers lets a fluent wrong answer slip through unnoticed. And loading both models but never actually comparing them turns today's exercise into a one-off instead of a running habit — the fix for all three is treating the comparison from the latency/quality table as ongoing, not a slide you look at once.",
  },
  {
    src: "/slides/hermes-day-3/10-recap-and-preview.svg",
    alt: "Recap card listing four things covered today, next to a preview card for Day 4: RAG with Hermes, grounding the model in real documents",
    paragraph:
      "Today we registered a second local provider, routed a quick lookup to the small model and a reasoning task to the large one, measured latency and quality instead of assuming either, and named the mistakes that turn multiple models into wasted capacity rather than real flexibility. Day 4 picks up from here: even the large model only knows what it was trained on, so the next session grounds Hermes in real documents so it stops guessing and starts citing.",
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

export default function HermesAgentDay3() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 3 · Wed, Sep 30, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        LLM Routing with Hermes
      </h1>

      <Slideshow slides={SLIDES} />

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          The DGX Spark&apos;s 128 GB of memory is enough to keep more than one model loaded at once —
          multiple 30B-parameter LLMs, or one much larger model up to roughly 200B parameters. Today is
          about treating that as a feature: routing a request to the right model for the job instead of
          sending everything to one general-purpose endpoint.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Register more than one local model endpoint with Hermes</li>
          <li>Understand the tradeoffs between a small fast model and a larger, slower one</li>
          <li>Route different kinds of prompts (quick lookup vs. multi-step reasoning) to different models</li>
          <li>Confirm routing behavior with real prompts against each backend</li>
        </ul>

        <h2 style={h2Style}>Lab: register and compare two local endpoints</h2>
        <p style={pStyle}>
          Reconfigure Hermes with a second custom provider pointing at a different local model, then send
          the same one-shot prompt to each and compare latency and answer quality:
        </p>
        <CodeBlock code={`$ hermes config`} />
        <CodeBlock code={`$ hermes -z "Summarize the tradeoffs between a 7B and a 30B parameter model in two sentences." --cli`} />

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Sep 30, 2026 — which
            two models we routed between, and what the actual latency/quality comparison looked like.
          </p>
        </div>
      </div>
    </main>
  );
}
