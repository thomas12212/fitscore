import { NextResponse } from "next/server";
import { getDb, PLANS } from "@/lib/db";
import { validateEmail } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { coachId, name, email, score, maxScore, percentage, tier, answers, categoryScores } = body;

    if (!coachId || !name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Coach ID, name, and email are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify coach exists and check plan limits
    const coachResult = await db.execute({
      sql: "SELECT id, plan, lead_count_this_month, lead_count_reset_at FROM coaches WHERE id = ?",
      args: [coachId],
    });

    if (coachResult.rows.length === 0) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const coach = coachResult.rows[0];
    const plan = PLANS[coach.plan || "free"];

    // Check if month has rolled over and reset count
    const resetAt = new Date(coach.lead_count_reset_at);
    const now = new Date();
    let currentCount = Number(coach.lead_count_this_month);

    if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
      currentCount = 0;
      await db.execute({
        sql: "UPDATE coaches SET lead_count_this_month = 0, lead_count_reset_at = datetime('now') WHERE id = ?",
        args: [coachId],
      });
    }

    // Enforce lead limit
    if (currentCount >= plan.maxLeadsPerMonth) {
      return NextResponse.json(
        { error: "Monthly lead limit reached. Upgrade to Pro for unlimited leads." },
        { status: 403 }
      );
    }

    const result = await db.execute({
      sql: `INSERT INTO leads (coach_id, name, email, score, max_score, percentage, tier, answers, category_scores)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        coachId,
        name.trim(),
        email.trim().toLowerCase(),
        score,
        maxScore,
        percentage,
        tier,
        JSON.stringify(answers || {}),
        JSON.stringify(categoryScores || {}),
      ],
    });

    // Increment lead count
    await db.execute({
      sql: "UPDATE coaches SET lead_count_this_month = lead_count_this_month + 1 WHERE id = ?",
      args: [coachId],
    });

    return NextResponse.json(
      { success: true, leadId: Number(result.lastInsertRowid) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting lead:", error);
    return NextResponse.json(
      { error: "Failed to submit lead" },
      { status: 500 }
    );
  }
}
