import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/week-1/01-ai-landscape.svg",
    alt: "Nested diagram showing AI, Machine Learning, Deep Learning, Generative AI, and LLMs",
    paragraph:
      "Large Language Models are one small, specific piece of a much bigger picture. AI is the broad idea of computers doing tasks that seem to need human smarts; Machine Learning narrows that to systems that learn from examples; Deep Learning uses layered neural networks to do that learning; Generative AI creates new content instead of just predicting; and LLMs are the generative models trained on massive amounts of text — the kind you'll be using this week.",
  },
  {
    src: "/slides/week-1/02-llm-assistants-map.svg",
    alt: "Quadrant map positioning ChatGPT, Claude, Gemini, Copilot, Perplexity, Meta AI, Grok, Qwen, DeepSeek, Mistral, and Cohere",
    paragraph:
      "There isn't one single \"best\" AI assistant — each has a different personality and strength. Some lean toward being search-and-fact grounded, others toward open-ended conversation and creativity. This is also a global landscape, not just a US one: China's Qwen (Alibaba) and DeepSeek, France's Mistral, and Canada's Cohere are all widely used, each with their own reputation — DeepSeek and Mistral in particular for efficient, open-weight models favored by developers. Trying more than one on the same question is a quick way to get a feel for these differences rather than taking anyone's word for which is \"best.\"",
  },
  {
    src: "/slides/week-1/03-day-in-the-life.svg",
    alt: "Six everyday use-case regions: writing, learning, coding, planning, creativity, and advice",
    paragraph:
      "Most people already touch an LLM more often than they realize — drafting an email, learning a new topic, debugging code, planning a trip, brainstorming ideas, or asking for advice. Recognizing these as the same underlying skill (talking to a language model) makes it easier to reach for one deliberately instead of by accident.",
  },
  {
    src: "/slides/week-1/04-conversation-loop.svg",
    alt: "Diagram of the prompt, read, respond, refine conversation loop with system instructions and context window callouts",
    paragraph:
      "Under the hood, every chat is the same loop: you prompt, the model reads everything in its context window (including any system instructions it was given), it responds, and you refine. You don't need to understand the internals to use this well — just knowing the loop exists helps you understand why rephrasing or adding detail changes the answer you get.",
  },
  {
    src: "/slides/week-1/05-learning-roadmap.svg",
    alt: "Roadmap showing Day 1 LLMs, Week 2 RAG, Week 3 MCPs, and Week 4 Tool Calling",
    paragraph:
      "Today is the first stop on a four-part path. Once you're comfortable talking to an LLM, Week 2 grounds it in real knowledge with RAG, Week 3 connects it to external systems with MCPs, and Week 4 lets it take real action through tool calling. Each week builds directly on the one before it.",
  },
  {
    src: "/slides/week-1/06-prompting-basics.svg",
    alt: "Side-by-side comparison of a vague prompt versus a specific prompt about planning a trip",
    paragraph:
      "The single biggest lever you control is how specific your prompt is. A vague ask like \"help me with my trip\" forces the model to guess at your destination, dates, budget, and goal — and you'll get a generic answer back. Naming the destination, dates, travelers, budget, interests, and desired format up front gets you something usable on the first try.",
  },
  {
    src: "/slides/week-1/07-failure-modes.svg",
    alt: "Three failure modes: hallucination, stale knowledge, and confidently wrong answers",
    paragraph:
      "LLMs fail in a few predictable ways: they can hallucinate facts or sources that don't exist, they can be stuck with stale knowledge from their training cutoff, and — most importantly — they sound equally confident whether they're right or wrong. None of this makes them unreliable to use; it just means facts that matter are worth a quick double-check.",
  },
  {
    src: "/slides/week-1/08-privacy-and-data.svg",
    alt: "Flow diagram of a message going from you to a provider's servers, with a warning list of data not to paste in",
    paragraph:
      "What you type is sent to the provider's servers to generate a reply, and depending on the product and your settings, it may be stored or used to improve the model. A simple rule of thumb: if you wouldn't post it publicly or hand it to a stranger — passwords, private data, confidential documents — don't paste it into a chat window either.",
  },
  {
    src: "/slides/week-1/09-free-vs-paid.svg",
    alt: "Comparison table of free versus paid tiers across message limits, model access, memory, uploads, and features",
    paragraph:
      "Paid tiers mainly buy you higher usage limits, access to the newest and most capable models, a longer memory per conversation, more generous file uploads, and extra features like voice or coding tools. For this bootcamp, the free tier is more than enough — and we also have our own DGX Spark supercomputer for anything heavier.",
  },
  {
    src: "/slides/week-1/10-recap-and-exercise.svg",
    alt: "Recap of five key takeaways from Day 1 plus a three-step live exercise",
    paragraph:
      "To recap: LLMs are generative AI trained on text; different assistants have different strengths; specific prompts beat vague ones; confident answers can still be wrong; and private data doesn't belong in a chat. Your exercise: ask a vague question about something you actually need help with, rewrite it as a specific prompt, and compare the two answers.",
  },
];

export default function Week1Page() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 2rem", textAlign: "center" }}>
      <h1
        className="section-title"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.4rem" }}
      >
        <span style={{ fontSize: "2.2rem" }}>🧠</span> Week 1: LLMs
      </h1>
      <p className="description" style={{ margin: "0 auto 1.25rem", maxWidth: 700 }}>
        Understanding and using language models, hands-on with real models on the DGX Spark
        supercomputer.
      </p>

      <Slideshow slides={SLIDES} />
    </main>
  );
}
