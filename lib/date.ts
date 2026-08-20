// Parses a "YYYY-MM-DD" date-only string as a LOCAL date instead of UTC
// (the native `new Date("2026-08-20")` parses date-only strings as UTC,
// which shifts the calendar day when the local timezone has a positive
// offset — causing "today's" transactions to fall out of the current month).
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
