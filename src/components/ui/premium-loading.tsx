import { cn } from "@/lib/utils"

interface PremiumLoadingProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "pulse" | "dots" | "gradient"
  fullScreen?: boolean
}

export const PremiumLoading = ({ 
  className, 
  size = "md", 
  variant = "gradient",
  fullScreen = false 
}: PremiumLoadingProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  }

  const Container = fullScreen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        {renderLoader()}
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  ) : (
    <div className={cn("flex items-center justify-center", className)}>
      {renderLoader()}
    </div>
  )

  function renderLoader() {
    switch (variant) {
      case "spinner":
        return (
          <div className={cn(
            "border-4 border-primary/20 border-t-primary rounded-full animate-spin",
            sizeClasses[size]
          )} />
        )
      
      case "pulse":
        return (
          <div className={cn(
            "bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse",
            sizeClasses[size]
          )} />
        )
      
      case "dots":
        return (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce",
                  size === "sm" ? "w-2 h-2" :
                  size === "md" ? "w-3 h-3" :
                  size === "lg" ? "w-4 h-4" :
                  "w-6 h-6"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case "gradient":
      default:
        return (
          <div className={cn("relative", sizeClasses[size])}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-primary animate-spin bg-[length:200%_200%]" style={{ animationDuration: "1.5s" }} />
            <div className="absolute inset-2 rounded-full bg-background" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary/50 to-secondary/50 blur-sm animate-pulse" />
          </div>
        )
    }
  }

  return Container
}

// Simple inline loading spinner for buttons
export const ButtonLoader = ({ className }: { className?: string }) => (
  <div className={cn("animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent", className)} />
)

