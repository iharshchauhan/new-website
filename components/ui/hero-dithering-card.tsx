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
        <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/28 p-5 pb-3 shadow-[0_20px_80px_rgba(16,24,40,0.2)] backdrop-blur-2xl sm:p-7 sm:pb-4 md:p-8 md:pb-5">
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
            @keyframes wave {
              0%, 60%, 100% { transform: rotate(0deg); }
              10%, 30% { transform: rotate(16deg); }
              20% { transform: rotate(-8deg); }
              40% { transform: rotate(10deg); }
              50% { transform: rotate(-4deg); }
            }
            .animate-wave {
              transform-origin: 70% 70%;
              animation: wave 2.2s ease-in-out infinite;
            }
            @keyframes heroStatusBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.25; }
            }
            .hero-status-dot {
              animation: heroStatusBlink 1.1s ease-in-out infinite;
            }
          `}</style>

          <div className="relative z-10 flex min-h-[440px] flex-col text-slate-900/90">
            <div className="w-full space-y-4 text-left md:w-[88%]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-700">
                <span className="hero-status-dot h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Bengaluru, India
              </div>

              <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-primary sm:text-5xl md:text-6xl">
                Hey, Stranger! {"\u{1F44B}"}
              </h2>

              <div className="max-w-4xl space-y-3 text-[1.04rem] leading-relaxed text-slate-700 md:text-[1.08rem]">
                <p>Welcome to my little corner of the web.</p>
                <p>
                  I spend most of my time thinking about products, AI systems, and how software
                  actually works behind the scenes.
                </p>
                <p>
                  This site is basically my logbook; a place where I document ideas, experiments,
                  frameworks, and whatever interesting problem I&apos;m currently obsessed with.
                </p>
                <p className="text-[0.96rem] italic md:text-[1rem]">
                  My long-term plan is simple:
                </p>
                <p className="text-[0.96rem] italic md:text-[1rem]">
                  make a TON of money with computers... and then maybe stop using them entirely.
                </p>
                <p className="text-[0.9rem] italic md:text-[0.94rem]">
                  (just kidding... probably.)
                </p>
                <p>
                  Stick around if you like product thinking, system design, and the occasional
                  weird experiment.
                </p>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
              <a
                href="https://github.com/iharshchauhan"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com/harshc_"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </a>
              <a
                href="mailto:hey@iharsh.xyz"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-white/70 hover:text-slate-900"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
