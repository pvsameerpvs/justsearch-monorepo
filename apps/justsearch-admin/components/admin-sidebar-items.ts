import {
  LayoutDashboard,
  Store,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Gamepad2,
  Megaphone,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/restaurants", label: "Restaurants", icon: Store },
  { href: "/ads", label: "Ad Campaigns", icon: Megaphone },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/revenue", label: "Revenue", icon: DollarSign },
  { href: "/users", label: "Users", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];
