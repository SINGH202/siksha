import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Browse verified tutors in Farrukhabad",
  description:
    "Search Class 8–12 home tutors by subject, area, and fee. View verified teacher profiles on Siksha.",
  path: "/parent/browse",
  noIndex: true,
});

export default function BrowseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
