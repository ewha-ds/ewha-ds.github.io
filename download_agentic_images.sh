#!/usr/bin/env bash
set -e

OUT_DIR="public/images/26_09/agentic-ai"
mkdir -p "$OUT_DIR"

echo "Downloading official Agentic AI images..."

curl -L \
  "https://www-cdn.anthropic.com/images/4zrzovbb/website/7418719e3dab222dccb379b8879e1dc08ad34c78-2401x1000.png" \
  -o "$OUT_DIR/anthropic-prompt-chaining.png"

curl -L \
  "https://images.ctfassets.net/kftzwdyauwt9/3941VUJ6IaPCwqw02d3oV2/0c97a312713af04f99e90829f35325b6/BuildingAgents_Media.png" \
  -o "$OUT_DIR/openai-agent-architecture.png"

curl -L \
  "https://www-cdn.anthropic.com/images/4zrzovbb/website/58d9f10c985c4eb5d53798dea315f7bb5ab6249e-2401x1000.png" \
  -o "$OUT_DIR/anthropic-autonomous-agent.png"

curl -L \
  "https://images.ctfassets.net/kftzwdyauwt9/4sByKlZXqJTjObemg4joUK/0910907c98cda7b706d5bdbd5140cca1/Manager_Pattern_MEDIA.png" \
  -o "$OUT_DIR/openai-manager-pattern.png"

curl -L \
  "https://www-cdn.anthropic.com/images/4zrzovbb/website/4b9a1f4eb63d5962a6e1746ac26bbc857cf3474f-2400x1666.png" \
  -o "$OUT_DIR/anthropic-coding-agent.png"

curl -L \
  "https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/image5_VkAG0Kd.original.png" \
  -o "$OUT_DIR/google-a2a-how-it-works.png"

echo
echo "Done."
echo "Saved to: $OUT_DIR"
ls -lh "$OUT_DIR"
