"use client";
import { useEffect, useRef, useState } from "react";
import ScoreRing from "./ScoreRing";

function isCalComUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "cal.com" || parsed.hostname.endsWith(".cal.com");
  } catch {
    return false;
  }
}

export default function QuizResults({ results, template, customizations }) {
  const breakdownRef = useRef(null);
  const [showCalEmbed, setShowCalEmbed] = useState(false);
  const ctaText = customizations.ctaText || "Book a Free Consultation";
  const bookingUrl = customizations.bookingUrl;
  const ctaUrl = customizations.ctaUrl;
  const isCalCom = bookingUrl && isCalComUrl(bookingUrl);

  useEffect(() => {
    // Animate breakdown bars after mount
    const timeout = setTimeout(() => {
      if (breakdownRef.current) {
        breakdownRef.current.querySelectorAll("[data-width]").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  if (!results) return null;

  const { score, maxScore, percentage, tier, tierData, categoryScores } = results;

  const warmthColors = {
    cold: "#6b7280",
    warm: "#f59e0b",
    hot: "#ef4444",
    fire: "#ff4d4d",
  };

  function handleBookingClick() {
    if (isCalCom) {
      setShowCalEmbed(true);
    } else if (bookingUrl) {
      window.open(bookingUrl, "_blank", "noopener,noreferrer");
    } else if (ctaUrl) {
      window.open(ctaUrl, "_blank", "noopener,noreferrer");
    }
  }

  const hasBookingOrCta = bookingUrl || ctaUrl;

  return (
    <div className="animate-fade-up px-4 py-8 max-w-xl mx-auto text-center">
      <h2 className="text-3xl font-heading mb-6 text-gradient-accent">
        YOUR RESULTS
      </h2>

      <ScoreRing score={score} maxScore={maxScore} percentage={percentage} />

      <div className="mt-6 mb-4">
        <div
          className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide"
          style={{
            background: `${warmthColors[tierData.warmth]}20`,
            color: warmthColors[tierData.warmth],
            border: `1px solid ${warmthColors[tierData.warmth]}40`,
          }}
        >
          {tier}
        </div>
      </div>

      <p className="text-muted text-lg mb-8 leading-relaxed">
        {tierData.description}
      </p>

      {/* Category Breakdown */}
      <div ref={breakdownRef} className="text-left space-y-4 mb-8">
        <h3 className="text-xl font-heading text-center mb-4">
          YOUR BREAKDOWN
        </h3>
        {template.categories.map((cat) => {
          const cs = categoryScores[cat.name];
          if (!cs) return null;
          return (
            <div key={cat.name} className="bg-surface rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {cat.icon} {cat.name}
                </span>
                <span className="text-sm text-muted">
                  {cs.score}/{cs.max} ({cs.pct}%)
                </span>
              </div>
              <div className="w-full h-2 bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full gradient-accent rounded-full transition-all duration-1000 ease-out"
                  data-width={cs.pct}
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking / CTA */}
      {hasBookingOrCta && (
        <button
          onClick={handleBookingClick}
          className="btn-primary text-lg px-8 py-4 w-full max-w-xs"
        >
          {ctaText}
        </button>
      )}

      {/* Cal.com Embed Modal */}
      {showCalEmbed && isCalCom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCalEmbed(false);
          }}
        >
          <div className="bg-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden relative animate-fade-up">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-heading text-lg">BOOK YOUR CALL</h3>
              <button
                onClick={() => setShowCalEmbed(false)}
                className="text-muted hover:text-foreground text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-0" style={{ height: "600px" }}>
              <iframe
                src={bookingUrl}
                className="w-full h-full border-0"
                title="Book a call"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
