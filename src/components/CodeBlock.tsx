"use client";

import { useState, type CSSProperties } from "react";

const wrapperStyle: CSSProperties = { position: "relative", marginBottom: "1.5rem" };
const preStyle: CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #33335a",
  borderRadius: 8,
  padding: "1rem",
  paddingRight: "3rem",
  overflowX: "auto",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  margin: 0,
};
const buttonStyle: CSSProperties = {
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  background: "#2a2a4a",
  border: "1px solid #44447a",
  borderRadius: 6,
  color: "#ccccee",
  cursor: "pointer",
  padding: "0.35rem 0.5rem",
  fontSize: "0.8rem",
  lineHeight: 1,
};

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={wrapperStyle}>
      <pre style={preStyle}>
        <code>{code}</code>
      </pre>
      <button type="button" onClick={handleCopy} style={buttonStyle} aria-label="Copy code" title="Copy">
        {copied ? "✓" : "⧉"}
      </button>
    </div>
  );
}
