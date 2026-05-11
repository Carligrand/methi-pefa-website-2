import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { departments } from "@/data/departments";

export const Departments = () => {
  return (
    <section id="departments" className="py-24 bg-gradient-soft">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Find Your Place</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary">Our Ministries</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((d) => {
            const Icon = d.icon;
            return (
              <Link
                key={d.id}
                to={`/ministries/${d.id}`}
                className="group text-left rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-smooth border border-border/50 bg-card"
              >
                <div className={`${d.accent} p-8 text-primary-foreground h-40 flex items-end`}>
                  <Icon className="w-14 h-14 opacity-90" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-primary mb-2 group-hover:text-accent transition-smooth">{d.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{d.short}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-accent">
                    Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
