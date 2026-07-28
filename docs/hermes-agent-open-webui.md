# Adding a Hermes agent alongside Open WebUI

We already run several `llama-server` instances on the `jay-z820` workstation (Quadro P4000, 8GB VRAM) fronted by Open WebUI, plus an `mcpo` bridge that exposes MCP tools (like `get_current_time`) as an OpenAPI Tool Server. This doc adds [NousResearch's Hermes](https://huggingface.co/NousResearch/Hermes-3-Llama-3.2-3B-GGUF), a model trained specifically for structured function/tool calling, so students can watch a local model actually *decide to call a tool* instead of just chatting.

Every command below is logged verbatim, in the order it was actually run, including the wrong turns.

## 1. Recon: is there room for another model?

```
nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free --format=csv
systemctl list-units --type=service --state=running | grep -iE 'llama|webui|mcpo'
ss -tlnp | grep -E ':(8000|8001|8002|8081|8050)'
df -h /home
ls /etc/systemd/system/ | grep -iE 'llama|webui|mcpo'
```

**Result:** the P4000 had only **1.35GB VRAM free** out of 8GB — Gemma 3 4B, Qwen2.5 3B, and TinyLlama were already loaded (`llama-inference-gemma-3.service`, `llama-inference-qwen.service`, `llama-inference-tinyllama.service`). A `phi-2` unit exists but was inactive. `mcpo-time.service` and `open-webui.service` were also running.

**Gotcha:** don't assume "there's a GPU, so use it" — check `nvidia-smi` free memory *first*. An 8B model at Q4 (~4.9GB) would not have fit next to the existing three models.

```
free -h
nproc
systemctl status llama-inference-phi-2.service --no-pager
cat /etc/systemd/system/llama-inference-gemma-3.service
cat /etc/systemd/system/llama-inference-qwen.service
cat /etc/systemd/system/llama-inference-tinyllama.service
cat /etc/systemd/system/llama-inference-phi-2.service
```

The box has 46GB RAM (31GB free) and 16 CPU cores — plenty of headroom to run a small model on CPU instead of fighting for the last sliver of VRAM.

```
sudo ss -tlnp | grep -E ':(8000|8080|8081|8082)'
cat /etc/systemd/system/open-webui.service
cat /etc/systemd/system/open-webui-2.service
```

Two Open WebUI containers run: `open-webui` (port 8000, `--network=host`) and `open-webui-2` (port 8081, the one students actually use, reachable at `192.168.1.92:8081`). `open-webui-2` reaches the host via `host.docker.internal` (it's started with `--add-host=host.docker.internal:host-gateway`).

Ports in use: `8000` (chroma/open-webui), `8001` TinyLlama, `8002` Gemma 3, `8003` Qwen2.5, `8050` mcpo, `8081` Open WebUI (secondary), `8101` phi-2 (disabled). **8004 is free** — used for Hermes below.

## 2. Picking a model that actually fits

Given the VRAM situation, an 8B Hermes (the usual recommendation) was out. Checked Hugging Face for smaller official quantized Hermes releases rather than guessing a repo name:

```
curl -s "https://huggingface.co/api/models?search=Hermes-3-Llama-3.2-3B&limit=20"
curl -s "https://huggingface.co/api/models/NousResearch/Hermes-3-Llama-3.2-3B-GGUF"
```

Picked **`NousResearch/Hermes-3-Llama-3.2-3B-GGUF`** (the official quant repo, not a third-party mirror), quant `Q4_K_M` (~2GB).

**Decision:** even at 2GB, that model's weights + KV cache still wouldn't cleanly fit into 1.35GB free VRAM without a live OOM risk mid-class. Ran it **CPU-only** (`--gpu-layers 0`) instead of fighting the P4000 for scraps — 16 cores / 31GB free RAM is enough for a snappy demo on a 3B model, and it doesn't touch (or risk crashing) the three models already serving other demos.

## 3. First systemd unit (CPU-only)

```
sshpass -e ssh jay@192.168.1.92 "python3 -c \"
from huggingface_hub import hf_hub_download
p = hf_hub_download(repo_id='NousResearch/Hermes-3-Llama-3.2-3B-GGUF', filename='Hermes-3-Llama-3.2-3B.Q4_K_M.gguf', local_dir='.')
print('DOWNLOADED:', p)
\""
```

**Gotcha:** `hf` and `huggingface-cli` weren't on `PATH` (Python 3.10.12, `huggingface_hub` 1.23.0 installed as a library only) and `python3 -m huggingface_hub` isn't runnable as a module. Used the Python API (`hf_hub_download`) directly instead of fighting the CLI.

Wrote `/etc/systemd/system/llama-inference-hermes.service`:

```ini
[Unit]
Description=Llama Inference Server (Hermes-3-Llama-3.2-3B, agentic tool-calling)
After=network.target

[Service]
Type=simple
User=jay
WorkingDirectory=/home/jay/llama.cpp/build
ExecStart=/home/jay/llama.cpp/build/bin/llama-server \
  -m /home/jay/llama.cpp/models/Hermes-3-Llama-3.2-3B.Q4_K_M.gguf \
  --gpu-layers 0 \
  -c 8192 \
  --port 8004 \
  --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```
sudo systemctl daemon-reload
sudo systemctl enable --now llama-inference-hermes.service
curl -s http://localhost:8004/v1/models
```

**Gotcha:** `sudo` over a non-interactive SSH session refuses a TTY password prompt (`sudo: a terminal is required to read the password`) and inline `echo PASS | sudo -S ...` failed too when the whole thing was wrapped through several layers of shell quoting. Fixed by writing the password to a throwaway file (`/tmp/.sp`, deleted right after) and using `sudo -S ... < /tmp/.sp` for each privileged command.

Confirmed the server came up and answered `/v1/models`.

## 4. First tool-calling test — and it silently failed

```
curl -s http://localhost:8004/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "hermes",
  "messages": [{"role": "user", "content": "What time is it right now?"}],
  "tools": [{"type": "function", "function": {"name": "get_current_time", "description": "Get the current time in a given timezone", "parameters": {"type": "object", "properties": {"timezone": {"type": "string"}}, "required": ["timezone"]}}}]
}'
```

It just **made up a time** ("11:14 AM on August 3, 2023") instead of calling the tool — even with `"tool_choice": "required"`, it narrated fake reasoning instead of emitting a real `tool_call`.

**Root cause:** `curl -s http://localhost:8004/props` showed `"chat_format": "Content-only"`. The GGUF's baked-in chat template (and even the base `NousResearch/Hermes-3-Llama-3.2-3B` repo's `tokenizer_config.json`) is bare ChatML — no `{% if tools %}` Jinja logic at all. llama-server can't render tool definitions into the prompt or parse `<tool_call>` tags without a template that knows about them, so it silently degrades to plain chat. **The "tools" param was a no-op the whole time**, hence the confident hallucination.

**Fix:** Hermes models ship a *second*, separate chat-template variant named `tool_use` (visible in `NousResearch/Hermes-2-Pro-Llama-3-8B`'s `tokenizer_config.json`, as a list of `{name, template}` objects) that adds the `<tools>...</tools>` system-prompt block and `<tool_call>`/`<tool_response>` XML tags. Pulled it out and passed it explicitly:

```
curl -s "https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B/raw/main/tokenizer_config.json" \
  | python3 -c "
import json,sys
d=json.load(sys.stdin)
tool_use = [t['template'] for t in d['chat_template'] if t['name']=='tool_use'][0]
open('hermes-tool-use.jinja','w').write(tool_use)
"
scp hermes-tool-use.jinja jay@192.168.1.92:/home/jay/llama.cpp/models/hermes-tool-use.jinja
```

## 5. VRAM freed up mid-session — switched to GPU offload

Partway through, two other `llama-server` instances were stopped by hand, freeing VRAM:

```
nvidia-smi --query-gpu=memory.total,memory.used,memory.free --format=csv
# 8116 MiB total, 3027 MiB used, 5089 MiB free
```

With 5GB free, updated the unit to add `--chat-template-file` and switch from `--gpu-layers 0` to `--gpu-layers 99` (full offload):

```ini
ExecStart=/home/jay/llama.cpp/build/bin/llama-server \
  -m /home/jay/llama.cpp/models/Hermes-3-Llama-3.2-3B.Q4_K_M.gguf \
  --chat-template-file /home/jay/llama.cpp/models/hermes-tool-use.jinja \
  --gpu-layers 99 \
  -c 8192 \
  --port 8004 \
  --host 0.0.0.0
```

```
sudo systemctl daemon-reload
sudo systemctl restart llama-inference-hermes.service
```

Hermes ended up using ~2.8GB VRAM fully offloaded, leaving ~2.3GB free — not enough headroom for the 8B Hermes variant, confirming the earlier decision to go with the 3B.

## 6. Tool-calling worked — but only at temperature 0

With the `tool_use` template in place, the default sampling settings (temp 0.8) still produced a garbled attempt:

```json
{"content": "<SCRATCHPAD>\n{\"name\": \"get_current_time\", \"arguments\": {\"timezone\": \"Denver\"}}\n</tool_response>"}
```

Right idea, wrong tags (`<SCRATCHPAD>` instead of `<tool_call>`, mismatched closing tag) — a small 3B model wandering off the exact format under sampling noise.

**Fix:** set `"temperature": 0` in the request. Result — a clean, correctly parsed tool call:

```json
{"finish_reason": "tool_calls", "message": {"role": "assistant", "content": "", "tool_calls": [{"type": "function", "function": {"name": "get_current_time", "arguments": "{\"timezone\": \"Denver\"}"}, "id": "..."}]}}
```

**Lesson for the class:** tool-calling reliability on small local models is sensitive to both the chat template *and* sampling temperature — this is a good live example of why "it's not calling my tool" is usually a prompt/template problem, not a fundamentally broken model.

## 7. Registering Hermes in Open WebUI — wrong instance first

```
docker ps -a
```

Found that `open-webui-2` (the `:8081` instance previously used for class, per earlier docs) had actually **exited 7 days ago** — it wasn't running. The container currently live is the original `open-webui` service, on port `8080` (`--network=host`), a **separate Docker volume** with its own independent config/database from `open-webui-2`.

**Gotcha:** these are two totally separate Open WebUI installs (separate SQLite DBs inside separate named volumes) even though they're both `ghcr.io/open-webui/open-webui:main`. A connection or tool server registered in one does **not** carry over to the other. Picked `:8080` since it's the one actually running; use that going forward for this class, or ask to have `open-webui-2` restarted if `:8081` is preferred.

Logged in via the API to get an admin token (kept in a scratch file on the box, not in this repo):

```
curl -s -X POST http://localhost:8080/api/v1/auths/signin -H "Content-Type: application/json" \
  -d '{"email":"<admin-email>","password":"<admin-password>"}' -o /tmp/.webui_auth.json
```

Read the existing OpenAI-compatible connections (`GET /openai/config`) so the new one could be appended without clobbering the Gemma/Qwen/TinyLlama connections already there, then added Hermes as a 4th connection pointing at `http://127.0.0.1:8004/v1`:

```
curl -s -X POST http://localhost:8080/openai/config/update -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{
    "ENABLE_OPENAI_API": true,
    "OPENAI_API_BASE_URLS": ["https://api.openai.com/v1", "http://127.0.0.1:8001/v1", "http://127.0.0.1:8003", "http://127.0.0.1:8004/v1"],
    "OPENAI_API_KEYS": ["", "", "", "sk-not-needed"],
    "OPENAI_API_CONFIGS": {"0": {"enable": true}, "1": {...}, "2": {...}, "3": {"enable": true, "tags": ["agentic"], "connection_type": "external", "auth_type": "bearer"}}
  }'
```

Confirmed it showed up: `GET /api/models` listed the raw GGUF path as both id and name — functional but ugly for a class demo.

## 8. The MCP tool server wasn't registered on this instance either

Per the earlier `mcp-and-tools-open-webui` doc, MCP tools (via the `mcpo-time` bridge) are **not** attached to individual models — they're registered once, globally, as an **External Tool Server**, then toggled on per-chat via the wrench icon.

```
curl -s "http://localhost:8080/api/v1/configs/tool_servers" -H "Authorization: Bearer $TOKEN"
# {"TOOL_SERVER_CONNECTIONS": []}
```

Empty — because, same as the connections above, this is a fresh instance (`:8080`) that never had `mcpo-time` registered; that only happened on the now-stopped `:8081` instance. Registered it:

```
curl -s -X POST "http://localhost:8080/api/v1/configs/tool_servers" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{
    "TOOL_SERVER_CONNECTIONS": [{"url": "http://localhost:8050", "path": "openapi.json", "auth_type": "none", "key": "", "config": {"enable": true, "access_control": null}}]
  }'
```

(`localhost:8050` works directly here, no `host.docker.internal` needed, because `open-webui` runs with `--network=host`.)

## 9. Custom model for a clean display name

Same pattern as the existing `qwen-model` custom model — wraps the raw connection model with a friendly name, description, and suggested prompts:

```
POST /api/v1/models/create
{
  "id": "hermes-agent",
  "base_model_id": "/home/jay/llama.cpp/models/Hermes-3-Llama-3.2-3B.Q4_K_M.gguf",
  "name": "Hermes Agent (tool-calling demo)",
  "meta": {
    "description": "NousResearch Hermes-3-Llama-3.2-3B, running locally with the ChatML tool-use template. Enable the mcpo-time tool server (wrench icon) to see it call get_current_time.",
    "suggestion_prompts": [{"content": "What time is it right now in Tokyo?"}, {"content": "Convert 3pm Denver time to London time."}],
    "tags": [{"name": "agentic"}]
  }
}
```

Confirmed via `GET /api/models` that **Hermes Agent (tool-calling demo)** now shows up in the model list.

## 10. What's left — do this live in the browser

Everything above was verified at the API layer (direct `llama-server` calls, direct `mcpo` calls, Open WebUI's admin/config API). The one thing **not** yet confirmed is the actual chat UI flow — no browser automation was available in this session to click through it. Before showing the class:

1. Open `http://192.168.1.92:8080`, log in, start a new chat, pick **Hermes Agent (tool-calling demo)**.
2. Click the wrench/tools icon, enable the `mcpo` tool server if it's not already on.
3. Ask *"What time is it right now in Tokyo?"* and confirm you see a tool call happen (not a hallucinated answer).
4. If it doesn't fire: log out/in (or hard-refresh) so Open WebUI re-fetches the external tool server's `openapi.json` — this was a known gotcha in the original MCP doc too.

## Summary for the class

- **Why Hermes, not another local model:** it's trained specifically to emit structured `<tool_call>` output when given tool definitions — a good hook for teaching "what makes a model agentic" vs. just chatty.
- **Why the 3B, not 8B:** VRAM was the hard constraint (started at 1.35GB free, later 5GB after other demos were stopped) — 8B Q4 (~4.9GB) doesn't fit safely alongside the other models.
- **Two real bugs hit and fixed, both good teaching moments:**
  1. The default GGUF chat template has no tool-calling logic at all — "it's not calling my tool" is usually a template problem, not a model problem. Fixed by pulling Hermes's separate `tool_use` Jinja template.
  2. Tool-call formatting was unreliable at default temperature (0.8) on this small model, clean at `temperature: 0` — sampling noise matters more for structured output than for prose.
- **Infra gotcha, not a Hermes thing:** `open-webui` (`:8080`) and `open-webui-2` (`:8081`) are two independent installs with separate databases; a connection or tool server set up in one doesn't exist in the other. Confirm which instance is actually running (`docker ps`) before assuming prior setup carried over.
