import { HandHeart, UsersRound, BookMarked, PenLine } from "lucide-react";

const blocks = [
  { icon: HandHeart, title: "Volunteer", body: "Serve in worship, ushering, media, hospitality, children's ministry and outreach. Your gifts have a home here." },
  { icon: UsersRound, title: "Community Groups", body: "Small groups gathering across Methi for Bible study, prayer, and friendship throughout the week." },
  { icon: BookMarked, title: "How to Read the Bible", body: "New to Scripture? Start with the Gospel of John, then Psalms. We have reading plans, mentors, and study guides." },
  { icon: PenLine, title: "Blog & Teaching", body: "Sermons, teaching notes, and reflections from the pulpit and pews of PEFA Methi Cathedral Branch." },
];

export const Engage = () => (
  <section id="engage" className="py-24 bg-primary/5">
    <div className="container max-w-6xl">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Get Involved</p>
        <h2 className="font-display text-4xl md:text-5xl text-primary">Walk With Us</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blocks.map(({ icon: Icon, title, body }) => (
          <article key={title} className="p-7 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center mb-4 shadow-gold">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-xl text-primary mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
