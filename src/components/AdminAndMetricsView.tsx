import React, { useState } from 'react';
import { Check, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import {
  OPPORTUNITY_TYPES,
  SKILL_OPTIONS,
} from '../data/sampleOpportunities';
import {
  BetaMetrics,
  LocationType,
  Opportunity,
  OpportunityType,
} from '../types';

interface AdminAndMetricsViewProps {
  metrics: BetaMetrics;
  opportunities: Opportunity[];
  onAddOpportunity: (newOpp: Opportunity) => void;
  onDeleteOpportunity: (id: string) => void;
}

export const AdminAndMetricsView: React.FC<AdminAndMetricsViewProps> = ({
  metrics,
  opportunities,
  onAddOpportunity,
  onDeleteOpportunity,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'admin'>('metrics');

  // Admin form state
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [type, setType] = useState<OpportunityType>('Internship');
  const [location, setLocation] = useState<LocationType>('Dehradun');
  const [locationDetail, setLocationDetail] = useState('Rajpur Road, Dehradun');
  const [skills, setSkills] = useState<string[]>(['Marketing', 'Data Analysis']);
  const [stipend, setStipend] = useState('₹15,000 / month');
  const [deadlineDate, setDeadlineDate] = useState(() => {
    const d = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  });
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState(
    'MBA / Final-year students in Dehradun'
  );
  const [howToApply, setHowToApply] = useState(
    'Submit updated resume via official source link'
  );
  const [sourceLink, setSourceLink] = useState('https://');

  // Verification checklist (all 3 required for Verified badge)
  const [sourceConfirmed, setSourceConfirmed] = useState(false);
  const [organizationChecked, setOrganizationChecked] = useState(false);
  const [deadlineValid, setDeadlineValid] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const allChecked = sourceConfirmed && organizationChecked && deadlineValid;

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    const newOpp: Opportunity = {
      id: `opp-admin-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      type,
      location,
      locationDetail: locationDetail.trim() || location,
      skills: skills.length > 0 ? skills : ['Marketing'],
      domainTags: ['Startups', 'Consulting'],
      stipend: stipend.trim() || 'Unpaid · Certificate',
      deadline: new Date(`${deadlineDate}T23:59:00`).toISOString(),
      postedAt: new Date().toISOString(),
      verified: allChecked,
      verificationChecklist: {
        sourceConfirmed,
        organizationChecked,
        deadlineValid,
      },
      isSample: false,
      description:
        description.trim() ||
        'Verified opportunity published via CampusBridge Admin.',
      eligibility: eligibility.trim(),
      howToApply: howToApply.trim(),
      sourceLink: sourceLink.trim() || 'https://campusbridge.example.in',
    };

    onAddOpportunity(newOpp);
    setTitle('');
    setOrganization('');
    setDescription('');
    setSourceConfirmed(false);
    setOrganizationChecked(false);
    setDeadlineValid(false);
    setSubmitMessage(
      allChecked
        ? 'Published to feed with Verified badge.'
        : 'Published as Pending Check (tick all 3 verification boxes for Verified badge).'
    );
    setTimeout(() => setSubmitMessage(''), 4000);
  };

  const betaUserPct = Math.min(100, Math.round((metrics.betaUsers / 50) * 100));
  const wauPct = Math.min(
    100,
    Math.round((metrics.weeklyActiveRate / 30) * 100)
  );
  const paidPct = Math.min(100, Math.round((metrics.plusSignups / 5) * 100));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#0F766E]">
            Founder console (password-less demo toggle)
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Beta Metrics & Admin Verification
          </h1>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-200/70 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Beta Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin Publisher
          </button>
        </div>
      </div>

      {activeTab === 'metrics' ? (
        <div className="space-y-6">
          {/* Founder KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">Beta Users</p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {metrics.betaUsers}
                </span>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  Target: 50
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#1E3A8A] rounded-full"
                  style={{ width: `${betaUserPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 tabular-nums">
                {betaUserPct}% of DGU pilot goal
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">
                Weekly Active %
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-[#0F766E] tabular-nums">
                  {metrics.weeklyActiveRate}%
                </span>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  Target: 30%
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#14B8A6] rounded-full"
                  style={{ width: `${wauPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#0F766E] font-medium">
                Target exceeded (+{metrics.weeklyActiveRate - 30}% pts)
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">
                Applications Made
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {metrics.applicationsMade}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Live actions
                </span>
              </div>
              <p className="mt-5 text-xs text-slate-500">
                Updates when students click Apply & Track in the feed
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">
                Plus Upgrade Clicks / Paid
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-[#1E3A8A] tabular-nums">
                  {metrics.plusClicks}
                  <span className="text-base font-normal text-slate-400 mx-1">
                    /
                  </span>
                  {metrics.plusSignups}
                </span>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  Target: 5 paid
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#1E3A8A] rounded-full"
                  style={{ width: `${paidPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 tabular-nums">
                {metrics.plusClicks} intent clicks · {metrics.plusSignups} UPI demo sign-ups
              </p>
            </div>
          </div>

          {/* Validation Summary Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-display text-base font-bold text-slate-900">
                DGU Venture Quest Milestone Scorecard
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-6 font-semibold">Metric</th>
                    <th className="py-3 px-6 font-semibold text-right">
                      Current
                    </th>
                    <th className="py-3 px-6 font-semibold text-right">
                      MVP Target
                    </th>
                    <th className="py-3 px-6 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      Registered Beta Students
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums">
                      {metrics.betaUsers}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums text-slate-500">
                      50
                    </td>
                    <td className="py-3.5 px-6 text-xs font-semibold text-[#1E3A8A]">
                      In progress ({50 - Math.min(50, metrics.betaUsers)} to go)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      Weekly Active Engagement
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums">
                      {metrics.weeklyActiveRate}%
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums text-slate-500">
                      30%
                    </td>
                    <td className="py-3.5 px-6 text-xs font-semibold text-[#0F766E]">
                      On target
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      Willingness-to-Pay (Plus Clicks)
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums">
                      {metrics.plusClicks}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums text-slate-500">
                      15
                    </td>
                    <td className="py-3.5 px-6 text-xs font-semibold text-slate-600">
                      Tracking live clicks
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      Simulated Paid Sign-ups (₹99/mo)
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums">
                      {metrics.plusSignups}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums text-slate-500">
                      5
                    </td>
                    <td className="py-3.5 px-6 text-xs font-semibold text-[#1E3A8A]">
                      {metrics.plusSignups >= 5
                        ? 'Target reached'
                        : `${5 - metrics.plusSignups} remaining`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Publish Form */}
          <form
            onSubmit={handlePublish}
            className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-5"
          >
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Add new opportunity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All three verification checks must be ticked before the listing displays the Verified badge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-title"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Opportunity title
                </label>
                <input
                  id="admin-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Business Analyst Intern"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-org"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Organization
                </label>
                <input
                  id="admin-org"
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g., Dehradun FinTech Labs"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="admin-type"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Type
                </label>
                <select
                  id="admin-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as OpportunityType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  {OPPORTUNITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="admin-loc"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Location bucket
                </label>
                <select
                  id="admin-loc"
                  value={location}
                  onChange={(e) => setLocation(e.target.value as LocationType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Dehradun">Dehradun</option>
                  <option value="Remote">Remote</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="admin-deadline"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Deadline
                </label>
                <input
                  id="admin-deadline"
                  type="date"
                  required
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-stipend"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Stipend / Compensation
                </label>
                <input
                  id="admin-stipend"
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="₹15,000 / month"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-source"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Source link
                </label>
                <input
                  id="admin-source"
                  type="url"
                  value={sourceLink}
                  onChange={(e) => setSourceLink(e.target.value)}
                  placeholder="https://company.com/careers"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-loc-detail"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Specific location / mode
              </label>
              <input
                id="admin-loc-detail"
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="Rajpur Road, Dehradun (Hybrid)"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_OPTIONS.map((skill) => {
                  const active = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                        active
                          ? 'bg-[#0F766E] text-white border-[#0F766E]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-desc"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="admin-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key responsibilities, duration, and learning outcomes..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-elig"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Eligibility
                </label>
                <input
                  id="admin-elig"
                  type="text"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-apply"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  How to apply
                </label>
                <input
                  id="admin-apply"
                  type="text"
                  value={howToApply}
                  onChange={(e) => setHowToApply(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Verification checklist
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    allChecked ? 'text-[#0F766E]' : 'text-amber-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {allChecked
                    ? 'Ready for Verified badge'
                    : 'Tick all 3 to verify'}
                </span>
              </div>

              <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sourceConfirmed}
                  onChange={(e) => setSourceConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1E3A8A]"
                />
                Source confirmed (official company page / DGU placement desk)
              </label>

              <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={organizationChecked}
                  onChange={(e) => setOrganizationChecked(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1E3A8A]"
                />
                Organization checked (legitimate employer, zero registration fee)
              </label>

              <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deadlineValid}
                  onChange={(e) => setDeadlineValid(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1E3A8A]"
                />
                Deadline valid and application link tested
              </label>
            </div>

            {submitMessage && (
              <p className="text-xs sm:text-sm font-medium text-[#0F766E]">
                {submitMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {allChecked
                ? 'Publish Verified Opportunity'
                : 'Publish without Verified Badge'}
            </button>
          </form>

          {/* Existing Listings Manager */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-slate-900">
                Active listings ({opportunities.length})
              </h2>
              <span className="text-xs text-slate-500">Latest first</span>
            </div>
            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs mb-0.5">
                      {opp.verified ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#0F766E]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="font-medium text-amber-700">
                          Unverified
                        </span>
                      )}
                      <span className="text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-slate-500">{opp.type}</span>
                    </div>
                    <p className="font-display text-sm font-bold text-slate-900 truncate">
                      {opp.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {opp.organization} · {opp.location}
                    </p>
                  </div>
                  {!opp.isSample && (
                    <button
                      type="button"
                      onClick={() => onDeleteOpportunity(opp.id)}
                      aria-label={`Delete ${opp.title}`}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
