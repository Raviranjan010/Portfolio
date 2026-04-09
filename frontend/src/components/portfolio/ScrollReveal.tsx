import { motion } from "framer-motion";
import React from "react";

const ScrollReveal = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }) => {
  const offsets = { up: { y: 60 }, left: { x: -60 }, right: { x: 60 } };
  const offset = offsets[direction];
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", ...offset }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, x: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
