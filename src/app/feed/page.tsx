import FeedEmbed from "@/components/FeedEmbed";
import RssAppWidget from "@/components/RssAppWidget";
import { FEED_ITEMS } from "@/data/feed";
import { RSS_WIDGETS } from "@/data/rssWidgets";
import { HACKER_NEWS_AI_FEED_URL, YOUTUBE_CHANNELS, youtubeFeedUrl } from "@/data/nativeFeeds";
import { fetchFeed, type FeedEntry } from "@/lib/rss";

function EntryList({ entries }: { entries: FeedEntry[] }) {
  if (entries.length === 0) {
    return <p style={{ color: "#8888aa", fontSize: "0.9rem" }}>No recent items.</p>;
  }
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {entries.map((entry) => (
        <li key={entry.link}>
          <a href={entry.link} target="_blank" rel="noopener noreferrer" style={{ color: "#c7c7f0" }}>
            {entry.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default async function FeedPage() {
  const items = [...FEED_ITEMS].sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1));

  const [youtubeResults, hackerNewsEntries] = await Promise.all([
    Promise.all(
      YOUTUBE_CHANNELS.map(async (channel) => ({
        channel,
        entries: await fetchFeed(youtubeFeedUrl(channel.channelId), 4),
      })),
    ),
    fetchFeed(HACKER_NEWS_AI_FEED_URL, 8),
  ]);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 className="section-title" style={{ marginBottom: "1rem" }}>
        AI Feed
      </h1>
      <p className="description" style={{ margin: "0 auto 3rem", maxWidth: 600 }}>
        Interesting AI content from around the web — LinkedIn, X, YouTube, Hacker News — that
        caught our eye and is worth sharing with the SaturdAI community.
      </p>

      {RSS_WIDGETS.length > 0 && (
        <>
          <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
            Live LinkedIn Feeds
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
            {RSS_WIDGETS.map((widget) => (
              <div key={widget.widgetId} className="feature-card" style={{ textAlign: "left" }}>
                <p style={{ marginBottom: "1rem", color: "#a0a0c0" }}>{widget.label}</p>
                <RssAppWidget widgetId={widget.widgetId} />
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        YouTube
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {youtubeResults.map(({ channel, entries }) => (
          <div key={channel.channelId} className="feature-card" style={{ textAlign: "left" }}>
            <p style={{ marginBottom: "1rem", color: "#a0a0c0", fontWeight: 600 }}>{channel.label}</p>
            <EntryList entries={entries} />
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Hacker News (Y Combinator)
      </h2>
      <div className="feature-card" style={{ textAlign: "left", marginBottom: "3rem" }}>
        <EntryList entries={hackerNewsEntries} />
      </div>

      <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Curated Picks
      </h2>
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
