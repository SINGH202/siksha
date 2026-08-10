import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  body: string;
  time: string;
  variant: "incoming" | "outgoing";
  className?: string;
};

export function ChatBubble({ body, time, variant, className }: ChatBubbleProps) {
  const outgoing = variant === "outgoing";

  return (
    <div
      className={cn(
        "flex max-w-[85%] flex-col gap-1",
        outgoing ? "ml-auto items-end" : "mr-auto items-start",
        className
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-soft",
          outgoing
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-foreground ring-1 ring-border/60"
        )}
      >
        <Typography
          variant="bodySmall"
          className={outgoing ? "text-primary-foreground" : "text-foreground"}
        >
          {body}
        </Typography>
      </div>
      <Typography variant="small">{time}</Typography>
    </div>
  );
}
