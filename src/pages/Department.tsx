import { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar as CalIcon, HeartHandshake, Image as ImageIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/church/Navbar";
import { Footer } from "@/components/church/Footer";
import { getDepartment } from "@/data/departments";
import { getCurrentSeason, seasonLabel } from "@/lib/season";

const Department = () => {
  const { id } = useParams();
  const dept = getDepartment(id);
  const season = useMemo(() => getCurrentSeason(), []);
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  useEffect(() => {
    document.documentElement.setAttribute("data-season", season);
    if (dept) document.title = `${dept.name} — PEFA METHI CATHEDRAL BRANCH`;
  }, [season, dept]);

  if (!dept) return <Navigate to="/" replace />;

  const Icon = dept.icon;
  const eventDays = dept.events.map((e) => e.date);
  const dayEvents = dept.events.filter(
    (e) => selected && e.date.toDateString() === selected.toDateString()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar season={seasonLabel[season]} />

      {/* Hero */}
      <section className={`${dept.accent} text-primary-foreground py-20`}>
        <div className="container max-w-5xl">
          <Link to="/#departments" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-accent hover:text-accent-glow mb-6">
            <ArrowLeft className="w-4 h-4" /> All Ministries
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-background/15 flex items-center justify-center">
              <Icon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl mb-2">{dept.name}</h1>
              <p className="text-primary-foreground/85 max-w-2xl">{dept.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container max-w-5xl grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border/60 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Our Mission</p>
            <p className="font-display text-2xl text-primary leading-snug">{dept.mission}</p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border/60 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Our Vision</p>
            <p className="font-display text-2xl text-primary leading-snug">{dept.vision}</p>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="py-20 bg-gradient-soft">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">What's Happening</p>
            <h2 className="font-display text-3xl md:text-4xl text-primary">Ministry Calendar</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="bg-card rounded-2xl border border-border/60 shadow-soft p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={setSelected}
                modifiers={{ event: eventDays }}
                modifiersClassNames={{ event: "bg-accent/30 text-primary font-semibold rounded-full" }}
                className="p-3 pointer-events-auto"
              />
            </div>
            <div>
              <h3 className="font-display text-2xl text-primary mb-4">
                {selected?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              {dayEvents.length === 0 ? (
                <p className="text-muted-foreground">No ministry events on this day.</p>
              ) : (
                <ul className="space-y-3">
                  {dayEvents.map((e) => (
                    <li key={e.title} className="p-5 rounded-xl bg-card border-l-4 border-accent shadow-soft">
                      <div className="font-display text-xl text-primary">{e.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{e.time}</div>
                    </li>
                  ))}
                </ul>
              )}
              <h4 className="mt-10 mb-3 font-display text-xl text-primary">All upcoming</h4>
              <ul className="space-y-2">
                {dept.events.map((e, i) => (
                  <li key={i} className="flex justify-between text-sm py-2 border-b border-border/50">
                    <span className="text-foreground flex items-center gap-2"><CalIcon className="w-4 h-4 text-accent" />{e.title}</span>
                    <span className="text-muted-foreground">{e.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {e.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Memories</p>
            <h2 className="font-display text-3xl md:text-4xl text-primary">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {dept.gallery.map((g, i) => (
              <figure key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-burgundy flex items-center justify-center shadow-soft">
                <ImageIcon className="w-10 h-10 text-primary-foreground/60" />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-xs text-primary-foreground opacity-0 group-hover:opacity-100 transition-smooth">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6 italic">
            Photos will be uploaded by the {dept.name} director.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gradient-soft">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Servant Leaders</p>
            <h2 className="font-display text-3xl md:text-4xl text-primary">Leadership</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {dept.leaders.map((l) => (
              <div key={l.role} className="text-center">
                <div className="aspect-square rounded-2xl bg-gradient-burgundy mb-3 flex items-center justify-center text-primary-foreground font-display text-3xl shadow-soft">
                  {l.role.charAt(0)}
                </div>
                <div className="text-xs uppercase tracking-wider text-accent font-semibold">{l.role}</div>
                <div className="text-sm text-foreground">{l.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Stand With Us</p>
            <h2 className="font-display text-3xl md:text-4xl">Ways to Support</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {dept.support.map((s) => (
              <div key={s.title} className="p-6 rounded-2xl bg-background/5 border border-accent/30">
                <HeartHandshake className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-display text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-primary-foreground/80">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              <Link to="/#give">Give to the Church</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Department;
