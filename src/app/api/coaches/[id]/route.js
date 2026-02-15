import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/utils";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const result = await db.execute({
      sql: `SELECT id, name, template_id, customizations, plan, email, webhook_url, created_at
            FROM coaches WHERE id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const coach = result.rows[0];

    // Fetch quizzes for this coach
    const quizzesResult = await db.execute({
      sql: `SELECT id, template_id, name, customizations, active, created_at
            FROM quizzes WHERE coach_id = ? ORDER BY created_at DESC`,
      args: [id],
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const quizzes = quizzesResult.rows.map((q) => ({
      id: q.id,
      templateId: q.template_id,
      name: q.name,
      customizations: JSON.parse(q.customizations || "{}"),
      active: q.active === 1,
      quizUrl: `${appUrl}/quiz/${q.id}`,
      createdAt: q.created_at,
    }));

    return NextResponse.json({
      id: coach.id,
      name: coach.name,
      templateId: coach.template_id,
      customizations: JSON.parse(coach.customizations || "{}"),
      plan: coach.plan || "free",
      email: coach.email || "",
      webhookUrl: coach.webhook_url || "",
      createdAt: coach.created_at,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching coach:", error);
    return NextResponse.json(
      { error: "Failed to fetch coach" },
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

    const coachResult = await db.execute({
      sql: "SELECT id, dashboard_password_hash FROM coaches WHERE id = ?",
      args: [id],
    });

    if (coachResult.rows.length === 0) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const valid = await verifyPassword(password, coachResult.rows[0].dashboard_password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const body = await request.json();
    const { email, webhookUrl } = body;

    if (email !== undefined) {
      await db.execute({
        sql: "UPDATE coaches SET email = ? WHERE id = ?",
        args: [email || null, id],
      });
    }

    if (webhookUrl !== undefined) {
      await db.execute({
        sql: "UPDATE coaches SET webhook_url = ? WHERE id = ?",
        args: [webhookUrl || null, id],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating coach:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
