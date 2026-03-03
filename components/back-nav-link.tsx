'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackNavLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Link>
  );
}
