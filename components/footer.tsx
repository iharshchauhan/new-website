import { Github, Twitter, Instagram, Music } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full max-w-4xl mx-auto py-12 px-6 md:px-12 text-sm text-muted-foreground flex flex-col items-center space-y-8">
      <div className="w-full flex justify-center overflow-hidden text-[#6b21a8] text-[10px] tracking-[0.5em] opacity-80">
        {Array.from({ length: 60 }).map((_, i) => (
          <span key={i}>•</span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-center text-[#4b5563]">
        <div className="flex items-center space-x-4 mr-2">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <span className="opacity-50">|</span>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <span className="opacity-50">|</span>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <span className="opacity-50">|</span>
          <a href="#" className="hover:text-foreground transition-colors">
            <Music className="w-4 h-4" />
          </a>
        </div>
        <span className="hidden sm:inline opacity-50">|</span>
        <span className="w-full sm:w-auto">2025 © Harsh Chauhan</span>
        <span className="hidden sm:inline opacity-50">|</span>
        <Link href="/contact" className="hover:text-foreground transition-colors border-b-2 border-[#166534] pb-0.5">Contact</Link>
        <span className="hidden sm:inline opacity-50">|</span>
        <span className="w-full sm:w-auto">This page visit emitted <span className="border-b-2 border-[#166534] pb-0.5">0.04g of CO2</span> :)</span>
      </div>
    </footer>
  );
}
