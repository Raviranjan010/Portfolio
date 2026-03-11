import { useRef } from "react";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface ParallaxOptions {
  speed?: number; // -1 to 1, negative = opposite direction
  offset?: [string, string]; // scroll trigger offsets
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.3, offset = ["start end", "end start"] } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  const range = 100 * speed;
  const rawY = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const y = useSpring(rawY, { stiffness: 100, damping: 30, mass: 0.5 });

  return { ref, y, progress: scrollYProgress };
};

export const useParallaxX = (options: ParallaxOptions = {}) => {
  const { speed = 0.3, offset = ["start end", "end start"] } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  const range = 100 * speed;
  const rawX = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const x = useSpring(rawX, { stiffness: 100, damping: 30, mass: 0.5 });

  return { ref, x, progress: scrollYProgress };
};

export const useParallaxScale = (options: { from?: number; to?: number } = {}) => {
  const { from = 0.9, to = 1 } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const scale = useSpring(rawScale, { stiffness: 100, damping: 30 });

  return { ref, scale, progress: scrollYProgress };
};

export const useParallaxOpacity = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return { ref, opacity, progress: scrollYProgress };
};
