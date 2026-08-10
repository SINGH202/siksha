export type ParentProfile = {
  name: string;
  phone: string;
  locality: string;
  studentName: string;
  studentClass: string;
  preferredSubjects: string[];
  notes: string;
};

export type TeacherProfile = {
  name: string;
  phone: string;
  subjects: string[];
  classes: string[];
  board: string;
  areas: string[];
  feeMin: number;
  feeMax: number;
  bio: string;
  experienceYears: number;
};

export type UserSettings = {
  smsAlerts: boolean;
  chatAlerts: boolean;
  marketingEmails: boolean;
  hidePhoneOnProfile: boolean;
  language: "en" | "hi";
};

export const defaultParentProfile: ParentProfile = {
  name: "Rahul Singh",
  phone: "9876543210",
  locality: "Civil Lines",
  studentName: "Aarav Singh",
  studentClass: "10",
  preferredSubjects: ["Mathematics"],
  notes: "Looking for evening home tuition near Civil Lines.",
};

export const defaultTeacherProfile: TeacherProfile = {
  name: "Priya Sharma",
  phone: "9876501234",
  subjects: ["Mathematics", "Science"],
  classes: ["8", "9", "10"],
  board: "CBSE",
  areas: ["Civil Lines", "Nawabsganj"],
  feeMin: 400,
  feeMax: 600,
  bio: "Patient CBSE tutor focused on algebra and board exam prep.",
  experienceYears: 5,
};

export const defaultSettings: UserSettings = {
  smsAlerts: true,
  chatAlerts: true,
  marketingEmails: false,
  hidePhoneOnProfile: true,
  language: "en",
};

export const parentHelpTopics = [
  {
    id: "post-requirement",
    title: "How do I post a tuition requirement?",
    body: "Go to Dashboard → Post a requirement. Add class, subjects, locality, and schedule. Verified teachers nearby can apply.",
  },
  {
    id: "chat-safety",
    title: "Is chat safe? Should I share my number?",
    body: "Keep conversations on Siksha until you trust the tutor. Phone numbers are hidden on profiles during matching.",
  },
  {
    id: "hire",
    title: "How do I hire a tutor?",
    body: "Open the chat with your preferred teacher and tap Hire. You can leave a review after marking hired.",
  },
  {
    id: "response-time",
    title: "How fast will teachers reply?",
    body: "Teachers typically respond within 24 hours in active Farrukhabad localities.",
  },
  {
    id: "edit-profile",
    title: "Can I edit my profile details?",
    body: "Yes. Open Profile → Edit details to update name, locality, student info, and preferred subjects.",
  },
] as const;

export const teacherHelpTopics = [
  {
    id: "apply-lead",
    title: "How do I apply to a lead?",
    body: "Open Leads, pick a matching requirement, then Apply with your proposed fee and a short note.",
  },
  {
    id: "verification",
    title: "Why do I need verification?",
    body: "Only verified teachers can apply. Complete profile details and ID review in Verification center.",
  },
  {
    id: "fees",
    title: "How should I set my fees?",
    body: "Set a clear hourly range in your teaching profile. Parents see this before chatting.",
  },
  {
    id: "areas",
    title: "How do locality filters work?",
    body: "Add the Farrukhabad areas you cover. You receive leads that overlap your subjects, classes, and areas.",
  },
  {
    id: "edit-profile",
    title: "Can I update subjects and bio?",
    body: "Yes. Profile → Edit teaching profile lets you change subjects, classes, areas, fees, and bio.",
  },
] as const;
