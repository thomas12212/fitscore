import { NextResponse } from "next/server";
import { getDb, PLANS } from "@/lib/db";
import { validateEmail } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { coachId, quizId, name, email, score, maxScore, percentage, tier, answers, categoryScores } = body;

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
      sql: "SELECT id, name, email, plan, webhook_url, lead_count_this_month, lead_count_reset_at FROM coaches WHERE id = ?",
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
      sql: `INSERT INTO leads (coach_id, quiz_id, name, email, score, max_score, percentage, tier, answers, category_scores)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        coachId,
        quizId || null,
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

    // Calculate percentile (how this person compares to others who took this quiz)
    let percentile = 50;
    if (quizId) {
      const percResult = await db.execute({
        sql: `SELECT COUNT(*) as below FROM leads WHERE quiz_id = ? AND percentage < ?`,
        args: [quizId, percentage],
      });
      const totalResult = await db.execute({
        sql: `SELECT COUNT(*) as total FROM leads WHERE quiz_id = ?`,
        args: [quizId],
      });
      const below = Number(percResult.rows[0].below);
      const total = Number(totalResult.rows[0].total);
      if (total > 1) {
        percentile = Math.round((below / (total - 1)) * 100);
      }
    }

    // Track completion event
    if (quizId) {
      await db.execute({
        sql: "INSERT INTO quiz_events (quiz_id, event_type) VALUES (?, 'complete')",
        args: [quizId],
      }).catch(() => {});
    }

    // Fire webhook (non-blocking)
    if (coach.webhook_url) {
      fetch(coach.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "new_lead",
          lead: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            score,
            maxScore,
            percentage,
            tier,
            quizId,
            createdAt: new Date().toISOString(),
          },
          coach: { id: coachId, name: coach.name },
        }),
      }).catch(() => {});
    }

    // Send email notification to coach (non-blocking)
    if (coach.email && process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      resend.emails.send({
        from: "FitScore <notifications@fitscore.app>",
        to: coach.email,
        subject: `New ${tier} Lead: ${name.trim()}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#333;">New Quiz Lead!</h2>
            <p><strong>${name.trim()}</strong> just completed your quiz.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email.trim().toLowerCase()}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Score</td><td style="padding:8px;border-bottom:1px solid #eee;">${percentage}% (${score}/${maxScore})</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Tier</td><td style="padding:8px;border-bottom:1px solid #eee;">${tier}</td></tr>
            </table>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${coachId}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;">View Dashboard</a>
          </div>
        `,
      }).catch((e) => console.error("Email failed:", e));
    }

    return NextResponse.json(
      { success: true, leadId: Number(result.lastInsertRowid), percentile },
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
