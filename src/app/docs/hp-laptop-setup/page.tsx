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

export default function HpLaptopSetup() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-14</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Running Local LLMs on the HP Laptop (llama.cpp + CUDA)
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          A log of setting up <code>llama.cpp</code> on the HP laptop, downloading a Ministral 3B
          model, rebuilding with CUDA GPU support, and tuning GPU layer offload to fit the laptop&apos;s
          VRAM.
        </p>

        <h2 style={h2Style}>1. Set up the models directory</h2>
        <pre style={codeStyle}><code>{`mkdir -p ../model
mv ../model ../models
cd ../models/
ls`}</code></pre>
        <p style={pStyle}>(Fixing a typo — <code>model</code> was created first, then renamed to <code>models</code>.)</p>

        <h2 style={h2Style}>2. Download a model</h2>
        <p style={pStyle}><strong>Attempt 1: direct wget from a TheBloke GGUF repo</strong></p>
        <pre style={codeStyle}><code>wget https://huggingface.co/TheBloke/Ministral-3-3B-Instruct-GGUF/resolve/main/Ministral-3-3B-Instruct.Q4_K_M.gguf</code></pre>
        <p style={pStyle}>
          This repo/file didn&apos;t resolve, so the download was retried via the Hugging Face CLI
          instead.
        </p>

        <p style={pStyle}><strong>Attempt 2: Hugging Face CLI</strong></p>
        <pre style={codeStyle}><code>{`pip install huggingface-hub
pip3 install huggingface-hub
sudo apt install python3-pip
pip3 install huggingface-hub

# Debian/Ubuntu blocks system-wide pip installs by default — override it
pip3 install huggingface-hub --break-system-packages`}</code></pre>
        <p style={pStyle}>
          Download the model (from the official <code>mistralai</code> repo, Q8_0 quantization) using
          the <code>hf</code> CLI:
        </p>
        <pre style={codeStyle}><code>hf download hf://mistralai/Ministral-3-3B-Instruct-2512-GGUF/Ministral-3-3B-Instruct-2512-Q8_0.gguf</code></pre>
        <p style={pStyle}>
          Hugging Face CLI downloads land in the local HF cache, not the working directory — locate
          the file:
        </p>
        <pre style={codeStyle}><code>{`# Verify it downloaded
ls -lh ~/.cache/huggingface/hub/models--mistralai--Ministral-3-3B-Instruct-2512-GGUF/snapshots/*/Ministral-3-3B-Instruct-2512-Q8_0.gguf

# Or find it
find ~/.cache/huggingface -name "Ministral-3-3B-Instruct-2512-Q8_0.gguf"`}</code></pre>
        <p style={pStyle}>
          Copy it into <code>llama.cpp</code>&apos;s own <code>models/</code> directory for
          convenience:
        </p>
        <pre style={codeStyle}><code>{`cp ~/.cache/huggingface/hub/models--mistralai--Ministral-3-3B-Instruct-2512-GGUF/snapshots/eb599d408350ea2bb60452cb86be7c7b2fc28227/Ministral-3-3B-Instruct-2512-Q8_0.gguf ~/llama.cpp/models/

ls -lh ~/llama.cpp/models/Ministral-3-3B-Instruct-2512-Q8_0.gguf`}</code></pre>

        <h2 style={h2Style}>3. First run: CPU only</h2>
        <p style={pStyle}>
          Before building with CUDA, run the server against the CPU build to confirm the model loads
          (<code>-ngl 0</code> = zero GPU layers offloaded):
        </p>
        <pre style={codeStyle}><code>{`cd ../build/
./bin/llama-server -m ~/.cache/huggingface/hub/models--mistralai--Ministral-3-3B-Instruct-2512-GGUF/snapshots/*/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 0

ps -aux | grep llama`}</code></pre>

        <h2 style={h2Style}>4. Rebuild llama.cpp with CUDA support</h2>
        <p style={pStyle}>
          Preserve the working CPU build under a new name, then start a fresh CUDA build:
        </p>
        <pre style={codeStyle}><code>{`cd ..
mv build build.cpu
mkdir build
cd build
cmake .. -DLLAMA_CUDA=1
cmake --build . --config Release -j$(nproc)`}</code></pre>
        <p style={pStyle}>The CUDA toolkit wasn&apos;t installed yet, so this build failed. Install it:</p>
        <pre style={codeStyle}><code>{`sudo apt update
sudo apt install -y nvidia-cuda-toolkit nvidia-cuda-dev
nvcc --version`}</code></pre>
        <p style={pStyle}>
          The older <code>-DLLAMA_CUDA</code> flag didn&apos;t take effect cleanly, so the build was
          started over with the current <code>GGML_CUDA</code> flag:
        </p>
        <pre style={codeStyle}><code>{`cd ..
rm -rf build
mkdir build
cd build
cmake .. -DGGML_CUDA=1
cmake --build . --config Release -j$(nproc)`}</code></pre>

        <h2 style={h2Style}>5. Run with full GPU offload</h2>
        <pre style={codeStyle}><code>./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 99</code></pre>
        <p style={pStyle}>
          <code>-ngl 99</code> requests as many layers offloaded to GPU as the model has (effectively
          &quot;all of them&quot;).
        </p>

        <h2 style={h2Style}>6. Tune GPU layer offload to fit VRAM</h2>
        <p style={pStyle}>
          On a laptop GPU, offloading every layer at a large context size can exceed available VRAM.
          The <code>-ngl</code> (number of GPU layers) and <code>-c</code> (context size) flags were
          swept to find a stable combination:
        </p>
        <pre style={codeStyle}><code>{`./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 25
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 5
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 10
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 20
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 15

# Larger context, re-testing lower ngl values
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 16000 -ngl 20
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 16000 -ngl 15
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 16000 -ngl 10`}</code></pre>
        <p style={pStyle}>
          While each configuration ran, GPU/CPU/memory usage was monitored to see what fit:
        </p>
        <pre style={codeStyle}><code>{`nvidia-smi
top
free -h`}</code></pre>

        <h2 style={h2Style}>7. Confirm the process</h2>
        <pre style={codeStyle}><code>{`cd llama.cpp/
cd build
cd bin/
./llama-server -h    # review available flags

ps -aux | grep llama
uptime`}</code></pre>

        <h2 style={h2Style}>Summary</h2>
        <ul style={listStyle}>
          <li><strong>hf download</strong> — Pull GGUF weights (Ministral 3B, Q8_0) from Hugging Face</li>
          <li><strong>cmake .. (default)</strong> — Baseline CPU build to confirm the model loads and runs</li>
          <li><strong>cmake .. -DGGML_CUDA=1</strong> — Rebuild with CUDA offload support</li>
          <li><strong>-ngl</strong> — Number of model layers offloaded to GPU — tune down if VRAM is limited</li>
          <li><strong>-c</strong> — Context window size in tokens — larger context uses more VRAM/RAM</li>
        </ul>
        <p>
          <strong>Key lesson from this laptop&apos;s tuning pass:</strong> unlike a desktop GPU with
          headroom to spare, the laptop&apos;s GPU needed <code>-ngl</code> swept manually (5 → 25)
          against different <code>-c</code> values to find a combination that didn&apos;t run out of
          VRAM, rather than defaulting straight to <code>-ngl 99</code>.
        </p>
      </div>
    </main>
  );
}
