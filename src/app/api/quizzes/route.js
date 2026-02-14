import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getTemplate } from "@/lib/templates";
import { generateQuizId, verifyPassword } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { coachId, templateId, name, customizations } = body;
    const password = request.headers.get("x-dashboard-password");

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 401 });
    }

    const db = getDb();

    // Verify coach + password
    const coachResult = await db.execute({
      sql: "SELECT id, dashboard_password_hash FROM coaches WHERE id = ?",
      args: [coachId],
    });

    if (coachResult.rows.length === 0) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const valid = await verifyPassword(password, coachResult.rows[0].dashboard_password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const template = getTemplate(templateId);
    if (!template) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const quizId = generateQuizId();
    const quizName = name?.trim() || template.name;

    await db.execute({
      sql: `INSERT INTO quizzes (id, coach_id, template_id, name, customizations)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        quizId,
        coachId,
        templateId,
        quizName,
        JSON.stringify(customizations || {}),
      ],
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json(
      {
        quizId,
        quizUrl: `${appUrl}/quiz/${quizId}`,
        name: quizName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz: " + error.message },
      { status: 500 }
    );
  }
}
