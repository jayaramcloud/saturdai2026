import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";
import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/hermes-day-6/01-recap-and-goal.svg",
    alt: "Two panels comparing Day 5's single MCP tool call against today's goal of chaining many tool calls into a loop",
    paragraph:
      "Day 5 gave Hermes a single tool and a single call — register an MCP server, ask one question, get one grounded answer. Today's goal is to chain that same building block: give Hermes a task that takes more than one tool call, and watch it decide on its own when another call is needed and when the task is actually finished.",
  },
  {
    src: "/slides/hermes-day-6/02-call-vs-loop.svg",
    alt: "Side by side comparison of a single tool call (ask, call tool, answer) against an agent loop (ask, call tool, observe result, decide, repeat or stop)",
    paragraph:
      "A single tool call is three steps and done — fine for a quick lookup like the current time. An agent loop is the same call/observe pattern, but with a decision point after each result: does Hermes have enough to answer, or does it need to loop back and call another tool first? That decision point is what turns a one-shot tool call into a real agent loop.",
  },
  {
    src: "/slides/hermes-day-6/03-the-loop-cycle.svg",
    alt: "Circular four-step diagram: call tool, observe result, decide next step, repeat or stop, arranged around a center",
    paragraph:
      "Every agent loop, no matter how many tools it touches, is the same four-step cycle repeating: call a tool, observe what came back, decide whether that's enough or another step is needed, and either repeat from step one or stop with a final answer. The loop isn't open-ended — step three is exactly where Hermes chooses to stop.",
  },
  {
    src: "/slides/hermes-day-6/04-yolo-flag.svg",
    alt: "Comparison of running with --yolo, which skips the confirmation pause between tool calls, against running without it, which pauses before every call",
    paragraph:
      "Without --yolo, Hermes pauses before every single tool call and waits for you to approve it — safe, but slow once a task needs several chained calls. With --yolo, every step of the loop runs straight through with no pause at all. That's convenient for a lab exercise in a sandbox, but it's a deliberate choice: reach for it with trusted, low-stakes side effects like writing to /tmp, not with anything that has real-world consequences.",
  },
  {
    src: "/slides/hermes-day-6/05-worked-example-file-loop.svg",
    alt: "Two chained tool calls — write_file then read_file — flowing to a final answer stating the file's contents",
    paragraph:
      "The write-then-read lab is the simplest real loop: Hermes calls write_file to create /tmp/hermes-demo.txt, sees that call succeed, decides on its own that reading the file back is the natural next step, calls read_file, and only then answers with what the file actually contains — two separate tool calls chained together with no human in between.",
  },
  {
    src: "/slides/hermes-day-6/06-worked-example-code-execution.svg",
    alt: "Four-step pipeline: write Python code, run it, read the real output, use that output in the final answer, with actual Fibonacci and prime number results shown",
    paragraph:
      "The Fibonacci-and-primes lab forces Hermes to compute an answer instead of recalling one: it writes a short Python snippet, actually runs it through the code_execution tool, reads back the real stdout, and states those real numbers in its answer. Ask an LLM to do arithmetic from memory and it can be confidently wrong — code execution turns 'probably right' into a number that was actually computed.",
  },
  {
    src: "/slides/hermes-day-6/07-worked-example-delegation.svg",
    alt: "Main Hermes agent delegating a haiku-writing task to a subagent with fresh context, which returns the finished haiku back to the main agent",
    paragraph:
      "Delegation is a tool call that spawns another agent instead of a function: the main Hermes agent decides the haiku task is separable, hands it to a subagent running with a completely fresh context, and that subagent's draft attempts and scratch work never clutter the main conversation — only the finished result comes back. The same pattern scales to real work: researching a sub-question or drafting a file as a delegated call.",
  },
  {
    src: "/slides/hermes-day-6/08-when-loops-go-wrong.svg",
    alt: "Two failure modes side by side: an infinite loop repeating the same failing tool call, and a confidently wrong answer built on a misread intermediate result",
    paragraph:
      "Two failure modes are worth watching for once calls chain together. The infinite loop repeats the same call with the same arguments over and over, never making progress — a search that keeps returning nothing. The quieter failure is a tool call that technically succeeds but on the wrong input, like reading a stale file, with Hermes confidently building its final answer on that wrong intermediate step. Both look identical from the final answer alone.",
  },
  {
    src: "/slides/hermes-day-6/09-debugging-the-loop.svg",
    alt: "A mock trace log showing a sequence of tool calls, including a repeated failing search call, with a final answer produced anyway despite the failure",
    paragraph:
      "The only reliable way to catch either failure mode is to read the trace — the actual sequence of tool calls and their results — not just the final answer. A trace showing the same failing call repeated twice, followed by a final answer anyway, reveals a problem the polished final response would never show on its own.",
  },
  {
    src: "/slides/hermes-day-6/10-recap-and-preview.svg",
    alt: "Five-point recap of today's agent loop lessons next to a preview panel for Day 7: deploying a production Hermes agent",
    paragraph:
      "Today's loop: an agent loop repeats call, observe, decide until Hermes stops on its own; --yolo skips the confirmation pause and should be used deliberately; file and code-execution loops both showed real chained tool calls; delegation keeps sub-task scratch work out of the main context; and loops fail quietly, so the trace matters more than the final answer. Day 7 is the capstone — packaging everything from Days 2 through 6 into one Hermes agent that keeps running on its own, 24x7.",
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

export default function HermesAgentDay6() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 6 · Wed, Oct 7, 2026
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Tool Calling &amp; Agent Loops
      </h1>

      <Slideshow slides={SLIDES} />

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          Calling one tool once is easy. An <strong>agent loop</strong> is what happens when Hermes calls a
          tool, reads the result, decides it needs another tool (or the same one again) to finish the job,
          and keeps going until the task is actually done — code execution, file I/O, and delegating
          sub-tasks all included.
        </p>

        <h2 style={h2Style}>Objectives</h2>
        <ul style={listStyle}>
          <li>Distinguish a single tool call from a multi-step agent loop</li>
          <li>Use <code>--yolo</code> deliberately and understand what it skips (confirmation prompts)</li>
          <li>Run a task that requires Hermes to write, execute, and act on code output in one loop</li>
          <li>Delegate a sub-task to a subagent and inspect what comes back</li>
        </ul>

        <h2 style={h2Style}>Lab: a real multi-step agent loop</h2>
        <p style={pStyle}>
          Give Hermes a task that requires writing a file, then reading it back — two tool calls chained
          into one loop:
        </p>
        <CodeBlock code={`$ hermes -z "Create a file at /tmp/hermes-demo.txt containing some text, then read it back and show me the contents." --cli --yolo`} />
        <p style={pStyle}>
          Then push further with code execution as the tool, which forces Hermes to actually run something
          rather than just narrate an answer:
        </p>
        <CodeBlock code={`$ hermes -z "Use Python code execution to compute the 25th Fibonacci number and the first 10 prime numbers. Show your work." --cli --yolo`} />
        <p style={pStyle}>Finally, delegate a sub-task to a subagent and inspect what it returns:</p>
        <CodeBlock code={`$ hermes -z "Delegate a subagent to write a haiku about local LLMs, then show me what the subagent returned." --cli --yolo`} />

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Oct 7, 2026 — real
            output from each step, and any loop that didn&apos;t behave as expected.
          </p>
        </div>
      </div>
    </main>
  );
}
