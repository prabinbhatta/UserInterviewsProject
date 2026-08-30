"use client";

import { useEffect, useState } from "react";

export function SplitReveal({
  text,
  className = "",
  wordDelay = 60,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  wordDelay?: number;
  startDelay?: number;
}) {
  const [in_, setIn] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setIn(true), startDelay);
    return () => clearTimeout(id);
  }, [startDelay]);

  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <span
            className={`inline-block transition-transform duration-700 ease-reveal motion-reduce:!transition-none motion-reduce:!transform-none ${
              in_ ? "translate-y-0" : "translate-y-[110%]"
            }`}
            style={{ transitionDelay: `${i * wordDelay}ms` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
