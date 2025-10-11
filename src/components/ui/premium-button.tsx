import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const premiumButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
        premium:
          "bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:shadow-2xl hover:shadow-secondary/60 hover:scale-110 active:scale-95 border-2 border-white/20",
        glass:
          "bg-black/20 backdrop-blur-xl border border-white/10 text-foreground shadow-lg hover:bg-black/30 hover:shadow-primary/40 hover:scale-105 active:scale-95",
        glow:
          "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50 hover:shadow-2xl hover:shadow-secondary/70 hover:scale-110 active:scale-95 animate-glow-pulse",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:scale-105 active:scale-95",
        destructive:
          "bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground shadow-lg hover:shadow-2xl hover:shadow-destructive/50 hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof premiumButtonVariants> {
  asChild?: boolean
  withPulse?: boolean
  withShimmer?: boolean
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant, size, asChild = false, withPulse = false, withShimmer = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          premiumButtonVariants({ variant, size, className }),
          withPulse && "animate-button-pulse",
          withShimmer && "animate-shimmer"
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
PremiumButton.displayName = "PremiumButton"

export { PremiumButton, premiumButtonVariants }

