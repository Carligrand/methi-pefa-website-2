import { Youtube, Facebook, Archive } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OrderOfService } from "./OrderOfService";

export const LiveStream = () => (
  <section id="live" className="py-24 bg-primary text-primary-foreground">
    <div className="container max-w-7xl">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Worship With Us</p>
        <h2 className="font-display text-4xl md:text-5xl">Live Services & Replays</h2>
        <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">Stream every Sunday and midweek service from anywhere in the world.</p>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-10 items-start">
        <OrderOfService variant="inline" />

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-elegant border border-accent/30 bg-black aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/live_stream?channel=UCYO_jab_esuFRV4b17AJtAw"
                title="Methi PEFA YouTube Live"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-elegant border border-accent/30 bg-black aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F10153231379946729%2F&show_text=false"
                title="Methi PEFA Facebook Live"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              <Link to="/sermons"><Archive className="mr-2" /> Sermons Archive</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="https://youtube.com" target="_blank" rel="noreferrer"><Youtube className="mr-2" /> YouTube</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook className="mr-2" /> Facebook</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
