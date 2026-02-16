import { getTemplate, mergeTemplate } from "@/lib/templates";
import { getDb } from "@/lib/db";
import QuizEngine from "@/components/QuizEngine";
import PoweredByBadge from "@/components/PoweredByBadge";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { quizId } = await params;

  try {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT q.template_id, q.customizations, q.name as quiz_name
            FROM quizzes q WHERE q.id = ?`,
      args: [quizId],
    });

    if (result.rows.length === 0) return { title: "Quiz Not Found" };

    const quiz = result.rows[0];
    const baseTemplate = getTemplate(quiz.template_id);
    const customizations = JSON.parse(quiz.customizations || "{}");
    const template = baseTemplate ? mergeTemplate(baseTemplate, customizations) : null;

    return {
      title: template?.defaultHeadline || quiz.quiz_name || "Fitness Assessment",
      description: template?.defaultSubheadline || "Take this quick fitness assessment",
    };
  } catch {
    return { title: "Fitness Assessment" };
  }
}

export default async function QuizPage({ params }) {
  const { quizId } = await params;

  let quiz, coach;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT q.id as quiz_id, q.template_id, q.customizations,
                   c.id as coach_id, c.name as coach_name, c.plan
            FROM quizzes q
            JOIN coaches c ON q.coach_id = c.id
            WHERE q.id = ? AND q.active = 1`,
      args: [quizId],
    });

    if (result.rows.length === 0) notFound();
    const row = result.rows[0];
    quiz = {
      id: row.quiz_id,
      templateId: row.template_id,
      customizations: JSON.parse(row.customizations || "{}"),
    };
    coach = {
      id: row.coach_id,
      name: row.coach_name,
      plan: row.plan,
    };
  } catch {
    notFound();
  }

  const baseTemplate = getTemplate(quiz.templateId);
  if (!baseTemplate) notFound();
  const template = mergeTemplate(baseTemplate, quiz.customizations);

  const showBranding = coach.plan !== "pro";

  return (
    <>
      <QuizEngine
        template={template}
        coachId={coach.id}
        quizId={quiz.id}
        coachName={coach.name}
        customizations={quiz.customizations}
      />
      {showBranding && <PoweredByBadge />}
    </>
  );
}
