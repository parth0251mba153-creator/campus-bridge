import React, { useMemo, useState } from 'react';
import { Lock, Trash2 } from 'lucide-react';
import { getDeadlineUrgency } from '../data/sampleOpportunities';
import {
  ApplicationStatus,
  Opportunity,
  PlanTier,
  TrackedApplication,
} from '../types';

interface ApplicationTrackerProps {
  opportunities: Opportunity[];
  tracker: TrackedApplication[];
  plan: PlanTier;
  onUpdateStatus: (opportunityId: string, status: ApplicationStatus) => void;
  onRemoveItem: (opportunityId: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  onUpgradeClick: () => void;
  onExploreFeed: () => void;
}

const STATUSES: ApplicationStatus[] = [
  'Saved',
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  opportunities,
  tracker,
  plan,
  onUpdateStatus,
  onRemoveItem,
  onSelectOpportunity,
  onUpgradeClick,
  onExploreFeed,
}) => {
  const [mobileStatus, setMobileStatus] = useState<ApplicationStatus>('Saved');

  const oppMap = useMemo(() => {
    const map = new Map<string, Opportunity>();
    opportunities.forEach((o) => map.set(o.id, o));
    return map;
  }, [opportunities]);

  const grouped = useMemo(() => {
    const groups: Record<
      ApplicationStatus,
      Array<{ tracked: TrackedApplication; opp: Opportunity }>
    > = {
      Saved: [],
      Applied: [],
      Interview: [],
      Offer: [],
      Rejected: [],
    };
    tracker.forEach((item) => {
      const opp = oppMap.get(item.opportunityId);
      if (opp) {
        groups[item.status].push({ tracked: item, opp });
      }
    });
    return groups;
  }, [tracker, oppMap]);

  const renderCard = (tracked: TrackedApplication, opp: Opportunity) => {
    const urgency = getDeadlineUrgency(opp.deadline);
    return (
      <div
        key={opp.id}
        className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
      >
        <div>
          <button
            type="button"
            onClick={() => onSelectOpportunity(opp)}
            className="text-left font-display text-sm font-bold text-slate-900 hover:text-[#1E3A8A] transition-colors leading-snug cursor-pointer"
          >
            {opp.title}
          </button>
          <p className="text-xs text-slate-600 mt-0.5">{opp.organization}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span>{opp.type}</span>
          <span aria-hidden="true">·</span>
          <span
            className={`font-medium tabular-nums ${
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

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <label htmlFor={`status-${opp.id}`} className="sr-only">
            Change application status for {opp.title}
          </label>
          <select
            id={`status-${opp.id}`}
            value={tracked.status}
            onChange={(e) =>
              onUpdateStatus(opp.id, e.target.value as ApplicationStatus)
            }
            className="flex-1 px-2.5 py-1.5 min-h-[36px] rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Move to: {s}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onRemoveItem(opp.id)}
            aria-label={`Remove ${opp.title} from tracker`}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#0F766E]">
            Saved → Applied → Interview → Offer / Rejected
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Application Tracker
          </h1>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 tabular-nums">
          {tracker.length} tracked{plan === 'free' ? ' (Free limit: 2)' : ''}
        </div>
      </div>

      {/* Free Plan Notice */}
      {plan === 'free' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Free Tracker Preview (up to 2 applications)
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Upgrade to CampusBridge Plus (₹99/month) to track unlimited internships, placements, and interview stages.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onUpgradeClick}
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-xs sm:text-sm font-semibold hover:bg-[#172D6E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Unlock Unlimited Tracker
          </button>
        </div>
      )}

      {/* Summary Counts Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setMobileStatus(status)}
            className={`text-left rounded-xl border p-3.5 transition-colors cursor-pointer ${
              mobileStatus === status
                ? 'border-[#1E3A8A] bg-blue-50/50 md:border-slate-200 md:bg-white'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <p className="text-xs font-medium text-slate-500">{status}</p>
            <p className="font-mono text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {grouped[status].length}
            </p>
          </button>
        ))}
      </div>

      {tracker.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Your tracker is empty
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Save internships, competitions, or placements from the Verified Feed to organize deadlines and track interview progress.
          </p>
          <button
            type="button"
            onClick={onExploreFeed}
            className="mt-5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] cursor-pointer"
          >
            Browse Verified Feed
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Tabbed Status View */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-slate-900">
                {mobileStatus} ({grouped[mobileStatus].length})
              </h2>
            </div>
            {grouped[mobileStatus].length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                No applications currently in {mobileStatus}.
              </div>
            ) : (
              <div className="space-y-3">
                {grouped[mobileStatus].map(({ tracked, opp }) =>
                  renderCard(tracked, opp)
                )}
              </div>
            )}
          </div>

          {/* Desktop Kanban Columns */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
            {STATUSES.map((status) => (
              <div
                key={status}
                className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3.5 min-h-[300px]"
              >
                <div className="flex items-center justify-between px-1 pb-3 mb-3 border-b border-slate-200">
                  <h2 className="font-display text-sm font-bold text-slate-900">
                    {status}
                  </h2>
                  <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
                    {grouped[status].length}
                  </span>
                </div>
                <div className="space-y-3">
                  {grouped[status].length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">
                      No items
                    </p>
                  ) : (
                    grouped[status].map(({ tracked, opp }) =>
                      renderCard(tracked, opp)
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
