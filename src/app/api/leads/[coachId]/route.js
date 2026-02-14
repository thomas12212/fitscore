import { NextResponse } from "next/server";
import { getDb, LEAD_STATUSES } from "@/lib/db";
import { verifyPassword } from "@/lib/utils";

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
      sql: "SELECT id, dashboard_password_hash FROM coaches WHERE id = ?",
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

    // Parse query params
    const { searchParams } = new URL(request.url);
    const tierFilter = searchParams.get("tier");
    const statusFilter = searchParams.get("status");
    const sortParam = searchParams.get("sort") || "date_desc";

    // Build query
    let sql = "SELECT * FROM leads WHERE coach_id = ?";
    const args = [coachId];

    if (tierFilter) {
      sql += " AND tier = ?";
      args.push(tierFilter);
    }

    if (statusFilter) {
      sql += " AND status = ?";
      args.push(statusFilter);
    }

    // Sorting
    const sortMap = {
      date_desc: "created_at DESC",
      date_asc: "created_at ASC",
      score_desc: "percentage DESC",
      score_asc: "percentage ASC",
    };
    sql += ` ORDER BY ${sortMap[sortParam] || "created_at DESC"}`;

    const leadsResult = await db.execute({ sql, args });

    // Get stats
    const statsResult = await db.execute({
      sql: `SELECT
              COUNT(*) as total,
              COALESCE(AVG(percentage), 0) as avg_score
            FROM leads WHERE coach_id = ?`,
      args: [coachId],
    });

    const tierResult = await db.execute({
      sql: `SELECT tier, COUNT(*) as count
            FROM leads WHERE coach_id = ?
            GROUP BY tier`,
      args: [coachId],
    });

    const tierDistribution = {};
    tierResult.rows.forEach((row) => {
      tierDistribution[row.tier] = Number(row.count);
    });

    const leads = leadsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      score: row.score,
      maxScore: row.max_score,
      percentage: row.percentage,
      tier: row.tier,
      status: row.status || "new",
      categoryScores: JSON.parse(row.category_scores || "{}"),
      createdAt: row.created_at,
    }));

    return NextResponse.json({
      leads,
      stats: {
        totalLeads: Number(statsResult.rows[0].total),
        averageScore: Math.round(Number(statsResult.rows[0].avg_score)),
        tierDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { coachId } = await params;
    const password = request.headers.get("x-dashboard-password");

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 401 });
    }

    const db = getDb();

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

    const body = await request.json();
    const { leadId, status } = body;

    if (!leadId || !LEAD_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid lead ID or status" },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "UPDATE leads SET status = ? WHERE id = ? AND coach_id = ?",
      args: [status, leadId, coachId],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating lead status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
