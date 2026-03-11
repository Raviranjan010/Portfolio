import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface SectionDividerProps {
  text: string;
  direction?: "left" | "right";
}

const SectionDivider = ({ text, direction = "left" }: SectionDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const xRange = direction === "left" ? [300, -300] : [-300, 300];
  const x = useSpring(useTransform(scrollYProgress, [0, 1], xRange), {
    stiffness: 40,
    damping: 30,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const skewX = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden select-none pointer-events-none"
      style={{ height: "clamp(80px, 12vw, 140px)" }}
    >
      {/* Main scrolling text */}
      <motion.div
        className="absolute inset-0 flex items-center whitespace-nowrap"
        style={{ x, opacity, skewX }}
      >
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="font-display font-black mx-4 md:mx-8"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              color: "transparent",
              WebkitTextStroke: "1px var(--gold)",
              opacity: 0.25,
              lineHeight: 1,
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>

      {/* Secondary shadow layer going opposite direction */}
      <motion.div
        className="absolute inset-0 flex items-center whitespace-nowrap"
        style={{
          x: useSpring(
            useTransform(scrollYProgress, [0, 1], direction === "left" ? [-200, 200] : [200, -200]),
            { stiffness: 40, damping: 30 }
          ),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.5, 0]),
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="font-display font-black mx-4 md:mx-8"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              color: "var(--text)",
              opacity: 0.02,
              lineHeight: 1,
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>

      {/* Center gold line */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border-accent), transparent)",
          scaleX: useSpring(useTransform(scrollYProgress, [0.1, 0.5], [0, 1]), { stiffness: 60, damping: 25 }),
          transformOrigin: "center",
        }}
      />
    </div>
  );
};

export default SectionDivider;
