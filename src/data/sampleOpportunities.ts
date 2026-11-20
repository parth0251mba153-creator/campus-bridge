import {
  MatchResult,
  Opportunity,
  OpportunityType,
  StudentProfile,
} from '../types';

/**
 * Core skill taxonomy used across onboarding, feed filters, and matching.
 */
export const SKILL_OPTIONS: string[] = [
  'Marketing',
  'Finance',
  'HR',
  'Data Analysis',
  'Python',
  'Design',
  'Content Writing',
  'Sales',
  'Operations',
  'Excel',
  'SQL',
  'Product Management',
];

export const INTEREST_OPTIONS: string[] = [
  'FinTech',
  'FMCG & Retail',
  'SaaS & Tech',
  'Consulting',
  'Startups',
  'E-Commerce',
  'BFSI',
  'Supply Chain',
  'Media & Brand',
];

export const OPPORTUNITY_TYPES: OpportunityType[] = [
  'Internship',
  'Project',
  'Competition',
  'Workshop',
  'Placement',
];

export const DEHRADUN_COLLEGES: string[] = [
  'DBS Global University (DGU)',
  'UPES Dehradun',
  'Graphic Era University',
  'DIT University',
  'Uttaranchal University',
  'IMS Unison University',
];

/**
 * Helper to generate dynamic ISO deadlines relative to the user's current clock
 * so "Closing soon" (<48h and <7d) reminders always stay realistic in the MVP.
 */
function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * 18 realistic sample opportunities for Dehradun & remote roles.
 * Clearly flagged with `isSample: true` for MVP prototype transparency.
 */
export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Growth & Brand Marketing Intern',
    organization: 'Himalayan Bloom Naturals',
    type: 'Internship',
    location: 'Dehradun',
    locationDetail: 'Rajpur Road, Dehradun (Hybrid)',
    skills: ['Marketing', 'Content Writing', 'Data Analysis', 'Excel'],
    domainTags: ['FMCG & Retail', 'Startups', 'Media & Brand'],
    stipend: '₹12,000 / month + PPO',
    deadline: hoursFromNow(28),
    postedAt: daysAgo(2),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Work directly with the founding growth team of a Dehradun-born D2C personal care brand. You will run campus ambassador campaigns, audit Meta/Instagram ad funnels, and analyze weekly customer retention cohorts.',
    eligibility: 'MBA / BBA final-year students in Dehradun; available 20+ hrs/week.',
    howToApply:
      'Submit your 1-page resume and a short note on one FMCG brand campaign you admired.',
    sourceLink: 'https://campusbridge.example.in/jobs/himalayan-bloom-marketing',
  },
  {
    id: 'opp-2',
    title: 'Financial Analyst Trainee (Campus Placement)',
    organization: 'Kumaon Capital Advisors',
    type: 'Placement',
    location: 'Dehradun',
    locationDetail: 'IT Park, Sahastradhara Road, Dehradun',
    skills: ['Finance', 'Excel', 'Data Analysis'],
    domainTags: ['BFSI', 'FinTech', 'Consulting'],
    stipend: '₹5.4 LPA CTC',
    deadline: hoursFromNow(40),
    postedAt: daysAgo(1),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Full-time analyst role supporting SME debt advisory, financial modeling, and quarterly credit risk memorandums for North India mid-market clients.',
    eligibility: 'MBA Finance / B.Com / BBA Final Year (2026/2027 batch) with strong Excel modeling.',
    howToApply:
      'Register through the verified placement drive form and upload your latest CV.',
    sourceLink: 'https://campusbridge.example.in/jobs/kumaon-capital-analyst',
  },
  {
    id: 'opp-3',
    title: 'DGU Venture Quest: Campus Startup Case Challenge',
    organization: 'DBS Global University E-Cell',
    type: 'Competition',
    location: 'Dehradun',
    locationDetail: 'DGU Campus Auditorium, Dehradun',
    skills: ['Marketing', 'Finance', 'Operations', 'Product Management'],
    domainTags: ['Startups', 'Consulting', 'FinTech'],
    stipend: '₹50,000 Prize Pool + Incubation',
    deadline: hoursFromNow(72),
    postedAt: daysAgo(3),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Pitch a revenue-backed solution to local Uttarakhand student or SME problems in teams of 2–4. Top 6 teams present to Dehradun angel mentors and faculty.',
    eligibility: 'Open to all MBA, BBA, B.Tech, and BCA students across Dehradun.',
    howToApply:
      'Submit a 6-slide problem-solution deck before the registration window closes.',
    sourceLink: 'https://campusbridge.example.in/competitions/dgu-venture-quest',
  },
  {
    id: 'opp-4',
    title: 'Supply Chain & Operations Live Project',
    organization: 'Selaqui Logistics Grid',
    type: 'Project',
    location: 'Dehradun',
    locationDetail: 'Selaqui Industrial Area, Dehradun',
    skills: ['Operations', 'Excel', 'Data Analysis'],
    domainTags: ['Supply Chain', 'FMCG & Retail'],
    stipend: '₹8,000 Honorarium + Certificate',
    deadline: hoursFromNow(96),
    postedAt: daysAgo(2),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      '4-week live industry project mapping warehouse dispatch bottlenecks and SKU turnaround times across 14 regional pharma & FMCG distributors.',
    eligibility: 'MBA Operations / Final-year B.Tech students able to visit Selaqui twice a week.',
    howToApply:
      'Apply with your resume and availability schedule for Tuesday/Thursday site visits.',
    sourceLink: 'https://campusbridge.example.in/projects/selaqui-logistics',
  },
  {
    id: 'opp-5',
    title: 'Product Analytics & SQL Intern',
    organization: 'FinLedger Cloud',
    type: 'Internship',
    location: 'Remote',
    locationDetail: 'Remote (India)',
    skills: ['Data Analysis', 'SQL', 'Python', 'Excel'],
    domainTags: ['FinTech', 'SaaS & Tech'],
    stipend: '₹18,000 / month',
    deadline: hoursFromNow(120),
    postedAt: daysAgo(1),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Build self-serve retention dashboards, write SQL queries for merchant onboarding funnels, and automate weekly KPI reports for the product lead.',
    eligibility: 'B.Tech / BCA / MBA Business Analytics students with working SQL & Python skills.',
    howToApply:
      'Complete the short 2-question SQL screening form and attach GitHub or portfolio.',
    sourceLink: 'https://campusbridge.example.in/jobs/finledger-analytics',
  },
  {
    id: 'opp-6',
    title: 'B2B Sales & Partnerships Associate',
    organization: 'Doon EdWorks',
    type: 'Placement',
    location: 'Dehradun',
    locationDetail: 'Jakhan, Dehradun',
    skills: ['Sales', 'Marketing', 'Operations'],
    domainTags: ['Startups', 'Consulting', 'SaaS & Tech'],
    stipend: '₹4.8 LPA + Incentives',
    deadline: hoursFromNow(140),
    postedAt: daysAgo(4),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Own institutional outreach to colleges and coaching centers across Uttarakhand and Western UP. Lead product demos and negotiate annual campus licenses.',
    eligibility: 'MBA / BBA 2026–2027 graduating batch; strong spoken Hindi and English.',
    howToApply:
      'Apply via the verified career portal; shortlisted candidates interview in Jakhan.',
    sourceLink: 'https://campusbridge.example.in/jobs/doon-edworks-b2b',
  },
  {
    id: 'opp-7',
    title: 'UI/UX & Brand Design Intern',
    organization: 'Pinecone Digital Studio',
    type: 'Internship',
    location: 'Remote',
    locationDetail: 'Remote (Dehradun Studio)',
    skills: ['Design', 'Content Writing', 'Product Management'],
    domainTags: ['SaaS & Tech', 'Media & Brand', 'Startups'],
    stipend: '₹10,000 / month',
    deadline: hoursFromNow(160),
    postedAt: daysAgo(2),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Design responsive mobile web interfaces, Figma component libraries, and launch collateral for early-stage SaaS founders.',
    eligibility: 'All courses; Figma portfolio with at least 2 case studies required.',
    howToApply:
      'Share your Figma or Behance portfolio URL in the application form.',
    sourceLink: 'https://campusbridge.example.in/jobs/pinecone-design',
  },
  {
    id: 'opp-8',
    title: 'HR Talent Acquisition & People Ops Intern',
    organization: 'Vasant Valley Hospitality Group',
    type: 'Internship',
    location: 'Dehradun',
    locationDetail: 'Mussoorie Diversion, Dehradun',
    skills: ['HR', 'Operations', 'Excel'],
    domainTags: ['Consulting', 'FMCG & Retail'],
    stipend: '₹10,500 / month',
    deadline: hoursFromNow(216),
    postedAt: daysAgo(5),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Assist the HR Manager in screening campus hires, structuring onboarding handbooks, and maintaining attendance & training trackers across 4 Uttarakhand properties.',
    eligibility: 'MBA HR / BBA students available for a 3-month in-office internship.',
    howToApply:
      'Email updated CV with subject line "HR Intern - Dehradun" through the verified link.',
    sourceLink: 'https://campusbridge.example.in/jobs/vasant-valley-hr',
  },
  {
    id: 'opp-9',
    title: 'Hands-on Financial Modeling & Valuation Workshop',
    organization: 'Uttarakhand Finance Collective',
    type: 'Workshop',
    location: 'Dehradun',
    locationDetail: 'Ballupur Chowk, Dehradun',
    skills: ['Finance', 'Excel'],
    domainTags: ['BFSI', 'FinTech', 'Consulting'],
    stipend: 'Free for Beta Students (Cert Included)',
    deadline: hoursFromNow(240),
    postedAt: daysAgo(3),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Saturday 4-hour practical lab building a 3-statement DCF model on an Indian listed FMCG company from scratch. Bring your laptop with Excel.',
    eligibility: 'MBA & BBA Finance students; 40 seats strictly first-come.',
    howToApply:
      'Reserve your seat with your college roll number and student email.',
    sourceLink: 'https://campusbridge.example.in/workshops/ufc-dcf-lab',
  },
  {
    id: 'opp-10',
    title: 'E-Commerce Category Management Intern',
    organization: 'CraftOrigin India',
    type: 'Internship',
    location: 'Remote',
    locationDetail: 'Remote (Pan-India)',
    skills: ['Operations', 'Marketing', 'Excel', 'Data Analysis'],
    domainTags: ['E-Commerce', 'FMCG & Retail'],
    stipend: '₹15,000 / month',
    deadline: hoursFromNow(288),
    postedAt: daysAgo(4),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Manage Amazon & Flipkart catalog health, pricing benchmarks, and festive keyword optimization for 120+ artisan home decor SKUs.',
    eligibility: 'MBA / Final-year UG students comfortable with spreadsheets and marketplace metrics.',
    howToApply:
      'Fill out the 3-minute application form with your Excel comfort level.',
    sourceLink: 'https://campusbridge.example.in/jobs/craftorigin-category',
  },
  {
    id: 'opp-11',
    title: 'Python & FastAPI Backend Intern',
    organization: 'TechGarh Systems',
    type: 'Internship',
    location: 'Dehradun',
    locationDetail: 'IT Park, Dehradun',
    skills: ['Python', 'SQL', 'Data Analysis'],
    domainTags: ['SaaS & Tech', 'Startups'],
    stipend: '₹16,000 / month',
    deadline: hoursFromNow(336),
    postedAt: daysAgo(6),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Build REST endpoints, PostgreSQL query optimizations, and automated test suites for a B2B healthcare scheduling platform.',
    eligibility: 'B.Tech CSE / BCA 3rd or Final Year students with GitHub projects.',
    howToApply:
      'Submit GitHub profile and resume; short take-home API task follows.',
    sourceLink: 'https://campusbridge.example.in/jobs/techgarh-python',
  },
  {
    id: 'opp-12',
    title: 'National Brand Strategy Case Competition',
    organization: 'NorthStar Consumer Labs',
    type: 'Competition',
    location: 'Remote',
    locationDetail: 'Online + Delhi NCR Finale',
    skills: ['Marketing', 'Content Writing', 'Data Analysis'],
    domainTags: ['FMCG & Retail', 'Media & Brand', 'Consulting'],
    stipend: '₹1,00,000 Prize + PPIs',
    deadline: hoursFromNow(360),
    postedAt: daysAgo(2),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Solve a real market-entry brief for a Tier-2 city hydration beverage launch. Winning teams receive Pre-Placement Interviews for Summer Brand Internships.',
    eligibility: 'MBA 1st & 2nd year teams (2–3 members from the same campus).',
    howToApply:
      'Register team on the verified portal and submit Round 1 executive summary.',
    sourceLink: 'https://campusbridge.example.in/competitions/northstar-case',
  },
  {
    id: 'opp-13',
    title: 'Management Trainee — Retail Banking (North Zone)',
    organization: 'Shivalik Small Finance Partner Desk',
    type: 'Placement',
    location: 'Other',
    locationDetail: 'Dehradun / Chandigarh / Noida',
    skills: ['Finance', 'Sales', 'Operations'],
    domainTags: ['BFSI', 'FinTech'],
    stipend: '₹6.0 LPA Fixed',
    deadline: hoursFromNow(408),
    postedAt: daysAgo(5),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Structured 12-month rotational management trainee track covering branch credit appraisal, SME relationship management, and digital onboarding.',
    eligibility: 'MBA Final Year (all specializations) with 60%+ aggregate.',
    howToApply:
      'Apply through the verified placement link for aptitude test slot.',
    sourceLink: 'https://campusbridge.example.in/jobs/shivalik-mt',
  },
  {
    id: 'opp-14',
    title: 'Content & SEO Growth Intern',
    organization: 'ClearTax EduPartner',
    type: 'Internship',
    location: 'Remote',
    locationDetail: 'Remote',
    skills: ['Content Writing', 'Marketing', 'Data Analysis'],
    domainTags: ['FinTech', 'Media & Brand', 'SaaS & Tech'],
    stipend: '₹14,000 / month',
    deadline: hoursFromNow(432),
    postedAt: daysAgo(7),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Research and write practical personal-finance guides, GST explainers, and LinkedIn carousels targeting young salaried professionals.',
    eligibility: 'MBA / BBA / UG students with 2 published writing samples.',
    howToApply:
      'Submit resume plus links to 2 articles or LinkedIn posts.',
    sourceLink: 'https://campusbridge.example.in/jobs/cleartax-content',
  },
  {
    id: 'opp-15',
    title: 'Campus Market Research Live Project',
    organization: 'ZestPay Student Card',
    type: 'Project',
    location: 'Dehradun',
    locationDetail: 'Dehradun Campuses (Field + Remote)',
    skills: ['Marketing', 'Sales', 'Data Analysis'],
    domainTags: ['FinTech', 'Startups'],
    stipend: '₹10,000 Fixed + Recommendation',
    deadline: hoursFromNow(480),
    postedAt: daysAgo(3),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Conduct 60 structured student interviews across DGU, UPES, and Graphic Era to validate campus UPI rewards features and synthesize insights.',
    eligibility: '1st & 2nd year MBA / BBA students in Dehradun.',
    howToApply:
      'Apply with a 3-line pitch on how you will recruit 60 respondents.',
    sourceLink: 'https://campusbridge.example.in/projects/zestpay-research',
  },
  {
    id: 'opp-16',
    title: 'Product Management Bootcamp & Tear-down Lab',
    organization: 'ProductFolks Dehradun Chapter',
    type: 'Workshop',
    location: 'Remote',
    locationDetail: 'Live Online Cohort (Weekend)',
    skills: ['Product Management', 'Design', 'Data Analysis'],
    domainTags: ['SaaS & Tech', 'Startups', 'E-Commerce'],
    stipend: 'Free Verified Cohort',
    deadline: hoursFromNow(528),
    postedAt: daysAgo(4),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Two-day weekend workshop covering user discovery, PRD writing, funnel metrics, and a live Zepto/Blinkit product teardown reviewed by PM mentors.',
    eligibility: 'Open to MBA, B.Tech, and BCA students interested in product roles.',
    howToApply:
      'Submit your LinkedIn URL and pick one app feature you would improve.',
    sourceLink: 'https://campusbridge.example.in/workshops/pm-teardown',
  },
  {
    id: 'opp-17',
    title: 'Business Operations & CRM Associate',
    organization: 'Noida HealthGrid',
    type: 'Placement',
    location: 'Other',
    locationDetail: 'Noida Sector 62 (On-site)',
    skills: ['Operations', 'Excel', 'SQL', 'HR'],
    domainTags: ['SaaS & Tech', 'Consulting'],
    stipend: '₹5.2 LPA CTC',
    deadline: hoursFromNow(576),
    postedAt: daysAgo(6),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Coordinate clinic onboarding SLAs, manage HubSpot/CRM pipelines, and build weekly turnaround reports for regional operations heads.',
    eligibility: 'MBA / BBA / B.Tech Final Year (2026/2027 batch) willing to relocate to NCR.',
    howToApply:
      'Complete the application form; virtual interviews scheduled weekly.',
    sourceLink: 'https://campusbridge.example.in/jobs/healthgrid-ops',
  },
  {
    id: 'opp-18',
    title: 'Data Visualization & PowerBI Live Project',
    organization: 'Garhwal Agro Exports',
    type: 'Project',
    location: 'Dehradun',
    locationDetail: 'Dehradun (Hybrid)',
    skills: ['Data Analysis', 'Excel', 'Python'],
    domainTags: ['Supply Chain', 'FMCG & Retail'],
    stipend: '₹9,000 + Experience Letter',
    deadline: hoursFromNow(624),
    postedAt: daysAgo(2),
    verified: true,
    verificationChecklist: {
      sourceConfirmed: true,
      organizationChecked: true,
      deadlineValid: true,
    },
    isSample: true,
    description:
      'Transform 18 months of spice and organic produce export spreadsheets into clean interactive executive dashboards for margin and buyer tracking.',
    eligibility: 'MBA Business Analytics / B.Tech / BCA students.',
    howToApply:
      'Apply with your resume and a sample chart or spreadsheet model.',
    sourceLink: 'https://campusbridge.example.in/projects/garhwal-agro-bi',
  },
];

/**
 * Simple, deterministic rule-based matching (no AI).
 * Weights:
 * - Required skill overlap: up to 65 points
 * - Domain/interest overlap: up to 20 points
 * - Preferred opportunity type match: 15 points
 */
export function calculateMatch(
  profile: StudentProfile,
  opportunity: Opportunity
): MatchResult {
  const userSkills = new Set(profile.skills.map((s) => s.toLowerCase()));
  const matchedSkills = opportunity.skills.filter((skill) =>
    userSkills.has(skill.toLowerCase())
  );

  const skillRatio =
    opportunity.skills.length > 0
      ? matchedSkills.length / opportunity.skills.length
      : 0.5;
  const skillPoints = Math.round(skillRatio * 65);

  const userInterests = new Set(profile.interests.map((i) => i.toLowerCase()));
  const matchedInterests = opportunity.domainTags.filter((tag) =>
    userInterests.has(tag.toLowerCase())
  );
  const interestPoints =
    opportunity.domainTags.length > 0
      ? Math.min(20, matchedInterests.length * 10)
      : 10;

  const typeMatches = profile.opportunityTypes.includes(opportunity.type);
  const typePoints = typeMatches ? 15 : 0;

  const rawScore = skillPoints + interestPoints + typePoints;
  const score = Math.max(18, Math.min(99, rawScore));

  return {
    score,
    matchedSkills,
    matchedInterests,
    typeMatches,
  };
}

/**
 * Deadline helper for urgency formatting.
 */
export function getDeadlineUrgency(deadlineIso: string): {
  hoursLeft: number;
  daysLeft: number;
  tier: 'expired' | 'urgent48h' | 'soon7d' | 'normal';
  label: string;
} {
  const diffMs = new Date(deadlineIso).getTime() - Date.now();
  const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return { hoursLeft: 0, daysLeft: 0, tier: 'expired', label: 'Closed' };
  }
  if (hoursLeft <= 48) {
    return {
      hoursLeft,
      daysLeft,
      tier: 'urgent48h',
      label: `Urgent · ${Math.max(1, hoursLeft)}h left`,
    };
  }
  if (daysLeft <= 7) {
    return {
      hoursLeft,
      daysLeft,
      tier: 'soon7d',
      label: `Closing soon · ${daysLeft}d left`,
    };
  }
  return {
    hoursLeft,
    daysLeft,
    tier: 'normal',
    label: `${daysLeft}d left`,
  };
}
