import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center pt-24 pb-16 relative overflow-hidden">
      {/* subtle ember sparks */}
      <span className="ember-spark absolute left-1/4 bottom-24" />
      <span className="ember-spark absolute right-1/5 bottom-32" style={{ animationDelay: '1.5s' }} />
      <span className="ember-spark absolute right-1/3 bottom-20" style={{ animationDelay: '3s' }} />
      <div className="text-center glass-effect circuit-pattern feature-card-hover p-12 rounded-2xl border border-[hsl(var(--border))]/40 animate-ember-fade">
        <h1 className="mb-4 text-4xl font-bold gradient-text animate-ember-shimmer">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:opacity-80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
