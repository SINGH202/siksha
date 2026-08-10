import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl",
      h2: "font-heading text-2xl font-semibold tracking-tight text-primary",
      h3: "font-heading text-lg font-semibold tracking-tight text-foreground",
      bodyMedium: "text-base font-normal leading-relaxed text-foreground",
      bodySmall: "text-sm font-normal leading-relaxed text-foreground",
      small: "text-xs font-medium leading-normal text-muted-foreground",
      li: "text-base font-normal leading-relaxed text-foreground",
      button: "text-sm font-semibold leading-none",
      link: "text-sm font-medium text-primary underline-offset-4 hover:underline",
      label: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
      muted: "text-sm font-normal leading-relaxed text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "bodyMedium",
  },
});

const defaultElements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  bodyMedium: "p",
  bodySmall: "p",
  small: "small",
  li: "li",
  button: "span",
  link: "span",
  label: "span",
  muted: "p",
} as const;

type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>;

type TypographyProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: keyof HTMLElementTagNameMap;
    children?: ReactNode;
  };

export function Typography({
  variant = "bodyMedium",
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const resolvedVariant = (variant ?? "bodyMedium") as TypographyVariant;
  const Component = (as ??
    defaultElements[resolvedVariant]) as keyof HTMLElementTagNameMap;

  return (
    <Component
      className={cn(typographyVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
