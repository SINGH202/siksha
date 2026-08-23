"use client";

import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

type SettingsToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

export function SettingsToggle({
  label,
  description,
  checked,
  onCheckedChange,
  className,
}: SettingsToggleProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-soft",
        className,
      )}>
      <div className="min-w-0 space-y-1">
        <Typography variant="h3" className="text-sm tracking-tight">
          {label}
        </Typography>
        <Typography variant="muted" className="text-sm">
          {description}
        </Typography>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-primary shadow-soft" : "bg-muted ring-1 ring-border/60",
        )}>
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-soft transition-transform duration-200",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}
