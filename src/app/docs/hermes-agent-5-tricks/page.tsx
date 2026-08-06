import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";

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
const warnStyle: CSSProperties = {
  background: "#3a2222",
  border: "1px solid #6a3a3a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};

export default function HermesAgent5Tricks() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-08-05</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        5 Simple Tricks for Running Hermes Agent Against a Local LLM
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          <strong>Hermes Agent</strong> (Nous Research&apos;s CLI coding/agent assistant) doesn&apos;t need
          an API key from a hosted provider — it talks to any OpenAI-compatible endpoint, which means it
          works against a local <code>llama-server</code> instance the same way it would against a cloud
          model. This doc distills five practical habits for pointing it at a local LLM effectively,
          pulled from what actually happened running it against real local models on the{" "}
          <code>jay-z820</code> workstation in two earlier live sessions:{" "}
          <Link href="/docs/hermes-agent-open-webui" style={{ color: "#a0a0ff" }}>
            the original Hermes-3B setup
          </Link>{" "}
          and{" "}
          <Link href="/docs/hermes-agent-deepseek-v4" style={{ color: "#a0a0ff" }}>
            the DeepSeek V4 Flash demo run
          </Link>
          . Rather than re-running the same commands again, this doc is the &quot;here&apos;s what we
          learned, here&apos;s how to actually use it well&quot; writeup — every claim below traces back to
          one of those two sessions.
        </p>

        <h2 style={h2Style}>1. Point Hermes at your local server as a &quot;custom&quot; provider</h2>
        <p style={pStyle}>
          <code>hermes config</code> accepts any base URL, not just OpenAI&apos;s or Anthropic&apos;s — a
          local <code>llama-server</code> exposing an OpenAI-compatible <code>/v1</code> route is a first-class
          citizen. This is the one-time setup step everything else in this doc depends on:
        </p>
        <CodeBlock code={`$ hermes config
◆ Model
  Model:        {'default': 'unsloth/DeepSeek-V4-Flash-GGUF:UD-IQ3_XXS',
                  'provider': 'custom',
                  'base_url': 'http://192.168.1.91:11434/v1',
                  'api_key': '***'}`} />
        <p style={pStyle}>
          The API key can be anything non-empty — most local servers don&apos;t check it, they just require
          the field to be present because the OpenAI client library won&apos;t send a request without one.
        </p>

        <h2 style={h2Style}>2. Use one-shot mode for anything scripted or demoed live</h2>
        <p style={pStyle}>
          <code>hermes -z &quot;prompt&quot; --cli</code> runs a single prompt to completion and exits,
          instead of dropping into the interactive TUI. For local models — which are often much slower than
          a hosted API — this matters more than it sounds: it&apos;s the difference between a clean,
          scriptable command you can time and pipe, and a session you have to babysit.
        </p>
        <CodeBlock code={`$ hermes -z "In one sentence, who are you and what model are you running on?" --cli`} />
        <div style={noteStyle}>
          <strong>Set speed expectations before you demo this live.</strong> A 284B-parameter model
          (DeepSeek V4 Flash) running IQ3-quantized on a single GPU took <strong>~2 minutes</strong> to
          answer a one-sentence prompt. Local inference on a big quantized model is a &quot;kick it off and
          talk while it thinks&quot; demo, not a snappy live-typing one.
        </div>

        <h2 style={h2Style}>3. Use --yolo to skip confirmation prompts — but only when you trust the sandbox</h2>
        <p style={pStyle}>
          By default Hermes Agent pauses for approval before running tool calls (file writes, code
          execution, web requests). <code>--yolo</code> auto-approves them, which is what makes one-shot
          demos like web search or file read/write actually run end-to-end without a human in the loop:
        </p>
        <CodeBlock code={`$ hermes -z "Create a file at /tmp/hermes-demo.txt containing some text, then read it back and show me the contents." --cli --yolo`} />
        <div style={warnStyle}>
          <strong>Only use this against infrastructure you control.</strong> It auto-approves every tool
          call the model requests, including ones it hallucinates a need for. Fine for a local box you own;
          not something to wire into anything touching production data or a shared environment.
        </div>

        <h2 style={h2Style}>4. Check the chat template before trusting any tool-calling result</h2>
        <p style={pStyle}>
          This is the single highest-leverage trick in this list. Both prior sessions independently hit the{" "}
          <strong>same root cause</strong> for MCP tools, skills, memory, and subagent delegation all
          silently failing: the local GGUF&apos;s baked-in chat template had no Jinja logic for rendering{" "}
          <code>tools</code> into the prompt at all. One curl command tells you in advance whether tool
          calling has any chance of working on a given local server:
        </p>
        <CodeBlock code={`$ curl http://192.168.1.91:11434/props | grep chat_format
"chat_format": "Content-only"`} />
        <div style={warnStyle}>
          <strong>&quot;Content-only&quot; means tool calling is a no-op</strong> — the model is never even
          shown the tool definitions, so it will confidently say &quot;I don&apos;t have that tool&quot; (an
          honest answer) or, worse, narrate using a tool and claim success on an action that never happened
          (a hallucinated one — this is exactly what happened when Hermes Agent was asked to save a memory
          that was never written to disk). The fix is starting <code>llama-server</code> with an explicit{" "}
          <code>--chat-template-file</code> that actually renders tool definitions — the same move that
          fixed tool calling for the Hermes-3B setup.
        </div>

        <h2 style={h2Style}>5. Register MCP servers with absolute paths, not bare command names</h2>
        <p style={pStyle}>
          Once the chat template is fixed and tool calling actually works, adding an MCP server is one
          command:
        </p>
        <CodeBlock code={`$ hermes mcp add mcp-time --command uvx --args mcp-server-time`} />
        <div style={warnStyle}>
          <strong>Gotcha:</strong> Hermes Agent&apos;s MCP subprocess launcher doesn&apos;t inherit the
          shell&apos;s <code>PATH</code>. A bare command name that works fine typed at the terminal fails
          with <code>FileNotFoundError: [Errno 2] No such file or directory</code> when Hermes tries to
          launch it. Always use the absolute path:
        </div>
        <CodeBlock code={`$ hermes mcp add mcp-time --command /home/jay/.local/bin/uvx --args --with 'mcp<1.10' mcp-server-time
✓ Connected! Found 2 tool(s) from 'mcp-time':
  get_current_time     Get current time in a specific timezones
  convert_time          Convert time between timezones`} />
        <p style={pStyle}>
          Two more free tips that fall out of the same command: pin dependency versions with{" "}
          <code>--with &apos;mcp&lt;1.10&apos;</code> if a reference MCP server predates the latest SDK, and
          put any flag meant for <code>hermes mcp add</code> itself (like <code>--connect-timeout</code>){" "}
          <em>before</em> <code>--command</code>/<code>--args</code> — <code>--args</code> swallows every
          token after it, so anything placed later gets passed to the MCP server binary instead of to
          Hermes.
        </p>

        <h2 style={h2Style}>Bonus: hermes doctor, before you touch the LLM at all</h2>
        <p style={pStyle}>
          A good first (and last-resort) move when something isn&apos;t working: a fast, free health check
          that verifies config files and dependencies without spending a single token or waiting on
          inference.
        </p>
        <CodeBlock code={`$ hermes doctor
◆ Configuration Files
  ✓ ~/.hermes/.env file exists
  ✓ API key or custom endpoint configured
  ✓ ~/.hermes/config.yaml exists
  ✓ Config version up to date (v33)
◆ Required Packages
  ✓ OpenAI SDK
  ✓ Rich (terminal UI)
  ✓ Croniter (cron expressions) (optional)`} />

        <h2 style={h2Style}>Summary for the class</h2>
        <ul style={listStyle}>
          <li>
            <strong>Tricks 1–3</strong> get you a working, scriptable local setup fast: point at any
            OpenAI-compatible endpoint, use one-shot mode, and use <code>--yolo</code> deliberately.
          </li>
          <li>
            <strong>Trick 4 is the one that actually matters most</strong> for local models specifically —
            check <code>chat_format</code> before you demo or rely on anything tool-related, because a
            &quot;Content-only&quot; template will make the model either honestly refuse or confidently
            hallucinate success, and only one of those is obvious at a glance.
          </li>
          <li>
            <strong>Trick 5</strong> saves the ten minutes of confusion that comes from a PATH bug that only
            shows up inside Hermes&apos;s subprocess launcher, never at the terminal.
          </li>
        </ul>
      </div>
    </main>
  );
}
