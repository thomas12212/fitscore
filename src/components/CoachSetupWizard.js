"use client";
import { useState } from "react";
import { getTemplateList } from "@/lib/templates";
import TemplateCard from "./TemplateCard";

const STEPS = ["template", "customize", "password", "success"];

export default function CoachSetupWizard() {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customizations, setCustomizations] = useState({
    headline: "",
    primaryColor: "",
    secondaryColor: "",
    logoUrl: "",
    ctaText: "",
    ctaUrl: "",
    bookingUrl: "",
  });
  const [coachName, setCoachName] = useState("");
  const [coachEmail, setCoachEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState({ quiz: false, dashboard: false });
  const [showPassword, setShowPassword] = useState(false);

  const templates = getTemplateList();
  const currentStep = STEPS[step];

  function nextStep() {
    if (currentStep === "template" && !selectedTemplate) {
      setErrors({ template: "Please select a template" });
      return;
    }
    if (currentStep === "password") {
      const newErrors = {};
      if (!coachName.trim()) newErrors.name = true;
      if (!password || password.length < 6) newErrors.password = true;
      if (password !== confirmPassword) newErrors.confirm = true;
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setTimeout(() => setErrors({}), 2000);
        return;
      }
      handleSubmit();
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  }

  function prevStep() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      // Clean customizations — only send non-empty values
      const cleanCustom = {};
      if (customizations.headline.trim()) cleanCustom.headline = customizations.headline.trim();
      if (customizations.primaryColor) cleanCustom.primaryColor = customizations.primaryColor;
      if (customizations.secondaryColor) cleanCustom.secondaryColor = customizations.secondaryColor;
      if (customizations.logoUrl.trim()) cleanCustom.logoUrl = customizations.logoUrl.trim();
      if (customizations.ctaText.trim()) cleanCustom.ctaText = customizations.ctaText.trim();
      if (customizations.ctaUrl.trim()) cleanCustom.ctaUrl = customizations.ctaUrl.trim();
      if (customizations.bookingUrl.trim()) cleanCustom.bookingUrl = customizations.bookingUrl.trim();

      const res = await fetch("/api/coaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: coachName.trim(),
          email: coachEmail.trim() || undefined,
          templateId: selectedTemplate,
          password,
          customizations: cleanCustom,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ submit: data.error || "Something went wrong" });
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      setResult(data);
      setStep(3);
    } catch {
      setErrors({ submit: "Failed to create quiz. Please try again." });
    }
    setIsSubmitting(false);
  }

  function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 2000);
  }

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        {currentStep !== "success" && (
          <div className="flex gap-2 mb-8">
            {STEPS.slice(0, 3).map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= step ? "gradient-accent" : "bg-elevated"
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 1: Template Selection */}
        {currentStep === "template" && (
          <div className="animate-fade-up">
            <h1 className="text-3xl font-heading mb-2 text-gradient-accent">
              CHOOSE YOUR TEMPLATE
            </h1>
            <p className="text-muted mb-6">
              Pick the quiz that matches your coaching niche.
            </p>

            <div className="space-y-3 mb-6">
              {templates.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  selected={selectedTemplate === t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    setErrors({});
                  }}
                />
              ))}
            </div>

            {errors.template && (
              <p className="text-red-500 text-sm mb-4">{errors.template}</p>
            )}

            <button onClick={nextStep} className="btn-primary w-full">
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Customize */}
        {currentStep === "customize" && (
          <div className="animate-fade-up">
            <h1 className="text-3xl font-heading mb-2 text-gradient-accent">
              CUSTOMIZE YOUR QUIZ
            </h1>
            <p className="text-muted mb-6">
              Make it yours. All fields are optional — defaults will be used if left blank.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-muted mb-1">Headline</label>
                <input
                  type="text"
                  placeholder={selectedTemplateData?.name ? `Default: template headline` : ""}
                  value={customizations.headline}
                  onChange={(e) =>
                    setCustomizations((c) => ({ ...c, headline: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">Primary Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={customizations.primaryColor || selectedTemplateData?.defaultColors?.primary || "#ff4d4d"}
                      onChange={(e) =>
                        setCustomizations((c) => ({ ...c, primaryColor: e.target.value }))
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-sm text-muted">
                      {customizations.primaryColor || "Default"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">Secondary Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={customizations.secondaryColor || selectedTemplateData?.defaultColors?.secondary || "#ff7b00"}
                      onChange={(e) =>
                        setCustomizations((c) => ({ ...c, secondaryColor: e.target.value }))
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-sm text-muted">
                      {customizations.secondaryColor || "Default"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">Logo URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/your-logo.png"
                  value={customizations.logoUrl}
                  onChange={(e) =>
                    setCustomizations((c) => ({ ...c, logoUrl: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">Booking Link</label>
                <input
                  type="url"
                  placeholder="https://cal.com/you/30min"
                  value={customizations.bookingUrl}
                  onChange={(e) =>
                    setCustomizations((c) => ({ ...c, bookingUrl: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
                />
                <p className="text-xs text-muted mt-1">
                  <strong className="text-foreground">Recommended: Cal.com</strong> — embeds directly on your results page for a seamless booking experience.
                  Calendly, Google Calendar, or any other link will work too (opens in a new tab).
                </p>
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">CTA Button Text</label>
                <input
                  type="text"
                  placeholder="Book a Free Consultation"
                  value={customizations.ctaText}
                  onChange={(e) =>
                    setCustomizations((c) => ({ ...c, ctaText: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">Fallback Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={customizations.ctaUrl}
                  onChange={(e) =>
                    setCustomizations((c) => ({ ...c, ctaUrl: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none focus:border-accent"
                />
                <p className="text-xs text-muted mt-1">
                  Shown if no booking link is set. Links to your website, Instagram, etc.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="btn-secondary flex-1">
                Back
              </button>
              <button onClick={nextStep} className="btn-primary flex-1">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Password */}
        {currentStep === "password" && (
          <div className="animate-fade-up">
            <h1 className="text-3xl font-heading mb-2 text-gradient-accent">
              SECURE YOUR DASHBOARD
            </h1>
            <p className="text-muted mb-6">
              Set your name and a password to access your leads dashboard.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-muted mb-1">Your Name / Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Coach Harrison"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-elevated border-2 text-foreground placeholder-muted outline-none transition-colors ${
                    errors.name ? "border-red-500" : "border-border focus:border-accent"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">Email (optional)</label>
                <input
                  type="email"
                  placeholder="you@email.com — get notified on new leads"
                  value={coachEmail}
                  onChange={(e) => setCoachEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-elevated border-2 border-border text-foreground placeholder-muted outline-none transition-colors focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">Dashboard Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-elevated border-2 text-foreground placeholder-muted outline-none transition-colors ${
                      errors.password ? "border-red-500" : "border-border focus:border-accent"
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
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-elevated border-2 text-foreground placeholder-muted outline-none transition-colors ${
                    errors.confirm ? "border-red-500" : "border-border focus:border-accent"
                  }`}
                />
                {errors.confirm && (
                  <p className="text-red-500 text-xs mt-1">Passwords don&apos;t match</p>
                )}
              </div>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
            )}

            <div className="flex gap-3">
              <button onClick={prevStep} className="btn-secondary flex-1">
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={isSubmitting}
                className={`btn-primary flex-1 ${isSubmitting ? "opacity-60" : ""}`}
              >
                {isSubmitting ? "Creating..." : "Create My Quiz"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === "success" && result && (
          <div className="animate-fade-up text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl font-heading mb-2 text-gradient-accent">
              YOUR QUIZ IS LIVE!
            </h1>
            <p className="text-muted mb-8">
              Share your quiz link and start collecting leads.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-surface rounded-xl p-4">
                <label className="block text-sm text-muted mb-2">Quiz Link (share this)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={result.quizUrl}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg bg-elevated border border-border text-foreground text-sm outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(result.quizUrl, "quiz")}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    {copied.quiz ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-3">
              <a
                href={result.dashboardUrl}
                className="btn-primary inline-block no-underline text-center"
              >
                Go to Dashboard
              </a>
              <a
                href={result.quizUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-block no-underline text-center"
              >
                Preview Your Quiz
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
