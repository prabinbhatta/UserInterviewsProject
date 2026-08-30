"use client";

import { useState } from "react";

const STARS = [1, 2, 3, 4, 5] as const;

export function StarRatingInput({ name }: { name: string }) {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={value} />
      {STARS.map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setValue(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={value === n}
          className="text-2xl leading-none transition-transform hover:scale-110"
        >
          <span className={shown >= n ? "text-[var(--warning)]" : "text-[var(--line)]"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {STARS.map((n) => (
        <span
          key={n}
          className={n <= rating ? "text-[var(--warning)]" : "text-[var(--line)]"}
        >
          ★
        </span>
      ))}
    </div>
  );
}
