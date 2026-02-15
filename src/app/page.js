import Link from "next/link";
import { getTemplateList } from "@/lib/templates";

export default function HomePage() {
  const templates = getTemplateList();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="text-xl font-heading text-gradient-accent">FITSCORE</span>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors no-underline">
              Coach Login
            </Link>
            <Link href="/create" className="btn-primary text-sm py-2 px-5 no-underline">
              Create Quiz
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-muted mb-4">
          For Fitness Coaches & Influencers
        </p>
        <h1 className="text-5xl md:text-7xl font-heading leading-none mb-6 text-gradient-accent">
          TURN FOLLOWERS INTO CLIENTS
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Create branded fitness assessment quizzes that capture leads and
          score them by readiness to buy. Know exactly who&apos;s ready for coaching.
        </p>
        <Link
          href="/create"
          className="btn-primary inline-block text-lg px-10 py-4 no-underline"
        >
          CREATE YOUR QUIZ — FREE
        </Link>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-heading text-center mb-12 text-gradient-accent">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Pick a Template",
                desc: "Choose from 4 fitness-specific quiz templates. Customize colors, headline, and add your logo.",
              },
              {
                step: "02",
                title: "Share Your Link",
                desc: "Drop the link in your bio, stories, or ads. Your audience takes a 2-minute self-assessment.",
              },
              {
                step: "03",
                title: "Get Scored Leads",
                desc: "See every lead with their name, email, and a readiness score. Know exactly who to follow up with first.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-surface rounded-2xl p-6">
                <div className="text-4xl font-heading text-gradient-accent mb-3">
                  {item.step}
                </div>
                <h3 className="text-xl font-heading mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-heading text-center mb-12 text-gradient-accent">
            EVERYTHING YOU NEED
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "🎯",
                title: "Lead Scoring",
                desc: "Every answer is secretly scored. You see who's motivated and ready to invest — not just who's curious.",
              },
              {
                icon: "🎨",
                title: "Branded Quizzes",
                desc: "Customize colors, headlines, and logo to match your brand. Your quiz, your look.",
              },
              {
                icon: "📊",
                title: "Lead Dashboard",
                desc: "Password-protected dashboard showing all leads, scores, tier distribution, and trends.",
              },
              {
                icon: "📥",
                title: "CSV Export",
                desc: "Download your leads as a spreadsheet. Import into your CRM, email tool, or Google Sheets.",
              },
              {
                icon: "📱",
                title: "Mobile-First",
                desc: "Designed for Instagram and TikTok traffic. Looks great on every device.",
              },
              {
                icon: "⚡",
                title: "Free to Run",
                desc: "No monthly fees, no per-lead charges. Host your quiz at zero cost on Vercel.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-surface rounded-2xl p-6 flex gap-4"
              >
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="font-heading text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-heading text-center mb-4 text-gradient-accent">
            QUIZ TEMPLATES
          </h2>
          <p className="text-center text-muted mb-12 max-w-lg mx-auto">
            Purpose-built for fitness coaches. Each template has questions
            designed to qualify leads for your specific service.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((t) => (
              <div key={t.id} className="bg-surface rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{t.icon}</span>
                  <div>
                    <h3 className="font-heading text-xl">{t.name}</h3>
                    <p className="text-xs text-muted">
                      {t.questionCount} questions &middot; {t.categoryCount} categories
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted mb-3">{t.description}</p>
                <div className="flex gap-2">
                  <div
                    className="w-6 h-3 rounded-full"
                    style={{ background: t.defaultColors.primary }}
                  />
                  <div
                    className="w-6 h-3 rounded-full"
                    style={{ background: t.defaultColors.secondary }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-border text-center">
        <h2 className="text-4xl md:text-5xl font-heading mb-4 text-gradient-accent">
          READY TO SCORE YOUR LEADS?
        </h2>
        <p className="text-lg text-muted mb-8 max-w-lg mx-auto">
          Create your first quiz in 60 seconds. No sign-up required.
        </p>
        <Link
          href="/create"
          className="btn-primary inline-block text-lg px-10 py-4 no-underline"
        >
          CREATE YOUR QUIZ — FREE
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted">
        <span className="font-heading text-gradient-accent">FITSCORE</span> — Lead scoring for fitness coaches
      </footer>
    </div>
  );
}
