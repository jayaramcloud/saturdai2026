# Running Local LLMs with llama.cpp, CUDA, and Open WebUI

A step-by-step log of setting up GPU-accelerated local inference with `llama.cpp`, exposing it as an OpenAI-compatible server, fronting it with Open WebUI, and making the box reachable remotely via Tailscale and SSH.

**Hardware context:** NVIDIA GPU with 8GB VRAM, CUDA 11.4 toolkit.

---

## 1. Verify CUDA is installed

```bash
nvcc --version
```

Confirms the CUDA toolkit version before building llama.cpp with GPU support.

## 2. Build llama.cpp with CUDA support

```bash
cd ~/llama.cpp/build
cmake .. -DLLAMA_CUDA=ON
```

If the build config is stale or CUDA isn't picked up, clear the CMake cache and rebuild, pointing explicitly at the CUDA 11.4 toolkit path:

```bash
rm -rf CMakeCache.txt CMakeFiles
cmake .. -DGGML_CUDA=ON -DCUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda-11.4
make -j4
```

> Note: the CMake flag changed from `LLAMA_CUDA` to `GGML_CUDA` in newer llama.cpp versions — use `GGML_CUDA` if the first attempt doesn't pick up the GPU.

Verify the GPU offload flag is available in the built binary:

```bash
./bin/llama-cli --help | grep -i gpu-layers
```

## 3. Download models

```bash
cd ~/llama.cpp/models
```

### Option A: direct download with `wget`

```bash
# Mistral 7B, Q4 quantized (~4GB, fits in a 4GB+ VRAM card)
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/Mistral-7B-Instruct-v0.1.Q4_K_M.gguf
```

### Option B: Hugging Face CLI

```bash
sudo apt install python3-pip
pip3 install -U "huggingface_hub[cli]"

# Add the pip user bin directory to PATH permanently
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

hf download TheBloke/phi-2-GGUF phi-2.Q4_K_M.gguf --local-dir ~/llama.cpp/models
```

## 4. Run inference from the CLI

```bash
cd ~/llama.cpp/build/bin
./llama-cli -m ../../models/phi-2.Q4_K_M.gguf \
  -p "Explain machine learning" \
  -n 50 \
  --gpu-layers 20 \
  -c 2048
```

Once the smaller model (phi-2, on a 4GB card) works, test the larger 7B model on an 8GB card:

```bash
./bin/llama-cli -m ../models/Mistral-7B-Instruct-v0.1.Q4_K_M.gguf \
  -p "What is machine learning?" \
  -n 100 \
  --gpu-layers 30 \
  -c 2048
```

Check GPU utilization and VRAM usage while a model is loaded:

```bash
nvidia-smi
```

## 5. Run llama.cpp as a background server

Quick, ad-hoc way to run the OpenAI-compatible server in the background:

```bash
cd ~/llama.cpp/build
nohup ./bin/llama-server -m ../models/phi-2.Q4_K_M.gguf \
  --gpu-layers 30 \
  --port 8000 \
  --host 0.0.0.0 > llama-server.log 2>&1 &
```

## 6. Make it a systemd service (llama.cpp)

For something that survives reboots and restarts on failure, create a systemd unit:

```bash
sudo vi /etc/systemd/system/llama-inference.service
```

Example unit file:

```ini
[Unit]
Description=llama.cpp inference server
After=network.target

[Service]
Type=simple
User=<your-user>
WorkingDirectory=/home/<your-user>/llama.cpp/build
ExecStart=/home/<your-user>/llama.cpp/build/bin/llama-server \
  -m /home/<your-user>/llama.cpp/models/phi-2.Q4_K_M.gguf \
  --gpu-layers 30 --port 8000 --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable llama-inference.service
sudo systemctl start llama-inference.service
sudo systemctl status llama-inference.service
```

## 7. Install Open WebUI

### Option A: systemd-managed (if running Open WebUI natively/pip-installed)

```bash
sudo vi /etc/systemd/system/open-webui.service
sudo systemctl daemon-reload
sudo systemctl enable open-webui.service
sudo systemctl start open-webui.service
sudo systemctl status open-webui.service
```

### Option B: Docker

```bash
sudo apt install -y docker.io

# Point Open WebUI at the local llama.cpp server (adjust port to match your server)
sudo docker run -d --name open-webui -p 3000:8080 \
  -e OLLAMA_BASE_URLS=http://localhost:8000 \
  ghcr.io/open-webui/open-webui:latest
```

> `--network host` is an alternative if you want the container to share the host's network namespace directly instead of publishing a port:
> ```bash
> sudo docker run -d --network host \
>   -e OLLAMA_BASE_URLS=http://localhost:11434 \
>   ghcr.io/open-webui/open-webui:latest
> ```

Open WebUI is now reachable at `http://<host>:3000`.

## 8. Remote access: Tailscale

```bash
sudo apt install curl
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Follow the printed auth link to join the box to your tailnet, then reach it from anywhere at its Tailscale IP/hostname.

## 9. Remote access: SSH

```bash
sudo apt install -y openssh-server
sudo systemctl enable ssh
sudo systemctl start ssh

# Verify it's running and listening
sudo systemctl status ssh
sudo ss -tlnp | grep ssh

hostname -I
uname -a
```

## 10. Optional: remote desktop

```bash
gsettings set org.gnome.desktop.remote-access enabled true

# Keep SSH available as the secure transport
sudo systemctl enable ssh
sudo systemctl start ssh
```

## 11. Useful checks

```bash
df -h              # disk space (models are large — check before downloading more)
ls -lh ~/llama.cpp/models/   # see downloaded model sizes
nvidia-smi          # GPU status
reboot              # apply changes that require a restart, e.g. new systemd services
```

---

## Summary

| Component | Purpose | Port |
|---|---|---|
| `llama-server` | GPU-accelerated GGUF model inference, OpenAI-compatible API | 8000 |
| Open WebUI | Chat UI on top of the inference server | 3000 |
| Tailscale | Private remote network access | — |
| SSH | Remote shell access | 22 |

End-to-end, this turns a single GPU box into a private, remotely-reachable ChatGPT-style inference server: `llama.cpp` handles quantized model inference on the GPU, `llama-server` exposes it over HTTP, Open WebUI gives it a browser UI, and Tailscale/SSH make it reachable from anywhere without exposing ports to the public internet.
