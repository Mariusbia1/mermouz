import React, { useEffect, useRef, useState } from "react";

const COLORS = [
  "#6b9dcf",
  "#91b3d2",
  "#38bdf8",
  "#e8edf2",
  "#6ed79b",
  "#f3c969",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
];

function createWave(width, height, count, mode = "burst") {
  const particles = [];

  for (let i = 0; i < count; i += 1) {
    let x;
    let y;
    let angle;
    let speed;

    if (mode === "shower") {
      x = Math.random() * width;
      y = -20 - Math.random() * 160;
      angle = Math.PI / 2 + (Math.random() - 0.5) * 0.7;
      speed = 3 + Math.random() * 5;
    } else {
      // Triple canon (gauche, droite, haut-centre) + pluie large
      const origin = i % 4;
      if (origin === 0) {
        x = width * (0.02 + Math.random() * 0.08);
        y = height * (0.45 + Math.random() * 0.3);
        angle = -Math.PI / 3 + (Math.random() - 0.5) * 0.85;
        speed = 11 + Math.random() * 12;
      } else if (origin === 1) {
        x = width * (0.9 + Math.random() * 0.08);
        y = height * (0.45 + Math.random() * 0.3);
        angle = (-2 * Math.PI) / 3 + (Math.random() - 0.5) * 0.85;
        speed = 11 + Math.random() * 12;
      } else if (origin === 2) {
        x = width * (0.35 + Math.random() * 0.3);
        y = height * 0.85;
        angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
        speed = 13 + Math.random() * 11;
      } else {
        x = Math.random() * width;
        y = -20 - Math.random() * 140;
        angle = Math.PI / 2 + (Math.random() - 0.5) * 0.65;
        speed = 2.5 + Math.random() * 4.5;
      }
    }

    const shapeRoll = i % 5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 7 + Math.random() * 8,
      ratio: shapeRoll === 0 ? 0.3 : 0.45 + Math.random() * 0.5,
      shape: shapeRoll === 4 ? "circle" : "rect",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.28,
      tilt: Math.random() * Math.PI,
      vtilt: 0.08 + Math.random() * 0.14,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.04 + Math.random() * 0.05,
      life: 0,
      maxLife: 190 + Math.random() * 90,
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

    const isMobile = width < 640;
    const particles = createWave(width, height, isMobile ? 150 : 260, "burst");

    // Deuxième salve pour un effet vraiment généreux
    const wave2Timer = window.setTimeout(() => {
      particles.push(
        ...createWave(width, height, isMobile ? 80 : 140, "shower"),
      );
    }, 420);

    let rafId = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = 0;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.maxLife || p.y > height + 50) continue;

        alive += 1;
        p.sway += p.swaySpeed;
        p.vx = p.vx * 0.986 + Math.sin(p.sway) * 0.08;
        p.vy = p.vy * 0.988 + 0.2;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.tilt += p.vtilt;

        const fade =
          p.life > p.maxLife * 0.72
            ? 1 - (p.life - p.maxLife * 0.72) / (p.maxLife * 0.28)
            : 1;

        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.cos(p.tilt));
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(
            -p.size / 2,
            (-p.size * p.ratio) / 2,
            p.size,
            p.size * p.ratio,
          );
        }
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
      window.clearTimeout(wave2Timer);
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
