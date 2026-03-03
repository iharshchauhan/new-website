'use client'

import { Github, Mail, Twitter } from 'lucide-react'
import { useState } from 'react'

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="w-full px-4 py-6 sm:px-6 md:px-8 md:py-8">
      <div
        className="relative mx-auto w-full max-w-4xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-2xl sm:p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-60">
            <div
              className={`absolute inset-0 ${isHovered ? 'animate-pulse' : ''}`}
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(236,78,2,0.26), transparent 36%), radial-gradient(circle at 80% 25%, rgba(236,78,2,0.18), transparent 42%), radial-gradient(circle at 60% 80%, rgba(236,78,2,0.2), transparent 38%)',
                backgroundSize: '160% 160%',
                animation: 'heroGradientDrift 16s ease-in-out infinite',
              }}
            />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.04) 75%, transparent 75%, transparent)',
                backgroundSize: '8px 8px',
                animation: 'heroGridPan 18s linear infinite',
              }}
            />
          </div>

          <style>{`
            @keyframes heroGradientDrift {
              0% { transform: translate3d(-3%, -2%, 0) scale(1.02); }
              50% { transform: translate3d(3%, 2%, 0) scale(1.06); }
              100% { transform: translate3d(-3%, -2%, 0) scale(1.02); }
            }
            @keyframes heroGridPan {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(8px, 8px, 0); }
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

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/iharshchauhan"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 bg-white/50 p-3 text-muted-foreground shadow-sm transition-all hover:bg-white/80 hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/harshc_"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 bg-white/50 p-3 text-muted-foreground shadow-sm transition-all hover:bg-white/80 hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:hey@iharsh.xyz"
                className="rounded-full border border-white/60 bg-white/50 p-3 text-muted-foreground shadow-sm transition-all hover:bg-white/80 hover:text-foreground"
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
