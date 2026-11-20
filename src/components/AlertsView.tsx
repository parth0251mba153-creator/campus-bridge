import React, { useMemo } from 'react';
import { AlertTriangle, Bell, Clock, Lock, ShieldCheck } from 'lucide-react';
import { calculateMatch, getDeadlineUrgency } from '../data/sampleOpportunities';
import {
  Opportunity,
  PlanTier,
  StudentProfile,
  TrackedApplication,
} from '../types';

interface AlertsViewProps {
  opportunities: Opportunity[];
  tracker: TrackedApplication[];
  profile: StudentProfile;
  plan: PlanTier;
  onSelectOpportunity: (opp: Opportunity) => void;
  onUpgradeClick: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  opportunities,
  tracker,
  profile,
  plan,
  onSelectOpportunity,
  onUpgradeClick,
}) => {
  const trackedDeadlines = useMemo(() => {
    const trackedIds = new Set(tracker.map((t) => t.opportunityId));
    return opportunities
      .filter((o) => trackedIds.has(o.id))
      .map((opp) => ({
        opp,
        urgency: getDeadlineUrgency(opp.deadline),
        status: tracker.find((t) => t.opportunityId === opp.id)?.status ?? 'Saved',
      }))
      .sort(
        (a, b) =>
          new Date(a.opp.deadline).getTime() -
          new Date(b.opp.deadline).getTime()
      );
  }, [opportunities, tracker]);

  const urgentFeedMatches = useMemo(() => {
    return opportunities
      .map((opp) => ({
        opp,
        urgency: getDeadlineUrgency(opp.deadline),
        match: calculateMatch(profile, opp),
      }))
      .filter(
        ({ urgency }) =>
          urgency.tier === 'urgent48h' || urgency.tier === 'soon7d'
      )
      .sort(
        (a, b) =>
          new Date(a.opp.deadline).getTime() -
          new Date(b.opp.deadline).getTime()
      );
  }, [opportunities, profile]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-xs sm:text-sm font-medium text-[#0F766E]">
          48-hour & 7-day urgency watch
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Deadline Alerts
        </h1>
      </div>

      {/* Tracked Opportunities Deadlines */}
      <section className="space-y-3" aria-labelledby="tracked-alerts-heading">
        <div className="flex items-center justify-between">
          <h2
            id="tracked-alerts-heading"
            className="font-display text-lg font-bold text-slate-900 flex items-center gap-2"
          >
            <Bell className="w-4 h-4 text-[#1E3A8A]" />
            Your saved & tracked deadlines
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {trackedDeadlines.length} active
          </span>
        </div>

        {trackedDeadlines.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No saved opportunities yet. Save any role in your feed to receive deadline tracking here.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-200">
            {trackedDeadlines.map(({ opp, urgency, status }) => {
              const isUrgent = urgency.tier === 'urgent48h';
              const isSoon = urgency.tier === 'soon7d';
              const formattedDate = new Date(opp.deadline).toLocaleDateString(
                'en-IN',
                { day: 'numeric', month: 'short' }
              );

              return (
                <button
                  key={opp.id}
                  type="button"
                  onClick={() => onSelectOpportunity(opp)}
                  className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                      <span
                        className={`inline-flex items-center gap-1 tabular-nums ${
                          isUrgent
                            ? 'text-red-600'
                            : isSoon
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {isUrgent ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {urgency.label}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-slate-600">Status: {status}</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {opp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {opp.organization} · {opp.location}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                      Due {formattedDate}
                    </p>
                    <p className="text-xs text-[#1E3A8A] font-medium mt-0.5">
                      Open checklist →
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Plus Automated Radar */}
      <section className="space-y-3" aria-labelledby="closing-radar-heading">
        <div className="flex items-center justify-between">
          <h2
            id="closing-radar-heading"
            className="font-display text-lg font-bold text-slate-900"
          >
            All opportunities closing within 7 days
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {urgentFeedMatches.length} listings
          </span>
        </div>

        {plan === 'free' ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Priority 48h & 7-day Match Alerts (CampusBridge Plus)
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {urgentFeedMatches.length} verified opportunities are closing this week. Upgrade to Plus (₹99/month) to see personalized Match % urgency alerts before applications close.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onUpgradeClick}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] cursor-pointer"
            >
              Upgrade to Plus (₹99/mo)
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-200">
            {urgentFeedMatches.map(({ opp, urgency, match }) => {
              const isUrgent = urgency.tier === 'urgent48h';
              return (
                <button
                  key={opp.id}
                  type="button"
                  onClick={() => onSelectOpportunity(opp)}
                  className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                      <span
                        className={`inline-flex items-center gap-1 tabular-nums ${
                          isUrgent ? 'text-red-600' : 'text-amber-700'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {urgency.label}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-mono text-[#1E3A8A] tabular-nums">
                        {match.score}% Match
                      </span>
                      {opp.verified && (
                        <>
                          <span className="text-slate-300" aria-hidden="true">
                            ·
                          </span>
                          <span className="inline-flex items-center gap-1 text-[#0F766E]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {opp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {opp.organization} · {opp.stipend}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#1E3A8A] shrink-0">
                    Review & apply →
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
