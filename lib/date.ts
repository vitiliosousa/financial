// Parses a "YYYY-MM-DD" date-only string as a LOCAL date instead of UTC
// (the native `new Date("2026-08-20")` parses date-only strings as UTC,
// which shifts the calendar day when the local timezone has a positive
// offset — causing "today's" transactions to fall out of the current month).
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Inverse of parseLocalDate: turns a Date back into a "YYYY-MM-DD" string
// using its local calendar fields, so a round trip through the database
// (which stores a Date) never shifts the calendar day.
export function toDateOnlyString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
