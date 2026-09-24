import Link from "next/link";
import type { CSSProperties } from "react";
import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/hermes-day-1/01-welcome-roadmap.svg",
    alt: "Course title with a timeline of all 7 sessions across two weeks, dates and titles, Day 1 marked as you are here",
    paragraph:
      "Welcome to Agentic AI with Hermes Agent — a free, live, hands-on 2-week intensive running Monday, Wednesday, and Friday evenings from Friday, September 25 through Friday, October 9, 2026. Seven sessions in total, no prerequisites, just curiosity. By the end you'll have deployed a working Hermes agent of your own — a digital agent that keeps working and learning for you 24x7, built one session at a time across fundamentals, LLM routing, RAG, MCPs, tool calling, and a final production deployment.",
  },
  {
    src: "/slides/hermes-day-1/02-what-is-an-llm.svg",
    alt: "Condensed nested diagram of AI, Machine Learning, Deep Learning, Generative AI, and LLMs, with a side panel on what an LLM does and doesn't do",
    paragraph:
      "A Large Language Model is a small, specific slice of a much bigger picture — one layer down from Generative AI, which itself sits inside Deep Learning, Machine Learning, and AI more broadly. In one sentence, an LLM predicts the next most-likely word over and over to generate fluent text. On its own, it can't browse the web, run code, remember past sessions, or take real actions — which is exactly the gap an agent like Hermes is built to close.",
  },
  {
    src: "/slides/hermes-day-1/03-chatbot-vs-agent.svg",
    alt: "Side by side comparison: a chatbot's single question and answer turn versus an agent's perceive, decide, act, observe loop",
    paragraph:
      "A chatbot is a single turn: you ask, it replies, the loop ends — it can't check its own answer, look anything up, or act on the world. An agent like Hermes is a loop instead: perceive the task, decide whether a tool is needed, act by actually calling that tool, observe the real result, and repeat until the task is genuinely done. That loop — not the chat window — is what this entire course is about.",
  },
  {
    src: "/slides/hermes-day-1/04-meet-hermes-agent.svg",
    alt: "Hermes Agent in the center branching to a cloud endpoint on the left and a highlighted local endpoint on the right",
    paragraph:
      "Hermes Agent is Nous Research's CLI coding and agent assistant, and its defining trait is that it doesn't care which model answers — only that the endpoint speaks the same OpenAI-compatible protocol. That means the exact same commands work whether Hermes is pointed at a hosted cloud provider requiring an API key, or at a local llama-server instance running on our own DGX Spark or Mac Mini. For this course, we'll be using our own hardware — no API key required.",
  },
  {
    src: "/slides/hermes-day-1/05-hardware-dgx-spark.svg",
    alt: "DGX Spark spec cards showing 128GB memory, 6144 CUDA cores, 1 petaflop FP4 compute, and 200 billion max parameters",
    paragraph:
      "Three months ago, following Sanjay Jayaram's vision, we purchased a DGX Spark Supercomputer with a Blackwell GPU and powered it on here in Calgary. It's built around the NVIDIA GB10 Grace Superchip: 128 GB of unified memory, 6,144 CUDA cores, and 1 petaflop of FP4 compute — enough to run a single 200-billion-parameter model, or several 30-billion-parameter LLMs side by side, which is exactly what we'll put to use on Day 3 when we cover LLM routing.",
  },
  {
    src: "/slides/hermes-day-1/06-hardware-mac-mini.svg",
    alt: "The DGX Spark and an Apple Mac Mini compared side by side, each labeled with what it's best suited for during the course",
    paragraph:
      "Alongside the DGX Spark, Sanjay picked up a powerful Apple Mac Mini for local AI research after interning at Apple in Cupertino. The DGX Spark is our workhorse for bigger models, multi-model routing, and the final Day 7 deployment; the Mac Mini gives us a quiet, always-on, Apple Silicon target — a second real machine to point Hermes Agent at, not just a demo. Two different machines, one lesson: Hermes doesn't care which one answers.",
  },
  {
    src: "/slides/hermes-day-1/07-course-pipeline.svg",
    alt: "Days 2 through 7 shown as a left to right pipeline, each stage building directly on the previous one",
    paragraph:
      "The remaining six sessions aren't stand-alone topics — they're a pipeline. Day 2 gets Hermes talking to one local model; Day 3 extends that to routing across several models at once; Day 4 grounds those models in real documents with RAG; Day 5 connects Hermes to outside systems over MCP; Day 6 chains those tool calls into real multi-step agent loops; and Day 7 packages everything built across Days 2 through 6 into one Hermes agent that keeps running on its own.",
  },
  {
    src: "/slides/hermes-day-1/08-agentic-example.svg",
    alt: "One task — check the time in Tokyo and save a reminder — broken into four labeled agent steps: reason, call a tool, compute, act again",
    paragraph:
      "Take one concrete task: \"Check the time in Tokyo, then save a note reminding me to message the team at 9am their time.\" An agent reasons that it needs the real current time before it can compute anything, calls the MCP time server to get that real answer (Day 5 territory), uses that grounded result to compute the equivalent local time, and then takes a second real action by writing the reminder to a file (the chaining behavior from Day 6). A plain chatbot, by contrast, could only have replied that it didn't know the current time in Tokyo.",
  },
  {
    src: "/slides/hermes-day-1/09-logistics.svg",
    alt: "Four cards covering schedule, time zones, cost and access, and sign-up information for the course",
    paragraph:
      "The essentials: sessions run Monday, Wednesday, and Friday from 6:00 to 7:00 PM MST, seven sessions total from Friday, September 25 through Friday, October 9, 2026 — that's 5:00 PM PST, 7:00 PM EST, or 7:30 AM IST the next day. Day 1 is talk-only; hands-on labs run every session from Day 2 onward. The course is completely free and open to everyone, with remote access to the DGX Spark shared with everyone attending. Sign up or ask questions at saturdai.com or by emailing jayaram.linux@gmail.com.",
  },
  {
    src: "/slides/hermes-day-1/10-get-ready-day-2.svg",
    alt: "A five item checklist to prepare for Day 2, followed by a closing call to action",
    paragraph:
      "Before Day 2 on Monday, September 28: install Hermes Agent on your own machine if you can, have a terminal ready (macOS, Linux, or WSL on Windows), and bookmark saturdai.com/hermes-agent for the full lab notes. If the install fails, bring the exact error — we'll debug it live. And if you haven't installed anything yet, that's fine too; we'll do it together on Day 2. Hands-on, real infrastructure, real agents — see you Monday.",
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

export default function HermesAgentDay1() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/hermes-agent" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← Agentic AI with Hermes Agent
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>
        Day 1 · Fri, Sep 25, 2026 · Talk — no lab
      </p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Intro to LLMs and Hermes
      </h1>

      <Slideshow slides={SLIDES} />

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A talk-only kickoff session — no hands-on lab today. Before anyone touches a terminal, we&apos;ll
          cover what a large language model actually is, why <strong>Hermes Agent</strong> (Nous
          Research&apos;s CLI coding/agent assistant) is the tool we&apos;re building around for this
          course, and what &quot;agentic AI&quot; means in practice versus just chatting with a model.
        </p>

        <h2 style={h2Style}>What we&apos;ll cover</h2>
        <ul style={listStyle}>
          <li>The big picture: what an LLM is, and what makes an <em>agent</em> different from a chatbot</li>
          <li>Why Hermes Agent is provider-agnostic — it talks to any OpenAI-compatible endpoint, local or cloud</li>
          <li>A first look at the hardware we&apos;ll be running on: the DGX Spark and Sanjay&apos;s Mac Mini</li>
          <li>A preview of the 7-session arc: fundamentals → routing → RAG → MCPs → tool calling → deployment</li>
          <li>Course logistics: schedule, time zones, and how to get set up before Day 2</li>
        </ul>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Get ready for Day 2:</strong> hands-on labs start Monday, Sep 28, with Hermes
            Fundamentals. Come to that session with Hermes Agent already installed if possible.
          </p>
        </div>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Session notes:</strong> to be filled in after the live session on Sep 25, 2026.
          </p>
        </div>
      </div>
    </main>
  );
}
