import { CheckCircle2, Clock3, Upload } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "Phone verified",
    detail: "OTP confirmed",
    done: true,
  },
  {
    title: "Profile completed",
    detail: "Subjects, areas, and fees added",
    done: true,
  },
  {
    title: "ID submitted",
    detail: "Government ID under review / approved",
    done: true,
  },
];

export default function VerificationPage() {
  return (
    <>
      <AppHeader narrow
        title="Verification"
        showBrand={false}
        backHref="/teacher/profile"
      />
      <PageMain narrow>
        <Card className="gap-3 p-4 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <Typography variant="h3" className="text-base tracking-tight md:text-lg">
              Teacher verification
            </Typography>
            <Badge className="h-6 bg-success text-success-foreground">
              <Typography variant="small" className="text-success-foreground">
                Verified
              </Typography>
            </Badge>
          </div>
          <Typography variant="muted">
            Only verified teachers can apply to parent requirements.
          </Typography>
        </Card>

        <section className="space-y-3">
          <SectionHeader title="Verification steps" />
          {steps.map((step) => (
            <Card key={step.title} className="flex-row items-start gap-3 p-4">
              {step.done ? (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
                  <CheckCircle2 className="size-5" />
                </span>
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-soft">
                  <Clock3 className="size-5" />
                </span>
              )}
              <div>
                <Typography variant="h3" className="text-sm tracking-tight">
                  {step.title}
                </Typography>
                <Typography variant="muted">{step.detail}</Typography>
              </div>
            </Card>
          ))}
        </section>

        <Card className="items-center gap-2 border-dashed border-border/80 p-6 text-center shadow-soft transition-colors hover:bg-muted/30">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary shadow-soft">
            <Upload className="size-6" />
          </span>
          <Typography variant="h3" className="text-sm tracking-tight">
            Re-upload ID (optional)
          </Typography>
          <Typography variant="muted">
            JPG or PDF · admin review within 24–48 hours
          </Typography>
        </Card>
      </PageMain>
    </>
  );
}
