import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";

type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export function FilterChip({
  label,
  active = false,
  onClick,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-full px-3.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-soft"
          : "bg-card text-foreground ring-1 ring-border/70 hover:bg-muted/70 hover:ring-border",
        className
      )}
    >
      <Typography
        variant="button"
        className={active ? "text-primary-foreground" : "text-foreground"}
      >
        {label}
      </Typography>
    </button>
  );
}
