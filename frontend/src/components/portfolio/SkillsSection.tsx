import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Code2, Layout, Terminal, Cpu, PenTool, GitBranch, MonitorPlay, Sparkles, Layers, Box, Globe, Database, Smartphone } from "lucide-react";

// For each skill we assign an icon from lucide:
const skills = [
  { name: "HTML5", cat: "frontend", icon: Globe, proficiency: "Expert" },
  { name: "CSS3", cat: "frontend", icon: Layout, proficiency: "Expert" },
  { name: "JavaScript", cat: "frontend", icon: Code2, proficiency: "Expert" },
  { name: "Responsive Design", cat: "frontend", icon: Smartphone, proficiency: "Expert" },
  { name: "DOM Manipulation", cat: "frontend", icon: Box, proficiency: "Advanced" },
  { name: "Animations (CSS/JS)", cat: "frontend", icon: Sparkles, proficiency: "Advanced" },

  { name: "C++", cat: "backend", icon: Terminal, proficiency: "Advanced" },
  { name: "Object-Oriented Programming", cat: "backend", icon: Layers, proficiency: "Advanced" },
  { name: "Data Structures", cat: "backend", icon: Database, proficiency: "Proficient" },

  { name: "Git & GitHub", cat: "tools", icon: GitBranch, proficiency: "Advanced" },
  { name: "VS Code", cat: "tools", icon: Code2, proficiency: "Expert" },
  { name: "Chrome DevTools", cat: "tools", icon: MonitorPlay, proficiency: "Advanced" },
  { name: "Web Debugging", cat: "tools", icon: Terminal, proficiency: "Advanced" },

  { name: "Figma", cat: "design", icon: PenTool, proficiency: "Expert" },
  { name: "Canva", cat: "design", icon: Layout, proficiency: "Expert" },
  { name: "UI/UX Design", cat: "design", icon: Sparkles, proficiency: "Advanced" },
  { name: "Video Editing", cat: "design", icon: MonitorPlay, proficiency: "Advanced" },
  { name: "Graphic Design", cat: "design", icon: PenTool, proficiency: "Advanced" },

  { name: "AI Tools", cat: "tools", icon: Cpu, proficiency: "Proficient" },
  { name: "Prompt Engineering", cat: "tools", icon: Terminal, proficiency: "Advanced" }
];

const categories = [
  { key: "frontend", label: "Web Development", icon: "◆" },
  { key: "backend", label: "Programming", icon: "▲" },
  { key: "tools", label: "Tools & Tech", icon: "●" },
  { key: "design", label: "Design & Creativity", icon: "■" },
];

/* ── Interactive Skill Card ── */
const SkillCard = ({ skill, index }: { skill: typeof skills[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = skill.icon;
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -40 : 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative w-full cursor-pointer rounded-2xl overflow-hidden group"
        style={{
          background: "var(--bg-glass)",
          border: "1px solid var(--border-accent)",
        }}
        onClick={() => setExpanded(!expanded)}
        whileHover={{
          scale: 1.02,
          y: -4,
          boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 0 20px var(--gold-glow)",
          borderColor: "var(--gold)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Hover Glow Background */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(232,197,71,0.1), transparent 70%)" }}
        />

        <div className="p-5 md:p-6 flex items-center gap-4 relative z-10 lg:pl-5">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-[var(--gold)]"
            style={{ background: "var(--gold-dim)", color: "var(--gold)" }}
          >
            <Icon size={24} className="group-hover:text-[var(--bg)] transition-colors duration-300" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-display text-lg md:text-xl font-bold transition-colors duration-300 group-hover:text-[var(--gold)]" style={{ color: "var(--text)" }}>
              {skill.name}
            </h3>
            
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.div
                  key="expanded"
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <span 
                    className="inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold"
                    style={{ background: "rgba(232,197,71,0.1)", color: "var(--gold)", border: "1px solid rgba(232,197,71,0.2)" }}
                  >
                    {skill.proficiency}
                  </span>
                </motion.div>
              ) : (
                <motion.p
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[9px] tracking-wider mt-1 opacity-60"
                  style={{ color: "var(--text-muted-raw)" }}
                >
                  TAP TO EXPAND
                </motion.p>
              )}
            </AnimatePresence>
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
