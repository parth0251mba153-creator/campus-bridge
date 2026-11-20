import React, { useState } from 'react';
import { Check, LogOut, RotateCcw, ShieldCheck } from 'lucide-react';
import {
  DEHRADUN_COLLEGES,
  INTEREST_OPTIONS,
  OPPORTUNITY_TYPES,
  SKILL_OPTIONS,
} from '../data/sampleOpportunities';
import {
  CourseType,
  OpportunityType,
  PlanTier,
  StudentProfile,
  YearType,
} from '../types';

interface ProfileViewProps {
  profile: StudentProfile;
  plan: PlanTier;
  isOnboardingMode?: boolean;
  onSaveProfile: (updated: StudentProfile) => void;
  onUpgradeClick: () => void;
  onSwitchPlanForDemo: (tier: PlanTier) => void;
  onSignOut: () => void;
  onResetDemo: () => void;
}

const COURSES: CourseType[] = ['MBA', 'BBA', 'B.Tech', 'BCA', 'Other'];
const YEARS: YearType[] = ['1st', '2nd', '3rd', 'Final'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  plan,
  isOnboardingMode = false,
  onSaveProfile,
  onUpgradeClick,
  onSwitchPlanForDemo,
  onSignOut,
  onResetDemo,
}) => {
  const [form, setForm] = useState<StudentProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  const toggleSkill = (skill: string) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill],
      };
    });
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const toggleType = (type: OpportunityType) => {
    setForm((prev) => {
      const exists = prev.opportunityTypes.includes(type);
      return {
        ...prev,
        opportunityTypes: exists
          ? prev.opportunityTypes.filter((t) => t !== type)
          : [...prev.opportunityTypes, type],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({ ...form, onboarded: true });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {isOnboardingMode ? 'Set up your student profile' : 'Student Profile'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isOnboardingMode
              ? 'Tell us your course, skills, and goals so CampusBridge can rank verified opportunities for you.'
              : 'Your skills and preferred opportunity types power the rule-based Match % across your feed.'}
          </p>
        </div>

        {!isOnboardingMode && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Plan Status Card (Hidden during initial onboarding to keep focus) */}
      {!isOnboardingMode && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#0F766E]">
              Current membership
            </p>
            <h2 className="font-display text-lg font-bold text-slate-900 mt-0.5">
              {plan === 'plus' ? 'CampusBridge Plus (Active)' : 'Free Student Plan'}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {plan === 'plus'
                ? 'Full Match % scoring, 48h deadline reminders, and unlimited application tracker unlocked.'
                : 'Basic feed active. Upgrade for ₹99/month to unlock exact Match %, deadline alerts, and unlimited tracking.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {plan === 'free' ? (
              <button
                type="button"
                onClick={onUpgradeClick}
                className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] transition-colors cursor-pointer whitespace-nowrap"
              >
                Upgrade to Plus (₹99/mo)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSwitchPlanForDemo('free')}
                className="px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Switch to Free (Demo)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Onboarding / Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Full name
            </label>
            <input
              id="profile-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Aarav Rawat"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A]"
            />
          </div>

          <div>
            <label
              htmlFor="profile-college"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              College / University
            </label>
            <input
              id="profile-college"
              type="text"
              list="dehradun-colleges"
              required
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              placeholder="DBS Global University (DGU)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A]"
            />
            <datalist id="dehradun-colleges">
              {DEHRADUN_COLLEGES.map((col) => (
                <option key={col} value={col} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-2">
              Course
            </span>
            <div className="flex flex-wrap gap-2">
              {COURSES.map((course) => (
                <button
                  key={course}
                  type="button"
                  onClick={() => setForm({ ...form, course })}
                  className={`px-3.5 py-2 min-h-[40px] rounded-xl text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    form.course === course
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-2">
              Academic year
            </span>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setForm({ ...form, year })}
                  className={`px-3.5 py-2 min-h-[40px] rounded-xl text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    form.year === year
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {year} Year
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-select Skills */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-semibold text-slate-800">
              Your skills (select all that apply)
            </span>
            <span className="text-xs text-slate-500 tabular-nums">
              {form.skills.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => {
              const active = form.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#0F766E] text-white border-[#0F766E]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-select Domain Interests */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-semibold text-slate-800">
              Industry interests
            </span>
            <span className="text-xs text-slate-500 tabular-nums">
              {form.interests.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const active = form.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Opportunity Types Wanted */}
        <div>
          <span className="block text-sm font-semibold text-slate-800 mb-2">
            Opportunity types wanted
          </span>
          <div className="flex flex-wrap gap-2">
            {OPPORTUNITY_TYPES.map((type) => {
              const active = form.opportunityTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Career Goal */}
        <div>
          <label
            htmlFor="career-goal"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            Target career goal
          </label>
          <input
            id="career-goal"
            type="text"
            value={form.careerGoal}
            onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
            placeholder="e.g., Product Marketing or Financial Analyst role after MBA"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A]"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            <span>Profile preferences stay saved locally in your browser.</span>
          </div>

          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="text-sm font-medium text-[#0F766E]">
                Profile updated
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-3 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] transition-colors cursor-pointer whitespace-nowrap"
            >
              {isOnboardingMode ? 'Save & Open Personalized Feed' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>

      {!isOnboardingMode && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 py-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset local prototype data
          </button>
        </div>
      )}
    </div>
  );
};
