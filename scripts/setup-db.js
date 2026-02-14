import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:local.db",
});

const statements = [
  `CREATE TABLE IF NOT EXISTS coaches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    template_id TEXT NOT NULL,
    customizations TEXT NOT NULL DEFAULT '{}',
    dashboard_password_hash TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    lead_count_this_month INTEGER NOT NULL DEFAULT 0,
    lead_count_reset_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    coach_id TEXT NOT NULL,
    template_id TEXT NOT NULL,
    name TEXT NOT NULL,
    customizations TEXT NOT NULL DEFAULT '{}',
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (coach_id) REFERENCES coaches(id)
  )`,
  `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coach_id TEXT NOT NULL,
    quiz_id TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    tier TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    answers TEXT NOT NULL DEFAULT '{}',
    category_scores TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (coach_id) REFERENCES coaches(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_leads_coach_id ON leads(coach_id)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_quiz_id ON leads(quiz_id)`,
  `CREATE INDEX IF NOT EXISTS idx_quizzes_coach_id ON quizzes(coach_id)`,
];

for (const sql of statements) {
  await db.execute(sql);
}

console.log("Database setup complete! Tables created in local.db");
