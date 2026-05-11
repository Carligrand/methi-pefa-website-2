const order = [
  { time: "9:00 AM", item: "Praise & Worship" },
  { time: "9:30 AM", item: "Opening Prayer" },
  { time: "9:35 AM", item: "Scripture Reading" },
  { time: "9:45 AM", item: "Choir Ministration" },
  { time: "10:00 AM", item: "Offering & Tithes" },
  { time: "10:15 AM", item: "Sermon" },
  { time: "11:15 AM", item: "Altar Call & Prayer" },
  { time: "11:40 AM", item: "Announcements" },
  { time: "12:00 PM", item: "Benediction & Fellowship" },
];

type Props = { variant?: "section" | "inline" };

export const OrderOfService = ({ variant = "section" }: Props) => {
  const content = (
    <>
      <div className={variant === "inline" ? "mb-6" : "text-center mb-12"}>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Sunday Service</p>
        <h3 className={variant === "inline" ? "font-display text-2xl" : "font-display text-4xl md:text-5xl text-primary"}>
          Order of Service
        </h3>
      </div>
      <ol className="relative border-l-2 border-accent/40 space-y-5 ml-3">
        {order.map((o) => (
          <li key={o.item} className="pl-6 relative">
            <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-gradient-gold border-2 border-background shadow-gold" />
            <div className="text-[10px] uppercase tracking-widest text-accent font-semibold">{o.time}</div>
            <div className={variant === "inline" ? "font-display text-base" : "font-display text-xl text-primary"}>{o.item}</div>
          </li>
        ))}
      </ol>
    </>
  );

  if (variant === "inline") {
    return (
      <aside className="rounded-2xl bg-background/5 border border-accent/30 p-6 lg:sticky lg:top-20">
        {content}
      </aside>
    );
  }

  return (
    <section id="order" className="py-24 bg-background">
      <div className="container max-w-3xl">{content}</div>
    </section>
  );
};
