import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Parent or teacher login",
  description:
    "Sign in to Siksha with your mobile number to find home tutors or receive tuition leads in Farrukhabad.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
