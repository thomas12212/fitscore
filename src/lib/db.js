import { createClient } from "@libsql/client";

let db;

export function getDb() {
  if (!db) {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return db;
}

export const LEAD_STATUSES = ["new", "contacted", "booked", "closed"];

export const PLANS = {
  free: {
    maxQuizzes: 1,
    maxLeadsPerMonth: 50,
    csvExport: false,
    removeBranding: false,
    calEmbed: false,
  },
  pro: {
    maxQuizzes: 999,
    maxLeadsPerMonth: 999999,
    csvExport: true,
    removeBranding: true,
    calEmbed: true,
  },
};
