import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/church/Navbar";
import { Footer } from "@/components/church/Footer";
import { getCurrentSeason, seasonLabel } from "@/lib/season";
import { supabase } from "@/integrations/supabase/client";

type Pastor = { id: string; name: string; years: string; title: string; accomplishments: string[] };

const HistoryPage = () => {
  const season = useMemo(() => getCurrentSeason(), []);
  const [history, setHistory] = useState<{ full_history: string | null } | null>(null);
  const [pastors, setPastors] = useState<Pastor[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-season", season);
    document.title = "Our History — Methi PEFA Church";
    supabase.from("church_history").select("full_history").limit(1).maybeSingle().then(({ data }) => setHistory(data ?? null));
    supabase.from("past_pastors").select("*").order("sort_order").then(({ data }) => setPastors((data as any) ?? []));
  }, [season]);

  const paragraphs = (history?.full_history ?? "").split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar season={seasonLabel[season]} />

      <section className="bg-gradient-burgundy text-primary-foreground py-20">
        <div className="container max-w-4xl">
          <Link to="/#history" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-accent hover:text-accent-glow mb-6">
            <ArrowLeft className="w-4 h-4" /> Back Home
          </Link>
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">A Legacy of Faith</p>
          <h1 className="font-display text-4xl md:text-6xl mb-4">The Story of Methi PEFA</h1>
          <p className="text-primary-foreground/85 max-w-2xl leading-relaxed">
            From a small gathering under a tree to a vibrant multi-generational congregation —
            this is the unfolding story of God's faithfulness through the years.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-3xl prose prose-lg text-muted-foreground space-y-5 leading-relaxed">
          {paragraphs.length === 0 && <p className="italic">No history written yet.</p>}
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="py-20 bg-gradient-soft">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Faithful Shepherds</p>
            <h2 className="font-display text-4xl text-primary">Past Pastors & Bishops</h2>
          </div>
          <ol className="relative border-l-2 border-accent/40 space-y-10 ml-4">
            {pastors.map((p) => (
              <li key={p.id} className="pl-8 relative">
                <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-gradient-gold border-2 border-background shadow-gold" />
                <div className="text-xs uppercase tracking-widest text-accent font-semibold">{p.years} · {p.title}</div>
                <h3 className="font-display text-2xl text-primary mt-1 mb-3">{p.name}</h3>
                <ul className="space-y-2 text-foreground/85">
                  {p.accomplishments.map((a, i) => (
                    <li key={i} className="flex gap-3"><span className="text-accent">✦</span><span>{a}</span></li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HistoryPage;
