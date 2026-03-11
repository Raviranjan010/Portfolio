import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onEnter = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "A" || t.tagName === "BUTTON" || t.closest("a") || t.closest("button") || t.dataset.cursor) {
        setHovering(true);
        const text = t.dataset.cursorText || t.closest("[data-cursor-text]")?.getAttribute("data-cursor-text") || "";
        setCursorText(text);
      }
    };
    const onLeave = () => { setHovering(false); setCursorText(""); };

    const lerp = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        const size = hovering ? 64 : 36;
        ringRef.current.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px) scale(${clicking ? 0.8 : 1})`;
      }
      raf.current = requestAnimationFrame(lerp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    raf.current = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [hovering, clicking]);

  if (isTouch) return null;

  return (
    <>
      {/* Core dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10001] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: hovering ? "transparent" : "var(--gold)",
          transition: "background 0.2s",
        }}
      />
      {/* Outer ring with text */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none flex items-center justify-center"
        style={{
          width: hovering ? 64 : 36,
          height: hovering ? 64 : 36,
          borderRadius: "50%",
          border: `1px solid ${hovering ? "var(--gold)" : "rgba(242,240,235,0.25)"}`,
          background: hovering ? "var(--gold-dim)" : "transparent",
          transition: "width 0.3s, height 0.3s, border-color 0.3s, background 0.3s",
        }}
      >
        {cursorText && (
          <span
            className="font-mono text-[7px] tracking-wider uppercase text-center leading-tight"
            style={{ color: "var(--gold)" }}
          >
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
