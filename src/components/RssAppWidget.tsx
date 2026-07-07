"use client";

import Script from "next/script";

// Renders an RSS.app "List" widget. Get a widgetId by creating a feed at
// rss.app, opening it, going to the Widgets tab, and copying the ID out of
// the embed snippet it gives you (the value of data-rss-app-widget).
export default function RssAppWidget({ widgetId }: { widgetId: string }) {
  return (
    <>
      <Script src="https://widget.rss.app/v2/list.js" strategy="lazyOnload" />
      <div className="rss-app-container" data-rss-app-widget={widgetId} />
    </>
  );
}
