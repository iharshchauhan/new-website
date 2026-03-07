"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function ReadingControls({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? window.scrollY / total : 0;
      setProgress(Math.max(0, Math.min(1, ratio)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[60] pointer-events-none">
      <div className="h-1 w-full bg-black/5">
        <div
          className="h-full bg-primary/85 transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleClose}
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/72 text-primary hover:bg-white transition-colors shadow-[0_6px_18px_rgba(24,52,47,0.12)]"
          aria-label="Close note"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
