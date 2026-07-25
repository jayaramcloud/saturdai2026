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

        <h3 style={h3Style}>What this demonstrates</h3>
        <p style={pStyle}>
          RAG in Open WebUI is not magic tied to the app itself — it&apos;s a standard pipeline (embed →
          store in a vector DB → similarity search → inject into the prompt → cite) that can point at
          any Chroma-compatible backend. Running ChromaDB as its own service makes every stage of that
          pipeline inspectable: you can watch the container logs, curl its API, and query it with a
          five-line Python script, which is exactly the kind of infrastructure literacy worth building
          before reaching for a managed vector database in production.
        </p>
      </div>
    </main>
  );
}
