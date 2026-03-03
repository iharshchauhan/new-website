'use client'

import { useEffect, useRef } from 'react'

type Dot = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let t = 0
    let dots: Dot[] = []

    const makeDots = (count: number, w: number, h: number): Dot[] =>
      Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.09,
        vy: (Math.random() - 0.5) * 0.09,
        r: Math.random() * 1.25 + 0.35,
        a: Math.random() * 0.22 + 0.06,
      }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const isMobile = window.innerWidth < 640
      const count = isMobile
        ? Math.max(20, Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 26000)))
        : Math.max(34, Math.min(92, Math.floor((window.innerWidth * window.innerHeight) / 21000)))
      dots = makeDots(count, window.innerWidth, window.innerHeight)
    }

    const draw = () => {
      t += 0.0022

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const base = ctx.createLinearGradient(0, 0, w, h)
      base.addColorStop(0, '#eef5f3')
      base.addColorStop(1, '#ececf7')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)

      const drawBlob = (x: number, y: number, r: number, color: string) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      const x1 = w * 0.2 + Math.sin(t * 0.62) * w * 0.08
      const y1 = h * 0.3 + Math.cos(t * 0.52) * h * 0.08
      drawBlob(x1, y1, w * 0.45, 'rgba(122, 188, 255, 0.12)')

      const x2 = w * 0.75 + Math.cos(t * 0.72) * w * 0.07
      const y2 = h * 0.7 + Math.sin(t * 0.56) * h * 0.08
      drawBlob(x2, y2, w * 0.4, 'rgba(194, 168, 255, 0.1)')

      const x3 = w * 0.5 + Math.sin(t * 0.86 + Math.PI) * w * 0.06
      const y3 = h * 0.45 + Math.cos(t * 0.64 + Math.PI) * h * 0.07
      drawBlob(x3, y3, w * 0.34, 'rgba(120, 231, 205, 0.08)')

      dots.forEach((d) => {
        if (!reduceMotion) {
          d.x += d.vx
          d.y += d.vy

          if (d.x < -2) d.x = w + 2
          if (d.x > w + 2) d.x = -2
          if (d.y < -2) d.y = h + 2
          if (d.y > h + 2) d.y = -2
        }

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${d.a})`
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      })

      if (!reduceMotion) {
        frame = requestAnimationFrame(draw)
      }
    }

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    resize()
    draw()

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />
}
