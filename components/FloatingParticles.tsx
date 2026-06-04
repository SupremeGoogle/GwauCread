"use client";

import { useEffect, useRef } from "react";

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cvs: HTMLCanvasElement = canvas;
    const ctx = cvs.getContext("2d")!;
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
    }[] = [];

    const maxParticles = 60;

    function spawnParticle() {
      if (particles.length >= maxParticles) return;
      particles.push({
        x: Math.random() * cvs.width,
        y: cvs.height + 20,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        life: 0,
      });
    }

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      frame++;
      if (frame % 8 === 0) spawnParticle();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.005;

        if (p.life > 1 || p.y < -20) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.alpha * (1 - p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 144, 77, ${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 144, 77, ${alpha * 0.15})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
