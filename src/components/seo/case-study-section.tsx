import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { caseStudy } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type CaseStudySectionProps = {
  className?: string;
};

export function CaseStudySection({ className }: CaseStudySectionProps) {
  return (
    <section
      id="case-study"
      className={cn("space-y-4", className)}
      aria-labelledby="case-study-heading"
    >
      <Typography variant="h2" id="case-study-heading" className="text-2xl tracking-tight">
        Case study
      </Typography>
      <Card className="gap-5 border-border/50 p-5 md:p-7">
        <div className="space-y-2">
          <Typography variant="h3" className="text-lg tracking-tight md:text-xl">
            {caseStudy.title}
          </Typography>
          <Typography variant="small">
            {caseStudy.parent} · {caseStudy.locality}
          </Typography>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Typography variant="label">Challenge</Typography>
            <Typography variant="muted">{caseStudy.challenge}</Typography>
          </div>
          <div className="space-y-1">
            <Typography variant="label">Approach</Typography>
            <Typography variant="muted">{caseStudy.approach}</Typography>
          </div>
          <div className="space-y-1">
            <Typography variant="label">Result</Typography>
            <Typography variant="muted">{caseStudy.result}</Typography>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {caseStudy.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl bg-accent/60 px-3 py-3 text-center shadow-soft"
            >
              <Typography variant="h3" className="text-base text-primary">
                {metric.value}
              </Typography>
              <Typography variant="small">{metric.label}</Typography>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
