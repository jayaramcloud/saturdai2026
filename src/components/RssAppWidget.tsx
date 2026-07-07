"use client";

import { createElement } from "react";
import Script from "next/script";

// Renders an RSS.app "Wall" widget. Get a widgetId by creating a feed at
// rss.app, opening it, going to the Widgets tab, choosing "Wall", and
// copying the id out of the <rssapp-wall id="..."> snippet it gives you.
// The wall element is a custom element registered by wall.js at runtime,
// so it's created via createElement to sidestep JSX intrinsic typing.
export default function RssAppWidget({ widgetId }: { widgetId: string }) {
  return (
    <>
      {createElement("rssapp-wall", { id: widgetId })}
      <Script src="https://widget.rss.app/v1/wall.js" strategy="lazyOnload" />
    </>
  );
}
