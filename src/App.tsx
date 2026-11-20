import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookmarkCheck,
  Compass,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AdminAndMetricsView } from './components/AdminAndMetricsView';
import { AlertsView } from './components/AlertsView';
import { ApplicationTracker } from './components/ApplicationTracker';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { OpportunityFeed } from './components/OpportunityFeed';
import { OpportunityModal } from './components/OpportunityModal';
import { ProfileView } from './components/ProfileView';
import { UpgradeModal } from './components/UpgradeModal';
import {
  calculateMatch,
  getDeadlineUrgency,
  SAMPLE_OPPORTUNITIES,
} from './data/sampleOpportunities';
import {
  ApplicationStatus,
  AppView,
  BetaMetrics,
  Opportunity,
  PlanTier,
  StudentProfile,
  TrackedApplication,
} from './types';
import {
  AuthState,
  DEFAULT_METRICS,
  DEFAULT_PROFILE,
  DEFAULT_TRACKER,
  loadAuth,
  loadMetrics,
  loadOpportunities,
  loadPlan,
  loadProfile,
  loadTracker,
  resetAllDemoData,
  saveAuth,
  saveMetrics,
  saveOpportunities,
  savePlan,
  saveProfile,
  saveTracker,
} from './utils/storage';

export default function App() {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth());
  const [profile, setProfile] = useState<StudentProfile>(() => loadProfile());
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    loadOpportunities()
  );
  const [tracker, setTracker] = useState<TrackedApplication[]>(() =>
    loadTracker()
  );
  const [plan, setPlan] = useState<PlanTier>(() => loadPlan());
  const [metrics, setMetrics] = useState<BetaMetrics>(() => loadMetrics());

  const [view, setView] = useState<AppView>(() => {
    const initialAuth = loadAuth();
    const initialProfile = loadProfile();
    if (!initialAuth.isAuthenticated) return 'landing';
    return initialProfile.onboarded ? 'feed' : 'onboarding';
  });

  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  // Sync changes to localStorage
  useEffect(() => saveAuth(auth), [auth]);
  useEffect(() => saveProfile(profile), [profile]);
  useEffect(() => saveOpportunities(opportunities), [opportunities]);
  useEffect(() => saveTracker(tracker), [tracker]);
  useEffect(() => savePlan(plan), [plan]);
  useEffect(() => saveMetrics(metrics), [metrics]);

  // Upcoming tracked deadlines for the Notification Bell
  const trackedBellItems = useMemo(() => {
    const map = new Map(opportunities.map((o) => [o.id, o]));
    return tracker
      .map((item) => {
        const opp = map.get(item.opportunityId);
        if (!opp) return null;
        return {
          opp,
          status: item.status,
          urgency: getDeadlineUrgency(opp.deadline),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort(
        (a, b) =>
          new Date(a.opp.deadline).getTime() -
          new Date(b.opp.deadline).getTime()
      );
  }, [opportunities, tracker]);

  const urgentCount = useMemo(() => {
    return trackedBellItems.filter(
      (i) =>
        i.urgency.tier === 'urgent48h' || i.urgency.tier === 'soon7d'
    ).length;
  }, [trackedBellItems]);

  // Open Upgrade modal & increment Plus interest click counter
  const handleUpgradeClick = () => {
    setMetrics((prev) => ({
      ...prev,
      plusClicks: prev.plusClicks + 1,
    }));
    setUpgradeModalOpen(true);
  };

  const handleCompleteSimulatedPayment = () => {
    setPlan('plus');
    setMetrics((prev) => ({
      ...prev,
      plusSignups: prev.plusSignups + 1,
    }));
  };

  // Auth handlers
  const handleAuthSuccess = (
    mode: 'signup' | 'login',
    name: string,
    email: string
  ) => {
    setAuth({ isAuthenticated: true, email });
    setAuthModalOpen(false);

    if (mode === 'signup') {
      setProfile({
        ...DEFAULT_PROFILE,
        name,
        email,
        skills: [],
        interests: [],
        onboarded: false,
      });
      setMetrics((prev) => ({
        ...prev,
        betaUsers: prev.betaUsers + 1,
      }));
      setView('onboarding');
    } else {
      setProfile((prev) => ({
        ...prev,
        email,
        name: prev.name || name,
        onboarded: true,
      }));
      setView('feed');
    }
  };

  const handleDemoLogin = () => {
    setAuth({
      isAuthenticated: true,
      email: DEFAULT_PROFILE.email,
    });
    if (!profile.onboarded) {
      setProfile(DEFAULT_PROFILE);
    }
    setAuthModalOpen(false);
    setView('feed');
  };

  const handleSignOut = () => {
    setAuth({ isAuthenticated: false, email: '' });
    setBellOpen(false);
    setView('landing');
  };

  const handleResetDemo = () => {
    resetAllDemoData();
    setAuth({ isAuthenticated: true, email: DEFAULT_PROFILE.email });
    setProfile(DEFAULT_PROFILE);
    setOpportunities(SAMPLE_OPPORTUNITIES);
    setTracker(DEFAULT_TRACKER);
    setPlan('free');
    setMetrics(DEFAULT_METRICS);
    setView('feed');
  };

  // Profile save
  const handleSaveProfile = (updated: StudentProfile) => {
    setProfile(updated);
    if (view === 'onboarding') {
      setView('feed');
    }
  };

  // Tracker actions
  const handleSaveToTracker = (opportunityId: string) => {
    const existing = tracker.find((t) => t.opportunityId === opportunityId);
    if (existing) {
      // Toggle off only if already Saved, otherwise keep
      if (existing.status === 'Saved') {
        setTracker((prev) =>
          prev.filter((t) => t.opportunityId !== opportunityId)
        );
      }
      return;
    }

    if (plan === 'free' && tracker.length >= 2) {
      handleUpgradeClick();
      return;
    }

    setTracker((prev) => [
      {
        opportunityId,
        status: 'Saved',
        updatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleMarkApplied = (opportunityId: string) => {
    const existing = tracker.find((t) => t.opportunityId === opportunityId);
    if (!existing && plan === 'free' && tracker.length >= 2) {
      handleUpgradeClick();
      return;
    }

    const wasAlreadyApplied =
      existing &&
      (existing.status === 'Applied' ||
        existing.status === 'Interview' ||
        existing.status === 'Offer');

    if (!wasAlreadyApplied) {
      setMetrics((prev) => ({
        ...prev,
        applicationsMade: prev.applicationsMade + 1,
      }));
    }

    setTracker((prev) => {
      if (existing) {
        return prev.map((t) =>
          t.opportunityId === opportunityId
            ? { ...t, status: 'Applied', updatedAt: new Date().toISOString() }
            : t
        );
      }
      return [
        {
          opportunityId,
          status: 'Applied',
          updatedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const handleUpdateTrackerStatus = (
    opportunityId: string,
    status: ApplicationStatus
  ) => {
    const existing = tracker.find((t) => t.opportunityId === opportunityId);
    if (
      existing &&
      existing.status === 'Saved' &&
      (status === 'Applied' || status === 'Interview' || status === 'Offer')
    ) {
      setMetrics((prev) => ({
        ...prev,
        applicationsMade: prev.applicationsMade + 1,
      }));
    }

    setTracker((prev) =>
      prev.map((t) =>
        t.opportunityId === opportunityId
          ? { ...t, status, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const handleRemoveTrackerItem = (opportunityId: string) => {
    setTracker((prev) => prev.filter((t) => t.opportunityId !== opportunityId));
  };

  // Admin actions
  const handleAddOpportunity = (newOpp: Opportunity) => {
    setOpportunities((prev) => [newOpp, ...prev]);
  };

  const handleDeleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    setTracker((prev) => prev.filter((t) => t.opportunityId !== id));
  };

  const selectedMatch = useMemo(() => {
    if (!selectedOpportunity) return null;
    return calculateMatch(profile, selectedOpportunity);
  }, [profile, selectedOpportunity]);

  const selectedStatus = useMemo(() => {
    if (!selectedOpportunity) return null;
    return (
      tracker.find((t) => t.opportunityId === selectedOpportunity.id)
        ?.status ?? null
    );
  }, [tracker, selectedOpportunity]);

  // Landing Page View
  if (view === 'landing') {
    return (
      <>
        <LandingPage
          sampleOpportunities={opportunities}
          onJoinBeta={() => setAuthModalOpen(true)}
          onDemoLogin={handleDemoLogin}
          onUpgradePlusClick={handleUpgradeClick}
          onOpenMetricsPreview={() => {
            setAuth({
              isAuthenticated: true,
              email: DEFAULT_PROFILE.email,
            });
            setView('admin');
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          onDemoLogin={handleDemoLogin}
        />
        <UpgradeModal
          isOpen={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          onCompleteSimulatedPayment={handleCompleteSimulatedPayment}
          plusClicksCount={metrics.plusClicks}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-20 md:pb-0">
      {/* Sticky Workspace Header (Compact 52px on mobile, 64px on desktop) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-13 md:h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => setView('feed')}
            className="font-display text-lg md:text-xl font-bold tracking-tight text-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            CampusBridge
          </button>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Workspace navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => setView('feed')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                view === 'feed'
                  ? 'text-[#1E3A8A] font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Feed
            </button>
            <button
              type="button"
              onClick={() => setView('tracker')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                view === 'tracker'
                  ? 'text-[#1E3A8A] font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Tracker ({tracker.length})
            </button>
            <button
              type="button"
              onClick={() => setView('alerts')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                view === 'alerts'
                  ? 'text-[#1E3A8A] font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Alerts
            </button>
            <button
              type="button"
              onClick={() => setView('profile')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                view === 'profile' || view === 'onboarding'
                  ? 'text-[#1E3A8A] font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setView('admin')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                view === 'admin'
                  ? 'text-[#1E3A8A] font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Admin & Metrics
            </button>
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setBellOpen((prev) => !prev)}
              aria-label="Open deadline reminders"
              className="relative min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {urgentCount}
                </span>
              )}
            </button>

            {/* Mobile Admin Toggle */}
            <button
              type="button"
              onClick={() => setView('admin')}
              className={`md:hidden px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold border whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'admin'
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Admin
            </button>

            {/* Primary CTA: Plan Status / Upgrade */}
            {plan === 'free' ? (
              <button
                type="button"
                onClick={handleUpgradeClick}
                className="px-3.5 py-2 min-h-[38px] rounded-xl bg-[#1E3A8A] text-white text-xs sm:text-sm font-semibold hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Upgrade Plus
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setView('profile')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl bg-teal-50 text-[#0F766E] border border-[#0F766E]/25 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Plus Active
              </button>
            )}

            {/* Notification Bell Popover */}
            {bellOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-slate-900">
                    Tracked Deadlines
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBellOpen(false);
                      setView('alerts');
                    }}
                    className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    View all alerts
                  </button>
                </div>

                {trackedBellItems.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500">
                    Save any opportunity to track its deadline here.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {trackedBellItems.map(({ opp, status, urgency }) => (
                      <button
                        key={opp.id}
                        type="button"
                        onClick={() => {
                          setBellOpen(false);
                          setSelectedOpportunity(opp);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                          <span
                            className={
                              urgency.tier === 'urgent48h'
                                ? 'text-red-600'
                                : urgency.tier === 'soon7d'
                                ? 'text-amber-700'
                                : 'text-slate-500'
                            }
                          >
                            {urgency.label}
                          </span>
                          <span className="text-slate-400">{status}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {opp.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {opp.organization}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {view === 'onboarding' && (
          <ProfileView
            profile={profile}
            plan={plan}
            isOnboardingMode
            onSaveProfile={handleSaveProfile}
            onUpgradeClick={handleUpgradeClick}
            onSwitchPlanForDemo={setPlan}
            onSignOut={handleSignOut}
            onResetDemo={handleResetDemo}
          />
        )}

        {view === 'feed' && (
          <OpportunityFeed
            opportunities={opportunities}
            profile={profile}
            plan={plan}
            tracker={tracker}
            onSelectOpportunity={setSelectedOpportunity}
            onQuickSave={handleSaveToTracker}
            onUpgradeClick={handleUpgradeClick}
          />
        )}

        {view === 'tracker' && (
          <ApplicationTracker
            opportunities={opportunities}
            tracker={tracker}
            plan={plan}
            onUpdateStatus={handleUpdateTrackerStatus}
            onRemoveItem={handleRemoveTrackerItem}
            onSelectOpportunity={setSelectedOpportunity}
            onUpgradeClick={handleUpgradeClick}
            onExploreFeed={() => setView('feed')}
          />
        )}

        {view === 'alerts' && (
          <AlertsView
            opportunities={opportunities}
            tracker={tracker}
            profile={profile}
            plan={plan}
            onSelectOpportunity={setSelectedOpportunity}
            onUpgradeClick={handleUpgradeClick}
          />
        )}

        {view === 'profile' && (
          <ProfileView
            profile={profile}
            plan={plan}
            onSaveProfile={handleSaveProfile}
            onUpgradeClick={handleUpgradeClick}
            onSwitchPlanForDemo={setPlan}
            onSignOut={handleSignOut}
            onResetDemo={handleResetDemo}
          />
        )}

        {view === 'admin' && (
          <AdminAndMetricsView
            metrics={metrics}
            opportunities={opportunities}
            onAddOpportunity={handleAddOpportunity}
            onDeleteOpportunity={handleDeleteOpportunity}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
          <button
            type="button"
            onClick={() => setView('landing')}
            className="font-medium text-slate-600 hover:text-[#1E3A8A] cursor-pointer"
          >
            View Landing Page
          </button>
          <span>CampusBridge – DGU Venture Quest | Built by Parth Chaturvedi</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation: Feed, Tracker, Alerts, Profile (60px height) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-15 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center"
      >
        <button
          type="button"
          onClick={() => setView('feed')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            view === 'feed' ? 'text-[#1E3A8A]' : 'text-slate-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-0.5">Feed</span>
        </button>

        <button
          type="button"
          onClick={() => setView('tracker')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            view === 'tracker' ? 'text-[#1E3A8A]' : 'text-slate-500'
          }`}
        >
          <BookmarkCheck className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-0.5">Tracker</span>
        </button>

        <button
          type="button"
          onClick={() => setView('alerts')}
          className={`min-h-[44px] flex flex-col items-center justify-center relative cursor-pointer ${
            view === 'alerts' ? 'text-[#1E3A8A]' : 'text-slate-500'
          }`}
        >
          <Bell className="w-5 h-5" />
          {urgentCount > 0 && (
            <span className="absolute top-1 right-1/4 min-w-[14px] h-3.5 px-1 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold flex items-center justify-center tabular-nums">
              {urgentCount}
            </span>
          )}
          <span className="text-[11px] font-medium mt-0.5">Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setView('profile')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            view === 'profile' || view === 'onboarding'
              ? 'text-[#1E3A8A]'
              : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-0.5">Profile</span>
        </button>
      </nav>

      {/* Modals */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        match={selectedMatch}
        plan={plan}
        currentStatus={selectedStatus}
        onClose={() => setSelectedOpportunity(null)}
        onSaveToTracker={handleSaveToTracker}
        onMarkApplied={handleMarkApplied}
        onUpgradeClick={() => {
          setSelectedOpportunity(null);
          handleUpgradeClick();
        }}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onCompleteSimulatedPayment={handleCompleteSimulatedPayment}
        plusClicksCount={metrics.plusClicks}
      />
    </div>
  );
}
