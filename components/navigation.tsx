"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", name: "Home" },
  { href: "/about", name: "About" },
  { href: "/logbook", name: "Logbook" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 56);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-3 inset-x-0 z-50 px-4 sm:px-6">
      <div
        className={cn(
          "mx-auto w-fit rounded-full px-1.5 py-1.5 transition-all duration-300",
          isScrolled
            ? "border border-white/70 bg-[#f3f2ea]/70 backdrop-blur-sm shadow-[0_10px_30px_rgba(24,52,47,0.08)]"
            : "border border-transparent bg-transparent backdrop-blur-0 shadow-none",
        )}
      >
        <div className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isLogbookItem = item.href === "/logbook";
            const isActive = isLogbookItem
              ? pathname.startsWith("/logbook") || pathname.startsWith("/writing")
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 sm:px-5 py-2 text-[0.95rem] sm:text-[1.02rem] font-semibold transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {item.name}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full",
                      isScrolled ? "bg-white/72" : "bg-white/55",
                    )}
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
