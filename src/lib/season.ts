export type Season = "default" | "christmas" | "easter" | "lent" | "pentecost";

// Approx liturgical windows. Easter/Lent shift each year — keep simple for now.
export function getCurrentSeason(date = new Date()): Season {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Christmas: Dec 1 - Jan 6
  if ((m === 12) || (m === 1 && d <= 6)) return "christmas";
  // Lent: roughly mid-Feb to late March
  if ((m === 2 && d >= 14) || (m === 3 && d <= 28)) return "lent";
  // Easter: late March - April
  if ((m === 3 && d >= 29) || m === 4) return "easter";
  // Pentecost: late May - early June
  if ((m === 5 && d >= 20) || (m === 6 && d <= 15)) return "pentecost";
  return "default";
}

export const seasonLabel: Record<Season, string> = {
  default: "Ordinary Time",
  christmas: "Christmas Season",
  easter: "Eastertide",
  lent: "Lent",
  pentecost: "Pentecost",
};
