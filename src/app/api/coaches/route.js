import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getTemplate } from "@/lib/templates";
import { generateCoachId, generateQuizId, hashPassword } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, templateId, password, customizations } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const template = getTemplate(templateId);
    if (!templateId || !template) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const coachId = generateCoachId();
    const quizId = generateQuizId();
    const passwordHash = await hashPassword(password);
    const db = getDb();

    // Create coach
    await db.execute({
      sql: `INSERT INTO coaches (id, name, email, template_id, customizations, dashboard_password_hash)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        coachId,
        name.trim(),
        email?.trim().toLowerCase() || null,
        templateId,
        JSON.stringify(customizations || {}),
        passwordHash,
      ],
    });

    // Create first quiz
    await db.execute({
      sql: `INSERT INTO quizzes (id, coach_id, template_id, name, customizations)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        quizId,
        coachId,
        templateId,
        template.name,
        JSON.stringify(customizations || {}),
      ],
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json(
      {
        coachId,
        quizId,
        quizUrl: `${appUrl}/quiz/${quizId}`,
        dashboardUrl: `${appUrl}/dashboard/${coachId}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating coach:", error);
    return NextResponse.json(
      { error: "Failed to create coach: " + error.message },
      { status: 500 }
    );
  }
}
