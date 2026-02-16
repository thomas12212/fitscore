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

export default function QuizResults({ results, template, customizations, percentile, quizId }) {
  const breakdownRef = useRef(null);
  const [showCalEmbed, setShowCalEmbed] = useState(false);
  const [sharecopied, setShareCopied] = useState(false);
  const ctaText = customizations.ctaText || "Book a Free Consultation";
  const bookingUrl = customizations.bookingUrl;
  const ctaUrl = customizations.ctaUrl;
  const isCalCom = bookingUrl && isCalComUrl(bookingUrl);

  useEffect(() => {
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
    warm: "#facc15",
    hot: "#f97316",
    fire: "#ef4444",
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

  function handleShare(platform) {
    const text = `I scored ${percentage}% on my fitness assessment! "${tier}" - Take the quiz to find out where you stand.`;
    const url = window.location.href;

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }

  const hasBookingOrCta = bookingUrl || ctaUrl;
  const recommendations = tierData.recommendations || [];

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

      {/* Comparison stats */}
      {percentile !== null && (
        <p className="text-sm text-muted mb-2">
          You scored higher than <strong className="text-foreground">{percentile}%</strong> of people who took this quiz.
        </p>
      )}

      <p className="text-muted text-lg mb-6 leading-relaxed">
        {tierData.description}
      </p>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <div className="text-left bg-surface rounded-xl p-5 mb-6">
          <h3 className="text-lg font-heading mb-3 text-center">WHAT TO FOCUS ON</h3>
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}
                >
                  {i + 1}
                </span>
                <span className="text-muted leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Breakdown */}
      <div ref={breakdownRef} className="text-left space-y-4 mb-6">
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
          className="btn-primary text-lg px-8 py-4 w-full max-w-xs mb-6"
        >
          {ctaText}
        </button>
      )}

      {/* Social Sharing */}
      <div className="border-t border-border pt-6">
        <p className="text-sm text-muted mb-3">Share your results</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleShare("twitter")}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-sm hover:border-accent transition-colors"
          >
            Share on X
          </button>
          <button
            onClick={() => handleShare("copy")}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-sm hover:border-accent transition-colors"
          >
            {sharecopied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

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
