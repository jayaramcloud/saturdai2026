#!/usr/bin/env python3
"""Generate the Hermes Day 8 (bonus: Build a Chatbot) slide SVGs.

Writes 1600x900 SVGs in the site's dark-purple style (same palette as the Day 7 deck) into
materials/hermes-day-8-chatbot/. Copy the output to public/slides/hermes-day-8/ (both copies
must stay in sync; there is no build step that does it).

Facts shown on the slides come from the real jayaram-app Worker (src/worker.js).
Run:  python3 materials/hermes-day-8-chatbot/gen.py
"""
import os

OUT = os.path.dirname(os.path.abspath(__file__))
TOTAL = 6

BLUE, TEAL, AMBER, MAGENTA, GREEN, VIOLET, RED = (
    "#5b7cfa", "#0d9488", "#d97706", "#ec4899", "#16a34a", "#8b5cf6", "#f5576c")

HEAD = """<svg viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f0f1e"/>
      <stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#764ba2"/>
    </linearGradient>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#a0a0c0"/>
    </marker>
    <marker id="arrowO" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#d97706"/>
    </marker>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)"/>
"""


def slide(n, title, subtitle, body):
    foot = (f'\n  <text x="80" y="860" font-size="14" fill="#8888aa">SaturdAI &#183; Hermes Agent Day 8: Build a Chatbot</text>'
            f'\n  <text x="1520" y="860" font-size="14" fill="#8888aa" text-anchor="end">{n} / {TOTAL}</text>\n</svg>\n')
    top = (f'  <text x="80" y="90" font-size="40" font-weight="800" fill="url(#titleGrad)">{title}</text>\n'
           f'  <text x="80" y="130" font-size="22" fill="#a0a0c0">{subtitle}</text>\n\n')
    return HEAD + top + body + foot


def box(x, y, w, h, color, title, lines, fill_op="0.14", title_size=22, line_size=16, gap=30):
    s = (f'  <g transform="translate({x},{y})">\n'
         f'    <rect width="{w}" height="{h}" rx="18" fill="{color}" fill-opacity="{fill_op}" stroke="{color}" stroke-width="2.5"/>\n'
         f'    <text x="{w//2}" y="46" font-size="{title_size}" font-weight="700" fill="#ffffff" text-anchor="middle">{title}</text>\n')
    for i, ln in enumerate(lines):
        s += f'    <text x="{w//2}" y="{86 + i*gap}" font-size="{line_size}" fill="#c0c0d0" text-anchor="middle">{ln}</text>\n'
    return s + '  </g>\n'


slides = {}

# 1 ---------------------------------------------------------------- the problem
b = ""
b += box(100, 220, 640, 460, RED, "The tempting shortcut", [
    "Put the AI key in the web page's JavaScript",
    "", "&#8226; The key ships to every visitor's browser",
    "&#8226; Anyone can copy it from View Source",
    "&#8226; They can spend your money, not just use your site",
    "&#8226; A key committed to a public repo is found by",
    "   bots within minutes",
    "", "Never do this."], gap=32)
b += box(860, 220, 640, 460, GREEN, "The safe pattern", [
    "Put a small server in the middle",
    "", "&#8226; The browser only talks to YOUR server",
    "&#8226; The server holds the key as a secret",
    "&#8226; The server checks every question first",
    "&#8226; Visitors never see the key or raw errors",
    "", "Browser &#8594; Worker &#8594; AI &#8594; Worker &#8594; Browser"], gap=32)
b += '  <text x="800" y="460" font-size="34" font-weight="800" fill="#a0a0c0" text-anchor="middle">&#8594;</text>\n'
b += '  <text x="800" y="780" font-size="20" fill="#a0a0c0" text-anchor="middle">Rule one of any chatbot: the browser never calls the AI directly.</text>\n'
slides[1] = ("01-why-a-server-in-the-middle.svg", slide(1, "Why a Chatbot Needs a Server in the Middle",
             "The API key is the whole risk. Everything else is design.", b))

# 2 ---------------------------------------------------------------- architecture
b = ""
b += box(80, 250, 340, 300, BLUE, "Browser", ["chat page", "", "types a question", "shows the reply"], gap=34)
b += box(520, 200, 560, 420, AMBER, "Cloudflare Worker", [
    "POST /api/ask", "",
    "1  validate the question",
    "2  rate limit (best effort)",
    "3  add system prompt + history",
    "4  attach the secret key, call the AI"], gap=34)
b += box(1180, 250, 340, 300, VIOLET, "Claude API", ["api.anthropic.com", "/v1/messages", "", "writes the answer"], gap=34)
b += '  <line x1="420" y1="360" x2="515" y2="360" stroke="#d97706" stroke-width="4" marker-end="url(#arrowO)"/>\n'
b += '  <line x1="515" y1="440" x2="425" y2="440" stroke="#a0a0c0" stroke-width="4" marker-end="url(#arrow)"/>\n'
b += '  <line x1="1080" y1="360" x2="1175" y2="360" stroke="#d97706" stroke-width="4" marker-end="url(#arrowO)"/>\n'
b += '  <line x1="1175" y1="440" x2="1085" y2="440" stroke="#a0a0c0" stroke-width="4" marker-end="url(#arrow)"/>\n'
b += box(520, 680, 270, 130, RED, "Secret key", ["stored on Cloudflare,", "never in the repo"], title_size=18, line_size=14, gap=24)
b += box(810, 680, 270, 130, TEAL, "Static files", ["pages, CSS, JS", "served separately"], title_size=18, line_size=14, gap=24)
b += '  <text x="470" y="335" font-size="14" font-weight="700" fill="#d97706" text-anchor="middle">question</text>\n'
b += '  <text x="470" y="470" font-size="14" font-weight="700" fill="#a0a0c0" text-anchor="middle">reply</text>\n'
slides[2] = ("02-three-part-architecture.svg", slide(2, "Three Parts, One Request Path",
             "The page, the Worker, and the model. The key lives only in the middle.", b))

# 3 ---------------------------------------------------------------- one request
b = ""
steps = [
    (BLUE,    "1  Send",     ["The page posts", "{question, history}", "to /api/ask"]),
    (AMBER,   "2  Check",    ["Valid JSON, a string,", "not empty, max 600", "characters"]),
    (TEAL,    "3  Prepare",  ["Add a system prompt", "and the last 6 messages", "so follow-ups work"]),
    (VIOLET,  "4  Ask",      ["Call Claude with the", "secret key, model, and", "a 450-token cap"]),
    (GREEN,   "5  Show",     ["Turn **bold** and lists", "into safe page", "elements (no innerHTML)"]),
]
x = 70
for i, (c, t, ls) in enumerate(steps):
    b += box(x, 260, 270, 330, c, t, ls, title_size=24, line_size=16, gap=34)
    if i < len(steps) - 1:
        b += f'  <line x1="{x+272}" y1="425" x2="{x+300}" y2="425" stroke="#a0a0c0" stroke-width="4" marker-end="url(#arrow)"/>\n'
    x += 300
b += '  <text x="800" y="700" font-size="20" fill="#a0a0c0" text-anchor="middle">If anything fails, the visitor sees a friendly message, never the raw error or the key.</text>\n'
slides[3] = ("03-anatomy-of-one-request.svg", slide(3, "What Happens When You Press Send",
             "Five steps, usually a couple of seconds end to end.", b))

# 4 ---------------------------------------------------------------- safety
b = ""
items = [
    (RED,     "Secret stays server-side", ["Stored with", "wrangler secret put,", "not in GitHub or the page"]),
    (AMBER,   "Limit the input",         ["600 characters per question,", "only the last 6 messages", "of history are sent"]),
    (TEAL,    "Keep it on topic",        ["A system prompt makes it a", "career coach and tells it to", "ignore hidden instructions"]),
    (BLUE,    "Display safely",          ["Replies are built from text", "nodes, so HTML in an answer", "is shown, never run"]),
    (VIOLET,  "Cap the spend",           ["Small model, 450-token answers,", "and a monthly limit set on", "the key in the console"]),
    (GREEN,   "Protect privacy",         ["Conversations live in the", "browser only; users are told", "not to share personal data"]),
]
for i, (c, t, ls) in enumerate(items):
    col, row = i % 3, i // 3
    b += box(80 + col * 490, 190 + row * 310, 450, 280, c, t, ls, title_size=22, line_size=16, gap=32)
slides[4] = ("04-safety-and-cost-controls.svg", slide(4, "Six Safety and Cost Controls",
             "None of these is exotic. Together they make a public chatbot safe to leave running.", b))

# 5 ---------------------------------------------------------------- honest limits
b = ""
b += box(100, 210, 640, 470, AMBER, "A limit we found by testing", [
    "The built-in rate limit is only a speed bump",
    "", "&#8226; Its counters live in each Worker copy's memory",
    "&#8226; Cloudflare runs many copies at once",
    "&#8226; In a live test, 10 quick requests from one",
    "   address all succeeded, with the limit set to 8",
    "", "So the monthly spend limit on the key",
    "is the control that really protects you."], gap=32)
b += box(860, 210, 640, 470, VIOLET, "How to make it stronger", [
    "Pick one, depending on how much traffic you expect",
    "", "&#8226; Cloudflare rate-limiting rules (no code)",
    "&#8226; A Durable Object that counts per visitor",
    "&#8226; Turnstile, a free bot check on the page",
    "", "Also remember: API keys expire.",
    "Rotate it and re-run the secret command."], gap=32)
b += '  <text x="800" y="760" font-size="20" fill="#a0a0c0" text-anchor="middle">Report what testing actually showed, including the parts that did not work as hoped.</text>\n'
slides[5] = ("05-honest-limits.svg", slide(5, "What We Got Wrong, and How to Fix It",
             "Tested against the live site, not just on paper.", b))

# 6 ---------------------------------------------------------------- next steps
b = ""
ideas = [
    (BLUE,    "Stream the answer",     ["Show the reply word by word", "instead of waiting for all of it"]),
    (TEAL,    "Add RAG",               ["Ground answers in your own", "documents, like Day 4"]),
    (AMBER,   "Mock-interview mode",   ["Let the bot ask the questions", "and score your answers"]),
    (MAGENTA, "Add tools (MCP)",       ["Let it look things up or take", "actions, like Days 5 and 6"]),
    (GREEN,   "Save conversations",    ["Optional, with sign-in and a", "clear privacy notice"]),
    (VIOLET,  "Run a local model",     ["Swap the Claude call for your", "own DGX Spark or Mac Mini"]),
]
for i, (c, t, ls) in enumerate(ideas):
    col, row = i % 3, i // 3
    b += box(80 + col * 490, 200 + row * 290, 450, 250, c, t, ls, title_size=22, line_size=17, gap=34)
b += '  <text x="800" y="800" font-size="20" fill="#a0a0c0" text-anchor="middle">The pattern stays the same: a server in the middle that checks, adds context, and holds the secrets.</text>\n'
slides[6] = ("06-where-to-go-next.svg", slide(6, "Where to Take Your Chatbot Next",
             "Every idea reuses something from earlier in the course.", b))

for _, (name, svg) in sorted(slides.items()):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(svg)
    print("wrote", name, len(svg), "bytes")
