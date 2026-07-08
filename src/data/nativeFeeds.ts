// Native feeds (free, no RSS.app account needed) shown on /feed.

export type YouTubeChannel = {
  channelId: string;
  label: string;
};

export const YOUTUBE_CHANNELS: YouTubeChannel[] = [
  { channelId: "UCbfYPyITQ-7l4upoX8nvctg", label: "Two Minute Papers" },
  { channelId: "UCZHmQk67mSJgfCCTn7xBfew", label: "Yannic Kilcher" },
  { channelId: "UCXUPKJO5MZQN11PqgIvyuvQ", label: "Andrej Karpathy" },
  { channelId: "UCSHZKyawb77ixDdsGog4iWA", label: "Lex Fridman" },
  { channelId: "UCNJ1Ymd5yFuUPtn21xtRbbw", label: "AI Explained" },
  { channelId: "UCcIXc5mJsHVYTZR1maL5l9w", label: "DeepLearning.AI" },
  { channelId: "UCawZsQWqfGSbCI5yjkdVkTA", label: "Matthew Berman" },
];

export function youtubeFeedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

// Hacker News (Y Combinator) stories mentioning AI with at least 50 points.
export const HACKER_NEWS_AI_FEED_URL = "https://hnrss.org/newest?q=AI&points=50";
