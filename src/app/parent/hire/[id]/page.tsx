"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";

import { StickyCta } from "@/components/domain/sticky-cta";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function HireReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  return (
    <>
      <AppHeader narrow title="Hire & review" showBrand={false} backHref="/parent/chat/c1" />
      <PageMain narrow>
        <Card className="gap-3 p-4 md:p-6">
          <Typography variant="h3" className="text-base tracking-tight md:text-lg">
            Mark Priya Sharma as hired?
          </Typography>
          <Typography variant="muted">
            This unlocks reviews and helps other parents trust Siksha. Tuition fees
            stay between you and the teacher for now.
          </Typography>
        </Card>

        <Card className="gap-3 p-4 md:p-6">
          <Typography variant="label">Rating</Typography>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="rounded-lg p-1"
                  aria-label={`${value} stars`}
                >
                  <Star
                    className={`size-7 ${
                      value <= rating
                        ? "fill-warning text-warning-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <Textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="Share how the first sessions went..."
            className="min-h-28 rounded-xl"
          />
        </Card>
      </PageMain>

      <StickyCta narrow>
        <Button
          className="h-12 w-full rounded-xl"
          onClick={() => router.push("/parent/home")}
        >
          <Typography variant="button" className="text-primary-foreground">
            Confirm hire
          </Typography>
        </Button>
      </StickyCta>
    </>
  );
}
