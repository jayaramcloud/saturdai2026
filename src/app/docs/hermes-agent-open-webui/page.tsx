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

export default function HermesAgentOpenWebui() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-27</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Adding a Hermes Agent Alongside Open WebUI
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          We already run several <code>llama-server</code> instances on the <code>jay-z820</code> workstation
          (Quadro P4000, 8GB VRAM) fronted by Open WebUI, plus an <code>mcpo</code> bridge that exposes MCP
          tools (like <code>get_current_time</code>) as an OpenAPI Tool Server. This adds{" "}
          <a href="https://huggingface.co/NousResearch/Hermes-3-Llama-3.2-3B-GGUF" style={{ color: "#a0a0ff" }} target="_blank" rel="noreferrer">
            NousResearch&apos;s Hermes
          </a>
          , a model trained specifically for structured function/tool calling, so students can watch a local
          model actually <em>decide to call a tool</em> instead of just chatting.
        </p>
        <p style={pStyle}>Every command below is logged in the order it was actually run, including the wrong turns.</p>

        <h2 style={h2Style}>1. Recon: is there room for another model?</h2>
        <pre style={codeStyle}><code>{`nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free --format=csv
systemctl list-units --type=service --state=running | grep -iE 'llama|webui|mcpo'
ss -tlnp | grep -E ':(8000|8001|8002|8081|8050)'
df -h /home
ls /etc/systemd/system/ | grep -iE 'llama|webui|mcpo'`}</code></pre>
        <p style={pStyle}>
          <strong>Result:</strong> the P4000 had only <strong>1.35GB VRAM free</strong> out of 8GB — Gemma 3 4B,
          Qwen2.5 3B, and TinyLlama were already loaded. A <code>phi-2</code> unit exists but was inactive.
        </p>
        <div style={noteStyle}>
          <strong>Gotcha:</strong> don&apos;t assume &quot;there&apos;s a GPU, so use it&quot; — check{" "}
          <code>nvidia-smi</code> free memory <em>first</em>. An 8B model at Q4 (~4.9GB) would not have fit
          next to the existing three models.
        </div>
        <pre style={codeStyle}><code>{`free -h
nproc
sudo ss -tlnp | grep -E ':(8000|8080|8081|8082)'
cat /etc/systemd/system/open-webui.service
cat /etc/systemd/system/open-webui-2.service`}</code></pre>
        <p style={pStyle}>
          46GB RAM (31GB free), 16 CPU cores — plenty of headroom to run a small model on CPU instead of
          fighting for the last sliver of VRAM. Two Open WebUI containers exist: <code>open-webui</code>{" "}
          (port 8000/8080, <code>--network=host</code>) and <code>open-webui-2</code> (port 8081, reachable
          via <code>host.docker.internal</code>). Ports in use: <code>8000/8080</code> open-webui,{" "}
          <code>8001</code> TinyLlama, <code>8002</code> Gemma 3, <code>8003</code> Qwen2.5, <code>8050</code>{" "}
          mcpo, <code>8081</code> open-webui-2, <code>8101</code> phi-2 (disabled). <strong>8004 free</strong> —
          used for Hermes.
        </p>

        <h2 style={h2Style}>2. Picking a model that actually fits</h2>
        <p style={pStyle}>
          8B Hermes (the usual recommendation) was out given the VRAM situation. Checked Hugging Face for
          smaller official quantized releases rather than guessing a repo name:
        </p>
        <pre style={codeStyle}><code>{`curl -s "https://huggingface.co/api/models?search=Hermes-3-Llama-3.2-3B&limit=20"
curl -s "https://huggingface.co/api/models/NousResearch/Hermes-3-Llama-3.2-3B-GGUF"`}</code></pre>
        <p style={pStyle}>
          Picked <strong>NousResearch/Hermes-3-Llama-3.2-3B-GGUF</strong> (the official quant repo), quant{" "}
          <code>Q4_K_M</code> (~2GB).
        </p>
        <div style={noteStyle}>
          <strong>Decision:</strong> even at 2GB, weights + KV cache still wouldn&apos;t cleanly fit into
          1.35GB free VRAM without a live OOM risk mid-class. Ran it <strong>CPU-only</strong> (
          <code>--gpu-layers 0</code>) at first instead of fighting the P4000 for scraps.
        </div>

        <h2 style={h2Style}>3. First systemd unit (CPU-only)</h2>
        <pre style={codeStyle}><code>{`python3 -c "
from huggingface_hub import hf_hub_download
p = hf_hub_download(repo_id='NousResearch/Hermes-3-Llama-3.2-3B-GGUF', filename='Hermes-3-Llama-3.2-3B.Q4_K_M.gguf', local_dir='.')
print('DOWNLOADED:', p)
"`}</code></pre>
        <div style={noteStyle}>
          <strong>Gotcha:</strong> <code>hf</code> and <code>huggingface-cli</code> weren&apos;t on{" "}
          <code>PATH</code> (Python 3.10.12, <code>huggingface_hub</code> installed as a library only) and{" "}
          <code>python3 -m huggingface_hub</code> isn&apos;t runnable as a module. Used the Python API (
          <code>hf_hub_download</code>) directly instead.
        </div>
        <pre style={codeStyle}><code>{`[Unit]
Description=Llama Inference Server (Hermes-3-Llama-3.2-3B, agentic tool-calling)
After=network.target

[Service]
Type=simple
User=jay
WorkingDirectory=/home/jay/llama.cpp/build
ExecStart=/home/jay/llama.cpp/build/bin/llama-server \\
  -m /home/jay/llama.cpp/models/Hermes-3-Llama-3.2-3B.Q4_K_M.gguf \\
  --gpu-layers 0 \\
  -c 8192 \\
  --port 8004 \\
  --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target`}</code></pre>
        <pre style={codeStyle}><code>{`sudo systemctl daemon-reload
sudo systemctl enable --now llama-inference-hermes.service
curl -s http://localhost:8004/v1/models`}</code></pre>
        <div style={noteStyle}>
          <strong>Gotcha:</strong> <code>sudo</code> over a non-interactive SSH session refuses a TTY password
          prompt. Fixed by writing the password to a throwaway file (<code>/tmp/.sp</code>, deleted right
          after) and using <code>sudo -S ... &lt; /tmp/.sp</code> for each privileged command.
        </div>

        <h2 style={h2Style}>4. First tool-calling test — and it silently failed</h2>
        <pre style={codeStyle}><code>{`curl -s http://localhost:8004/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "hermes",
  "messages": [{"role": "user", "content": "What time is it right now?"}],
  "tools": [{"type": "function", "function": {"name": "get_current_time", "description": "Get the current time in a given timezone", "parameters": {"type": "object", "properties": {"timezone": {"type": "string"}}, "required": ["timezone"]}}}]
}'`}</code></pre>
        <p style={pStyle}>
          It just <strong>made up a time</strong> (&quot;11:14 AM on August 3, 2023&quot;) instead of calling
          the tool — even with <code>&quot;tool_choice&quot;: &quot;required&quot;</code>, it narrated fake
          reasoning instead of emitting a real tool call.
        </p>
        <div style={noteStyle}>
          <strong>Root cause:</strong> <code>curl -s http://localhost:8004/props</code> showed{" "}
          <code>&quot;chat_format&quot;: &quot;Content-only&quot;</code>. The GGUF&apos;s baked-in chat
          template (and even the base <code>NousResearch/Hermes-3-Llama-3.2-3B</code> repo&apos;s{" "}
          <code>tokenizer_config.json</code>) is bare ChatML — no <code>{`{% if tools %}`}</code> Jinja logic
          at all. llama-server can&apos;t render tool definitions into the prompt without a template that
          knows about them, so it silently degrades to plain chat. The <code>tools</code> param was a no-op
          the whole time, hence the confident hallucination.
        </div>
        <p style={pStyle}>
          <strong>Fix:</strong> Hermes models ship a <em>second</em>, separate chat-template variant named{" "}
          <code>tool_use</code> (visible in <code>NousResearch/Hermes-2-Pro-Llama-3-8B</code>&apos;s{" "}
          <code>tokenizer_config.json</code>, as a list of <code>{`{name, template}`}</code> objects) that
          adds the <code>&lt;tools&gt;</code> system-prompt block and <code>&lt;tool_call&gt;</code>/
          <code>&lt;tool_response&gt;</code> XML tags. Pulled it out and passed it explicitly via{" "}
          <code>--chat-template-file</code>.
        </p>

        <h2 style={h2Style}>5. VRAM freed up mid-session — switched to GPU offload</h2>
        <p style={pStyle}>
          Partway through, two other <code>llama-server</code> instances were stopped by hand, freeing VRAM to
          5GB. Updated the unit to add <code>--chat-template-file</code> and switch{" "}
          <code>--gpu-layers 0 → 99</code> (full offload). Hermes ended up using ~2.8GB VRAM fully offloaded,
          leaving ~2.3GB free — not enough headroom for the 8B Hermes variant, confirming the earlier decision
          to go with the 3B.
        </p>

        <h2 style={h2Style}>6. Tool-calling worked — but only at temperature 0</h2>
        <p style={pStyle}>
          With the <code>tool_use</code> template in place, the default sampling settings (temp 0.8) still
          produced a garbled attempt:
        </p>
        <pre style={codeStyle}><code>{`{"content": "<SCRATCHPAD>\\n{\\"name\\": \\"get_current_time\\", \\"arguments\\": {\\"timezone\\": \\"Denver\\"}}\\n</tool_response>"}`}</code></pre>
        <p style={pStyle}>
          Right idea, wrong tags (<code>&lt;SCRATCHPAD&gt;</code> instead of <code>&lt;tool_call&gt;</code>,
          mismatched closing tag) — a small 3B model wandering off the exact format under sampling noise.
          Setting <code>&quot;temperature&quot;: 0</code> produced a clean, correctly parsed{" "}
          <code>tool_calls</code> response every time. Baked <code>--temp 0</code> into the systemd unit
          itself so Open WebUI&apos;s requests (which won&apos;t set it explicitly) still get reliable tool
          calls by default.
        </p>
        <div style={noteStyle}>
          <strong>Lesson for the class:</strong> tool-calling reliability on small local models is sensitive
          to both the chat template <em>and</em> sampling temperature — a good live example of why &quot;it&apos;s
          not calling my tool&quot; is usually a prompt/template problem, not a fundamentally broken model.
        </div>

        <h2 style={h2Style}>7. Registering Hermes in Open WebUI — wrong instance first</h2>
        <p style={pStyle}>
          <code>docker ps -a</code> showed <code>open-webui-2</code> (the <code>:8081</code> instance used in
          earlier docs) had actually <strong>exited 7 days ago</strong>. The container currently live is the
          original <code>open-webui</code> service, on port <code>8080</code> (<code>--network=host</code>) —
          a <strong>separate Docker volume</strong> with its own independent config/database from{" "}
          <code>open-webui-2</code>.
        </p>
        <div style={noteStyle}>
          <strong>Gotcha:</strong> these are two totally separate Open WebUI installs (separate SQLite DBs
          inside separate named volumes) even though both run the same image. A connection or tool server
          registered in one does <em>not</em> carry over to the other. Used <code>:8080</code> since it&apos;s
          the one actually running.
        </div>
        <p style={pStyle}>
          Logged in via the API to get an admin token, read the existing OpenAI-compatible connections (
          <code>GET /openai/config</code>) so the new one could be appended without clobbering the
          Gemma/Qwen/TinyLlama connections already there, then added Hermes as a 4th connection pointing at{" "}
          <code>http://127.0.0.1:8004/v1</code>.
        </p>

        <h2 style={h2Style}>8. The MCP tool server wasn&apos;t registered on this instance either</h2>
        <p style={pStyle}>
          Per the earlier{" "}
          <Link href="/docs/mcp-and-tools-open-webui" style={{ color: "#a0a0ff" }}>
            MCP &amp; Tools doc
          </Link>
          , MCP tools (via the <code>mcpo-time</code> bridge) aren&apos;t attached to individual models —
          they&apos;re registered once, globally, as an External Tool Server, then toggled on per-chat via the
          wrench icon.
        </p>
        <pre style={codeStyle}><code>{`curl -s "http://localhost:8080/api/v1/configs/tool_servers" -H "Authorization: Bearer $TOKEN"
# {"TOOL_SERVER_CONNECTIONS": []}`}</code></pre>
        <p style={pStyle}>
          Empty — same reason as the connections above, this fresh <code>:8080</code> instance never had{" "}
          <code>mcpo-time</code> registered. Registered it (<code>localhost:8050</code> works directly here,
          no <code>host.docker.internal</code> needed, since <code>open-webui</code> runs with{" "}
          <code>--network=host</code>).
        </p>

        <h2 style={h2Style}>9. Custom model for a clean display name</h2>
        <p style={pStyle}>
          Same pattern as the existing <code>qwen-model</code> custom model — wraps the raw connection model
          with a friendly name, description, and suggested prompts via <code>POST /api/v1/models/create</code>.
          Confirmed <strong>Hermes Agent (tool-calling demo)</strong> now shows up in the model list.
        </p>

        <h3 style={h3Style}>10. What&apos;s left — do this live in the browser</h3>
        <p style={pStyle}>
          Everything above was verified at the API layer (direct <code>llama-server</code> calls, direct{" "}
          <code>mcpo</code> calls, Open WebUI&apos;s admin/config API). The chat UI flow itself needs a
          real click-through before class:
        </p>
        <ol style={listStyle}>
          <li>
            Open <code>http://192.168.1.92:8080</code>, log in, start a new chat, pick{" "}
            <strong>Hermes Agent (tool-calling demo)</strong>.
          </li>
          <li>Click the wrench/tools icon, enable the <code>mcpo</code> tool server if it&apos;s not already on.</li>
          <li>Ask &quot;What time is it right now in Tokyo?&quot; and confirm a tool call happens (not a hallucinated answer).</li>
          <li>If it doesn&apos;t fire: log out/in (or hard-refresh) so Open WebUI re-fetches the external tool server&apos;s <code>openapi.json</code>.</li>
        </ol>

        <h2 style={h2Style}>Summary for the class</h2>
        <ul style={listStyle}>
          <li>
            <strong>Why Hermes, not another local model:</strong> it&apos;s trained specifically to emit
            structured <code>&lt;tool_call&gt;</code> output when given tool definitions — a good hook for
            teaching &quot;what makes a model agentic&quot; vs. just chatty.
          </li>
          <li>
            <strong>Why the 3B, not 8B:</strong> VRAM was the hard constraint — 8B Q4 (~4.9GB) doesn&apos;t fit
            safely alongside the other models running.
          </li>
          <li>
            <strong>Two real bugs, both good teaching moments:</strong> the default GGUF chat template has no
            tool-calling logic at all, and tool-call formatting was unreliable above temperature 0 on this
            small model.
          </li>
          <li>
            <strong>Infra gotcha, not a Hermes thing:</strong> <code>open-webui</code> and{" "}
            <code>open-webui-2</code> are two independent installs with separate databases — confirm which
            instance is actually running (<code>docker ps</code>) before assuming prior setup carried over.
          </li>
        </ul>
      </div>
    </main>
  );
}
