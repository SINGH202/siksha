import Link from "next/link";

import { Typography } from "@/components/typography";
import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/role", label: "Get started" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#case-study", label: "Case study" },
  { href: "/#location", label: "Location" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/login?role=parent", label: "Parent login" },
  { href: "/login?role=teacher", label: "Teacher login" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 lg:px-10">
        <div className="space-y-2">
          <Typography variant="h3" className="text-primary">
            {siteConfig.name}
          </Typography>
          <Typography variant="muted" className="max-w-xl">
            {siteConfig.description}
          </Typography>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  <Typography variant="link">{link.label}</Typography>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Typography variant="small">
          © {new Date().getFullYear()} {siteConfig.name}. Home tuition matching
          in {siteConfig.city}, {siteConfig.state}.
        </Typography>
      </div>
    </footer>
  );
}
