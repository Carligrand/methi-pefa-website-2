import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const History = () => {
  const [intro, setIntro] = useState<string>("");
  useEffect(() => {
    supabase.from("church_history").select("intro").limit(1).maybeSingle()
      .then(({ data }) => setIntro(data?.intro ?? ""));
  }, []);

  return (
    <section id="history" className="py-24 bg-primary/5">
      <div className="container max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4 text-center">Our Story</p>
        <h2 className="font-display text-4xl md:text-5xl text-primary text-center mb-10">A Legacy of Faith</h2>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-5 leading-relaxed text-center">
          <p>{intro || "Loading our story…"}</p>
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant text-sm uppercase tracking-widest font-semibold transition-smooth group"
          >
            Read Our Full History
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
