"use client";

import { useEffect, useState } from "react";

type Session = { day: string; title: string; start: string };

const SESSION_MS = 60 * 60 * 1000; // each session runs 1 hour

export default function SessionCountdown({ sessions, meetUrl }: { sessions: Session[]; meetUrl: string }) {
  // Start as null so server and client render the same markup; the clock only runs in the browser.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return <div style={boxStyle} aria-hidden />;

  const live = sessions.find((s) => {
    const t = Date.parse(s.start);
    return now >= t && now < t + SESSION_MS;
  });
  if (live) {
    return (
      <div style={boxStyle}>
        <span style={labelStyle}>🔴 Live now — {live.day}: {live.title}</span>
        <a href={meetUrl} target="_blank" rel="noopener noreferrer" style={{ ...timeStyle, textDecoration: "underline" }}>
          Join on Google Meet →
        </a>
      </div>
    );
  }

  const next = sessions.find((s) => Date.parse(s.start) > now);
  if (!next) {
    return (
      <div style={boxStyle}>
        <span style={labelStyle}>🎓 The course is complete — recordings are below.</span>
      </div>
    );
  }

  const totalMin = Math.floor((Date.parse(next.start) - now) / 60000);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const secs = Math.floor(((Date.parse(next.start) - now) % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={boxStyle}>
      <span style={labelStyle}>
        Next session: {next.day} — {next.title}
      </span>
      <span style={timeStyle} aria-live="off">
        {pad(hrs)}h : {pad(mins)}m : {pad(secs)}s
      </span>
      <span style={subStyle}>
        {new Date(next.start).toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        })}{" "}
        (your local time)
      </span>
    </div>
  );
}

const boxStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.35rem",
  minHeight: "6rem",
  margin: "0 auto 1.75rem",
  padding: "1rem 1.5rem",
  maxWidth: 520,
  borderRadius: 16,
  border: "1px solid rgba(139, 92, 246, 0.45)",
  background: "rgba(102, 126, 234, 0.1)",
};
const labelStyle: React.CSSProperties = { fontSize: "0.95rem", opacity: 0.85 };
const timeStyle: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  color: "#a78bfa",
};
const subStyle: React.CSSProperties = { fontSize: "0.8rem", opacity: 0.6 };
