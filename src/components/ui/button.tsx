import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1rem] text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative reactive-glow btn-ripple magnetic-tilt",
  {
    variants: {
      variant: {
        default: "bg-[linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))] text-white shadow-[0_0_10px_rgba(255,106,0,0.3)] hover:-translate-y-[3px] hover:shadow-[0_0_22px_rgba(255,106,0,0.5)] active:scale-95 btn-power",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_0_18px_rgba(255,71,71,0.3)] hover:-translate-y-[3px] active:scale-95",
        outline: "border-2 border-[var(--accent-primary)] text-white bg-transparent hover:-translate-y-[3px] hover:shadow-[0_0_20px_rgba(255,106,0,0.45)] hover:bg-[linear-gradient(180deg,rgba(255,106,0,0.12),rgba(255,157,66,0.12))]",
        secondary: "bg-[rgba(21,21,21,0.7)] text-white border border-[var(--border)] hover:-translate-y-[3px] hover:shadow-[0_0_16px_rgba(255,106,0,0.35)]",
        ghost: "hover:bg-[rgba(21,21,21,0.5)] hover:text-white hover:-translate-y-[3px]",
        link: "text-[var(--accent-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-[0.5rem] px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
