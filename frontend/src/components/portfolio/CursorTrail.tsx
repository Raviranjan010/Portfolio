import { useEffect, useRef, useState } from "react";

interface TrailDot {
  x: number;
  y: number;
  age: number;
}

const CursorTrail = () => {
  const [isTouch, setIsTouch] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailDot[]>([]);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      frameRef.current++;

      // Run at ~20fps (every 3rd frame) to reduce overhead
      if (frameRef.current % 3 !== 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(animate); return; }

      trailRef.current.push({ x: posRef.current.x, y: posRef.current.y, age: 0 });
      if (trailRef.current.length > 20) trailRef.current.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trailRef.current = trailRef.current.filter((dot) => {
        dot.age++;
        if (dot.age > 30) return false;
        const progress = dot.age / 30;
        const alpha = (1 - progress) * 0.2;
        const size = (1 - progress) * 3;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 197, 71, ${alpha})`;
        ctx.fill();
        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default CursorTrail;
