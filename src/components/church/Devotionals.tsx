import { BookOpen } from "lucide-react";

const devotionals = [
  { date: "Today", verse: "Psalm 23:1", title: "The Lord Is My Shepherd", body: "When the Lord leads, the soul lacks nothing. Today, rest in the certainty that He goes before you." },
  { date: "Yesterday", verse: "Philippians 4:6-7", title: "Peace That Guards", body: "Anxiety loses its grip the moment we kneel. Trade worry for worship and let God's peace stand watch over your heart." },
  { date: "2 days ago", verse: "Isaiah 40:31", title: "Wait and Soar", body: "Waiting on God is not wasted time — it is the runway from which eagles rise. Renew your strength in His presence." },
];

export const Devotionals = () => (
  <section id="devotionals" className="py-24 bg-background">
    <div className="container max-w-5xl">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Daily Bread</p>
        <h2 className="font-display text-4xl md:text-5xl text-primary">Devotionals</h2>
        <p className="text-muted-foreground mt-3">A short word from Scripture each day.</p>
      </div>
      <div className="space-y-5">
        {devotionals.map((d) => (
          <article key={d.title} className="p-7 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-smooth">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-accent font-semibold mb-3">
              <BookOpen className="w-4 h-4" /> {d.date} · {d.verse}
            </div>
            <h3 className="font-display text-2xl text-primary mb-2">{d.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{d.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
