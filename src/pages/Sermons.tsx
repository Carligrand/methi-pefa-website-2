import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/church/Navbar";
import { Footer } from "@/components/church/Footer";
import { getCurrentSeason, seasonLabel } from "@/lib/season";
import { supabase } from "@/integrations/supabase/client";

type Sermon = {
  id: string;
  title: string;
  speaker: string | null;
  preached_on: string | null;
  scripture: string | null;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  tags: string[];
};

const Sermons = () => {
  const season = useMemo(() => getCurrentSeason(), []);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("All");
  const [list, setList] = useState<Sermon[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-season", season);
    document.title = "Sermons Archive — Methi PEFA Church";
    supabase.from("sermons").select("*").eq("published", true).order("preached_on", { ascending: false })
      .then(({ data }) => setList((data as any) ?? []));
  }, [season]);

  const tagsList = ["All", ...Array.from(new Set(list.flatMap((s) => s.tags ?? [])))];
  const filtered = list.filter((s) => {
    const matchQ = `${s.title} ${s.speaker ?? ""} ${s.scripture ?? ""}`.toLowerCase().includes(q.toLowerCase());
    const matchT = tag === "All" || (s.tags ?? []).includes(tag);
    return matchQ && matchT;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar season={seasonLabel[season]} />

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container max-w-5xl">
          <Link to="/#live" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-accent hover:text-accent-glow mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Live Services
          </Link>
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">The Word, Preserved</p>
          <h1 className="font-display text-4xl md:text-6xl mb-4">Sermons Archive</h1>
          <p className="text-primary-foreground/85 max-w-2xl">
            Every Sunday message, midweek teaching, and special service — gathered in one place.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background border-b border-border/50">
        <div className="container max-w-5xl flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, speaker, or scripture" className="pl-9" />
          </div>
          {tagsList.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {tagsList.map((t) => (
                <button key={t} onClick={() => setTag(t)}
                  className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-smooth border ${
                    tag === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-accent"
                  }`}>{t}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-5xl grid gap-5">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No sermons match your search.</p>
          )}
          {filtered.map((s) => (
            <article key={s.id} className="group p-6 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-smooth flex gap-5">
              {s.thumbnail_url ? (
                <img src={s.thumbnail_url} alt={s.title} className="hidden sm:block w-24 h-24 rounded-xl object-cover" />
              ) : (
                <div className="hidden sm:flex shrink-0 w-20 h-20 rounded-xl bg-gradient-gold items-center justify-center shadow-gold">
                  <Play className="w-8 h-8 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 items-center text-xs uppercase tracking-widest text-accent font-semibold mb-2">
                  {s.preached_on && <span>{new Date(s.preached_on).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>}
                  {(s.tags ?? []).map((t) => <span key={t} className="text-muted-foreground">· {t}</span>)}
                </div>
                <h2 className="font-display text-2xl text-primary group-hover:text-accent transition-smooth">{s.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{s.speaker}{s.scripture ? ` · ${s.scripture}` : ""}</p>
                {s.description && <p className="text-sm text-foreground/80 mt-3">{s.description}</p>}
                {s.video_url && (
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <a href={s.video_url} target="_blank" rel="noreferrer"><Play className="w-3.5 h-3.5 mr-1.5" /> Watch</a>
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sermons;
