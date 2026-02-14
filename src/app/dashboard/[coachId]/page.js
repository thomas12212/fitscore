import { getDb } from "@/lib/db";
import DashboardAuth from "@/components/DashboardAuth";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { coachId } = await params;
  return {
    title: `Dashboard — FitScore`,
    description: `Lead dashboard for coach ${coachId}`,
  };
}

export default async function DashboardPage({ params }) {
  const { coachId } = await params;

  let coach;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT id, name, plan FROM coaches WHERE id = ?",
      args: [coachId],
    });

    if (result.rows.length === 0) notFound();
    coach = result.rows[0];
  } catch {
    notFound();
  }

  return <DashboardAuth coachId={coach.id} coachName={coach.name} plan={coach.plan || "free"} />;
}
