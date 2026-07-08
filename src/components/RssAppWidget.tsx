"use client";

import { createElement } from "react";
import Script from "next/script";

export type RssAppWidgetType = "wall" | "feed";

const WIDGET_TAG: Record<RssAppWidgetType, string> = {
  wall: "rssapp-wall",
  feed: "rssapp-feed",
};

const WIDGET_SCRIPT: Record<RssAppWidgetType, string> = {
  wall: "https://widget.rss.app/v1/wall.js",
  feed: "https://widget.rss.app/v1/feed.js",
};

// Renders an RSS.app widget (Wall or Feed type). Get a widgetId by creating
// a feed at rss.app, opening it, going to the Widgets tab, choosing a
// widget type, and copying the id out of the snippet it gives you
// (<rssapp-wall id="..."> or <rssapp-feed id="...">). The custom element is
// registered by the widget script at runtime, so it's created via
// createElement to sidestep JSX intrinsic typing.
export default function RssAppWidget({
  widgetId,
  type = "wall",
}: {
  widgetId: string;
  type?: RssAppWidgetType;
}) {
  return (
    <>
      {createElement(WIDGET_TAG[type], { id: widgetId })}
      <Script src={WIDGET_SCRIPT[type]} strategy="lazyOnload" />
    </>
  );
}
