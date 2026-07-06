import Slideshow, { type Slide } from "@/components/Slideshow";

const SLIDES: Slide[] = [
  {
    src: "/slides/week-2/01-why-rag.svg",
    alt: "Comparison of an LLM's frozen knowledge without RAG versus grounded, current answers with RAG",
    paragraph:
      "On its own, an LLM only knows what was baked into it at training time — it can't see this morning's news, your company's internal docs, or anything that changed after its cutoff date. Retrieval-Augmented Generation fixes both problems at once: before answering, the model looks up relevant, current, or private documents and reads them alongside your question, so its answers can be fresh, specific to you, and traceable back to a real source instead of a guess.",
  },
  {
    src: "/slides/week-2/02-rag-pipeline-overview.svg",
    alt: "Flow diagram: Documents to Chunking to Embeddings to Vector Database to Retrieval to LLM Answer",
    paragraph:
      "The whole RAG system boils down to one pipeline worth memorizing: your source documents get split into Chunking, each chunk is turned into an Embedding, those embeddings are stored in a Vector Database, a Retrieval step pulls out the most relevant chunks for a given question, and finally those chunks are handed to the LLM Answer step so the model can respond using real material instead of relying purely on memory.",
  },
  {
    src: "/slides/week-2/03-chunking.svg",
    alt: "A long document being split into smaller chunks, with a chunk-size tradeoff panel",
    paragraph:
      "Long documents get broken into smaller chunks before they're indexed, because a retrieval step works best when it can pull back a focused piece of text rather than an entire file. Chunk size is a genuine tradeoff: chunks that are too large drag in irrelevant surrounding text and make retrieval imprecise, while chunks that are too small can lose the surrounding context needed to make sense of them on their own.",
  },
  {
    src: "/slides/week-2/04-embeddings.svg",
    alt: "2D scatter plot showing semantically similar words like dog and puppy clustered close together",
    paragraph:
      "An embedding model converts a piece of text into a long list of numbers — a vector — positioned in a high-dimensional space based on meaning, not exact wording. Text with similar meaning ends up close together in that space (\"dog\" and \"puppy\" land near each other), while unrelated text lands far apart, which is exactly what makes it possible to search by meaning instead of by keyword.",
  },
  {
    src: "/slides/week-2/05-vector-databases.svg",
    alt: "Diagram of a vector database performing nearest-neighbor search, with a side panel of real examples",
    paragraph:
      "A vector database is purpose-built to store millions of these embeddings and quickly find the ones closest to a given query vector, using nearest-neighbor search instead of scanning every row. Pinecone, Chroma, pgvector, Weaviate, and Qdrant are all popular choices, and picking between them usually comes down to scale, hosting preference, and how it fits into your existing stack.",
  },
  {
    src: "/slides/week-2/06-retrieval-step.svg",
    alt: "Flow diagram: user question to embed query to search database to top-k results, with example scored results",
    paragraph:
      "When you ask a question, it gets embedded using the exact same model that embedded your documents, which is what makes comparison possible in the first place. The vector database then searches for the chunks whose embeddings are closest to your question's embedding and returns the top few — often called \"top-k\" — as the most relevant candidates to hand to the model.",
  },
  {
    src: "/slides/week-2/07-augmented-prompt.svg",
    alt: "Diagram showing retrieved chunks inserted into the LLM's prompt alongside the original question",
    paragraph:
      "Once the top chunks are retrieved, they don't get sent anywhere special — they're simply stitched into the same context window as your question, usually with a short instruction like \"answer using the following information.\" The model then reads both the retrieved text and your question together and generates its response, the same way it would in any ordinary conversation.",
  },
  {
    src: "/slides/week-2/08-rag-vs-finetuning.svg",
    alt: "Comparison table of RAG versus fine-tuning across cost, freshness, and traceability",
    paragraph:
      "RAG and fine-tuning solve different problems and are often confused. RAG is the right tool when you need the model to know fresh or private information — it's cheap to update, since you just re-index documents, and answers can be traced back to a source. Fine-tuning is better suited to changing how the model behaves or communicates — its tone, format, or specialized skills — but it's more expensive to run and the knowledge it bakes in goes stale the moment training ends.",
  },
  {
    src: "/slides/week-2/09-common-pitfalls.svg",
    alt: "Three pitfalls: irrelevant retrieval, stale index, and hallucination despite RAG, each with a guard",
    paragraph:
      "RAG reduces hallucination but doesn't eliminate every failure mode. Retrieval can pull back chunks that sound related but don't actually answer the question; an index can go stale if the underlying documents change but never get re-embedded; and even with the right context sitting right in front of it, a model can still ignore what it was given and answer from memory instead. Each of these has a straightforward guard — better chunking and reranking, a refresh schedule for your index, and prompts that explicitly instruct the model to rely on the provided context.",
  },
  {
    src: "/slides/week-2/10-recap-and-exercise.svg",
    alt: "Recap of five key takeaways from Week 2 plus a three-step live exercise",
    paragraph:
      "To recap: RAG grounds a model in real documents through a Documents → Chunking → Embeddings → Vector Database → Retrieval → Answer pipeline, it's cheaper and more traceable than fine-tuning for keeping knowledge fresh, and it still needs guardrails against irrelevant retrieval or stale indexes. Your exercise: pick three short documents, ask a question that only they can answer, then compare the model's response with and without pasting in the relevant paragraph yourself.",
  },
];

export default function Week2Page() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 2rem", textAlign: "center" }}>
      <h1
        className="section-title"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.4rem" }}
      >
        <span style={{ fontSize: "2.2rem" }}>📚</span> Week 2: RAG
      </h1>
      <p className="description" style={{ margin: "0 auto 1.25rem", maxWidth: 700 }}>
        Grounding AI with actual knowledge — retrieval-augmented generation, vector databases,
        and building systems that answer from real, up-to-date sources.
      </p>

      <Slideshow slides={SLIDES} />
    </main>
  );
}
