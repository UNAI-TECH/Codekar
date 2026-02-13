import { Mail, MapPin, Phone, Instagram, Linkedin, X } from "lucide-react";

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Tracks", href: "#tracks" },
  { name: "Prizes", href: "#prizes" },

  { name: "Sponsors", href: "#sponsors" },
  { name: "FAQ", href: "#faq" },
];

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/unai.tech?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/unai-tech-2177072a0/", label: "LinkedIn" },
  { image: "/x-logo.png", href: "https://x.com/UnaiTech74505?s=20", label: "X" },
];

export const Footer = () => {
  return (
    <footer className="py-4 relative">
      <div className="container mx-auto px-4">
        <div className="glass rounded-xl p-4 md:p-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <a href="#" className="flex items-center mb-2">
                <img src="/unai-logo.png" alt="UNAI" className="h-6 w-auto" />
              </a>
              <p className="text-muted-foreground mb-4 max-w-md text-xs">
                Join India's premier student hackathon and build solutions that
                matter. 48 hours of innovation.
              </p>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {/* @ts-ignore */}
                    {social.icon ? <social.icon className="w-3.5 h-3.5" /> : <img src={social.image} alt={social.label} className="w-3.5 h-3.5 invert" />}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Quick Links
              </h4>
              <ul className="space-y-1 text-xs">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Contact Us
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary mt-0.5" />
                  <div>
                    <a href="mailto:contact@unai.com" className="text-muted-foreground hover:text-primary transition-colors">
                      contact@unai.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary mt-0.5" />
                  <div>
                    <a href="tel:+918428293603" className="text-muted-foreground hover:text-primary transition-colors">
                      +91 84282 93603
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">
                      UNAI Tech, Chennai
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-[10px] text-muted-foreground">
              © 2026 UNAI. All rights reserved.
            </p>
            <p className="text-[10px] text-muted-foreground">
              UNAI Crafted
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
