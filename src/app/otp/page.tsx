"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  homePathForRole,
  toastApiError,
  useAuth,
} from "@/hooks/use-auth";
import { formatPhoneDisplay, toE164Phone } from "@/lib/auth/phone";

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPhone = searchParams.get("phone") ?? "";
  const phone = toE164Phone(rawPhone) ?? rawPhone;
  const { verifyOtp, requestOtp, pending } = useAuth();
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (!toE164Phone(rawPhone)) {
      router.replace("/login");
    }
  }, [rawPhone, router]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    if (otp.length < 6) return;
    try {
      const result = await verifyOtp(phone, otp);
      toast.success("Signed in");
      router.replace(homePathForRole(result.user.role));
    } catch (error) {
      toastApiError(error, "Invalid OTP");
    }
  }

  async function resend() {
    try {
      const result = await requestOtp(phone);
      setSeconds(45);
      if (result.devCode) {
        toast.message(`Dev OTP: ${result.devCode}`);
      } else {
        toast.success("OTP resent");
      }
    } catch (error) {
      toastApiError(error, "Could not resend OTP");
    }
  }

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
                Enter the 6-digit code sent to your phone
              </Typography>
            </div>

            <div className="space-y-2">
              <Typography variant="label">Phone number</Typography>
              <div className="flex h-12 items-center justify-between rounded-xl bg-muted px-3.5 ring-1 ring-border/50">
                <Typography variant="bodySmall" className="font-medium">
                  {formatPhoneDisplay(phone)}
                </Typography>
                <Link href="/login">
                  <Typography variant="link">Edit</Typography>
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <Typography variant="label">Enter 6-digit OTP</Typography>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                pushPasswordManagerStrategy="none">
                <InputOTPGroup className="grid w-full grid-cols-6 gap-2 rounded-none">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="flex items-center justify-between gap-3">
                <Typography variant="muted">Didn&apos;t get the code?</Typography>
                {seconds > 0 ? (
                  <Typography variant="small">
                    Resend in {String(Math.floor(seconds / 60)).padStart(2, "0")}
                    :{String(seconds % 60).padStart(2, "0")}
                  </Typography>
                ) : (
                  <button
                    type="button"
                    className="disabled:opacity-40"
                    disabled={pending}
                    onClick={() => void resend()}>
                    <Typography variant="link">Resend OTP</Typography>
                  </button>
                )}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base"
              disabled={otp.length < 6 || pending}
            >
              <Typography variant="button" className="text-primary-foreground">
                {pending ? "Verifying…" : "Verify & Proceed"}
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
