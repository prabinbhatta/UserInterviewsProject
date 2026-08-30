"use client";

import { useEffect, useState } from "react";

type Step = { time: string; title: string; body: string };

const STEP_DURATION_MS = 4200;

export function JourneyTimeline({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(
      () => setActive((i) => (i + 1) % steps.length),
      STEP_DURATION_MS,
    );
    return () => clearTimeout(id);
  }, [active, paused, steps.length]);

  return (
    <div
      className="mt-12"
      onMouseLeave={() => setPaused(false)}
    >
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const isActive = i === active;
          return (
            <li
              key={step.time}
              onMouseEnter={() => {
                setPaused(true);
                setActive(i);
              }}
              onClick={() => {
                setPaused(true);
                setActive(i);
              }}
              className={`group relative cursor-pointer border-l-2 pl-5 transition-colors duration-500 ease-interact ${
                isActive ? "border-[var(--accent)]" : "border-[var(--line)]"
              }`}
            >
              {/* Progress fill that runs the length of the auto-advance timer,
                  only for the currently active, unpaused step. */}
              <span className="absolute top-0 left-[-2px] h-full w-[2px] overflow-hidden bg-transparent">
                {isActive && !paused && (
                  <span
                    key={active}
                    className="block h-full w-full origin-top bg-[var(--accent)] motion-safe:animate-[fillDown_var(--step-duration)_linear_forwards]"
                    style={{ "--step-duration": `${STEP_DURATION_MS}ms` } as React.CSSProperties}
                  />
                )}
              </span>

              <span
                className={`font-mono-utility text-xs transition-colors duration-500 ease-interact ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--ink)]/60"
                }`}
              >
                {step.time}
              </span>
              <h3
                className={`font-display mt-2 text-lg font-medium transition-transform duration-300 ease-interact ${
                  isActive ? "translate-x-1" : "translate-x-0"
                }`}
              >
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70">
                {step.body}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex items-center gap-2">
        {steps.map((step, i) => (
          <button
            key={step.time}
            type="button"
            aria-label={`Show step ${i + 1}: ${step.title}`}
            onClick={() => {
              setPaused(true);
              setActive(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ease-interact ${
              i === active
                ? "w-8 bg-[var(--accent)]"
                : "w-1.5 bg-[var(--line)] hover:bg-[var(--navy)]/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
