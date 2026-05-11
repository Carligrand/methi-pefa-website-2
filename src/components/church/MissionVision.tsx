import { Compass, Eye, Heart } from "lucide-react";

const items = [
  {
    icon: Compass,
    title: "Our Mission",
    body: "To make disciples of Jesus Christ by proclaiming the gospel, nurturing believers in the Word, and equipping every member to serve God and humanity through love, holiness, and the power of the Holy Spirit.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "A Spirit-filled, Christ-centered community impacting Methi and the nations — raising generations of worshippers, intercessors, and kingdom workers who reflect Christ in every sphere of life.",
  },
  {
    icon: Heart,
    title: "Our Values",
    body: "The Word of God, Prayer, Worship, Family, Integrity, Servanthood, and the Great Commission. We hold fast to the full gospel of Pentecostal faith.",
  },
];

export const MissionVision = () => (
  <section id="about" className="py-24 bg-gradient-soft">
    <div className="container max-w-6xl">
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Who We Are</p>
        <h2 className="font-display text-4xl md:text-5xl text-primary">Anchored in Christ. Sent to the world.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {items.map(({ icon: Icon, title, body }) => (
          <article key={title} className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elegant transition-smooth border border-border/60">
            <div className="w-14 h-14 rounded-xl bg-gradient-burgundy flex items-center justify-center mb-6 shadow-soft">
              <Icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl text-primary mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
