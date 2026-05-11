import bishop from "@/assets/bishop.jpg";
import { Phone, Mail, Clock } from "lucide-react";

const schedule = [
  { day: "Sunday", times: "Main Service · 9:00 AM – 1:00 PM" },
  { day: "Monday", times: "Office hours · 10:00 AM – 3:00 PM" },
  { day: "Tuesday", times: "Pastoral counselling (by appointment) · 11:00 AM – 4:00 PM" },
  { day: "Wednesday", times: "Midweek Bible Study · 6:00 PM – 8:00 PM" },
  { day: "Thursday", times: "Leaders' meeting · 5:00 PM – 7:00 PM" },
  { day: "Friday", times: "Prayer & fasting · 9:00 AM – 12:00 PM" },
  { day: "Saturday", times: "Visitations & community outreach" },
];

export const MeetTheBishop = () => (
  <section id="bishop" className="py-24 bg-gradient-soft">
    <div className="container max-w-6xl">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Pastoral Leadership</p>
        <h2 className="font-display text-4xl md:text-5xl text-primary">Meet the Bishop</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img src={bishop} alt="Bishop David G. Nduati" width={800} height={1000} loading="lazy"
               className="rounded-2xl shadow-elegant w-full max-w-md mx-auto object-cover" />
          <div className="absolute -bottom-4 -right-4 bg-gradient-gold px-6 py-3 rounded-xl shadow-gold hidden sm:block">
            <p className="font-display text-primary font-semibold">Bishop David G. Nduati</p>
          </div>
        </div>
        <div>
          <h3 className="font-display text-3xl text-primary mb-2">Bishop David G. Nduati</h3>
          <p className="text-accent uppercase tracking-widest text-xs font-semibold mb-5">Senior Pastor · Methi PEFA</p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Shepherding Methi PEFA with grace and the Word, Bishop Nduati carries a heart for revival, family,
            and the next generation. Here is when you'll find him in church each week:
          </p>
          <ul className="space-y-3 mb-8">
            {schedule.map((s) => (
              <li key={s.day} className="flex gap-4 items-start p-3 rounded-lg bg-card border border-border/60">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-primary">{s.day}: </span>
                  <span className="text-muted-foreground text-sm">{s.times}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="tel:+254000000000" className="flex items-center gap-2 text-primary hover:text-accent transition-smooth">
              <Phone className="w-4 h-4" /> +254 000 000 000
            </a>
            <a href="mailto:bishop@methipefa.org" className="flex items-center gap-2 text-primary hover:text-accent transition-smooth">
              <Mail className="w-4 h-4" /> bishop@methipefa.org
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
