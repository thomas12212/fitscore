import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/utils";

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

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const password = request.headers.get("x-dashboard-password");

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 401 });
    }

    const db = getDb();

    const quizResult = await db.execute({
      sql: `SELECT q.id, q.coach_id, c.dashboard_password_hash
            FROM quizzes q JOIN coaches c ON q.coach_id = c.id
            WHERE q.id = ?`,
      args: [id],
    });

    if (quizResult.rows.length === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const valid = await verifyPassword(password, quizResult.rows[0].dashboard_password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const body = await request.json();
    const { customizations, name } = body;

    if (customizations !== undefined) {
      await db.execute({
        sql: "UPDATE quizzes SET customizations = ? WHERE id = ?",
        args: [JSON.stringify(customizations), id],
      });
    }

    if (name !== undefined) {
      await db.execute({
        sql: "UPDATE quizzes SET name = ? WHERE id = ?",
        args: [name, id],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}
