"""Generate a left/right mind map of Hermes Agent capabilities as a .drawio file.

Usage: python3 materials/hermes-agent-capabilities-gen.py materials/hermes-agent-capabilities.drawio
Then export: drawio -x -f png -s 0.5 --disable-gpu -o <abs path>.png <file>.drawio
(snap drawio cannot write to /tmp; use a path under $HOME)."""
from xml.sax.saxutils import escape
import sys

OUT = sys.argv[1]

# (branch title, fill, stroke, [leaves]) — leaves may contain '\n' for 2-line nodes
RIGHT = [
    ("🧰 Built-in Tools (40+)", "#dae8fc", "#6c8ebf", [
        "terminal — run shell commands\nprocess_manage — list/poll/log/kill bg processes",
        "File: read_file · write_file · patch · search_files",
        "Web: web_search · web_extract · x_search (X/Twitter)",
        "Browser: navigate · click · type · press · scroll\nsnapshot (a11y tree) · vision · console · get_images · back",
        "Browser (CDP-gated): browser_cdp · browser_dialog",
        "computer_use — background desktop control (cua-driver)",
        "execute_code — Python scripts that call tools via RPC",
        "vision_analyze · video_analyze",
        "image_generate (FAL etc.) · video_generate\nxai_video_edit · xai_video_extend",
        "text_to_speech (OpenAI / ElevenLabs) · FFmpeg audio/video",
        "clarify — ask user single/multi-select or open questions",
        "todo_list — per-session task list",
        "Home Assistant: ha_list_entities · ha_get_state\nha_list_services · ha_call_service",
        "Spotify: playback · devices · queue · search\nplaylists · albums · library",
        "Discord: discord · discord_admin",
        "Feishu/Lark: doc_read · drive comments & replies",
        "Yuanbao: group info/members · send DM · stickers",
        "Desktop UI: read_terminal · desktop_preview · drive_preview\nannotate_preview · focus_pane · gui_tour · show_tip · apply_layout",
        "desktop_project — create/list/switch workspaces",
        "manage_connections — connect external apps",
    ]),
    ("🧠 Memory & Recall", "#d5e8d4", "#82b366", [
        "memory tool — persistent cross-session memory",
        "MEMORY.md (agent notes) + USER.md (about you)",
        "Agent-curated memory with periodic nudges",
        "session_search — FTS5 full-text search of past sessions\n+ LLM summarisation for recall",
        "Honcho dialectic user modelling (profile of the user)",
        "Cross-session & cross-platform continuity",
    ]),
    ("📚 Skills (procedural memory)", "#fff2cc", "#d6b656", [
        "skills_list · skill_view · skill_manage (create/update/delete)",
        "Autonomous skill creation after complex tasks",
        "Skills self-improve during use",
        "agentskills.io open standard compatible",
        "Skills Hub — community sharing / install",
        "manage_catalog — search & install plugins and skills",
        "Invoke as /<skill-name> · CLI: hermes skills list / inspect",
    ]),
    ("🔁 Closed Learning Loop", "#e1d5e7", "#9673a6", [
        "Do task → reflect → write/refine skill",
        "Memory nudges: decide what's worth remembering",
        "Session history → searchable experience",
        "User model deepens over time (Honcho)",
        "\"Self-improving agent\" — gets better the longer it runs",
    ]),
    ("👥 Subagents & Orchestration", "#f8cecc", "#b85450", [
        "delegate_task — isolated subagent contexts",
        "Parallel workstreams, clean parent context",
        "execute_code RPC — multi-step pipelines in\none zero-context-cost turn",
        "Kanban board: create · list · show · link · comment",
        "Kanban flow: block/unblock · heartbeat · complete (handoff)",
        "Review loop: request_review · request_changes",
        "Attachments: attach · attach_url · attachments",
    ]),
    ("⏰ Scheduling / Cron", "#ffe6cc", "#d79b00", [
        "cronjob_manage — create · list · update · pause · resume",
        "Natural-language schedules (\"every weekday at 8am\")",
        "Unattended: daily reports, nightly backups, weekly audits",
        "Deliver results to any gateway platform",
        "Croniter-backed cron expressions",
    ]),
    ("🔌 MCP Integration", "#d0cee2", "#56517e", [
        "Connect any MCP server (stdio / HTTP)",
        "hermes mcp add <name> --command <abs path> --args …",
        "MCP Registry for discovering servers",
        "Tools auto-discovered on connect (e.g. mcp-server-time)",
        "Gotcha: use absolute paths (no shell PATH)\nflags before --args",
    ]),
]

LEFT = [
    ("🤖 Model Providers", "#dae8fc", "#6c8ebf", [
        "Nous Portal (300+ models, one key)",
        "OpenRouter",
        "OpenAI · Anthropic Claude",
        "Custom OpenAI-compatible endpoint\n(llama.cpp / vLLM / Ollama / DGX Spark)",
        "hermes model · /model provider:model — switch anytime",
        "Multi-model routing (small vs large per task)",
        "No lock-in: provider-agnostic by design",
    ]),
    ("💬 Messaging Gateway", "#d5e8d4", "#82b366", [
        "Telegram · Discord · Slack",
        "WhatsApp · Signal · Email",
        "Home Assistant · Feishu/Lark · Yuanbao",
        "Single gateway process for all platforms",
        "hermes gateway · /platforms · /status · /sethome",
        "Voice memo transcription + voice replies",
        "DM pairing for authenticated access",
        "/stop to interrupt from chat",
    ]),
    ("🖥️ Terminal Backends", "#fff2cc", "#d6b656", [
        "Local",
        "Docker (container isolation)",
        "SSH (remote box)",
        "Singularity (HPC)",
        "Modal (serverless, hibernates when idle)",
        "Daytona (serverless persistence)",
        "Vercel Sandbox",
    ]),
    ("⌨️ CLI & TUI", "#e1d5e7", "#9673a6", [
        "hermes — interactive TUI chat",
        "hermes -z \"prompt\" --cli — one-shot / scriptable",
        "--yolo — auto-approve tool calls",
        "hermes setup · config (get/set) · tools · model",
        "hermes doctor — config & dependency health check",
        "hermes update · hermes claw migrate",
        "/new /reset /retry /undo /compress /usage",
        "/personality · /insights --days N · /skills",
        "Multiline edit · autocomplete · history\ninterrupt-and-redirect (Ctrl+C) · streaming tool output",
    ]),
    ("📄 Context & Personality", "#f8cecc", "#b85450", [
        "AGENTS.md — workspace / project instructions",
        "SOUL.md — personality & persona",
        "/personality <name> — swap persona",
        "Context files shape every conversation",
        "/compress — context compaction",
    ]),
    ("🔒 Security & Safety", "#ffe6cc", "#d79b00", [
        "Command approval prompts (default on)",
        "--yolo bypass — only on infra you control",
        "Allowlist / blocklist command patterns",
        "Container isolation via Docker/Singularity backends",
        "Secrets management — API keys kept out of prompts",
        "DM pairing for messaging access",
        "MCP servers = capability grants: scope narrowly",
    ]),
    ("🚀 Deployment & Platforms", "#d0cee2", "#56517e", [
        "Linux / macOS (bash installer)",
        "Windows native (PowerShell) · WSL2",
        "Android / Termux (aarch64)",
        "$5 VPS · GPU clusters · Docker",
        "Serverless (Modal / Daytona) — ~zero idle cost",
        "systemd service (Restart=on-failure)",
        "ACP adapter — IDE integration",
        "OpenClaw migration (settings, memories, skills, keys)",
    ]),
    ("🔬 Research & RL", "#f5f5f5", "#666666", [
        "Batch trajectory generation",
        "Trajectory compression for training\nnext-gen tool-calling models",
        "Atropos RL environments",
        "/insights — historical usage analysis",
    ]),
]


BRIEFS = {
    "🧰 Built-in Tools (40+)": "Hands of the agent: shell, files, web, browser, media, apps.",
    "🧠 Memory & Recall": "Remembers facts about you and past sessions across every conversation.",
    "📚 Skills (procedural memory)": "Reusable how-to recipes the agent writes, stores, and improves itself.",
    "🔁 Closed Learning Loop": "Learns from each task so it gets better the longer it runs.",
    "👥 Subagents & Orchestration": "Splits big jobs into parallel subagents and tracked kanban tasks.",
    "⏰ Scheduling / Cron": "Runs tasks unattended on a schedule, delivering results to chat.",
    "🔌 MCP Integration": "Plugs in any external MCP server to gain new tools instantly.",
    "🤖 Model Providers": "Swap the brain: any cloud or local OpenAI-compatible LLM endpoint.",
    "💬 Messaging Gateway": "Talk to your agent from Telegram, Slack, Discord, WhatsApp, and more.",
    "🖥️ Terminal Backends": "Where commands actually run: locally, in containers, remotely, or serverless.",
    "⌨️ CLI & TUI": "Interactive terminal chat or one-shot scriptable commands with slash controls.",
    "📄 Context & Personality": "Project instructions and persona files that shape every single conversation.",
    "🔒 Security & Safety": "Approval prompts, isolation, and allowlists keep risky actions under control.",
    "🚀 Deployment & Platforms": "Install anywhere: laptop, phone, cheap VPS, GPU cluster, or serverless.",
    "🔬 Research & RL": "Generates tool-use trajectories to train better agentic models over time.",
}

cells = []
nid = [2]


def new_id():
    nid[0] += 1
    return f"n{nid[0]}"


def vertex(label, x, y, w, h, style):
    i = new_id()
    cells.append(
        f'<mxCell id="{i}" value="{escape(label.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'), {chr(34): "&quot;"}).replace(chr(10), "&#xa;")}" '
        f'style="{style}" vertex="1" parent="1"><mxGeometry x="{x:.0f}" y="{y:.0f}" '
        f'width="{w:.0f}" height="{h:.0f}" as="geometry"/></mxCell>')
    return i


def edge(src, tgt, color, width):
    i = new_id()
    cells.append(
        f'<mxCell id="{i}" style="edgeStyle=entityRelationEdgeStyle;curved=1;rounded=1;'
        f'endArrow=none;html=1;strokeWidth={width};strokeColor={color};" edge="1" parent="1" '
        f'source="{src}" target="{tgt}"><mxGeometry relative="1" as="geometry"/></mxCell>')


import math

# Font sizes (doubled for readability)
F_LEAF, F_BRIEF, F_BRANCH, F_CENTER, F_TITLE = 36, 38, 50, 52, 72
LEAF_W, BR_W = 900, 640
GAP_LEAF, GAP_BRANCH = 14, 110


def n_lines(text, width, font, cw=0.5):
    per_line = max(1, int((width - 30) / (font * cw)))
    return sum(max(1, math.ceil(len(part) / per_line)) for part in text.split("\n"))


def box_h(text, width, font, pad=26, cw=0.5):
    return n_lines(text, width, font, cw) * font * 1.3 + pad


def leaf_h(t):
    return box_h(t, LEAF_W, F_LEAF)


def branch_h(title):
    return box_h(title, BR_W, F_BRANCH, 44, cw=0.62)


def brief_h(title):
    return box_h(BRIEFS[title], BR_W + 40, F_BRIEF, 34, cw=0.56)


def block_h(title, leaves):
    leaves_h = sum(leaf_h(l) + GAP_LEAF for l in leaves)
    # the branch + brief stack must also fit, centred on the leaf block
    return max(leaves_h, 2 * (branch_h(title) / 2 + brief_h(title) + 20))


def side_height(branches):
    return sum(block_h(t, ls) for t, _, _, ls in branches) + GAP_BRANCH * (len(branches) - 1)


H = max(side_height(RIGHT), side_height(LEFT))
CX, CY = 0, 0
CW, CHT = 820, 440
center = vertex(
    "Hermes Agent\n\nNous Research's self-improving, provider-agnostic AI agent",
    CX - CW / 2, CY - CHT / 2, CW, CHT,
    "ellipse;whiteSpace=wrap;html=1;fillColor=#1a1a2e;fontColor=#ffffff;strokeColor=#8b5cf6;"
    f"strokeWidth=8;fontSize={F_CENTER};fontStyle=1;spacingLeft=40;spacingRight=40;")


def lay_side(branches, direction):
    total = side_height(branches)
    y = CY - total / 2
    for title, fill, stroke, leaves in branches:
        block = block_h(title, leaves)
        bh = branch_h(title)
        by = y + block / 2 - bh / 2
        bx = CX + CW / 2 + 380 if direction > 0 else CX - CW / 2 - 380 - BR_W
        b = vertex(title, bx, by, BR_W, bh,
                   f"rounded=1;arcSize=20;whiteSpace=wrap;html=1;fillColor={fill};strokeColor={stroke};"
                   f"strokeWidth=6;fontSize={F_BRANCH};fontStyle=1;")
        rh = brief_h(title)
        vertex(BRIEFS[title], bx - 20, by - rh - 16, BR_W + 40, rh,
               f"rounded=1;arcSize=20;whiteSpace=wrap;html=1;fontSize={F_BRIEF};fontStyle=2;"
               f"fillColor=#ffffff;strokeColor={stroke};strokeWidth=3;dashed=1;fontColor=#222222;"
               f"spacingLeft=12;spacingRight=12;")
        edge(center, b, stroke, 8)
        leaves_h = sum(leaf_h(l) + GAP_LEAF for l in leaves)
        ly = y + (block - leaves_h) / 2
        for leaf in leaves:
            h = leaf_h(leaf)
            lx = bx + BR_W + 120 if direction > 0 else bx - 120 - LEAF_W
            align = "left" if direction > 0 else "right"
            l = vertex(leaf, lx, ly, LEAF_W, h,
                       f"rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor={stroke};strokeWidth=2;"
                       f"fontSize={F_LEAF};align={align};spacingLeft=14;spacingRight=14;fontFamily=Helvetica;")
            edge(b, l, stroke, 4)
            ly += h + GAP_LEAF
        y += block + GAP_BRANCH


lay_side(RIGHT, 1)
lay_side(LEFT, -1)

title = vertex("Hermes Agent — Capability Map  ·  SaturdAI · Agentic AI with Hermes Agent (2026)",
               CX - 2000, CY - H / 2 - 220, 4000, 110,
               f"text;html=1;align=center;fontSize={F_TITLE};fontStyle=1;fontColor=#1a1a2e;")

xml = ('<mxfile host="drawio"><diagram name="Hermes Agent Capabilities" id="hermes">'
       '<mxGraphModel dx="1600" dy="1200" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" '
       'arrows="1" fold="1" page="0" pageScale="1" math="0" shadow="0"><root>'
       '<mxCell id="0"/><mxCell id="1" parent="0"/>' + "".join(cells) +
       '</root></mxGraphModel></diagram></mxfile>')
open(OUT, "w").write(xml)
print("wrote", OUT, len(cells), "cells")
