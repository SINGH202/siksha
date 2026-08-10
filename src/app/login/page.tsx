"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "teacher" : "parent";
  const [phone, setPhone] = useState("");

  function continueToOtp(event: React.FormEvent) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (digits.length < 10) return;
    router.push(`/otp?role=${role}&phone=${digits}`);
  }

  return (
    <AppShell variant="auth" className="justify-center">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-8 md:px-0">
        <Card className="gap-6 border-border/50 p-6 md:p-8">
          <div className="space-y-1.5 text-center">
            <Typography variant="h2" className="tracking-tight">
              Siksha
            </Typography>
            <Typography variant="muted">
              {role === "parent"
                ? "Sign in to find tutors for your child"
                : "Sign in to receive local tuition leads"}
            </Typography>
          </div>

          <form className="space-y-5" onSubmit={continueToOtp}>
            <div className="space-y-2">
              <Label htmlFor="phone">
                <Typography variant="label">Mobile number</Typography>
              </Label>
              <div className="flex gap-2">
                <div className="flex h-12 items-center rounded-xl bg-muted px-3.5 ring-1 ring-border/50">
                  <Typography variant="bodySmall" className="font-medium">
                    +91
                  </Typography>
                </div>
                <Input
                  id="phone"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-base">
              <Typography variant="button" className="text-primary-foreground">
                Send OTP
              </Typography>
            </Button>
          </form>

          <Typography variant="small" className="text-center">
            Continuing as {role}.{" "}
            <Link
              href="/role"
              className="text-primary underline-offset-4 hover:underline"
            >
              Change role
            </Link>
          </Typography>
        </Card>
      </div>
    </AppShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
