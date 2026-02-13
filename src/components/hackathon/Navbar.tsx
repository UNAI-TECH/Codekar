import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Info, Trophy, Gift, Users, HelpCircle, Handshake } from "lucide-react";

const navLinks = [
  { name: "Home", url: "#hero", icon: Home },
  { name: "About", url: "#about", icon: Info },
  { name: "Tracks", url: "#tracks", icon: Trophy },
  { name: "Prizes", url: "#prizes", icon: Gift },
  { name: "Sponsors", url: "#sponsors", icon: Handshake },
];

export const Navbar = ({ onApplyClick }: { onApplyClick?: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md py-4 shadow-md" : "bg-transparent py-5 3xl:py-10"
        }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
        <a href="#" className="flex items-center">
          <img src="/unai-logo.png" alt="UNAI" className="h-8 3xl:h-12 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 3xl:gap-12">
          <NavBar items={navLinks} />
          <Button
            onClick={onApplyClick}
            className="bg-gradient-to-r from-[#ce2bf1] to-[#601ef9] text-white hover:opacity-90 transition-opacity 3xl:text-lg 3xl:px-8 3xl:py-6 animate-jump-pulse"
          >
            Apply Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-lg p-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onApplyClick?.();
              }}
              className="w-full bg-gradient-to-r from-[#ce2bf1] to-[#601ef9] text-white hover:opacity-90 transition-opacity animate-jump-pulse"
            >
              Apply Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
