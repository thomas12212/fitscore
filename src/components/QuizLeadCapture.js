"use client";
import { useState } from "react";
import { validateEmail } from "@/lib/utils";

export default function QuizLeadCapture({ onSubmit, isSubmitting }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = true;
    if (!email.trim() || !validateEmail(email)) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 2000);
      return;
    }

    onSubmit(name.trim(), email.trim());
  }

  return (
    <div className="animate-fade-up px-4 py-8 max-w-xl mx-auto text-center">
      <div className="text-5xl mb-4">🏆</div>

      <h2 className="text-3xl font-heading mb-3 text-gradient-accent">
        YOUR RESULTS ARE READY
      </h2>

      <p className="text-muted mb-8 text-lg">
        Enter your details below to see your personalized score and breakdown.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl bg-elevated border-2 text-foreground placeholder-muted outline-none transition-colors ${
            errors.name ? "border-red-500" : "border-border focus:border-accent"
          }`}
          style={{ "--tw-border-opacity": 1 }}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl bg-elevated border-2 text-foreground placeholder-muted outline-none transition-colors ${
            errors.email ? "border-red-500" : "border-border focus:border-accent"
          }`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-primary w-full text-lg py-4 ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Loading..." : "SEE MY RESULTS"}
        </button>
      </form>

      <p className="text-xs text-muted mt-4">
        Your information is kept private and will never be shared.
      </p>
    </div>
  );
}
