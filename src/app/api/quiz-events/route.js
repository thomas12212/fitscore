import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const { quizId, eventType } = await request.json();

    if (!quizId || !["view", "start", "complete"].includes(eventType)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const db = getDb();
    await db.execute({
      sql: "INSERT INTO quiz_events (quiz_id, event_type) VALUES (?, ?)",
      args: [quizId, eventType],
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error tracking event:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
