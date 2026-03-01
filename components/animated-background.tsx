'use client';

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.002;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Base background
      ctx.fillStyle = '#fcfcfc';
      ctx.fillRect(0, 0, width, height);

      // Draw moving blobs
      const drawBlob = (x: number, y: number, r: number, color: string) => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      // Blob 1 (Blue/Purple)
      const x1 = width * 0.5 + Math.sin(time) * width * 0.3;
      const y1 = height * 0.5 + Math.cos(time * 0.8) * height * 0.3;
      drawBlob(x1, y1, width * 0.6, 'rgba(147, 197, 253, 0.4)'); // blue-300

      // Blob 2 (Pink/Purple)
      const x2 = width * 0.5 + Math.cos(time * 1.2) * width * 0.3;
      const y2 = height * 0.5 + Math.sin(time * 1.1) * height * 0.3;
      drawBlob(x2, y2, width * 0.5, 'rgba(216, 180, 254, 0.3)'); // purple-300

      // Blob 3 (Cyan/Teal)
      const x3 = width * 0.5 + Math.sin(time * 0.9 + Math.PI) * width * 0.2;
      const y3 = height * 0.5 + Math.cos(time * 1.3 + Math.PI) * height * 0.4;
      drawBlob(x3, y3, width * 0.7, 'rgba(167, 243, 208, 0.3)'); // emerald-200

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-60"
    />
  );
}
