import Link from "next/link";
import type { CSSProperties } from "react";

const h2Style: CSSProperties = { color: "#ffffff", fontSize: "1.4rem", margin: "2.5rem 0 1rem" };
const h3Style: CSSProperties = { color: "#ffffff", fontSize: "1.1rem", margin: "1.5rem 0 0.75rem" };
const pStyle: CSSProperties = { marginBottom: "1.25rem" };
const listStyle: CSSProperties = { marginBottom: "1.25rem", paddingLeft: "1.5rem", lineHeight: 1.8 };
const codeStyle: CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #33335a",
  borderRadius: 8,
  padding: "1rem",
  overflowX: "auto",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  marginBottom: "1.25rem",
};
const noteStyle: CSSProperties = {
  background: "#2a2a4a",
  border: "1px solid #44447a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.25rem",
};
const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "1.5rem",
  fontSize: "0.9rem",
};
const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.5rem 0.7rem",
  borderBottom: "2px solid #44447a",
  color: "#ffffff",
};
const tdStyle: CSSProperties = {
  padding: "0.5rem 0.7rem",
  borderBottom: "1px solid #33335a",
  verticalAlign: "top",
};

export default function OpenWebUiClassWorkbook() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-17</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
        45-Minute Class Workbook: Open WebUI Configuration
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A run-of-show for a 45-minute in-class session built from two existing docs:{" "}
          <Link href="/docs/open-webui-admin-guide" style={{ color: "#a0a0ff" }}>
            20 Things to Administer in Open WebUI
          </Link>{" "}
          and{" "}
          <Link href="/docs/mcp-and-tools-open-webui" style={{ color: "#a0a0ff" }}>
            Tool Calling &amp; MCP in Open WebUI
          </Link>
          . Each segment follows the same pattern: <strong>talk for ~2 minutes</strong> about one
          configuration, <strong>make the change live</strong>, then <strong>show the changed
          behavior</strong> with a real prompt. Students follow along on their own account on the
          shared instance, except where noted as instructor-only.
        </p>
        <div style={noteStyle}>
          <strong>Not included yet:</strong> Part B of the MCP doc (the <code>mcpo</code> bridge) is
          left out of this run — it wasn&apos;t reliably working at time of writing. Once it&apos;s
          verified working end-to-end, it slots in as an extra ~8-minute segment before the wrap
          (see the note at the bottom).
        </div>

        <h2 style={h2Style}>Before class: prep checklist</h2>
        <ul style={listStyle}>
          <li>Open WebUI is running and every student can reach it on the local network, with their own account approved.</li>
          <li>The base model used in the demo is loaded and selectable by everyone.</li>
          <li>You (the admin) have Admin Panel access for the Code Execution toggle in segment 3 — that one step is instructor-only, everyone else just watches their own screen for the effect.</li>
          <li>Have the Weather Lookup tool code (segment 4, below) ready to paste — either pre-type it into a shared note/chat so students can copy it, or project your screen while everyone pastes along.</li>
          <li>Prepare a short text file with 2–3 facts a base model can&apos;t know (e.g. this bootcamp&apos;s actual schedule) for the Knowledge/RAG segment — save it as <code>bootcamp-facts.txt</code> so it&apos;s ready to upload.</li>
        </ul>

        <h2 style={h2Style}>Run of show</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Segment</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={tdStyle}>0–4</td><td style={tdStyle}>Intro — the three-tier mental model</td></tr>
              <tr><td style={tdStyle}>4–9</td><td style={tdStyle}>1. System Prompt</td></tr>
              <tr><td style={tdStyle}>9–14</td><td style={tdStyle}>2. Temperature</td></tr>
              <tr><td style={tdStyle}>14–19</td><td style={tdStyle}>3. Code Execution (Pyodide) — instructor-only toggle</td></tr>
              <tr><td style={tdStyle}>19–26</td><td style={tdStyle}>4. Native Tool — Weather Lookup</td></tr>
              <tr><td style={tdStyle}>26–34</td><td style={tdStyle}>5. Workspace Model preset</td></tr>
              <tr><td style={tdStyle}>34–42</td><td style={tdStyle}>6. Workspace Knowledge (RAG)</td></tr>
              <tr><td style={tdStyle}>42–45</td><td style={tdStyle}>Wrap-up</td></tr>
            </tbody>
          </table>
        </div>

        <h2 style={h2Style}>Intro (0–4 min)</h2>
        <p style={pStyle}>
          Draw three boxes: <strong>Controls Panel</strong> (per-chat, resets when you start a new
          chat), <strong>Workspace</strong> (per-preset, saved and reusable, shareable with others),{" "}
          <strong>Admin Panel / Settings</strong> (instance-wide, admin-only, affects every user).
          Everything today is one example from each box, in increasing scope.
        </p>

        <h2 style={h2Style}>1. System Prompt <span style={{ color: "#8888aa", fontWeight: 400, fontSize: "1rem" }}>(4–9 min)</span></h2>
        <p style={pStyle}><strong>Talk (2 min):</strong> the system prompt is a standing instruction prepended to every message in this chat — it lives in the Controls panel (sliders icon above the message box) and resets when a new chat starts, unless it&apos;s later saved into a Model preset (segment 5).</p>
        <p style={pStyle}><strong>Change:</strong></p>
        <ul style={listStyle}>
          <li>Start a new chat, ask <em>&quot;What&apos;s 2+2?&quot;</em> — note the plain answer.</li>
          <li>Open the Controls panel → System Prompt → enter: <code>You only reply in pirate slang.</code></li>
        </ul>
        <p style={pStyle}><strong>Show the changed behavior:</strong> ask the exact same question again — the answer comes back in pirate slang. Same model, same question, different behavior purely from the system prompt.</p>

        <h2 style={h2Style}>2. Temperature <span style={{ color: "#8888aa", fontWeight: 400, fontSize: "1rem" }}>(9–14 min)</span></h2>
        <p style={pStyle}><strong>Talk (2 min):</strong> temperature controls sampling randomness — 0 is (near-)deterministic, higher values widen the range of next-token choices. It&apos;s one of the Advanced Params in the same Controls panel.</p>
        <p style={pStyle}><strong>Change:</strong></p>
        <ul style={listStyle}>
          <li>Controls panel → Advanced Params → Temperature → set to <code>0</code>.</li>
          <li>Ask <em>&quot;Give me one word that describes the ocean.&quot;</em> twice in two separate messages — note the answers are the same or nearly so.</li>
          <li>Set Temperature to <code>1.5</code>.</li>
        </ul>
        <p style={pStyle}><strong>Show the changed behavior:</strong> ask the same question twice more — the two answers now differ noticeably. Same prompt, same model, only the sampling parameter changed.</p>

        <h2 style={h2Style}>3. Code Execution / Pyodide <span style={{ color: "#8888aa", fontWeight: 400, fontSize: "1rem" }}>(14–19 min, instructor-only)</span></h2>
        <p style={pStyle}><strong>Talk (2 min):</strong> the &quot;Run&quot; button on Python code blocks in chat executes via Pyodide — a full CPython interpreter compiled to WebAssembly that runs entirely client-side in the browser tab. No local Python install, no subprocess, no server call — which is also why it&apos;s sandboxed with no real filesystem or network access. This toggle is instance-wide, so only an admin changes it, but every student watches it disappear on their own screen live.</p>
        <p style={pStyle}><strong>Change (instructor):</strong> Admin Panel → Settings → Code Execution → toggle off. Save.</p>
        <p style={pStyle}><strong>Show the changed behavior:</strong> everyone asks their model for a short Python snippet (e.g. <em>&quot;Write Python to print the first 5 Fibonacci numbers&quot;</em>) — the code block still renders, but the &quot;Run&quot; button is gone. Toggle it back on afterward and confirm it reappears — leave it <strong>on</strong> before moving to the next segment.</p>

        <h2 style={h2Style}>4. Native Tool — Weather Lookup <span style={{ color: "#8888aa", fontWeight: 400, fontSize: "1rem" }}>(19–26 min)</span></h2>
        <p style={pStyle}><strong>Talk (2 min):</strong> Open WebUI lets you paste a Python function straight into the admin UI and hand it to a model as a callable tool — no extra process, no external server. This is the &quot;native&quot; half of the tool-calling story (the other half, real MCP servers via <code>mcpo</code>, comes in a later session).</p>
        <p style={pStyle}><strong>Change:</strong> Workspace → Tools → + Create new tool, paste:</p>
        <pre style={codeStyle}><code>{`"""
title: Weather Lookup
description: Get current weather for a city using Open-Meteo (no API key needed)
"""
import requests

class Tools:
    def get_weather(self, city: str) -> str:
        """
        Get current weather for a city.
        :param city: Name of the city, e.g. "Bangalore"
        """
        geo = requests.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": city, "count": 1},
        ).json()
        if not geo.get("results"):
            return f"Could not find city: {city}"
        lat, lon = geo["results"][0]["latitude"], geo["results"][0]["longitude"]
        weather = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={"latitude": lat, "longitude": lon, "current_weather": True},
        ).json()
        temp = weather["current_weather"]["temperature"]
        return f"Current temperature in {city}: {temp}°C"`}</code></pre>
        <p style={pStyle}>Save it, then in a new chat click the tools icon (wrench/plug above the message box) and toggle <strong>Weather Lookup</strong> on.</p>
        <p style={pStyle}><strong>Show the changed behavior:</strong> ask <em>&quot;What&apos;s the weather in Bangalore right now?&quot;</em> — the reply cites a real current temperature, proof it called the function instead of guessing. Toggle the tool back off and ask again to contrast with a plain (possibly wrong or refused) guess.</p>

        <h2 style={h2Style}>5. Workspace Model preset <span style={{ color: "#8888aa", fontWeight: 400, fontSize: "1rem" }}>(26–34 min)</span></h2>
        <p style={pStyle}><strong>Talk (2 min):</strong> repeating segments 1, 2, and 4 by hand every single chat doesn&apos;t scale. A Workspace <strong>Model</strong> bundles a system prompt, Advanced Params, and enabled Tools into one saved, reusable preset that shows up in the model picker like any other model.</p>
        <p style={pStyle}><strong>Change:</strong></p>
        <ul style={listStyle}>
          <li>Workspace → Models → + New Model.</li>
          <li>Name it <code>Weather Bot</code>, pick the same base model used so far.</li>
          <li>System Prompt: <code>You are a helpful weather assistant. Keep answers to one sentence.</code></li>
          <li>Advanced Params → Temperature: <code>0.3</code>.</li>
          <li>Tools section → check <strong>Weather Lookup</strong>.</li>
          <li>Save.</li>
        </ul>
        <p style={pStyle}><strong>Show the changed behavior:</strong> start a brand-new chat, pick <strong>Weather Bot</strong> from the model dropdown, ask <em>&quot;What&apos;s the weather in Bangalore?&quot;</em> — no manual system prompt, no manual temperature change, no manually toggling the tool on. All three ride along with the preset automatically.</p>

        <h2 style={h2Style}>6. Workspace Knowledge (RAG) <span style={{ color: "#8888aa", fontWeight: 400, fontSize: "1rem" }}>(34–42 min)</span></h2>
        <p style={pStyle}><strong>Talk (2 min):</strong> Knowledge collections chunk and embed uploaded documents so a model can retrieve from them mid-chat — this is retrieval-augmented generation (RAG), and it&apos;s how you give a model facts it was never trained on, like your own bootcamp&apos;s schedule.</p>
        <p style={pStyle}><strong>Change:</strong></p>
        <ul style={listStyle}>
          <li>Ask the base model directly: <em>&quot;When does the SaturdAI bootcamp meet, and who teaches it?&quot;</em> — it will guess or admit it doesn&apos;t know.</li>
          <li>Workspace → Knowledge → + New Knowledge → upload <code>bootcamp-facts.txt</code> (prepared before class).</li>
          <li>Workspace → Models → edit <strong>Weather Bot</strong> (or a new preset) → Prompts / Knowledge section → attach the new Knowledge collection → Save.</li>
        </ul>
        <p style={pStyle}><strong>Show the changed behavior:</strong> in a chat using that preset, ask the same question again — the model now answers correctly from the uploaded facts, and cites the source document if citations are enabled.</p>

        <h2 style={h2Style}>Wrap-up (42–45 min)</h2>
        <p style={pStyle}>
          Re-draw the three boxes from the intro and slot today&apos;s six changes into them: Controls
          panel (System Prompt, Temperature), Workspace (Weather Lookup Tool, Model preset,
          Knowledge), Admin Panel (Code Execution). Point at the{" "}
          <Link href="/docs/mcp-and-tools-open-webui" style={{ color: "#a0a0ff" }}>
            Tool Calling &amp; MCP doc
          </Link>{" "}
          for Part B — real MCP servers via <code>mcpo</code> — as the natural next session once
          that bridge is verified working.
        </p>

        <h3 style={h3Style}>Adding the MCP/mcpo segment later</h3>
        <p style={pStyle}>
          Once <code>mcpo</code> is confirmed working end-to-end (see the gotchas in the MCP doc&apos;s
          Part B), insert it as a segment 7 between Knowledge and the wrap: talk for 2 minutes on
          &quot;real MCP vs native tools,&quot; register the Tool Server URL in Admin Panel →
          Settings → Integrations, then ask <em>&quot;What time is it in Tokyo?&quot;</em> to show a
          genuine MCP call. Budget ~8 minutes and shift the wrap to 42–50, or trim segment 3
          (Code Execution) to save 3–4 minutes elsewhere.
        </p>
      </div>
    </main>
  );
}
