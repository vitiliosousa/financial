// Mixes a user-chosen color toward --surface using theme-aware CSS custom
// properties (see app/globals.css), so "filled" cards/badges stay visible in
// both themes instead of receding into a near-black dark surface.
export function pastelFill(color: string): string {
  return `color-mix(in srgb, ${color} var(--pastel-mix), var(--surface))`;
}

export function pastelBorder(color: string): string {
  return `color-mix(in srgb, ${color} var(--pastel-border-mix), var(--surface))`;
}

export function pastelIconBg(color: string): string {
  return `color-mix(in srgb, ${color} var(--pastel-icon-mix), var(--surface))`;
}
