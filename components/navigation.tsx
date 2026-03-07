"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", name: "Work", slashBadge: true },
  { href: "/about", name: "About" },
  { href: "/logbook?tab=Experiments", name: "Play", tab: "Experiments" },
  { href: "/logbook?tab=Notes", name: "Notes", tab: "Notes" },
  { href: "mailto:hey@iharsh.xyz", name: "Contact", external: true },
];

export function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  return (
    <nav className="fixed top-3 inset-x-0 z-50 px-4 sm:px-6">
      <div className="mx-auto w-fit rounded-full border border-white/70 bg-[#f3f2ea]/70 px-1.5 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isTabRoute = Boolean(item.tab);
            const isLogbook = pathname.startsWith("/logbook");
            const isActive = item.external
              ? false
              : isTabRoute
                ? isLogbook && activeTab === item.tab
                : pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 sm:px-5 py-2 text-[0.95rem] sm:text-[1.02rem] font-semibold text-foreground/80 transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                target={item.external ? "_self" : undefined}
              >
                <span className="inline-flex items-center gap-2">
                  {item.name}
                  {item.slashBadge && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-border/80 bg-white/40 text-primary text-[0.62rem]">
                      /
                    </span>
                  )}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-white/72"
                    transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
