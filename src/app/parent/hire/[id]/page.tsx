"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { StickyCta } from "@/components/domain/sticky-cta";
import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toastApiError } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/use-conversations";
import { useHires } from "@/hooks/use-hires";
import { toChatPreview } from "@/lib/api/mappers";

export default function HireReviewPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const router = useRouter();

  const { items: conversations } = useConversations();
  const { items: hires, hire, review } = useHires();

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const conversation = conversations.find((item) => item.id === conversationId);
  const hireItem = hires.find((item) => item.conversationId === conversationId);
  const peerName =
    (conversation ? toChatPreview(conversation, "parent").name : null) ??
    hireItem?.peerName?.trim() ??
    "Tutor";

  const backHref = `/parent/chat/${conversationId}`;

  async function onConfirm() {
    setSubmitting(true);
    try {
      const created = await hire(conversationId);
      try {
        const result = await review({
          hireId: created.id,
          rating,
          body: reviewText.trim() || undefined,
        });
        if ("alreadyReviewed" in result && result.alreadyReviewed) {
          toast.message("Hired — review already submitted");
        } else {
          toast.success("Hired and review submitted");
        }
      } catch (error) {
        toast.success("Tutor marked as hired");
        toastApiError(error, "Could not submit review");
      }
      router.push(backHref);
    } catch (error) {
      toastApiError(error, "Could not hire tutor");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader
        narrow
        title="Hire & review"
        showBrand={false}
        backHref={backHref}
      />
      <PageMain narrow>
        <Card className="gap-3 p-4 md:p-6">
          <Typography
            variant="h3"
            className="text-base tracking-tight md:text-lg">
            Mark {peerName} as hired?
          </Typography>
          <Typography variant="muted">
            This unlocks reviews and helps other parents trust Siksha. Tuition
            fees stay between you and the teacher for now.
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
                  disabled={submitting}>
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
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Share how the first sessions went..."
            className="min-h-28 rounded-xl"
            disabled={submitting}
          />
        </Card>
      </PageMain>

      <StickyCta narrow>
        <Button
          className="h-12 w-full rounded-xl"
          onClick={() => void onConfirm()}
          disabled={submitting || !conversationId}>
          <Typography variant="button" className="text-primary-foreground">
            {submitting ? "Confirming…" : "Confirm hire"}
          </Typography>
        </Button>
      </StickyCta>
    </>
  );
}
