import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/week-3/01-why-mcps.svg",
    alt: "Diagram of tangled one-off integrations between apps and tools versus MCP as a shared USB-C-like standard",
    paragraph:
      "Before MCP, connecting an AI app to outside tools meant writing custom, one-off integration code for every single pairing — three apps and three tools meant nine separate integrations to build and maintain. MCP replaces that N×M mess with one shared, open standard, often described as \"a USB-C port for AI apps\": build the integration once, on either side, and it works with anything else that speaks the same protocol.",
  },
  {
    src: "/slides/week-3/02-client-server-architecture.svg",
    alt: "Diagram of a host application running an MCP client connected to multiple MCP servers",
    paragraph:
      "MCP has a simple client/server shape. The \"host\" is the AI application you actually use — Claude Desktop, an IDE, a custom agent — and it runs an MCP client internally. That client connects out to one or more MCP servers over a standard protocol, and each server can expose a completely different set of capabilities: one for your filesystem, one for GitHub, one for a database, all reachable the same way.",
  },
  {
    src: "/slides/week-3/03-three-primitives.svg",
    alt: "Three cards for Resources, Tools, and Prompts, the three primitives an MCP server exposes",
    paragraph:
      "Everything an MCP server can offer boils down to three primitives. Resources are data the app can read, like a file or a database record. Tools are functions the model can actually call to take an action, like creating an issue or sending a message. Prompts are reusable templates a server can hand back, so common tasks don't need to be re-explained from scratch every time.",
  },
  {
    src: "/slides/week-3/04-connection-and-discovery.svg",
    alt: "Four-step flow of a client connecting to a server and discovering its tools, resources, and prompts",
    paragraph:
      "Before any real work happens, a client that connects to a new server runs a discovery step: it essentially asks \"what can you do?\" and the server responds with the full list of tools, resources, and prompts it exposes, along with descriptions and expected parameters. Only after that handshake does the host app know what it's able to ask the server to do on its behalf.",
  },
  {
    src: "/slides/week-3/05-real-world-example.svg",
    alt: "A GitHub MCP server exposing tools like create_issue and list_pull_requests, plus a repo readme resource",
    paragraph:
      "To make this concrete: imagine a GitHub MCP server. It might expose tools like create_issue and list_pull_requests that the model can call to actually do things in your repo, alongside a resource like repo://readme that the model can simply read for context. Nothing about this is GitHub-specific to the protocol — the same pattern works for Slack, a database, or your local filesystem.",
  },
  {
    src: "/slides/week-3/06-tool-call-flow.svg",
    alt: "Loop diagram of a user question triggering an LLM tool call that is forwarded to a server and back",
    paragraph:
      "A tool call through MCP is a round trip with a few extra hops compared to a normal chat. You ask a question, the LLM decides a tool is needed and picks one, the client forwards that request to the right MCP server, the server actually executes it and sends back a result, and the LLM folds that result into its final answer — all within the same turn of the conversation.",
  },
  {
    src: "/slides/week-3/07-security-and-permissions.svg",
    alt: "Flow diagram of a consent step before a tool runs, with a warning box of security risks to watch for",
    paragraph:
      "MCP servers can be genuinely powerful — reading your files, sending messages, modifying a database — so most clients require your explicit consent before a tool actually runs, rather than letting the model act silently. On the server side, the same caution applies: a well-built server is scoped to the minimum access it actually needs, so a mistake or a misused tool can't do more damage than necessary.",
  },
  {
    src: "/slides/week-3/08-mcp-vs-custom-integration.svg",
    alt: "Comparison table of custom integrations versus MCP across reusability, maintenance, and discovery",
    paragraph:
      "A hand-rolled integration has to be rebuilt for every app that wants to use it, and maintained separately each time the underlying API changes. An MCP server flips that: build it once, declare what it can do, and any MCP-compatible app — today's or a future one you haven't heard of yet — can connect to it the same way, with no extra integration work on either side.",
  },
  {
    src: "/slides/week-3/09-building-your-first-server.svg",
    alt: "Five-step roadmap for building an MCP server, from defining scope to testing it live",
    paragraph:
      "Building your first MCP server follows a predictable path: decide exactly what data or actions you want to expose, implement it using an MCP SDK in your language of choice, declare your tools, resources, and prompts with clear descriptions, connect it to a client like Claude Desktop or Claude Code, and finally test it live by asking questions that should trigger it.",
  },
  {
    src: "/slides/week-3/10-recap-and-exercise.svg",
    alt: "Recap of five key takeaways about MCP plus a three-step live exercise",
    paragraph:
      "To recap: MCP is an open, shared standard that replaces one-off integrations, built on a client/server architecture with three primitives — resources, tools, and prompts — discovered up front and gated by user consent. Your exercise: pick an existing MCP server from a public directory, connect it in Claude Desktop or Claude Code, and ask a question that requires it to actually use a tool.",
  },
];

export default function Week3Page() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 2rem", textAlign: "center" }}>
      <h1
        className="section-title"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.4rem" }}
      >
        <span style={{ fontSize: "2.2rem" }}>🔌</span> Week 3: MCPs
      </h1>
      <p className="description" style={{ margin: "0 auto 1.25rem", maxWidth: 700 }}>
        Connecting AI to external systems using the Model Context Protocol — giving models
        access to files, APIs, and tools beyond their training data.
      </p>

      <Slideshow slides={SLIDES} />
    </main>
  );
}
