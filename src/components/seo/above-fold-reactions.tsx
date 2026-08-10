"use client";

import { useState } from "react";

import { Typography } from "@/components/typography";
import { aboveFoldReactions } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type AboveFoldReactionsProps = {
  className?: string;
};

export function AboveFoldReactions({ className }: AboveFoldReactionsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className={cn("flex flex-wrap justify-center gap-2 md:justify-start", className)}
      aria-label="Community reactions"
    >
      {aboveFoldReactions.map((reaction) => {
        const active = selected === reaction.label;
        return (
          <button
            key={reaction.label}
            type="button"
            onClick={() =>
              setSelected((current) =>
                current === reaction.label ? null : reaction.label
              )
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition",
              active
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border/80 bg-card text-foreground hover:border-primary/30"
            )}
            aria-pressed={active}
          >
            <Typography variant="bodySmall" aria-hidden>
              {reaction.emoji}
            </Typography>
            <Typography variant="small" className="text-inherit">
              {reaction.label}
            </Typography>
            <Typography variant="small" className="font-semibold text-primary">
              {reaction.count}
            </Typography>
          </button>
        );
      })}
    </div>
  );
}
