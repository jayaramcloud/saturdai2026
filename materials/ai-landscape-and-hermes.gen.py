# Generates materials/ai-landscape-and-hermes.drawio (3 pages).
# Usage: python3 materials/ai-landscape-and-hermes.gen.py materials/ai-landscape-and-hermes.drawio
# Then export PNGs with the drawio CLI (snap can't write to /tmp — output under ~):
#   drawio -x -f png -p <1|2|3> -o ~/out.png materials/ai-landscape-and-hermes.drawio --no-sandbox
import html, sys

# "Paper" style: off-white page, ink text, hairline grey rules, a single accent reserved for Hermes.
BG = "#faf8f3"
CARD = "#ffffff"
CARD2 = "#f2efe8"
TXT = "#1f2328"
MUTED = "#6b6f76"
LINE = "#c9c4b8"
INK = "#3a3f47"
BLUE = TEAL = AMBER = GREEN = RED = LINE
VIOLET = INK            # section headings
MAG = "#c2410c"         # the one accent colour: Hermes
HFILL = "#fdf0e7"
DAY_COLORS = {d: INK for d in range(1, 8)}


def esc(s):
    return html.escape(s, quote=True)


class Page:
    def __init__(self, name, pid, w, h):
        self.name, self.pid, self.w, self.h = name, pid, w, h
        self.cells, self.n = [], 0
        self.rects = []

    def nid(self):
        self.n += 1
        return f"{self.pid}-{self.n}"

    def box(self, x, y, w, h, label, fill=CARD, stroke=BLUE, fc=TXT, fs=14, bold=False,
            rounded=1, align="center", valign="middle", sw=1.5, dashed=0, extra=""):
        i = self.nid()
        style = (f"rounded={rounded};whiteSpace=wrap;html=1;fillColor={fill};strokeColor={stroke};"
                 f"fontColor={fc};fontSize={fs};fontStyle={1 if bold else 0};align={align};"
                 f"verticalAlign={valign};strokeWidth={sw};dashed={dashed};arcSize=3;spacing=6;"
                 f"fontFamily=Helvetica;{extra}")
        self.cells.append(f'<mxCell id="{i}" value="{esc(label)}" style="{style}" vertex="1" parent="1">'
                          f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>')
        return i

    def text(self, x, y, w, h, label, fc=TXT, fs=14, bold=False, align="left", valign="middle", extra=""):
        fc = INK if fc == LINE else fc
        i = self.nid()
        style = (f"text;html=1;strokeColor=none;fillColor=none;whiteSpace=wrap;fontColor={fc};"
                 f"fontSize={fs};fontStyle={1 if bold else 0};align={align};verticalAlign={valign};"
                 f"fontFamily=Helvetica;{extra}")
        self.cells.append(f'<mxCell id="{i}" value="{esc(label)}" style="{style}" vertex="1" parent="1">'
                          f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>')
        return i

    def ellipse(self, x, y, w, h, label, fill=CARD2, stroke=MAG, fs=16, extra=""):
        return self.box(x, y, w, h, label, fill=fill, stroke=stroke, fs=fs, bold=True,
                        extra="ellipse;" + extra)

    def edge(self, s, t, label="", color=MUTED, sw=2, dashed=0, extra="", pts=None):
        i = self.nid()
        style = (f"edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor={color};strokeWidth={sw};"
                 f"fontColor={TXT};fontSize=12;endArrow=block;endFill=1;dashed={dashed};"
                 f"labelBackgroundColor={BG};{extra}")
        geo = '<mxGeometry relative="1" as="geometry">'
        if pts:
            geo += '<Array as="points">' + "".join(f'<mxPoint x="{px}" y="{py}"/>' for px, py in pts) + "</Array>"
        geo += "</mxGeometry>"
        self.cells.append(f'<mxCell id="{i}" value="{esc(label)}" style="{style}" edge="1" parent="1" '
                          f'source="{s}" target="{t}">{geo}</mxCell>')
        return i

    def line(self, x1, y1, x2, y2, color=MUTED, sw=2, dashed=0, arrow=True, label="", extra=""):
        i = self.nid()
        style = (f"html=1;strokeColor={color};strokeWidth={sw};dashed={dashed};fontColor={TXT};fontSize=13;"
                 f"endArrow={'block' if arrow else 'none'};endFill=1;labelBackgroundColor={BG};{extra}")
        self.cells.append(f'<mxCell id="{i}" value="{esc(label)}" style="{style}" edge="1" parent="1">'
                          f'<mxGeometry relative="1" as="geometry"><mxPoint x="{x1}" y="{y1}" as="sourcePoint"/>'
                          f'<mxPoint x="{x2}" y="{y2}" as="targetPoint"/></mxGeometry></mxCell>')
        return i

    def xml(self):
        return (f'<diagram name="{esc(self.name)}" id="{self.pid}"><mxGraphModel dx="1400" dy="900" grid="0" '
                f'gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" '
                f'pageWidth="{self.w}" pageHeight="{self.h}" background="{BG}" math="0" shadow="0">'
                f'<root><mxCell id="0"/><mxCell id="1" parent="0"/>{"".join(self.cells)}</root>'
                f'</mxGraphModel></diagram>')


def chip_w(t, fs=13):
    return int(len(t) * fs * 0.56) + 22


def chips(p, x, y, w, items, color, fs=13, h=34, gap=8, max_rows=2, row_gap=8, hermes_key="Hermes Agent"):
    cx, cy, rows = x, y, 1
    for it in items:
        cw = chip_w(it, fs)
        if cx + cw > x + w:
            cx, cy, rows = x, cy + h + row_gap, rows + 1
            assert rows <= max_rows, f"chips overflow: {items}"
        star = it.startswith("★")
        p.box(cx, cy, cw, h, it, fill=HFILL if star else CARD2, stroke=MAG if star else color,
              fs=fs, bold=star, rounded=1, sw=1.5 if star else 1, extra="arcSize=40;")
        cx += cw + gap


def day_badge(p, x, y, days):
    for d in days:
        p.box(x, y, 62, 24, f"Day {d}", fill=CARD2, stroke=DAY_COLORS[d], fc=DAY_COLORS[d], fs=12, bold=True,
              extra="arcSize=50;")
        x += 68


# =====================================================================================
# PAGE 1 — THE LANDSCAPE
# =====================================================================================
p1 = Page("1 · The Agentic AI Landscape", "landscape", 2500, 1820)
p1.text(40, 18, 2420, 50, "The Agentic AI Landscape — and Where Hermes Agent Fits", fs=36, bold=True)
p1.text(40, 66, 2420, 30,
        "SaturdAI · Agentic AI with Hermes Agent · Day 1 companion map  —  how we got here, the full stack, "
        "the product landscape, and the autonomy spectrum", fc=MUTED, fs=16)

# ---- Timeline ----
p1.text(40, 112, 1200, 30, "① HOW WE GOT HERE — from scripted bots to always-on agents", fc=VIOLET, fs=18, bold=True)
steps = [
    ("Rule-based bots", "1960s–2010s", "Scripted if/then trees. No understanding, can’t handle anything off-script.", BLUE),
    ("Machine learning", "2010s", "Models learn to classify & predict from data — but each one does one narrow job.", BLUE),
    ("LLM chatbots", "2022 →", "ChatGPT moment: models that can talk about anything — but can only <i>talk</i>.", TEAL),
    ("Tool / function calling", "2023 →", "Model emits structured JSON asking your code to run a function. First real actions.", TEAL),
    ("Agent frameworks", "2023–24", "LangChain, AutoGen, CrewAI: developers hand-wire the plan→act→observe loop in code.", AMBER),
    ("Agent harnesses + MCP", "2024–25", "Ready-made loops (Claude Code, Codex CLI…) and MCP as a universal tool plug.", AMBER),
    ("Always-on personal agents", "2025–26", "Memory, skills, schedules, chat-app gateways. <b>Hermes Agent</b> lives here.", MAG),
]
sw_, gap = 318, 30
ids = []
for k, (t, d, desc, c) in enumerate(steps):
    x = 40 + k * (sw_ + gap)
    last = k == len(steps) - 1
    ids.append(p1.box(x, 150, sw_, 120,
                      f"<b style='font-size:16px'>{t}</b><br><span style='color:{c if c == MAG else INK}'><b>{d}</b></span><br>"
                      f"<span style='font-size:12px;color:{MUTED if not last else TXT}'>{desc}</span>",
                      fill=HFILL if last else CARD, stroke=c, sw=2 if last else 1, valign="top"))
for a, b in zip(ids, ids[1:]):
    p1.edge(a, b, color=MUTED)

# ---- The stack ----
SY = 320
p1.text(40, SY, 1110, 30, "② THE AGENTIC AI STACK — hardware at the bottom, humans at the top", fc=VIOLET, fs=18, bold=True)
p1.text(1165, SY, 285, 30, "How Hermes touches each layer", fc=MAG, fs=15, bold=True, align="center")
layers = [
    ("Channels & Interfaces", "Where humans meet the agent", VIOLET,
     ["CLI / TUI", "Chat UIs (Open WebUI, ChatGPT)", "Telegram", "Discord", "Slack", "WhatsApp", "Signal",
      "IDEs", "Voice"],
     "<b>CLI + messaging gateway</b><br>talk to it from your terminal or your phone", [2, 7]),
    ("Orchestration & Ops", "Keeping agents running & safe", RED,
     ["Scheduling (cron)", "Multi-agent / subagents", "Deployment (systemd, Docker, VPS)", "Logs & observability",
      "Guardrails & approvals", "Evals"],
     "<b>Built-in cron + subagents</b><br>command approvals, runs as a service", [6, 7]),
    ("Agent Runtime (the harness)", "The loop: plan → act → observe", MAG,
     ["★ Hermes Agent", "OpenClaw", "Claude Code", "Codex CLI", "Gemini CLI", "OpenHands",
      "LangGraph", "CrewAI", "AutoGen", "OpenAI Agents SDK", "Claude Agent SDK"],
     "<b>THIS IS HERMES’ HOME LAYER</b><br>a ready-to-run harness, not a library", [2, 6]),
    ("Tools & Skills", "What the agent can actually do", GREEN,
     ["Function calling", "MCP servers", "Skills (SKILL.md)", "Shell / terminal", "Files", "Web search",
      "Browser automation", "Code execution", "Any REST API"],
     "<b>Native toolsets + MCP client + skills hub</b><br>can even write new skills itself", [5, 6]),
    ("Knowledge & Memory", "What the agent knows & remembers", AMBER,
     ["RAG", "Vector DBs: ChromaDB · pgvector · Qdrant", "Embeddings", "Persistent memory files",
      "Session history search", "Knowledge graphs"],
     "<b>MEMORY.md + USER.md</b> built in;<br>RAG plugged in via tools / MCP", [4]),
    ("Protocols & APIs", "The contracts between layers", TEAL,
     ["OpenAI-compatible Chat Completions", "Tool-call JSON schema", "MCP (Model Context Protocol)",
      "A2A (agent-to-agent)", "Streaming (SSE)"],
     "<b>Speaks OpenAI-compatible + MCP</b><br>that’s why it can plug into anything", [3, 5]),
    ("Models", "The ‘brain’ — reasoning in text", BLUE,
     ["Closed: GPT", "Claude", "Gemini", "Open-weight: Llama", "Qwen", "DeepSeek", "Mistral", "gpt-oss",
      "Nous Hermes models"],
     "<b>Model-agnostic</b><br>swap the brain with one config line", [2, 3]),
    ("Inference & Serving", "Turning weights into an API", BLUE,
     ["llama.cpp", "Ollama", "vLLM", "SGLang", "LM Studio", "OpenRouter", "Nous Portal",
      "Cloud APIs (OpenAI, Anthropic, Google)"],
     "<b>Points at any endpoint</b><br>local server or cloud — same agent", [2, 3]),
    ("Compute", "Where the math happens", VIOLET,
     ["NVIDIA DGX Spark (128GB unified)", "Mac Mini (Apple Silicon)", "Consumer GPUs", "Cloud GPUs / TPUs"],
     "<b>Agent is light</b> — runs on a laptop or $5 VPS;<br>the model can live on the big box", [1]),
]
LH, LG = 100, 8
ly = SY + 40
runtime_y = None
for name, sub, c, items, hermes, days in layers:
    is_rt = name.startswith("Agent Runtime")
    if is_rt:
        runtime_y = ly
        p1.box(32, ly - 6, 1426, LH + 12, "", fill="none", stroke=MAG, sw=2, extra="arcSize=4;")
    p1.box(40, ly, 250, LH, f"<b style='font-size:16px'>{name}</b><br><span style='font-size:12px;color:{MUTED}'>{sub}</span>",
           fill=CARD2, stroke=LINE)
    p1.box(300, ly, 855, LH, "", fill=CARD, stroke=LINE, sw=1)
    chips(p1, 312, ly + 10, 835, items, c)
    p1.box(1165, ly, 285, LH, hermes + "<br>", fill=CARD2 if not is_rt else HFILL, stroke=MAG,
           fs=12, sw=1.5, dashed=0 if is_rt else 1, valign="top")
    day_badge(p1, 1165 + 285 - 68 * len(days), ly + LH - 30, days)
    ly += LH + LG
stack_bottom = ly
p1.text(40, stack_bottom, 1410, 26,
        "Arrows of dependency run downward: every layer only works because the one beneath it exists. "
        "Hermes sits in the runtime layer but has a hand in almost every other one.",
        fc=MUTED, fs=13, align="left")

# ---- Landscape quadrant ----
QX, QY, QW, QH = 1490, SY, 970, stack_bottom - SY + 26
p1.text(QX, SY, QW, 30, "③ THE PRODUCT LANDSCAPE — who builds what", fc=VIOLET, fs=18, bold=True)
ax0x, ax0y = QX + 40, SY + QH - 50      # origin
axtopy, axrightx = SY + 45, QX + QW - 10
p1.line(ax0x, ax0y, ax0x, axtopy, color=TXT, sw=2)
p1.line(ax0x, ax0y, axrightx, ax0y, color=TXT, sw=2)
p1.text(QX - 20, SY + 45, 50, QH - 100, "More autonomous &amp; persistent →", fc=TXT, fs=13, bold=True,
        align="center", extra="horizontal=0;")
p1.text(ax0x, ax0y + 8, axrightx - ax0x, 26,
        "Build it yourself (code)  ————————→  Ready to run (product)", fc=TXT, fs=13, bold=True, align="center")
midx = (ax0x + axrightx) // 2
midy = (axtopy + ax0y) // 2
p1.line(midx, axtopy, midx, ax0y, color=LINE, sw=1.5, dashed=1, arrow=False)
p1.line(ax0x, midy, axrightx, midy, color=LINE, sw=1.5, dashed=1, arrow=False)
p1.text(ax0x + 10, axtopy + 2, 300, 22, "AUTONOMOUS · YOU BUILD IT", fc=MUTED, fs=12, bold=True)
p1.text(axrightx - 310, axtopy + 2, 300, 22, "AUTONOMOUS · READY TO RUN", fc=MAG, fs=12, bold=True, align="right")
p1.text(ax0x + 10, ax0y - 26, 300, 22, "ASSISTIVE · BUILDING BLOCKS", fc=MUTED, fs=12, bold=True)
p1.text(axrightx - 310, ax0y - 26, 300, 22, "ASSISTIVE · READY TO RUN", fc=MUTED, fs=12, bold=True, align="right")


def cluster(x, y, w, h, title, items, c, note=""):
    lab = f"<b style='font-size:15px;color:{c if c == MAG else INK}'>{title}</b><br><span style='font-size:13px'>{' · '.join(items)}</span>"
    if note:
        lab += f"<br><span style='font-size:11px;color:{MUTED}'><i>{note}</i></span>"
    return p1.box(x, y, w, h, lab, fill=CARD, stroke=c, sw=1.8, valign="top")


qy0 = axtopy + 36
cluster(ax0x + 20, qy0, 380, 118, "Early autonomous experiments",
        ["AutoGPT", "BabyAGI", "AgentGPT"], AMBER, "2023: proved the idea, too brittle to trust")
cluster(ax0x + 20, qy0 + 150, 380, 150, "Agent frameworks & SDKs",
        ["LangChain / LangGraph", "CrewAI", "AutoGen / AG2", "LlamaIndex", "OpenAI Agents SDK",
         "Claude Agent SDK", "Google ADK", "Pydantic AI", "smolagents"], AMBER,
        "Powerful, but you write the agent in Python/TS")
cluster(ax0x + 20, ax0y - 170, 380, 110, "Low-code workflow builders",
        ["n8n", "Dify", "Flowise", "Zapier Agents"], TEAL, "Drag-and-drop flows with LLM steps")
cluster(midx + 20, qy0, 400, 310, "Always-on personal agents", [], MAG)
hb = p1.box(midx + 40, qy0 + 38, 360, 150,
            "<b style='font-size:20px'>★ HERMES AGENT</b><br><span style='font-size:13px'>by Nous Research · open source<br>"
            "memory · skills · MCP · cron · subagents<br>Telegram / Discord / Slack / WhatsApp / Signal<br>"
            "any model, local or cloud</span>", fill=HFILL, stroke=MAG, sw=2)
p1.box(midx + 40, qy0 + 200, 360, 96,
       "<b>Neighbors:</b> OpenClaw · Manus<br><span style='font-size:12px;color:" + MUTED +
       "'>Same idea: an agent that lives somewhere, remembers you, and works while you’re away</span>",
       fill=CARD2, stroke=MAG, fs=13)
cluster(midx - 200, midy + 30, 360, 120, "Enterprise agent platforms",
        ["Microsoft Copilot Studio", "Salesforce Agentforce", "AWS Bedrock Agents", "Vertex AI Agent Builder"],
        BLUE, "Managed, governed, vendor cloud")
cluster(midx + 190, midy - 110, 250, 200, "Coding agents",
        ["Claude Code", "Codex CLI", "Gemini CLI", "Cursor", "Aider", "OpenHands"], GREEN,
        "Autonomous, but scoped to a repo")
cluster(midx + 190, midy + 110, 250, 130, "Computer / browser use",
        ["ChatGPT agent", "Claude computer use", "Browser Use"], TEAL, "Clicks & types in a real UI")
cluster(midx + 60, ax0y - 150, 380, 110, "Chat assistants",
        ["ChatGPT", "Claude.ai", "Gemini", "Open WebUI"], BLUE, "You drive every turn")

# ---- Autonomy spectrum ----
AY = stack_bottom + 60
p1.text(40, AY, 2420, 30, "④ THE AUTONOMY SPECTRUM — how much the AI does without you", fc=VIOLET, fs=18, bold=True)
levels = [
    ("Level 0 · Chat", "Answers questions. You copy/paste the result into the real world.", BLUE),
    ("Level 1 · Copilot", "Suggests inline (autocomplete, drafts). You accept or reject each one.", TEAL),
    ("Level 2 · Tool-using assistant", "Calls one tool when asked (“what time is it in Tokyo?”), then stops.", GREEN),
    ("Level 3 · Agent", "Loops plan → act → observe on its own until the task is actually done.", AMBER),
    ("Level 4 · Always-on agent", "Remembers you, runs on a schedule, reaches out on chat apps — works while you sleep.", MAG),
]
lw, lg = 452, 38
lids = []
for k, (t, d, c) in enumerate(levels):
    x = 40 + k * (lw + lg)
    lids.append(p1.box(x, AY + 40, lw, 92,
                       f"<b style='font-size:16px;color:{c if c == MAG else INK}'>{t}</b><br><span style='font-size:13px'>{d}</span>",
                       fill=CARD, stroke=c, sw=2))
for a, b in zip(lids, lids[1:]):
    p1.edge(a, b, color=MUTED)
hx = 40 + 3 * (lw + lg)
p1.box(hx, AY + 146, 2 * lw + lg, 58,
       "<b>Hermes Agent spans Levels 3 → 4:</b> an agent loop out of the box (Day 2–6), "
       "always-on once you add memory + cron + the gateway (Day 7 capstone)",
       fill=CARD2, stroke=MAG, sw=2.5, dashed=1, fs=14)
p1.box(40, AY + 146, 3 * lw + 2 * lg, 58,
       "Most people’s AI use today is Levels 0–2. The jump to Level 3 is the jump from <i>“AI that talks”</i> to <i>“AI that does.”</i>",
       fill=CARD, stroke=LINE, fs=14, fc=MUTED)

# ---- Takeaways ----
TY = AY + 240
p1.text(40, TY, 2420, 30, "⑤ KEY TAKEAWAYS", fc=VIOLET, fs=18, bold=True)
takes = [
    ("Hermes is a harness, not a model",
     "It’s the loop, tools, memory and plumbing <i>around</i> an LLM. Nous Research also publishes the "
     "open-weight <i>Hermes</i> LLMs — Hermes Agent can run those, or GPT, Claude, Qwen, anything.", MAG),
    ("It’s the glue between layers",
     "Down: any OpenAI-compatible model server. Sideways: MCP tools, skills, RAG. Up: CLI, Telegram, Discord, "
     "Slack, cron. Learn Hermes and you’ve touched every layer of the stack.", BLUE),
    ("Why we teach with it",
     "Open source, runs on our own DGX Spark + Mac Mini, no code required to start, and it goes all the way to "
     "a real 24x7 agent — the skills transfer to every other tool on this map.", GREEN),
]
tw = (2420 - 2 * 30) // 3
for k, (t, d, c) in enumerate(takes):
    p1.box(40 + k * (tw + 30), TY + 38, tw, 100,
           f"<b style='font-size:17px;color:{c if c == MAG else INK}'>{t}</b><br><span style='font-size:14px'>{d}</span>",
           fill=CARD, stroke=c, sw=2, valign="top")
p1.h = TY + 170

# =====================================================================================
# PAGE 2 — INSIDE HERMES AGENT
# =====================================================================================
p2 = Page("2 · Inside Hermes Agent", "anatomy", 2400, 1500)
p2.text(40, 18, 2320, 50, "Inside Hermes Agent — anatomy of an always-on agent", fs=36, bold=True)
p2.text(40, 66, 1080, 30,
        "Everything wraps one loop. Badges show which course session covers each part.",
        fc=MUTED, fs=16)
# legend
lx = 1150
for d, t in [(1, "Intro"), (2, "Fundamentals"), (3, "Routing"), (4, "RAG"), (5, "MCPs"), (6, "Tools & loops"), (7, "Deploy")]:
    p2.box(lx, 64, 150, 26, f"Day {d} · {t}", fill=CARD2, stroke=DAY_COLORS[d], fc=DAY_COLORS[d], fs=11, bold=True,
           extra="arcSize=50;")
    lx += 156
p2.h = 1260

# core container
p2.box(860, 390, 780, 560, "", fill="#fffcf8", stroke=MAG, sw=2.5, extra="arcSize=4;")
p2.text(880, 398, 740, 30, "HERMES AGENT CORE — the agent loop", fc=MAG, fs=18, bold=True, align="center")
rcv = p2.box(900, 450, 280, 120,
             "<b style='font-size:18px'>1 · Receive</b><br>a message from the CLI, a chat app, or a scheduled job "
             "— plus memory &amp; skill context", stroke=BLUE, sw=2.5)
thk = p2.box(1320, 450, 280, 120,
             "<b style='font-size:18px'>2 · Think</b><br>send context + the list of available tools to the LLM; "
             "it decides: answer, or call a tool?", stroke=VIOLET, sw=2.5)
act = p2.box(1320, 790, 280, 120,
             "<b style='font-size:18px'>3 · Act</b><br>execute the tool call: shell, file, web, MCP, skill, "
             "or spawn a subagent", stroke=GREEN, sw=2.5)
obs = p2.box(900, 790, 280, 120,
             "<b style='font-size:18px'>4 · Observe</b><br>feed the result back into context; save anything "
             "worth remembering", stroke=AMBER, sw=2.5)
p2.edge(rcv, thk, "", color=TXT)
p2.edge(thk, act, "tool call (JSON)", color=TXT)
p2.edge(act, obs, "result", color=TXT)
p2.edge(obs, thk, "<b>not done yet →<br>think again</b><br><span style='color:" + MUTED + "'>(repeat until the task<br>is actually done)</span>", color=MAG, sw=2, extra="edgeStyle=none;exitX=1;exitY=0;entryX=0;entryY=1;fontSize=14;")
p2.text(880, 915, 740, 30, "Done → final answer goes back out the same channel it came in on",
        fc=MUTED, fs=13, align="center")

# entry points (left)
p2.text(60, 360, 700, 30, "ENTRY POINTS — how work arrives", fc=BLUE, fs=18, bold=True)
e1 = p2.box(60, 400, 700, 100,
            "<b>CLI / TUI</b> — type <font face='monospace'>hermes</font> in a terminal and chat; "
            "one-shot commands for scripts", align="left", stroke=BLUE)
day_badge(p2, 690, 406, [2])
e2 = p2.box(60, 515, 700, 120,
            "<b>Messaging gateway</b> — the same agent answers on Telegram · Discord · Slack · WhatsApp · Signal · email. "
            "Start a task on your laptop, check on it from your phone.", align="left", stroke=BLUE)
day_badge(p2, 690, 521, [7])
e3 = p2.box(60, 650, 700, 110,
            "<b>Scheduler (cron)</b> — natural-language jobs: “every weekday at 8am, summarise my inbox and "
            "post it to Telegram”. The agent starts work with nobody asking.", align="left", stroke=BLUE)
day_badge(p2, 690, 656, [7])
for e in (e1, e2, e3):
    p2.edge(e, rcv, "", color=BLUE, extra="exitX=1;exitY=0.5;entryX=0;entryY=0.5;")

p2.text(60, 790, 700, 30, "SAFETY & CONTROL", fc=RED, fs=18, bold=True)
p2.box(60, 828, 700, 122,
       "• Approval prompts before risky shell commands<br>• Turn whole toolsets on/off per platform<br>"
       "• Run commands in a sandbox backend instead of your host<br>• Everything is plain config you can read: "
       "<font face='monospace'>~/.hermes/</font>", align="left", stroke=RED, fs=14)
day_badge(p2, 690, 834, [7])

# model providers (top)
p2.text(860, 118, 640, 30, "MODEL PROVIDERS — the brain is swappable", fc=VIOLET, fs=18, bold=True)
mp = p2.box(860, 156, 780, 170, "", fill=CARD, stroke=VIOLET, sw=2)
provs = [("llama.cpp", "on DGX Spark"), ("Ollama", "on Mac Mini"), ("vLLM", "GPU server"),
         ("OpenRouter", "100s of models"), ("Nous Portal", "Hermes LLMs"), ("OpenAI etc.", "cloud APIs")]
pw = (780 - 16 - 5 * 8) // 6
for k, (t, s) in enumerate(provs):
    p2.box(868 + k * (pw + 8), 168, pw, 64, f"<b>{t}</b><br><span style='font-size:11px;color:{MUTED}'>{s}</span>",
           fill=CARD2, stroke=VIOLET if k < 3 else BLUE, fs=13)
p2.text(876, 240, 750, 80,
        "All reached through one <b>OpenAI-compatible</b> API. Change <font face='monospace'>model:</font> in config "
        "and the whole agent gets a new brain.<br><b>Routing (Day 3):</b> small fast model for lookups, big model for "
        "hard reasoning.", fc=TXT, fs=13)
day_badge(p2, 1640 - 68 * 2, 124, [2, 3])
p2.edge(thk, mp, "prompt + tools →<br>← reply / tool call", color=VIOLET, extra="exitX=0.5;exitY=0;entryX=0.8;entryY=1;")

# capabilities (right)
p2.text(1720, 150, 640, 30, "CAPABILITIES — what it can do", fc=GREEN, fs=18, bold=True)
caps = [
    ("Built-in toolsets", "terminal · files · web search · browser · code execution · vision · image gen", [6]),
    ("MCP client", "connect any MCP server: time, filesystem, GitHub, databases… one config line each", [5]),
    ("Skills", "SKILL.md recipes for multi-step procedures — install from a hub, or the agent writes its own after solving something hard", [6]),
    ("Subagents", "delegate a subtask to a fresh agent with clean context; it returns just the result", [6]),
    ("Execution backends", "run tools locally, in Docker, over SSH, or in a cloud sandbox", [7]),
]
cy = 190
cap_ids = []
for t, d, days in caps:
    i = p2.box(1720, cy, 640, 108, f"<b style='font-size:15px'>{t}</b><br>{d}", align="left", stroke=GREEN, fs=13,
               valign="top")
    day_badge(p2, 2360 - 68 * len(days) - 6, cy + 76, days)
    cap_ids.append(i)
    cy += 120
for i in cap_ids:
    p2.edge(act, i, "", color=GREEN, extra="exitX=1;exitY=0.5;entryX=0;entryY=0.5;")

# memory (bottom)
p2.text(1100, 990, 460, 30, "MEMORY & KNOWLEDGE — what it knows", fc=AMBER, fs=18, bold=True, align="right")
mems = [
    ("MEMORY.md", "facts & lessons the agent chose to keep"),
    ("USER.md", "who you are, how you like things done"),
    ("Session search", "look back through past conversations"),
    ("RAG over your docs", "ChromaDB lookup via a tool / MCP"),
]
mem_ids = []
mw = (780 - 3 * 12) // 4
for k, (t, d) in enumerate(mems):
    mem_ids.append(p2.box(860 + k * (mw + 12), 1030, mw, 110,
                          f"<b style='font-size:15px'>{t}</b><br><span style='font-size:13px'>{d}</span>",
                          stroke=AMBER, fs=13))
day_badge(p2, 1640 - 68, 994, [4])
p2.edge(obs, mem_ids[0], "writes / recalls", color=AMBER, extra="startArrow=block;startFill=1;exitX=0.3;exitY=1;entryX=0.7;entryY=0;")
p2.box(860, 1160, 780, 70,
       "Memory is why it feels like the <i>same</i> agent next week. RAG is why it answers from <i>your</i> "
       "documents instead of guessing.", fill=CARD2, stroke=AMBER, dashed=1, fs=14)

# worked example (bottom right)
p2.text(1720, 820, 640, 30, "ONE REQUEST, END TO END", fc=MAG, fs=18, bold=True)
p2.box(1720, 858, 640, 330,
       "<b>You, on Telegram:</b> “Check what time it is in Tokyo and remind me at 9am tomorrow to call Kenji.”<br><br>"
       "<b>1 · Receive</b> — gateway delivers the message + your USER.md<br>"
       "<b>2 · Think</b> — model sees a time tool is available → emits a tool call<br>"
       "<b>3 · Act</b> — MCP time server returns Tokyo’s current time<br>"
       "<b>4 · Observe</b> — result goes back in context, not done yet<br>"
       "<b>2 · Think</b> — model decides to create a scheduled job<br>"
       "<b>3 · Act</b> — cron job saved for 9:00 tomorrow<br>"
       "<b>Done</b> — replies on Telegram with the time + confirmation<br><br>"
       "<span style='color:" + MUTED + "'>Next morning the cron job fires, and the agent messages <i>you</i> first. "
       "That’s Level 4.</span>",
       align="left", valign="top", stroke=MAG, sw=2, fs=14)

# config footer
p2.box(60, 990, 700, 210,
       "<b style='font-size:15px;color:" + INK + "'>WHERE IT ALL LIVES</b><br>"
       "<font face='monospace'>~/.hermes/</font><br>"
       "&nbsp;&nbsp;<font face='monospace'>config.yaml</font> — model, provider, toolsets, MCP servers<br>"
       "&nbsp;&nbsp;<font face='monospace'>.env</font> — API keys &amp; bot tokens<br>"
       "&nbsp;&nbsp;<font face='monospace'>skills/</font> — installed + self-written SKILL.md files<br>"
       "&nbsp;&nbsp;memories — MEMORY.md &amp; USER.md<br><br>"
       "<span style='color:" + MUTED + "'>No code to write — the whole agent is configuration + Markdown. "
       "That’s what makes it teachable in 7 sessions.</span>",
       align="left", valign="top", stroke=TEAL, fs=14)

# =====================================================================================
# PAGE 3 — COMPARISON + COURSE MAP
# =====================================================================================
p3 = Page("3 · Hermes vs. Neighbors + Course Map", "compare", 2400, 1400)
p3.text(40, 18, 2320, 50, "Hermes vs. Its Neighbors — and How the Course Walks the Stack", fs=36, bold=True)
p3.text(40, 66, 2320, 30, "Five kinds of ‘AI that does things’, compared on what matters when you want an agent that "
        "works for you.  Green = yes · amber = partly / depends · red = no.", fc=MUTED, fs=16)
cols = ["Chat assistant", "Agent framework", "Coding agent", "Enterprise platform", "★ Hermes Agent"]
colc = [BLUE, AMBER, GREEN, TEAL, MAG]
rows = [
    ("What it is", ["A chat window, sometimes with tools", "Libraries for building agents in code",
                    "An agent that lives in your repo", "Managed agents inside a SaaS suite",
                    "A ready-to-run, general-purpose agent"], "nnnnn"),
    ("Examples", ["ChatGPT · Claude.ai · Open WebUI", "LangGraph · CrewAI · OpenAI Agents SDK",
                  "Claude Code · Codex CLI · Gemini CLI", "Copilot Studio · Agentforce · Bedrock Agents",
                  "Hermes Agent (Nous Research) · cf. OpenClaw"], "nnnnn"),
    ("No coding needed?", ["Yes", "No — Python / TypeScript", "Yes (it writes code for you)", "Low-code / config",
                           "Yes — YAML config + Markdown skills"], "graag"),
    ("Pick any model?", ["Vendor’s models (Open WebUI: any)", "Yes", "Mostly the vendor’s models",
                         "Platform’s catalog", "Yes — any OpenAI-compatible endpoint, local or cloud"], "agrag"),
    ("Remembers across sessions?", ["Some — vendor memory features", "Whatever you build",
                                    "Project files (CLAUDE.md, AGENTS.md)", "Yes, platform-managed",
                                    "Yes — MEMORY.md, USER.md, session search"], "aaagg"),
    ("Works unattended 24x7?", ["No — waits for you", "Whatever you build", "Mostly interactive; headless modes exist",
                                "Yes", "Yes — cron jobs + gateway as a service"], "raagg"),
    ("Reaches you on chat apps?", ["Only its own app", "Whatever you build", "Limited", "Yes (Teams, Slack…)",
                                   "Yes — Telegram, Discord, Slack, WhatsApp, Signal…"], "raagg"),
    ("Self-hosted / you own the data?", ["Open WebUI yes; SaaS no", "Yes", "Runs locally; model usually in cloud",
                                         "No — vendor cloud", "Yes — open source, runs on your hardware"], "agarg"),
    ("Best for", ["Q&amp;A, drafting, research", "Custom agent products", "Software engineering",
                  "Company workflows at scale", "A personal / team agent you own and can leave running"], "nnnnn"),
]
tint = {"g": ("#edf5ee", "#b7cdb9"), "a": ("#faf3e3", "#dbc9a0"), "r": ("#f8e9e7", "#d9b1ab"), "n": (CARD, LINE)}
TX, TY3, c0w, cw3, rh = 40, 120, 300, 404, 70
for k, (c, col) in enumerate(zip(cols, colc)):
    hermes = k == 4
    p3.box(TX + c0w + 8 + k * (cw3 + 8), TY3, cw3, 56, f"<b style='font-size:17px'>{c}</b>",
           fill=HFILL if hermes else CARD2, stroke=MAG if hermes else LINE, sw=2 if hermes else 1)
y = TY3 + 64
for label, vals, grades in rows:
    p3.box(TX, y, c0w, rh, f"<b>{label}</b>", fill=CARD2, stroke=LINE, fs=15, align="left")
    for k, (v, g) in enumerate(zip(vals, grades)):
        f, s = tint[g]
        hermes = k == 4
        p3.box(TX + c0w + 8 + k * (cw3 + 8), y, cw3, rh, f"<b>{v}</b>" if hermes else v, fill=f,
               stroke=MAG if hermes else s, sw=2.5 if hermes else 1, fs=14)
    y += rh + 8

# course map
CY = y + 40
p3.text(40, CY, 2320, 30, "THE COURSE AS A WALK THROUGH THE STACK — Fri Sep 25 → Fri Oct 9, 2026 · Mon/Wed/Fri 6–7pm MST",
        fc=VIOLET, fs=18, bold=True)
days = [
    (1, "Fri Sep 25", "Intro to LLMs and Hermes", "The whole map (this diagram)", "Talk only — where agents fit"),
    (2, "Mon Sep 28", "Hermes Fundamentals", "Runtime · Models · Serving", "Install, point at DGX Spark / Mac Mini"),
    (3, "Wed Sep 30", "LLM Routing with Hermes", "Models · Serving · Protocols", "Right model for each task"),
    (4, "Fri Oct 2", "RAG with Hermes", "Knowledge & Memory", "Ground answers in real docs"),
    (5, "Mon Oct 5", "MCPs for Hermes", "Protocols · Tools", "Plug in external systems"),
    (6, "Wed Oct 7", "Tool Calling &amp; Agent Loops", "Tools & Skills · Runtime", "How the loop decides & repeats"),
    (7, "Fri Oct 9", "Deploy a Production Hermes Agent", "Ops · Channels", "Capstone: a 24x7 agent on chat apps"),
]
dw, dg = 318, 16
dids = []
for k, (d, date, title, layer, what) in enumerate(days):
    c = DAY_COLORS[d]
    dids.append(p3.box(40 + k * (dw + dg), CY + 44, dw, 130,
                       f"<b style='font-size:15px;color:{c if c == MAG else INK}'>DAY {d} · {date}</b><br>"
                       f"<b style='font-size:16px'>{title}</b><br>"
                       f"<span style='font-size:12px;color:{MUTED}'>Stack layers:</span><br>"
                       f"<b style='font-size:13px'>{layer}</b><br><span style='font-size:13px;color:{MUTED}'><i>{what}</i></span>",
                       stroke=c, sw=2.5 if d in (1, 7) else 1.8, valign="top"))
for a, b in zip(dids, dids[1:]):
    p3.edge(a, b, color=MUTED)
p3.box(40, CY + 194, 2320, 56,
       "Bottom-up on purpose: Day 2–3 get a brain talking, Day 4 gives it knowledge, Day 5–6 give it hands, "
       "Day 7 makes it always-on. By the end you’ve built one agent that exercises every layer on page 1.",
       fill=CARD2, stroke=VIOLET, fs=15)
p3.h = CY + 280

out = sys.argv[1]
with open(out, "w") as f:
    f.write('<mxfile host="app.diagrams.net" agent="SaturdAI generator" version="24.0.0">')
    for p in (p1, p2, p3):
        f.write(p.xml())
    f.write("</mxfile>")
print("ok", p1.h, p2.h, p3.h)
