import { Star } from "lucide-react";

import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { customerReviews } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type ReviewsSectionProps = {
  className?: string;
};

export function ReviewsSection({ className }: ReviewsSectionProps) {
  return (
    <section
      id="reviews"
      className={cn("space-y-4", className)}
      aria-labelledby="reviews-heading"
    >
      <Typography variant="h2" id="reviews-heading" className="text-2xl tracking-tight">
        Real parent reviews from Farrukhabad
      </Typography>
      <div className="grid gap-3 md:grid-cols-3">
        {customerReviews.map((review) => {
          const initials = review.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2);
          return (
            <Card
              key={review.id}
              className="gap-3 border-border/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-11 rounded-2xl ring-1 ring-black/5">
                  <AvatarFallback
                    className="rounded-2xl bg-accent text-accent-foreground"
                    aria-label={review.imageAlt}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Typography variant="h3" className="truncate text-sm tracking-tight">
                    {review.name}
                  </Typography>
                  <Typography variant="small">
                    {review.locality} · {review.subject}
                  </Typography>
                </div>
              </div>
              <div
                className="flex gap-0.5 text-warning-foreground"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`size-3.5 ${
                      index < review.rating
                        ? "fill-current"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <Typography variant="muted" className="text-sm italic">
                “{review.quote}”
              </Typography>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
