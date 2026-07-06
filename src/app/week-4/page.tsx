import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/week-4/01-what-is-tool-calling.svg",
    alt: "Comparison of an LLM producing text only versus an LLM that can call a tool and get a real result back",
    paragraph:
      "Up to this point, an LLM's only output has been text — even when asked for today's weather or a calculation, it can only produce its best guess in words. Tool calling changes that: the model can decide to call a real function with structured arguments, wait for an actual result to come back, and then use that genuine result to answer you, instead of quietly hallucinating a plausible-sounding one.",
  },
  {
    src: "/slides/week-4/02-tool-calling-loop.svg",
    alt: "Diagram of the tool-calling loop: user asks, model decides and picks a tool, code executes it, result returns, model answers",
    paragraph:
      "Every tool call follows the same five-step cycle: the user asks a question, the model decides a tool is needed and fills in its arguments, your own code executes that tool, the result is handed back to the model, and only then does the model produce its final answer. Crucially, the model never runs anything itself — it only ever describes the call in text, and your code stays fully in control of what actually executes.",
  },
  {
    src: "/slides/week-4/03-defining-a-tool-schema.svg",
    alt: "Annotated get_weather tool definition broken into name, description, parameters, and required fields",
    paragraph:
      "A tool definition is deliberately simple: a name like get_weather, a plain-language description telling the model what it does and when to use it, and a parameters schema specifying what arguments it needs and their types, such as a required location string and an optional unit field. The model never sees your actual implementation code — this description is the entire interface it reasons about.",
  },
  {
    src: "/slides/week-4/04-multi-step-agents.svg",
    alt: "Roadmap of three chained tool calls: flight status, weather, and email summary",
    paragraph:
      "A single request can require more than one tool call chained together — for example, checking a flight's status, then looking up the weather at the destination, then drafting a summary email, with each step's result feeding into the next decision. The model can keep calling tools in sequence, reasoning about each new result, until it has everything it needs to give you a complete answer.",
  },
  {
    src: "/slides/week-4/05-error-handling-and-retries.svg",
    alt: "Flow of a failed tool call returning an error to the model, plus common causes and graceful recovery options",
    paragraph:
      "Tool calls fail for ordinary reasons — a bad argument, a timed-out API, a service that's simply down — and none of that has to break the conversation. Instead, the error gets returned to the model just like a normal result would be, and the model can decide what to do next: retry with corrected arguments, ask you a clarifying question, or fall back to a different approach entirely.",
  },
  {
    src: "/slides/week-4/06-agents-vs-tool-calling.svg",
    alt: "Comparison table of a single tool call versus an agent loop",
    paragraph:
      "A single tool call is a one-shot request and response: you ask, one tool runs, you get an answer. An agent is built from the exact same mechanism, just allowed to keep going — it can plan across multiple steps, call several tools in sequence, check its own progress against the goal, and decide for itself when the task is actually finished.",
  },
  {
    src: "/slides/week-4/07-real-world-example.svg",
    alt: "Flowchart of checking the weather for a hike and deciding whether to book a calendar event",
    paragraph:
      "Picture an agent with two tools and one goal: check the weather for a hiking trip this weekend, and if conditions look good, book it on the calendar. The model calls the weather tool first, reasons about the actual result it gets back, and only then decides whether calling the calendar tool makes sense — or whether to suggest an alternate day instead.",
  },
  {
    src: "/slides/week-4/08-safety-and-human-in-the-loop.svg",
    alt: "Flow showing execution pausing for human confirmation before a sensitive tool runs, with a list of risky actions",
    paragraph:
      "Not every tool call should run automatically. For actions that are risky or hard to undo — sending an email, spending money, deleting a file — the safe default is to pause the loop and require a human to explicitly confirm before the tool actually executes, rather than letting the agent act unsupervised the same way it does for harmless, read-only lookups.",
  },
  {
    src: "/slides/week-4/09-limitations.svg",
    alt: "Three limitations: hallucinated tool calls, wrong arguments, and cost and latency, each with a guard",
    paragraph:
      "Tool calling has real limitations worth watching for: a model can hallucinate a tool call to something that doesn't exist, it can call the right tool with subtly wrong arguments, and every round-trip to a tool adds real latency and cost that compounds across a multi-step agent. None of these are reasons to avoid tool calling — they're reasons to validate arguments before executing and keep an eye on how many calls a task actually needs.",
  },
  {
    src: "/slides/week-4/10-recap-and-exercise.svg",
    alt: "Recap of five key takeaways from Week 4 plus a three-step live exercise",
    paragraph:
      "To recap: tool calling lets a model act on real results instead of guessing, following the same ask → decide → execute → return → answer loop whether it's one call or a full agent, with human confirmation as the safe default for risky actions. Your exercise: write a plain-language description of a simple tool like get_time or roll_dice, have an assistant that supports tools use it, then deliberately give it a bad or ambiguous request and watch how it handles the failure.",
  },
];

export default function Week4Page() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 2rem", textAlign: "center" }}>
      <h1
        className="section-title"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.4rem" }}
      >
        <span style={{ fontSize: "2.2rem" }}>🛠️</span> Week 4: Tool Calling
      </h1>
      <p className="description" style={{ margin: "0 auto 1.25rem", maxWidth: 700 }}>
        Making AI agents do real work — function calling, tool use, and building agents that
        take actions instead of just producing text.
      </p>

      <Slideshow slides={SLIDES} />
    </main>
  );
}
