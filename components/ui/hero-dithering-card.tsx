'use client'

import { Github, Mail, Twitter } from 'lucide-react'

const PARTICLES = [
  { left: '6%', top: '18%', size: 4, duration: 7, delay: 0.4 },
  { left: '12%', top: '72%', size: 3, duration: 10, delay: 1.1 },
  { left: '19%', top: '38%', size: 2, duration: 8, delay: 0.2 },
  { left: '27%', top: '58%', size: 3, duration: 9, delay: 0.8 },
  { left: '34%', top: '24%', size: 4, duration: 11, delay: 0.5 },
  { left: '42%', top: '76%', size: 2, duration: 7, delay: 1.3 },
  { left: '49%', top: '41%', size: 3, duration: 8, delay: 0.6 },
  { left: '58%', top: '68%', size: 4, duration: 10, delay: 1.6 },
  { left: '64%', top: '22%', size: 2, duration: 7, delay: 0.1 },
  { left: '71%', top: '52%', size: 3, duration: 9, delay: 1.5 },
  { left: '79%', top: '32%', size: 4, duration: 8, delay: 0.7 },
  { left: '86%', top: '66%', size: 2, duration: 11, delay: 1.9 },
  { left: '91%', top: '44%', size: 3, duration: 10, delay: 0.9 },
]

export function CTASection() {
  return (
    <section className="w-full px-4 py-6 sm:px-6 md:px-8 md:py-8">
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-2xl sm:p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
              className="absolute -inset-[35%] opacity-65"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 20% 20%, rgba(236,78,2,0.45), transparent 34%), radial-gradient(ellipse at 70% 25%, rgba(236,78,2,0.30), transparent 38%), radial-gradient(ellipse at 45% 80%, rgba(236,78,2,0.35), transparent 40%), radial-gradient(ellipse at 90% 70%, rgba(236,78,2,0.28), transparent 36%)',
                filter: 'blur(32px) saturate(110%)',
                animation: 'heroAuroraFlow 18s ease-in-out infinite',
              }}
            />

            <div className="absolute inset-0 opacity-45 mix-blend-multiply">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(0,0,0,0.18) 0.8px, transparent 0.9px)',
                  backgroundSize: '6px 6px',
                  animation: 'heroNoiseDrift 20s linear infinite',
                }}
              />
            </div>

            {PARTICLES.map((particle, index) => (
              <span
                key={index}
                className="absolute rounded-full bg-[#ec4e02]/70"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  boxShadow: '0 0 14px rgba(236,78,2,0.55)',
                  animation: `heroParticleFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                }}
              />
            ))}
          </div>

          <style>{`
            @keyframes heroAuroraFlow {
              0% { transform: translate3d(-8%, -6%, 0) rotate(0deg) scale(1.06); }
              33% { transform: translate3d(5%, 2%, 0) rotate(4deg) scale(1.12); }
              66% { transform: translate3d(-2%, 8%, 0) rotate(-3deg) scale(1.08); }
              100% { transform: translate3d(-8%, -6%, 0) rotate(0deg) scale(1.06); }
            }
            @keyframes heroNoiseDrift {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(10px, 8px, 0); }
            }
            @keyframes heroParticleFloat {
              0%, 100% { transform: translate3d(0, 0, 0) scale(0.85); opacity: 0.45; }
              25% { transform: translate3d(3px, -8px, 0) scale(1); opacity: 0.95; }
              50% { transform: translate3d(-3px, -14px, 0) scale(1.08); opacity: 0.65; }
              75% { transform: translate3d(4px, -6px, 0) scale(0.95); opacity: 0.9; }
            }
          `}</style>

          <div className="relative z-10 space-y-6 text-foreground/90">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Hey, Stranger! <span className="inline-block animate-wave">👋</span>
            </h2>

            <div className="prose prose-neutral max-w-none text-foreground/75 sm:prose-lg">
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

            <div className="flex flex-row items-center gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 bg-white/60 p-3 text-foreground/75 shadow-sm transition-all hover:bg-white/85 hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 bg-white/60 p-3 text-foreground/75 shadow-sm transition-all hover:bg-white/85 hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:hey@iharsh.xyz"
                className="rounded-full border border-white/60 bg-white/60 p-3 text-foreground/75 shadow-sm transition-all hover:bg-white/85 hover:text-foreground"
              >
                <Mail className="h-5 w-5" />
import { useState } from 'react'
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
          `}</style>

          <div className="relative z-10 pb-2 text-slate-900/90 md:grid md:min-h-[440px] md:grid-cols-[168px_1fr] md:items-stretch md:gap-4">
            <div className="hidden flex-row flex-nowrap items-center gap-3 md:flex md:self-end md:pb-2">
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
