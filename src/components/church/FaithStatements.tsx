// Placeholder 20 statements - user will replace
const statements = Array.from({ length: 20 }, (_, i) => ({
  n: i + 1,
  title: `Statement of Faith ${i + 1}`,
  body: "Replace this text with the official PEFA statement of faith. This placeholder demonstrates how the auto-scrolling list will display each of the twenty statements with reverence and clarity.",
}));

export const FaithStatements = () => (
  <section id="faith" className="py-24 bg-background">
    <div className="container max-w-5xl">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">What We Believe</p>
        <h2 className="font-display text-4xl md:text-5xl text-primary mb-4">The 20 Statements of Faith</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Hover to pause. The full doctrine of the Pentecostal Evangelistic Fellowship of Africa.</p>
      </div>
      <div className="relative h-[440px] overflow-hidden faith-scroll rounded-2xl border border-border/60 bg-card shadow-soft">
        <div className="animate-scroll-y space-y-4 p-8">
          {[...statements, ...statements].map((s, idx) => (
            <article key={idx} className="flex gap-5 p-5 rounded-xl bg-secondary/40 border border-border/40">
              <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center font-display text-xl font-semibold text-primary shadow-gold">
                {s.n}
              </div>
              <div>
                <h3 className="font-display text-xl text-primary mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);
