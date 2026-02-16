"use client";
import { useState, useEffect, useCallback } from "react";
import { getTemplateList, getTemplate, mergeTemplate } from "@/lib/templates";
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
  const [analytics, setAnalytics] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [coachEmail, setCoachEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(null);

  // New quiz form state
  const [showNewQuiz, setShowNewQuiz] = useState(false);
  const [newQuizTemplate, setNewQuizTemplate] = useState("");
  const [newQuizName, setNewQuizName] = useState("");
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  const templates = getTemplateList();

  // Fetch quizzes + coach settings
  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await fetch(`/api/coaches/${coachId}`, {});
      if (res.ok) {
        const json = await res.json();
        setQuizzes(json.quizzes || []);
        if (json.email) setCoachEmail(json.email);
        if (json.webhookUrl) setWebhookUrl(json.webhookUrl);
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

  async function handleNotesChange(leadId, notes) {
    try {
      await fetch(`/api/leads/${coachId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-password": password,
        },
        body: JSON.stringify({ leadId, notes }),
      });

      setData((prev) => ({
        ...prev,
        leads: prev.leads.map((lead) =>
          lead.id === leadId ? { ...lead, notes } : lead
        ),
      }));
    } catch (err) {
      console.error("Failed to update notes:", err);
    }
  }

  async function handleSaveSettings() {
    setSavingSettings(true);
    try {
      await fetch(`/api/coaches/${coachId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-password": password,
        },
        body: JSON.stringify({ email: coachEmail, webhookUrl }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch {
      alert("Failed to save settings");
    }
    setSavingSettings(false);
  }

  function copyLink(url, quizId) {
    navigator.clipboard.writeText(url);
    setCopied(quizId);
    setTimeout(() => setCopied(null), 2000);
  }

  function copyEmbed(quizId, quizUrl) {
    const code = `<iframe src="${quizUrl}" width="100%" height="700" frameborder="0" style="border:none;border-radius:12px;"></iframe>`;
    navigator.clipboard.writeText(code);
    setEmbedCopied(quizId);
    setTimeout(() => setEmbedCopied(null), 2000);
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

  // Derive tier names dynamically from quizzes (supports custom tier names)
  const tiers = (() => {
    const names = new Set();
    quizzes.forEach((quiz) => {
      const base = getTemplate(quiz.templateId);
      if (!base) return;
      const merged = mergeTemplate(base, quiz.customizations || {});
      merged.tiers.forEach((t) => names.add(t.name));
    });
    if (names.size === 0) {
      // Fallback defaults
      return ["Just Getting Started", "Building Foundation", "Making Progress", "Ready to Transform"];
    }
    return Array.from(names);
  })();

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
                  <a
                    href={`/dashboard/${coachId}/edit/${quiz.id}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent transition-colors no-underline text-foreground"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => copyLink(quiz.quizUrl, quiz.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent transition-colors"
                  >
                    {copied === quiz.id ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    onClick={() => copyEmbed(quiz.id, quiz.quizUrl)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent transition-colors"
                  >
                    {embedCopied === quiz.id ? "Copied!" : "Embed"}
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

      <LeadsTable leads={data.leads} sort={sort} onSortChange={setSort} onStatusChange={handleStatusChange} onNotesChange={handleNotesChange} />

      {/* Settings Section */}
      <div className="mt-8 bg-surface rounded-xl p-5">
        <button
          onClick={() => setShowSettings((v) => !v)}
          className="flex justify-between items-center w-full"
        >
          <h2 className="text-lg font-heading text-gradient-accent">SETTINGS</h2>
          <span className="text-muted text-sm">{showSettings ? "Hide" : "Show"}</span>
        </button>

        {showSettings && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1">Notification Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={coachEmail}
                onChange={(e) => setCoachEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-elevated border border-border text-foreground placeholder-muted text-sm outline-none focus:border-accent"
              />
              <p className="text-xs text-muted mt-1">Get emailed when a new lead completes your quiz.</p>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Webhook URL (Pro)</label>
              <input
                type="url"
                placeholder="https://hooks.zapier.com/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-elevated border border-border text-foreground placeholder-muted text-sm outline-none focus:border-accent"
                disabled={plan !== "pro"}
              />
              <p className="text-xs text-muted mt-1">
                {plan === "pro"
                  ? "Sends lead data as JSON POST to this URL on every new quiz completion. Works with Zapier, Make, or any webhook endpoint."
                  : "Upgrade to Pro to use webhook integrations."}
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className={`btn-primary text-sm py-2 px-4 ${savingSettings ? "opacity-60" : ""}`}
            >
              {settingsSaved ? "Saved!" : savingSettings ? "Saving..." : "Save Settings"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
