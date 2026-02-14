import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getTemplate } from "@/lib/templates";
import { generateCoachId, hashPassword } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, templateId, password, customizations } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!templateId || !getTemplate(templateId)) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const id = generateCoachId();
    const passwordHash = await hashPassword(password);
    const db = getDb();

    await db.execute({
      sql: `INSERT INTO coaches (id, name, template_id, customizations, dashboard_password_hash)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        id,
        name.trim(),
        templateId,
        JSON.stringify(customizations || {}),
        passwordHash,
      ],
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json(
      {
        coachId: id,
        quizUrl: `${appUrl}/quiz/${id}`,
        dashboardUrl: `${appUrl}/dashboard/${id}`,
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
