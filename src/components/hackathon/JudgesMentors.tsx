import { Linkedin } from "lucide-react";
import GradientText from "@/components/ui/GradientText";

const judges = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief AI Officer",
    company: "Tech Innovations Inc",
  },
  {
    name: "Raj Patel",
    role: "VP of Engineering",
    company: "StartupHub",
  },
  {
    name: "Priya Sharma",
    role: "Senior Product Manager",
    company: "Global Tech Co",
  },
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    company: "AI Ventures",
  },
];

const mentors = [
  {
    name: "Vikram Singh",
    role: "Full Stack Developer",
    company: "WebDev Solutions",
  },
  {
    name: "Ananya Gupta",
    role: "ML Engineer",
    company: "DataScience Labs",
  },
  {
    name: "Michael Brown",
    role: "Cloud Architect",
    company: "CloudFirst",
  },
  {
    name: "Neha Verma",
    role: "UX Designer",
    company: "DesignStudio",
  },
  {
    name: "David Lee",
    role: "Blockchain Developer",
    company: "CryptoTech",
  },
  {
    name: "Kavitha Rao",
    role: "Data Scientist",
    company: "Analytics Pro",
  },
];

const PersonCard = ({
  person,
}: {
  person: { name: string; role: string; company: string };
}) => (
  <div className="glass rounded-2xl p-6 text-center hover:card-glow transition-all duration-300 group border border-border hover:border-primary/50 hover:-translate-y-1">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary">
      {person.name.charAt(0)}
    </div>
    <h4 className="text-lg font-bold text-foreground mb-1">{person.name}</h4>
    <p className="text-sm text-primary mb-1">{person.role}</p>
    <p className="text-xs text-muted-foreground mb-4">{person.company}</p>
    <a
      href="#"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <Linkedin className="w-4 h-4" />
    </a>
  </div>
);

export const JudgesMentors = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Judges Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="text-4xl md:text-5xl font-bold"
              >
                Our
              </GradientText> Judges
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Industry experts who will evaluate and mentor your projects
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {judges.map((judge, index) => (
              <PersonCard key={index} person={judge} />
            ))}
          </div>
        </div>

        {/* Mentors Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="text-4xl md:text-5xl font-bold"
              >
                Our
              </GradientText> Mentors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Experienced professionals ready to guide you throughout the hackathon
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mentors.map((mentor, index) => (
              <PersonCard key={index} person={mentor} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
