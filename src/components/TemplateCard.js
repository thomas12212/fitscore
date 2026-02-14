"use client";

export default function TemplateCard({ template, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 w-full ${
        selected
          ? "border-accent bg-surface"
          : "border-border bg-elevated hover:border-muted"
      }`}
      style={
        selected
          ? { borderColor: template.defaultColors.primary }
          : undefined
      }
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{template.icon}</span>
        <div>
          <h3 className="font-heading text-xl mb-1">{template.name}</h3>
          <p className="text-sm text-muted mb-2">{template.description}</p>
          <div className="flex gap-3 text-xs text-muted">
            <span>{template.questionCount} questions</span>
            <span>{template.categoryCount} categories</span>
          </div>
          <div className="flex gap-2 mt-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: template.defaultColors.primary }}
            />
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: template.defaultColors.secondary }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
