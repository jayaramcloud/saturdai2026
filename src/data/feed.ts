export type FeedPlatform = "youtube" | "twitter" | "linkedin" | "link";

export type FeedItem = {
  url: string;
  note?: string;
  dateAdded: string; // YYYY-MM-DD
};

// Add new items to the top of this list. Each `url` just needs to be a
// normal YouTube / X (Twitter) / LinkedIn post link — the FeedEmbed
// component figures out how to render it as an official embed.
export const FEED_ITEMS: FeedItem[] = [
  {
    url: "https://www.linkedin.com/posts/eordax_ai-humor-share-7479981477691166720-JyT3",
    note: "The AI job title treadmill, illustrated.",
    dateAdded: "2026-07-07",
  },
];
