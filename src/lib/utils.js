import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

export function generateCoachId() {
  return nanoid(8);
}

export function generateQuizId() {
  return nanoid(10);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function buildCsv(leads) {
  const headers = ["Name", "Email", "Score", "Max Score", "Percentage", "Tier", "Quiz", "Status", "Date"];
  const rows = leads.map((lead) => [
    escapeCsvField(lead.name),
    escapeCsvField(lead.email),
    lead.score,
    lead.max_score,
    `${lead.percentage}%`,
    escapeCsvField(lead.tier),
    escapeCsvField(lead.quiz_name || ""),
    lead.status || "new",
    lead.created_at,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function escapeCsvField(value) {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
