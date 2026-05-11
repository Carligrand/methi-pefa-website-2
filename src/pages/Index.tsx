import { useEffect, useMemo } from "react";
import { getCurrentSeason, seasonLabel } from "@/lib/season";
import { Navbar } from "@/components/church/Navbar";
import { Hero } from "@/components/church/Hero";
import { MissionVision } from "@/components/church/MissionVision";
import { FaithStatements } from "@/components/church/FaithStatements";
import { LiveStream } from "@/components/church/LiveStream";
import { EventsCalendar } from "@/components/church/EventsCalendar";
import { Departments } from "@/components/church/Departments";
import { Devotionals } from "@/components/church/Devotionals";
import { History } from "@/components/church/History";

import { MeetTheBishop } from "@/components/church/MeetTheBishop";
import { Engage } from "@/components/church/Engage";
import { PrayerRequest } from "@/components/church/PrayerRequest";
import { Donate } from "@/components/church/Donate";
import { Footer } from "@/components/church/Footer";

const Index = () => {
  const season = useMemo(() => getCurrentSeason(), []);

  useEffect(() => {
    document.documentElement.setAttribute("data-season", season);
    document.title = "Methi PEFA Church — A House of Worship & Welcome";
    const desc = "Methi PEFA Church: Pentecostal worship, livestream services, ministries, devotionals, events and giving. Welcome home.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
    m.setAttribute("content", desc);
  }, [season]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar season={seasonLabel[season]} />
      <main>
        <Hero />
        <MissionVision />
        <FaithStatements />
        <LiveStream />
        <EventsCalendar />
        <Departments />
        <Devotionals />
        <History />
        <MeetTheBishop />
        <Engage />
        <PrayerRequest />
        <Donate />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
