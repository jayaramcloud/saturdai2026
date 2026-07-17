"use client";

import { useState } from "react";

type Video = {
  id: string;
  label: string;
  date: string;
};

const VIDEOS: Video[] = [
  { id: "OB6rX8zinu8", label: "July 4 (Morning)", date: "Jul 4, 2026" },
  { id: "XQ83ChWB5Oc", label: "Day 2", date: "Jul 7, 2026" },
  { id: "lJVxEUi-8F0", label: "Day 3", date: "Jul 8, 2026" },
  { id: "yR4tkPFGjec", label: "July 4 (Evening)", date: "Jul 4, 2026" },
  { id: "zTakJvjHlUI", label: "Day 5", date: "Jul 9, 2026" },
  { id: "YUe7iNgPwRE", label: "Day 6", date: "Jul 10, 2026" },
  { id: "Lw0DoCLtjD0", label: "Day 7", date: "Jul 13, 2026" },
  { id: "i76zzi5OHd8", label: "Day 8", date: "Jul 16, 2026" },
];

export default function VideoGrid() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="video-grid">
      {VIDEOS.map((video) => (
        <div className="video-card" key={video.id}>
          {playingId === video.id ? (
            <iframe
              className="video-frame"
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              title={`SaturdAI recording — ${video.label}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="video-thumb"
              onClick={() => setPlayingId(video.id)}
              aria-label={`Play recording for ${video.label}`}
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg)`,
              }}
            >
              <span className="video-play-icon">▶</span>
            </button>
          )}
          <p className="video-label">
            {video.label} <span className="video-date">· {video.date}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
