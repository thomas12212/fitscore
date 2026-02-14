"use client";
import ProgressBar from "./ProgressBar";

export default function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  progress,
  selectedOption,
  onSelect,
  onNext,
  onBack,
  isFirst,
  isLast,
}) {
  return (
    <div className="animate-fade-up px-4 py-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted">
          {question.categoryIcon} {question.category}
        </span>
        <span className="text-sm text-muted">
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      <ProgressBar progress={progress} category="" />

      <h2 className="text-2xl font-heading mb-6 leading-snug">
        {question.text}
      </h2>

      <div className="space-y-3 mb-8">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => onSelect(questionIndex, i)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
              selectedOption === i
                ? "border-accent bg-surface"
                : "border-border bg-elevated hover:border-muted"
            }`}
            style={
              selectedOption === i
                ? { borderColor: "var(--color-primary)" }
                : undefined
            }
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                selectedOption === i
                  ? "border-transparent"
                  : "border-muted"
              }`}
              style={
                selectedOption === i
                  ? { background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }
                  : undefined
              }
            >
              {selectedOption === i && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-sm leading-snug">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        {!isFirst && (
          <button onClick={onBack} className="btn-secondary flex-1">
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={selectedOption === undefined}
          className={`btn-primary flex-1 ${
            selectedOption === undefined ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          {isLast ? "Get My Results" : "Next"}
        </button>
      </div>
    </div>
  );
}
