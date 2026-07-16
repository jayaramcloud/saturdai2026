# HP Workstation Deployment (Part 2): Second Open WebUI Instance

Follow-up to [`llama-cpp-open-webui-setup.md`](./llama-cpp-open-webui-setup.md). The workstation now runs **two** `llama-server` instances side by side, plus a second, fully isolated Open WebUI pointed at both.

## Architecture

```
                                    ┌─────────┐
                                    │   You   │
                                    │(browser)│
                                    └────┬────┘
                       ┌──────────────────┴──────────────────┐
                       ▼                                       ▼
            ┌───────────────────────┐             ┌───────────────────────┐
            │  open-webui     :8080 │             │  open-webui-2   :8081 │
            └───────────┬────────────┘             └───────────┬────────────┘
                         │                                       │
     ┌───────────────────────────────────────────────────────────────────────────┐
     │  HP Workstation  (Quadro P4000, 8GB VRAM)                                  │
     │                                                                            │
     │   ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐  ┌───────────────────────┐
     │   │ phi-2  :8000│  │ tinyllama   :8001 │  │ gemma-3-4b-it:8002│  │ qwen2.5-3b-instruct:8003│
     │   └─────────────┘  └──────────────────┘  └───────────────────┘  └───────────────────────┘
     │                                                                            │
     └───────────────────────────────────────────────────────────────────────────┘
```

Both Open WebUI instances can reach all four `llama-server` backends (via `OPENAI_API_BASE_URLS`) — which model actually responds depends on which `llama-inference*.service` is running at the time, since VRAM only fits one or two of the four resident at once (see [VRAM footprint reference](#vram-footprint-reference)).

## Current state

```bash
ps -aux | grep llama
```

```
jay  814  /home/jay/llama.cpp/build/bin/llama-server -m tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf --gpu-layers 15 --port 8001 --host 0.0.0.0
jay  815  /home/jay/llama.cpp/build/bin/llama-server -m phi-2.Q4_K_M.gguf                     --gpu-layers 30 --port 8000 --host 0.0.0.0
```

| Service | Model | Port |
|---|---|---|
| `llama-inference.service` | phi-2 (Q4_K_M) | 8000 |
| `llama-inference-2.service` | TinyLlama 1.1B Chat (Q4_K_M) | 8001 |
| `open-webui` (existing) | UI on host network, pointed only at 8000 | — |
| `open-webui-2` (new) | UI on port 8081, pointed at both 8000 and 8001 | 8081 |

The existing `open-webui` container was left untouched (`OLLAMA_BASE_URL=http://127.0.0.1:8000`, host networking). Rather than reconfigure it, a second, isolated instance was added so the original setup stays stable.

## Why a second container, not a reconfigured one

- `--network=host` on the original container means it can't be remapped to a different port without disrupting the running service.
- A dedicated container/volume keeps chat history, users, and settings separate between the two UIs.
- `llama-server` speaks the **OpenAI-compatible API** (`/v1/chat/completions`), not native Ollama — so the new instance is wired up with `OPENAI_API_BASE_URLS` instead of `OLLAMA_BASE_URL`.

## Docker run (manual)

```bash
sudo docker run -d \
  --name open-webui-2 \
  -p 8081:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui-2:/app/backend/data \
  -e OPENAI_API_BASE_URLS="http://host.docker.internal:8000/v1;http://host.docker.internal:8001/v1" \
  -e OPENAI_API_KEYS="sk-not-needed;sk-not-needed" \
  -e ENABLE_OLLAMA_API=false \
  -e DEFAULT_LOCALE=en-US \
  ghcr.io/open-webui/open-webui:main
```

Key flags:

- **No `--network=host`** — isolates it from the existing instance and lets it bind cleanly to `8081`.
- **`--add-host=host.docker.internal:host-gateway`** — since it's not on host networking, the container needs an explicit route back to the host's `127.0.0.1:8000` / `:8001`.
- **`OPENAI_API_BASE_URLS` / `OPENAI_API_KEYS`** — semicolon-separated lists, one entry per backend. `llama-server` doesn't check the API key, so any placeholder value works.
- **`-v open-webui-2:/app/backend/data`** — separate Docker volume from the original `open-webui` volume, so chat history/users don't mix.
- **`DEFAULT_LOCALE=en-US`** — Open WebUI otherwise auto-detects UI language from the browser's `Accept-Language` header; this pins it to English regardless of browser settings. (If it doesn't take effect for an already-created account, set it manually: **Settings → General → Language → English**.)

## systemd service

```bash
sudo vi /etc/systemd/system/open-webui-2.service
```

```ini
[Unit]
Description=Open WebUI (secondary instance, port 8081)
After=network.target docker.service llama-inference.service llama-inference-2.service
Requires=docker.service

[Service]
Type=simple
User=jay
ExecStartPre=-/usr/bin/docker rm -f open-webui-2
ExecStart=/usr/bin/docker run \
  --name open-webui-2 \
  -p 8081:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui-2:/app/backend/data \
  -e OPENAI_API_BASE_URLS="http://host.docker.internal:8000/v1;http://host.docker.internal:8001/v1" \
  -e OPENAI_API_KEYS="sk-not-needed;sk-not-needed" \
  -e ENABLE_OLLAMA_API=false \
  -e DEFAULT_LOCALE=en-US \
  ghcr.io/open-webui/open-webui:main
ExecStop=/usr/bin/docker stop open-webui-2
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo docker rm -f open-webui-2
sudo systemctl daemon-reload
sudo systemctl enable open-webui-2.service
sudo systemctl start open-webui-2.service
sudo systemctl status open-webui-2.service
```

## Verifying

1. Open `http://<workstation-ip>:8081` — should load in English.
2. Log in / sign up.
3. **Settings → Connections** should show both OpenAI-compatible endpoints (`:8000/v1`, `:8001/v1`).
4. In a new chat, the model picker should list both **phi-2** and **TinyLlama 1.1B Chat**.

## Troubleshooting

- **UI loads in the wrong language** — `DEFAULT_LOCALE` only affects new signups on some Open WebUI versions; set the language manually under **Settings → General** for existing accounts.
- **Models don't appear in the picker** — confirm `host.docker.internal` resolves inside the container (`docker exec -it open-webui-2 getent hosts host.docker.internal`); if it doesn't, replace it with the workstation's LAN IP in `OPENAI_API_BASE_URLS` and restart the service.
- **Port conflict on 8081** — check nothing else is bound there first: `sudo ss -tlnp | grep 8081`.

## Mistakes made and lessons learned

### 1. Wrong flag: `--c` instead of `-c`

When bumping TinyLlama's context size, the systemd unit was first edited with:

```
--c 2048
```

`llama-server` doesn't recognize `--c` as a long option — only the short form `-c` (or the long form `--ctx-size`) is valid. A flag typo like this can silently fail to apply rather than erroring loudly, so always double check with `sudo systemctl status <service>` after a restart that the process actually picked up the setting (visible in the `CGroup:` line showing the full command).

**Lesson:** verify flags landed by checking the running process args in `systemctl status`, not just that the service says "active."

### 2. "Context size exceeded" wasn't a GPU/VRAM problem

Early on, Open WebUI threw a "Context size has been exceeded" error, and it was initially unclear whether this meant the GPU had run out of memory. `nvidia-smi` showed plenty of free VRAM (2969MiB / 8116MiB used), which ruled that out immediately.

**Lesson:** "context" in an LLM setup almost always means the model's **token context window** (the `-c` / `--ctx-size` flag on `llama-server`), not GPU memory. Check `nvidia-smi` first to rule out VRAM, then check whether `-c` was ever explicitly set — neither `llama-inference.service` nor `llama-inference-2.service` originally had a `-c` flag, so both were running on llama.cpp's default context size.

### 3. Setting `-c` larger than a model's trained context causes silent quality loss

phi-2 was restarted with `-c 4096`, but phi-2's native trained context is only 2048 tokens. `llama-server` logs a warning for this (`n_ctx_seq (4096) > n_ctx_train (2048)` / `GENERATION QUALITY WILL BE DEGRADED!`), but the service still starts and looks healthy in `systemctl status` — there's no hard failure.

**Lesson:** a "successfully running" service isn't the same as a **correctly configured** one. Read the startup log lines, not just the `Active: running` status — llama.cpp will happily run a model past its trained context and just produce worse output instead of refusing to start.

### 4. ChatML tokens (`<|im_start|>` / `<|im_end|>`) leaking into responses

phi-2 is a base/instruct model, not a chat-tuned model — it was never trained on ChatML formatting. `llama-server` was nonetheless applying a ChatML-style chat template, and because phi-2's tokenizer doesn't treat `<|im_end|>` as a real stop token, the model didn't stop generating at the end of its answer — it kept going and hallucinated a fake next user turn, printing the literal control tokens as visible text.

**Lesson:** the chat template used to format a model's prompt has to match how that specific model was actually trained/tuned. Applying a generic template (e.g. ChatML) to a model that wasn't trained on it doesn't error — it produces subtly broken output that only shows up once you're mid-conversation. Fix by adding the missing stop sequence explicitly (`--reverse-prompt "<|im_end|>"` server-side, or a Stop Sequence in Open WebUI's per-model Advanced Params) rather than assuming the default template is correct.

### 5. Picking models: chat-tuned beats base/completion models for a chat UI

Both mistakes #3 and #4 trace back to the same root cause: phi-2 and (to a lesser extent) TinyLlama are small/older models not designed for open-ended multi-turn chat. Moving to a properly instruct/chat-tuned current-generation model (e.g. Gemma 3 4B Instruct) avoids both the training-context mismatch and the chat-template mismatch by construction, since those models ship with a template that actually matches their training.

**Lesson:** when picking a model for a chat UI, prioritize "instruct/chat-tuned" variants over base/completion models of the same size — it avoids a whole class of formatting and stop-token bugs, not just a capability upgrade.

### 6. Guessing model repo IDs (and trusting a fetched page) leads to broken/fake downloads

`hf download google/gemma-3-4b-it-GGUF ...` failed with "Repository not found" — Google doesn't publish a bare `-GGUF` repo under that name; GGUF conversions live in separate repos (official QAT quants, or community quantizers like `unsloth`, `bartowski`, `ggml-org`). Separately, a fetched page for a guessed URL (`google/gemma-4-E4B-it`) came back describing a plausible-sounding model — but the description was nearly identical to the real, *different* model **Gemma 3n E4B**, strongly suggesting either a wrong URL or a hallucinated summary. There is no known "Gemma 4" family.

**Lesson:** never guess Hugging Face repo IDs and run `hf download` directly against the guess. Always resolve the exact repo ID first (browser search, or `hf models list --search ...`, see below), and treat any single fetched page describing a model as unverified until it's confirmed to actually render in a browser — a suspiciously familiar-sounding spec (matching a different real model almost verbatim) is a red flag for a wrong URL or a fabricated summary, not confirmation.

### 7. `hf search` doesn't exist — the real command is `hf models list`

Guessed at `hf search <query>` based on convention from other CLIs; the actual `hf` CLI has no `search` subcommand. The correct tool is `hf models list` (alias `hf models ls`), which supports `--search`, `--author`, `--filter`, `--num-parameters`, `--gated/--no-gated`, `--apps`, and sorting/limit flags — see [How to search Hugging Face from the CLI](#how-to-search-hugging-face-from-the-cli) below.

**Lesson:** check `<command> --help` (or the parent's `--help` to list subcommands) before running an invented command — CLI tools don't always follow the naming conventions you'd expect from a different tool.

## How to search Hugging Face from the CLI

`hf models list` (alias `hf models ls`) is the real search command — there is no `hf search`.

```bash
# Search by keyword
hf models list --search "gemma-3-4b-it gguf" --sort downloads --limit 10

# Search restricted to a specific publisher (e.g. only Google's own repos)
hf models list --search "gemma-3-4b-it" --author google --sort downloads

# Search restricted to models runnable by llama.cpp specifically
hf models list --search "gemma-3-4b" --apps llama.cpp --sort downloads --limit 10

# Search by parameter count range instead of a name (e.g. anything 2B-5B, good for a 3GB VRAM budget)
hf models list --search "instruct gguf" --num-parameters min:2B,max:5B --sort downloads

# Qwen models specifically
hf models list --search "qwen2.5 instruct gguf" --sort downloads --limit 10

# List the actual files/quant sizes inside a specific repo before downloading
hf models list unsloth/gemma-3-4b-it-GGUF
hf models list Qwen/Qwen2.5-7B-Instruct-GGUF
```

Always run the last form (`hf models list <repo_id>`) before `hf download`, to confirm the repo exists and see the exact filename/quant available — this would have caught both mistake #6 problems before wasting a download attempt.

## Checking file sizes before downloading

`hf download <repo_id> <filename>` only downloads the **one file you name**, not the whole repo — but a GGUF repo typically contains every quantization level of the same model (often 20-30+ files), so it's important to list files first and pick a specific one rather than downloading the bare repo (which would pull everything, tens of GB).

```bash
hf models list unsloth/gemma-3-4b-it-GGUF -h
```

```
      3.9 KB         May 09 02:28  .gitattributes
     25.0 KB         Mar 12 11:08  README.md
      1.7 KB         May 09 02:21  config.json
      7.8 GB         Apr 25 02:40  gemma-3-4b-it-BF16.gguf
      2.4 GB         May 09 10:38  gemma-3-4b-it-IQ4_NL.gguf
      2.3 GB         May 09 10:38  gemma-3-4b-it-IQ4_XS.gguf
      1.7 GB         May 09 10:35  gemma-3-4b-it-Q2_K.gguf
      1.7 GB         May 09 10:38  gemma-3-4b-it-Q2_K_L.gguf
      2.1 GB         May 09 10:35  gemma-3-4b-it-Q3_K_M.gguf
      1.9 GB         May 09 10:38  gemma-3-4b-it-Q3_K_S.gguf
      2.4 GB         May 09 10:38  gemma-3-4b-it-Q4_0.gguf
      2.6 GB         May 09 10:38  gemma-3-4b-it-Q4_1.gguf
      2.5 GB         May 09 10:35  gemma-3-4b-it-Q4_K_M.gguf
      2.4 GB         May 09 10:41  gemma-3-4b-it-Q4_K_S.gguf
      2.8 GB         May 09 10:35  gemma-3-4b-it-Q5_K_M.gguf
      2.8 GB         May 09 10:41  gemma-3-4b-it-Q5_K_S.gguf
      3.2 GB         May 09 10:35  gemma-3-4b-it-Q6_K.gguf
      4.1 GB         May 09 10:44  gemma-3-4b-it-Q8_0.gguf
      1.2 GB         May 09 10:33  gemma-3-4b-it-UD-IQ1_M.gguf
      1.2 GB         May 09 10:33  gemma-3-4b-it-UD-IQ1_S.gguf
      1.6 GB         May 09 10:33  gemma-3-4b-it-UD-IQ2_M.gguf
      1.3 GB         May 09 10:35  gemma-3-4b-it-UD-IQ2_XXS.gguf
      1.7 GB         May 09 10:33  gemma-3-4b-it-UD-IQ3_XXS.gguf
      1.8 GB         May 09 10:33  gemma-3-4b-it-UD-Q2_K_XL.gguf
      2.2 GB         May 09 10:33  gemma-3-4b-it-UD-Q3_K_XL.gguf
      2.5 GB         May 09 10:33  gemma-3-4b-it-UD-Q4_K_XL.gguf
      2.8 GB         May 09 10:41  gemma-3-4b-it-UD-Q5_K_XL.gguf
      3.6 GB         May 09 10:41  gemma-3-4b-it-UD-Q6_K_XL.gguf
      5.2 GB         May 09 10:41  gemma-3-4b-it-UD-Q8_K_XL.gguf
      3.4 MB         May 09 10:44  imatrix_unsloth.dat
    851.3 MB         May 09 02:31  mmproj-BF16.gguf
    851.3 MB         May 09 02:21  mmproj-F16.gguf
      1.7 GB         May 09 02:21  mmproj-F32.gguf
       201 B         Mar 16 00:01  params
       476 B         Aug 14 19:57  template
```

```bash
hf models list Qwen/Qwen2.5-3B-Instruct-GGUF -h
```

```
      1.6 KB         Sep 18 06:29  .gitattributes
      7.4 KB         Sep 18 14:00  LICENSE
      4.9 KB         Sep 18 15:14  README.md
      4.0 GB         Sep 20 06:34  qwen2.5-3b-instruct-fp16-00001-of-00002.gguf
      2.8 GB         Sep 20 06:34  qwen2.5-3b-instruct-fp16-00002-of-00002.gguf
      1.4 GB         Sep 18 06:29  qwen2.5-3b-instruct-q2_k.gguf
      1.7 GB         Sep 18 06:29  qwen2.5-3b-instruct-q3_k_m.gguf
      2.0 GB         Sep 18 06:29  qwen2.5-3b-instruct-q4_0.gguf
      2.1 GB         Sep 18 06:29  qwen2.5-3b-instruct-q4_k_m.gguf
      2.4 GB         Sep 18 06:29  qwen2.5-3b-instruct-q5_0.gguf
      2.4 GB         Sep 18 06:29  qwen2.5-3b-instruct-q5_k_m.gguf
      2.8 GB         Sep 18 06:29  qwen2.5-3b-instruct-q6_k.gguf
      3.6 GB         Sep 18 06:29  qwen2.5-3b-instruct-q8_0.gguf
```

**Key takeaway: the total size `hf models list -h` shows is for the entire repo, not a single download.** `hf download <repo> <one-filename>` only fetches that one row. Don't run `hf download <repo>` without naming a file, or it pulls everything listed (in Gemma's case, ~68GB across every quant + BF16 + mmproj files).

**What the quant suffixes mean, briefly (useful for teaching):**
- The number after `Q` is roughly bits-per-weight (`Q2` ≈ 2-bit, `Q8` ≈ 8-bit) — lower number = smaller file and faster, but more quality loss.
- `_K_M` / `_K_S` = "K-quant", a mixed-precision scheme (M = medium, S = small) that's generally better quality-per-byte than plain `Q4_0`/`Q4_1`.
- `IQ*` = "importance quantization", newer and even smaller for the same rough quality, at the cost of slightly slower inference.
- `UD-*` (Unsloth Dynamic) = per-layer adaptive quantization, tends to preserve quality better than a same-numbered standard quant.
- `BF16`/`F16`/`F32`/`fp16` = unquantized or near-unquantized full-precision weights — much larger, not what you want for a VRAM-constrained box.
- `mmproj-*.gguf` = the separate vision projector file, only needed if you want to feed the model images (Gemma 3 is multimodal); not needed for text-only chat.

**Picks for a ~3GB VRAM budget:**

| Model | File | Size |
|---|---|---|
| Gemma 3 4B Instruct | `gemma-3-4b-it-Q4_K_M.gguf` | 2.5GB |
| Qwen2.5 3B Instruct | `qwen2.5-3b-instruct-q4_k_m.gguf` | 2.1GB |

Both leave room for KV cache at a reasonable `-c` context size. Qwen2.5 3B leaves more headroom (smaller weight file) but is a smaller/less capable model than Gemma 3 4B; Gemma 3 4B is the stronger pick if the extra ~400MB fits comfortably alongside the two existing servers.

## Downloading both models

```bash
cd ~/llama.cpp/models

hf download unsloth/gemma-3-4b-it-GGUF gemma-3-4b-it-Q4_K_M.gguf --local-dir ~/llama.cpp/models

hf download Qwen/Qwen2.5-3B-Instruct-GGUF qwen2.5-3b-instruct-q4_k_m.gguf --local-dir ~/llama.cpp/models
```

Output:

```
hf download unsloth/gemma-3-4b-it-GGUF gemma-3-4b-it-Q4_K_M.gguf --local-dir ~/llama.cpp/models
Warning: You are sending unauthenticated requests to the HF Hub. Please set a HF_TOKEN to enable higher rate limits and faster downloads.
gemma-3-4b-it-Q4_K_M.gguf: downloading bytes: 100% 2.49GB, 95.0MB/s
gemma-3-4b-it-Q4_K_M.gguf: reconstructing file: 100% 2.49GB / 2.49GB, 168MB/s
✓ Downloaded
  path: /home/jay/llama.cpp/models/gemma-3-4b-it-Q4_K_M.gguf

hf download Qwen/Qwen2.5-3B-Instruct-GGUF qwen2.5-3b-instruct-q4_k_m.gguf --local-dir ~/llama.cpp/models
Warning: You are sending unauthenticated requests to the HF Hub. Please set a HF_TOKEN to enable higher rate limits and faster downloads.
qwen2.5-3b-instruct-q4_k_m.gguf: downloading bytes: 100% 2.09GB, 89.8MB/s
qwen2.5-3b-instruct-q4_k_m.gguf: reconstructing file: 100% 2.10GB / 2.10GB, 146MB/s
✓ Downloaded
  path: /home/jay/llama.cpp/models/qwen2.5-3b-instruct-q4_k_m.gguf
```

**Correction to an earlier assumption:** both downloads succeeded without `hf auth login` — `unsloth/gemma-3-4b-it-GGUF` turned out not to be gated (community re-uploads of Gemma weights are often ungated even though Google's own `google/gemma-3-4b-it` repo is), and Qwen was never gated. The "Warning: unauthenticated requests" line is just a rate-limit notice, not an auth failure — worth teaching students the difference between an informational warning and an actual blocking error.

## Running both as new systemd services (ports 8002, 8003)

Following the existing naming convention (`llama-inference.service` = phi-2:8000, `llama-inference-2.service` = TinyLlama:8001):

| Service | Model | Port |
|---|---|---|
| `llama-inference-3.service` | Gemma 3 4B Instruct (Q4_K_M) | 8002 |
| `llama-inference-4.service` | Qwen2.5 3B Instruct (Q4_K_M) | 8003 |

```bash
sudo vi /etc/systemd/system/llama-inference-3.service
```

```ini
[Unit]
Description=Llama Inference Server (Gemma 3 4B Instruct)
After=network.target

[Service]
Type=simple
User=jay
ExecStart=/home/jay/llama.cpp/build/bin/llama-server \
  -m /home/jay/llama.cpp/models/gemma-3-4b-it-Q4_K_M.gguf \
  --gpu-layers 99 \
  -c 4096 \
  --port 8002 \
  --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo vi /etc/systemd/system/llama-inference-4.service
```

```ini
[Unit]
Description=Llama Inference Server (Qwen2.5 3B Instruct)
After=network.target

[Service]
Type=simple
User=jay
ExecStart=/home/jay/llama.cpp/build/bin/llama-server \
  -m /home/jay/llama.cpp/models/qwen2.5-3b-instruct-q4_k_m.gguf \
  --gpu-layers 99 \
  -c 4096 \
  --port 8003 \
  --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Notes on the flags:
- **`--gpu-layers 99`** requests full GPU offload (more than either model actually has, which is fine — llama.cpp just offloads all of it). Watch `nvidia-smi` after starting each one; if VRAM runs out, lower this to partially offload instead of failing outright (see [`hp laptop.md`](./hp%20laptop.md) for the pattern of sweeping `-ngl` down until it fits).
- **`-c 4096`** is well within both models' native trained context (Gemma 3 4B: 128K, Qwen2.5 3B: 32K) — no quality-degradation warning like the phi-2 mistake, but also not using their full context window; raise it later once VRAM headroom is confirmed.
- **No `--chat-template` override** — both are properly instruct-tuned models with correct template metadata baked into the GGUF, so the ChatML-leak bug from phi-2 (mistake #4) shouldn't recur here.

**Starting on demand instead of always-on:** since VRAM is tight with four models' worth of weights (phi-2 + TinyLlama already resident, ~2.9GB, plus these two would add another ~4.6GB — likely won't all fit at once on an 8GB card), don't `enable` these two the way the first pair are enabled at boot. Load and start only the one you're actively testing:

```bash
sudo systemctl daemon-reload

# Start whichever one you want to try — not both at once, and not enabled at boot
sudo systemctl start llama-inference-3.service   # Gemma 3 4B
sudo systemctl status llama-inference-3.service

# When done testing, free the VRAM before starting the other
sudo systemctl stop llama-inference-3.service
sudo systemctl start llama-inference-4.service   # Qwen2.5 3B
```

If VRAM checks out fine with more than two running at once (watch `nvidia-smi` while starting), `sudo systemctl enable llama-inference-3.service` (and/or `-4`) later to make it start at boot like the first pair.
