import { Cross, Facebook, Youtube, Instagram, MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground pt-16 pb-8">
    <div className="container max-w-6xl grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
            <Cross className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-display text-xl">Methi PEFA Church</div>
            <div className="text-xs uppercase tracking-widest text-accent">Pentecostal Evangelistic Fellowship of Africa</div>
          </div>
        </div>
        <p className="text-primary-foreground/75 max-w-md leading-relaxed">
          A Spirit-filled family worshipping Jesus Christ together — proclaiming the gospel of grace
          to Methi and the nations.
        </p>
      </div>
      <div>
        <h4 className="font-display text-lg mb-4 text-accent">Visit</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" /> Methi, Kenya</li>
          <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-accent shrink-0" /> +254 000 000 000</li>
          <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 text-accent shrink-0" /> info@methipefa.org</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg mb-4 text-accent">Connect</h4>
        <div className="flex gap-3">
          <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-smooth"><Facebook className="w-4 h-4" /></a>
          <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-smooth"><Youtube className="w-4 h-4" /></a>
          <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-smooth"><Instagram className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
    <div className="container max-w-6xl mt-12 pt-6 border-t border-primary-foreground/15 text-xs text-primary-foreground/60 flex flex-col sm:flex-row justify-between gap-2">
      <p>© {new Date().getFullYear()} Methi PEFA Church. All rights reserved.</p>
      <p>"For God so loved the world..." — John 3:16</p>
    </div>
  </footer>
);
