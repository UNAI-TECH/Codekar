import { useEffect, useState, useRef } from "react";
import { Trophy, Medal, Award, Users, GraduationCap } from "lucide-react";
import PixelCard from "@/components/ui/PixelCard";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "framer-motion";

// Toggle this to show/hide prize details
const SHOW_DETAILS = false;

const mainPrizes = [
  {
    icon: null,
    lottie: "https://lottie.host/7911d3c9-bb99-48c4-8e77-2a018c342b5e/eGzZ5mmZgq.lottie",
    position: "Winner",
    color: null,
    borderColor: "border-yellow-500/50",
    variant: "yellow" as const,
  },
  {
    icon: null,
    lottie: "https://lottie.host/a30edad9-e63e-49c3-9329-23928fd4a986/rIrewqZR9O.lottie",
    position: "1st Runner-Up",
    color: null,
    borderColor: "border-slate-400/50",
    variant: "blue" as const,
  },
  {
    icon: null,
    lottie: "https://lottie.host/a30edad9-e63e-49c3-9329-23928fd4a986/rIrewqZR9O.lottie",
    position: "2nd Runner-Up",
    color: null,
    lottieClass: "[filter:invert(68%)_sepia(38%)_saturate(992%)_hue-rotate(338deg)_brightness(94%)_contrast(90%)]",
    borderColor: "border-[#8C4A1E]",
    variant: "pink" as const,
  },
];

export const Prizes = () => {
  const [isVisible, setIsVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, []);

  const text1 = "Prizes";
  const text2 = "& Rewards";

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  return (
    <section id="prizes" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient inline-block">
              {text1.split("").map((char, i) => (
                <motion.span
                  key={`prizes-${i}`}
                  custom={i}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  variants={letterVariants}
                  className="inline-block"
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            {" "}
            {text2.split("").map((char, i) => (
              <motion.span
                key={`rewards-${i}`}
                custom={text1.length + i}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={letterVariants}
                className="inline-block"
                style={{ display: "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {`Compete for exciting prizes and recognition from industry leaders`
              .split(" ")
              .map((word, i) => (
                <motion.span
                  key={`word-${i}`}
                  custom={text1.length + text2.length + i}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  variants={letterVariants}
                  className="inline-block mr-[0.25em]"
                  style={{ display: "inline-block" }}
                >
                  {word}
                </motion.span>
              ))}
          </p>
        </div>

        {/* Main prizes */}
        {SHOW_DETAILS ? (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {mainPrizes.map((prize, index) => (
              <div key={index} className="h-[400px]">
                <PixelCard
                  variant={prize.variant}
                  className={`rounded-2xl border ${prize.borderColor} transition-all duration-300 group hover:-translate-y-2`}
                >
                  <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center" style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                    <div
                      className={`${prize.color ? `w-20 h-20 rounded-full bg-gradient-to-br ${prize.color}` : 'w-48 h-48'} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                    >
                      {/* @ts-ignore */}
                      {prize.lottie ? (
                        <div className="w-full h-full">
                          <DotLottieReact
                            // @ts-ignore
                            src={prize.lottie}
                            loop
                            autoplay
                            // @ts-ignore
                            className={`w-full h-full ${(prize as any).lottieClass || ''}`}
                          />
                        </div>
                      ) : (
                        <prize.icon className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {prize.position}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Awards and Certificates
                    </p>
                  </div>
                </PixelCard>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ y: 0 }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <p className="text-2xl font-semibold text-primary">Win more than just prizes</p>
            <p className="text-muted-foreground mt-2">Recognition, exposure, and exciting rewards are on the way</p>
            <p className="text-muted-foreground mt-2">Details dropping soon!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
