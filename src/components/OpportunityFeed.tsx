import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  Check,
  Clock,
  Lock,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import {
  calculateMatch,
  getDeadlineUrgency,
  OPPORTUNITY_TYPES,
  SKILL_OPTIONS,
} from '../data/sampleOpportunities';
import {
  LocationType,
  Opportunity,
  OpportunityType,
  PlanTier,
  StudentProfile,
  TrackedApplication,
} from '../types';

interface OpportunityFeedProps {
  opportunities: Opportunity[];
  profile: StudentProfile;
  plan: PlanTier;
  tracker: TrackedApplication[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onQuickSave: (oppId: string) => void;
  onUpgradeClick: () => void;
}

type SortOption = 'best_match' | 'deadline_soonest' | 'newest';
type DeadlineFilter = 'all' | '48h' | '7d' | '30d';

export const OpportunityFeed: React.FC<OpportunityFeedProps> = ({
  opportunities,
  profile,
  plan,
  tracker,
  onSelectOpportunity,
  onQuickSave,
  onUpgradeClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<LocationType | 'All'>(
    'All'
  );
  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('best_match');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const trackerMap = useMemo(() => {
    const map = new Map<string, TrackedApplication>();
    tracker.forEach((t) => map.set(t.opportunityId, t));
    return map;
  }, [tracker]);

  const enriched = useMemo(() => {
    return opportunities.map((opp) => ({
      opp,
      match: calculateMatch(profile, opp),
      urgency: getDeadlineUrgency(opp.deadline),
    }));
  }, [opportunities, profile]);

  // Closing soon (within 7 days, non-expired)
  const closingSoonItems = useMemo(() => {
    return enriched
      .filter(
        ({ urgency }) =>
          urgency.tier === 'urgent48h' || urgency.tier === 'soon7d'
      )
      .sort(
        (a, b) =>
          new Date(a.opp.deadline).getTime() -
          new Date(b.opp.deadline).getTime()
      );
  }, [enriched]);

  // Filtered and sorted list
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return enriched
      .filter(({ opp, urgency }) => {
        if (q) {
          const haystack = `${opp.title} ${opp.organization} ${opp.skills.join(
            ' '
          )} ${opp.locationDetail}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        if (typeFilter !== 'All' && opp.type !== typeFilter) return false;
        if (locationFilter !== 'All' && opp.location !== locationFilter)
          return false;
        if (skillFilter !== 'All' && !opp.skills.includes(skillFilter))
          return false;
        if (deadlineFilter === '48h' && urgency.tier !== 'urgent48h')
          return false;
        if (
          deadlineFilter === '7d' &&
          urgency.tier !== 'urgent48h' &&
          urgency.tier !== 'soon7d'
        )
          return false;
        if (deadlineFilter === '30d' && urgency.daysLeft > 30) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'best_match') {
          return b.match.score - a.match.score;
        }
        if (sortBy === 'deadline_soonest') {
          return (
            new Date(a.opp.deadline).getTime() -
            new Date(b.opp.deadline).getTime()
          );
        }
        return (
          new Date(b.opp.postedAt).getTime() -
          new Date(a.opp.postedAt).getTime()
        );
      });
  }, [
    enriched,
    searchQuery,
    typeFilter,
    locationFilter,
    skillFilter,
    deadlineFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setLocationFilter('All');
    setSkillFilter('All');
    setDeadlineFilter('all');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#0F766E]">
            Personalized for {profile.name} · {profile.course} ({profile.year}{' '}
            Year) · Sample MVP data
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Verified Opportunity Feed
          </h1>
        </div>

        {plan === 'free' && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-xs sm:text-sm font-semibold hover:bg-[#172D6E] transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Lock className="w-4 h-4" />
            Unlock exact Match % (₹99/mo)
          </button>
        )}
      </div>

      {/* Closing Soon Section (Within 7 Days) */}
      {closingSoonItems.length > 0 && (
        <section aria-labelledby="closing-soon-heading">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <h2
                id="closing-soon-heading"
                className="font-display text-base sm:text-lg font-bold text-slate-900"
              >
                Closing soon (within 7 days)
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {closingSoonItems.length} deadlines
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {closingSoonItems.slice(0, 3).map(({ opp, urgency }) => {
              const isUrgent = urgency.tier === 'urgent48h';
              return (
                <button
                  key={opp.id}
                  type="button"
                  onClick={() => onSelectOpportunity(opp)}
                  className={`text-left rounded-2xl border p-4 transition-colors cursor-pointer ${
                    isUrgent
                      ? 'bg-red-50/70 border-red-200 hover:border-red-300'
                      : 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 tabular-nums ${
                        isUrgent ? 'text-red-700' : 'text-amber-800'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {urgency.label}
                    </span>
                    <span className="text-slate-600">{opp.type}</span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-900 line-clamp-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">
                    {opp.organization} · {opp.location}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Search, Filters & Sort Controls */}
      <section
        aria-label="Search and filter opportunities"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role, company, Dehradun area, or skill..."
              aria-label="Search opportunities"
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFiltersMobile((v) => !v)}
              className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <label htmlFor="sort-select" className="sr-only">
              Sort opportunities
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 cursor-pointer"
            >
              <option value="best_match">Sort: Best match</option>
              <option value="deadline_soonest">Sort: Deadline soonest</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </div>

        {/* Filter Row */}
        <div
          className={`${
            showFiltersMobile ? 'block' : 'hidden'
          } sm:block pt-2 border-t border-slate-100 space-y-3`}
        >
          {/* Type segmented filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', ...OPPORTUNITY_TYPES] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  typeFilter === type
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="location-filter"
                className="block text-xs font-medium text-slate-500 mb-1"
              >
                Location
              </label>
              <select
                id="location-filter"
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(e.target.value as LocationType | 'All')
                }
                className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 cursor-pointer"
              >
                <option value="All">All locations</option>
                <option value="Dehradun">Dehradun</option>
                <option value="Remote">Remote</option>
                <option value="Other">Other (NCR / Hybrid)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="skill-filter"
                className="block text-xs font-medium text-slate-500 mb-1"
              >
                Skill
              </label>
              <select
                id="skill-filter"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 cursor-pointer"
              >
                <option value="All">All skills</option>
                {SKILL_OPTIONS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="deadline-filter"
                className="block text-xs font-medium text-slate-500 mb-1"
              >
                Deadline window
              </label>
              <select
                id="deadline-filter"
                value={deadlineFilter}
                onChange={(e) =>
                  setDeadlineFilter(e.target.value as DeadlineFilter)
                }
                className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 cursor-pointer"
              >
                <option value="all">Any deadline</option>
                <option value="48h">Urgent (under 48 hours)</option>
                <option value="7d">Closing this week (under 7 days)</option>
                <option value="30d">Within 30 days</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
        <span className="tabular-nums">
          Showing {filteredItems.length} of {opportunities.length} listings
        </span>
        {(searchQuery ||
          typeFilter !== 'All' ||
          locationFilter !== 'All' ||
          skillFilter !== 'All' ||
          deadlineFilter !== 'all') && (
          <button
            type="button"
            onClick={resetFilters}
            className="font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Opportunity Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h3 className="font-display text-lg font-bold text-slate-900">
            No matching opportunities found
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Try clearing one of your active filters or broadening your location selection.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredItems.map(({ opp, match, urgency }) => {
            const tracked = trackerMap.get(opp.id);
            const isUrgent = urgency.tier === 'urgent48h';
            const isSoon = urgency.tier === 'soon7d';

            return (
              <article
                key={opp.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  {/* Title + Verification */}
                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => onSelectOpportunity(opp)}
                      className="text-left font-display text-lg font-bold text-slate-900 hover:text-[#1E3A8A] transition-colors leading-snug cursor-pointer"
                    >
                      {opp.title}
                    </button>
                    {opp.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] whitespace-nowrap shrink-0 pt-0.5">
                        <ShieldCheck className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-700 whitespace-nowrap shrink-0 pt-0.5">
                        Pending check
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {opp.organization}
                  </p>

                  {/* Unboxed Typographic Metadata */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-500">
                    <span className="text-slate-700 font-medium">{opp.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{opp.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-800 font-medium tabular-nums">
                      {opp.stipend}
                    </span>
                  </div>

                  {/* Required Skills (clean inline text, matched highlighted) */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <span className="text-slate-400 mr-1.5">Skills:</span>
                    {opp.skills.map((skill, idx) => {
                      const isMatched = match.matchedSkills.includes(skill);
                      return (
                        <React.Fragment key={skill}>
                          {idx > 0 && (
                            <span
                              className="text-slate-300 mx-1.5"
                              aria-hidden="true"
                            >
                              ·
                            </span>
                          )}
                          <span
                            className={
                              isMatched
                                ? 'font-semibold text-[#0F766E]'
                                : 'text-slate-600'
                            }
                          >
                            {skill}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </p>
                </div>

                {/* Footer Row: Match %, Urgency, Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                    {plan === 'plus' ? (
                      <span className="font-mono font-bold text-[#1E3A8A] tabular-nums">
                        {match.score}% Match
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={onUpgradeClick}
                        className="inline-flex items-center gap-1 font-medium text-[#1E3A8A] hover:underline cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {match.matchedSkills.length} skill match · Unlock %
                        </span>
                      </button>
                    )}

                    <span className="text-slate-300" aria-hidden="true">
                      ·
                    </span>

                    <span
                      className={`font-medium tabular-nums ${
                        isUrgent
                          ? 'text-red-600'
                          : isSoon
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {urgency.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onQuickSave(opp.id)}
                      aria-label={
                        tracked ? 'Saved in tracker' : 'Save to tracker'
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        tracked
                          ? 'border-[#0F766E]/30 bg-teal-50 text-[#0F766E]'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tracked ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          {tracked.status}
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          Save
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectOpportunity(opp)}
                      className="px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
