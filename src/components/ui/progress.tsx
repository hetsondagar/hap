import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-[rgba(22,0,40,0.5)] border border-[hsl(var(--border))]/30", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all bg-[length:200%_200%] animate-gradient-flow"
      style={{
        backgroundImage: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, #FFC58A 100%)',
        transform: `translateX(-${100 - (value || 0)}%)`,
        animationDuration: `${Math.max(0.8, 3 - ((value || 0) / 50))}s`
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
