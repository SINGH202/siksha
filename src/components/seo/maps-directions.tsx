import { ExternalLink, MapPin, Navigation } from "lucide-react";

import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type MapsDirectionsProps = {
  className?: string;
};

export function MapsDirections({ className }: MapsDirectionsProps) {
  const query = encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.city}, ${siteConfig.state}`,
  );
  const embedSrc = `https://maps.google.com/maps?q=${query}&z=13&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${siteConfig.geo.lat},${siteConfig.geo.lng}`;

  return (
    <section
      id="location"
      className={cn("space-y-4", className)}
      aria-labelledby="location-heading">
      <Typography
        variant="h2"
        id="location-heading"
        className="text-2xl tracking-tight">
        Maps & directions
      </Typography>
      <Card className="gap-4 overflow-hidden border-border/50 p-0">
        <div className="space-y-3 px-4 pt-4 md:px-5 md:pt-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft">
              <MapPin className="size-4" aria-hidden />
            </span>
            <div>
              <Typography variant="h3" className="text-sm tracking-tight">
                Serving families across {siteConfig.city}
              </Typography>
              <Typography variant="muted">
                {siteConfig.address.street}, {siteConfig.address.locality},{" "}
                {siteConfig.address.region} {siteConfig.address.postalCode}
              </Typography>
            </div>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "h-10")}>
            <Navigation className="size-4" aria-hidden />
            <Typography variant="button">Get directions</Typography>
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
        <iframe
          title={`Map of ${siteConfig.city} home tuition service area`}
          src={embedSrc}
          className="h-56 w-full border-t border-border/50 md:h-72"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </Card>
    </section>
  );
}
