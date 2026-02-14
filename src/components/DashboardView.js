"use client";
import { useState, useEffect, useCallback } from "react";
import { getTemplateList } from "@/lib/templates";
import StatsCards from "./StatsCards";
import LeadsTable from "./LeadsTable";

export default function DashboardView({ coachId, password, plan }) {
  const [data, setData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("date_desc");
  const [tierFilter, setTierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [copied, setCopied] = useState(null);

  // New quiz form state
  const [showNewQuiz, setShowNewQuiz] = useState(false);
  const [newQuizTemplate, setNewQuizTemplate] = useState("");
  const [newQuizName, setNewQuizName] = useState("");
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  const templates = getTemplateList();

  // Fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await fetch(`/api/coaches/${coachId}`, {});
      if (res.ok) {
        const json = await res.json();
        setQuizzes(json.quizzes || []);
      }
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  }, [coachId]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort });
      if (tierFilter) params.set("tier", tierFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/leads/${coachId}?${params}`, {
        headers: { "x-dashboard-password": password },
      });

      if (!res.ok) throw new Error("Failed to fetch leads");

      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [coachId, password, sort, tierFilter, statusFilter]);

  useEffect(() => {
    fetchLeads();
    fetchQuizzes();
  }, [fetchLeads, fetchQuizzes]);

  async function handleStatusChange(leadId, newStatus) {
    try {
      await fetch(`/api/leads/${coachId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-password": password,
        },
        body: JSON.stringify({ leadId, status: newStatus }),
      });

      // Optimistic update
      setData((prev) => ({
        ...prev,
        leads: prev.leads.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ),
      }));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function handleExport() {
    try {
      const res = await fetch(`/api/leads/${coachId}/export`, {
        headers: { "x-dashboard-password": password },
      });
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fitscore-leads-${coachId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  }

  async function handleCreateQuiz() {
    if (!newQuizTemplate) return;
    setCreatingQuiz(true);
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-password": password,
        },
        body: JSON.stringify({
          coachId,
          templateId: newQuizTemplate,
          name: newQuizName.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create quiz");
        setCreatingQuiz(false);
        return;
      }

      setShowNewQuiz(false);
      setNewQuizTemplate("");
      setNewQuizName("");
      fetchQuizzes();
    } catch {
      alert("Failed to create quiz");
    }
    setCreatingQuiz(false);
  }

  function copyLink(url, quizId) {
    navigator.clipboard.writeText(url);
    setCopied(quizId);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading && !data) {
    return (
      <div className="text-center py-12">
        <div className="text-muted">Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const tiers = [
    "Just Getting Started",
    "Building Foundation",
    "Making Progress",
    "Ready to Transform",
  ];

  return (
    <div className="animate-fade-up">
      {/* Quizzes Section */}
      <div className="bg-surface rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-heading text-gradient-accent">YOUR QUIZZES</h2>
          <button
            onClick={() => setShowNewQuiz((v) => !v)}
            className="btn-secondary text-sm py-1.5 px-3"
          >
            {showNewQuiz ? "Cancel" : "+ New Quiz"}
          </button>
        </div>

        {/* New quiz form */}
        {showNewQuiz && (
          <div className="bg-elevated rounded-xl p-4 mb-4 space-y-3">
            <div>
              <label className="block text-sm text-muted mb-1">Template</label>
              <select
                value={newQuizTemplate}
                onChange={(e) => setNewQuizTemplate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none"
              >
                <option value="">Select a template...</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Quiz Name (optional)</label>
              <input
                type="text"
                placeholder="e.g. Spring Bulking Challenge"
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground placeholder-muted text-sm outline-none"
              />
            </div>
            <button
              onClick={handleCreateQuiz}
              disabled={!newQuizTemplate || creatingQuiz}
              className={`btn-primary text-sm py-2 px-4 ${!newQuizTemplate || creatingQuiz ? "opacity-60" : ""}`}
            >
              {creatingQuiz ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        )}

        {/* Quiz list */}
        {quizzes.length === 0 ? (
          <p className="text-muted text-sm">No quizzes yet. Create one to get started!</p>
        ) : (
          <div className="space-y-2">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex flex-wrap items-center justify-between gap-2 bg-elevated rounded-lg px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{quiz.name}</p>
                  <p className="text-xs text-muted truncate">{quiz.quizUrl}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {!quiz.active && (
                    <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded">Inactive</span>
                  )}
                  <button
                    onClick={() => copyLink(quiz.quizUrl, quiz.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent transition-colors"
                  >
                    {copied === quiz.id ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <StatsCards stats={data.stats} />

      {/* Tier Distribution Bar */}
      {data.stats.totalLeads > 0 && (
        <div className="bg-surface rounded-xl p-4 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide mb-3">Tier Distribution</p>
          <div className="flex rounded-lg overflow-hidden h-6">
            {tiers.map((tier) => {
              const count = data.stats.tierDistribution[tier] || 0;
              const pct = data.stats.totalLeads > 0 ? (count / data.stats.totalLeads) * 100 : 0;
              if (pct === 0) return null;
              const colors = {
                "Just Getting Started": "#6b7280",
                "Building Foundation": "#f59e0b",
                "Making Progress": "#ef4444",
                "Ready to Transform": "#ff4d4d",
              };
              return (
                <div
                  key={tier}
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${pct}%`, background: colors[tier], minWidth: pct > 0 ? "20px" : 0 }}
                  title={`${tier}: ${count}`}
                >
                  {pct >= 10 ? count : ""}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-2 flex-wrap">
            {tiers.map((tier) => {
              const count = data.stats.tierDistribution[tier] || 0;
              const colors = {
                "Just Getting Started": "#6b7280",
                "Building Foundation": "#f59e0b",
                "Making Progress": "#ef4444",
                "Ready to Transform": "#ff4d4d",
              };
              return (
                <div key={tier} className="flex items-center gap-1 text-xs text-muted">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: colors[tier] }}
                  />
                  {tier}: {count}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
        <div className="flex gap-3 items-center">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-elevated border border-border text-foreground text-sm outline-none"
          >
            <option value="">All Tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-elevated border border-border text-foreground text-sm outline-none"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="booked">Booked</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {plan === "pro" ? (
          <button onClick={handleExport} className="btn-secondary text-sm py-2 px-4">
            Export CSV
          </button>
        ) : (
          <span className="text-xs text-muted" title="Upgrade to Pro to export">
            CSV Export (Pro)
          </span>
        )}
      </div>

      <LeadsTable leads={data.leads} sort={sort} onSortChange={setSort} onStatusChange={handleStatusChange} />
    </div>
  );
}
