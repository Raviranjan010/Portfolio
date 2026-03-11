import { useEffect, useRef, useCallback } from "react";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(0);
  const frameCount = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Fewer particles for better perf
    const count = Math.min(Math.floor((w * h) / 80000), 40);
    dotsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: 1 + Math.random() * 1.5,
      opacity: 0.06 + Math.random() * 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.01,
    }));
  }, []);

  useEffect(() => {
    init();

    const handleResize = () => init();
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse, { passive: true });

    const animate = () => {
      frameCount.current++;
      // Throttle to ~30fps for particles (every other frame)
      if (frameCount.current % 2 !== 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;

      dotsRef.current.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.pulse += dot.pulseSpeed;

        if (dot.x < 0) dot.x = w;
        if (dot.x > w) dot.x = 0;
        if (dot.y < 0) dot.y = h;
        if (dot.y > h) dot.y = 0;

        // Mouse repulsion
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          dot.vx += (dx / dist) * force * 0.08;
          dot.vy += (dy / dist) * force * 0.08;
        }

        dot.vx *= 0.99;
        dot.vy *= 0.99;

        const alpha = dot.opacity * (0.7 + 0.3 * Math.sin(dot.pulse));

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 197, 71, ${alpha})`;
        ctx.fill();
      });

      // Skip connection lines — they're the biggest perf hit
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default FloatingParticles;
