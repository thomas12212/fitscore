"use client";
import { useState, useCallback, useMemo } from "react";
import { flattenQuestions, calculateScores } from "@/lib/scoring";

const SCREENS = {
  INTRO: "intro",
  QUIZ: "quiz",
  LEAD_CAPTURE: "lead_capture",
  RESULTS: "results",
};

export default function useQuiz(template) {
  const [screen, setScreen] = useState(SCREENS.INTRO);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [leadData, setLeadData] = useState({ name: "", email: "" });
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [percentile, setPercentile] = useState(null);

  const questions = useMemo(() => flattenQuestions(template), [template]);
  const totalQuestions = questions.length;

  const currentQ = questions[currentQuestion];
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  const selectOption = useCallback((questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (answers[currentQuestion] === undefined) return;

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setScreen(SCREENS.LEAD_CAPTURE);
    }
  }, [currentQuestion, totalQuestions, answers]);

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const startQuiz = useCallback(() => {
    setScreen(SCREENS.QUIZ);
  }, []);

  const submitLead = useCallback(
    async (name, email, coachId, quizId) => {
      setIsSubmitting(true);
      setLeadData({ name, email });

      // Calculate scores
      const answersArray = [];
      for (let i = 0; i < totalQuestions; i++) {
        answersArray.push(answers[i] ?? null);
      }

      const scoreData = calculateScores(template, answersArray);
      setResults(scoreData);

      // Submit to API
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coachId,
            quizId,
            name,
            email,
            score: scoreData.score,
            maxScore: scoreData.maxScore,
            percentage: scoreData.percentage,
            tier: scoreData.tier,
            answers,
            categoryScores: scoreData.categoryScores,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.percentile !== undefined) {
            setPercentile(data.percentile);
          }
        }
      } catch (err) {
        console.error("Failed to submit lead:", err);
      }

      setIsSubmitting(false);
      setScreen(SCREENS.RESULTS);
    },
    [answers, template, totalQuestions]
  );

  return {
    screen,
    currentQuestion,
    currentQ,
    totalQuestions,
    progress,
    answers,
    leadData,
    results,
    isSubmitting,
    percentile,
    selectOption,
    nextQuestion,
    prevQuestion,
    startQuiz,
    submitLead,
    SCREENS,
  };
}
