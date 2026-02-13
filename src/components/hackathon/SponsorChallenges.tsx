import { useEffect, useState, useRef } from "react";
import { Zap, Database, Cloud, Shield } from "lucide-react";
import { motion } from "framer-motion";

const challenges = [
  {
    icon: Zap,
    sponsor: "Tech Corp",
    title: "Best Use of AI/ML",
    prize: "₹25,000",
    description:
      "Build an innovative solution leveraging artificial intelligence and machine learning.",
  },
  {
    icon: Database,
    sponsor: "DataFlow Inc",
    title: "Best Data Analytics Solution",
    prize: "₹25,000",
    description:
      "Create a project that demonstrates exceptional data analysis and visualization.",
  },
  {
    icon: Cloud,
    sponsor: "CloudNine",
    title: "Best Cloud-Native App",
    prize: "₹25,000",
    description:
      "Develop a scalable, cloud-native application using modern cloud services.",
  },
  {
    icon: Shield,
    sponsor: "SecureNet",
    title: "Best Cybersecurity Solution",
    prize: "₹25,000",
    description:
      "Build a security-focused solution addressing modern cybersecurity challenges.",
  },
];

export const SponsorChallenges = () => {
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

  const text1 = "Sponsor";
  const text2 = "Challenges";

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
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient inline-block">
              {text1.split("").map((char, i) => (
                <motion.span
                  key={`sponsor-${i}`}
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
                key={`challenges-${i}`}
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
            {`Win exclusive prizes by solving challenges from our industry partners`
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

        {/* Challenges grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className=" rounded-2xl p-6 hover:card-glow transition-all duration-300 group border border-border hover:border-primary/50"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <challenge.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {challenge.sponsor}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {challenge.prize}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
