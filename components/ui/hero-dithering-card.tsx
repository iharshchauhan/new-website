'use client'

import { useState } from 'react'
import { Github, Mail, Twitter } from 'lucide-react'
import { HeroParticles } from '@/components/ui/hero-particles'

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="w-full px-2 py-4 sm:px-4 md:px-6 md:py-6">
      <div
        className="relative mx-auto w-full max-w-5xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/28 p-5 shadow-[0_20px_80px_rgba(16,24,40,0.2)] backdrop-blur-2xl sm:p-7 md:p-8">
          <div className="pointer-events-none absolute inset-0 z-0">
            <HeroParticles />
            <div
              className={`absolute inset-0 ${isHovered ? 'animate-pulse' : ''} opacity-70`}
              style={{
                backgroundImage:
                  'radial-gradient(circle at 14% 20%, rgba(255,146,99,0.28), transparent 36%), radial-gradient(circle at 84% 22%, rgba(125,168,255,0.22), transparent 42%), radial-gradient(circle at 60% 82%, rgba(140,237,214,0.2), transparent 38%)',
                backgroundSize: '160% 160%',
                animation: 'heroGradientDrift 12s ease-in-out infinite',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)',
                backgroundSize: '10px 10px',
                animation: 'heroGridPan 14s linear infinite',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_52%)]" />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/55 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/45" />
          </div>

          <style>{`
            @keyframes heroGradientDrift {
              0% { transform: translate3d(-3%, -2%, 0) scale(1.02); }
              50% { transform: translate3d(3%, 2%, 0) scale(1.06); }
              100% { transform: translate3d(-3%, -2%, 0) scale(1.02); }
            }
            @keyframes heroGridPan {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(10px, 10px, 0); }
            }
          `}</style>

          <div className="relative z-10 pb-2 text-slate-900/90 md:grid md:min-h-[440px] md:grid-cols-[72px_1fr] md:items-stretch md:gap-4">
            <div className="hidden flex-row items-center gap-3 md:flex md:self-end md:pb-2">
              <a
                href="https://github.com/iharshchauhan"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 bg-white/45 p-2.5 text-slate-600 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="GitHub"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://twitter.com/harshc_"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 bg-white/45 p-2.5 text-slate-600 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="Twitter"
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a
                href="mailto:hey@iharsh.xyz"
                className="rounded-full border border-white/60 bg-white/45 p-2.5 text-slate-600 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="Email"
              >
                <Mail className="h-4.5 w-4.5" />
              </a>
            </div>

            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-white/60 bg-white/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-700">
                AI Powered Writing
              </div>

              <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                Your words, delivered perfectly.
              </h2>

              <div className="mx-auto max-w-2xl space-y-3 text-[1.04rem] leading-relaxed text-slate-700 md:text-[1.08rem]">
                <p>
                  Welcome to my little corner of the web! I&apos;m a Product/Growth enthusiast and an
                  amateur human figuring out both the world and the web.
                </p>
                <p>
                  I dream of making a TON of money with computers, and then... maybe never touching
                  one again (just kidding... or am I?)
                </p>
                <p>
                  Stick around as I document cool stuff and try to create content that&apos;s as
                  engaging as my playlist.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-row items-center gap-3 md:hidden">
              <a
                href="https://github.com/iharshchauhan"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 bg-white/45 p-2.5 text-slate-600 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="GitHub"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://twitter.com/harshc_"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 bg-white/45 p-2.5 text-slate-600 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="Twitter"
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a
                href="mailto:hey@iharsh.xyz"
                className="rounded-full border border-white/60 bg-white/45 p-2.5 text-slate-600 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="Email"
              >
                <Mail className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
