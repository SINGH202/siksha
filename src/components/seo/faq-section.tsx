"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  items: ReadonlyArray<FaqItem>;
  title?: string;
  className?: string;
};

export function FaqSection({
  items,
  title = "Frequently asked questions",
  className,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className={cn("space-y-4", className)}
      aria-labelledby="faq-heading">
      <Typography
        variant="h2"
        id="faq-heading"
        className="text-2xl tracking-tight">
        {title}
      </Typography>
      <div className="space-y-2">
        {items.map((item, index) => {
          const open = openIndex === index;
          return (
            <Card
              key={item.question}
              className="gap-0 overflow-hidden border-border/50 p-0 transition-all duration-200 hover:border-primary/15 hover:shadow-lift">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? -1 : index)}>
                <Typography
                  variant="h3"
                  className="text-sm tracking-tight md:text-base">
                  {item.question}
                </Typography>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              </button>
              {open ? (
                <div className="border-t border-border/50 bg-muted/20 px-4 py-3.5">
                  <Typography variant="muted">{item.answer}</Typography>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
