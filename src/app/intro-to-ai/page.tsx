import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/intro-to-ai/01-big-picture.svg",
    alt: "Numbered diagram running left to right in ascending order of AI involvement: Not Using AI Yet (0), People with a Personal Life card (1), Enterprises Building With AI containing two fully-contained cards for Professional Life (2) and Building AI for Companies (3), and AI Builders (4, with a researcher icon)",
    paragraph:
      "AI has a handful of very different players, numbered here from the ground up. Zero is the people and organizations not using AI at all yet — standing outside the whole picture, with the gap only growing from here. One is personal life: most people just use AI to learn and grow day to day. Two and three both live inside the enterprise: using AI to be a 5x engineer at your job, or going further and building AI systems for other companies from the inside. And four is the small number of labs — OpenAI, Anthropic, Gemini, DeepSeek — doing the PhD-level research behind the models everyone else builds on, training foundation models from scratch with massive infrastructure. The car analogy captures it well: builders design the engine, enterprises assemble the car, and most of us just need to know how to drive.",
  },
  {
    src: "/slides/intro-to-ai/02-real-risk.svg",
    alt: "Two side-by-side panels compared head to head: on the left, an engineer with no AI producing a short 1x output bar; on the right, the same kind of engineer using AI producing a tall 5x output bar. A callout below reads that the real risk isn't the algorithm outpacing you, it's the colleague who uses it.",
    paragraph:
      "It's tempting to picture the threat to your job as the AI itself — a model that quietly gets good enough to replace you. That's not how it plays out day to day. The person who actually outpaces you is sitting at the next desk: same background, same skill level, but they've learned to delegate the boilerplate to AI, review and direct its output instead of typing every line themselves, and ship at several times the old pace. Two engineers with identical skills can produce wildly different amounts of value once one of them is working with AI as leverage and the other isn't. That gap compounds fast, and it's the gap that actually decides who's indispensable — not some abstract fear of the model itself.",
  },
  {
    src: "/slides/intro-to-ai/03-job-title-treadmill.svg",
    alt: "Five-panel timeline of job titles racing forward: 2024 Prompt Engineer at a desk, 2025 Vibe Coder describing outcomes, 2026 Agentic Engineer directing several agents, 2026.5 Loop Engineer running a self-improving agent loop, and 2027 Unemployed shown as a warning panel where the agents now manage each other.",
    paragraph:
      "This one is part joke, part warning, riffing on a meme that's been going around: in the space of about three years the job title goes from Prompt Engineer, to Vibe Coder, to Agentic Engineer directing a handful of agents at once, to Loop Engineer running a self-improving loop of agents — and then, if you stopped adapting anywhere along the way, unemployed, because the agents figured out how to manage each other. It's satire, but the underlying pace is not exaggerated much: the tools and the titles that go with them are reinventing themselves faster than most people update their resume. The lesson isn't to panic about any single tool going obsolete — it's that staying fluent in whatever comes next is the actual job now, not a side skill.",
  },
];

export default function IntroToAiPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 2rem", textAlign: "center" }}>
      <h1
        className="section-title"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.4rem" }}
      >
        <span style={{ fontSize: "2.2rem" }}>🌐</span> Intro to AI
      </h1>
      <p className="description" style={{ margin: "0 auto 1.25rem", maxWidth: 700 }}>
        The big picture and everyday use cases &#8212; where AI comes from, and where it shows up in your life.
      </p>

      <Slideshow slides={SLIDES} />
    </main>
  );
}
