"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";

import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type HelpTopic = {
  id: string;
  title: string;
  body: string;
};

type HelpCenterContentProps = {
  topics: ReadonlyArray<HelpTopic>;
  roleLabel: string;
  privacyHref?: string;
  className?: string;
};

export function HelpCenterContent({
  topics,
  roleLabel,
  privacyHref = "/privacy",
  className,
}: HelpCenterContentProps) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(topics[0]?.id ?? null);
  const debouncedQuery = useDebouncedValue(query, 300);

  const filtered = useMemo(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    if (!normalized || normalized.length < 2) return topics;
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(normalized) ||
        topic.body.toLowerCase().includes(normalized),
    );
  }, [debouncedQuery, topics]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative md:max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${roleLabel} help...`}
          className="h-12 pl-10"
        />
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <Card className="border-dashed border-border/80 p-8 text-center shadow-none">
            <Typography variant="muted">
              No matching articles. Try another keyword or email{" "}
              {siteConfig.email}.
            </Typography>
          </Card>
        ) : (
          filtered.map((topic) => {
            const open = openId === topic.id;
            return (
              <Card
                key={topic.id}
                className="gap-0 overflow-hidden border-border/50 p-0 transition-all duration-200 hover:border-primary/15 hover:shadow-lift">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : topic.id)}>
                  <Typography
                    variant="h3"
                    className="text-sm tracking-tight md:text-base">
                    {topic.title}
                  </Typography>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      open && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <div className="border-t border-border/50 bg-muted/20 px-4 py-3.5">
                    <Typography variant="muted">{topic.body}</Typography>
                  </div>
                ) : null}
              </Card>
            );
          })
        )}
      </div>

      <Card className="gap-2 border-border/50 p-4">
        <Typography variant="h3" className="text-sm tracking-tight">
          Still need help?
        </Typography>
        <Typography variant="muted" className="text-sm">
          Email {siteConfig.email} or call {siteConfig.phoneDisplay}. Read our{" "}
          <Link
            href={privacyHref}
            className="font-medium text-primary underline-offset-4 hover:underline">
            privacy policy
          </Link>
          .
        </Typography>
      </Card>
    </div>
  );
}
