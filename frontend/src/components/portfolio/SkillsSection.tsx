import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

const skills = [
  // Frontend Development
  { name: "HTML5", cat: "frontend", level: 95 },
  { name: "CSS3", cat: "frontend", level: 92 },
  { name: "JavaScript", cat: "frontend", level: 90 },
  { name: "Responsive Design", cat: "frontend", level: 90 },
  { name: "DOM Manipulation", cat: "frontend", level: 88 },
  { name: "Animations (CSS/JS)", cat: "frontend", level: 87 },

  // Programming & Logic
  { name: "C++", cat: "backend", level: 80 },
  { name: "Object-Oriented Programming", cat: "backend", level: 82 },
  { name: "Data Structures", cat: "backend", level: 78 },

  // Development Tools
  { name: "Git & GitHub", cat: "tools", level: 85 },
  { name: "VS Code", cat: "tools", level: 92 },
  { name: "Chrome DevTools", cat: "tools", level: 85 },
  { name: "Web Debugging", cat: "tools", level: 82 },

  // Design & Creativity
  { name: "Figma", cat: "design", level: 88 },
  { name: "Canva", cat: "design", level: 90 },
  { name: "UI/UX Design", cat: "design", level: 87 },
  { name: "Video Editing", cat: "design", level: 85 },
  { name: "Graphic Design", cat: "design", level: 84 },

  // Emerging Tech
  { name: "Artificial Intelligence Tools", cat: "tools", level: 75 },
  { name: "Prompt Engineering", cat: "tools", level: 80 }
];

const categories = [
  { key: "frontend", label: "Web Development", icon: "◆" },
  { key: "backend", label: "Programming", icon: "▲" },
  { key: "tools", label: "Tools & Tech", icon: "●" },
  { key: "design", label: "Design & Creativity", icon: "■" },
];

/* ── Flip Card ── */
const SkillCard = ({ skill, index }: { skill: typeof skills[0]; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -60 : 60, rotateY: fromLeft ? -15 : 15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="perspective-[800px]"
    >
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setFlipped(!flipped)}
        whileHover={{ scale: 1.03, y: -4 }}
      >
        {/* Front */}
        <div
          className="rounded-2xl p-5 md:p-6 backface-hidden"
          style={{
            background: "var(--bg-glass)",
            border: "1px solid var(--border-accent)",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-base md:text-lg font-bold" style={{ color: "var(--text)" }}>
              {skill.name}
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>
              {skill.level}%
            </span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--border-raw)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gold)" }}
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="font-mono text-[9px] mt-2 tracking-wider" style={{ color: "var(--text-muted-raw)" }}>
            TAP TO FLIP →
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-5 md:p-6 flex flex-col justify-center items-center"
          style={{
            background: "var(--gold)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="font-display text-2xl font-black" style={{ color: "var(--bg)" }}>
            {skill.name}
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-mono text-xs font-bold" style={{ color: "var(--bg)" }}>
              {skill.level >= 90 ? "EXPERT" : skill.level >= 75 ? "ADVANCED" : "PROFICIENT"}
            </span>
          </div>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: i < Math.ceil(skill.level / 20) ? "var(--bg)" : "rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Category Tab ── */
const CategoryTab = ({
  cat,
  active,
  onClick,
}: {
  cat: typeof categories[0];
  active: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className="relative px-5 md:px-7 py-2.5 md:py-3 rounded-full font-mono text-xs md:text-sm tracking-wider uppercase transition-colors duration-300"
    style={{
      color: active ? "var(--bg)" : "var(--text-muted-raw)",
      border: active ? "none" : "1px solid var(--border-raw)",
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
  >
    {active && (
      <motion.div
        layoutId="skill-tab-bg"
        className="absolute inset-0 rounded-full"
        style={{ background: "var(--gold)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      <span className="text-[10px]">{cat.icon}</span>
      {cat.label}
    </span>
  </motion.button>
);

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("frontend");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerX = useSpring(useTransform(scrollYProgress, [0, 0.3], [-80, 0]), { stiffness: 80, damping: 25 });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const bgTextX = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]), { stiffness: 60, damping: 30 });
  const counterY = useSpring(useTransform(scrollYProgress, [0.1, 0.35], [40, 0]), { stiffness: 80, damping: 25 });
  const counterOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  const filtered = skills.filter((s) => s.cat === activeCategory);

  return (
    <section ref={sectionRef} id="skills" className="section-spacing relative px-5 md:px-16 overflow-hidden">
      <div className="gradient-hr mb-12 md:mb-16" />

      {/* Giant background text */}
      <motion.div
        className="absolute top-[15%] left-0 right-0 pointer-events-none select-none hidden md:block"
        style={{ x: bgTextX }}
      >
        <span
          className="font-display font-black whitespace-nowrap"
          style={{
            fontSize: "clamp(6rem, 18vw, 16rem)",
            color: "var(--text)",
            opacity: 0.02,
            lineHeight: 1,
          }}
        >
          SKILLS & EXPERTISE
        </span>
      </motion.div>

      {/* Header */}
      <motion.div style={{ x: headerX, opacity: headerOpacity }} className="relative z-10 mb-10 md:mb-14">
        <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold)" }}>
          WHAT I BRING
        </p>
        <h2
          className="font-display font-black"
          style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)", lineHeight: 0.95, color: "var(--text)" }}
        >
          SKILL
          <span style={{ color: "var(--gold)" }}> SET</span>
        </h2>
      </motion.div>

      {/* Stats counter row */}
      <motion.div
        className="flex flex-wrap gap-6 md:gap-12 mb-10 md:mb-14"
        style={{ y: counterY, opacity: counterOpacity }}
      >
        {[
          { num: "20+", label: "Projects Built" },
          { num: "15+", label: "Technologies" },
          { num: "4", label: "Skill Domains" },
        ].map((stat) => (
          <div key={stat.label}>
            <span className="font-display text-3xl md:text-4xl font-black" style={{ color: "var(--gold)" }}>
              {stat.num}
            </span>
            <p className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase mt-1" style={{ color: "var(--text-muted-raw)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-12">
        {categories.map((cat) => (
          <CategoryTab
            key={cat.key}
            cat={cat}
            active={activeCategory === cat.key}
            onClick={() => setActiveCategory(cat.key)}
          />
        ))}
      </div>

      {/* Skill Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {filtered.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bottom decorative line */}
      <motion.div
        className="mt-16 md:mt-20 h-[1px] w-full"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border-accent), transparent)",
          scaleX: useSpring(useTransform(scrollYProgress, [0.5, 0.9], [0, 1]), { stiffness: 80, damping: 25 }),
          transformOrigin: "left",
        }}
      />
    </section>
  );
};

export default SkillsSection;
