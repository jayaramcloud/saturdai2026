import FeedEmbed from "@/components/FeedEmbed";
import RssAppWidget from "@/components/RssAppWidget";
import { FEED_ITEMS } from "@/data/feed";
import { RSS_WIDGETS } from "@/data/rssWidgets";

export default function FeedPage() {
  const items = [...FEED_ITEMS].sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1));

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 className="section-title" style={{ marginBottom: "1rem" }}>
        AI Feed
      </h1>
      <p className="description" style={{ margin: "0 auto 3rem", maxWidth: 600 }}>
        Interesting AI posts from around the web — LinkedIn, X, YouTube — that caught our eye and
        are worth sharing with the SaturdAI community.
      </p>

      {RSS_WIDGETS.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
          {RSS_WIDGETS.map((widget) => (
            <div key={widget.widgetId} className="feature-card" style={{ textAlign: "left" }}>
              <p style={{ marginBottom: "1rem", color: "#a0a0c0" }}>{widget.label}</p>
              <RssAppWidget widgetId={widget.widgetId} />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {items.map((item) => (
          <div key={item.url} className="feature-card" style={{ textAlign: "left" }}>
            {item.note && (
              <p style={{ marginBottom: "1rem", color: "#a0a0c0" }}>{item.note}</p>
            )}
            <FeedEmbed url={item.url} />
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#8888aa" }}>
              Added {item.dateAdded}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
