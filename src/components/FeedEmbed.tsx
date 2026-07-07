"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getLinkedInShareId(url: string): string | null {
  const match = url.match(/-(\d{15,})-/) ?? url.match(/urn:li:(?:share|activity):(\d+)/);
  return match ? match[1] : null;
}

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: HTMLElement) => void } };
  }
}

function TwitterEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.twttr && ref.current) {
      window.twttr.widgets.load(ref.current);
    }
  }, [url]);

  return (
    <div ref={ref}>
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
      <blockquote className="twitter-tweet">
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  );
}

export default function FeedEmbed({ url }: { url: string }) {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return (
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
            borderRadius: 12,
          }}
        />
      </div>
    );
  }

  if (url.includes("twitter.com") || url.includes("x.com")) {
    return <TwitterEmbed url={url} />;
  }

  if (url.includes("linkedin.com")) {
    const shareId = getLinkedInShareId(url);
    if (shareId) {
      return (
        <iframe
          src={`https://www.linkedin.com/embed/feed/update/urn:li:share:${shareId}`}
          height="570"
          width="100%"
          title="LinkedIn post"
          style={{ border: "none", borderRadius: 12, background: "#fff" }}
          allowFullScreen
        />
      );
    }
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
      View post ↗
    </a>
  );
}
