export const siteConfig = {
  name: "Siksha",
  tagline: "Home tuition marketplace in Farrukhabad",
  description:
    "Find verified home tutors for Classes 8–12 in Farrukhabad. Post a requirement, chat in-app, and hire with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://siksha.app",
  locale: "en_IN",
  city: "Farrukhabad",
  state: "Uttar Pradesh",
  country: "IN",
  phoneDisplay: "+91 98765 43210",
  phoneTel: "+919876543210",
  email: "hello@siksha.app",
  address: {
    street: "Civil Lines",
    locality: "Farrukhabad",
    region: "UP",
    postalCode: "209625",
    country: "IN",
  },
  geo: {
    lat: 27.3905,
    lng: 79.5801,
  },
  responseTimePromise: "Teachers typically respond within 24 hours",
  socialImagePath: "/opengraph-image",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

export const marketingFaqs = [
  {
    question: "How does Siksha help me find a home tutor in Farrukhabad?",
    answer:
      "Post a Class 8–12 requirement with subject, locality, and schedule. Verified teachers nearby can apply. You shortlist, chat in-app, then hire when you are ready.",
  },
  {
    question: "Are teachers verified before they contact parents?",
    answer:
      "Yes. Teachers must complete phone OTP, profile details, and ID review before they can apply to requirements. Look for the Verified badge on profiles.",
  },
  {
    question: "Do I need to share my phone number on the platform?",
    answer:
      "No. Profiles do not show phone numbers. You chat inside Siksha first. Share contact details only if you choose to after you trust the match.",
  },
  {
    question: "How fast will a teacher reply to my requirement?",
    answer:
      "Most parents hear from interested tutors within 24 hours in active localities. Urgent evening slots may fill faster during exam season.",
  },
  {
    question: "Is Siksha free for parents and teachers right now?",
    answer:
      "Matching is free for both sides during launch in Farrukhabad. Paid plans may come later once local density is strong. You will always see pricing clearly before any charge.",
  },
] as const;

export const customerReviews = [
  {
    id: "rev-1",
    name: "Anjali Mishra",
    locality: "Civil Lines",
    rating: 5,
    quote:
      "Posted Class 10 Maths on Sunday evening and had three verified tutors apply by Monday. We hired after one demo class at home.",
    subject: "Class 10 Maths",
    imageAlt: "Portrait placeholder for parent Anjali Mishra from Civil Lines",
  },
  {
    id: "rev-2",
    name: "Rakesh Yadav",
    locality: "Nawabsganj",
    rating: 5,
    quote:
      "As a working parent, in-app chat helped me compare fees without spam calls. Our Class 12 Physics tutor has been consistent for two months.",
    subject: "Class 12 Physics",
    imageAlt: "Portrait placeholder for parent Rakesh Yadav from Nawabsganj",
  },
  {
    id: "rev-3",
    name: "Farah Khan",
    locality: "Fatehgarh",
    rating: 4,
    quote:
      "Clear verification badge gave us confidence for home visits. Response was quick and the tutor explained algebra patiently.",
    subject: "Class 9 Science",
    imageAlt: "Portrait placeholder for parent Farah Khan from Fatehgarh",
  },
] as const;

export const caseStudy = {
  title: "How a Class 10 family in Civil Lines found a Maths tutor in 48 hours",
  parent: "Rahul Singh",
  locality: "Civil Lines, Farrukhabad",
  challenge:
    "Rahul’s son was struggling with CBSE algebra before board exams and needed a patient home tutor for evenings.",
  approach:
    "He posted a Siksha requirement with class, subject, locality, and evening preference. Two verified tutors applied with proposed fees. After in-app chat, the family booked a first session at home.",
  result:
    "A verified Maths tutor was hired within two days. Weekly sessions started the same week, and the parent left a review after marking hired.",
  metrics: [
    { label: "Time to first applicant", value: "6 hours" },
    { label: "Verified applicants", value: "3" },
    { label: "Hire decision", value: "48 hours" },
  ],
} as const;

export const aboveFoldReactions = [
  { emoji: "👍", label: "Helpful matches", count: "120+" },
  { emoji: "🛡️", label: "Verified tutors", count: "Trusted" },
  { emoji: "⚡", label: "Fast replies", count: "< 24h" },
  { emoji: "🏠", label: "Home tuition", count: "Local" },
] as const;
