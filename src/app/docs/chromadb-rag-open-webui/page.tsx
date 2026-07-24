import Link from "next/link";
import type { CSSProperties } from "react";

const codeStyle: CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #33335a",
  borderRadius: 8,
  padding: "1rem",
  overflowX: "auto",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  marginBottom: "1.5rem",
};

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
        <pre style={codeStyle}><code>{`ssh jay@192.168.1.92

# sanity check — confirm 8000 is free and docker is present
sudo ss -tlnp | grep -E ':(8000|8001|8080)'
docker ps -a`}</code></pre>

        <h2 style={h2Style}>2. Run ChromaDB as its own container</h2>
        <p style={pStyle}>
          Pull and start the official Chroma server image, persisting its data to a named Docker
          volume so it survives restarts:
        </p>
        <pre style={codeStyle}><code>{`sudo docker pull chromadb/chroma

sudo docker run -d \\
  --name chromadb \\
  --network host \\
  -v chroma-data:/data \\
  -e IS_PERSISTENT=TRUE \\
  -e ANONYMIZED_TELEMETRY=FALSE \\
  chromadb/chroma`}</code></pre>
        <p style={pStyle}>
          <code>--network host</code> matches how <code>open-webui</code> is already running, so both
          containers can reach each other over <code>localhost</code> without extra Docker networking.
        </p>

        <h2 style={h2Style}>3. Verify the Chroma server is up</h2>
        <pre style={codeStyle}><code>{`curl -s http://localhost:8000/api/v2/heartbeat
# {"nanosecond heartbeat": ...}

sudo docker logs chromadb --tail 20`}</code></pre>

        <h2 style={h2Style}>4. Point Open WebUI at the external Chroma server</h2>
        <p style={pStyle}>
          Open WebUI defaults to an embedded, file-backed Chroma client when <code>VECTOR_DB</code> is
          unset. Setting <code>VECTOR_DB=chroma</code> plus the <code>CHROMA_HTTP_*</code> variables
          switches it to talk to our standalone server over HTTP instead. Recreate the container with
          the same volume (so chats, users, and settings are preserved) and the new env vars added:
        </p>
        <pre style={codeStyle}><code>{`sudo docker stop open-webui
sudo docker rename open-webui open-webui-old   # keep as a fallback, don't delete yet

sudo docker run -d \\
  --name open-webui \\
  --network host \\
  -v open-webui:/app/backend/data \\
  -e OLLAMA_BASE_URL=http://127.0.0.1:8001 \\
  -e VECTOR_DB=chroma \\
  -e CHROMA_HTTP_HOST=localhost \\
  -e CHROMA_HTTP_PORT=8000 \\
  -e CHROMA_HTTP_SSL=false \\
  ghcr.io/open-webui/open-webui:main

# watch it come up healthy
sudo docker logs -f open-webui`}</code></pre>
        <p style={pStyle}>
          Once you&apos;ve confirmed the new container is healthy and RAG works against the external
          store (steps below), you can remove the fallback with{" "}
          <code>sudo docker rm open-webui-old</code>.
        </p>

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

        <h2 style={h2Style}>7. Prove the data actually lives in the external Chroma server</h2>
        <p style={pStyle}>
          This is the step the embedded setup couldn&apos;t give us: query the vector database{" "}
          <em>directly</em>, outside of Open WebUI entirely, and see the uploaded chunks sitting in it.
        </p>
        <pre style={codeStyle}><code>{`pip3 install chromadb --quiet
python3 <<'PY'
import chromadb
client = chromadb.HttpClient(host="localhost", port=8000)
for c in client.list_collections():
    print(c.name, "->", c.count(), "chunks")
PY`}</code></pre>
        <p style={pStyle}>
          You should see a collection (Open WebUI names these by an internal knowledge-base ID rather
          than &quot;ChromaDB RAG POC&quot; literally) with a chunk count matching the three uploaded
          documents — proof the vectors are in the standalone server we stood up in step 2, not some
          opaque file inside the Open WebUI container.
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
