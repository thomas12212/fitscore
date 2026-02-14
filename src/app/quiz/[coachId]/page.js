import { getTemplate } from "@/lib/templates";
import { getDb } from "@/lib/db";
import QuizEngine from "@/components/QuizEngine";
import PoweredByBadge from "@/components/PoweredByBadge";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { coachId } = await params;

  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT name, template_id, customizations FROM coaches WHERE id = ?",
      args: [coachId],
    });

    if (result.rows.length === 0) return { title: "Quiz Not Found" };

    const coach = result.rows[0];
    const template = getTemplate(coach.template_id);
    const customizations = JSON.parse(coach.customizations || "{}");

    return {
      title: customizations.headline || template?.defaultHeadline || "Fitness Assessment",
      description: template?.defaultSubheadline || "Take this quick fitness assessment",
    };
  } catch {
    return { title: "Fitness Assessment" };
  }
}

export default async function QuizPage({ params }) {
  const { coachId } = await params;

  let coach;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT id, name, template_id, customizations, plan FROM coaches WHERE id = ?",
      args: [coachId],
    });

    if (result.rows.length === 0) notFound();
    coach = result.rows[0];
  } catch {
    notFound();
  }

  const template = getTemplate(coach.template_id);
  if (!template) notFound();

  const customizations = JSON.parse(coach.customizations || "{}");
  const showBranding = coach.plan !== "pro";

  return (
    <>
      <QuizEngine
        template={template}
        coachId={coach.id}
        coachName={coach.name}
        customizations={customizations}
      />
      {showBranding && <PoweredByBadge />}
    </>
  );
}
