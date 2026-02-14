"use client";

export default function QuizIntro({ template, customizations, coachName, onStart }) {
  const headline = customizations.headline || template.defaultHeadline;
  const subheadline = customizations.subheadline || template.defaultSubheadline;
  const logoUrl = customizations.logoUrl;

  const totalQuestions = template.categories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  );

  return (
    <div className="animate-fade-up text-center px-4 py-8 max-w-xl mx-auto">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={coachName}
          className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-2"
          style={{ borderColor: "var(--color-primary)" }}
        />
      )}

      {coachName && (
        <p className="text-sm text-muted uppercase tracking-widest mb-4">
          {coachName}
        </p>
      )}

      <h1 className="text-4xl md:text-5xl font-heading leading-tight mb-4 text-gradient-accent">
        {headline}
      </h1>

      <p className="text-lg text-muted mb-8 leading-relaxed">{subheadline}</p>

      <div className="flex justify-center gap-4 mb-8">
        <div className="bg-surface px-4 py-2 rounded-lg text-sm">
          <span className="text-gradient-accent font-bold">{totalQuestions}</span>{" "}
          <span className="text-muted">Questions</span>
        </div>
        <div className="bg-surface px-4 py-2 rounded-lg text-sm">
          <span className="text-gradient-accent font-bold">2</span>{" "}
          <span className="text-muted">Minutes</span>
        </div>
        <div className="bg-surface px-4 py-2 rounded-lg text-sm">
          <span className="text-gradient-accent font-bold">Free</span>{" "}
          <span className="text-muted">Results</span>
        </div>
      </div>

      <button onClick={onStart} className="btn-primary text-lg px-10 py-4 w-full max-w-xs">
        START YOUR ASSESSMENT
      </button>
    </div>
  );
}
