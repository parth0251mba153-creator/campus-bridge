import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';
import { Opportunity } from '../types';
import { getDeadlineUrgency } from '../data/sampleOpportunities';

interface LandingPageProps {
  sampleOpportunities: Opportunity[];
  onJoinBeta: () => void;
  onDemoLogin: () => void;
  onUpgradePlusClick: () => void;
  onOpenMetricsPreview: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  sampleOpportunities,
  onJoinBeta,
  onDemoLogin,
  onUpgradePlusClick,
  onOpenMetricsPreview,
}) => {
  const [heroImgError, setHeroImgError] = useState(false);
  const [studyImgError, setStudyImgError] = useState(false);

  const previewOpportunities = sampleOpportunities.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar: 3-Zone Contract (Wordmark — Nav Links — Primary Action) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-xl font-bold tracking-tight text-[#1E3A8A] whitespace-nowrap shrink-0"
          >
            CampusBridge
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#how-it-works"
              className="hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
            >
              How it works
            </a>
            <a
              href="#feed-preview"
              className="hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
            >
              Opportunities
            </a>
            <a
              href="#pricing"
              className="hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
            >
              Pricing
            </a>
            <button
              type="button"
              onClick={onOpenMetricsPreview}
              className="hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Beta metrics
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onJoinBeta}
              className="px-4 py-2.5 min-h-[40px] rounded-lg bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              Join the free beta
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-[#0F766E] mb-3">
                  Built for DBS Global University & Dehradun students
                </p>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.12] text-balance">
                  Stop searching ten groups. Get every relevant, verified opportunity in one place.
                </h1>
                <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Internships, live projects, case competitions, and campus placements curated for MBA and final-year students in Dehradun—filtered by your skills and tracked before deadlines slip.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onJoinBeta}
                    className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-[#1E3A8A] text-white text-sm sm:text-base font-semibold hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
                  >
                    Join the free beta
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onDemoLogin}
                    className="inline-flex items-center gap-2 px-5 py-3.5 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-700 text-sm sm:text-base font-medium hover:bg-slate-50 hover:border-slate-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Preview live student feed
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500">
                  <span>18+ verified Dehradun & remote roles</span>
                  <span aria-hidden="true">·</span>
                  <span>Skill-based match scoring</span>
                  <span aria-hidden="true">·</span>
                  <span>48h deadline alerts</span>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="h-full min-h-[260px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  {!heroImgError ? (
                    <img
                      src="/src/assets/images/hero_dehradun_campus_1795151131113.jpg"
                      alt="Postgraduate students collaborating in a sunlit Dehradun university library overlooking the foothills"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#1E3A8A]/10 via-slate-50 to-[#14B8A6]/15">
                      <ShieldCheck className="w-10 h-10 text-[#1E3A8A] mb-3" />
                      <p className="font-display font-semibold text-slate-900">
                        Dehradun Verified Student Feed
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Curated internships, projects, and placements for DGU & local campuses
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0F766E] mb-2">
                    How CampusBridge works
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                    From scattered WhatsApp forwards to a clear weekly shortlist.
                  </h2>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    Instead of scrolling through unverified links across Telegram channels, college notice boards, and group chats, set your skills once and act only on listings checked for authenticity.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-[4/3]">
                  {!studyImgError ? (
                    <img
                      src="/src/assets/images/campus_study_session_1795151130507.jpg"
                      alt="MBA student reviewing shortlisted career opportunities and notes at a study desk"
                      referrerPolicy="no-referrer"
                      onError={() => setStudyImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 bg-slate-100 text-slate-500 text-sm">
                      Organized Career Planning Workspace
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200">
                  <div className="p-6 sm:p-8 flex gap-5">
                    <span className="font-mono text-sm font-semibold text-[#1E3A8A] tabular-nums shrink-0 pt-0.5">
                      01.
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-slate-900">
                        Create your student profile
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                        Select your college, course (MBA, BBA, B.Tech, BCA), core skills like Marketing, Finance, or Data Analysis, and the opportunity formats you want this semester.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex gap-5">
                    <span className="font-mono text-sm font-semibold text-[#1E3A8A] tabular-nums shrink-0 pt-0.5">
                      02.
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-slate-900">
                        Get your personalized feed
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                        Every opportunity is checked against three verification criteria—source confirmed, organization checked, and deadline valid—then ranked by rule-based skill overlap.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex gap-5">
                    <span className="font-mono text-sm font-semibold text-[#1E3A8A] tabular-nums shrink-0 pt-0.5">
                      03.
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-slate-900">
                        Never miss a deadline
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                        Save roles into your Application Tracker, get 7-day and 48-hour urgency reminders, and move applications cleanly from Saved to Applied, Interview, and Offer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Verified Feed Preview */}
        <section
          id="feed-preview"
          className="py-16 lg:py-20 bg-white border-y border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-sm font-semibold text-[#0F766E] mb-2">
                  Sample data preview
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Verified opportunities in Dehradun & remote
                </h2>
              </div>
              <button
                type="button"
                onClick={onDemoLogin}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#172D6E] cursor-pointer whitespace-nowrap shrink-0"
              >
                Explore all 18 listings
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {previewOpportunities.map((item) => {
                const urgency = getDeadlineUrgency(item.deadline);
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug">
                          {item.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] whitespace-nowrap shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                          Verified
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {item.organization}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-500">
                        <span>{item.type}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.location}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-700 tabular-nums">
                          {item.stipend}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between gap-4 text-xs sm:text-sm">
                      <span className="text-slate-600 truncate">
                        Skills: {item.skills.join(' · ')}
                      </span>
                      <span
                        className={`font-medium whitespace-nowrap shrink-0 tabular-nums ${
                          urgency.tier === 'urgent48h'
                            ? 'text-red-600'
                            : urgency.tier === 'soon7d'
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {urgency.label}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-semibold text-[#0F766E] mb-2">
                Simple student pricing
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                Start free. Upgrade only when you want full matching and deadline alerts.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Free Plan */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        For casual browsing
                      </p>
                      <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                        Free Plan
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                        ₹0
                      </span>
                      <span className="text-sm text-slate-500"> / month</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    Access verified Dehradun and remote listings in one clean feed without group clutter.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
                      <span>Basic verified opportunity feed (all 5 types)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
                      <span>Search and filter by type, location, and skill</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
                      <span>Basic skill-overlap indicator (exact Match % locked)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
                      <span>Save up to 2 opportunities in tracker preview</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onJoinBeta}
                    className="w-full py-3 px-4 min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Join the free beta
                  </button>
                </div>
              </div>

              {/* CampusBridge Plus */}
              <div className="rounded-2xl border-2 border-[#1E3A8A] bg-white p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#0F766E]">
                        For active internship & placement seekers
                      </p>
                      <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                        CampusBridge Plus
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-3xl font-bold text-[#1E3A8A] tabular-nums">
                        ₹99
                      </span>
                      <span className="text-sm text-slate-500"> / month</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    Built for MBA and final-year students managing multiple applications and tight deadlines.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <SlidersHorizontal className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" />
                      <span>Full Match % score & matched-skills gap breakdown</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" />
                      <span>Urgent deadline alerts (48-hour & 7-day reminders)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" />
                      <span>Unlimited Application Tracker (Saved → Offer Kanban)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" />
                      <span>Priority access to newly verified Dehradun listings</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onUpgradePlusClick}
                    className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] transition-colors cursor-pointer"
                  >
                    Try CampusBridge Plus (₹99/mo demo)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span className="font-display font-semibold text-slate-700">
            CampusBridge
          </span>
          <span>CampusBridge – DGU Venture Quest | Built by Parth Chaturvedi</span>
        </div>
      </footer>
    </div>
  );
};
