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
    src: "/slides/week-1/03-llm-interaction-methods.svg",
    alt: "Grid of twelve channels for reaching an LLM: web, mobile, APIs, voice, chat platforms, enterprise systems, local deployment, search, dev tools, productivity suites, embedded/IoT, and specialized tools",
    paragraph:
      "The chat window isn't the only door into an LLM — it's just the most visible one. The same underlying models also show up as native mobile apps, APIs developers build on top of, voice assistants, bots inside Slack or WhatsApp, plugins in your everyday docs and IDE, and even on-device models that run with no internet at all. Recognizing these as the same technology wearing different interfaces helps explain why \"AI\" seems to be everywhere at once — it's one capability, distributed across a dozen surfaces.",
  },
  {
    src: "/slides/week-1/04-day-in-the-life.svg",
    alt: "Six everyday use-case regions: writing, learning, coding, planning, creativity, and advice",
    paragraph:
      "Most people already touch an LLM more often than they realize — drafting an email, learning a new topic, debugging code, planning a trip, brainstorming ideas, or asking for advice. Recognizing these as the same underlying skill (talking to a language model) makes it easier to reach for one deliberately instead of by accident.",
  },
  {
    src: "/slides/week-1/05-conversation-loop.svg",
    alt: "Diagram of the prompt, read, respond, refine conversation loop with system instructions and context window callouts",
    paragraph:
      "Under the hood, every chat is the same loop: you prompt, the model reads everything in its context window (including any system instructions it was given), it responds, and you refine. You don't need to understand the internals to use this well — just knowing the loop exists helps you understand why rephrasing or adding detail changes the answer you get.",
  },
  {
    src: "/slides/week-1/06-learning-roadmap.svg",
    alt: "Roadmap showing Day 1 LLMs, Week 2 RAG, Week 3 MCPs, and Week 4 Tool Calling",
    paragraph:
      "Today is the first stop on a four-part path. Once you're comfortable talking to an LLM, Week 2 grounds it in real knowledge with RAG, Week 3 connects it to external systems with MCPs, and Week 4 lets it take real action through tool calling. Each week builds directly on the one before it.",
  },
  {
    src: "/slides/week-1/07-prompting-basics.svg",
    alt: "Side-by-side comparison of a vague prompt versus a specific prompt about planning a trip",
    paragraph:
      "The single biggest lever you control is how specific your prompt is. A vague ask like \"help me with my trip\" forces the model to guess at your destination, dates, budget, and goal — and you'll get a generic answer back. Naming the destination, dates, travelers, budget, interests, and desired format up front gets you something usable on the first try.",
  },
  {
    src: "/slides/week-1/08-failure-modes.svg",
    alt: "Three failure modes: hallucination, stale knowledge, and confidently wrong answers",
    paragraph:
      "LLMs fail in a few predictable ways: they can hallucinate facts or sources that don't exist, they can be stuck with stale knowledge from their training cutoff, and — most importantly — they sound equally confident whether they're right or wrong. None of this makes them unreliable to use; it just means facts that matter are worth a quick double-check.",
  },
  {
    src: "/slides/week-1/09-privacy-and-data.svg",
    alt: "Flow diagram of a message going from you to a provider's servers, with a warning list of data not to paste in",
    paragraph:
      "What you type is sent to the provider's servers to generate a reply, and depending on the product and your settings, it may be stored or used to improve the model. A simple rule of thumb: if you wouldn't post it publicly or hand it to a stranger — passwords, private data, confidential documents — don't paste it into a chat window either.",
  },
  {
    src: "/slides/week-1/10-free-vs-paid.svg",
    alt: "Comparison table of free versus paid tiers across message limits, model access, memory, uploads, and features",
    paragraph:
      "Paid tiers mainly buy you higher usage limits, access to the newest and most capable models, a longer memory per conversation, more generous file uploads, and extra features like voice or coding tools. For this bootcamp, the free tier is more than enough — and we also have our own DGX Spark supercomputer for anything heavier.",
  },
  {
    src: "/slides/week-1/11-best-practice-context-and-role.svg",
    alt: "Comparison of a prompt with no context versus one that gives the model a role and audience",
    paragraph:
      "Telling the model who it's writing as and who it's writing for turns a generic request into a tailored one. Instead of \"write a product description for a lantern,\" giving it a role — \"you're a copywriter for a sustainable outdoor brand aimed at millennial hikers\" — plus a tone and length constraint gets you copy that actually sounds like it belongs to your brand, ready to use on the first try.",
  },
  {
    src: "/slides/week-1/12-best-practice-iterate.svg",
    alt: "Comparison of asking once and giving up versus refining an answer through follow-up messages in the same thread",
    paragraph:
      "The first response you get is a draft, not a verdict. Asking once, getting something generic, and concluding \"it doesn't work for me\" judges the model on its least-informed guess. Instead, keep refining in the same thread — \"I'm a beginner, only have 3 days a week\" — and each reply narrows the gap between what it produced and what you actually need.",
  },
  {
    src: "/slides/week-1/13-best-practice-break-into-steps.svg",
    alt: "Comparison of asking for an entire business plan at once versus building it section by section",
    paragraph:
      "A single giant request forces the model to spread its attention across every part of the task at once, so each section gets only a shallow pass. Breaking the same ask into steps — outline first, then draft one section in detail, then critique it — gives each piece full attention and lets you course-correct before moving to the next.",
  },
  {
    src: "/slides/week-1/14-pitfall-leading-questions.svg",
    alt: "Comparison of a leading question that assumes an answer versus a neutral question with explicit comparison criteria",
    paragraph:
      "Asking \"isn't option A clearly better than option B?\" already picks a winner, and the model tends to agree with the premise it was handed rather than evaluating it independently. A neutral version — \"compare A and B on cost, speed, and risk, then tell me which is better and why\" — forces a real comparison instead of reflecting your own opinion back at you with extra confidence.",
  },
  {
    src: "/slides/week-1/15-pitfall-blind-copy-paste.svg",
    alt: "Comparison of pasting AI-generated output straight into production versus reviewing and testing it first",
    paragraph:
      "Copying generated code or text straight into production without reading it skips the one step that catches mistakes before they matter. Treating the output as a first draft — reading it, running it against real inputs, checking the tone — means you still move fast, but errors get caught on your screen instead of in front of a user or client.",
  },
  {
    src: "/slides/week-1/16-pitfall-unstructured-prompt.svg",
    alt: "Comparison of a rambling unstructured prompt versus one broken into labeled context, task, constraint, and format sections",
    paragraph:
      "Dumping every detail into one rambling paragraph buries the actual ask — the model may latch onto the wrong thread and miss a hard constraint like a word limit. Labeling the same information as Context, Task, Constraint, and Format makes every requirement visible instead of implied, so nothing competes for attention and the first draft actually hits the brief.",
  },
  {
    src: "/slides/week-1/17-recap-and-exercise.svg",
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
