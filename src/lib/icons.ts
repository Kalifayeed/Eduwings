import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CircuitBoard,
  CloudSun,
  Compass,
  Cog,
  Flame,
  Gauge,
  Globe2,
  GraduationCap,
  HandHeart,
  Handshake,
  HeartHandshake,
  Landmark,
  Lightbulb,
  MapPin,
  Microscope,
  Navigation,
  PencilRuler,
  Plane,
  PlaneTakeoff,
  Radar,
  RadioTower,
  Rocket,
  Route,
  School,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Telescope,
  Truck,
  Users,
  Wind,
  Wrench,
} from "lucide-react";

/**
 * Explicit icon registry.
 *
 * Content records reference icons by name so that editorial data stays free of
 * React imports. An explicit map — rather than a dynamic `lucide-react` lookup —
 * keeps tree-shaking effective: only these icons reach the client bundle.
 */
const ICONS = {
  Activity,
  Award,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CircuitBoard,
  CloudSun,
  Compass,
  Cog,
  Flame,
  Gauge,
  Globe2,
  GraduationCap,
  HandHeart,
  Handshake,
  HeartHandshake,
  Landmark,
  Lightbulb,
  MapPin,
  Microscope,
  Navigation,
  PencilRuler,
  Plane,
  PlaneTakeoff,
  Radar,
  RadioTower,
  Rocket,
  Route,
  School,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Telescope,
  Truck,
  Users,
  Wind,
  Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** Resolve an icon by name, falling back to the brand mark when unknown. */
export function resolveIcon(name: string): LucideIcon {
  return ICONS[name as IconName] ?? Plane;
}

export { ICONS };
