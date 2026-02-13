import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import FuzzyText from "@/components/ui/FuzzyText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center flex flex-col items-center">
        <div className="mb-4">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover={true}
            fontSize="clamp(4rem, 20vw, 12rem)"
            color="#fff"
          >
            404
          </FuzzyText>
        </div>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90 text-lg">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
