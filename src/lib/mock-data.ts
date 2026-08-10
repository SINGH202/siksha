export type UserRole = "parent" | "teacher";

export type RequirementStatus = "open" | "applicants" | "hired" | "closed";

export type Teacher = {
  id: string;
  name: string;
  verified: boolean;
  subjects: string[];
  classes: string;
  board?: string;
  areas: string[];
  feeMin: number;
  feeMax: number;
  bio: string;
  experienceYears: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
};

export type Requirement = {
  id: string;
  title: string;
  classLabel: string;
  board: string;
  subjects: string[];
  locality: string;
  mode: "home" | "online";
  schedule: string;
  scheduleDetail: string;
  note?: string;
  status: RequirementStatus;
  applicantCount: number;
  postedAgo: string;
  budget?: string;
};

export type ChatPreview = {
  id: string;
  name: string;
  roleLabel: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  requirementLabel: string;
};

export const LOCALITIES = [
  "Civil Lines",
  "Nawabsganj",
  "Kaimganj Road",
  "Fatehgarh",
  "Station Road",
] as const;

export const SUBJECTS = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "English",
  "Hindi",
] as const;

export const CLASSES = ["8", "9", "10", "11", "12"] as const;

export const teachers: Teacher[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    verified: true,
    subjects: ["Mathematics", "Science"],
    classes: "Classes 8–10",
    board: "CBSE",
    areas: ["Civil Lines", "Nawabsganj"],
    feeMin: 400,
    feeMax: 600,
    bio: "Patient CBSE tutor focused on algebra and board exam prep.",
    experienceYears: 5,
    rating: 4.8,
    reviewCount: 12,
  },
  {
    id: "t2",
    name: "Amit Verma",
    verified: true,
    subjects: ["Physics", "Chemistry"],
    classes: "Classes 11–12",
    board: "UP Board / CBSE",
    areas: ["Fatehgarh", "Station Road"],
    feeMin: 500,
    feeMax: 800,
    bio: "Home tuition for senior secondary science with weekly practice tests.",
    experienceYears: 8,
    rating: 4.6,
    reviewCount: 20,
  },
  {
    id: "t3",
    name: "Neha Gupta",
    verified: false,
    subjects: ["English", "Hindi"],
    classes: "Classes 8–12",
    board: "CBSE",
    areas: ["Kaimganj Road"],
    feeMin: 300,
    feeMax: 500,
    bio: "Language coach for reading, writing, and spoken practice.",
    experienceYears: 3,
  },
];

export const parentRequirements: Requirement[] = [
  {
    id: "r1",
    title: "Class 10 Maths",
    classLabel: "10th Standard",
    board: "CBSE",
    subjects: ["Mathematics"],
    locality: "Civil Lines",
    mode: "home",
    schedule: "3 days a week",
    scheduleDetail: "Evenings (4–7 PM preferred)",
    note: "Needs help with algebra and board exam practice papers.",
    status: "applicants",
    applicantCount: 3,
    postedAgo: "2h ago",
    budget: "₹500–700 / class",
  },
  {
    id: "r2",
    title: "Class 12 Physics",
    classLabel: "12th Standard",
    board: "CBSE",
    subjects: ["Physics"],
    locality: "Nawabsganj",
    mode: "home",
    schedule: "4 days a week",
    scheduleDetail: "Morning or evening flexible",
    status: "open",
    applicantCount: 0,
    postedAgo: "1d ago",
  },
];

export const teacherLeads: Requirement[] = [
  {
    id: "r1",
    title: "Mathematics & Science Tutor for Class 10 CBSE",
    classLabel: "10th Standard",
    board: "CBSE",
    subjects: ["Mathematics", "Science"],
    locality: "Civil Lines, Near Metro area",
    mode: "home",
    schedule: "3 days a week",
    scheduleDetail: "Evenings (4–7 PM preferred)",
    note: "Looking for a patient tutor who can explain algebra clearly. Prefer someone who can start this week.",
    status: "open",
    applicantCount: 2,
    postedAgo: "2h ago",
    budget: "₹500–700 / class",
  },
  {
    id: "r3",
    title: "Class 9 English (Home)",
    classLabel: "9th Standard",
    board: "CBSE",
    subjects: ["English"],
    locality: "Fatehgarh",
    mode: "home",
    schedule: "2 days a week",
    scheduleDetail: "Weekends preferred",
    status: "open",
    applicantCount: 1,
    postedAgo: "5h ago",
  },
];

export const chats: ChatPreview[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    roleLabel: "Teacher",
    lastMessage: "Yes, I can start from Monday evening.",
    time: "10:45 AM",
    unread: true,
    requirementLabel: "Class 10 Maths",
  },
  {
    id: "c2",
    name: "Rahul (Parent)",
    roleLabel: "Parent",
    lastMessage: "Are you available in Civil Lines?",
    time: "Yesterday",
    requirementLabel: "Class 10 Maths",
  },
];
