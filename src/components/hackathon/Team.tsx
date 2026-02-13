import { useEffect, useState, useRef } from "react";
import { Linkedin, Instagram } from "lucide-react";
import { motion } from "framer-motion";

// Toggle this to show/hide team details
const SHOW_DETAILS = false;

const teamMembers = [
  {
    name: "Mohammad Tanveer",
    role: "Lead Organizer",
    linkedin: "https://www.linkedin.com/in/mohammed-tanveer-kareemullah-33b91a2ab/",
    instagram: "https://www.instagram.com/txnvir_11/?hl=en",
    image: "/Mohammed_Tanveer_K.jpg"
  },
  {
    name: "Kamalesh",
    role: "Technical Head",
    linkedin: "https://www.linkedin.com/in/kamalesh-tech-ai?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagram: "https://www.instagram.com/kamalesh.jr_",
    image: "/Kamalesh_S.JPG"
  },
  {
    name: "Akash  Kumar Singh",
    role: "Marketing Lead",
    linkedin: "https://www.linkedin.com/in/akash-kumar-singh-o-7746242b5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagram: "https://www.instagram.com/itsakashszn_",
    image: "/Akash_Kumar_Singh_O.JPG"
  },
  {
    name: "Madhan Kumar",
    role: "Sponsorship Head",
    linkedin: "https://www.linkedin.com/in/madhan-kumar-p-759402324/",
    instagram: "https://www.instagram.com/_iam_maddy._",
    image: "/Madhan_Kumar_P.JPG"
  },
];

export const Team = () => {
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

  const text1 = "Organizing";
  const text2 = "Team";

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
    <section id="team" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient inline-block">
              {text1.split("").map((char, i) => (
                <motion.span
                  key={`organizing-${i}`}
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
                key={`team-${i}`}
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
            {`The passionate individuals working behind the scenes`
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

        {/* Team grid */}
        {SHOW_DETAILS ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className=" rounded-2xl p-6 text-center hover:card-glow transition-all duration-300 group border border-border hover:border-primary/50 hover:-translate-y-1"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-primary mb-4">{member.role}</p>
                <div className="flex justify-center gap-2">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
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
            <p className="text-2xl font-semibold text-primary">By innovators, for innovators</p>
            <p className="text-muted-foreground mt-2">A dedicated team is working behind the scenes to make this hackathon memorable</p>
            <p className="text-muted-foreground mt-2">Meet them soon!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
