# Running Local LLMs on the HP Laptop (llama.cpp + CUDA)

A log of setting up `llama.cpp` on the HP laptop, downloading a Ministral 3B model, rebuilding with CUDA GPU support, and tuning GPU layer offload to fit the laptop's VRAM.

---

## 1. Set up the models directory

```bash
mkdir -p ../model
mv ../model ../models
cd ../models/
ls
```

(Fixing a typo — `model` was created first, then renamed to `models`.)

## 2. Download a model

### Attempt 1: direct `wget` from a TheBloke GGUF repo

```bash
wget https://huggingface.co/TheBloke/Ministral-3-3B-Instruct-GGUF/resolve/main/Ministral-3-3B-Instruct.Q4_K_M.gguf
```

This repo/file didn't resolve, so the download was retried via the Hugging Face CLI instead.

### Attempt 2: Hugging Face CLI

```bash
pip install huggingface-hub
pip3 install huggingface-hub
sudo apt install python3-pip
pip3 install huggingface-hub

# Debian/Ubuntu blocks system-wide pip installs by default — override it
pip3 install huggingface-hub --break-system-packages
```

Download the model (from the official `mistralai` repo, Q8_0 quantization) using the `hf` CLI:

```bash
hf download hf://mistralai/Ministral-3-3B-Instruct-2512-GGUF/Ministral-3-3B-Instruct-2512-Q8_0.gguf
```

Hugging Face CLI downloads land in the local HF cache, not the working directory — locate the file:

```bash
# Verify it downloaded
ls -lh ~/.cache/huggingface/hub/models--mistralai--Ministral-3-3B-Instruct-2512-GGUF/snapshots/*/Ministral-3-3B-Instruct-2512-Q8_0.gguf

# Or find it
find ~/.cache/huggingface -name "Ministral-3-3B-Instruct-2512-Q8_0.gguf"
```

Copy it into `llama.cpp`'s own `models/` directory for convenience:

```bash
cp ~/.cache/huggingface/hub/models--mistralai--Ministral-3-3B-Instruct-2512-GGUF/snapshots/eb599d408350ea2bb60452cb86be7c7b2fc28227/Ministral-3-3B-Instruct-2512-Q8_0.gguf ~/llama.cpp/models/

ls -lh ~/llama.cpp/models/Ministral-3-3B-Instruct-2512-Q8_0.gguf
```

## 3. First run: CPU only

Before building with CUDA, run the server against the CPU build to confirm the model loads (`-ngl 0` = zero GPU layers offloaded):

```bash
cd ../build/
./bin/llama-server -m ~/.cache/huggingface/hub/models--mistralai--Ministral-3-3B-Instruct-2512-GGUF/snapshots/*/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 0

ps -aux | grep llama
```

## 4. Rebuild llama.cpp with CUDA support

Preserve the working CPU build under a new name, then start a fresh CUDA build:

```bash
cd ..
mv build build.cpu
mkdir build
cd build
cmake .. -DLLAMA_CUDA=1
cmake --build . --config Release -j$(nproc)
```

The CUDA toolkit wasn't installed yet, so this build failed. Install it:

```bash
sudo apt update
sudo apt install -y nvidia-cuda-toolkit nvidia-cuda-dev
nvcc --version
```

Older `-DLLAMA_CUDA` flag didn't take effect cleanly, so start the build over with the current `GGML_CUDA` flag:

```bash
cd ..
rm -rf build
mkdir build
cd build
cmake .. -DGGML_CUDA=1
cmake --build . --config Release -j$(nproc)
```

## 5. Run with full GPU offload

```bash
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 99
```

`-ngl 99` requests as many layers offloaded to GPU as the model has (effectively "all of them").

## 6. Tune GPU layer offload to fit VRAM

On a laptop GPU, offloading every layer at a large context size can exceed available VRAM. The `-ngl` (number of GPU layers) and `-c` (context size) flags were swept to find a stable combination:

```bash
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 25
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 5
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 10
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 20
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 8192 -ngl 15

# Larger context, re-testing lower ngl values
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 16000 -ngl 20
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 16000 -ngl 15
./bin/llama-server -m ../models/Ministral-3-3B-Instruct-2512-Q8_0.gguf -c 16000 -ngl 10
```

While each configuration ran, GPU/CPU/memory usage was monitored to see what fit:

```bash
nvidia-smi
top
free -h
```

## 7. Confirm the process

```bash
cd llama.cpp/
cd build
cd bin/
./llama-server -h    # review available flags

ps -aux | grep llama
uptime
```

---

## Summary

| Step | Tool/Flag | Purpose |
|---|---|---|
| Model download | `hf download` | Pull GGUF weights (Ministral 3B, Q8_0) from Hugging Face |
| Build (CPU) | `cmake ..` (default) | Baseline build to confirm the model loads and runs |
| Build (GPU) | `cmake .. -DGGML_CUDA=1` | Rebuild with CUDA offload support |
| `-ngl` | `llama-server` flag | Number of model layers offloaded to GPU — tune down if VRAM is limited |
| `-c` | `llama-server` flag | Context window size in tokens — larger context uses more VRAM/RAM |

**Key lesson from this laptop's tuning pass:** unlike a desktop GPU with headroom to spare, the laptop's GPU needed `-ngl` swept manually (5 → 25) against different `-c` values to find a combination that didn't run out of VRAM, rather than defaulting straight to `-ngl 99`.
