"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [coachId, setCoachId] = useState("");
  const [mode, setMode] = useState("email"); // "email" or "id"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLookup(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/coaches/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(`/dashboard/${data.coachId}`);
    } catch {
      setError("Failed to connect. Please try again.");
      setLoading(false);
    }
  }

  function handleIdSubmit(e) {
    e.preventDefault();
    if (!coachId.trim()) return;
    router.push(`/dashboard/${coachId.trim()}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors no-underline mb-8 inline-block"
        >
          &larr; Back to home
        </Link>

        <h1 className="text-3xl font-heading mb-2 text-gradient-accent">
          COACH LOGIN
        </h1>
        <p className="text-muted mb-8">
          Access your leads dashboard.
        </p>

        {/* Toggle */}
        <div className="flex gap-1 bg-elevated rounded-lg p-1 mb-6">
          <button
            onClick={() => { setMode("email"); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "email"
                ? "bg-surface text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Find by Email
          </button>
          <button
            onClick={() => { setMode("id"); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "id"
                ? "bg-surface text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Use Coach ID
          </button>
        </div>

        {mode === "email" ? (
          <form onSubmit={handleEmailLookup} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="The email you used when creating your quiz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className={`btn-primary w-full ${loading ? "opacity-60" : ""}`}
            >
              {loading ? "Looking up..." : "Find My Dashboard"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleIdSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1">
                Coach ID
              </label>
              <input
                type="text"
                placeholder="Your 8-character coach ID"
                value={coachId}
                onChange={(e) => setCoachId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
                required
              />
              <p className="text-xs text-muted mt-1">
                This was shown when you created your quiz. Check your dashboard URL — it&apos;s the code after /dashboard/.
              </p>
            </div>

            <button
              type="submit"
              disabled={!coachId.trim()}
              className="btn-primary w-full"
            >
              Go to Dashboard
            </button>
          </form>
        )}

        <p className="text-center text-sm text-muted mt-8">
          Don&apos;t have a quiz yet?{" "}
          <Link href="/create" className="text-accent hover:underline no-underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
