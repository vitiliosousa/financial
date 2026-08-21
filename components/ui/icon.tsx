import type { IconName } from "@/lib/types";
import { MaterialIcon } from "./material-icon";

export const ICON_MAP: Record<IconName, string> = {
  wallet: "account_balance_wallet",
  landmark: "account_balance",
  smartphone: "smartphone",
  "credit-card": "credit_card",
  "piggy-bank": "savings",
  utensils: "restaurant",
  car: "directions_car",
  wifi: "wifi",
  briefcase: "work",
  "gamepad-2": "sports_esports",
  home: "home",
  "heart-pulse": "cardiology",
  "graduation-cap": "school",
  shirt: "checkroom",
  plane: "flight",
  gift: "redeem",
  "shopping-cart": "shopping_cart",
  receipt: "receipt_long",
  "trending-up": "trending_up",
  coins: "payments",
  target: "track_changes",
  "plus-circle": "add_circle",
  sparkles: "auto_awesome",
  dumbbell: "fitness_center",
  dog: "pets",
  "more-horizontal": "more_horiz",
};

export const ICON_NAMES = Object.keys(ICON_MAP) as IconName[];

export function DynamicIcon({
  name,
  className,
  size,
}: {
  name: IconName;
  className?: string;
  size?: number;
}) {
  return <MaterialIcon name={ICON_MAP[name] ?? "wallet"} className={className} size={size} />;
}
