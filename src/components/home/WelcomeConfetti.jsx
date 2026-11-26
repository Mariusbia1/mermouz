import React, { useEffect, useRef, useState } from "react";

const COLORS = [
  "#6b9dcf",
  "#91b3d2",
  "#4a7ab5",
  "#e8edf2",
  "#6ed79b",
  "#f3c969",
];

function createParticles(width, height) {
  const particles = [];
  const count = width < 640 ? 65 : 110;

  for (let i = 0; i < count; i += 1) {
    // Double canon (gauche & droite) + légère pluie centrale
    const origin = i % 3;
    const x =
      origin === 0
        ? width * 0.08
        : origin === 1
          ? width * 0.92
          : width * (0.2 + Math.random() * 0.6);
    const y = origin === 2 ? -20 - Math.random() * 80 : height * 0.62;

    const angle =
      origin === 0
        ? -Math.PI / 3 + (Math.random() - 0.5) * 0.65
        : origin === 1
          ? (-2 * Math.PI) / 3 + (Math.random() - 0.5) * 0.65
          : Math.PI / 2 + (Math.random() - 0.5) * 0.5;

    const speed =
      origin === 2 ? 2.5 + Math.random() * 3.5 : 10 + Math.random() * 9;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (origin === 2 ? 0 : 2),
      size: 6 + Math.random() * 6,
      ratio: 0.45 + Math.random() * 0.45,
      color: COLORS[i % COLORS.length],
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.24,
      tilt: Math.random() * Math.PI,
      vtilt: 0.08 + Math.random() * 0.12,
      life: 0,
      maxLife: 135 + Math.random() * 65,
    });
  }
  return particles;
}

export default function WelcomeConfetti() {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = createParticles(width, height);
    let rafId = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = 0;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.maxLife || p.y > height + 40) continue;

        alive += 1;
        p.vx *= 0.985;
        p.vy = p.vy * 0.988 + 0.24;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.tilt += p.vtilt;

        const fade =
          p.life > p.maxLife * 0.65
            ? 1 - (p.life - p.maxLife * 0.65) / (p.maxLife * 0.35)
            : 1;

        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.cos(p.tilt));
        ctx.fillStyle = p.color;
        ctx.fillRect(
          -p.size / 2,
          (-p.size * p.ratio) / 2,
          p.size,
          p.size * p.ratio,
        );
        ctx.restore();
      }

      if (alive > 0) {
        rafId = window.requestAnimationFrame(render);
      } else {
        setVisible(false);
      }
    };

    rafId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 60,
      }}
    />
  );
}
