"use client";

import { useState } from "react";

export type Slide = {
  src: string;
  alt: string;
  paragraph: string;
};

export default function Slideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(slides.length - 1, i + 1));

  return (
    <div className="slideshow">
      <div className="slideshow-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.src} alt={slide.alt} className="slideshow-image" />
      </div>

      <p className="slideshow-paragraph">{slide.paragraph}</p>

      <div className="slideshow-controls">
        <button
          type="button"
          className="slideshow-btn"
          onClick={goPrev}
          disabled={index === 0}
        >
          ← Previous
        </button>
        <span className="slideshow-counter">
          {index + 1} / {slides.length}
        </span>
        <button
          type="button"
          className="slideshow-btn"
          onClick={goNext}
          disabled={index === slides.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
