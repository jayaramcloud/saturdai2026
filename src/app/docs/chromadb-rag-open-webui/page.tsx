import Link from "next/link";
import type { CSSProperties } from "react";
import CodeBlock from "@/components/CodeBlock";

const h2Style: CSSProperties = { color: "#ffffff", fontSize: "1.4rem", margin: "2rem 0 1rem" };
const h3Style: CSSProperties = { color: "#ffffff", fontSize: "1.1rem", margin: "1.5rem 0 0.75rem" };
const pStyle: CSSProperties = { marginBottom: "1.5rem" };
const noteStyle: CSSProperties = {
  background: "#2a2a4a",
  border: "1px solid #44447a",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};
const warnStyle: CSSProperties = {
  background: "#3a2a2a",
  border: "1px solid #7a4444",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
};
const figureStyle: CSSProperties = { marginBottom: "1.5rem" };
const imgStyle: CSSProperties = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid #33335a",
  display: "block",
};
const captionStyle: CSSProperties = {
  color: "#8888aa",
  fontSize: "0.8rem",
  marginTop: "0.5rem",
  textAlign: "center",
};

export default function ChromaDbRagOpenWebui() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <Link href="/docs" style={{ color: "#8888aa", textDecoration: "underline" }}>
        ← All docs
      </Link>
      <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: "1.5rem 0 0.5rem" }}>2026-07-24</p>
      <h1 className="section-title" style={{ textAlign: "left", marginBottom: "2rem" }}>
        Standalone ChromaDB for RAG in Open WebUI
      </h1>

      <div className="description" style={{ margin: "0 auto 2rem", maxWidth: 700, textAlign: "left" }}>
        <p style={pStyle}>
          Our earlier <Link href="/docs/rag-poc-open-webui" style={{ color: "#a0a0ff" }}>RAG proof-of-concept</Link>{" "}
          used Open WebUI&apos;s <strong>embedded</strong> vector store — invisible, zero-config, and
          already backed by ChromaDB under the hood (confirmed on our own box: Open WebUI 0.x ships
          ChromaDB <code>1.5.9</code> and persists it to{" "}
          <code>/app/backend/data/vector_db/chroma.sqlite3</code> inside the container). This doc goes
          one level deeper: we run ChromaDB as its own <strong>standalone server</strong>, point Open
          WebUI at it over HTTP instead of the embedded file store, and prove retrieval is grounded by
          querying the vector database directly — not just trusting Open WebUI&apos;s citation UI.
        </p>
        <p style={pStyle}>
          <strong>Why bother, if the embedded store already works?</strong> Because a standalone server
          is what a real deployment looks like: the vector DB becomes an inspectable, independently
          running service with its own port and API, which other apps could share, which you can back
          up separately, and which you can query yourself to see exactly what got embedded — instead of
          a hidden SQLite file inside a container.
        </p>

        <div style={warnStyle}>
          <strong>Before you start:</strong> this changes which vector store the live{" "}
          <code>open-webui</code> container uses. Knowledge collections already embedded in the old,
          embedded store will not automatically appear once you point Open WebUI at the new external
          Chroma server — you&apos;ll be starting that collection fresh. Do this as a deliberate demo,
          not an accidental switch on a box other people are using mid-class. If you want to keep the
          old embedded data reachable later, note that it stays on disk in the{" "}
          <code>open-webui</code> Docker volume untouched — you&apos;re not deleting anything, just
          changing where <em>new</em> collections get written.
        </div>

        <h2 style={h2Style}>1. Confirm the environment</h2>
        <p style={pStyle}>
          On the HP workstation (<code>192.168.1.92</code>), Open WebUI already runs as a Docker
          container named <code>open-webui</code> with <code>--network host</code>, serving the UI on{" "}
          <code>:8080</code>. <code>llama-server</code> is already using <code>:8001</code> for
          inference, so port <code>:8000</code> is free — that&apos;s what we&apos;ll give the
          standalone Chroma server.
        </p>
        <CodeBlock code={`ssh jay@192.168.1.92

# sanity check — confirm 8000 is free and docker is present
sudo ss -tlnp | grep -E ':(8000|8001|8080)'
docker ps -a`} />
        <div style={noteStyle}>
          Open WebUI is also managed by a systemd unit (<code>/etc/systemd/system/open-webui.service</code>,{" "}
          <code>Restart=always</code>). Worth knowing going in: on our box that unit&apos;s{" "}
          <code>ExecStart</code> has drifted from the container that&apos;s actually been running for
          days (someone <code>docker run -d</code>&apos;d it by hand at some point), so systemd has been
          silently crash-looping in the background trying to recreate a container named{" "}
          <code>open-webui</code> that already exists — check with{" "}
          <code>systemctl status open-webui.service</code> (look for a large &quot;restart counter&quot;)
          and <code>journalctl -u open-webui.service -n 20</code>. Harmless — the real container never
          goes down — but it means <strong>the unit file, not a manual <code>docker run</code></strong>,
          is the safe place to change how Open WebUI starts, since anything done by hand will fight the
          next auto-restart.
        </div>

        <h2 style={h2Style}>2. Run ChromaDB as its own container</h2>
        <p style={pStyle}>
          Pull the official Chroma server image, then set it up as a systemd service right away —
          every other service on this box (<code>llama-inference-*</code>, <code>open-webui</code>) is
          systemd-managed with <code>Restart=always</code>, and a plain <code>docker run -d</code> has no
          restart policy of its own, so it would not survive a reboot. Skip the ad-hoc container
          entirely and go straight to the unit file:
        </p>
        <CodeBlock code={`sudo docker pull chromadb/chroma`} />
        <p style={pStyle}>
          <code>--network host</code> (in the unit below) matches how <code>open-webui</code> is
          already running, so both containers can reach each other over <code>localhost</code> without
          extra Docker networking.
        </p>
        <CodeBlock code={`sudo tee /etc/systemd/system/chromadb.service > /dev/null <<'EOF'
[Unit]
Description=ChromaDB vector database
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=jay
ExecStartPre=-/usr/bin/docker rm -f chromadb
ExecStart=/usr/bin/docker run \\
  --network=host \\
  -v chroma-data:/data \\
  -e IS_PERSISTENT=TRUE \\
  -e ANONYMIZED_TELEMETRY=FALSE \\
  --name chromadb \\
  chromadb/chroma
ExecStop=/usr/bin/docker stop chromadb
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now chromadb.service
systemctl status chromadb.service --no-pager`} />
        <p style={pStyle}>Real output from our run:</p>
        <CodeBlock code={`● chromadb.service - ChromaDB vector database
     Loaded: loaded (/etc/systemd/system/chromadb.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2026-07-24 18:03:13 MDT; 2s ago
    Process: 505663 ExecStartPre=/usr/bin/docker rm -f chromadb (code=exited, status=0/SUCCESS)
   Main PID: 505673 (docker)
             └─505673 /usr/bin/docker run --network=host -v chroma-data:/data ... chromadb/chroma

Jul 24 18:03:13 jay-z820 docker[505673]: Saving data to: /data
Jul 24 18:03:13 jay-z820 docker[505673]: Connect to Chroma at: http://localhost:8000
Jul 24 18:03:13 jay-z820 docker[505673]: No telemetry is configured.

$ curl -s http://localhost:8000/api/v2/heartbeat
{"nanosecond heartbeat":1784937795495001733}`} />
        <p style={pStyle}>
          <code>enabled</code> + <code>active (running)</code> confirms it&apos;ll now survive a reboot
          on its own.
        </p>
        <p style={pStyle}>
          <code>ExecStartPre=-/usr/bin/docker rm -f chromadb</code> (the leading <code>-</code> means
          &quot;ignore failure&quot;) clears out any stale container left over from a crash before each
          start, same defensive pattern worth carrying into <code>open-webui.service</code> too — it
          would have prevented the name-conflict crash-loop from step 1.
        </p>
        <div style={noteStyle}>
          <strong>Heads-up for later:</strong> <code>llama-inference-phi-2.service</code> is also
          configured for port <code>8000</code>, the same port ChromaDB just claimed. It&apos;s currently{" "}
          <code>disabled</code>, so there&apos;s no conflict today — just don&apos;t enable that
          particular unit without first moving one of the two off port <code>8000</code>.
        </div>

        <h2 style={h2Style}>3. Verify the Chroma server is up</h2>
        <CodeBlock code={`curl -s http://localhost:8000/api/v2/heartbeat
sudo docker logs chromadb --tail 20`} />
        <p style={pStyle}>Real output from our run:</p>
        <CodeBlock code={`$ curl -s http://localhost:8000/api/v2/heartbeat
{"nanosecond heartbeat":1784936784061533814}

$ sudo docker logs chromadb --tail 20
Saving data to: /data
Connect to Chroma at: http://localhost:8000
Getting started guide: https://docs.trychroma.com/docs/overview/getting-started
No telemetry is configured.`} />

        <h2 style={h2Style}>4. Point Open WebUI at the external Chroma server</h2>
        <p style={pStyle}>
          Open WebUI defaults to an embedded, file-backed Chroma client when <code>VECTOR_DB</code> is
          unset. Setting <code>VECTOR_DB=chroma</code> plus the <code>CHROMA_HTTP_*</code> variables
          switches it to talk to our standalone server over HTTP instead. Because the service is
          systemd-managed with <code>Restart=always</code>, add the env vars to the{" "}
          <strong>unit file&apos;s <code>ExecStart</code></strong> rather than replacing the container by
          hand — that way systemd&apos;s own restart logic (including the pre-existing crash-loop from
          step 1) ends up recreating the container with the right config instead of fighting it.
        </p>
        <CodeBlock code={`sudo systemctl stop open-webui.service
sudo docker rm -f open-webui   # the currently-running container, now stopped by the line above

sudo vi /etc/systemd/system/open-webui.service`} />
        <p style={pStyle}>
          Only the <code>ExecStart</code> line inside <code>[Service]</code> needs to change — add the
          three <code>CHROMA_HTTP_*</code> flags and <code>VECTOR_DB=chroma</code>, and leave{" "}
          <code>OLLAMA_BASE_URL</code> alone (it&apos;s unrelated to this change). Everything else in
          the file, including the <code>[Unit]</code> and <code>[Install]</code> sections, stays exactly
          as it was — don&apos;t delete those lines, only edit inside <code>[Service]</code>. The full
          file should look like this afterward:
        </p>
        <CodeBlock code={`[Unit]
Description=Open WebUI
After=network.target docker.service llama-inference.service llama-inference-2.service
Requires=docker.service

[Service]
Type=simple
User=jay
ExecStart=/usr/bin/docker run \\
  --network=host \\
  -v open-webui:/app/backend/data \\
  -e OLLAMA_BASE_URL=http://127.0.0.1:8000 \\
  -e VECTOR_DB=chroma \\
  -e CHROMA_HTTP_HOST=localhost \\
  -e CHROMA_HTTP_PORT=8000 \\
  -e CHROMA_HTTP_SSL=false \\
  --name open-webui \\
  ghcr.io/open-webui/open-webui:main
ExecStop=/usr/bin/docker stop open-webui
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`} />
        <CodeBlock code={`sudo systemctl daemon-reload
sudo systemctl start open-webui.service

# confirm it's actually healthy this time, not crash-looping
sudo systemctl status open-webui.service --no-pager
sudo docker logs -f open-webui`} />
        <p style={pStyle}>Real output from our run:</p>
        <CodeBlock code={`● open-webui.service - Open WebUI
     Loaded: loaded (/etc/systemd/system/open-webui.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2026-07-24 18:24:16 MDT; 20ms ago
   Main PID: 507966 (docker)
     CGroup: /system.slice/open-webui.service
             └─507966 /usr/bin/docker run --network=host -v open-webui:/app/backend/data
                       -e OLLAMA_BASE_URL=http://127.0.0.1:8000 -e VECTOR_DB=chroma -e CHROMA_…

Jul 24 18:24:16 jay-z820 systemd[1]: Started Open WebUI.

$ sudo docker logs -f open-webui
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
v0.10.2 - building the best AI user interface.
INFO:     Started server process [1]
INFO:     Waiting for application startup.
2026-07-25 00:24:37 | INFO | sentence_transformers...: Loading SentenceTransformer model
2026-07-25 00:24:38.786 | INFO | ... "GET /api/version HTTP/1.1" 200`} />
        <p style={pStyle}>
          The <code>-v open-webui:/app/backend/data</code> volume is unchanged, so chats, users, and
          settings are preserved — only the vector store backend changes.
        </p>
        <div style={noteStyle}>
          Note that <code>OLLAMA_BASE_URL</code> still points at <code>127.0.0.1:8000</code> —
          previously stale/unused (nothing was listening there), now the same port ChromaDB is on. In
          practice this is harmless: Open WebUI&apos;s Ollama client only ever calls Ollama-specific
          endpoints (<code>/api/tags</code>, etc.), which the Chroma server just 404s on, so it doesn&apos;t
          corrupt anything — but it&apos;s worth eventually pointing at wherever your real model
          connection actually lives and cleaning up the stale value.
        </div>

        <h2 style={h2Style}>5. Download the sample documents</h2>
        <p style={pStyle}>
          Three short documents, three different formats, each containing a specific, made-up fact no
          LLM could already know — the same &quot;implausible claim&quot; trick as before, across a{" "}
          <code>.txt</code>, a <code>.md</code>, and a real <code>.pdf</code> this time:
        </p>
        <ul style={{ ...pStyle, paddingLeft: "1.5rem" }}>
          <li>
            <a href="/docs/chromadb-rag-open-webui/samples/saturdai-hardware-support-policy.txt" style={{ color: "#a0a0ff" }}>
              saturdai-hardware-support-policy.txt
            </a>{" "}
            — a fictional 47-day laptop exchange policy for cohort &quot;Q&quot; students.
          </li>
          <li>
            <a href="/docs/chromadb-rag-open-webui/samples/larkspur-aquifer-study.md" style={{ color: "#a0a0ff" }}>
              larkspur-aquifer-study.md
            </a>{" "}
            — a fictional 2024 groundwater study with specific numbers (3.2 cm/year recharge, 118
            wells, a named lead researcher).
          </li>
          <li>
            <a href="/docs/chromadb-rag-open-webui/samples/falcon-x200-spec.pdf" style={{ color: "#a0a0ff" }}>
              falcon-x200-spec.pdf
            </a>{" "}
            — a fictional drone spec sheet (14,700 mAh battery, 63-minute flight time, FalconLink
            wireless protocol).
          </li>
        </ul>

        <h2 style={h2Style}>6. Create a knowledge collection and upload all three</h2>
        <p style={pStyle}>
          In Open WebUI: <strong>Workspace → Knowledge → + Create new knowledge</strong>, name it{" "}
          <code>ChromaDB RAG POC</code>, then upload all three sample files and wait for indexing to
          finish on each.
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/chromadb-rag-open-webui/knowledge-collection.png"
            alt="Open WebUI Workspace → Knowledge showing the ChromaDB RAG POC collection with three files uploaded: saturdai-hardware-support-policy.txt, larkspur-aquifer-study.md, and falcon-x200-spec.pdf, with the upload menu open"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            All three sample documents indexed into the &quot;ChromaDB RAG POC&quot; knowledge
            collection.
          </figcaption>
        </figure>

        <h2 style={h2Style}>7. Prove the data actually lives in the external Chroma server</h2>
        <p style={pStyle}>
          This is the step the embedded setup couldn&apos;t give us: query the vector database{" "}
          <em>directly</em>, outside of Open WebUI entirely, and see the uploaded chunks sitting in it.
        </p>
        <CodeBlock code={`pip3 install chromadb --quiet
python3 <<'PY'
import chromadb
client = chromadb.HttpClient(host="localhost", port=8000)
for c in client.list_collections():
    print(c.name, "->", c.count(), "chunks")
PY`} />
        <p style={pStyle}>Real output from our run:</p>
        <CodeBlock code={`e154830c-b182-4c3a-befc-837659736bf7 -> 4 chunks
knowledge-bases -> 1 chunks
file-da68479f-41b2-4127-ba9c-ca5049f38e91 -> 1 chunks
file-072b5c0d-956a-4e47-9ad6-b8fdb16c5728 -> 2 chunks
file-d3de1e5c-5cfe-4fcf-b3c6-8cb7217d0714 -> 1 chunks`} />
        <p style={pStyle}>
          <code>e154830c-b182-4c3a-befc-837659736bf7</code> is the &quot;ChromaDB RAG POC&quot;
          collection&apos;s internal ID (matches the URL in the screenshot above) — 4 chunks across the
          three uploaded files. The <code>file-*</code> collections are Open WebUI&apos;s per-file
          working stores; <code>knowledge-bases</code> is its internal bookkeeping collection. Every one
          of these lives in the standalone Chroma server we stood up in step 2, not some opaque file
          inside the Open WebUI container.
        </p>

        <h2 style={h2Style}>8. Compare answers with and without retrieval, per document</h2>
        <p style={pStyle}>
          For each fact below, ask the question in a fresh chat with <strong>no</strong> knowledge
          attached first (expect a generic/hedging or &quot;I don&apos;t know&quot; answer), then type{" "}
          <code>#</code>, attach <strong>ChromaDB RAG POC</strong>, and ask again:
        </p>
        <ul style={{ ...pStyle, paddingLeft: "1.5rem" }}>
          <li>
            <em>&quot;How many days does a SaturdAI cohort-Q student have to exchange their laptop?&quot;</em>{" "}
            → grounded answer should say <strong>47 days</strong> and reference code{" "}
            <strong>SDX-4471</strong>.
          </li>
          <li>
            <em>&quot;What was the recharge rate in the Larkspur Aquifer study?&quot;</em> → grounded
            answer should say <strong>3.2 cm/year</strong> and name{" "}
            <strong>Dr. Elena Voskresenskaya</strong>.
          </li>
          <li>
            <em>&quot;What's the max flight time of the Falcon X200?&quot;</em> → grounded answer
            should say <strong>63 minutes</strong> and mention the <strong>FalconLink</strong>{" "}
            protocol.
          </li>
        </ul>
        <p style={pStyle}>
          Confirm each grounded answer carries a &quot;Retrieved N source(s)&quot; badge and that
          expanding the citation points at the correct file (<code>.txt</code>, <code>.md</code>, or{" "}
          <code>.pdf</code> respectively) — showing Open WebUI&apos;s PDF loader extracted the table
          correctly, not just the plain-text files.
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/chromadb-rag-open-webui/grounded-answers.png"
            alt="Open WebUI chat with ChromaDB RAG POC attached, showing three grounded answers: 47 days for the laptop exchange citing saturdai-hardwa...policy.txt with 2 Sources, 3.2 cm/year recharge rate citing larkspur-aquifer-study.md with 2 Sources, and 63 minutes max flight time citing falcon-x200-spec.pdf with 3 Sources"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            All three questions answered correctly with the collection attached, each citing the
            right source file.
          </figcaption>
        </figure>
        <p style={pStyle}>
          Real answers from our run — note the model doesn&apos;t always surface every specific detail
          (it skipped the <code>SDX-4471</code> reference code and Dr. Voskresenskaya&apos;s name), which
          is normal: the retrieval and citation are what prove groundedness, not word-for-word recall of
          every fact in the chunk.
        </p>
        <CodeBlock code={`Q: How many days does a SaturdAI cohort-Q student have to exchange their laptop?
A: A SaturdAI cohort-Q student has to exchange their laptop within 47 days.
   [Retrieved 2 sources — saturdai-hardwa...policy.txt]

Q: What was the recharge rate in the Larkspur Aquifer study?
A: According to the study, the recharge rate in the Larkspur Aquifer was measured
   at 3.2 cm/year. [Retrieved 2 sources — larkspur-aquifer-study.md]

Q: What's the max flight time of the Falcon X200?
A: According to the technical specification sheet, the Falcon X200 has a max
   flight time of 63 minutes. [Retrieved 3 sources — falcon-x200-spec.pdf]`} />

        <div style={noteStyle}>
          <strong>Why this counts as proof, twice over:</strong> first, the same &quot;implausible
          claim&quot; logic as before — no model spontaneously invents a reference code like{" "}
          <code>SDX-4471</code> or a named researcher like Dr. Voskresenskaya. Second, we independently
          confirmed via the Python <code>chromadb</code> client, talking straight to port{" "}
          <code>8000</code>, that the chunks are physically present in the standalone vector database —
          not just trusting what Open WebUI&apos;s citation UI claims.
        </div>

        <h2 style={h2Style}>9. Make the knowledge collection attach automatically</h2>
        <p style={pStyle}>
          So far every question required typing <code>#</code> and picking{" "}
          <strong>ChromaDB RAG POC</strong> by hand. For a classroom demo (or any real use), attach the
          collection to a <strong>model</strong> instead of a chat, so retrieval happens automatically —
          no student choice required.
        </p>
        <p style={pStyle}>
          Go to <strong>Workspace → Models → + Create a new model</strong>, pick a base model (e.g.{" "}
          <code>Qwen Model</code>), give it a name like <code>Qwen + ChromaDB RAG POC</code>, and in the{" "}
          <strong>Knowledge</strong> section of the editor add <strong>ChromaDB RAG POC</strong>. Save.
        </p>
        <p style={pStyle}>
          Start a new chat, select this custom model instead of the base one, and ask any of the three
          questions from step 8 with <strong>no</strong> <code>#</code> attach step — it retrieves from
          the collection automatically every time.
        </p>
        <div style={noteStyle}>
          <strong>Scope, not enforcement:</strong> this makes retrieval the default for chats using{" "}
          <em>that specific model</em> — it doesn&apos;t change the base <code>Qwen Model</code>, and a
          student who picks the base model instead still gets no retrieval. For a class demo, just make
          sure everyone is pointed at the custom model (e.g. set it as the default in{" "}
          <strong>Admin Panel → Settings → Models</strong>) rather than relying on students to attach
          knowledge manually.
        </div>

        <h3 style={h3Style}>What this demonstrates</h3>
        <p style={pStyle}>
          RAG in Open WebUI is not magic tied to the app itself — it&apos;s a standard pipeline (embed →
          store in a vector DB → similarity search → inject into the prompt → cite) that can point at
          any Chroma-compatible backend. Running ChromaDB as its own service makes every stage of that
          pipeline inspectable: you can watch the container logs, curl its API, and query it with a
          five-line Python script, which is exactly the kind of infrastructure literacy worth building
          before reaching for a managed vector database in production.
        </p>

        <h2 style={h2Style}>Appendix: Tear down ChromaDB and reset for a fresh run</h2>
        <p style={pStyle}>
          To run this whole doc again from a clean slate — e.g. right before class — remove only the
          ChromaDB service, container, and its data volume. <strong>Open WebUI itself is left
          completely alone</strong>: its unit file, container, and volume are untouched.
        </p>
        <CodeBlock code={`sudo systemctl disable --now chromadb.service
sudo docker rm -f chromadb 2>/dev/null   # in case a container lingered outside systemd
sudo rm /etc/systemd/system/chromadb.service
sudo systemctl daemon-reload
sudo docker volume rm chroma-data`} />
        <p style={pStyle}>Confirm it's actually gone:</p>
        <CodeBlock code={`systemctl status chromadb.service    # "could not be found"
docker ps -a | grep chromadb          # no output
docker volume ls | grep chroma-data   # no output
sudo ss -tlnp | grep :8000            # nothing listening`} />
        <div style={warnStyle}>
          <strong>Also clear the dangling knowledge collection in Open WebUI:</strong> deleting the
          <code>chroma-data</code> volume wipes the vectors, but the <code>ChromaDB RAG POC</code>{" "}
          collection entry still exists in Open WebUI&apos;s own database (a separate volume,{" "}
          <code>open-webui</code>, which you&apos;re keeping) and will now point at nothing. Go to{" "}
          <strong>Workspace → Knowledge</strong>, open <strong>ChromaDB RAG POC</strong>, and delete it
          from the <strong>⋯</strong> menu before re-running step 6 — otherwise you&apos;ll end up with
          a second, differently-named collection instead of a clean re-creation.
        </div>
        <p style={pStyle}>
          Open WebUI&apos;s <code>open-webui.service</code> still has <code>VECTOR_DB=chroma</code> and{" "}
          <code>CHROMA_HTTP_PORT=8000</code> pointed at the (now torn-down) standalone server — that&apos;s
          expected and fine to leave as-is per this doc&apos;s step 4. Knowledge/RAG features just
          won&apos;t work until step 2 is redone and <code>chromadb.service</code> is back up; regular
          chat with the models is unaffected the whole time. To get back to a working demo, re-run this
          doc starting at <strong>step 2</strong> (the image is already pulled locally, so it&apos;s
          fast) through <strong>step 8</strong>.
        </p>

        <h2 style={h2Style}>Case study: CPKC (real-world documents)</h2>
        <p style={pStyle}>
          Everything above used three small, fictional sample files — perfect for proving the pipeline
          works, but not proof it works on the messy documents a real organization actually has lying
          around. For this case study we swapped in two real, public PDFs from{" "}
          <strong>CPKC (Canadian Pacific Kansas City)</strong>, the freight railroad formed by the 2023
          CP–Kansas City Southern merger — downloaded directly from CPKC&apos;s own investor site, not
          written for this demo:
        </p>
        <ul style={{ ...pStyle, paddingLeft: "1.5rem" }}>
          <li>
            <a href="/docs/chromadb-rag-open-webui/case-study-samples/cpkc-2024-sustainability-data-report.pdf" style={{ color: "#a0a0ff" }}>
              cpkc-2024-sustainability-data-report.pdf
            </a>{" "}
            — CPKC&apos;s 2024 Sustainability Data Report, 2.3MB of dense ESG tables (safety, emissions,
            workforce metrics).
          </li>
          <li>
            <a href="/docs/chromadb-rag-open-webui/case-study-samples/cpkc-investor-presentation-jun2025.pdf" style={{ color: "#a0a0ff" }}>
              cpkc-investor-presentation-jun2025.pdf
            </a>{" "}
            — CPKC&apos;s June 2025 investor presentation, a 36-page, 8.9MB slide deck with financial
            highlights and network stats.
          </li>
        </ul>
        <div style={noteStyle}>
          CPKC&apos;s main site (<code>cpkcr.com</code>) sits behind a Cloudflare bot challenge that
          blocks a plain <code>curl</code> — the direct PDF URLs (<code>cpkcr.com/content/dam/...</code>{" "}
          and its investor-relations CDN at <code>q4cdn.com</code>) had to be found via search instead of
          crawling the site itself.
        </div>

        <h3 style={h3Style}>Same knowledge-collection workflow, real files</h3>
        <p style={pStyle}>
          Created a second collection, <strong>CPKC Case Study</strong>, and uploaded both PDFs the same
          way as before (Workspace → Knowledge → + Create new knowledge):
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/chromadb-rag-open-webui/case-study-knowledge-collection.png"
            alt="Open WebUI Workspace showing the CPKC Case Study collection with 2 files: cpkc-investor-presentation-jun2025.pdf (8.9 MB) and cpkc-2024-sustainability-data-report.pdf (2.3 MB)"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            Both real CPKC PDFs indexed into the &quot;CPKC Case Study&quot; collection.
          </figcaption>
        </figure>
        <p style={pStyle}>Confirmed directly against the standalone Chroma server, same as before:</p>
        <CodeBlock code={`python3 -c "
import chromadb
client = chromadb.HttpClient(host='192.168.1.92', port=8000)
for c in client.list_collections():
    print(c.name, '->', c.count(), 'chunks')
"`} />
        <CodeBlock code={`e0c69d05-743e-4f39-85ce-c5d21489f143 -> 204 chunks   # "CPKC Case Study"
file-0aefb7e3-7201-4cf1-bc3e-60e28fd12f39 -> 65 chunks    # sustainability report
file-b46cb365-5788-4387-972c-8513e0a6fcef -> 139 chunks   # investor presentation`} />

        <h3 style={h3Style}>Three real questions, three different outcomes</h3>
        <p style={pStyle}>
          Unlike the synthetic docs, these numbers are genuinely obscure — nobody has an LLM-known
          opinion on CPKC&apos;s FRA injury rate — so instead of an &quot;implausible claim&quot; test,
          we asked specific factual questions with the <strong>CPKC Case Study</strong> collection
          attached via <code>#</code>, and compared each answer against the source PDF ourselves. The
          results were not uniformly good, which is the more honest lesson:
        </p>

        <p style={pStyle}>
          <strong>1. A clean win.</strong> &quot;What was CPKC&apos;s FRA Personal Injury Rate Frequency
          in 2024?&quot; retrieved the right row from the right table and answered correctly:
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/chromadb-rag-open-webui/case-study-q1-success.png"
            alt="Open WebUI chat: 'CPKC's FRA Personal Injury Rate Frequency in 2024 was 0.95', citing cpkc-2024-susta...report.pdf, 1 Source"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>Correct — matches the source: 0.95, down from 1.15 in 2023.</figcaption>
        </figure>

        <p style={pStyle}>
          <strong>2. A retrieval miss.</strong> &quot;What was CPKC&apos;s operating ratio as reported
          for Q1 2025?&quot; is answered plainly in the investor presentation (<strong>64.4%</strong>,
          down from 65.0% a year earlier) — but the model reported it couldn&apos;t find it, despite
          retrieving 2 sources:
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/chromadb-rag-open-webui/case-study-q2-miss.png"
            alt="Open WebUI chat: 'I couldn't find the specific operating ratio for Q1 2025 in the provided context', despite Retrieved 2 sources"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            Miss — the real answer (64.4%) sits in a financial-highlights table in the slide deck; the
            chunks retrieved didn&apos;t include it.
          </figcaption>
        </figure>
        <p style={pStyle}>
          Likely cause: PDF chunking works on extracted text, and a 36-page slide deck packs numbers into
          dense tables and multi-column layouts that don&apos;t extract cleanly into contiguous,
          semantically-searchable text the way prose does. The chunk containing 64.4% either got split
          away from its &quot;operating ratio&quot; label or never scored as the closest match for this
          phrasing of the question.
        </p>

        <p style={pStyle}>
          <strong>3. Confidently wrong.</strong> &quot;What were CPKC&apos;s total direct and indirect
          (Scope 1 and Scope 2) GHG emissions in 2024, in metric tonnes CO2e?&quot; is the most
          instructive failure of the three — the model retrieved real numbers from the real document,
          then reasoned its way to the wrong answer:
        </p>
        <figure style={figureStyle}>
          <img
            src="/docs/chromadb-rag-open-webui/case-study-q3-wrong.png"
            alt="Open WebUI chat giving a confused answer estimating GHG emissions at 67.2 metric tonnes CO2e (63.7 + 3.5), citing cpkc-2024-susta...report.pdf"
            style={imgStyle}
          />
          <figcaption style={captionStyle}>
            Wrong — answered ~67.2 metric tonnes CO2e; the real total is 4,705.0 <em>thousand</em> metric
            tonnes CO2e (4,705,000 tonnes), about 70,000× larger.
          </figcaption>
        </figure>
        <div style={warnStyle}>
          <strong>What actually happened:</strong> the 63.7 and 3.5 the model added together are real
          numbers from the report — but they&apos;re <em>Direct Biogenic CO2 Emissions from Locomotives</em>{" "}
          for 2024 and 2023 respectively, a completely different (and much smaller) line item several
          rows away from the actual Scope 1 &amp; 2 total. The retrieved chunk apparently included both
          rows without enough surrounding table structure for the model to tell which label went with
          which number, so it picked the wrong one, then did confident arithmetic on it and stated the
          result as fact — with a citation attached, which made it look more trustworthy than a plain
          guess would have.
        </div>

        <h3 style={h3Style}>What this case study demonstrates</h3>
        <p style={pStyle}>
          The synthetic-document tests earlier in this doc prove the RAG <em>plumbing</em> works end to
          end. Real corporate PDFs prove something the synthetic tests can&apos;t: that retrieval quality
          depends heavily on how cleanly a document&apos;s text extracts, and that a citation is not the
          same thing as a correct answer. A wrong number pulled from the right file, with a source badge
          attached, is more dangerous than an obvious &quot;I don&apos;t know&quot; — it looks grounded.
          The practical takeaway for anyone building RAG on real internal documents: dense tables and
          slide decks need either better chunking (table-aware extraction, smaller chunk sizes around
          numeric data) or a verification step, because &quot;it cited a source&quot; is necessary but
          not sufficient proof of a correct answer.
        </p>
      </div>
    </main>
  );
}
