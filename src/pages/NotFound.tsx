import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center glass-effect circuit-pattern feature-card-hover p-12 rounded-2xl border-2 border-white/10">
        <h1 className="mb-4 text-4xl font-bold gradient-text">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:opacity-80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
