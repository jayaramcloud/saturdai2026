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
const pStyle: CSSProperties = { marginBottom: "1.5rem" };
const listStyle: CSSProperties = { marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: 1.8 };

export default function LlamaCppOpenWebuiSetup() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-14</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Running Local LLMs with llama.cpp, CUDA, and Open WebUI
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A step-by-step log of setting up GPU-accelerated local inference with <code>llama.cpp</code>,
          exposing it as an OpenAI-compatible server, fronting it with Open WebUI, and making the box
          reachable remotely via Tailscale and SSH.
        </p>
        <p style={pStyle}>
          <strong>Hardware context:</strong> NVIDIA GPU with 8GB VRAM, CUDA 11.4 toolkit.
        </p>

        <h2 style={h2Style}>1. Verify CUDA is installed</h2>
        <pre style={codeStyle}><code>nvcc --version</code></pre>
        <p style={pStyle}>Confirms the CUDA toolkit version before building llama.cpp with GPU support.</p>

        <h2 style={h2Style}>2. Build llama.cpp with CUDA support</h2>
        <pre style={codeStyle}><code>{`cd ~/llama.cpp/build
cmake .. -DLLAMA_CUDA=ON`}</code></pre>
        <p style={pStyle}>
          If the build config is stale or CUDA isn&apos;t picked up, clear the CMake cache and rebuild,
          pointing explicitly at the CUDA 11.4 toolkit path:
        </p>
        <pre style={codeStyle}><code>{`rm -rf CMakeCache.txt CMakeFiles
cmake .. -DGGML_CUDA=ON -DCUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda-11.4
make -j4`}</code></pre>
        <p style={pStyle}>
          <strong>Note:</strong> the CMake flag changed from <code>LLAMA_CUDA</code> to{" "}
          <code>GGML_CUDA</code> in newer llama.cpp versions — use <code>GGML_CUDA</code> if the first
          attempt doesn&apos;t pick up the GPU.
        </p>
        <p style={pStyle}>Verify the GPU offload flag is available in the built binary:</p>
        <pre style={codeStyle}><code>./bin/llama-cli --help | grep -i gpu-layers</code></pre>

        <h2 style={h2Style}>3. Download models</h2>
        <pre style={codeStyle}><code>cd ~/llama.cpp/models</code></pre>

        <p style={pStyle}><strong>Option A: direct download with wget</strong></p>
        <pre style={codeStyle}><code>{`# Mistral 7B, Q4 quantized (~4GB, fits in a 4GB+ VRAM card)
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/Mistral-7B-Instruct-v0.1.Q4_K_M.gguf`}</code></pre>

        <p style={pStyle}><strong>Option B: Hugging Face CLI</strong></p>
        <pre style={codeStyle}><code>{`sudo apt install python3-pip
pip3 install -U "huggingface_hub[cli]"

# Add the pip user bin directory to PATH permanently
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

hf download TheBloke/phi-2-GGUF phi-2.Q4_K_M.gguf --local-dir ~/llama.cpp/models`}</code></pre>

        <h2 style={h2Style}>4. Run inference from the CLI</h2>
        <pre style={codeStyle}><code>{`cd ~/llama.cpp/build/bin
./llama-cli -m ../../models/phi-2.Q4_K_M.gguf \\
  -p "Explain machine learning" \\
  -n 50 \\
  --gpu-layers 20 \\
  -c 2048`}</code></pre>
        <p style={pStyle}>
          Once the smaller model (phi-2, on a 4GB card) works, test the larger 7B model on an 8GB card:
        </p>
        <pre style={codeStyle}><code>{`./bin/llama-cli -m ../models/Mistral-7B-Instruct-v0.1.Q4_K_M.gguf \\
  -p "What is machine learning?" \\
  -n 100 \\
  --gpu-layers 30 \\
  -c 2048`}</code></pre>
        <p style={pStyle}>Check GPU utilization and VRAM usage while a model is loaded:</p>
        <pre style={codeStyle}><code>nvidia-smi</code></pre>

        <h2 style={h2Style}>5. Run llama.cpp as a background server</h2>
        <p style={pStyle}>
          Quick, ad-hoc way to run the OpenAI-compatible server in the background:
        </p>
        <pre style={codeStyle}><code>{`cd ~/llama.cpp/build
nohup ./bin/llama-server -m ../models/phi-2.Q4_K_M.gguf \\
  --gpu-layers 30 \\
  --port 8000 \\
  --host 0.0.0.0 > llama-server.log 2>&1 &`}</code></pre>

        <h2 style={h2Style}>6. Make it a systemd service (llama.cpp)</h2>
        <p style={pStyle}>
          For something that survives reboots and restarts on failure, create a systemd unit:
        </p>
        <pre style={codeStyle}><code>sudo vi /etc/systemd/system/llama-inference.service</code></pre>
        <p style={pStyle}>Example unit file:</p>
        <pre style={codeStyle}><code>{`[Unit]
Description=llama.cpp inference server
After=network.target

[Service]
Type=simple
User=<your-user>
WorkingDirectory=/home/<your-user>/llama.cpp/build
ExecStart=/home/<your-user>/llama.cpp/build/bin/llama-server \\
  -m /home/<your-user>/llama.cpp/models/phi-2.Q4_K_M.gguf \\
  --gpu-layers 30 --port 8000 --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target`}</code></pre>
        <p style={pStyle}>Enable and start it:</p>
        <pre style={codeStyle}><code>{`sudo systemctl daemon-reload
sudo systemctl enable llama-inference.service
sudo systemctl start llama-inference.service
sudo systemctl status llama-inference.service`}</code></pre>

        <h2 style={h2Style}>7. Install Open WebUI</h2>
        <p style={pStyle}><strong>Option A: systemd-managed</strong> (if running Open WebUI natively/pip-installed)</p>
        <pre style={codeStyle}><code>{`sudo vi /etc/systemd/system/open-webui.service
sudo systemctl daemon-reload
sudo systemctl enable open-webui.service
sudo systemctl start open-webui.service
sudo systemctl status open-webui.service`}</code></pre>

        <p style={pStyle}><strong>Option B: Docker</strong></p>
        <pre style={codeStyle}><code>{`sudo apt install -y docker.io

# Point Open WebUI at the local llama.cpp server (adjust port to match your server)
sudo docker run -d --name open-webui -p 3000:8080 \\
  -e OLLAMA_BASE_URLS=http://localhost:8000 \\
  ghcr.io/open-webui/open-webui:latest`}</code></pre>
        <p style={pStyle}>
          <code>--network host</code> is an alternative if you want the container to share the host&apos;s
          network namespace directly instead of publishing a port:
        </p>
        <pre style={codeStyle}><code>{`sudo docker run -d --network host \\
  -e OLLAMA_BASE_URLS=http://localhost:11434 \\
  ghcr.io/open-webui/open-webui:latest`}</code></pre>
        <p style={pStyle}>
          Open WebUI is now reachable at <code>http://&lt;host&gt;:3000</code>.
        </p>

        <h2 style={h2Style}>8. Remote access: Tailscale</h2>
        <pre style={codeStyle}><code>{`sudo apt install curl
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up`}</code></pre>
        <p style={pStyle}>
          Follow the printed auth link to join the box to your tailnet, then reach it from anywhere at
          its Tailscale IP/hostname.
        </p>

        <h2 style={h2Style}>9. Remote access: SSH</h2>
        <pre style={codeStyle}><code>{`sudo apt install -y openssh-server
sudo systemctl enable ssh
sudo systemctl start ssh

# Verify it's running and listening
sudo systemctl status ssh
sudo ss -tlnp | grep ssh

hostname -I
uname -a`}</code></pre>

        <h2 style={h2Style}>10. Optional: remote desktop</h2>
        <pre style={codeStyle}><code>{`gsettings set org.gnome.desktop.remote-access enabled true

# Keep SSH available as the secure transport
sudo systemctl enable ssh
sudo systemctl start ssh`}</code></pre>

        <h2 style={h2Style}>11. Useful checks</h2>
        <pre style={codeStyle}><code>{`df -h              # disk space (models are large — check before downloading more)
ls -lh ~/llama.cpp/models/   # see downloaded model sizes
nvidia-smi          # GPU status
reboot              # apply changes that require a restart, e.g. new systemd services`}</code></pre>

        <h2 style={h2Style}>Summary</h2>
        <ul style={listStyle}>
          <li><strong>llama-server</strong> (port 8000) — GPU-accelerated GGUF model inference, OpenAI-compatible API</li>
          <li><strong>Open WebUI</strong> (port 3000) — Chat UI on top of the inference server</li>
          <li><strong>Tailscale</strong> — Private remote network access</li>
          <li><strong>SSH</strong> (port 22) — Remote shell access</li>
        </ul>
        <p>
          End-to-end, this turns a single GPU box into a private, remotely-reachable ChatGPT-style
          inference server: <code>llama.cpp</code> handles quantized model inference on the GPU,{" "}
          <code>llama-server</code> exposes it over HTTP, Open WebUI gives it a browser UI, and
          Tailscale/SSH make it reachable from anywhere without exposing ports to the public internet.
        </p>
      </div>
    </main>
  );
}
