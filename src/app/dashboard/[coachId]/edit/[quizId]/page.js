import { getDb } from "@/lib/db";
import { getTemplate, mergeTemplate } from "@/lib/templates";
import { notFound } from "next/navigation";
import QuizEditor from "@/components/QuizEditor";

export async function generateMetadata() {
  return { title: "Edit Quiz — FitScore" };
}

export default async function QuizEditorPage({ params }) {
  const { coachId, quizId } = await params;

  let quiz;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT q.id, q.template_id, q.name, q.customizations
            FROM quizzes q JOIN coaches c ON q.coach_id = c.id
            WHERE q.id = ? AND c.id = ?`,
      args: [quizId, coachId],
    });

    if (result.rows.length === 0) notFound();
    const row = result.rows[0];
    quiz = {
      id: row.id,
      templateId: row.template_id,
      name: row.name,
      customizations: JSON.parse(row.customizations || "{}"),
    };
  } catch {
    notFound();
  }

  const baseTemplate = getTemplate(quiz.templateId);
  if (!baseTemplate) notFound();

  const merged = mergeTemplate(baseTemplate, quiz.customizations);

  return (
    <QuizEditor
      coachId={coachId}
      quizId={quiz.id}
      quizName={quiz.name}
      template={merged}
      customizations={quiz.customizations}
    />
  );
}
