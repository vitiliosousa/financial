"use client";

import { useLinkStatus } from "next/link";
import { MaterialIcon } from "./material-icon";
import { cn } from "@/lib/cn";

// Swaps a nav item's icon for a small spinner while its <Link> navigation is
// pending — this app's shared (app)/layout.tsx re-fetches session + all
// finance data on every navigation, so pages can take a couple of seconds to
// switch. Without this, that delay reads as the app being frozen.
export function NavLinkIcon({
  name,
  size = 20,
  filled,
  className,
}: {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  const { pending } = useLinkStatus();

  if (pending) {
    return (
      <span
        className={cn("animate-spinner inline-block shrink-0 rounded-full border-2 border-current opacity-70", className)}
        style={{ width: size, height: size, borderTopColor: "transparent" }}
      />
    );
  }

  return <MaterialIcon name={name} size={size} filled={filled} className={className} />;
}
