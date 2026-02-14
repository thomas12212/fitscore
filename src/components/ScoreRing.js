"use client";
import { useEffect, useRef, useState } from "react";

export default function ScoreRing({ score, maxScore, percentage }) {
  const ringRef = useRef(null);
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Animate the ring
    const ring = ringRef.current;
    if (ring) {
      const offset = circumference - (percentage / 100) * circumference;
      setTimeout(() => {
        ring.style.strokeDashoffset = offset;
      }, 100);
    }

    // Animate the number
    const duration = 1500;
    const startTime = performance.now();
    const target = score;

    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [score, percentage, circumference]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--elevated)"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          ref={ringRef}
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-5xl font-bold font-heading">{displayScore}</div>
        <div className="text-sm text-muted">out of {maxScore}</div>
      </div>
    </div>
  );
}
