import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const result = await db.execute({
      sql: `SELECT id, name, template_id, customizations, created_at
            FROM coaches WHERE id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const coach = result.rows[0];

    return NextResponse.json({
      id: coach.id,
      name: coach.name,
      templateId: coach.template_id,
      customizations: JSON.parse(coach.customizations || "{}"),
      createdAt: coach.created_at,
    });
  } catch (error) {
    console.error("Error fetching coach:", error);
    return NextResponse.json(
      { error: "Failed to fetch coach" },
      { status: 500 }
    );
  }
}
