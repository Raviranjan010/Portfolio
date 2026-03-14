"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ─── TYPES ──────────────────────────────────────────────────── */
interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
  highlights: string[];
  side: "left" | "right";
  icon: string;
  status: "completed" | "active" | "learning";
}

/* ─── DATA ───────────────────────────────────────────────────── */
const experiences: Experience[] = [
  {
    year: "2025",
    role: "Web Developer & UI/UX Designer",
    company: "Personal Projects & Portfolio",
    description:
      "Building modern web applications with a focus on clean UI, smooth animations, and interactive user experiences. Developing creative tools, portfolio systems, and web utilities using modern frontend technologies.",
    highlights: ["HTML", "CSS", "JavaScript", "UI/UX Design"],
    side: "left",
    icon: "◈",
    status: "active",
  },
  {
    year: "2024",
    role: "Frontend Developer",
    company: "Academic & Personal Projects",
    description:
      "Developed multiple web-based projects including a sticker tag generator, animated timeline interface, and interactive web tools. Focused on responsive design and creative UI animations.",
    highlights: ["Responsive Design", "DOM Manipulation", "Animations", "JavaScript"],
    side: "right",
    icon: "◇",
    status: "completed",
  },
  {
    year: "2024",
    role: "AI & Generative Technology Learner",
    company: "Self Learning",
    description:
      "Completed courses on generative AI and image generation while experimenting with prompt engineering and creative AI tools.",
    highlights: ["Generative AI", "Prompt Engineering", "AI Tools"],
    side: "left",
    icon: "◎",
    status: "learning",
  },
  {
    year: "2023",
    role: "Computer Science Student",
    company: "Lovely Professional University",
    description:
      "Started exploring web development, programming fundamentals, and data structures while pursuing a Computer Science degree. Built several projects to strengthen development skills and logical thinking.",
    highlights: ["C++", "OOP", "Data Structures", "Problem Solving"],
    side: "right",
    icon: "△",
    status: "completed",
  },
  {
    year: "2022",
    role: "Design & Creative Tools Explorer",
    company: "Self Learning",
    description:
      "Explored creative tools like Figma and Canva while learning modern UI/UX principles. Created design assets, social media content, and visual interfaces.",
    highlights: ["Figma", "Canva", "Graphic Design", "Video Editing"],
    side: "left",
    icon: "□",
    status: "completed",
  },
];

const STATUS_CONFIG = {
  active: { label: "ACTIVE", color: "#4ade80", glow: "rgba(74,222,128,0.4)" },
  completed: { label: "COMPLETED", color: "#f5c518", glow: "rgba(245,197,24,0.4)" },
  learning: { label: "LEARNING", color: "#60a5fa", glow: "rgba(96,165,250,0.4)" },
};

/* ─── CARD ───────────────────────────────────────────────────── */
const ExperienceCard = ({
  exp,
  index,
  isActive,
  onClick,
}: {
  exp: Experience;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  const isLeft = exp.side === "left";
  const rawX = useTransform(scrollYProgress, [0, 1], [isLeft ? -80 : 80, 0]);
  const slideX = useSpring(rawX, { stiffness: 55, damping: 22 });
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [isLeft ? -4 : 4, 0]);
  const rotate = useSpring(rawRotate, { stiffness: 55, damping: 22 });
  const rawNodeScale = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);
  const nodeScale = useSpring(rawNodeScale, { stiffness: 120, damping: 20 });

  const status = STATUS_CONFIG[exp.status];

  return (
    <div
      ref={cardRef}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 3rem 1fr",
        gap: 0,
        marginBottom: "6rem",
        position: "relative",
      }}
    >
      {/* LEFT SLOT */}
      <div style={{ display: "flex", justifyContent: isLeft ? "flex-end" : "flex-start", alignItems: "center" }}>
        {isLeft ? (
          <motion.div style={{ x: slideX, opacity, rotate }} className="exp-card-wrap">
            <CardBody exp={exp} index={index} isActive={isActive} onClick={onClick} status={status} />
          </motion.div>
        ) : (
          <motion.div style={{ opacity }} className="year-ghost">
            <span>{exp.year}</span>
          </motion.div>
        )}
      </div>

      {/* CENTER NODE */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        <motion.div
          style={{
            width: 18, height: 18, borderRadius: "50%",
            background: status.color,
            boxShadow: `0 0 20px ${status.glow}, 0 0 40px ${status.glow}`,
            scale: nodeScale,
            zIndex: 10,
            marginTop: 28,
            position: "relative",
          }}
        />
        {/* Pulse */}
        <motion.div
          style={{
            width: 18, height: 18, borderRadius: "50%",
            background: status.color,
            opacity: 0.3,
            position: "absolute",
            top: 28,
          }}
          animate={{ scale: [1, 3, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
        {/* Icon label */}
        <motion.div
          style={{ opacity, marginTop: 10 }}
          className="node-icon"
        >
          {exp.icon}
        </motion.div>
      </div>

      {/* RIGHT SLOT */}
      <div style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-start", alignItems: "center" }}>
        {isLeft ? (
          <motion.div style={{ opacity }} className="year-ghost year-ghost--right">
            <span>{exp.year}</span>
          </motion.div>
        ) : (
          <motion.div style={{ x: slideX, opacity, rotate }} className="exp-card-wrap">
            <CardBody exp={exp} index={index} isActive={isActive} onClick={onClick} status={status} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

const CardBody = ({
  exp,
  index,
  isActive,
  onClick,
  status,
}: {
  exp: Experience;
  index: number;
  isActive: boolean;
  onClick: () => void;
  status: typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG];
}) => (
  <motion.div
    className="exp-card"
    onClick={onClick}
    whileHover={{ y: -8, scale: 1.015 }}
    animate={isActive ? { borderColor: status.color } : { borderColor: "rgba(245,197,24,0.12)" }}
    transition={{ duration: 0.3 }}
    style={{ cursor: "pointer" }}
  >
    {/* Hover glow layer */}
    <div className="exp-card__glow" style={{ background: `radial-gradient(circle at 50% 0%, ${status.glow}, transparent 65%)` }} />

    {/* Top row */}
    <div className="exp-card__header">
      <div>
        <span className="exp-card__year">{exp.year}</span>
        <h3 className="exp-card__role">{exp.role}</h3>
        <p className="exp-card__company">{exp.company}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        {/* Status badge */}
        <span
          className="exp-card__status"
          style={{ borderColor: status.color, color: status.color, boxShadow: `0 0 10px ${status.glow}` }}
        >
          <span className="status-dot" style={{ background: status.color }} />
          {status.label}
        </span>
        <span className="exp-card__index">0{index + 1}</span>
      </div>
    </div>

    {/* Divider */}
    <div className="exp-card__divider" />

    {/* Description */}
    <AnimatePresence>
      <motion.p
        className="exp-card__desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {exp.description}
      </motion.p>
    </AnimatePresence>

    {/* Tags */}
    <div className="exp-card__tags">
      {exp.highlights.map((h, hi) => (
        <motion.span
          key={h}
          className="exp-tag"
          initial={{ opacity: 0, scale: 0.75 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.15 + hi * 0.07 }}
          whileHover={{ scale: 1.12, background: status.color, color: "#080809" }}
        >
          {h}
        </motion.span>
      ))}
    </div>

    {/* Click hint */}
    <p className="exp-card__hint">{isActive ? "▲ collapse" : "▼ tap to expand"}</p>
  </motion.div>
);

/* ─── SECTION ────────────────────────────────────────────────── */
const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useSpring(
    useTransform(scrollYProgress, [0.05, 0.85], [0, 1]),
    { stiffness: 45, damping: 25 }
  );
  const marqueeX = useSpring(
    useTransform(scrollYProgress, [0, 1], [80, -180]),
    { stiffness: 35, damping: 30 }
  );
  const headingY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [40, 0]),
    { stiffness: 60, damping: 20 }
  );

  return (
    <section ref={sectionRef} id="experience" className="exp-section">
      {/* ── CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;700;900&family=Syne:wght@400;600;700&family=JetBrains+Mono:wght@300;400;600&display=swap');

        :root {
          --bg: #080809;
          --surface: #101013;
          --surface2: #18181d;
          --gold: #f5c518;
          --gold-dim: rgba(245,197,24,0.12);
          --gold-glow: rgba(245,197,24,0.35);
          --text: #f0ede6;
          --muted: rgba(240,237,230,0.45);
          --border: rgba(245,197,24,0.12);
        }

        .exp-section {
          background: var(--bg);
          color: var(--text);
          padding: 120px 0;
          position: relative;
          overflow: hidden;
          font-family: 'Syne', sans-serif;
        }

        .exp-section__inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px;
          position: relative;
          z-index: 5;
        }

        /* Section header */
        .exp-header {
          margin-bottom: 80px;
        }
        .exp-header__eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .exp-header__line {
          width: 32px; height: 1px;
          background: var(--gold);
        }
        .exp-header__label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .exp-header__title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(2.8rem, 7vw, 7rem);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        .exp-header__title em {
          color: var(--gold);
          font-style: normal;
        }
        .exp-header__sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.12em;
          margin-top: 18px;
        }

        /* Marquee bg */
        .exp-marquee {
          position: absolute;
          top: 8%;
          left: 0; right: 0;
          pointer-events: none;
          overflow: hidden;
          font-family: 'Unbounded', sans-serif;
          font-weight: 900;
          font-size: clamp(5rem, 14vw, 13rem);
          color: transparent;
          -webkit-text-stroke: 1px rgba(245,197,24,0.045);
          white-space: nowrap;
          line-height: 1;
          user-select: none;
        }

        /* Timeline */
        .exp-timeline {
          position: relative;
        }
        .exp-timeline__line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, var(--gold), rgba(245,197,24,0.15), transparent);
          transform-origin: top;
        }

        .year-ghost {
          display: flex;
          align-items: center;
          padding: 0 28px;
        }
        .year-ghost span {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(3.5rem, 7vw, 6.5rem);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(245,197,24,0.09);
          line-height: 1;
          user-select: none;
          transition: -webkit-text-stroke-color 0.3s;
        }
        .year-ghost:hover span { -webkit-text-stroke-color: rgba(245,197,24,0.2); }
        .year-ghost--right { justify-content: flex-start; }

        .exp-card-wrap { width: 100%; max-width: 440px; }

        .node-icon {
          font-size: 11px;
          color: var(--muted);
          font-family: 'JetBrains Mono', monospace;
        }

        /* Card */
        .exp-card {
          background: var(--surface);
          border: 1px solid rgba(245,197,24,0.12);
          border-radius: 12px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.35s;
        }
        .exp-card:hover {
          box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 50px rgba(245,197,24,0.08);
        }
        .exp-card__glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s;
        }
        .exp-card:hover .exp-card__glow { opacity: 1; }

        .exp-card__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .exp-card__year {
          font-family: 'Unbounded', sans-serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--gold);
          display: block;
          line-height: 1;
          margin-bottom: 4px;
        }
        .exp-card__role {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 4px 0;
        }
        .exp-card__company {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin: 0;
        }
        .exp-card__status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          border: 1px solid;
          border-radius: 40px;
          padding: 4px 10px;
          white-space: nowrap;
        }
        .status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          display: inline-block;
        }
        .exp-card__index {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(240,237,230,0.18);
          letter-spacing: 0.1em;
        }

        .exp-card__divider {
          height: 1px;
          background: linear-gradient(90deg, var(--gold), rgba(245,197,24,0.08), transparent);
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .exp-card__desc {
          font-size: 13.5px;
          line-height: 1.75;
          color: var(--muted);
          margin: 0 0 18px 0;
          position: relative;
          z-index: 1;
        }

        .exp-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          position: relative;
          z-index: 1;
          margin-bottom: 12px;
        }
        .exp-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          padding: 5px 12px;
          border-radius: 40px;
          background: rgba(245,197,24,0.08);
          color: var(--gold);
          border: 1px solid rgba(245,197,24,0.18);
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .exp-tag:hover {
          box-shadow: 0 0 14px rgba(245,197,24,0.3);
        }

        .exp-card__hint {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: rgba(240,237,230,0.18);
          letter-spacing: 0.15em;
          text-align: right;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* Legend */
        .exp-legend {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 56px;
          flex-wrap: wrap;
        }
        .exp-legend__item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .exp-legend__dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }

        /* Count badge */
        .exp-count {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.15em;
        }
        .exp-count__bar {
          height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
          border-radius: 1px;
          flex: 1;
        }

        /* Grid bg */
        .exp-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,197,24,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,197,24,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* Marquee background text */}
      <motion.div className="exp-marquee" style={{ x: marqueeX }}>
        EXPERIENCE · CAREER · JOURNEY · GROWTH
      </motion.div>

      <div className="exp-section__inner">
        {/* Header */}
        <motion.div
          className="exp-header"
          style={{ y: headingY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="exp-header__eyebrow">
            <div className="exp-header__line" />
            <span className="exp-header__label">002 / WHERE I'VE BEEN</span>
          </div>
          <h2 className="exp-header__title">
            THE<em> JOURNEY</em>
          </h2>
          <p className="exp-header__sub">
            &gt; {experiences.length} milestones · scroll to explore
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="exp-legend"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <div key={key} className="exp-legend__item">
              <span className="exp-legend__dot" style={{ background: val.color, boxShadow: `0 0 6px ${val.glow}` }} />
              {val.label}
            </div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="exp-timeline">
          <motion.div
            className="exp-timeline__line"
            style={{ scaleY: lineScaleY }}
          />
          {experiences.map((exp, i) => (
            <ExperienceCard
              key={i}
              exp={exp}
              index={i}
              isActive={activeIndex === i}
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Footer count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="exp-count"
        >
          <div className="exp-count__bar" style={{ width: 80 }} />
          {experiences.length} MILESTONES · {new Date().getFullYear()} ONGOING
          <div className="exp-count__bar" style={{ width: 80, background: "linear-gradient(90deg, transparent, var(--gold))" }} />
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
