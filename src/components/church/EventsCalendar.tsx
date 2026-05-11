import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const events: { date: Date; title: string; time: string }[] = [
  { date: new Date(new Date().setDate(new Date().getDate() + 2)), title: "Midweek Bible Study", time: "6:00 PM" },
  { date: new Date(new Date().setDate(new Date().getDate() + 5)), title: "Sunday Main Service", time: "9:00 AM" },
  { date: new Date(new Date().setDate(new Date().getDate() + 5)), title: "Youth Service", time: "11:30 AM" },
  { date: new Date(new Date().setDate(new Date().getDate() + 12)), title: "Women's Fellowship", time: "3:00 PM" },
  { date: new Date(new Date().setDate(new Date().getDate() + 18)), title: "Men's Conference", time: "8:00 AM" },
];

export const EventsCalendar = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const eventDays = events.map((e) => e.date);
  const dayEvents = events.filter(
    (e) => selected && e.date.toDateString() === selected.toDateString()
  );

  return (
    <section id="calendar" className="py-24 bg-background">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Mark Your Calendar</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary">Upcoming Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-card rounded-2xl border border-border/60 shadow-soft p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              modifiers={{ event: eventDays }}
              modifiersClassNames={{ event: "bg-accent/30 text-primary font-semibold rounded-full" }}
              className={cn("p-3 pointer-events-auto")}
            />
          </div>
          <div>
            <h3 className="font-display text-2xl text-primary mb-4">
              {selected?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </h3>
            {dayEvents.length === 0 ? (
              <p className="text-muted-foreground">No events scheduled. Tap a highlighted day to see what's happening.</p>
            ) : (
              <ul className="space-y-3">
                {dayEvents.map((e) => (
                  <li key={e.title} className="p-5 rounded-xl bg-secondary/50 border-l-4 border-accent">
                    <div className="font-display text-xl text-primary">{e.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{e.time}</div>
                  </li>
                ))}
              </ul>
            )}
            <h4 className="mt-10 mb-3 font-display text-xl text-primary">All upcoming</h4>
            <ul className="space-y-2">
              {events.map((e, i) => (
                <li key={i} className="flex justify-between text-sm py-2 border-b border-border/50">
                  <span className="text-foreground">{e.title}</span>
                  <span className="text-muted-foreground">{e.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {e.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
