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

/* ─── Progress bar ─── */
const ScrollProgressBar = ({ progress }: { progress: ReturnType<typeof useMotionValue> }) => {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="h-[1px] w-full bg-white/5 overflow-hidden rounded-full">
      <motion.div
        className="h-full rounded-full"
        style={{
          width,
          background: "linear-gradient(90deg, var(--gold), #fffbe6)",
        }}
      />
    </div>
  );
};

/* ─── Main section ─── */
const ProjectsSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dragX = useMotionValue(0);
  const skewX = useDragSkew(dragX);

  const { data: apiProjects = [], isFetching } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    retry: 1,
  });

  const projects = apiProjects.length > 0 ? apiProjects : fallbackProjects;

  useEffect(() => {
    if (trackRef.current) {
      const updateWidth = () => {
        if (trackRef.current) {
          const maxDrag = trackRef.current.scrollWidth - window.innerWidth + 100;
          setTrackWidth(maxDrag > 0 ? maxDrag : 0);
        }
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, [projects]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  const bgY = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);
  const titleY = useTransform(smoothProgress, [0, 0.5], [120, 0]);
  const titleOpacity = useTransform(smoothProgress, [0.05, 0.35], [0, 1]);
  const scrollTranslateX = useTransform(smoothProgress, [0, 1], ["5%", "-25%"]);

  /* ambient light reacts to hovered project */
  const ambientColor =
    hoveredIndex !== null ? projects[hoveredIndex]?.color ?? "#E8C547" : "#E8C547";

  return (
    <>
      <MagneticCursor />

      <section
        ref={containerRef}
        id="projects"
        className="relative min-h-[150vh] bg-[var(--bg)] overflow-hidden py-32 md:py-48"
      >
        <GridLines />
        <ParticleField />

        {/* Dynamic ambient orbs */}
        <motion.div
          style={{ y: bgY }}
          className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[130px] pointer-events-none transition-all duration-1000"
          animate={{ background: `radial-gradient(circle, ${ambientColor}18, transparent 70%)` }}
        />
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], ["20%", "-20%"]) }}
          className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-l from-white/5 to-transparent blur-[110px] pointer-events-none"
        />
        {/* Extra deep glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hoveredIndex !== null ? 0.5 : 0 }}
          transition={{ duration: 0.8 }}
          style={{
            background: `radial-gradient(ellipse 80% 40% at 50% 60%, ${ambientColor}08, transparent)`,
          }}
        />

        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ─── Header ─── */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="relative z-10 px-6 md:px-16 max-w-7xl mx-auto mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div className="max-w-3xl">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">
                <Sparkles size={14} />
              </span>
              <p className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--gold)]">
                Featured Works
              </p>
            </motion.div>

            <h2 className="font-display font-black text-6xl md:text-8xl lg:text-9xl leading-[0.88] text-white tracking-tighter">
              {"SELECTED".split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: 80, opacity: 0, rotateX: -90 }}
                  whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.04 + 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-yellow-200">
                {"PROJECTS".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: 80, opacity: 0, rotateX: -90 }}
                    whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.04 + 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h2>
          </div>

          <div className="max-w-md md:pb-4">
            <motion.p
              className="font-body text-base md:text-lg text-white/45 leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              A curated collection of scalable architectures, interactive
              experiences, and beautiful interfaces. Crafted with modern web
              technologies.
              {isFetching && (
                <span className="animate-pulse text-[var(--gold)] ml-2">
                  Loading...
                </span>
              )}
            </motion.p>

            <motion.div
              className="mt-8 flex items-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.65 }}
            >
              <div className="h-[1px] w-12 bg-white/20 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-[var(--gold)]"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                Scroll + Drag to explore
              </span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <ScrollProgressBar progress={smoothProgress} />
            </motion.div>
          </div>
        </motion.div>

        {/* ─── Marquee belt ─── */}
        <MarqueeBelt projects={projects} />

        {/* ─── Draggable horizontal track ─── */}
        <motion.div
          style={{ x: scrollTranslateX }}
          className="relative z-20 flex px-6 md:px-16 lg:pl-32"
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ right: 0, left: -trackWidth }}
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 22 }}
            style={{ x: dragX, skewX }}
            className="relative flex gap-6 md:gap-10 lg:gap-16 cursor-grab active:cursor-grabbing pb-16"
          >
            <AnimatePresence>
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onHover={setHoveredIndex}
                />
              ))}
            </AnimatePresence>

            {/* ─── View All CTA ─── */}
            <div className="flex shrink-0 w-[200px] md:w-[300px] items-center justify-center">
              <motion.a
                href={DEFAULT_PROFILE_LINK}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-5 justify-center h-52 w-52 rounded-full border border-white/10 text-white/50 relative overflow-hidden"
                whileHover={{ scale: 1.08, borderColor: "rgba(232,197,71,0.4)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Spinning ring */}
                <motion.div
                  className="absolute inset-2 rounded-full border border-dashed border-[var(--gold)]/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-5 rounded-full border border-[var(--gold)]/10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />

                {/* Radial fill */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(232,197,71,0.08) 0%, transparent 70%)",
                  }}
                />

                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/5 group-hover:bg-[var(--gold)]/20 transition-colors z-10">
                  <ArrowRight
                    size={22}
                    className="relative z-10 transition-transform duration-500 group-hover:translate-x-[200%] text-white/60 group-hover:text-[var(--gold)]"
                  />
                  <ArrowRight
                    size={22}
                    className="absolute inset-0 m-auto -translate-x-[200%] transition-transform duration-500 group-hover:translate-x-0 text-[var(--gold)]"
                  />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest z-10 group-hover:text-[var(--gold)] transition-colors">
                  View All
                </span>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Bottom accent line ─── */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>
    </>
  );
};

export default ProjectsSection;
