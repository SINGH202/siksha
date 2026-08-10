"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastApiError, useAuth } from "@/hooks/use-auth";
import { isValidIndianMobile, toE164Phone } from "@/lib/auth/phone";

export default function LoginPage() {
  const router = useRouter();
  const { requestOtp, pending } = useAuth();
  const [phone, setPhone] = useState("");

  async function continueToOtp(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidIndianMobile(phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number starting with 6–9");
      return;
    }
    try {
      const result = await requestOtp(phone);
      const e164 = toE164Phone(phone)!;
      if (result.devCode) {
        toast.message(`Dev OTP: ${result.devCode}`);
      } else {
        toast.success("OTP sent");
      }
      router.push(`/otp?phone=${encodeURIComponent(e164)}`);
    } catch (error) {
      toastApiError(error, "Could not send OTP");
    }
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
              Sign in with your mobile number to continue
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

            <Button
              type="submit"
              size="lg"
              className="w-full text-base"
              disabled={pending}
            >
              <Typography variant="button" className="text-primary-foreground">
                {pending ? "Sending…" : "Send OTP"}
              </Typography>
            </Button>
          </form>

          <Typography variant="small" className="text-center">
            New here?{" "}
            <Link
              href="/"
              className="text-primary underline-offset-4 hover:underline"
            >
              Learn about Siksha
            </Link>
          </Typography>
        </Card>
      </div>
    </AppShell>
  );
}
