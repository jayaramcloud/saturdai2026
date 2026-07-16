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
const h3Style: CSSProperties = { color: "#ffffff", fontSize: "1.15rem", margin: "1.75rem 0 0.75rem" };
const pStyle: CSSProperties = { marginBottom: "1.5rem" };
const listStyle: CSSProperties = { marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 };
const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "1.5rem",
  fontSize: "0.9rem",
};
const thStyle: CSSProperties = { textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: "1px solid #33335a", color: "#ffffff" };
const tdStyle: CSSProperties = { textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: "1px solid #262640" };

export default function HpWorkstationDeployment2() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-15</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        HP Workstation Deployment (Part 2): Second Open WebUI Instance
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          Follow-up to <Link href="/docs/llama-cpp-open-webui-setup" style={{ color: "#a0a0ff" }}>llama.cpp + Open WebUI Setup</Link>.
          The workstation now runs two <code>llama-server</code> instances side by side, plus a second, fully
          isolated Open WebUI pointed at both — and later, two more models added on top.
        </p>

        <h2 style={h2Style}>Current state (before adding more models)</h2>
        <pre style={codeStyle}><code>ps -aux | grep llama</code></pre>
        <pre style={codeStyle}><code>{`jay  814  /home/jay/llama.cpp/build/bin/llama-server -m tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf --gpu-layers 15 --port 8001 --host 0.0.0.0
jay  815  /home/jay/llama.cpp/build/bin/llama-server -m phi-2.Q4_K_M.gguf                     --gpu-layers 30 --port 8000 --host 0.0.0.0`}</code></pre>

        <table style={tableStyle}>
          <thead>
            <tr><th style={thStyle}>Service</th><th style={thStyle}>Model</th><th style={thStyle}>Port</th></tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}><code>llama-inference.service</code></td><td style={tdStyle}>phi-2 (Q4_K_M)</td><td style={tdStyle}>8000</td></tr>
            <tr><td style={tdStyle}><code>llama-inference-2.service</code></td><td style={tdStyle}>TinyLlama 1.1B Chat (Q4_K_M)</td><td style={tdStyle}>8001</td></tr>
            <tr><td style={tdStyle}><code>open-webui</code> (existing)</td><td style={tdStyle}>UI on host network, pointed only at 8000</td><td style={tdStyle}>—</td></tr>
            <tr><td style={tdStyle}><code>open-webui-2</code> (new)</td><td style={tdStyle}>UI pointed at both 8000 and 8001</td><td style={tdStyle}>8081</td></tr>
          </tbody>
        </table>

        <p style={pStyle}>
          The existing <code>open-webui</code> container was left untouched (<code>OLLAMA_BASE_URL=http://127.0.0.1:8000</code>,
          host networking). Rather than reconfigure it, a second, isolated instance was added so the
          original setup stays stable.
        </p>

        <h2 style={h2Style}>Why a second container, not a reconfigured one</h2>
        <ul style={listStyle}>
          <li><code>--network=host</code> on the original container means it can&apos;t be remapped to a different port without disrupting the running service.</li>
          <li>A dedicated container/volume keeps chat history, users, and settings separate between the two UIs.</li>
          <li><code>llama-server</code> speaks the <strong>OpenAI-compatible API</strong> (<code>/v1/chat/completions</code>), not native Ollama — so the new instance is wired up with <code>OPENAI_API_BASE_URLS</code> instead of <code>OLLAMA_BASE_URL</code>.</li>
        </ul>

        <h2 style={h2Style}>Docker run (manual)</h2>
        <pre style={codeStyle}><code>{`sudo docker run -d \\
  --name open-webui-2 \\
  -p 8081:8080 \\
  --add-host=host.docker.internal:host-gateway \\
  -v open-webui-2:/app/backend/data \\
  -e OPENAI_API_BASE_URLS="http://host.docker.internal:8000/v1;http://host.docker.internal:8001/v1" \\
  -e OPENAI_API_KEYS="sk-not-needed;sk-not-needed" \\
  -e ENABLE_OLLAMA_API=false \\
  -e DEFAULT_LOCALE=en-US \\
  ghcr.io/open-webui/open-webui:main`}</code></pre>

        <p style={pStyle}><strong>Key flags:</strong></p>
        <ul style={listStyle}>
          <li>No <code>--network=host</code> — isolates it from the existing instance and lets it bind cleanly to <code>8081</code>.</li>
          <li><code>--add-host=host.docker.internal:host-gateway</code> — since it&apos;s not on host networking, the container needs an explicit route back to the host&apos;s <code>127.0.0.1:8000</code> / <code>:8001</code>.</li>
          <li><code>OPENAI_API_BASE_URLS</code> / <code>OPENAI_API_KEYS</code> — semicolon-separated lists, one entry per backend. <code>llama-server</code> doesn&apos;t check the API key, so any placeholder value works.</li>
          <li><code>-v open-webui-2:/app/backend/data</code> — separate Docker volume from the original <code>open-webui</code> volume, so chat history/users don&apos;t mix.</li>
          <li><code>DEFAULT_LOCALE=en-US</code> — Open WebUI otherwise auto-detects UI language from the browser&apos;s <code>Accept-Language</code> header; this pins it to English regardless of browser settings. (If it doesn&apos;t take effect for an already-created account, set it manually: Settings → General → Language → English.)</li>
        </ul>

        <h2 style={h2Style}>systemd service</h2>
        <pre style={codeStyle}><code>sudo vi /etc/systemd/system/open-webui-2.service</code></pre>
        <pre style={codeStyle}><code>{`[Unit]
Description=Open WebUI (secondary instance, port 8081)
After=network.target docker.service llama-inference.service llama-inference-2.service
Requires=docker.service

[Service]
Type=simple
User=jay
ExecStartPre=-/usr/bin/docker rm -f open-webui-2
ExecStart=/usr/bin/docker run \\
  --name open-webui-2 \\
  -p 8081:8080 \\
  --add-host=host.docker.internal:host-gateway \\
  -v open-webui-2:/app/backend/data \\
  -e OPENAI_API_BASE_URLS="http://host.docker.internal:8000/v1;http://host.docker.internal:8001/v1" \\
  -e OPENAI_API_KEYS="sk-not-needed;sk-not-needed" \\
  -e ENABLE_OLLAMA_API=false \\
  -e DEFAULT_LOCALE=en-US \\
  ghcr.io/open-webui/open-webui:main
ExecStop=/usr/bin/docker stop open-webui-2
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`}</code></pre>
        <pre style={codeStyle}><code>{`sudo docker rm -f open-webui-2
sudo systemctl daemon-reload
sudo systemctl enable open-webui-2.service
sudo systemctl start open-webui-2.service
sudo systemctl status open-webui-2.service`}</code></pre>

        <h2 style={h2Style}>Verifying</h2>
        <ol style={listStyle}>
          <li>Open <code>http://&lt;workstation-ip&gt;:8081</code> — should load in English.</li>
          <li>Log in / sign up.</li>
          <li>Settings → Connections should show both OpenAI-compatible endpoints (<code>:8000/v1</code>, <code>:8001/v1</code>).</li>
          <li>In a new chat, the model picker should list both <strong>phi-2</strong> and <strong>TinyLlama 1.1B Chat</strong>.</li>
        </ol>

        <h2 style={h2Style}>Troubleshooting</h2>
        <ul style={listStyle}>
          <li><strong>UI loads in the wrong language</strong> — <code>DEFAULT_LOCALE</code> only affects new signups on some Open WebUI versions; set the language manually under Settings → General for existing accounts.</li>
          <li><strong>Models don&apos;t appear in the picker</strong> — confirm <code>host.docker.internal</code> resolves inside the container (<code>docker exec -it open-webui-2 getent hosts host.docker.internal</code>); if it doesn&apos;t, replace it with the workstation&apos;s LAN IP and restart the service.</li>
          <li><strong>Port conflict on 8081</strong> — check nothing else is bound there first: <code>sudo ss -tlnp | grep 8081</code>.</li>
        </ul>

        <h2 style={h2Style}>Mistakes made and lessons learned</h2>

        <h3 style={h3Style}>1. Wrong flag: <code>--c</code> instead of <code>-c</code></h3>
        <p style={pStyle}>When bumping TinyLlama&apos;s context size, the systemd unit was first edited with <code>--c 2048</code>. <code>llama-server</code> doesn&apos;t recognize <code>--c</code> as a long option — only the short form <code>-c</code> (or the long form <code>--ctx-size</code>) is valid. A flag typo like this can silently fail to apply rather than erroring loudly.</p>
        <p style={pStyle}><strong>Lesson:</strong> verify flags landed by checking the running process args in <code>systemctl status</code> (the <code>CGroup:</code> line), not just that the service says &quot;active.&quot;</p>

        <h3 style={h3Style}>2. &quot;Context size exceeded&quot; wasn&apos;t a GPU/VRAM problem</h3>
        <p style={pStyle}>Open WebUI threw a &quot;Context size has been exceeded&quot; error, and it was initially unclear whether this meant the GPU had run out of memory. <code>nvidia-smi</code> showed plenty of free VRAM, which ruled that out immediately.</p>
        <p style={pStyle}><strong>Lesson:</strong> &quot;context&quot; in an LLM setup almost always means the model&apos;s token context window (the <code>-c</code> / <code>--ctx-size</code> flag), not GPU memory. Check <code>nvidia-smi</code> first to rule out VRAM, then check whether <code>-c</code> was ever explicitly set.</p>

        <h3 style={h3Style}>3. Setting <code>-c</code> larger than a model&apos;s trained context causes silent quality loss</h3>
        <p style={pStyle}>phi-2 was restarted with <code>-c 4096</code>, but phi-2&apos;s native trained context is only 2048 tokens. <code>llama-server</code> logs a warning (<code>GENERATION QUALITY WILL BE DEGRADED!</code>), but the service still starts and looks healthy.</p>
        <p style={pStyle}><strong>Lesson:</strong> a &quot;successfully running&quot; service isn&apos;t the same as a correctly configured one. Read the startup log lines, not just the <code>Active: running</code> status.</p>

        <h3 style={h3Style}>4. ChatML tokens (<code>&lt;|im_start|&gt;</code> / <code>&lt;|im_end|&gt;</code>) leaking into responses</h3>
        <p style={pStyle}>phi-2 is a base/instruct model, not a chat-tuned model — it was never trained on ChatML formatting. <code>llama-server</code> was nonetheless applying a ChatML-style chat template, and because phi-2&apos;s tokenizer doesn&apos;t treat <code>&lt;|im_end|&gt;</code> as a real stop token, the model kept generating past its answer and hallucinated a fake next turn, printing the literal control tokens as visible text.</p>
        <p style={pStyle}><strong>Lesson:</strong> the chat template used to format a model&apos;s prompt has to match how that model was actually trained. Fix by adding the missing stop sequence explicitly (<code>--reverse-prompt &quot;&lt;|im_end|&gt;&quot;</code> server-side, or a Stop Sequence in Open WebUI&apos;s per-model Advanced Params).</p>

        <h3 style={h3Style}>5. Picking models: chat-tuned beats base/completion models for a chat UI</h3>
        <p style={pStyle}>Mistakes #3 and #4 trace back to the same root cause: phi-2 and TinyLlama are small/older models not designed for open-ended multi-turn chat. Moving to a properly instruct/chat-tuned current-generation model (e.g. Gemma 3 4B Instruct) avoids both problems by construction.</p>
        <p style={pStyle}><strong>Lesson:</strong> when picking a model for a chat UI, prioritize &quot;instruct/chat-tuned&quot; variants over base/completion models of the same size.</p>

        <h3 style={h3Style}>6. Guessing model repo IDs (and trusting a fetched page) leads to broken/fake downloads</h3>
        <p style={pStyle}><code>hf download google/gemma-3-4b-it-GGUF ...</code> failed with &quot;Repository not found&quot; — Google doesn&apos;t publish a bare <code>-GGUF</code> repo under that name. Separately, a fetched page for a guessed URL (<code>google/gemma-4-E4B-it</code>) came back describing a plausible-sounding model — but the description was nearly identical to the real, different model Gemma 3n E4B, strongly suggesting a wrong URL or a hallucinated summary. There is no known &quot;Gemma 4&quot; family.</p>
        <p style={pStyle}><strong>Lesson:</strong> never guess Hugging Face repo IDs and run <code>hf download</code> directly against the guess. Resolve the exact repo ID first, and treat any single fetched page describing a model as unverified until confirmed in a browser.</p>

        <h3 style={h3Style}>7. <code>hf search</code> doesn&apos;t exist — the real command is <code>hf models list</code></h3>
        <p style={pStyle}>Guessed at <code>hf search &lt;query&gt;</code> based on convention from other CLIs; the actual <code>hf</code> CLI has no <code>search</code> subcommand. The correct tool is <code>hf models list</code> (alias <code>hf models ls</code>).</p>
        <p style={pStyle}><strong>Lesson:</strong> check <code>&lt;command&gt; --help</code> before running an invented command — CLI tools don&apos;t always follow the naming conventions you&apos;d expect from a different tool.</p>

        <h2 style={h2Style}>How to search Hugging Face from the CLI</h2>
        <p style={pStyle}><code>hf models list</code> (alias <code>hf models ls</code>) is the real search command — there is no <code>hf search</code>.</p>
        <pre style={codeStyle}><code>{`# Search by keyword
hf models list --search "gemma-3-4b-it gguf" --sort downloads --limit 10

# Search restricted to a specific publisher
hf models list --search "gemma-3-4b-it" --author google --sort downloads

# Search restricted to models runnable by llama.cpp specifically
hf models list --search "gemma-3-4b" --apps llama.cpp --sort downloads --limit 10

# Search by parameter count range instead of a name
hf models list --search "instruct gguf" --num-parameters min:2B,max:5B --sort downloads

# Qwen models specifically
hf models list --search "qwen2.5 instruct gguf" --sort downloads --limit 10

# List the actual files/quant sizes inside a specific repo before downloading
hf models list unsloth/gemma-3-4b-it-GGUF
hf models list Qwen/Qwen2.5-7B-Instruct-GGUF`}</code></pre>
        <p style={pStyle}>Always run the last form (<code>hf models list &lt;repo_id&gt;</code>) before <code>hf download</code>, to confirm the repo exists and see the exact filename/quant available.</p>

        <h2 style={h2Style}>Checking file sizes before downloading</h2>
        <p style={pStyle}><code>hf download &lt;repo_id&gt; &lt;filename&gt;</code> only downloads the one file you name, not the whole repo — but a GGUF repo typically contains every quantization level of the same model (often 20-30+ files), so it&apos;s important to list files first.</p>
        <pre style={codeStyle}><code>hf models list unsloth/gemma-3-4b-it-GGUF -h</code></pre>
        <pre style={codeStyle}><code>{`      7.8 GB  gemma-3-4b-it-BF16.gguf
      2.4 GB  gemma-3-4b-it-IQ4_NL.gguf
      2.3 GB  gemma-3-4b-it-IQ4_XS.gguf
      1.7 GB  gemma-3-4b-it-Q2_K.gguf
      1.7 GB  gemma-3-4b-it-Q2_K_L.gguf
      2.1 GB  gemma-3-4b-it-Q3_K_M.gguf
      1.9 GB  gemma-3-4b-it-Q3_K_S.gguf
      2.4 GB  gemma-3-4b-it-Q4_0.gguf
      2.6 GB  gemma-3-4b-it-Q4_1.gguf
      2.5 GB  gemma-3-4b-it-Q4_K_M.gguf
      2.4 GB  gemma-3-4b-it-Q4_K_S.gguf
      2.8 GB  gemma-3-4b-it-Q5_K_M.gguf
      2.8 GB  gemma-3-4b-it-Q5_K_S.gguf
      3.2 GB  gemma-3-4b-it-Q6_K.gguf
      4.1 GB  gemma-3-4b-it-Q8_0.gguf
      1.2 GB  gemma-3-4b-it-UD-IQ1_M.gguf
      1.2 GB  gemma-3-4b-it-UD-IQ1_S.gguf
      1.6 GB  gemma-3-4b-it-UD-IQ2_M.gguf
      1.3 GB  gemma-3-4b-it-UD-IQ2_XXS.gguf
      1.7 GB  gemma-3-4b-it-UD-IQ3_XXS.gguf
      1.8 GB  gemma-3-4b-it-UD-Q2_K_XL.gguf
      2.2 GB  gemma-3-4b-it-UD-Q3_K_XL.gguf
      2.5 GB  gemma-3-4b-it-UD-Q4_K_XL.gguf
      2.8 GB  gemma-3-4b-it-UD-Q5_K_XL.gguf
      3.6 GB  gemma-3-4b-it-UD-Q6_K_XL.gguf
      5.2 GB  gemma-3-4b-it-UD-Q8_K_XL.gguf
    851.3 MB  mmproj-BF16.gguf
    851.3 MB  mmproj-F16.gguf
      1.7 GB  mmproj-F32.gguf`}</code></pre>
        <pre style={codeStyle}><code>hf models list Qwen/Qwen2.5-3B-Instruct-GGUF -h</code></pre>
        <pre style={codeStyle}><code>{`      4.0 GB  qwen2.5-3b-instruct-fp16-00001-of-00002.gguf
      2.8 GB  qwen2.5-3b-instruct-fp16-00002-of-00002.gguf
      1.4 GB  qwen2.5-3b-instruct-q2_k.gguf
      1.7 GB  qwen2.5-3b-instruct-q3_k_m.gguf
      2.0 GB  qwen2.5-3b-instruct-q4_0.gguf
      2.1 GB  qwen2.5-3b-instruct-q4_k_m.gguf
      2.4 GB  qwen2.5-3b-instruct-q5_0.gguf
      2.4 GB  qwen2.5-3b-instruct-q5_k_m.gguf
      2.8 GB  qwen2.5-3b-instruct-q6_k.gguf
      3.6 GB  qwen2.5-3b-instruct-q8_0.gguf`}</code></pre>

        <p style={pStyle}><strong>Key takeaway: the total size <code>hf models list -h</code> shows is for the entire repo, not a single download.</strong> <code>hf download &lt;repo&gt; &lt;one-filename&gt;</code> only fetches that one row. Don&apos;t run <code>hf download &lt;repo&gt;</code> without naming a file, or it pulls everything listed (in Gemma&apos;s case, ~68GB across every quant + BF16 + mmproj files).</p>

        <p style={pStyle}><strong>What the quant suffixes mean, briefly:</strong></p>
        <ul style={listStyle}>
          <li>The number after <code>Q</code> is roughly bits-per-weight (<code>Q2</code> ≈ 2-bit, <code>Q8</code> ≈ 8-bit) — lower number = smaller file and faster, but more quality loss.</li>
          <li><code>_K_M</code> / <code>_K_S</code> = &quot;K-quant&quot;, a mixed-precision scheme (M = medium, S = small), generally better quality-per-byte than plain <code>Q4_0</code>/<code>Q4_1</code>.</li>
          <li><code>IQ*</code> = &quot;importance quantization&quot;, newer and even smaller for the same rough quality, at the cost of slightly slower inference.</li>
          <li><code>UD-*</code> (Unsloth Dynamic) = per-layer adaptive quantization, tends to preserve quality better than a same-numbered standard quant.</li>
          <li><code>BF16</code>/<code>F16</code>/<code>F32</code>/<code>fp16</code> = unquantized or near-unquantized full-precision weights — much larger, not what you want for a VRAM-constrained box.</li>
          <li><code>mmproj-*.gguf</code> = the separate vision projector file, only needed for image input (Gemma 3 is multimodal); not needed for text-only chat.</li>
        </ul>

        <table style={tableStyle}>
          <thead>
            <tr><th style={thStyle}>Model</th><th style={thStyle}>File</th><th style={thStyle}>Size</th></tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}>Gemma 3 4B Instruct</td><td style={tdStyle}><code>gemma-3-4b-it-Q4_K_M.gguf</code></td><td style={tdStyle}>2.5GB</td></tr>
            <tr><td style={tdStyle}>Qwen2.5 3B Instruct</td><td style={tdStyle}><code>qwen2.5-3b-instruct-q4_k_m.gguf</code></td><td style={tdStyle}>2.1GB</td></tr>
          </tbody>
        </table>

        <h2 style={h2Style}>Downloading both models</h2>
        <pre style={codeStyle}><code>{`cd ~/llama.cpp/models

hf download unsloth/gemma-3-4b-it-GGUF gemma-3-4b-it-Q4_K_M.gguf --local-dir ~/llama.cpp/models

hf download Qwen/Qwen2.5-3B-Instruct-GGUF qwen2.5-3b-instruct-q4_k_m.gguf --local-dir ~/llama.cpp/models`}</code></pre>

        <p style={pStyle}>Output:</p>
        <pre style={codeStyle}><code>{`gemma-3-4b-it-Q4_K_M.gguf: downloading bytes: 100% 2.49GB, 95.0MB/s
gemma-3-4b-it-Q4_K_M.gguf: reconstructing file: 100% 2.49GB / 2.49GB, 168MB/s
✓ Downloaded
  path: /home/jay/llama.cpp/models/gemma-3-4b-it-Q4_K_M.gguf

qwen2.5-3b-instruct-q4_k_m.gguf: downloading bytes: 100% 2.09GB, 89.8MB/s
qwen2.5-3b-instruct-q4_k_m.gguf: reconstructing file: 100% 2.10GB / 2.10GB, 146MB/s
✓ Downloaded
  path: /home/jay/llama.cpp/models/qwen2.5-3b-instruct-q4_k_m.gguf`}</code></pre>

        <p style={pStyle}><strong>Correction to an earlier assumption:</strong> both downloads succeeded without <code>hf auth login</code> — <code>unsloth/gemma-3-4b-it-GGUF</code> turned out not to be gated (community re-uploads of Gemma weights are often ungated even though Google&apos;s own <code>google/gemma-3-4b-it</code> repo is), and Qwen was never gated. The &quot;Warning: unauthenticated requests&quot; line is just a rate-limit notice, not an auth failure.</p>

        <h2 style={h2Style}>Running both as new systemd services (ports 8002, 8003)</h2>
        <table style={tableStyle}>
          <thead>
            <tr><th style={thStyle}>Service</th><th style={thStyle}>Model</th><th style={thStyle}>Port</th></tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}><code>llama-inference-3.service</code></td><td style={tdStyle}>Gemma 3 4B Instruct (Q4_K_M)</td><td style={tdStyle}>8002</td></tr>
            <tr><td style={tdStyle}><code>llama-inference-4.service</code></td><td style={tdStyle}>Qwen2.5 3B Instruct (Q4_K_M)</td><td style={tdStyle}>8003</td></tr>
          </tbody>
        </table>

        <pre style={codeStyle}><code>sudo vi /etc/systemd/system/llama-inference-3.service</code></pre>
        <pre style={codeStyle}><code>{`[Unit]
Description=Llama Inference Server (Gemma 3 4B Instruct)
After=network.target

[Service]
Type=simple
User=jay
ExecStart=/home/jay/llama.cpp/build/bin/llama-server \\
  -m /home/jay/llama.cpp/models/gemma-3-4b-it-Q4_K_M.gguf \\
  --alias gemma-3-4b-it \\
  --gpu-layers 99 \\
  -c 4096 \\
  --port 8002 \\
  --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target`}</code></pre>

        <pre style={codeStyle}><code>sudo vi /etc/systemd/system/llama-inference-4.service</code></pre>
        <pre style={codeStyle}><code>{`[Unit]
Description=Llama Inference Server (Qwen2.5 3B Instruct)
After=network.target

[Service]
Type=simple
User=jay
ExecStart=/home/jay/llama.cpp/build/bin/llama-server \\
  -m /home/jay/llama.cpp/models/qwen2.5-3b-instruct-q4_k_m.gguf \\
  --alias qwen2.5-3b-instruct \\
  --gpu-layers 99 \\
  -c 4096 \\
  --port 8003 \\
  --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target`}</code></pre>

        <p style={pStyle}><strong>Notes on the flags:</strong></p>
        <ul style={listStyle}>
          <li><code>--alias</code> — sets a short, friendly model name reported via <code>/v1/models</code>. Without it, <code>llama-server</code> reports the full filesystem path (e.g. <code>/home/jay/llama.cpp/models/phi-2.Q4_K_M.gguf</code>) as the model ID, which is what Open WebUI then shows in the picker — ugly, but purely cosmetic, and fixed entirely server-side with this one flag.</li>
          <li><code>--gpu-layers 99</code> requests full GPU offload (more than either model actually has, which is fine — llama.cpp just offloads all of it). Watch <code>nvidia-smi</code> after starting each one; if VRAM runs out, lower this to partially offload instead of failing outright.</li>
          <li><code>-c 4096</code> is well within both models&apos; native trained context (Gemma 3 4B: 128K, Qwen2.5 3B: 32K) — no quality-degradation warning like the phi-2 mistake.</li>
          <li>No <code>--chat-template</code> override — both are properly instruct-tuned models with correct template metadata baked into the GGUF, so the ChatML-leak bug from phi-2 shouldn&apos;t recur here.</li>
        </ul>

        <p style={pStyle}><strong>Starting on demand instead of always-on:</strong> VRAM is tight — the workstation has an 8GB Quadro P4000, phi-2 + TinyLlama already use ~2.9GB, and Gemma 3 4B alone pushed usage to 6711MiB/8116MiB once loaded (its real footprint with KV cache is closer to 3.7GB, not just its 2.5GB file size). Qwen2.5 3B doesn&apos;t fit alongside everything else at once — don&apos;t enable all four services at boot. Load and start only what you&apos;re actively testing:</p>
        <pre style={codeStyle}><code>{`sudo systemctl daemon-reload

# Start whichever one you want to try — not both new ones at once
sudo systemctl start llama-inference-3.service   # Gemma 3 4B
sudo systemctl status llama-inference-3.service
nvidia-smi

# Free VRAM before starting another, e.g. stop TinyLlama (the weakest model) to make room
sudo systemctl stop llama-inference-2.service
sudo systemctl start llama-inference-4.service   # Qwen2.5 3B`}</code></pre>
        <p>If VRAM checks out fine with more than two running at once, <code>sudo systemctl enable llama-inference-3.service</code> (and/or <code>-4</code>) later to make it start at boot like the first pair.</p>

        <h2 style={h2Style}>Wiring new models into Open WebUI</h2>
        <p style={pStyle}>Two ways to add the new <code>:8002</code> / <code>:8003</code> endpoints to <code>open-webui-2</code>:</p>

        <h3 style={h3Style}>Option A: quick, via the Admin UI (no restart needed)</h3>
        <ol style={listStyle}>
          <li>Open <code>http://&lt;workstation-ip&gt;:8081</code>, log in as admin.</li>
          <li>Profile icon (top-right) → Admin Panel → Settings → Connections.</li>
          <li>Under OpenAI API, click <strong>+ Add Connection</strong> and add one entry per new model: URL <code>http://host.docker.internal:8002/v1</code> and <code>http://host.docker.internal:8003/v1</code>, Key <code>sk-not-needed</code> for both.</li>
          <li>Save, then start a new chat — the model picker should list all connected models (only the currently-running <code>llama-server</code> will actually respond).</li>
        </ol>
        <p style={pStyle}>This is stored in the <code>open-webui-2</code> Docker volume, so it survives container restarts — just not a full volume wipe.</p>

        <h3 style={h3Style}>Option B: persistent, baked into the systemd unit</h3>
        <p style={pStyle}>Update the two <code>-e</code> lines in <code>open-webui-2.service</code> to list all four ports, semicolon-separated, then recreate the container. This is more failure-prone to hand-edit (see the mistake below) — Option A is the safer default.</p>

        <h3 style={h3Style}>Mistake: editing the systemd unit broke the container with &quot;invalid reference format&quot;</h3>
        <p style={pStyle}>Editing <code>ExecStart</code> to add the two extra endpoints resulted in:</p>
        <pre style={codeStyle}><code>{`docker: invalid reference format
Run 'docker run --help' for more information
open-webui-2.service: Main process exited, code=exited, status=125/n/a`}</code></pre>
        <p style={pStyle}>&quot;invalid reference format&quot; means the image name argument to <code>docker run</code> got mangled — almost certainly a missing or stray backslash line-continuation left over from a manual edit, so systemd fed <code>docker run</code> a broken argument list where the image reference merged with a neighboring flag.</p>
        <p style={pStyle}><strong>Lesson:</strong> when a multi-line <code>ExecStart</code> with backslash continuations breaks, don&apos;t patch individual lines — replace the whole block from a known-good copy. Every continued line must end with <code>\</code> and nothing after it (no trailing spaces), which is easy to break with in-place `vi` edits. Fix was to paste the complete file back in cleanly rather than hunting for the exact broken character.</p>

        <h2 style={h2Style}>VRAM footprint reference</h2>
        <table style={tableStyle}>
          <thead>
            <tr><th style={thStyle}>State</th><th style={thStyle}>VRAM used</th></tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}>phi-2 + TinyLlama only</td><td style={tdStyle}>2969MiB / 8116MiB</td></tr>
            <tr><td style={tdStyle}>+ Gemma 3 4B (Q4_K_M, <code>-c 4096</code>)</td><td style={tdStyle}>6711MiB / 8116MiB</td></tr>
          </tbody>
        </table>
        <p>
          Loading a 2.5GB weight file added ~3.7GB of actual VRAM usage once KV cache for a 4096-token
          context was included — a useful reminder for planning capacity that the GGUF file size on disk
          is not the same as the runtime VRAM footprint.
        </p>
      </div>
    </main>
  );
}
