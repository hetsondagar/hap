import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white shadow-glow hover:translate-y-[-2px] hover:shadow-[0_0_42px_rgba(255,106,213,0.6)] active:scale-95",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_0_24px_rgba(255,64,129,0.45)] hover:translate-y-[-2px] active:scale-95",
        outline: "border-2 border-[hsl(var(--border))] bg-transparent text-foreground hover:bg-[rgba(22,0,40,0.4)] hover:shadow-[0_0_36px_rgba(160,32,240,0.4)]",
        secondary: "bg-[rgba(22,0,40,0.6)] text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-[rgba(22,0,40,0.75)] hover:translate-y-[-2px]",
        ghost: "hover:bg-[rgba(22,0,40,0.5)] hover:text-foreground hover:translate-y-[-2px]",
        link: "text-secondary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
