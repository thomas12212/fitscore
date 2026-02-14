"use client";

export default function PoweredByBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <a
        href={process.env.NEXT_PUBLIC_APP_URL || "/"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-surface/90 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors no-underline"
      >
        <span className="text-gradient-accent font-heading text-sm">FITSCORE</span>
        <span>Powered by FitScore</span>
      </a>
    </div>
  );
}
