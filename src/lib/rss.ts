import { XMLParser } from "fast-xml-parser";

export type FeedEntry = {
  title: string;
  link: string;
  publishedAt: string;
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function extractLink(link: unknown): string {
  if (typeof link === "string") return link;
  if (Array.isArray(link)) {
    const alt = link.find((l) => l["@_rel"] === "alternate") ?? link[0];
    return alt?.["@_href"] ?? "";
  }
  if (link && typeof link === "object") {
    return (link as Record<string, string>)["@_href"] ?? "";
  }
  return "";
}

// Fetches and parses an RSS 2.0 or Atom feed into a common shape. Used for
// native feeds (YouTube channels, hnrss.org) that don't need RSS.app.
export async function fetchFeed(url: string, limit = 5): Promise<FeedEntry[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": "SaturdAI-Feed/1.0" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];

  const xml = await res.text();
  const parsed = parser.parse(xml);

  const rssItems = asArray(parsed?.rss?.channel?.item);
  if (rssItems.length > 0) {
    return rssItems.slice(0, limit).map((item) => ({
      title: String(item.title ?? ""),
      link: String(item.link ?? ""),
      publishedAt: String(item.pubDate ?? ""),
    }));
  }

  const atomEntries = asArray(parsed?.feed?.entry);
  return atomEntries.slice(0, limit).map((entry) => ({
    title: String(entry.title ?? ""),
    link: extractLink(entry.link),
    publishedAt: String(entry.published ?? entry.updated ?? ""),
  }));
}
