const relative = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
const absolute = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

// "il y a 2 h" for recent dates, "3 mars 2026" once it is more than a week old
export function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(seconds) < 60) return "à l'instant";
  if (Math.abs(minutes) < 60) return relative.format(minutes, "minute");
  if (Math.abs(hours) < 24) return relative.format(hours, "hour");
  if (Math.abs(days) < 7) return relative.format(days, "day");

  return absolute.format(date);
}

// "inscrit en mai 2025"
export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(iso));
}
