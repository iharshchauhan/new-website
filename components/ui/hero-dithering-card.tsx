'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="w-full px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
      <div
        className="relative mx-auto w-full max-w-7xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-sm duration-500 sm:min-h-[520px] sm:rounded-[36px] sm:p-10 md:min-h-[600px] md:rounded-[48px]">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-60">
            <div
              className={`absolute inset-0 ${
                isHovered ? 'animate-pulse' : ''
              }`}
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(236,78,2,0.26), transparent 36%), radial-gradient(circle at 80% 25%, rgba(236,78,2,0.18), transparent 42%), radial-gradient(circle at 60% 80%, rgba(236,78,2,0.2), transparent 38%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.04) 75%, transparent 75%, transparent)',
                backgroundSize: '8px 8px',
              }}
            />
          </div>

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-2 text-center sm:px-4">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm sm:mb-8 sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              AI-Powered Writing
            </div>

            <h2 className="mb-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-8xl">
              Your words, <br />
              <span className="text-foreground/80">delivered perfectly.</span>
            </h2>

            <p className="mb-10 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:mb-12 sm:text-lg md:text-xl">
              Join 2,847 founders using the only AI that understands the nuance of your voice.
              Clean, precise, and uniquely yours.
            </p>

            <button className="group relative inline-flex h-12 items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:ring-4 hover:ring-primary/20 active:scale-95 sm:h-14 sm:px-12 sm:text-base">
              <span className="relative z-10">Start Typing</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
