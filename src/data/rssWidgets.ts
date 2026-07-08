import type { RssAppWidgetType } from "@/components/RssAppWidget";

export type RssWidget = {
  widgetId: string;
  label: string;
  type: RssAppWidgetType;
};

// Each entry is one RSS.app widget, tracking a person/hashtag/search you set
// up at rss.app. Add a new one here after generating it — no other code
// changes needed. See src/components/RssAppWidget.tsx for how to get a
// widgetId and type.
export const RSS_WIDGETS: RssWidget[] = [
  { widgetId: "89hR9EnaR637yHHZ", label: "Eduardo Ordax on LinkedIn", type: "wall" },
  { widgetId: "EfecUKds4mndzyRm", label: "Aravind Srinivas on LinkedIn", type: "feed" },
  { widgetId: "C8XBUtAQr1IEX6w4", label: "Ronald van Loon on LinkedIn", type: "feed" },
  { widgetId: "kJeaP7a2dz0ViuVc", label: "Bernard Marr on LinkedIn", type: "feed" },
  { widgetId: "2j3rgDWu0ExC0aCB", label: "Allie K. Miller on LinkedIn", type: "feed" },
  { widgetId: "rjvHJH64cty7NOcI", label: "Ethan Mollick on LinkedIn", type: "feed" },
  { widgetId: "XOgNLUdezBoTgFHZ", label: "Yann LeCun on LinkedIn", type: "feed" },
];
