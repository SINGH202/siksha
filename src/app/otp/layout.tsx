import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Verify OTP",
  description: "Enter the one-time password sent to your phone to access Siksha securely.",
  path: "/otp",
  noIndex: true,
});

export default function OtpLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
