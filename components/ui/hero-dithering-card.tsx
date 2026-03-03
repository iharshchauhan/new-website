'use client'

import { Github, Mail, Twitter } from 'lucide-react'
import { useState } from 'react'
import { HeroParticles } from '@/components/ui/hero-particles'

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="w-full px-4 py-6 sm:px-6 md:px-8 md:py-8">
      <div
        className="relative mx-auto w-full max-w-4xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-[#3a2a21] bg-[#0f0f10] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)] sm:p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 z-0">
            <HeroParticles />
            <div
              className={`absolute inset-0 ${isHovered ? 'animate-pulse' : ''} opacity-90`}
              style={{
                backgroundImage:
                  'radial-gradient(circle at 14% 20%, rgba(255,108,43,0.32), transparent 36%), radial-gradient(circle at 84% 22%, rgba(255,126,36,0.2), transparent 42%), radial-gradient(circle at 60% 82%, rgba(255,99,24,0.18), transparent 38%)',
                backgroundSize: '160% 160%',
                animation: 'heroGradientDrift 18s ease-in-out infinite',
              }}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.06) 75%, transparent 75%, transparent)',
                backgroundSize: '10px 10px',
                animation: 'heroGridPan 22s linear infinite',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_42%)]" />
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

          <div className="relative z-10 space-y-6 text-white/90">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-white/70">
              AI Powered Writing
            </div>

            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
              Your words, delivered perfectly.
            </h2>

            <div className="prose prose-invert max-w-none text-white/75 sm:prose-lg">
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

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://github.com/iharshchauhan"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white/70 shadow-sm transition-all hover:bg-white/20 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/harshc_"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white/70 shadow-sm transition-all hover:bg-white/20 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:hey@iharsh.xyz"
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white/70 shadow-sm transition-all hover:bg-white/20 hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

