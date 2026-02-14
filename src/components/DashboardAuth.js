"use client";
import { useState } from "react";
import DashboardView from "./DashboardView";

export default function DashboardAuth({ coachId, coachName, plan }) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [storedPassword, setStoredPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/leads/${coachId}?sort=date_desc`, {
        headers: { "x-dashboard-password": password },
      });

      if (res.status === 401) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setStoredPassword(password);
      setAuthenticated(true);
    } catch {
      setError("Failed to connect. Please try again.");
    }
    setLoading(false);
  }

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-password": storedPassword,
        },
        body: JSON.stringify({ coachId }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to start upgrade. Please try again.");
        setUpgrading(false);
        return;
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch {
      alert("Failed to connect to payment. Please try again.");
      setUpgrading(false);
    }
  }

  if (authenticated) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading text-gradient-accent">
              {coachName ? `${coachName.toUpperCase()}'S DASHBOARD` : "LEAD DASHBOARD"}
            </h1>
            <p className="text-sm text-muted">Your quiz leads, sorted by readiness.</p>
          </div>
          <div className="flex items-center gap-3">
            {plan === "pro" ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/40">
                Pro Plan
              </span>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="btn-primary text-sm py-2 px-4"
              >
                {upgrading ? "Loading..." : "Upgrade to Pro — $9/mo"}
              </button>
            )}
          </div>
        </div>

        {/* Free plan limits banner */}
        {plan !== "pro" && (
          <div className="bg-surface border border-border rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Free Plan — 50 leads/month, 1 quiz</p>
              <p className="text-xs text-muted">Upgrade to Pro for unlimited leads, no branding badge, and CSV export.</p>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="text-sm font-bold text-gradient-accent hover:opacity-80 transition-opacity"
            >
              Upgrade
            </button>
          </div>
        )}

        <DashboardView coachId={coachId} password={storedPassword} plan={plan} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-3xl font-heading mb-2 text-gradient-accent">
            DASHBOARD ACCESS
          </h1>
          <p className="text-muted">
            Enter your password to view your leads.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Dashboard password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-xl bg-elevated border-2 text-foreground placeholder-muted outline-none transition-colors ${
                error ? "border-red-500" : "border-border focus:border-accent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-sm transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full ${loading ? "opacity-60" : ""}`}
          >
            {loading ? "Checking..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
