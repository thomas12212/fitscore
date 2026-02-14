"use client";

export default function ProgressBar({ progress, category }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted">{category}</span>
        <span className="text-sm text-muted">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full gradient-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
