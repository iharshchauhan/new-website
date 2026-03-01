"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/logbook", name: "Logbook" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background/80 backdrop-blur-md border border-border shadow-sm px-2 py-2 rounded-full flex items-center space-x-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
