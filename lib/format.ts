export function formatCurrency(value: number): string {
  const isNegative = value < 0;
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? "-" : ""}${formatted} MT`;
}

export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1)}M MT`;
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(1)}K MT`;
  }
  return formatCurrency(value);
}

import { parseLocalDate } from "./date";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseLocalDate(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateInput(date: string | Date): string {
  const d = typeof date === "string" ? parseLocalDate(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

export function formatMonthLabel(month: number, year: number): string {
  const names = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${names[month]} ${year}`;
}

export function formatFullMonthLabel(month: number, year: number): string {
  const names = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${names[month]} de ${year}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
