import { SAMPLE_OPPORTUNITIES } from '../data/sampleOpportunities';
import {
  BetaMetrics,
  Opportunity,
  PlanTier,
  StudentProfile,
  TrackedApplication,
} from '../types';

const STORAGE_KEYS = {
  AUTH: 'campusbridge_auth_v1',
  PROFILE: 'campusbridge_profile_v1',
  OPPORTUNITIES: 'campusbridge_opportunities_v1',
  TRACKER: 'campusbridge_tracker_v1',
  PLAN: 'campusbridge_plan_v1',
  METRICS: 'campusbridge_metrics_v1',
};

export interface AuthState {
  isAuthenticated: boolean;
  email: string;
}

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Aarav Rawat',
  email: 'aarav.mba26@dgu.ac.in',
  college: 'DBS Global University (DGU)',
  course: 'MBA',
  year: 'Final',
  skills: ['Marketing', 'Data Analysis', 'Excel', 'Finance'],
  interests: ['FMCG & Retail', 'FinTech', 'Startups'],
  opportunityTypes: ['Internship', 'Placement', 'Competition'],
  careerGoal: 'Brand & Growth Manager at a consumer or FinTech company',
  onboarded: true,
};

export const DEFAULT_METRICS: BetaMetrics = {
  betaUsers: 34,
  weeklyActiveRate: 38,
  applicationsMade: 19,
  plusClicks: 8,
  plusSignups: 2,
};

export const DEFAULT_TRACKER: TrackedApplication[] = [
  {
    opportunityId: 'opp-1',
    status: 'Saved',
    updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  {
    opportunityId: 'opp-3',
    status: 'Applied',
    updatedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
];

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in sandboxed iframes
  }
}

export function loadAuth(): AuthState {
  return safeRead<AuthState>(STORAGE_KEYS.AUTH, {
    isAuthenticated: false,
    email: '',
  });
}

export function saveAuth(auth: AuthState): void {
  safeWrite(STORAGE_KEYS.AUTH, auth);
}

export function loadProfile(): StudentProfile {
  return safeRead<StudentProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
}

export function saveProfile(profile: StudentProfile): void {
  safeWrite(STORAGE_KEYS.PROFILE, profile);
}

export function loadOpportunities(): Opportunity[] {
  const stored = safeRead<Opportunity[] | null>(
    STORAGE_KEYS.OPPORTUNITIES,
    null
  );
  if (!stored || stored.length === 0) {
    return SAMPLE_OPPORTUNITIES;
  }
  return stored;
}

export function saveOpportunities(items: Opportunity[]): void {
  safeWrite(STORAGE_KEYS.OPPORTUNITIES, items);
}

export function loadTracker(): TrackedApplication[] {
  return safeRead<TrackedApplication[]>(STORAGE_KEYS.TRACKER, DEFAULT_TRACKER);
}

export function saveTracker(items: TrackedApplication[]): void {
  safeWrite(STORAGE_KEYS.TRACKER, items);
}

export function loadPlan(): PlanTier {
  return safeRead<PlanTier>(STORAGE_KEYS.PLAN, 'free');
}

export function savePlan(plan: PlanTier): void {
  safeWrite(STORAGE_KEYS.PLAN, plan);
}

export function loadMetrics(): BetaMetrics {
  return safeRead<BetaMetrics>(STORAGE_KEYS.METRICS, DEFAULT_METRICS);
}

export function saveMetrics(metrics: BetaMetrics): void {
  safeWrite(STORAGE_KEYS.METRICS, metrics);
}

export function resetAllDemoData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore errors
  }
}
