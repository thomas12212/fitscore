"use client";
import { useEffect, useRef } from "react";
import useQuiz from "@/hooks/useQuiz";
import QuizIntro from "./QuizIntro";
import QuizQuestion from "./QuizQuestion";
import QuizLeadCapture from "./QuizLeadCapture";
import QuizResults from "./QuizResults";

function trackEvent(quizId, eventType) {
  fetch("/api/quiz-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quizId, eventType }),
  }).catch(() => {});
}

export default function QuizEngine({ template, coachId, quizId, coachName, customizations }) {
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (quizId && !hasTrackedView.current) {
      trackEvent(quizId, "view");
      hasTrackedView.current = true;
    }
  }, [quizId]);
  const {
    screen,
    currentQuestion,
    currentQ,
    totalQuestions,
    progress,
    answers,
    results,
    isSubmitting,
    percentile,
    selectOption,
    nextQuestion,
    prevQuestion,
    startQuiz,
    submitLead,
    SCREENS,
  } = useQuiz(template);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        "--color-primary":
          customizations.primaryColor || template.defaultColors.primary,
        "--color-secondary":
          customizations.secondaryColor || template.defaultColors.secondary,
      }}
    >
      <div className="w-full max-w-xl mx-auto min-h-screen flex flex-col justify-center">
        {screen === SCREENS.INTRO && (
          <QuizIntro
            template={template}
            customizations={customizations}
            coachName={coachName}
            onStart={() => {
              if (quizId) trackEvent(quizId, "start");
              startQuiz();
            }}
          />
        )}

        {screen === SCREENS.QUIZ && currentQ && (
          <QuizQuestion
            question={currentQ}
            questionIndex={currentQuestion}
            totalQuestions={totalQuestions}
            progress={progress}
            selectedOption={answers[currentQuestion]}
            onSelect={selectOption}
            onNext={nextQuestion}
            onBack={prevQuestion}
            isFirst={currentQuestion === 0}
            isLast={currentQuestion === totalQuestions - 1}
          />
        )}

        {screen === SCREENS.LEAD_CAPTURE && (
          <QuizLeadCapture
            onSubmit={(name, email) => submitLead(name, email, coachId, quizId)}
            isSubmitting={isSubmitting}
          />
        )}

        {screen === SCREENS.RESULTS && (
          <QuizResults
            results={results}
            template={template}
            customizations={customizations}
            percentile={percentile}
            quizId={quizId}
          />
        )}
      </div>
    </div>
  );
}
