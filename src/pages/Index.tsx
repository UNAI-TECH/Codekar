import { Navbar } from "@/components/hackathon/Navbar";
import { Hero } from "@/components/hackathon/Hero";
import { About } from "@/components/hackathon/About";
import { Domains } from "@/components/hackathon/Domains";
import { Prizes } from "@/components/hackathon/Prizes";
import { SponsorChallenges } from "@/components/hackathon/SponsorChallenges";

import { Sponsors } from "@/components/hackathon/Sponsors";

import { Team } from "@/components/hackathon/Team";
import { FAQ } from "@/components/hackathon/FAQ";
import { Footer } from "@/components/hackathon/Footer";
import { RegistrationForm } from "@/components/hackathon/RegistrationForm";

import { useState } from "react";



const Index = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <main className="min-h-screen relative">
      <div className="relative z-10">

        {showNavbar && <Navbar onApplyClick={() => {
          console.log("Navbar Apply Clicked");
          setIsRegistrationOpen(true);
        }} />}
        <Hero
          onIntroComplete={() => setShowNavbar(true)}
          onApplyClick={() => {
            console.log("Hero Apply Clicked - Opening Registration");
            setIsRegistrationOpen(true);
          }}
        />
        <About />
        <div className="energy-line" />
        <Domains />
        <Prizes />
        <SponsorChallenges />

        <Sponsors />

        <Team />
        <FAQ />
        <Footer />
      </div>
      <RegistrationForm isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
    </main >
  );
};

export default Index;
