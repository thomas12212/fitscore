import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, buildCsv } from "@/lib/utils";

export async function GET(request, { params }) {
  try {
    const { coachId } = await params;
    const password = request.headers.get("x-dashboard-password");

    if (!password) {
      return NextResponse.json(
        { error: "Password required" },
        { status: 401 }
      );
    }

    const db = getDb();

    // Get coach and verify password
    const coachResult = await db.execute({
      sql: "SELECT id, name, dashboard_password_hash FROM coaches WHERE id = ?",
      args: [coachId],
    });

    if (coachResult.rows.length === 0) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const coach = coachResult.rows[0];
    const valid = await verifyPassword(password, coach.dashboard_password_hash);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const leadsResult = await db.execute({
      sql: `SELECT l.*, q.name as quiz_name
            FROM leads l
            LEFT JOIN quizzes q ON l.quiz_id = q.id
            WHERE l.coach_id = ? ORDER BY l.created_at DESC`,
      args: [coachId],
    });

    const csv = buildCsv(leadsResult.rows);
    const date = new Date().toISOString().split("T")[0];

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="fitscore-leads-${coachId}-${date}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting leads:", error);
    return NextResponse.json(
      { error: "Failed to export leads" },
      { status: 500 }
    );
  }
}
