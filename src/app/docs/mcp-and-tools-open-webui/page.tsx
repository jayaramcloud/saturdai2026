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
const listStyle: CSSProperties = { marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 };
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
};
const screenshotStyle: CSSProperties = {
  border: "1px dashed #44447a",
  borderRadius: 8,
  padding: "2rem",
  textAlign: "center",
  color: "#8888aa",
  fontSize: "0.85rem",
  marginBottom: "1.5rem",
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

export default function McpAndToolsOpenWebui() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-16</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Tool Calling &amp; MCP in Open WebUI
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A 30-minute, live-in-class walkthrough of two ways to give an Open WebUI model the ability
          to call external functions: Open WebUI&apos;s own <strong>native Tools</strong>, and real{" "}
          <strong>MCP</strong> (Model Context Protocol) servers bridged in via <code>mcpo</code>.
          Every command below is exactly what came up live, including the errors — the
          troubleshooting is as much the lesson as the happy path.
        </p>
        <p style={pStyle}>
          <strong>Prerequisites:</strong> Open WebUI already running and reachable in a browser (see
          the{" "}
          <Link href="/docs/llama-cpp-open-webui-setup" style={{ color: "#a0a0ff" }}>
            llama.cpp + Open WebUI setup doc
          </Link>
          ). No API keys needed for either part.
        </p>

        <h2 style={h2Style}>Part A: Native Tool (Open WebUI&apos;s own tool-calling format)</h2>
        <p style={pStyle}>
          Open WebUI lets you paste a Python function straight into the admin UI and hand it to a
          model as a callable tool — no extra server, no extra process.
        </p>

        <h3 style={h3Style}>1. Create the tool</h3>
        <p style={pStyle}>
          Go to <strong>Workspace → Tools → + Create new tool</strong>, and paste in:
        </p>
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
        <p style={pStyle}>
          This hits{" "}
          <a href="https://open-meteo.com/" style={{ color: "#a0a0ff" }} target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
          , a free weather API with no signup, so the demo fetches real data rather than a mocked
          response. Save the tool.
        </p>
        <figure style={figureStyle}>
          <img src="/docs/mcp-and-tools-open-webui/tool-editor.png" alt="Open WebUI Tools editor showing the Weather Lookup tool's Python code with title and description docstring before saving" style={imgStyle} />
          <figcaption style={captionStyle}>Workspace → Tools → Weather Lookup — the <code>&quot;&quot;&quot;title / description&quot;&quot;&quot;</code> docstring at the top and each method&apos;s own docstring are what the model sees as the tool&apos;s name and usage description.</figcaption>
        </figure>

        <h3 style={h3Style}>2. Enable it for a chat</h3>
        <p style={pStyle}>
          Toggle the tool <strong>on</strong> in the Tools list, then in a chat click the tools icon
          (wrench/plug icon above the message box) and enable <strong>Weather Lookup</strong> for the
          model you&apos;re chatting with.
        </p>
        <div style={screenshotStyle}>[Screenshot: tool enabled/toggled in a chat, tools icon showing &quot;Weather Lookup&quot;]</div>

        <h3 style={h3Style}>3. Test it</h3>
        <p style={pStyle}>
          Ask: <em>&quot;What&apos;s the weather in Bangalore right now?&quot;</em>
        </p>
        <p style={pStyle}>
          The model should call <code>get_weather</code>, and the response should cite the real
          current temperature — proof it actually ran the function rather than guessing.
        </p>
        <div style={screenshotStyle}>[Screenshot: chat response showing the tool call + real weather data]</div>

        <h2 style={h2Style}>Part B: Real MCP, bridged in with mcpo</h2>
        <p style={pStyle}>
          Open WebUI doesn&apos;t speak MCP natively — it speaks OpenAPI.{" "}
          <a href="https://github.com/open-webui/mcpo" style={{ color: "#a0a0ff" }} target="_blank" rel="noreferrer">
            <code>mcpo</code>
          </a>{" "}
          is a small proxy from the Open WebUI team that runs an MCP server as a subprocess and
          exposes it as an OpenAPI HTTP server, which Open WebUI <em>can</em> consume as a &quot;Tool
          Server.&quot; This is genuine MCP underneath, just translated at the edge.
        </p>

        <h3 style={h3Style}>1. Install uv</h3>
        <p style={pStyle}>
          <code>mcpo</code> requires <strong>Python ≥3.11</strong>. Check your system Python first:
        </p>
        <pre style={codeStyle}><code>python3 --version</code></pre>
        <p style={pStyle}>
          If it&apos;s older than 3.11 (Ubuntu 22.04 ships 3.10.12), don&apos;t fight your system
          Python — use{" "}
          <a href="https://docs.astral.sh/uv/" style={{ color: "#a0a0ff" }} target="_blank" rel="noreferrer">
            <code>uv</code>
          </a>
          , which can fetch an isolated Python 3.11 on demand and run tools in throwaway environments
          via <code>uvx</code>.
        </p>
        <pre style={codeStyle}><code>{`curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc`}</code></pre>
        <div style={noteStyle}>
          <strong>Gotcha:</strong> <code>sudo apt install uv</code> / <code>sudo snap install
          astral-uv</code> also exist, but tend to lag behind — the official installer script above
          is what Astral recommends and is what we used here.
        </div>
        <div style={noteStyle}>
          <strong>Gotcha:</strong> the installer places <code>uv</code>/<code>uvx</code> in{" "}
          <code>~/.local/bin</code>. If <code>uvx: command not found</code> persists after{" "}
          <code>source ~/.bashrc</code>, run <code>ls ~/.local/bin/</code> to confirm the binaries
          landed, then add the directory to your <code>PATH</code> explicitly:
          <pre style={{ ...codeStyle, marginTop: "0.75rem", marginBottom: 0 }}><code>{`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc`}</code></pre>
        </div>

        <h3 style={h3Style}>2. Run the bridge</h3>
        <pre style={codeStyle}><code>uvx mcpo --port 8050 -- uvx mcp-server-time</code></pre>
        <p style={pStyle}>
          This starts <code>mcpo</code> on port 8050, which in turn launches{" "}
          <code>mcp-server-time</code> (a small official MCP server that answers &quot;what time is
          it in X timezone&quot;) as a subprocess and translates its MCP calls into an OpenAPI
          server.
        </p>
        <div style={noteStyle}>
          <strong>Gotcha:</strong> <code>address already in use</code> means something is already
          bound to that port — either pick a different port (<code>--port 8051</code>, etc.) or find
          and stop the earlier process with <code>lsof -i :8050</code>.
        </div>
        <p style={pStyle}>
          Confirm it&apos;s up by opening <code>http://localhost:8050/docs</code> in a browser — you
          should see an auto-generated OpenAPI page listing the time-lookup endpoint.
        </p>
        <div style={screenshotStyle}>[Screenshot: terminal with mcpo running + the /docs OpenAPI page]</div>

        <h3 style={h3Style}>3. Make it survive reboots: run as a systemd service</h3>
        <p style={pStyle}>
          For anything beyond a one-off demo, run <code>mcpo</code> as a proper systemd service
          instead of a foreground terminal command. Systemd units{" "}
          <strong>do not inherit your shell&apos;s PATH</strong>, so the <code>uvx</code> binary
          needs either a full path or an explicit <code>Environment=PATH=...</code> line — this is
          exactly the class of bug that produces a mysterious <code>uvx: command not found</code>{" "}
          inside a service that works fine by hand.
        </p>
        <pre style={codeStyle}><code>{`sudo tee /etc/systemd/system/mcpo-time.service > /dev/null <<'EOF'
[Unit]
Description=mcpo MCP-to-OpenAPI bridge (mcp-server-time)
After=network.target

[Service]
Type=simple
User=<your-user>
WorkingDirectory=/home/<your-user>
ExecStart=/home/<your-user>/.local/bin/uvx mcpo --port 8050 -- uvx mcp-server-time
Restart=on-failure
Environment="PATH=/home/<your-user>/.local/bin:/usr/local/bin:/usr/bin:/bin"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable mcpo-time.service
sudo systemctl start mcpo-time.service
sudo systemctl status mcpo-time.service`}</code></pre>
        <p style={pStyle}>
          If you had a foreground <code>uvx mcpo</code> still running from step 2, stop it (Ctrl+C)
          so it doesn&apos;t fight the service over the port. Then confirm the service took over:
        </p>
        <pre style={codeStyle}><code>{`curl -sI http://localhost:8050/docs
# HTTP/1.1 200 OK ...`}</code></pre>
        <div style={screenshotStyle}>[Screenshot: systemctl status mcpo-time.service showing active/running]</div>

        <h3 style={h3Style}>4. Register it in Open WebUI</h3>
        <p style={pStyle}>
          Tool Servers are an <strong>admin-only</strong> setting, and where they live varies by
          version. In v0.10.2, the path is:
        </p>
        <p style={pStyle}>
          Click your profile avatar (bottom-left) → <strong>Admin Panel</strong> →{" "}
          <strong>Settings</strong> tab → <strong>Integrations</strong> (left sub-menu) →{" "}
          <strong>External Tool Servers</strong> → <strong>+</strong>. Enter the URL:
        </p>
        <pre style={codeStyle}><code>http://localhost:8050</code></pre>
        <p style={pStyle}>Save.</p>
        <div style={noteStyle}>
          <strong>Gotcha:</strong> Tool Servers are <em>not</em> under Admin Panel → Settings →
          Connections (that page is only for OpenAI/Ollama-style model connections) — look for the
          separate <strong>Integrations</strong> entry in the same left sub-menu.
        </div>
        <img
          src="/docs/mcp-and-tools-open-webui/tool-server-connection.png"
          alt="Open WebUI Admin Panel → Settings → Integrations → External Tool Servers, showing the Edit Connection dialog with URL http://localhost:8050 filled in"
          style={{ width: "100%", borderRadius: 8, border: "1px solid #33335a", marginBottom: "1.5rem" }}
        />

        <h3 style={h3Style}>5. Where per-model Tools live (and why the MCP tool might not show up yet)</h3>
        <p style={pStyle}>
          Open WebUI also has a <strong>Workspace → Models → Create/Edit</strong> page for building
          custom model presets (a saved persona wrapping a base model). It has its own{" "}
          <strong>Tools</strong> checklist section, worth knowing about since students will find it
          while looking for where to enable the MCP tool:
        </p>
        <ul style={listStyle}>
          <li><strong>Model Name / ID / Base Model</strong> — display name and which underlying model this preset wraps.</li>
          <li><strong>Description / tags</strong> — cosmetic, for organizing multiple presets.</li>
          <li><strong>Model Params → System Prompt</strong> — a persona/instruction baked into every chat using this preset.</li>
          <li><strong>Advanced Params</strong> — generation params: temperature, top_p, top_k, mirostat, etc.</li>
          <li><strong>Prompts / Knowledge</strong> — attach saved prompt templates or a RAG knowledge base to this preset.</li>
          <li><strong>Tools</strong> — checkboxes for which <em>native</em> Workspace Tools (Python functions, like Weather Lookup) this preset auto-enables.</li>
          <li><strong>Skills</strong> — composable capability bundles, empty until created under Workspace → Skills.</li>
          <li><strong>Capabilities</strong> — which UI affordances this preset exposes (Vision, File Upload, Web Search, Code Interpreter, Terminal, Citations, etc.).</li>
          <li><strong>Default Features / Builtin Tools</strong> — which of Open WebUI&apos;s own built-in tools (Memory, Notes, Calendar, Automations, etc.) are on by default for this preset.</li>
        </ul>
        <img
          src="/docs/mcp-and-tools-open-webui/model-create-tools-panel.png"
          alt="Workspace → Models → Create page, showing the Tools section listing only the native Weather Lookup tool"
          style={{ width: "100%", borderRadius: 8, border: "1px solid #33335a", marginBottom: "1.5rem" }}
        />
        <div style={noteStyle}>
          <strong>Gotcha:</strong> External Tool Servers (OpenAPI, like the mcpo bridge) do{" "}
          <strong>not</strong> populate this per-model Tools checklist — that list is only for
          native Workspace Tools. External tool servers are meant to surface directly in the{" "}
          <strong>chat&apos;s wrench-icon tools menu</strong> once enabled globally in Admin →
          Integrations. If it&apos;s missing there, don&apos;t assume the server is broken — verify
          the schema is actually being served first:
          <pre style={{ ...codeStyle, marginTop: "0.75rem", marginBottom: "0.75rem" }}><code>curl -s http://localhost:8050/openapi.json | head -40</code></pre>
          A healthy response lists real callable paths, e.g. <code>/get_current_time</code> and{" "}
          <code>/convert_time</code> with full parameter schemas — proof <code>mcpo</code> and{" "}
          <code>mcp-server-time</code> are working correctly. If you get a healthy response here but
          the tool still isn&apos;t listed in the chat&apos;s tools menu, the fix is usually just
          refreshing the page or logging out/in so Open WebUI re-fetches the external tool server
          list — it doesn&apos;t always pick up a newly-added connection live.
        </div>

        <h3 style={h3Style}>6. Test it</h3>
        <p style={pStyle}>
          In a new chat, enable the new tool server for the model, then ask:{" "}
          <em>&quot;What time is it in Tokyo?&quot;</em>
        </p>
        <p style={pStyle}>
          The response should reflect a real call out to <code>mcp-server-time</code> via the{" "}
          <code>mcpo</code> bridge — genuine MCP, not Open WebUI&apos;s native tool format.
        </p>
        <div style={screenshotStyle}>[Screenshot: chat response showing the MCP time-tool call working]</div>

        <h2 style={h2Style}>Summary</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}></th>
                <th style={thStyle}>Native Tool (Part A)</th>
                <th style={thStyle}>MCP via mcpo (Part B)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Extra process?</td>
                <td style={tdStyle}>No</td>
                <td style={tdStyle}>Yes — mcpo bridging an MCP server</td>
              </tr>
              <tr>
                <td style={tdStyle}>Protocol</td>
                <td style={tdStyle}>Open WebUI&apos;s own tool format</td>
                <td style={tdStyle}>Real MCP, translated to OpenAPI at the edge</td>
              </tr>
              <tr>
                <td style={tdStyle}>Setup effort</td>
                <td style={tdStyle}>Paste Python, toggle on</td>
                <td style={tdStyle}>Install uv, run/service mcpo, register URL</td>
              </tr>
              <tr>
                <td style={tdStyle}>Best for</td>
                <td style={tdStyle}>Quick custom functions specific to Open WebUI</td>
                <td style={tdStyle}>Reusing any existing MCP server unmodified</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Both end with the same result from the model&apos;s point of view — a function it can call
          mid-conversation — but Part B is the path to plugging in the growing ecosystem of pre-built
          MCP servers (filesystem, git, databases, Slack, etc.) without rewriting them as Open WebUI
          tools.
        </p>
      </div>
    </main>
  );
}
