"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Mail, Receipt, MoreHorizontal } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Guests", href: "/guests", icon: Users },
  { label: "Kankotri", href: "/kankotri", icon: Mail },
  { label: "Bills", href: "/bills", icon: Receipt },
  { label: "More", href: "/more", icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/50 bg-cream/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_14px_rgba(26,22,22,0.06)] backdrop-blur-md"
      aria-label="Main Navigation"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[48px] min-w-[48px] flex-1 select-none flex-col items-center justify-center py-1 transition-colors ${
                isActive
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={`rounded-full px-4 py-1 transition-colors ${
                  isActive ? "bg-rose" : ""
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "stroke-[2.25]" : "stroke-[1.75]"
                  }`}
                />
              </div>
              <span className="mt-0.5 text-xs leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}