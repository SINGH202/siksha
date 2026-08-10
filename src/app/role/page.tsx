"use client";

import { GraduationCap, Lock, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { RequireAuth } from "@/components/auth/require-auth";
import { RoleCard } from "@/components/domain/role-card";
import { AppShell } from "@/components/layout/app-shell";
import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import {
  homePathForRole,
  toastApiError,
  useAuth,
} from "@/hooks/use-auth";
import type { UserRole } from "@/lib/api/types";

function RoleSelectContent() {
  const router = useRouter();
  const { user, chooseRole, pending } = useAuth();

  useEffect(() => {
    if (user?.role) {
      router.replace(homePathForRole(user.role));
    }
  }, [user?.role, router]);

  async function onSelect(role: UserRole) {
    try {
      const result = await chooseRole(role);
      toast.success(
        role === "parent" ? "Continuing as parent" : "Continuing as teacher"
      );
      router.replace(homePathForRole(result.user.role));
    } catch (error) {
      toastApiError(error, "Could not set role");
    }
  }

  return (
    <AppShell variant="auth">
      <Card className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden border-0 bg-gradient-to-br from-primary to-[#0d747d] p-10 text-primary-foreground shadow-lift ring-0 md:flex md:rounded-3xl">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
        <div className="absolute bottom-16 -left-8 size-28 rounded-full bg-white/5" />
        <div className="relative space-y-3">
          <Typography variant="h1" className="text-primary-foreground">
            Siksha
          </Typography>
          <Typography
            variant="bodyMedium"
            className="text-primary-foreground/85"
          >
            Choose how you want to use Siksha. You can only set this once.
          </Typography>
        </div>
        <Typography variant="small" className="relative text-primary-foreground/70">
          Classes 8–12 · Verified teachers · In-app chat
        </Typography>
      </Card>

      <div className="flex flex-1 flex-col justify-between px-5 py-10 md:justify-center md:px-4 md:py-6 lg:px-8">
        <div className="flex flex-1 flex-col justify-center gap-8 md:flex-none">
          <div className="space-y-2 text-center md:text-left">
            <Typography variant="h1" className="tracking-tight md:hidden">
              Siksha
            </Typography>
            <Typography variant="h2" className="hidden tracking-tight md:block">
              Choose your role
            </Typography>
            <Typography variant="muted">
              Tell us whether you are looking for a tutor or offering tuition.
            </Typography>
          </div>

          <div className="mx-auto w-full max-w-md space-y-3 md:mx-0">
            <RoleCard
              icon={Users}
              title="I am a Parent / मैं अभिभावक हूँ"
              description="Find verified home tutors for Classes 8–12 near you."
              onClick={() => void onSelect("parent")}
              disabled={pending}
            />
            <RoleCard
              icon={GraduationCap}
              title="I am a Teacher / मैं शिक्षक हूँ"
              description="Get serious local leads and chat with parents on Siksha."
              onClick={() => void onSelect("teacher")}
              disabled={pending}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pb-2 text-muted-foreground md:justify-start md:pt-8">
          <Lock className="size-3.5" />
          <Typography variant="small">
            Secure and trusted local network
          </Typography>
        </div>
      </div>
    </AppShell>
  );
}

export default function RolePage() {
  return (
    <RequireAuth allowNullRole>
      <RoleSelectContent />
    </RequireAuth>
  );
}
