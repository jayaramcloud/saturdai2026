export type RssWidget = {
  widgetId: string;
  label: string;
};

// Each entry is one RSS.app "Wall" widget, tracking a person/hashtag/search
// you set up at rss.app. Add a new one here after generating it — no other
// code changes needed. See src/components/RssAppWidget.tsx for how to get
// a widgetId.
export const RSS_WIDGETS: RssWidget[] = [
  { widgetId: "89hR9EnaR637yHHZ", label: "Eduardo Ordax on LinkedIn" },
];
