import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { ArrowRight, ExternalLink, Github, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  year: string;
  color: string;
  github?: string;
  githubUrl?: string;
  repo?: string;
  repository?: string;
  live?: string;
  liveUrl?: string;
  demo?: string;
  demoUrl?: string;
  url?: string;
};

const DEFAULT_PROFILE_LINK = "https://github.com/Raviranjan010";

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Zenith Finance",
    category: "Fintech Platform",
    description:
      "Real-time trading dashboard processing $2M+ daily volume. Built with React, WebSocket streams, and D3.js visualizations.",
    tech: ["React", "TypeScript", "D3.js", "WebSocket", "PostgreSQL"],
    image: "/project-zenith.jpg",
    year: "2024",
    color: "#E8C547",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
  },
  {
    id: 2,
    title: "Nomad Studio",
    category: "Creative Agency",
    description:
      "Award-winning agency site with WebGL transitions, 3D product showcases, and an editorial blog engine.",
    tech: ["Next.js", "Three.js", "Sanity CMS", "GSAP", "Vercel"],
    image: "/project-nomad.jpg",
    year: "2023",
    color: "#4AAED9",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
  },
  {
    id: 3,
    title: "EcoTrack",
    category: "Climate Tech",
    description:
      "Carbon footprint tracker serving 50K+ users. ML-powered recommendations with real-time emissions data from IoT sensors.",
    tech: ["Vue", "Python", "TensorFlow", "MongoDB", "AWS"],
    image: "/project-ecotrack.jpg",
    year: "2023",
    color: "#4ADE80",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
  },
  {
    id: 4,
    title: "Vaultkey",
    category: "Web3 Security",
    description:
      "Multi-chain wallet security audit platform. Smart contract analysis with automated vulnerability detection.",
    tech: ["Rust", "Solidity", "React", "GraphQL", "Redis"],
    image: "/project-vaultkey.jpg",
    year: "2022",
    color: "#A78BFA",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
  },
];

const fetchProjects = async (): Promise<Project[]> => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${apiUrl}/projects`);
    if (res.ok) {
      const data = (await res.json()) as Project[];
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (error) {
    console.warn("Failed to fetch projects from API, falling back to local data:", error);
  }
  return [];
};

const getLinks = (project: Project) => ({
  github:
    project.github ||
    project.githubUrl ||
    project.repo ||
    project.repository ||
    DEFAULT_PROFILE_LINK,
  live:
    project.live ||
    project.liveUrl ||
    project.demo ||
    project.demoUrl ||
    project.url ||
    DEFAULT_PROFILE_LINK,
});

/* ─── Floating particle dots in the background ─── */
const ParticleField = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * -20,
        opacity: Math.random() * 0.35 + 0.05,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() > 0.5 ? 20 : -20, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ─── Animated grid lines ─── */
const GridLines = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.04]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  </div>
);

/* ─── Magnetic cursor glow ─── */
const MagneticCursor = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-screen"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: 400,
        height: 400,
        background:
          "radial-gradient(circle, rgba(232,197,71,0.06) 0%, transparent 65%)",
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    />
  );
};

/* ─── Scrolling marquee belt ─── */
const MarqueeBelt = ({ projects }: { projects: Project[] }) => {
  const words = projects.map((p) => p.title);
  const doubled = [...words, ...words, ...words];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/5 py-4 my-16">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, "-33.333%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((word, i) => (
          <span
            key={i}
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/15 shrink-0 flex items-center gap-12"
          >
            {word}
            <span className="text-[var(--gold)]/30">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ─── Velocity-based skew on drag ─── */
function useDragSkew(x: ReturnType<typeof useMotionValue>) {
  const xVelocity = useVelocity(x);
  const skewX = useSpring(useTransform(xVelocity, [-3000, 0, 3000], [8, 0, -8]), {
    stiffness: 300,
    damping: 40,
  });
  return skewX;
}

/* ─── Project index counter ─── */
const ProjectCounter = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div className="flex items-center gap-3">
    <motion.span
      key={current}
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -12, opacity: 0 }}
      className="font-mono text-2xl font-bold text-white tabular-nums"
    >
      {String(current + 1).padStart(2, "0")}
    </motion.span>
    <span className="font-mono text-white/20 text-sm">/</span>
    <span className="font-mono text-white/30 text-sm">{String(total).padStart(2, "0")}</span>
  </div>
);

/* ─── Glowing ring on card top-left corner ─── */
const CornerAccent = ({ color }: { color: string }) => (
  <svg
    className="absolute top-0 left-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"
    viewBox="0 0 80 80"
    fill="none"
  >
    <path
      d="M2 78 L2 2 L78 2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      pathLength="1"
      strokeDasharray="1"
      strokeDashoffset="0"
    />
  </svg>
);

/* ─── Project number badge ─── */
const IndexBadge = ({ index }: { index: number }) => (
  <div className="absolute -top-4 -left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#0A0A0A] border border-white/10 shadow-lg">
    <span className="font-mono text-[10px] text-white/40 font-bold">
      {String(index + 1).padStart(2, "0")}
    </span>
  </div>
);

/* ─── Shimmer border on hover ─── */
const ShimmerBorder = ({ color }: { color: string }) => (
  <motion.div
    className="pointer-events-none absolute inset-0 rounded-[2.5rem] z-10 opacity-0 group-hover:opacity-100"
    style={{
      background: `conic-gradient(from var(--angle, 0deg), transparent 40%, ${color}50 60%, transparent 80%)`,
    }}
    animate={{ "--angle": ["0deg", "360deg"] } as any}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
  >
    <div className="absolute inset-[1px] rounded-[calc(2.5rem-1px)] bg-[#0A0A0A]" />
  </motion.div>
);

/* ─── Enhanced ProjectCard ─── */
const ProjectCard = ({
  project,
  index,
  onHover,
}: {
  project: Project;
  index: number;
  onHover: (i: number | null) => void;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;
    rotateX.set((-mouseY / centerY) * 6);
    rotateY.set((mouseX / centerX) * 6);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(null);
    rotateX.set(0);
    rotateY.set(0);
  };

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 40 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 40 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleTilt(e);
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(index);
      }}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-[500px] w-[340px] md:h-[600px] md:w-[450px] lg:w-[500px] shrink-0 flex-col overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 shadow-2xl"
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
        rotateX: springRotateX,
        rotateY: springRotateY,
        perspective: 1000,
      }}
      whileHover={{ y: -14, scale: 1.02, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
    >
      {/* Shimmer border */}
      <ShimmerBorder color={project.color} />

      {/* Index badge */}
      <IndexBadge index={index} />

      {/* Corner accent */}
      <CornerAccent color={project.color} />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${project.color}15, transparent 45%)`,
        }}
      />

      {/* Image Section */}
      <div className="relative h-[45%] md:h-[50%] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <motion.img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover filter brightness-[0.85] transition-all duration-700 ease-[0.22,1,0.36,1] group-hover:scale-110 group-hover:brightness-100"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Gradient fallback */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(135deg, ${project.color}20 0%, #0A0A0A 100%)`,
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 z-10 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent z-10" />

        {/* Category */}
        <div className="absolute top-6 left-6 z-20 flex gap-2">
          <motion.span
            className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-mono rounded-full font-semibold backdrop-blur-md bg-black/50 border"
            style={{ color: project.color, borderColor: `${project.color}40` }}
            whileHover={{ scale: 1.05 }}
          >
            {project.category}
          </motion.span>
        </div>

        {/* Action links */}
        <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 -translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {[
            { href: getLinks(project).github, icon: <Github size={18} />, label: "GitHub Repository" },
            { href: getLinks(project).live, icon: <ExternalLink size={18} />, label: "Live Demo" },
          ].map(({ href, icon, label }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
              whileHover={{ scale: 1.15, rotate: i === 1 ? 12 : 0 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {icon}
            </motion.a>
          ))}
        </div>

        {/* Glowing color strip at image bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] z-20"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: index * 0.15 + 0.5 }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-grow p-6 md:p-8 bg-gradient-to-t from-[#040404] to-[#0A0A0A] z-20">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-mono text-white/30">{project.year}</span>
          <motion.div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: project.color }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <h3 className="mb-4 text-2xl md:text-3xl font-display font-bold text-white">
          <span
            className="bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500"
            style={{
              backgroundImage: isHovered
                ? `linear-gradient(135deg, ${project.color}, #fff)`
                : "linear-gradient(135deg, #fff, rgba(255,255,255,0.55))",
            }}
          >
            {project.title}
          </span>
        </h3>

        <p className="text-sm md:text-base text-white/55 leading-relaxed font-body mb-8 line-clamp-3 md:line-clamp-4">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <motion.span
              key={t}
              className="px-3 py-1.5 text-[10px] font-mono text-white/50 bg-white/5 rounded-md border border-white/5"
              initial={false}
              animate={
                isHovered
                  ? { borderColor: `${project.color}30`, color: "rgba(255,255,255,0.8)", backgroundColor: `${project.color}10` }
                  : { borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.05)" }
              }
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

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
