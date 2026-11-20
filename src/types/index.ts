export type OpportunityType =
  | 'Internship'
  | 'Project'
  | 'Competition'
  | 'Workshop'
  | 'Placement';

export type LocationType = 'Dehradun' | 'Remote' | 'Other';

export type CourseType = 'MBA' | 'BBA' | 'B.Tech' | 'BCA' | 'Other';

export type YearType = '1st' | '2nd' | '3rd' | 'Final';

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export type PlanTier = 'free' | 'plus';

export type AppView =
  | 'landing'
  | 'onboarding'
  | 'feed'
  | 'tracker'
  | 'alerts'
  | 'profile'
  | 'admin';

export interface VerificationChecklist {
  sourceConfirmed: boolean;
  organizationChecked: boolean;
  deadlineValid: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  location: LocationType;
  locationDetail: string;
  skills: string[];
  domainTags: string[];
  stipend: string;
  deadline: string; // ISO date string
  postedAt: string; // ISO date string
  verified: boolean;
  verificationChecklist: VerificationChecklist;
  isSample?: boolean;
  description: string;
  eligibility: string;
  howToApply: string;
  sourceLink: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  course: CourseType;
  year: YearType;
  skills: string[];
  interests: string[];
  opportunityTypes: OpportunityType[];
  careerGoal: string;
  onboarded: boolean;
}

export interface TrackedApplication {
  opportunityId: string;
  status: ApplicationStatus;
  updatedAt: string;
  notes?: string;
}

export interface BetaMetrics {
  betaUsers: number;
  weeklyActiveRate: number; // percentage 0-100
  applicationsMade: number;
  plusClicks: number;
  plusSignups: number;
}

export interface MatchResult {
  score: number; // 0 to 100
  matchedSkills: string[];
  matchedInterests: string[];
  typeMatches: boolean;
}
