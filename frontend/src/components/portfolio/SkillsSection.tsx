import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

/* ─── Skill Icons (SVG inline) ─── */
const TechIcon = ({ name, size = 28 }: { name: string; size?: number }) => {
  const icons: Record<string, JSX.Element> = {
    "HTML5": (
      <svg viewBox="0 0 32 32" width={size} height={size}><path fill="#E44D26" d="M5 3l2.1 23.4L16 29l8.9-2.6L27 3H5z"/><path fill="#F16529" d="M16 27.2l7.2-2L25 7H16v20.2z"/><path fill="#EBEBEB" d="M16 13H11.5l-.3-3.5H16V6H8l.8 9H16v-2zm0 8.4l-5.9-1.6-.4-4.4H7.3l.7 8.2L16 26v-4.6z"/><path fill="#fff" d="M16 13v2h4l-.4 4.4-3.6 1V23l6.6-1.8.9-9.2H16z"/></svg>
    ),
    "CSS3": (
      <svg viewBox="0 0 32 32" width={size} height={size}><path fill="#1572B6" d="M5 3l2.1 23.4L16 29l8.9-2.6L27 3H5z"/><path fill="#33A9DC" d="M16 27.2V6H25l-2.1 21.2L16 27.2z"/><path fill="#fff" d="M16 13h4.5l.3-3.5H16V6h8l-.8 9h-7.2v2zm.1 8.4l5.9-1.6.4-4.4h-2.4l-.2 2.2-3.7 1v4.4z"/><path fill="#EBEBEB" d="M16 13v2H11.8L11.5 11H16V6H8l.8 9H16v-2zm0 8.4l-5.9-1.6L9.8 15H12.2l.2 2.4 3.6 1V21.4z"/></svg>
    ),
    "JavaScript": (
      <svg viewBox="0 0 32 32" width={size} height={size}><rect fill="#F7DF1E" width="32" height="32" rx="3"/><path d="M19.8 24c.4.7.9 1.2 1.8 1.2.8 0 1.3-.4 1.3-1 0-.7-.5-1-1.4-1.4l-.5-.2c-1.4-.6-2.3-1.3-2.3-2.9 0-1.4 1.1-2.5 2.8-2.5 1.2 0 2.1.4 2.7 1.5l-1.5.9c-.3-.5-.6-.7-1.2-.7s-.9.4-.9.8c0 .6.4.8 1.2 1.2l.5.2c1.6.7 2.5 1.4 2.5 3 0 1.7-1.4 2.6-3.2 2.6-1.8 0-3-1-3.5-2.1L19.8 24zm-6.9.2c.3.5.5.9 1.1.9.6 0 .9-.2.9-1.1v-6h2v6c0 1.8-1.1 2.7-2.7 2.7-1.5 0-2.3-.8-2.7-1.7l1.4-.8z"/></svg>
    ),
    "C++": (
      <svg viewBox="0 0 32 32" width={size} height={size}><circle fill="#004482" cx="16" cy="16" r="14"/><text x="16" y="21" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" fontFamily="monospace">C++</text></svg>
    ),
    "Git & GitHub": (
      <svg viewBox="0 0 32 32" width={size} height={size}><path fill="#F05032" d="M29.5 14.5l-12-12a2.1 2.1 0 00-3 0L12 5l3.8 3.8a2.5 2.5 0 013.2 3.2L23 16a2.5 2.5 0 11-1.5 1.5l-3.7-3.7v9.7a2.5 2.5 0 11-2 0V13.5a2.5 2.5 0 01-1.3-3.3L10.7 6.4 2.5 14.5a2.1 2.1 0 000 3l12 12a2.1 2.1 0 003 0l12-12a2.1 2.1 0 000-3z"/></svg>
    ),
    "Figma": (
      <svg viewBox="0 0 32 32" width={size} height={size}><path fill="#F24E1E" d="M10.5 29A4.5 4.5 0 0115 24.5V20h-4.5a4.5 4.5 0 000 9z"/><path fill="#FF7262" d="M15 11h-4.5a4.5 4.5 0 000 9H15V11z"/><path fill="#A259FF" d="M15 3h-4.5a4.5 4.5 0 000 9H15V3z"/><path fill="#1ABCFE" d="M24 15.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/><path fill="#0ACF83" d="M19.5 3H15v9h4.5a4.5 4.5 0 000-9z"/></svg>
    ),
    "VS Code": (
      <svg viewBox="0 0 32 32" width={size} height={size}><path fill="#007ACC" d="M29.2 4.6L23 1.4a2 2 0 00-2.2.3L3.2 16.5a1.3 1.3 0 000 1.9L8 23l13-11L29.5 22.8a2 2 0 002.5-1V6.6a2 2 0 00-2.8-2z"/><path fill="#007ACC" d="M2.8 27.4L8 23l-4.8-4.6a1.3 1.3 0 000-1.9v12a1.3 1.3 0 00-.4 1z" opacity=".5"/><path fill="#fff" d="M23 30.6a2 2 0 002.2.3l4.3-2.1a2 2 0 001.5-1.9v-2.1L21 16 8 24l8.6 6.4z" opacity=".5"/><path fill="#fff" d="M23 1.4a2 2 0 012.2.3l4.3 2.1A2 2 0 0131 5.7v20.6a2 2 0 01-1.5 1.9l-4.3 2.1a2 2 0 01-2.2-.3L8 24l-5-4 5-5L23 1.4z"/></svg>
    ),
    "Responsive Design": (
      <svg viewBox="0 0 32 32" width={size} height={size}><rect x="2" y="6" width="22" height="15" rx="2" fill="none" stroke="#38BDF8" strokeWidth="2"/><rect x="16" y="22" width="8" height="12" rx="1.5" fill="none" stroke="#38BDF8" strokeWidth="2" transform="translate(0,-3)"/><circle cx="20" cy="30" r="1" fill="#38BDF8" transform="translate(0,-3)"/></svg>
    ),
    "UI/UX Design": (
      <svg viewBox="0 0 32 32" width={size} height={size}><circle cx="16" cy="16" r="12" fill="none" stroke="#A78BFA" strokeWidth="2"/><circle cx="16" cy="16" r="6" fill="none" stroke="#A78BFA" strokeWidth="2"/><line x1="16" y1="4" x2="16" y2="10" stroke="#A78BFA" strokeWidth="2"/><line x1="16" y1="22" x2="16" y2="28" stroke="#A78BFA" strokeWidth="2"/><line x1="4" y1="16" x2="10" y2="16" stroke="#A78BFA" strokeWidth="2"/><line x1="22" y1="16" x2="28" y2="16" stroke="#A78BFA" strokeWidth="2"/></svg>
    ),
    "Canva": (
      <svg viewBox="0 0 32 32" width={size} height={size}><circle cx="16" cy="16" r="14" fill="#7D2AE7"/><text x="16" y="21" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="serif">C</text></svg>
    ),
    "Artificial Intelligence Tools": (
      <svg viewBox="0 0 32 32" width={size} height={size}><circle cx="16" cy="16" r="6" fill="none" stroke="#34D399" strokeWidth="2"/><path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M7.5 24.5l2.8-2.8M21.7 10.3l2.8-2.8" stroke="#34D399" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    "Prompt Engineering": (
      <svg viewBox="0 0 32 32" width={size} height={size}><rect x="3" y="7" width="26" height="18" rx="3" fill="none" stroke="#FBBF24" strokeWidth="2"/><path d="M8 12l5 4-5 4M14 20h10" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    "Chrome DevTools": (
      <svg viewBox="0 0 32 32" width={size} height={size}><circle cx="16" cy="16" r="13" fill="#fff" stroke="#ddd" strokeWidth="1"/><circle cx="16" cy="16" r="7" fill="#1A73E8"/><path d="M16 3a13 13 0 0111.3 6.5H16a6.5 6.5 0 00-5.6 3.2L5.8 4.5A13 13 0 0116 3z" fill="#EA4335"/><path d="M29 16a13 13 0 01-6.4 11.3l-5.7-9.8a6.5 6.5 0 00-1-6.5h13a13 13 0 01.1 5z" fill="#FBBC04"/><path d="M3 16a13 13 0 016.4-11.3l5.7 9.8a6.5 6.5 0 006.4 3.2l-6.4 11A13 13 0 013 16z" fill="#34A853"/></svg>
    ),
    "Web Debugging": (
      <svg viewBox="0 0 32 32" width={size} height={size}><path d="M10 6h12l2 4H8L10 6z" fill="#F87171" rx="2"/><rect x="8" y="10" width="16" height="16" rx="3" fill="none" stroke="#F87171" strokeWidth="2"/><path d="M16 14v5M16 21v1" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    "DOM Manipulation": (
      <svg viewBox="0 0 32 32" width={size} height={size}><rect x="2" y="4" width="10" height="8" rx="2" fill="none" stroke="#60A5FA" strokeWidth="2"/><rect x="20" y="4" width="10" height="8" rx="2" fill="none" stroke="#60A5FA" strokeWidth="2"/><rect x="11" y="20" width="10" height="8" rx="2" fill="none" stroke="#60A5FA" strokeWidth="2"/><path d="M7 12v4h18V12M16 16v4" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    "Animations (CSS/JS)": (
      <svg viewBox="0 0 32 32" width={size} height={size}><path d="M4 16a12 12 0 1124 0 12 12 0 01-24 0z" fill="none" stroke="#FB923C" strokeWidth="2"/><path d="M16 8l2 5h5l-4 3 1.5 5L16 18l-4.5 3 1.5-5-4-3h5z" fill="#FB923C"/></svg>
    ),
    "Object-Oriented Programming": (
      <svg viewBox="0 0 32 32" width={size} height={size}><ellipse cx="16" cy="9" rx="10" ry="4" fill="none" stroke="#C084FC" strokeWidth="2"/><path d="M6 9v6c0 2.2 4.5 4 10 4s10-1.8 10-4V9" fill="none" stroke="#C084FC" strokeWidth="2"/><path d="M6 15v6c0 2.2 4.5 4 10 4s10-1.8 10-4v-6" fill="none" stroke="#C084FC" strokeWidth="2"/></svg>
    ),
    "Data Structures": (
      <svg viewBox="0 0 32 32" width={size} height={size}><rect x="4" y="4" width="8" height="8" rx="1.5" fill="none" stroke="#2DD4BF" strokeWidth="2"/><rect x="20" y="4" width="8" height="8" rx="1.5" fill="none" stroke="#2DD4BF" strokeWidth="2"/><rect x="12" y="20" width="8" height="8" rx="1.5" fill="none" stroke="#2DD4BF" strokeWidth="2"/><path d="M8 12v4l8 4M24 12v4l-8 4" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    "Video Editing": (
      <svg viewBox="0 0 32 32" width={size} height={size}><rect x="2" y="7" width="20" height="18" rx="2" fill="none" stroke="#F472B6" strokeWidth="2"/><path d="M22 13l8-5v16l-8-5V13z" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinejoin="round"/></svg>
    ),
    "Graphic Design": (
      <svg viewBox="0 0 32 32" width={size} height={size}><path d="M6 26C6 26 8 8 16 6s16 6 14 14-14 6-14 6" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="16" r="3" fill="#FCD34D"/></svg>
    ),
  };
  return icons[name] || (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <circle cx="16" cy="16" r="12" fill="none" stroke="var(--gold)" strokeWidth="2"/>
      <text x="16" y="21" textAnchor="middle" fill="var(--gold)" fontSize="11" fontFamily="monospace">{name.slice(0,2)}</text>
    </svg>
  );
};

/* ─── Floating Orb (background ambiance) ─── */
const FloatingOrb = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
      opacity: 0.04,
      filter: "blur(60px)",
      animation: "pulse 8s ease-in-out infinite",
      ...style,
    }}
  />
);

/* ─── Skill data ─── */
const skills = [
  { name: "HTML5", cat: "frontend", level: 95 },
  { name: "CSS3", cat: "frontend", level: 92 },
  { name: "JavaScript", cat: "frontend", level: 90 },
  { name: "Responsive Design", cat: "frontend", level: 90 },
  { name: "DOM Manipulation", cat: "frontend", level: 88 },
  { name: "Animations (CSS/JS)", cat: "frontend", level: 87 },
  { name: "C++", cat: "backend", level: 80 },
  { name: "Object-Oriented Programming", cat: "backend", level: 82 },
  { name: "Data Structures", cat: "backend", level: 78 },
  { name: "Git & GitHub", cat: "tools", level: 85 },
  { name: "VS Code", cat: "tools", level: 92 },
  { name: "Chrome DevTools", cat: "tools", level: 85 },
  { name: "Web Debugging", cat: "tools", level: 82 },
  { name: "Artificial Intelligence Tools", cat: "tools", level: 75 },
  { name: "Prompt Engineering", cat: "tools", level: 80 },
  { name: "Figma", cat: "design", level: 88 },
  { name: "Canva", cat: "design", level: 90 },
  { name: "UI/UX Design", cat: "design", level: 87 },
  { name: "Video Editing", cat: "design", level: 85 },
  { name: "Graphic Design", cat: "design", level: 84 },
];

const categories = [
  { key: "frontend", label: "Web Dev", icon: "◆", color: "#38BDF8" },
  { key: "backend", label: "Programming", icon: "▲", color: "#C084FC" },
  { key: "tools", label: "Tools & Tech", icon: "●", color: "#34D399" },
  { key: "design", label: "Design", icon: "■", color: "#F472B6" },
];

/* ─── Skill Card ─── */
const SkillCard = ({ skill, index }: { skill: typeof skills[0]; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fromLeft = index % 2 === 0;

  const catColor = categories.find((c) => c.key === skill.cat)?.color ?? "var(--gold)";
  const tier = skill.level >= 90 ? "EXPERT" : skill.level >= 75 ? "ADVANCED" : "PROFICIENT";
  const tierIcon = skill.level >= 90 ? "★★★" : skill.level >= 75 ? "★★☆" : "★☆☆";

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -60 : 60, rotateY: fromLeft ? -15 : 15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: "900px" }}
    >
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setFlipped(!flipped)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.04, y: -6 }}
      >
        {/* ── Front ── */}
        <div
          className="rounded-2xl p-5 md:p-6 relative overflow-hidden"
          style={{
            background: "var(--bg-glass)",
            border: `1px solid ${hovered ? catColor + "55" : "var(--border-accent)"}`,
            backfaceVisibility: "hidden",
            transition: "border-color 0.3s",
            minHeight: "140px",
          }}
        >
          {/* shimmer on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${catColor}15 60%, transparent 80%)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s",
            }}
          />

          {/* color accent top-left corner */}
          <div
            className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
            style={{ background: catColor, opacity: 0.7 }}
          />

          <div className="flex items-start justify-between mb-3 pl-3">
            {/* Icon */}
            <motion.div
              className="flex-shrink-0 mr-3"
              animate={{ rotate: hovered ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="rounded-xl p-2"
                style={{ background: catColor + "18", border: `1px solid ${catColor}30` }}
              >
                <TechIcon name={skill.name} size={26} />
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <span
                className="font-display text-sm md:text-base font-bold block truncate"
                style={{ color: "var(--text)", fontFamily: "'Syne', sans-serif" }}
              >
                {skill.name}
              </span>
              <span
                className="font-mono text-[9px] tracking-widest uppercase"
                style={{ color: catColor, opacity: 0.85 }}
              >
                {tier}
              </span>
            </div>

            <span
              className="font-mono text-xs font-bold ml-2 flex-shrink-0"
              style={{ color: catColor }}
            >
              {skill.level}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-1.5 rounded-full overflow-hidden ml-0"
            style={{ background: "var(--border-raw)" }}
          >
            <motion.div
              className="h-full rounded-full relative"
              style={{ background: `linear-gradient(90deg, ${catColor}bb, ${catColor})` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: false }}
              transition={{ duration: 1.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* glowing head */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                style={{ background: catColor, boxShadow: `0 0 8px 2px ${catColor}88` }}
                animate={hovered ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Dot level indicators */}
          <div className="flex gap-1 mt-3 pl-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{
                  background: i < Math.ceil(skill.level / 20) ? catColor : "var(--border-raw)",
                  opacity: i < Math.ceil(skill.level / 20) ? 0.8 : 0.3,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.06 + i * 0.08, duration: 0.4 }}
              />
            ))}
          </div>

          <p className="font-mono text-[8px] mt-2.5 tracking-wider opacity-40" style={{ color: "var(--text)" }}>
            TAP TO FLIP →
          </p>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-2xl p-5 md:p-6 flex flex-col justify-center items-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${catColor}ee, ${catColor}aa)`,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* background rings */}
          <div
            className="absolute rounded-full border-2 border-white/10"
            style={{ width: "150%", height: "150%", top: "-25%", left: "-25%" }}
          />
          <div
            className="absolute rounded-full border border-white/10"
            style={{ width: "100%", height: "100%", top: "0%", left: "0%" }}
          />

          <motion.div
            initial={false}
            animate={flipped ? { scale: [0.5, 1.15, 1], opacity: [0, 1, 1] } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-2 relative z-10"
          >
            <div className="rounded-2xl p-3 bg-white/20">
              <TechIcon name={skill.name} size={36} />
            </div>
            <span className="font-display text-xl font-black text-white mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {skill.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-white/80 tracking-widest uppercase">
                {tier}
              </span>
              <span className="text-xs text-white/70">{tierIcon}</span>
            </div>
            <div
              className="mt-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm"
              style={{ border: "1px solid white/30" }}
            >
              <span className="font-mono text-2xl font-black text-white">{skill.level}%</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Category Tab ─── */
const CategoryTab = ({
  cat,
  active,
  onClick,
}: {
  cat: typeof categories[0];
  active: boolean;
  onClick: () => void;
}) => {
  const count = skills.filter((s) => s.cat === cat.key).length;
  return (
    <motion.button
      onClick={onClick}
      className="relative px-4 md:px-6 py-2.5 md:py-3 rounded-full font-mono text-xs tracking-wider uppercase transition-colors duration-300 flex items-center gap-2"
      style={{
        color: active ? "#000" : "var(--text-muted-raw)",
        border: active ? "none" : "1px solid var(--border-raw)",
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {active && (
        <motion.div
          layoutId="skill-tab-bg"
          className="absolute inset-0 rounded-full"
          style={{ background: cat.color }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <span className="text-[10px]">{cat.icon}</span>
        <span>{cat.label}</span>
        <span
          className="rounded-full px-1.5 py-0.5 text-[8px] font-bold"
          style={{
            background: active ? "rgba(0,0,0,0.15)" : "var(--border-raw)",
            color: active ? "#000" : "var(--text-muted-raw)",
          }}
        >
          {count}
        </span>
      </span>
    </motion.button>
  );
};

/* ─── Floating Icon Orbit ─── */
const OrbitIcon = ({ name, angle, radius, speed }: { name: string; angle: number; radius: number; speed: number }) => {
  const [deg, setDeg] = useState(angle);
  useEffect(() => {
    const id = requestAnimationFrame(function tick() {
      setDeg((d) => d + speed);
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [speed]);
  const x = Math.cos((deg * Math.PI) / 180) * radius;
  const y = Math.sin((deg * Math.PI) / 180) * radius * 0.4;
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: "translate(-50%,-50%)",
        opacity: 0.6 + 0.4 * (y / (radius * 0.4) * 0.5 + 0.5),
        zIndex: y > 0 ? 2 : 1,
        filter: "drop-shadow(0 0 6px var(--gold))",
      }}
    >
      <TechIcon name={name} size={22} />
    </motion.div>
  );
};

/* ─── Main Section ─── */
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
  const activeCat = categories.find((c) => c.key === activeCategory)!;

  /* orbit icons — only the 6 most iconic */
  const orbitSkills = ["HTML5", "CSS3", "JavaScript", "Git & GitHub", "Figma", "C++"];

  /* average level */
  const avgLevel = Math.round(filtered.reduce((a, s) => a + s.level, 0) / filtered.length);

  return (
    <section ref={sectionRef} id="skills" className="section-spacing relative px-5 md:px-16 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .font-display { font-family: 'Syne', sans-serif !important; }
        .font-mono { font-family: 'DM Mono', monospace !important; }
      `}</style>

      {/* ambient orbs */}
      <FloatingOrb style={{ width: 400, height: 400, top: "5%", left: "-10%" }} />
      <FloatingOrb style={{ width: 300, height: 300, bottom: "10%", right: "-5%", animationDelay: "3s" }} />

      <div className="gradient-hr mb-12 md:mb-16" />

      {/* Giant background text */}
      <motion.div
        className="absolute top-[15%] left-0 right-0 pointer-events-none select-none hidden md:block"
        style={{ x: bgTextX }}
      >
        <span
          className="font-display font-black whitespace-nowrap"
          style={{ fontSize: "clamp(6rem, 18vw, 16rem)", color: "var(--text)", opacity: 0.02, lineHeight: 1 }}
        >
          SKILLS & EXPERTISE
        </span>
      </motion.div>

      {/* ── Header ── */}
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

      {/* ── Stats counter row ── */}
      <motion.div
        className="flex flex-wrap gap-6 md:gap-12 mb-10 md:mb-14"
        style={{ y: counterY, opacity: counterOpacity }}
      >
        {[
          { num: "20+", label: "Projects Built" },
          { num: `${skills.length}`, label: "Technologies" },
          { num: "4", label: "Skill Domains" },
          { num: `${Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length)}%`, label: "Avg. Proficiency" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <motion.span
              className="font-display text-3xl md:text-5xl font-black"
              style={{ color: "var(--gold)", fontFamily: "'Syne', sans-serif" }}
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {stat.num}
            </motion.span>
            <p className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase mt-1" style={{ color: "var(--text-muted-raw)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Icon Orbit Showcase ── */}
      <motion.div
        className="relative mx-auto mb-12 hidden md:flex items-center justify-center"
        style={{ width: 340, height: 140 }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* orbit ring */}
        <div
          className="absolute"
          style={{
            width: 300,
            height: 110,
            borderRadius: "50%",
            border: "1px dashed var(--border-accent)",
            left: 20,
            top: 15,
          }}
        />
        {/* center label */}
        <div
          className="absolute z-10 rounded-2xl px-4 py-2 text-center"
          style={{ background: "var(--bg-glass)", border: "1px solid var(--border-accent)" }}
        >
          <p className="font-mono text-[8px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>CORE STACK</p>
          <p className="font-display font-black text-sm" style={{ color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{orbitSkills.length} Tools</p>
        </div>
        {orbitSkills.map((name, i) => (
          <OrbitIcon
            key={name}
            name={name}
            angle={(i / orbitSkills.length) * 360}
            radius={140}
            speed={0.012}
          />
        ))}
      </motion.div>

      {/* ── Category Tabs ── */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-12">
        {categories.map((cat) => (
          <CategoryTab key={cat.key} cat={cat} active={activeCategory === cat.key} onClick={() => setActiveCategory(cat.key)} />
        ))}
      </div>

      {/* ── Active category meta-bar ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + "_meta"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4 mb-8 p-4 rounded-2xl"
          style={{ background: activeCat.color + "10", border: `1px solid ${activeCat.color}25` }}
        >
          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: activeCat.color }}>
            {activeCat.label}
          </span>
          <div className="h-3 w-px" style={{ background: activeCat.color, opacity: 0.4 }} />
          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "var(--text-muted-raw)" }}>
            {filtered.length} SKILLS
          </span>
          <div className="h-3 w-px" style={{ background: activeCat.color, opacity: 0.4 }} />
          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "var(--text-muted-raw)" }}>
            AVG {avgLevel}%
          </span>
          {/* mini sparkline */}
          <div className="flex-1 flex items-center gap-0.5 ml-2">
            {filtered.map((s) => (
              <motion.div
                key={s.name}
                className="flex-1 rounded-sm"
                style={{ background: activeCat.color, opacity: 0.5 + (s.level - 70) / 100 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ height: `${(s.level / 100) * 20}px`, background: activeCat.color, opacity: 0.6, borderRadius: 2 }}
                transition={{ delay: 0.1 }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Skill Cards Grid ── */}
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

      {/* ── Bottom decorative line ── */}
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
