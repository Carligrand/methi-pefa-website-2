import { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar as CalIcon,
  HeartHandshake,
  Image as ImageIcon,
  Users,
  Sparkles,
  Baby,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Navbar } from "@/components/church/Navbar";
import { Footer } from "@/components/church/Footer";
import { getCurrentSeason, seasonLabel } from "@/lib/season";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type Leader = { name: string; role: string; image_url?: string };

type Ministry = {
  id: string;
  name: string;
  tagline: string | null;
  mission: string | null;
  vision: string | null;
  support_info: string | null;
  leaders: Leader[];
  cover_image_url: string | null;
};

type MinistryEvent = {
  id: string;
  title: string;
  event_date: string; // ISO date string "YYYY-MM-DD"
  description: string | null;
};

type GalleryPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

// ─── Icon + accent map (keyed by ministry id) ────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  men: Users,
  women: HeartHandshake,
  youth: Sparkles,
  children: Baby,
};

const ACCENT_MAP: Record<string, string> = {
  men: "bg-primary/95",
  women: "bg-accent/90",
  youth: "bg-primary/80",
  children: "bg-primary/70",
};

const DEFAULT_ICON = Users;
const DEFAULT_ACCENT = "bg-primary/90";

// ─── Component ───────────────────────────────────────────────────────────────

const Department = () => {
  const { id } = useParams<{ id: string }>();
  const season = useMemo(() => getCurrentSeason(), []);

  const [ministry, setMinistry] = useState<Ministry | null | undefined>(
    undefined // undefined = loading, null = not found
  );
  const [events, setEvents] = useState<MinistryEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  // ── Fetch ministry ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) { setMinistry(null); return; }

    supabase
      .from("ministries")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setMinistry(
          data
            ? { ...data, leaders: Array.isArray(data.leaders) ? (data.leaders as Leader[]) : [] }
            : null
        );
      });
  }, [id]);

  // ── Fetch events ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    supabase
      .from("ministry_events")
      .select("id, title, event_date, description")
      .eq("ministry_id", id)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .then(({ data }) => setEvents((data as MinistryEvent[]) ?? []));
  }, [id]);

  // ── Fetch gallery ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    supabase
      .from("ministry_gallery")
      .select("id, image_url, caption, sort_order")
      .eq("ministry_id", id)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setGallery((data as GalleryPhoto[]) ?? []));
  }, [id]);

  // ── Page meta ──────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute("data-season", season);
    if (ministry) {
      document.title = `${ministry.name} — PEFA METHI CATHEDRAL BRANCH`;
    }
  }, [season, ministry]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (ministry === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Loading ministry…</p>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (ministry === null) return <Navigate to="/" replace />;

  // ── Derived values ─────────────────────────────────────────────────────────
  const Icon = ICON_MAP[ministry.id] ?? DEFAULT_ICON;
  const accent = ACCENT_MAP[ministry.id] ?? DEFAULT_ACCENT;

  const eventDays = events.map((e) => new Date(e.event_date + "T00:00:00"));

  const dayEvents = events.filter((e) => {
    if (!selected) return false;
    const evDate = new Date(e.event_date + "T00:00:00");
    return evDate.toDateString() === selected.toDateString();
  });

  const supportItems = ministry.support_info
    ? [{ title: "Support This Ministry", detail: ministry.support_info }]
    : [
        { title: "Give to the Ministry", detail: `Support ${ministry.name} via M-Pesa Paybill 247247.` },
        { title: "Volunteer Your Time", detail: `Join the team — speak to the ${ministry.name} director after Sunday service.` },
        { title: "Pray With Us", detail: `Lift up ${ministry.name} in your daily prayers.` },
      ];

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar season={seasonLabel[season]} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className={`${accent} text-primary-foreground py-20`}
        style={
          ministry.cover_image_url
            ? { backgroundImage: `url(${ministry.cover_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        <div className="container max-w-5xl">
          <Link
            to="/#departments"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-accent hover:text-accent-glow mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All Ministries
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-background/15 flex items-center justify-center">
              <Icon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl mb-2">{ministry.name}</h1>
              {ministry.tagline && (
                <p className="text-primary-foreground/85 max-w-2xl">{ministry.tagline}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────────────────────── */}
      {(ministry.mission || ministry.vision) && (
        <section className="py-20 bg-background">
          <div className="container max-w-5xl grid md:grid-cols-2 gap-8">
            {ministry.mission && (
              <div className="p-8 rounded-2xl bg-card border border-border/60 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Our Mission</p>
                <p className="font-display text-2xl text-primary leading-snug">{ministry.mission}</p>
              </div>
            )}
            {ministry.vision && (
              <div className="p-8 rounded-2xl bg-card border border-border/60 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Our Vision</p>
                <p className="font-display text-2xl text-primary leading-snug">{ministry.vision}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Events Calendar ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-soft">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">What's Happening</p>
            <h2 className="font-display text-3xl md:text-4xl text-primary">Ministry Calendar</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="bg-card rounded-2xl border border-border/60 shadow-soft p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={setSelected}
                modifiers={{ event: eventDays }}
                modifiersClassNames={{ event: "bg-accent/30 text-primary font-semibold rounded-full" }}
                className="p-3 pointer-events-auto"
              />
            </div>
            <div>
              <h3 className="font-display text-2xl text-primary mb-4">
                {selected?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              {dayEvents.length === 0 ? (
                <p className="text-muted-foreground">No ministry events on this day.</p>
              ) : (
                <ul className="space-y-3">
                  {dayEvents.map((e) => (
                    <li key={e.id} className="p-5 rounded-xl bg-card border-l-4 border-accent shadow-soft">
                      <div className="font-display text-xl text-primary">{e.title}</div>
                      {e.description && (
                        <div className="text-sm text-muted-foreground mt-1">{e.description}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {events.length > 0 && (
                <>
                  <h4 className="mt-10 mb-3 font-display text-xl text-primary">All upcoming</h4>
                  <ul className="space-y-2">
                    {events.map((e) => (
                      <li key={e.id} className="flex justify-between text-sm py-2 border-b border-border/50">
                        <span className="text-foreground flex items-center gap-2">
                          <CalIcon className="w-4 h-4 text-accent" />
                          {e.title}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(e.event_date + "T00:00:00").toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {events.length === 0 && (
                <p className="text-muted-foreground mt-6 text-sm italic">No upcoming events scheduled yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Memories</p>
            <h2 className="font-display text-3xl md:text-4xl text-primary">Gallery</h2>
          </div>
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((photo) => (
                <figure
                  key={photo.id}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-burgundy shadow-soft"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption ?? ""}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {photo.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-xs text-primary-foreground opacity-0 group-hover:opacity-100 transition-smooth">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <figure
                  key={i}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-burgundy flex items-center justify-center shadow-soft"
                >
                  <ImageIcon className="w-10 h-10 text-primary-foreground/40" />
                </figure>
              ))}
            </div>
          )}
          {gallery.length === 0 && (
            <p className="text-center text-xs text-muted-foreground mt-6 italic">
              Photos will be uploaded by the {ministry.name} director.
            </p>
          )}
        </div>
      </section>

      {/* ── Leadership ────────────────────────────────────────────────────── */}
      {ministry.leaders.length > 0 && (
        <section className="py-20 bg-gradient-soft">
          <div className="container max-w-5xl">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Servant Leaders</p>
              <h2 className="font-display text-3xl md:text-4xl text-primary">Leadership</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {ministry.leaders.map((l, i) => (
                <div key={i} className="text-center">
                  {l.image_url ? (
                    <img
                      src={l.image_url}
                      alt={l.name}
                      className="aspect-square rounded-2xl w-full object-cover mb-3 shadow-soft"
                    />
                  ) : (
                    <div className="aspect-square rounded-2xl bg-gradient-burgundy mb-3 flex items-center justify-center text-primary-foreground font-display text-3xl shadow-soft">
                      {l.role.charAt(0)}
                    </div>
                  )}
                  <div className="text-xs uppercase tracking-wider text-accent font-semibold">{l.role}</div>
                  <div className="text-sm text-foreground">{l.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Support ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Stand With Us</p>
            <h2 className="font-display text-3xl md:text-4xl">Ways to Support</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {supportItems.map((s) => (
              <div key={s.title} className="p-6 rounded-2xl bg-background/5 border border-accent/30">
                <HeartHandshake className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-display text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-primary-foreground/80">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/#give"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-sm uppercase tracking-widest font-semibold transition-smooth"
            >
              Give to the Church
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Department;