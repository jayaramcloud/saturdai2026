DeepSeek V4 Flash 0731 – Quick Summary

Date: August 2, 2026 | Participants: Jay Krish, Sanjay Jayaram

The Model

DeepSeek V4 Flash is a 284-billion-parameter language model released on August 1, 2026. It's not the largest multi-trillion parameter model, but it's the most price-competitive model available.

Pricing & Competitive Advantage

DeepSeek Pricing (with 30% launch discount):

Input: 9 cents per million tokens (normally 14 cents)
Output: 18 cents per million tokens (normally 28 cents)

Context: OpenAI slashed GPT 5.6 Luna prices by 80% on the day before DeepSeek's release, yet DeepSeek is still cheaper for comparable performance. This completely eroded OpenAI's profit margins on inference. Anthropic has given up competing at this price point, focusing only on larger, more expensive models.

Market Landscape

Multiple providers now serve DeepSeek:

Open Router
Alibaba Cloud
Fireworks
Cloudflare (surprisingly)
Akash ML

This represents a historic shift: competitors openly serve each other's models, including Chinese and US companies.

Key Features
Cache Pricing: 1.4 cents (50x discount on cached tokens vs. new ones) – huge advantage for conversational workloads
Speed: 71 tokens/second on some providers vs. 4 tokens/second on others
Benchmarks: Artificial Analysis rates it very close to the frontier for intelligence
Local Deployment

Sanjay demonstrated downloading and running DeepSeek locally using llama.cpp on a single GPU with 128GB VRAM. After quantization (IQ3 compression), the model uses ~110GB, leaving minimal headroom.
 the single command is : sanjay jayaram: ~/llama.cpp/llama.cpp/build/bin/llama-server -hf unsloth/DeepSeek-V4-Flash-GGUF:UD-IQ3_XXS -ngl 999 --port 11434


Bottom Line

DeepSeek V4 Flash represents a massive shift: for the first time, open-source models are cheaper, fast enough, and good enough for most commercial use cases, forcing the entire market to compete on price rather than exclusivity.