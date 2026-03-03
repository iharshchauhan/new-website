'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let particles: Particle[] = []

    const buildParticles = (count: number, w: number, h: number): Particle[] =>
      Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        r: Math.random() * 1.8 + 0.5,
        a: Math.random() * 0.5 + 0.15,
      }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(36, Math.min(130, Math.floor((rect.width * rect.height) / 11000)))
      particles = buildParticles(count, rect.width, rect.height)
    }

    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      ctx.clearRect(0, 0, w, h)

      const glow = ctx.createRadialGradient(w * 0.18, h * 0.2, 0, w * 0.2, h * 0.22, Math.max(w, h) * 0.7)
      glow.addColorStop(0, 'rgba(255, 122, 48, 0.24)')
      glow.addColorStop(1, 'rgba(255, 122, 48, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      particles.forEach((p) => {
        if (!reduceMotion) {
          p.x += p.vx
          p.y += p.vy

          if (p.x <= -4) p.x = w + 4
          if (p.x >= w + 4) p.x = -4
          if (p.y <= -4) p.y = h + 4
          if (p.y >= h + 4) p.y = -4
        }

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 186, 130, ${p.a})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.strokeStyle = 'rgba(255, 150, 84, 0.12)'
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 95) {
            const opacity = (1 - dist / 95) * 0.24
            ctx.strokeStyle = `rgba(255, 150, 84, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
}

