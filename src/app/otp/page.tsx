"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "teacher" : "parent";
  const phone = searchParams.get("phone") ?? "9876543210";
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  function verify(event: React.FormEvent) {
    event.preventDefault();
    router.push(role === "teacher" ? "/teacher/home" : "/parent/home");
  }

  const formattedPhone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;

  return (
    <AppShell variant="auth" className="justify-center">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-8 md:px-0">
        <Card className="gap-0 overflow-hidden border-border/50 p-0">
          <form className="space-y-6 p-6 md:p-8" onSubmit={verify}>
            <div className="space-y-1.5 text-center">
              <Typography variant="h2" className="tracking-tight">
                Siksha
              </Typography>
              <Typography variant="muted">
                Secure access to your learning portal
              </Typography>
            </div>

            <div className="space-y-2">
              <Typography variant="label">Phone number</Typography>
              <div className="flex h-12 items-center justify-between rounded-xl bg-muted px-3.5 ring-1 ring-border/50">
                <Typography variant="bodySmall" className="font-medium">
                  {formattedPhone}
                </Typography>
                <Link
                  href={`/login?role=${role}`}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Typography variant="label">Enter 6-digit OTP</Typography>
                <Typography variant="small">
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                  {String(seconds % 60).padStart(2, "0")}
                </Typography>
              </div>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="w-full justify-between gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="size-11 rounded-xl border bg-card sm:size-12"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-semibold text-primary disabled:opacity-40"
                  disabled={seconds > 0}
                  onClick={() => setSeconds(45)}
                >
                  Resend OTP
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base"
              disabled={otp.length < 6}
            >
              <Typography variant="button" className="text-primary-foreground">
                Verify & Proceed
              </Typography>
            </Button>
          </form>

          <CardFooter className="justify-center gap-2 bg-surface-tint py-3">
            <Lock className="size-3.5 text-muted-foreground" />
            <Typography variant="small">Secure local marketplace</Typography>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpForm />
    </Suspense>
  );
}
