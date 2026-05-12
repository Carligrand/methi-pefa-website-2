import hero from "@/assets/hero-church.jpg";
import bishop from "@/assets/bishop.jpg";
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <section id="welcome" className="relative min-h-[92vh] flex items-center overflow-hidden">
    <img src={hero} alt="PEFA METHI CATHEDRAL BRANCH sanctuary" width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-hero" />
    <div className="relative container py-24 text-primary-foreground">
      <div className="grid lg:grid-cols-[auto_1fr_auto] gap-10 lg:gap-14 items-center">
        {/* Bishop portrait */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-gold opacity-70 blur-xl" />
            <img
              src={bishop}
              alt="Bishop David G. Nduati"
              width={320}
              height={320}
              className="relative w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-accent shadow-elegant"
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-xs uppercase tracking-widest font-semibold whitespace-nowrap shadow-gold">
              Bishop David G. Nduati
            </div>
          </div>
        </div>

        {/* Church name centered */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4 font-medium">Welcome Home</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] mb-5">
          PEFA <span className="text-gradient-gold">METHI CATHEDRAL</span> BRANCH
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/85 max-w-xl mx-auto leading-relaxed">
            A place of worship, fellowship, and grace. Wherever you are on your journey of faith, there is a seat for you here.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-7">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold font-semibold">
              <a href="#live">Join This Sunday</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="#about">Our Story</a>
            </Button>
          </div>
        </div>

        {/* Verse */}
        <aside className="max-w-xs mx-auto lg:mx-0 text-center lg:text-left border-l-0 lg:border-l-2 lg:border-accent/60 lg:pl-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">A Word for You</p>
          <blockquote className="font-display text-xl md:text-2xl italic leading-snug text-primary-foreground">
            “For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.”
          </blockquote>
          <cite className="block mt-3 text-sm not-italic text-accent">— Jeremiah 29:11</cite>
        </aside>
      </div>
    </div>
  </section>
);
