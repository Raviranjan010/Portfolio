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
import { ArrowRight, ExternalLink, Github, Sparkles, Eye, Code2, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

/* ─────────────────────────── Types ─────────────────────────── */
type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  year: string;
  color: string;
  accentColor?: string;
  github?: string;
  githubUrl?: string;
  repo?: string;
  repository?: string;
  live?: string;
  liveUrl?: string;
  demo?: string;
  demoUrl?: string;
  url?: string;
  stats?: { label: string; value: string }[];
};

/* ─────────────────────────── Constants ─────────────────────── */
const DEFAULT_PROFILE_LINK = "https://github.com/Raviranjan010";

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Zenith Finance",
    category: "Fintech Platform",
    description:
      "Real-time trading dashboard processing $2M+ daily volume. Built with React, WebSocket streams, and D3.js visualizations for institutional traders.",
    tech: ["React", "TypeScript", "D3.js", "WebSocket", "PostgreSQL"],
    image: "/project-zenith.jpg",
    year: "2024",
    color: "#E8C547",
    accentColor: "#F5E27A",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
    stats: [
      { label: "Daily Volume", value: "$2M+" },
      { label: "Uptime", value: "99.99%" },
      { label: "Users", value: "12K" },
    ],
  },
  {
    id: 2,
    title: "Nomad Studio",
    category: "Creative Agency",
    description:
      "Award-winning agency site with WebGL transitions, 3D product showcases, and an editorial blog engine. Winner of Awwwards Site of the Day.",
    tech: ["Next.js", "Three.js", "Sanity CMS", "GSAP", "Vercel"],
    image: "/project-nomad.jpg",
    year: "2023",
    color: "#4AAED9",
    accentColor: "#7DCFED",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
    stats: [
      { label: "Awwwards", value: "SOTD" },
      { label: "Load Time", value: "0.8s" },
      { label: "Score", value: "100/100" },
    ],
  },
  {
    id: 3,
    title: "EcoTrack",
    category: "Climate Tech",
    description:
      "Carbon footprint tracker serving 50K+ users. ML-powered recommendations with real-time emissions data streamed from distributed IoT sensor networks.",
    tech: ["Vue", "Python", "TensorFlow", "MongoDB", "AWS"],
    image: "/project-ecotrack.jpg",
    year: "2023",
    color: "#4ADE80",
    accentColor: "#86EFAC",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
    stats: [
      { label: "Users", value: "50K+" },
      { label: "CO₂ Saved", value: "120T" },
      { label: "Sensors", value: "8K" },
    ],
  },
  {
    id: 4,
    title: "Vaultkey",
    category: "Web3 Security",
    description:
      "Multi-chain wallet security audit platform. Smart contract analysis with automated vulnerability detection across 15 EVM-compatible chains.",
    tech: ["Rust", "Solidity", "React", "GraphQL", "Redis"],
    image: "/project-vaultkey.jpg",
    year: "2022",
    color: "#A78BFA",
    accentColor: "#C4B5FD",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
    stats: [
      { label: "Chains", value: "15" },
      { label: "Audits", value: "3.2K" },
      { label: "TVL Secured", value: "$90M" },
    ],
  },
  {
    id: 5,
    title: "Prism AI",
    category: "Machine Learning",
    description:
      "Visual design critique tool powered by multimodal LLMs. Upload any design and receive structured feedback on hierarchy, contrast, and usability.",
    tech: ["Python", "FastAPI", "OpenAI", "React", "Supabase"],
    image: "/project-prism.jpg",
    year: "2024",
    color: "#F472B6",
    accentColor: "#FBCFE8",
    github: DEFAULT_PROFILE_LINK,
    live: DEFAULT_PROFILE_LINK,
    stats: [
      { label: "Designs Rated", value: "200K" },
      { label: "Accuracy", value: "94%" },
      { label: "Avg Rating", value: "4.9★" },
    ],
  },
];

/* ─────────────────────────── Helpers ───────────────────────── */
const fetchProjects = async (): Promise<Project[]> => {
  const apiUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${apiUrl}/projects`);
    if (res.ok) {
      const data = (await res.json()) as Project[];
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    /* noop */
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

/* ─────────────────────── Noise SVG Overlay ─────────────────── */
const NoiseOverlay = () => (
  <svg className="pointer-events-none fixed inset-0 z-[999] opacity-[0.035] h-full w-full" aria-hidden>
    <filter id="noise-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise-filter)" />
  </svg>
);

/* ─────────────────────── Magnetic Button ───────────────────── */
const MagneticLink = ({
  href,
  children,
  className,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 20 });
  const springY = useSpring(y, { stiffness: 250, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.a>
  );
};

/* ─────────────────────── Velocity Ticker ───────────────────── */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const ParallaxText = ({ children, baseVelocity = -4 }: { children: string; baseVelocity?: number }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const items = Array(4).fill(children);

  return (
    <div className="overflow-hidden whitespace-nowrap flex">
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="block font-display font-black text-[clamp(5rem,12vw,10rem)] uppercase tracking-tighter leading-none text-transparent mr-12"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}
          >
            {item} <span style={{ color: "rgba(255,255,255,0.04)" }}>✦</span>{" "}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ─────────────────────── 3D Tilt Card ──────────────────────── */
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const springTilt = {
    x: useSpring(0, { stiffness: 150, damping: 20 }),
    y: useSpring(0, { stiffness: 150, damping: 20 }),
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    springTilt.x.set(cy * 18);
    springTilt.y.set(-cx * 18);
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
    setTilt({ x: cx, y: cy });
  };

  const handleMouseLeave = () => {
    springTilt.x.set(0);
    springTilt.y.set(0);
    setIsHovered(false);
    setIsFlipped(false);
  };

  const glowOpacity = isHovered ? 1 : 0;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
      className="relative flex shrink-0 cursor-pointer"
      style={{ perspective: "1200px", width: "clamp(320px,30vw,500px)", height: "clamp(500px,50vh,640px)" }}
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow behind card */}
      <motion.div
        className="absolute inset-0 rounded-[2.5rem] blur-2xl -z-10 scale-95"
        style={{ background: project.color }}
        animate={{ opacity: isHovered ? 0.18 : 0, scale: isHovered ? 1.05 : 0.95 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: springTilt.x,
          rotateY: springTilt.y,
          rotateZ: 0,
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/[0.07] shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Radial cursor glow */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[2.5rem] z-30"
            animate={{ opacity: glowOpacity }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${project.color}18, transparent 50%)`,
            }}
          />

          {/* Corner chrome accents */}
          <svg className="absolute top-0 left-0 w-16 h-16 z-20 opacity-30" viewBox="0 0 64 64">
            <path d="M4 32 L4 4 L32 4" stroke={project.color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
          <svg className="absolute bottom-0 right-0 w-16 h-16 z-20 opacity-30" viewBox="0 0 64 64">
            <path d="M60 32 L60 60 L32 60" stroke={project.color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>

          {/* Image */}
          <div className="relative h-[44%] w-full overflow-hidden rounded-t-[2.5rem]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent z-10" />
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: `linear-gradient(135deg, ${project.color}22, #0A0A0A88)` }}
            />
            <motion.img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />

            {/* Category tag */}
            <div className="absolute top-5 left-5 z-20">
              <span
                className="px-3.5 py-1.5 text-[9px] uppercase tracking-[0.2em] font-mono rounded-full border backdrop-blur-md bg-black/40 font-bold"
                style={{ color: project.color, borderColor: `${project.color}40` }}
              >
                {project.category}
              </span>
            </div>

            {/* Action buttons */}
            <motion.div
              className="absolute top-5 right-5 z-20 flex gap-2"
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {[
                { icon: <Github size={15} />, href: getLinks(project).github, label: "GitHub" },
                { icon: <ExternalLink size={15} />, href: getLinks(project).live, label: "Live" },
              ].map(({ icon, href, label }) => (
                <MagneticLink
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                >
                  {icon}
                </MagneticLink>
              ))}
            </motion.div>

            {/* Year badge */}
            <div className="absolute bottom-5 right-5 z-20">
              <span className="font-mono text-[10px] text-white/30">{project.year}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow px-7 py-6 relative">
            {/* Index number */}
            <span
              className="absolute -top-6 right-7 font-display font-black text-[7rem] leading-none pointer-events-none select-none"
              style={{ color: `${project.color}08`, WebkitTextStroke: `1px ${project.color}12` }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="mb-3 font-display font-black text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
              <span
                className="bg-clip-text text-transparent transition-all duration-500"
                style={{
                  backgroundImage: isHovered
                    ? `linear-gradient(135deg, #fff 0%, ${project.accentColor ?? project.color} 100%)`
                    : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.5))",
                }}
              >
                {project.title}
              </span>
            </h3>

            <p className="text-[13px] text-white/50 leading-relaxed mb-5 line-clamp-3 font-light">
              {project.description}
            </p>

            {/* Stats row */}
            {project.stats && (
              <motion.div
                className="flex gap-4 mb-5"
                animate={{ opacity: isHovered ? 1 : 0.4, y: isHovered ? 0 : 4 }}
                transition={{ duration: 0.4 }}
              >
                {project.stats.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="font-mono font-bold text-[13px]" style={{ color: project.color }}>
                      {s.value}
                    </span>
                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tech stack */}
            <div className="mt-auto flex flex-wrap gap-1.5">
              {project.tech.map((t, i) => (
                <motion.span
                  key={t}
                  className="px-2.5 py-1 text-[9px] font-mono rounded-md border border-white/[0.06] bg-white/[0.03] text-white/40 transition-all"
                  animate={{
                    borderColor: isHovered ? `${project.color}40` : "rgba(255,255,255,0.06)",
                    color: isHovered ? project.color : "rgba(255,255,255,0.4)",
                    backgroundColor: isHovered ? `${project.color}10` : "rgba(255,255,255,0.03)",
                  }}
                  transition={{ duration: 0.3, delay: isHovered ? i * 0.04 : 0 }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Bottom progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
            animate={{ width: isHovered ? "100%" : "0%", opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────── Counter Animation ─────────────────── */
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─────────────────────── Main Section ──────────────────────── */
const ProjectsSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data: apiProjects = [], isFetching } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    retry: 1,
  });
  const projects = apiProjects.length > 0 ? apiProjects : fallbackProjects;

  useEffect(() => {
    const update = () => {
      if (trackRef.current) {
        const maxDrag = trackRef.current.scrollWidth - window.innerWidth + 120;
        setTrackWidth(maxDrag > 0 ? maxDrag : 0);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [projects]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  // Scroll-driven transforms
  const bgY = useTransform(smooth, [0, 1], ["-15%", "15%"]);
  const titleY = useTransform(smooth, [0, 0.5], [120, 0]);
  const titleOpacity = useTransform(smooth, [0.05, 0.35], [0, 1]);
  const tickerY = useTransform(smooth, [0.2, 0.8], [40, -40]);
  const scrollX = useTransform(smooth, [0.1, 0.9], ["8%", "-30%"]);

  // Scanline overlay pulse
  const [scanlineOffset, setScanlineOffset] = useState(0);
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setScanlineOffset((p) => (p + 0.3) % 100);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <NoiseOverlay />
      <section
        ref={containerRef}
        id="projects"
        className="relative min-h-[200vh] overflow-hidden"
        style={{ background: "linear-gradient(180deg, #050505 0%, #080808 50%, #050505 100%)" }}
      >
        {/* ── Subtle scanlines ── */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.015]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* ── Gradient orbs ── */}
        <motion.div
          style={{ y: bgY }}
          className="absolute top-[5%] left-[-15%] w-[70vw] h-[70vw] rounded-full pointer-events-none"
          aria-hidden
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-amber-400/8 via-amber-500/4 to-transparent blur-[160px]" />
        </motion.div>

        <motion.div
          style={{ y: useTransform(smooth, [0, 1], ["15%", "-15%"]) }}
          className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
          aria-hidden
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-violet-500/6 via-purple-600/3 to-transparent blur-[140px]" />
        </motion.div>

        {/* ── Top separator ── */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Velocity ticker (background text) ── */}
        <motion.div
          style={{ y: tickerY }}
          className="absolute top-32 left-0 w-full pointer-events-none z-0 select-none overflow-hidden"
        >
          <ParallaxText baseVelocity={-3}>Selected Works</ParallaxText>
        </motion.div>

        {/* ── Stats bar ── */}
        <div className="relative z-10 pt-28 pb-0 px-8 md:px-16 max-w-7xl mx-auto">
          <motion.div
            className="flex gap-8 md:gap-16 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { n: projects.length, s: "", label: "Projects" },
              { n: 4, s: "+", label: "Years Exp." },
              { n: 98, s: "%", label: "Client Satisfaction" },
            ].map(({ n, s, label }) => (
              <div key={label} className="flex flex-col">
                <span className="font-display font-black text-4xl md:text-5xl text-white/90">
                  <AnimatedCounter target={n} suffix={s} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 mt-1">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Header ── */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="relative z-10 px-8 md:px-16 max-w-7xl mx-auto mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div className="max-w-3xl">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <motion.span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-amber-400"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={13} />
              </motion.span>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-amber-400/80">Featured Works</p>
              <div className="h-px w-16 bg-gradient-to-r from-amber-400/60 to-transparent" />
            </motion.div>

            <h2 className="font-display font-black leading-[0.88] tracking-tighter">
              {["SELECTED", "PROJECTS"].map((word, wi) => (
                <motion.span
                  key={word}
                  className="block overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + wi * 0.1 }}
                >
                  <motion.span
                    className={`block text-[clamp(3.5rem,9vw,8rem)] ${wi === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400" : "text-white"}`}
                    initial={{ y: "110%" }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.25 + wi * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                </motion.span>
              ))}
            </h2>
          </div>

          <div className="max-w-xs md:pb-4 space-y-6">
            <p className="font-light text-[15px] text-white/45 leading-relaxed">
              Scalable architectures, immersive interfaces, and beautiful products — crafted with intention.
              {isFetching && (
                <motion.span
                  className="ml-2 text-amber-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ●
                </motion.span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <div className="relative h-px w-12 overflow-hidden bg-white/10">
                <motion.div
                  className="absolute inset-0 bg-amber-400"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">Drag to explore</span>
            </div>

            {/* Mini project dots nav */}
            <div className="flex gap-2">
              {projects.map((p, i) => (
                <motion.button
                  key={p.id}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ background: activeIndex === i ? p.color : "rgba(255,255,255,0.15)" }}
                  animate={{ width: activeIndex === i ? 24 : 6 }}
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Card Track ── */}
        <motion.div
          style={{ x: scrollX }}
          className="relative z-20 pl-8 md:pl-16 lg:pl-32"
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ right: 0, left: -trackWidth }}
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 30 }}
            className="flex gap-7 md:gap-10 cursor-grab active:cursor-grabbing pb-16"
          >
            <AnimatePresence>
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>

            {/* End CTA */}
            <div className="flex shrink-0 w-[220px] md:w-[280px] items-center justify-center">
              <MagneticLink
                href={DEFAULT_PROFILE_LINK}
                className="group relative flex flex-col items-center gap-5 justify-center h-52 w-52 rounded-full border border-white/8 text-white/35 transition-all duration-500 hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-400"
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, rgba(232,197,71,0.12) 25%, transparent 50%)",
                  }}
                />
                <div className="relative h-14 w-14 rounded-full bg-white/5 group-hover:bg-amber-400/20 transition-colors flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ x: [0, 48, -48, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight size={20} className="relative z-10" />
                  </motion.div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] relative z-10">View All</span>
              </MagneticLink>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Bottom decorative ticker ── */}
        <div className="relative z-10 mt-8 overflow-hidden opacity-20">
          <ParallaxText baseVelocity={2}>
            React · TypeScript · Next.js · Three.js · Rust · Solidity · Python · TensorFlow ·
          </ParallaxText>
        </div>

        {/* ── Bottom separator ── */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </section>
    </>
  );
};

export default ProjectsSection;
