import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-[0_0_16px_rgba(160,32,240,0.25)]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-primary text-white hover:shadow-[0_0_24px_rgba(255,106,213,0.45)]",
        secondary: "border-transparent bg-[rgba(22,0,40,0.6)] text-[hsl(var(--muted-foreground))] hover:translate-y-[-1px]",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:shadow-[0_0_24px_rgba(255,64,129,0.45)]",
        outline: "text-foreground border-[hsl(var(--border))]/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
