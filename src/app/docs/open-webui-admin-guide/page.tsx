import Link from "next/link";
import type { CSSProperties } from "react";

const codeStyle: CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #33335a",
  borderRadius: 8,
  padding: "1rem",
  overflowX: "auto",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  marginBottom: "1.5rem",
};

const h2Style: CSSProperties = { color: "#ffffff", fontSize: "1.4rem", margin: "2rem 0 1rem" };
const h3Style: CSSProperties = { color: "#ffffff", fontSize: "1.1rem", margin: "1.5rem 0 0.75rem" };
const pStyle: CSSProperties = { marginBottom: "1.5rem" };
const noteStyle: CSSProperties = {
  background: "#2a2a4a",
  border: "1px solid #44447a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};
const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "1.5rem",
  fontSize: "0.9rem",
};
const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.6rem 0.8rem",
  borderBottom: "2px solid #44447a",
  color: "#ffffff",
};
const tdStyle: CSSProperties = {
  padding: "0.6rem 0.8rem",
  borderBottom: "1px solid #33335a",
  verticalAlign: "top",
};
const figureStyle: CSSProperties = { marginBottom: "1.5rem" };
const imgStyle: CSSProperties = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid #33335a",
  display: "block",
};
const captionStyle: CSSProperties = {
  color: "#8888aa",
  fontSize: "0.8rem",
  marginTop: "0.5rem",
  textAlign: "center",
};

type Row = { name: string; what: string; example: string };

function ParamTable({ rows }: { rows: Row[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Control</th>
            <th style={thStyle}>What it does</th>
            <th style={thStyle}>One-liner example</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td style={{ ...tdStyle, color: "#ffffff", whiteSpace: "nowrap" }}>
                <code>{r.name}</code>
              </td>
              <td style={tdStyle}>{r.what}</td>
              <td style={tdStyle}>{r.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OpenWebUiAdminGuide() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-16</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        20 Things You Can Do to Administer Open WebUI
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          Open WebUI has two separate control surfaces: the <strong>per-chat / per-model Controls
          panel</strong> (system prompt, advanced sampling params) and the <strong>global Settings /
          Admin Panel</strong> (users, connections, security, tools). This doc walks through 20
          concrete things you can configure across both, with a one-line example for each so you can
          tell at a glance what &quot;good&quot; looks like.
        </p>
        <div style={noteStyle}>
          <strong>Hierarchy to know first:</strong> Open WebUI resolves System Prompt and Advanced
          Params at three levels — <strong>per-chat</strong> (Controls panel, wins for this
          conversation only) → <strong>per-model</strong> (Workspace → Models → edit a model, becomes
          that model&apos;s default) → <strong>global default</strong> (Admin Panel → Settings →
          Models). The most specific level always wins.
        </div>
        <figure style={figureStyle}>
          <img src="/docs/open-webui-admin-guide/edit-model.png" alt="Editing a model in Admin Panel showing its own System Prompt and Advanced Params, one level up from per-chat Controls" style={imgStyle} />
          <figcaption style={captionStyle}>Editing a model (Admin Panel → Settings → Models → pencil icon) — its own System Prompt and Advanced Params sit one level above per-chat Controls.</figcaption>
        </figure>

        <h2 style={h2Style}>Part A: The Controls Panel (1–17) — per-chat model behavior</h2>
        <p style={pStyle}>
          Open the <strong>Controls</strong> panel from the icon to the right of the message box (or
          the sliders icon on the model name) to reach <strong>System Prompt</strong> and{" "}
          <strong>Advanced Params</strong>. Anything set here overrides the model&apos;s and the
          instance&apos;s defaults for the current chat only.
        </p>

        <h3 style={h3Style}>1. System Prompt</h3>
        <p style={pStyle}>
          Free-text instructions prepended to every message in this chat — persona, tone, constraints,
          output format. This is the single highest-leverage control in the whole panel.
        </p>
        <pre style={codeStyle}><code>You are a terse Python tutor. Always answer with a code block first, then a 2-sentence explanation. Never apologize.</code></pre>

        <h3 style={h3Style}>2–17. Advanced Params</h3>
        <p style={pStyle}>
          Everything below defaults to <strong>&quot;Default&quot;</strong>, meaning it falls through
          to the model/global setting. Toggle a row on to override it just for this chat.
        </p>
        <figure style={figureStyle}>
          <img src="/docs/open-webui-admin-guide/controls-panel.png" alt="Open WebUI Controls panel showing System Prompt and the full Advanced Params list" style={imgStyle} />
          <figcaption style={captionStyle}>The Controls panel — System Prompt at top, the full Advanced Params list below it, all defaulting to &quot;Default&quot; until overridden.</figcaption>
        </figure>
        <ParamTable
          rows={[
            {
              name: "Context Compaction Threshold",
              what: "Token count at which Open WebUI starts summarizing/trimming older turns to keep the conversation under the model's context window. Overriding it lower than the global max forces earlier compaction for this chat.",
              example: "8000 — start compacting well before a 32K-context model fills up",
            },
            {
              name: "Function Calling",
              what: "Whether the model is allowed to call enabled Tools natively, and whether tool selection is automatic or requires the user to pick tools manually per message.",
              example: "\"Native\" — let the model decide when to call a connected tool",
            },
            {
              name: "Reasoning Tags",
              what: "Which XML-style tags (e.g. <think>...</think>) the UI should parse out of the raw model output and render as a collapsible \"thinking\" block instead of visible chat text.",
              example: "think — hide DeepSeek-R1-style reasoning inside a collapsible section",
            },
            {
              name: "Seed",
              what: "Fixes the RNG seed for sampling so the same prompt + params reproduce the same output. Leave default/blank for natural variation between runs.",
              example: "42 — get the identical completion every time you re-run this prompt",
            },
            {
              name: "Stop Sequence",
              what: "One or more strings that immediately end generation the moment the model outputs them — useful for chat-format models that otherwise keep hallucinating extra turns.",
              example: "\\n\\nUser: — stop before the model starts writing your next message for you",
            },
            {
              name: "Temperature",
              what: "Overall randomness of token selection. Near 0 is deterministic and repetitive; near 1–2 is more creative but more error-prone.",
              example: "0.2 — near-deterministic answers for factual/coding tasks",
            },
            {
              name: "Reasoning Effort",
              what: "Passed through as reasoning_effort to providers that support it (e.g. OpenAI o-series); tells the model how much hidden chain-of-thought budget to spend. No effect on most local/Ollama models.",
              example: "\"high\" — for a hard multi-step math problem worth the extra latency",
            },
            {
              name: "logit_bias",
              what: "Per-token bias map that boosts or suppresses specific token IDs before sampling — the lowest-level way to ban or force particular words.",
              example: "{\"50256\": -100} — hard-ban a specific token from ever being generated",
            },
            {
              name: "max_tokens",
              what: "Hard cap on how many tokens the model may generate in its reply, regardless of how it's going.",
              example: "500 — cap a chatbot's replies to keep answers skimmable",
            },
            {
              name: "top_k",
              what: "Restricts sampling to only the K most probable next tokens at each step. Lower = safer/more conservative, higher = more varied.",
              example: "40 — a common conservative default for factual Q&A",
            },
            {
              name: "top_p",
              what: "Nucleus sampling: samples only from the smallest set of tokens whose cumulative probability reaches P. Most practitioners tune this instead of top_k.",
              example: "0.9 — keep the top 90% probability mass, drop the long tail",
            },
            {
              name: "min_p",
              what: "Discards any token whose probability is below min_p × (probability of the most likely token) — a relative floor instead of top_k's fixed count.",
              example: "0.05 — cut tokens under 5% of the top candidate's likelihood",
            },
            {
              name: "frequency_penalty",
              what: "Penalizes tokens proportionally to how many times they've already appeared in the output so far, discouraging repetition.",
              example: "0.4 — stop a model from repeating the same phrase every paragraph",
            },
            {
              name: "presence_penalty",
              what: "Flat penalty applied to any token that has appeared at all, encouraging the model to introduce new topics/words rather than repeat itself.",
              example: "0.6 — push a brainstorming chat toward more varied ideas",
            },
            {
              name: "mirostat",
              what: "Enables an alternative adaptive sampler (mode 1 or 2) that targets a constant \"surprise\" level instead of using top_k/top_p, often giving more consistent long-form output.",
              example: "2 — use Mirostat v2 for a long generated story instead of top_p",
            },
            {
              name: "mirostat_eta",
              what: "Learning rate for how fast Mirostat adjusts its sampling toward the target surprise (tau) as it generates — higher reacts faster, lower is smoother.",
              example: "0.1 — the standard learning rate most guides recommend",
            },
          ]}
        />
        <div style={noteStyle}>
          <strong>Rule of thumb:</strong> tune <code>top_p</code> or <code>min_p</code> before{" "}
          <code>top_k</code> — most practitioners find nucleus/min-p sampling more predictable, and
          mixing three samplers at once makes behavior hard to reason about.
        </div>

        <h2 style={h2Style}>Part B: Settings &amp; Admin Panel (18–20) — instance-wide controls</h2>
        <p style={pStyle}>
          Click your profile avatar (top-right) to reach two different menus:{" "}
          <strong>Settings</strong> (your personal preferences) and <strong>Admin Panel</strong>{" "}
          (visible only to admin accounts — controls the whole instance for every user).
        </p>
        <figure style={figureStyle}>
          <img src="/docs/open-webui-admin-guide/user-menu.png" alt="Open WebUI profile menu showing Settings, Admin Panel, Archived Chats, Workspace, Notes, Calendar, Automations, and Playground" style={imgStyle} />
          <figcaption style={captionStyle}>The profile menu (click your avatar) — Settings and Admin Panel at top, the sidebar-shortcut items below.</figcaption>
        </figure>

        <h3 style={h3Style}>18. Settings (personal, per-account)</h3>
        <p style={pStyle}>
          Your own preferences layered on top of whatever the admin has enabled instance-wide —
          changing these never affects other users.
        </p>
        <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.9 }}>
          <li><strong>Account</strong> — name, password, profile photo, and your personal API key/JWT token for scripting against the Open WebUI API.</li>
          <li><strong>General</strong> — default UI language, theme (light/dark/OLED), and notification sounds.</li>
          <li><strong>Interface</strong> — chat bubble style, whether code blocks auto-render, landing page behavior, and default model shown for new chats.</li>
          <li><strong>Personalization / Memory</strong> — free-text facts about you (role, preferences, ongoing projects) that get quietly injected into future conversations for more tailored answers.</li>
          <li><strong>Chats</strong> — bulk export/import/archive/delete all of your own chat history.</li>
          <li><strong>Audio</strong> — speech-to-text engine, text-to-speech voice, and auto-send-after-silence for voice input.</li>
        </ul>
        <p style={pStyle}>
          Example: under Personalization, add <code>&quot;I teach a Saturday AI bootcamp and mostly
          ask about llama.cpp and Open WebUI setup.&quot;</code> so future answers assume that context
          without you repeating it every chat.
        </p>

        <h3 style={h3Style}>19. Admin Panel (instance-wide, admins only)</h3>
        <p style={pStyle}>
          The control plane for the whole deployment — every change here applies to all users, so
          treat it with the same care as production config.
        </p>
        <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.9 }}>
          <li><strong>Users</strong> — approve pending sign-ups, assign roles (admin/user/pending), and organize users into groups for access control.</li>
          <li><strong>Evaluations</strong> — an Elo leaderboard from head-to-head &quot;Arena&quot; model comparisons, plus a log of thumbs-up/down feedback tied to specific chats.</li>
          <li><strong>Functions</strong> — install custom Python <em>tools</em> (callable functions), <em>filters</em> (pre/post-process messages), or <em>pipes</em> (custom model backends).</li>
          <li><strong>Settings → Connections</strong> — register Ollama, OpenAI-compatible, or other backend API endpoints (e.g. your llama.cpp server URL) that models pull from.</li>
          <li><strong>Settings → Models</strong> — set the global default system prompt and Advanced Params baseline that every model falls back to unless overridden.</li>
          <li><strong>Settings → Code Execution</strong> — instance-wide toggle for the &quot;Run&quot; button that appears on Python code blocks in chat. By default it executes via <strong>Pyodide</strong>, a full CPython interpreter compiled to WebAssembly that runs entirely client-side in the browser tab — no local Python install, subprocess, or server involved, and it&apos;s sandboxed with no real filesystem/network access. This is independent of whichever LLM answered the message. Point &quot;Code Interpreter Engine&quot; at a real <strong>Jupyter</strong> server instead if you need pip-installed packages or actual file I/O.</li>
          <li><strong>Settings → Interface</strong> — instance-wide feature toggles: web search, image generation, voice input.</li>
          <li><strong>Settings → Security</strong> — SSO/OAuth configuration, whether public sign-up is open, and session/password policies.</li>
        </ul>
        <figure style={figureStyle}>
          <img src="/docs/open-webui-admin-guide/admin-settings-general.png" alt="Admin Panel Settings sidebar showing General, Authentication, Connections, Models, Evaluations, Integrations, Documents, Web Search, Code Execution, Interface, Audio, Images, Pipelines, Database, plus feature toggles" style={imgStyle} />
          <figcaption style={captionStyle}>Admin Panel → Settings — the full left-hand section list, with instance-wide feature toggles (Memories, Notes, Calendar, Automations, etc.) on the General page.</figcaption>
        </figure>
        <figure style={figureStyle}>
          <img src="/docs/open-webui-admin-guide/admin-connections.png" alt="Admin Panel Settings Connections page showing registered OpenAI-compatible API endpoints" style={imgStyle} />
          <figcaption style={captionStyle}>Settings → Connections — every backend endpoint (local llama.cpp servers, hosted APIs) the instance can route requests to.</figcaption>
        </figure>
        <figure style={figureStyle}>
          <img src="/docs/open-webui-admin-guide/admin-models.png" alt="Admin Panel Settings Models page listing the three local models available on this instance" style={imgStyle} />
          <figcaption style={captionStyle}>Settings → Models — every model exposed to users on this instance, each editable via the pencil icon.</figcaption>
        </figure>
        <p style={pStyle}>
          Example: under Settings → Connections, add{" "}
          <code>http://localhost:8080/v1</code> as an OpenAI-compatible endpoint pointing at your
          local llama.cpp server, so every user in the instance can select that model without
          re-entering the URL.
        </p>

        <h3 style={h3Style}>20. The sidebar shortcuts: Archived Chats, Workspace, Notes, Calendar, Automations, Playground</h3>
        <p style={pStyle}>
          One click below Settings/Admin Panel in the profile menu, these give quick access to
          features that would otherwise be buried:
        </p>
        <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.9 }}>
          <li><strong>Archived Chats</strong> — chats you&apos;ve archived out of the main sidebar list; still searchable, not deleted.</li>
          <li><strong>Workspace</strong> — the shared library of custom Models (system prompt + params bundled into a reusable preset), Prompts (saved templates), Tools, and Knowledge (documents for RAG).</li>
          <li><strong>Notes</strong> — a lightweight built-in notes editor, separate from chat history, for jotting things down without starting a conversation.</li>
          <li><strong>Calendar</strong> — a scheduling view for anything Open WebUI has tracked with a date (e.g. scheduled tasks), not a full calendar app.</li>
          <li><strong>Automations</strong> — scheduled or triggered tasks (e.g. run a prompt against a model on a recurring basis) without a human starting the chat.</li>
          <li><strong>Playground</strong> — a raw completion/chat testing surface for trying a model and params directly, outside of the normal saved-chat flow — handy for quickly A/B-testing an Advanced Params change before committing it to a Workspace Model preset.</li>
        </ul>
        <p style={pStyle}>
          Example: build a Workspace <strong>Model</strong> called &quot;Weather Bot&quot; that bundles
          the system prompt from item 1, <code>temperature: 0.3</code>, and the Weather Lookup tool
          from the{" "}
          <Link href="/docs/mcp-and-tools-open-webui" style={{ color: "#a0a0ff" }}>
            Tool Calling &amp; MCP doc
          </Link>{" "}
          into one selectable preset, then test it in <strong>Playground</strong> before rolling it
          out to students.
        </p>

        <h2 style={h2Style}>Summary</h2>
        <p>
          Sampling and prompt behavior (1–17) live in the per-chat <strong>Controls</strong> panel and
          cascade down from global → model → chat. Instance-wide behavior — who can log in, which
          backends exist, which features are even visible — lives in the <strong>Admin
          Panel</strong>. Personal preferences that don&apos;t affect anyone else live in{" "}
          <strong>Settings</strong>. When something &quot;isn&apos;t working,&quot; check in that
          order: is it disabled in Admin Panel → Settings first, before assuming a per-chat override
          is the problem.
        </p>
      </div>
    </main>
  );
}
