import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    // Get quiz + coach info in one query
    const result = await db.execute({
      sql: `SELECT q.id as quiz_id, q.template_id, q.name as quiz_name, q.customizations,
                   c.id as coach_id, c.name as coach_name, c.plan
            FROM quizzes q
            JOIN coaches c ON q.coach_id = c.id
            WHERE q.id = ? AND q.active = 1`,
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const row = result.rows[0];

    return NextResponse.json({
      quizId: row.quiz_id,
      templateId: row.template_id,
      quizName: row.quiz_name,
      customizations: JSON.parse(row.customizations || "{}"),
      coachId: row.coach_id,
      coachName: row.coach_name,
      plan: row.plan || "free",
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
