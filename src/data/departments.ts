import { Users, HeartHandshake, Sparkles, Baby, type LucideIcon } from "lucide-react";

export type Leader = { role: string; name: string };
export type DeptEvent = { date: Date; title: string; time: string };
export type Department = {
  id: "men" | "women" | "youth" | "children";
  name: string;
  short: string;
  description: string;
  mission: string;
  vision: string;
  icon: LucideIcon;
  accent: string;
  leaders: Leader[];
  activities: string[];
  events: DeptEvent[];
  gallery: { caption: string }[];
  support: { title: string; detail: string }[];
};

const leadersTemplate = (suffix: string): Leader[] => [
  { role: "Director", name: `Director — ${suffix}` },
  { role: "Deputy Director", name: `Deputy Director — ${suffix}` },
  { role: "Secretary", name: `Secretary — ${suffix}` },
  { role: "Vice Secretary", name: `Vice Secretary — ${suffix}` },
  { role: "Treasurer", name: `Treasurer — ${suffix}` },
  { role: "Member", name: `Committee Member — ${suffix}` },
];

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const galleryFor = (label: string) =>
  Array.from({ length: 6 }, (_, i) => ({ caption: `${label} — moment ${i + 1}` }));

const supportFor = (label: string) => [
  { title: "Give to the Ministry", detail: `Support ${label} via M-Pesa Paybill 522522, Account: METHI-${label.toUpperCase()}.` },
  { title: "Volunteer Your Time", detail: `Join the team — speak to the ${label} director after Sunday service.` },
  { title: "Pray With Us", detail: `Lift up ${label} in your daily prayers; intercession list available on request.` },
];

export const departments: Department[] = [
  {
    id: "men",
    name: "PEFA Men's Ministry",
    short: "Men of valor, fathers of faith.",
    description: "Equipping men to lead their families, workplaces, and communities with the wisdom and courage of Christ.",
    mission: "To raise godly men who lead their homes, workplaces, and communities by the wisdom and courage of Christ.",
    vision: "A generation of men marked by integrity, discipleship, and bold witness for the Kingdom.",
    icon: Users,
    accent: "bg-primary/95",
    leaders: leadersTemplate("Men's Ministry"),
    activities: ["Monthly Men's Breakfast — first Saturday", "Fathers' Mentorship Circle — Wednesdays", "Annual Men's Conference"],
    events: [
      { date: inDays(3), title: "Men's Bible Study", time: "6:30 PM" },
      { date: inDays(10), title: "Men's Breakfast", time: "8:00 AM" },
      { date: inDays(24), title: "Fathers' Mentorship", time: "7:00 PM" },
    ],
    gallery: galleryFor("Men's Ministry"),
    support: supportFor("Men's Ministry"),
  },
  {
    id: "women",
    name: "PEFA Women's Ministry",
    short: "Daughters of the King.",
    description: "A sisterhood of prayer, intercession, and discipleship — empowering women in every season of life.",
    mission: "To disciple, encourage, and empower women through the Word, prayer, and Spirit-filled fellowship.",
    vision: "Women rooted in Christ, raising families and shaping communities with grace and truth.",
    icon: HeartHandshake,
    accent: "bg-accent/90",
    leaders: leadersTemplate("Women's Ministry"),
    activities: ["Tuesday Intercession — 10 AM", "Women's Fellowship — 2nd Saturday", "Annual Women's Convention"],
    events: [
      { date: inDays(2), title: "Tuesday Intercession", time: "10:00 AM" },
      { date: inDays(13), title: "Women's Fellowship", time: "3:00 PM" },
      { date: inDays(28), title: "Women's Convention", time: "9:00 AM" },
    ],
    gallery: galleryFor("Women's Ministry"),
    support: supportFor("Women's Ministry"),
  },
  {
    id: "youth",
    name: "PEFA Youth Ministry",
    short: "Bold for Christ. Built for purpose.",
    description: "Raising the next generation of worshippers and leaders through teaching, fellowship, and bold mission.",
    mission: "To raise a generation of bold worshippers and leaders, anchored in Scripture and on fire for Christ.",
    vision: "Youth living wholeheartedly for Jesus — at school, online, and in every sphere of culture.",
    icon: Sparkles,
    accent: "bg-primary/80",
    leaders: leadersTemplate("Youth Ministry"),
    activities: ["Friday Youth Service — 6 PM", "Worship Team Practice — Saturdays", "Annual Youth Camp"],
    events: [
      { date: inDays(4), title: "Friday Youth Service", time: "6:00 PM" },
      { date: inDays(5), title: "Worship Practice", time: "10:00 AM" },
      { date: inDays(20), title: "Youth Camp Kickoff", time: "9:00 AM" },
    ],
    gallery: galleryFor("Youth Ministry"),
    support: supportFor("Youth Ministry"),
  },
  {
    id: "children",
    name: "PEFA Children's Ministry",
    short: "Let the little children come.",
    description: "Helping every child meet Jesus, learn the Word, and grow in love, joy, and creativity.",
    mission: "To help every child encounter Jesus, learn the Word, and grow in love, joy, and creativity.",
    vision: "Children who know they are loved by God and grow up to walk with Him all their days.",
    icon: Baby,
    accent: "bg-accent/70",
    leaders: leadersTemplate("Children's Ministry"),
    activities: ["Sunday School — 9 AM", "Holiday Bible Club", "Children's Sunday — Quarterly"],
    events: [
      { date: inDays(5), title: "Sunday School", time: "9:00 AM" },
      { date: inDays(12), title: "Sunday School", time: "9:00 AM" },
      { date: inDays(26), title: "Children's Sunday", time: "9:00 AM" },
    ],
    gallery: galleryFor("Children's Ministry"),
    support: supportFor("Children's Ministry"),
  },
];

export const getDepartment = (id?: string) => departments.find((d) => d.id === id);
