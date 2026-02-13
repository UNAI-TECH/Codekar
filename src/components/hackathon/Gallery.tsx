import Masonry from "@/components/ui/Masonry";
import GradientText from "@/components/ui/GradientText";
const galleryImages = [
  { id: 1, alt: "Hackers collaborating" },
  { id: 2, alt: "Workshop session" },
  { id: 3, alt: "Team presenting" },
  { id: 4, alt: "Mentor guiding students" },
  { id: 5, alt: "Prize ceremony" },
  { id: 6, alt: "Networking event" },
  { id: 7, alt: "Late night coding" },
  { id: 8, alt: "Group photo" },
];

export const Gallery = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="text-4xl md:text-5xl font-bold"
            >
              Event
            </GradientText> Gallery
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Moments captured from our previous hackathon editions
          </p>
        </div>

        {/* Gallery grid */}
<<<<<<< HEAD
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={` rounded-xl overflow-hidden group cursor-pointer hover:card-glow transition-all duration-300 ${index === 0 || index === 7 ? "md:col-span-2 md:row-span-2" : ""
                }`}
            >
              <div
                className={`bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ${index === 0 || index === 7
                  ? "aspect-square md:aspect-auto md:h-full"
                  : "aspect-square"
                  }`}
              >
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📸</span>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    {image.alt}
                  </p>
                </div>
              </div>
            </div>
          ))}
=======
        <div className="w-full">
          <Masonry
            items={[
              { id: "1", img: "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=1200&auto=format&fit=crop", height: 400 },
              { id: "2", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop", height: 300 },
              { id: "3", img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200&auto=format&fit=crop", height: 500 },
              { id: "4", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop", height: 350 },
              { id: "5", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop", height: 450 },
              { id: "6", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop", height: 300 },
              { id: "7", img: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1200&auto=format&fit=crop", height: 400 },
              { id: "8", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop", height: 500 },
            ]}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
          />
>>>>>>> 4286de09de9cd2dabda1a05e9c16bc4161eaeb63
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            More photos coming soon from our upcoming event!
          </p>
        </div>
      </div>
    </section>
  );
};
