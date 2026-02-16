"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

const TABS = ["branding", "questions", "tiers"];

export default function QuizEditor({ coachId, quizId, quizName, template, customizations }) {
  const [activeTab, setActiveTab] = useState("branding");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [quizNameDraft, setQuizNameDraft] = useState(quizName || "");

  // Branding state
  const [branding, setBranding] = useState({
    headline: customizations.headline || template.defaultHeadline || "",
    subheadline: customizations.subheadline || template.defaultSubheadline || "",
    primaryColor: customizations.primaryColor || template.defaultColors?.primary || "#ff4d4d",
    secondaryColor: customizations.secondaryColor || template.defaultColors?.secondary || "#ff7b00",
    logoUrl: customizations.logoUrl || "",
    ctaText: customizations.ctaText || "",
    bookingUrl: customizations.bookingUrl || "",
    ctaUrl: customizations.ctaUrl || "",
  });

  // Content state — deep copy from merged template
  const [categories, setCategories] = useState(() =>
    JSON.parse(JSON.stringify(template.categories))
  );
  const [tiers, setTiers] = useState(() =>
    JSON.parse(JSON.stringify(template.tiers))
  );

  const updateBranding = useCallback((key, value) => {
    setBranding((prev) => ({ ...prev, [key]: value }));
  }, []);

  // --- Category helpers ---
  function updateCategory(catIdx, key, value) {
    setCategories((prev) => {
      const next = [...prev];
      next[catIdx] = { ...next[catIdx], [key]: value };
      return next;
    });
  }

  function addCategory() {
    setCategories((prev) => [
      ...prev,
      {
        name: "New Category",
        icon: "📋",
        questions: [
          {
            text: "New question?",
            options: [
              { label: "Option 1", points: 1 },
              { label: "Option 2", points: 2 },
              { label: "Option 3", points: 3 },
            ],
          },
        ],
      },
    ]);
  }

  function removeCategory(catIdx) {
    if (categories.length <= 1) return;
    setCategories((prev) => prev.filter((_, i) => i !== catIdx));
  }

  // --- Question helpers ---
  function updateQuestion(catIdx, qIdx, key, value) {
    setCategories((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[catIdx].questions[qIdx][key] = value;
      return next;
    });
  }

  function addQuestion(catIdx) {
    setCategories((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[catIdx].questions.push({
        text: "New question?",
        options: [
          { label: "Option 1", points: 1 },
          { label: "Option 2", points: 2 },
          { label: "Option 3", points: 3 },
        ],
      });
      return next;
    });
  }

  function removeQuestion(catIdx, qIdx) {
    if (categories[catIdx].questions.length <= 1) return;
    setCategories((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[catIdx].questions.splice(qIdx, 1);
      return next;
    });
  }

  // --- Option helpers ---
  function updateOption(catIdx, qIdx, optIdx, key, value) {
    setCategories((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[catIdx].questions[qIdx].options[optIdx][key] = value;
      return next;
    });
  }

  function addOption(catIdx, qIdx) {
    setCategories((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const opts = next[catIdx].questions[qIdx].options;
      opts.push({ label: `Option ${opts.length + 1}`, points: opts.length + 1 });
      return next;
    });
  }

  function removeOption(catIdx, qIdx, optIdx) {
    if (categories[catIdx].questions[qIdx].options.length <= 2) return;
    setCategories((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[catIdx].questions[qIdx].options.splice(optIdx, 1);
      return next;
    });
  }

  // --- Tier helpers ---
  function updateTier(tierIdx, key, value) {
    setTiers((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[tierIdx][key] = value;
      return next;
    });
  }

  function updateRecommendation(tierIdx, recIdx, value) {
    setTiers((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[tierIdx].recommendations[recIdx] = value;
      return next;
    });
  }

  function addRecommendation(tierIdx) {
    setTiers((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[tierIdx].recommendations) next[tierIdx].recommendations = [];
      next[tierIdx].recommendations.push("New recommendation");
      return next;
    });
  }

  function removeRecommendation(tierIdx, recIdx) {
    setTiers((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[tierIdx].recommendations.splice(recIdx, 1);
      return next;
    });
  }

  function addTier() {
    setTiers((prev) => [
      ...prev,
      {
        name: "New Tier",
        minPct: prev.length > 0 ? (prev[prev.length - 1].minPct || 0) + 25 : 0,
        warmth: "warm",
        description: "Description for this tier.",
        recommendations: ["Tip 1", "Tip 2", "Tip 3"],
      },
    ]);
  }

  function removeTier(tierIdx) {
    if (tiers.length <= 1) return;
    setTiers((prev) => prev.filter((_, i) => i !== tierIdx));
  }

  // --- Save ---
  async function handleSave() {
    if (!password) {
      setError("Enter your dashboard password to save.");
      return;
    }

    setSaving(true);
    setError("");

    const customizationsToSave = {
      headline: branding.headline,
      subheadline: branding.subheadline,
      primaryColor: branding.primaryColor,
      secondaryColor: branding.secondaryColor,
      logoUrl: branding.logoUrl,
      ctaText: branding.ctaText,
      bookingUrl: branding.bookingUrl,
      ctaUrl: branding.ctaUrl,
      categories,
      tiers,
    };

    try {
      const res = await fetch(`/api/quizzes/${quizId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-password": password,
        },
        body: JSON.stringify({
          customizations: customizationsToSave,
          name: quizNameDraft.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        setSaving(false);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save. Please try again.");
    }
    setSaving(false);
  }

  const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/${coachId}`}
              className="text-sm text-muted hover:text-foreground transition-colors no-underline"
            >
              &larr; Dashboard
            </Link>
            <span className="text-border">|</span>
            <span className="text-sm font-medium truncate max-w-[200px]">
              Editing: {quizNameDraft || quizName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Dashboard password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-elevated border border-border text-foreground placeholder-muted text-sm outline-none focus:border-accent w-40"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn-primary text-sm py-1.5 px-4 ${saving ? "opacity-60" : ""}`}
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {error && (
          <div className="max-w-4xl mx-auto px-4 pb-2">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quiz Name */}
        <div className="mb-6">
          <label className="block text-sm text-muted mb-1">Quiz Name</label>
          <input
            type="text"
            value={quizNameDraft}
            onChange={(e) => setQuizNameDraft(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
            placeholder="e.g. Spring Bulking Challenge"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-elevated rounded-lg p-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-surface text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab === "questions" ? `Questions (${totalQuestions})` : tab}
            </button>
          ))}
        </div>

        {/* Branding Tab */}
        {activeTab === "branding" && (
          <div className="animate-fade-up space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1">Headline</label>
              <input
                type="text"
                value={branding.headline}
                onChange={(e) => updateBranding("headline", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">Subheadline</label>
              <textarea
                value={branding.subheadline}
                onChange={(e) => updateBranding("subheadline", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">Primary Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => updateBranding("primaryColor", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-sm text-muted">{branding.primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Secondary Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => updateBranding("secondaryColor", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-sm text-muted">{branding.secondaryColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">Logo URL</label>
              <input
                type="url"
                placeholder="https://example.com/your-logo.png"
                value={branding.logoUrl}
                onChange={(e) => updateBranding("logoUrl", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">Booking Link</label>
              <input
                type="url"
                placeholder="https://cal.com/you/30min"
                value={branding.bookingUrl}
                onChange={(e) => updateBranding("bookingUrl", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">CTA Button Text</label>
              <input
                type="text"
                placeholder="Book a Free Consultation"
                value={branding.ctaText}
                onChange={(e) => updateBranding("ctaText", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">Fallback Link (optional)</label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={branding.ctaUrl}
                onChange={(e) => updateBranding("ctaUrl", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
              />
              <p className="text-xs text-muted mt-1">
                Shown if no booking link is set.
              </p>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="animate-fade-up space-y-6">
            {categories.map((cat, catIdx) => (
              <div key={catIdx} className="bg-surface rounded-xl overflow-hidden">
                {/* Category header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={cat.icon}
                      onChange={(e) => updateCategory(catIdx, "icon", e.target.value)}
                      className="w-12 text-center px-1 py-1.5 rounded-lg bg-elevated border border-border text-lg outline-none focus:border-accent"
                      title="Category icon (emoji)"
                    />
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategory(catIdx, "name", e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-elevated border border-border text-foreground font-medium outline-none focus:border-accent"
                      placeholder="Category name"
                    />
                    <button
                      onClick={() => removeCategory(catIdx)}
                      disabled={categories.length <= 1}
                      className="text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:text-muted text-sm px-2"
                      title="Delete category"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-4 space-y-4">
                  {cat.questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-elevated rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-xs text-muted mt-2 w-6 shrink-0">Q{qIdx + 1}</span>
                        <textarea
                          value={q.text}
                          onChange={(e) => updateQuestion(catIdx, qIdx, "text", e.target.value)}
                          rows={2}
                          className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent resize-y"
                          placeholder="Question text"
                        />
                        <button
                          onClick={() => removeQuestion(catIdx, qIdx)}
                          disabled={cat.questions.length <= 1}
                          className="text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:text-muted text-xs px-1 mt-2"
                          title="Delete question"
                        >
                          &times;
                        </button>
                      </div>

                      {/* Options */}
                      <div className="ml-6 space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => updateOption(catIdx, qIdx, optIdx, "label", e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent"
                              placeholder="Option text"
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={opt.points}
                                onChange={(e) => updateOption(catIdx, qIdx, optIdx, "points", parseInt(e.target.value) || 1)}
                                className="w-14 px-2 py-1.5 rounded-lg bg-surface border border-border text-foreground text-sm text-center outline-none focus:border-accent"
                                title="Points"
                              />
                              <span className="text-xs text-muted">pts</span>
                            </div>
                            <button
                              onClick={() => removeOption(catIdx, qIdx, optIdx)}
                              disabled={q.options.length <= 2}
                              className="text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:text-muted text-xs"
                              title="Remove option"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addOption(catIdx, qIdx)}
                          className="text-xs text-muted hover:text-accent transition-colors"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addQuestion(catIdx)}
                    className="text-sm text-muted hover:text-accent transition-colors w-full py-2 rounded-lg border border-dashed border-border hover:border-accent"
                  >
                    + Add Question
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addCategory}
              className="w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-accent text-muted hover:text-accent transition-colors text-sm font-medium"
            >
              + Add Category
            </button>
          </div>
        )}

        {/* Tiers Tab */}
        {activeTab === "tiers" && (
          <div className="animate-fade-up space-y-4">
            <p className="text-sm text-muted mb-2">
              Tiers determine how quiz takers are categorized based on their score percentage. Each tier shows different results and recommendations.
            </p>

            {tiers
              .sort((a, b) => a.minPct - b.minPct)
              .map((tier, tierIdx) => {
                const warmthColors = {
                  cold: "#6b7280",
                  warm: "#f59e0b",
                  hot: "#ef4444",
                  fire: "#ff4d4d",
                };
                return (
                  <div key={tierIdx} className="bg-surface rounded-xl p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => updateTier(tierIdx, "name", e.target.value)}
                        className="flex-1 min-w-[150px] px-3 py-2 rounded-lg bg-elevated border border-border text-foreground font-medium outline-none focus:border-accent"
                        placeholder="Tier name"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-muted">Min %</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={tier.minPct}
                          onChange={(e) => updateTier(tierIdx, "minPct", parseInt(e.target.value) || 0)}
                          disabled={tierIdx === 0}
                          className="w-16 px-2 py-2 rounded-lg bg-elevated border border-border text-foreground text-sm text-center outline-none focus:border-accent disabled:opacity-50"
                        />
                      </div>
                      <select
                        value={tier.warmth}
                        onChange={(e) => updateTier(tierIdx, "warmth", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-elevated border border-border text-foreground text-sm outline-none"
                      >
                        <option value="cold">Cold</option>
                        <option value="warm">Warm</option>
                        <option value="hot">Hot</option>
                        <option value="fire">Fire</option>
                      </select>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: warmthColors[tier.warmth] }}
                      />
                      <button
                        onClick={() => removeTier(tierIdx)}
                        disabled={tiers.length <= 1}
                        className="text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:text-muted text-sm"
                        title="Delete tier"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs text-muted mb-1">Description</label>
                      <textarea
                        value={tier.description}
                        onChange={(e) => updateTier(tierIdx, "description", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-elevated border border-border text-foreground text-sm outline-none focus:border-accent resize-y"
                        placeholder="Shown to the quiz taker on results"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted mb-1">Recommendations</label>
                      <div className="space-y-2">
                        {(tier.recommendations || []).map((rec, recIdx) => (
                          <div key={recIdx} className="flex items-center gap-2">
                            <span className="text-xs text-muted w-4">{recIdx + 1}.</span>
                            <input
                              type="text"
                              value={rec}
                              onChange={(e) => updateRecommendation(tierIdx, recIdx, e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-elevated border border-border text-foreground text-sm outline-none focus:border-accent"
                            />
                            <button
                              onClick={() => removeRecommendation(tierIdx, recIdx)}
                              className="text-muted hover:text-red-500 transition-colors text-xs"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addRecommendation(tierIdx)}
                          className="text-xs text-muted hover:text-accent transition-colors"
                        >
                          + Add Recommendation
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            <button
              onClick={addTier}
              className="w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-accent text-muted hover:text-accent transition-colors text-sm font-medium"
            >
              + Add Tier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
