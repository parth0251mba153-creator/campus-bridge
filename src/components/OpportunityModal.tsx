import React from 'react';
import {
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Lock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { getDeadlineUrgency } from '../data/sampleOpportunities';
import {
  ApplicationStatus,
  MatchResult,
  Opportunity,
  PlanTier,
} from '../types';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  match: MatchResult | null;
  plan: PlanTier;
  currentStatus: ApplicationStatus | null;
  onClose: () => void;
  onSaveToTracker: (opportunityId: string) => void;
  onMarkApplied: (opportunityId: string) => void;
  onUpgradeClick: () => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  opportunity,
  match,
  plan,
  currentStatus,
  onClose,
  onSaveToTracker,
  onMarkApplied,
  onUpgradeClick,
}) => {
  if (!opportunity || !match) return null;

  const urgency = getDeadlineUrgency(opportunity.deadline);
  const formattedDate = new Date(opportunity.deadline).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="opp-detail-title"
    >
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Drag affordance on mobile */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 shrink-0" />

        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-500 mb-1.5">
              <span>{opportunity.type}</span>
              <span aria-hidden="true">·</span>
              <span>{opportunity.locationDetail}</span>
              {opportunity.verified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[#0F766E] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </>
              )}
            </div>
            <h2
              id="opp-detail-title"
              className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug"
            >
              {opportunity.title}
            </h2>
            <p className="text-sm font-medium text-slate-700 mt-1">
              {opportunity.organization}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close opportunity details"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key figures strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-200">
            <div>
              <p className="text-xs text-slate-500">Compensation / Reward</p>
              <p className="font-mono text-sm font-semibold text-slate-900 mt-0.5 tabular-nums">
                {opportunity.stipend}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Application deadline</p>
              <p
                className={`text-sm font-semibold mt-0.5 tabular-nums ${
                  urgency.tier === 'urgent48h'
                    ? 'text-red-600'
                    : urgency.tier === 'soon7d'
                    ? 'text-amber-700'
                    : 'text-slate-900'
                }`}
              >
                {formattedDate} ({urgency.label})
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Profile match</p>
              {plan === 'plus' ? (
                <p className="font-mono text-sm font-bold text-[#1E3A8A] mt-0.5 tabular-nums">
                  {match.score}% Match ({match.matchedSkills.length}/
                  {opportunity.skills.length} skills)
                </p>
              ) : (
                <button
                  type="button"
                  onClick={onUpgradeClick}
                  className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {match.matchedSkills.length} skills overlap · Unlock %
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900 mb-2">
              Role & Scope
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Eligibility & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 mb-2">
                Eligibility
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {opportunity.eligibility}
              </p>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 mb-2">
                Required skills
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {opportunity.skills.map((skill, idx) => {
                  const isMatched = match.matchedSkills.includes(skill);
                  return (
                    <React.Fragment key={skill}>
                      {idx > 0 && (
                        <span className="text-slate-400 mx-1.5" aria-hidden="true">
                          ·
                        </span>
                      )}
                      <span
                        className={
                          isMatched
                            ? 'font-semibold text-[#0F766E]'
                            : 'text-slate-700'
                        }
                      >
                        {skill}
                        {isMatched && plan === 'plus' ? ' (Matched)' : ''}
                      </span>
                    </React.Fragment>
                  );
                })}
              </p>
            </div>
          </div>

          {/* How to apply & Verification provenance */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                How to apply
              </h3>
              <p className="text-sm text-slate-700 mt-1">
                {opportunity.howToApply}
              </p>
              <a
                href={opportunity.sourceLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:underline mt-2"
              >
                Open verified source link
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                Verification checks:
              </span>
              <span>
                {opportunity.verificationChecklist.sourceConfirmed ? '✓' : '—'}{' '}
                Source confirmed
              </span>
              <span>
                {opportunity.verificationChecklist.organizationChecked
                  ? '✓'
                  : '—'}{' '}
                Organization checked
              </span>
              <span>
                {opportunity.verificationChecklist.deadlineValid ? '✓' : '—'}{' '}
                Deadline valid
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {currentStatus
              ? `Tracker status: ${currentStatus}`
              : 'Not in your Application Tracker yet'}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSaveToTracker(opportunity.id)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Bookmark className="w-4 h-4" />
              {currentStatus ? 'Saved in tracker' : 'Save to tracker'}
            </button>
            <button
              type="button"
              onClick={() => onMarkApplied(opportunity.id)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] transition-colors cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              {currentStatus === 'Applied' ? 'Applied' : 'Apply & Track'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
