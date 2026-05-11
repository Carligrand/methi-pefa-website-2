import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Users, CalendarDays, Image as ImageIcon } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ sermons: 0, pastors: 0, events: 0, gallery: 0 });

  useEffect(() => {
    document.title = "Admin · Dashboard";
    (async () => {
      const [s, p, e, g] = await Promise.all([
        supabase.from("sermons").select("id", { count: "exact", head: true }),
        supabase.from("past_pastors").select("id", { count: "exact", head: true }),
        supabase.from("ministry_events").select("id", { count: "exact", head: true }),
        supabase.from("ministry_gallery").select("id", { count: "exact", head: true }),
      ]);
      setStats({ sermons: s.count ?? 0, pastors: p.count ?? 0, events: e.count ?? 0, gallery: g.count ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Sermons", value: stats.sermons, icon: Mic },
    { label: "Past Pastors", value: stats.pastors, icon: Users },
    { label: "Ministry Events", value: stats.events, icon: CalendarDays },
    { label: "Gallery Photos", value: stats.gallery, icon: ImageIcon },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-primary mb-2">Welcome back</h1>
      <p className="text-muted-foreground mb-8">Manage every part of the PEFA Methi Cathedral Branch website from here.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="p-5 rounded-xl bg-card border border-border shadow-soft">
            <c.icon className="w-5 h-5 text-accent mb-3" />
            <div className="text-3xl font-display text-primary">{c.value}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
