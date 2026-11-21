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
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto h-16 px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 min-h-[48px] min-w-[48px] py-1 transition-colors select-none ${
                isActive
                  ? "text-rose-700 font-semibold"
                  : "text-stone-500 hover:text-stone-900 font-medium"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  isActive ? "bg-rose-50 scale-105" : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "stroke-[2.5]" : "stroke-[1.75]"
                  }`}
                />
              </div>
              <span className="text-[11px] tracking-tight leading-tight mt-0.5">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
