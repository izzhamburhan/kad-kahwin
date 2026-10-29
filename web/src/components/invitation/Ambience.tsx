"use client";

import { useEffect, useRef } from "react";

type Petal = { x: number; y: number; s: number; vy: number; sway: number; phase: number; rot: number; vr: number; hue: number };
type Spark = { x: number; y: number; r: number; phase: number; speed: number; drift: number };

/**
 * Falling petals and drifting gold dust on a single canvas, or (kind="fireflies")
 * kelip-kelip wandering in the dark. Kept deliberately light for phones and paused
 * when the tab is hidden.
 */
export function Ambience({ intensity = 1, kind = "petals" }: { intensity?: number; kind?: "petals" | "fireflies" }) {
  const fireflies = kind === "fireflies";
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const petalColor = css.getPropertyValue("--petal").trim() || "#f0c4c6";
    const gold = css.getPropertyValue("--gold-hi").trim() || "#f6e2ae";

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const petals: Petal[] = Array.from({ length: fireflies ? 0 : Math.round(16 * intensity) }, () => ({
      x: rand(0, w),
      y: rand(-h, h),
      s: rand(6, 12),
      vy: rand(18, 38),
      sway: rand(14, 34),
      phase: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI * 2),
      vr: rand(-1, 1),
      hue: Math.random(),
    }));
    const sparks: Spark[] = Array.from({ length: Math.round((fireflies ? 22 : 28) * intensity) }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: fireflies ? rand(1.2, 2.4) : rand(0.6, 1.8),
      phase: rand(0, Math.PI * 2),
      speed: fireflies ? rand(0.4, 1.1) : rand(0.6, 1.6),
      drift: fireflies ? rand(-4, -9) : rand(-6, -14),
    }));

    const drawPetal = (p: Petal, t: number) => {
      ctx.save();
      ctx.translate(p.x + Math.sin(t * 0.8 + p.phase) * p.sway, p.y);
      ctx.rotate(p.rot);
      // Tumbling: squash one axis over time to fake a 3D flip.
      ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(t * 1.3 + p.phase)));
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = p.hue > 0.72 ? "#fff6ec" : petalColor;
      ctx.fill();
      ctx.restore();
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      for (const s of sparks) {
        s.y += s.drift * dt;
        // Fireflies wander sideways instead of rising in a straight line.
        if (fireflies) s.x += Math.sin(t * 0.7 + s.phase * 3) * 14 * dt;
        if (s.y < -4) {
          s.y = h + 4;
          s.x = rand(0, w);
        }
        const a = 0.25 + 0.75 * Math.max(0, Math.sin(t * s.speed + s.phase));
        ctx.globalAlpha = a * 0.8;
        ctx.fillStyle = gold;
        ctx.shadowColor = gold;
        ctx.shadowBlur = fireflies ? 14 : 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      for (const p of petals) {
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > h + 20) {
          p.y = -20;
          p.x = rand(0, w);
        }
        drawPetal(p, t);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intensity, fireflies]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-30 h-full w-full" aria-hidden />;
}