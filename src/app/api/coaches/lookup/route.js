import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db.execute({
      sql: "SELECT id, name FROM coaches WHERE email = ?",
      args: [email.trim().toLowerCase()],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No account found with that email. Make sure you entered the same email you used when creating your quiz." },
        { status: 404 }
      );
    }

    // Return the coach ID so the client can redirect
    return NextResponse.json({
      coachId: result.rows[0].id,
      name: result.rows[0].name,
    });
  } catch (error) {
    console.error("Error looking up coach:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
