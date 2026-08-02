import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  CalendarDays,
  FileText,
  Handshake,
  Image,
  Inbox,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  School,
  Settings,
  Users,
} from "lucide-react";

import { routes } from "@/config/routes";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Restricts the item to administrators. */
  adminOnly?: boolean;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

/**
 * Admin console navigation.
 *
 * Grouped by what an editor is trying to do rather than by database table:
 * publishing, managing relationships, and handling what the public sent in.
 */
export const adminNavigation: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: routes.admin.root, icon: LayoutDashboard }],
  },
  {
    label: "Publishing",
    items: [
      { label: "Articles", href: routes.admin.articles, icon: FileText },
      { label: "Events", href: routes.admin.events, icon: CalendarDays },
      { label: "Gallery", href: routes.admin.gallery, icon: Image },
      { label: "Programme", href: routes.admin.programs, icon: BookOpenCheck },
    ],
  },
  {
    label: "Relationships",
    items: [
      { label: "Partners", href: routes.admin.partners, icon: Handshake },
      { label: "Testimonials", href: routes.admin.testimonials, icon: MessageSquareQuote },
      { label: "Schools", href: routes.admin.schools, icon: School },
    ],
  },
  {
    label: "Inbox",
    items: [
      { label: "Submissions", href: routes.admin.submissions, icon: Inbox },
      { label: "Subscribers", href: routes.admin.subscribers, icon: Mail },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Media library", href: routes.admin.media, icon: Image },
      { label: "Users", href: routes.admin.users, icon: Users, adminOnly: true },
      { label: "Settings", href: routes.admin.settings, icon: Settings, adminOnly: true },
    ],
  },
];
