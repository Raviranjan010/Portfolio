import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Sparkles,
  X,
  Eye,
  Code2,
  ArrowRight,
  Play,
} from "lucide-react";
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
  live?: string;
  liveUrl?: string;
  stats?: { label: string; value: string }[];
  fullDescription?: string;
};

/* ─────────────────────────── Constants ─────────────────── */
const DEFAULT_PROFILE_LINK = "https://github.com/Raviranjan010";

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Zenith Finance",
    category: "Fintech Platform",
    description: "Real-time trading dashboard processing $2M+ daily volume.",
    fullDescription:
      "A sophisticated fintech platform delivering institutional-grade trading infrastructure with real-time data streaming, advanced visualizations, and multi-asset support.",
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
    description: "Award-winning agency site with WebGL transitions.",
    fullDescription:
      "Premium creative agency platform with immersive 3D showcases, smooth WebGL transitions, and headless CMS integration.",
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
    description: "Carbon footprint tracker serving 50K+ users.",
    fullDescription:
      "Environmental impact platform with ML-powered recommendations and real-time emissions tracking from IoT sensors.",
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
    description: "Multi-chain wallet security audit platform.",
    fullDescription:
      "Smart contract analysis platform with automated vulnerability detection across 15 EVM-compatible chains.",
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
    description: "Visual design critique tool powered by LLMs.",
    fullDescription:
      "AI-powered design feedback system using multimodal LLMs for comprehensive design analysis.",
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
      { label: "Rating", value: "4.9★" },
    ],
  },
];

/* ─────────────────────────── Helpers ───────────────────────── */
const fetchProjects = async (): Promise<Project[]> => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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
  github: project.github || project.githubUrl || DEFAULT_PROFILE_LINK,
  live: project.live || project.liveUrl || DEFAULT_PROFILE_LINK,
});

/* ─────────────────────── Animated Background ─────────────────── */
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Gradient orbs */}
    <motion.div
      className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -50, 40, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-full h-full rounded-full bg-gradient-radial from-amber-400/15 via-amber-500/5 to-transparent blur-3xl" />
    </motion.div>

    <motion.div
      className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
      animate={{
        x: [0, -40, 30, 0],
        y: [0, 50, -40, 0],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <div className="w-full h-full rounded-full bg-gradient-radial from-violet-500/10 via-purple-600/5 to-transparent blur-3xl" />
    </motion.div>

    <motion.div
      className="absolute top-1/2 right-0 w-80 h-80 rounded-full pointer-events-none"
      animate={{
        x: [0, -50, 20, 0],
        y: [0, 30, -50, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    >
      <div className="w-full h-full rounded-full bg-gradient-radial from-blue-400/10 via-blue-500/5 to-transparent blur-3xl" />
    </motion.div>
  </div>
);

/* ─────────────────────── Project Card (Carousel) ─────────────────── */
const CarouselProjectCard = ({
  project,
  isCenter,
  isLeft,
  isRight,
  onClick,
}: {
  project: Project;
  isCenter: boolean;
  isLeft: boolean;
  isRight: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getScale = () => (isCenter ? 1 : 0.75);
  const getOpacity = () => (isCenter ? 1 : isLeft || isRight ? 0.6 : 0);
  const getZIndex = () => (isCenter ? 10 : isLeft || isRight ? 5 : 0);
  const getX = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isCenter) return 0;
    if (isLeft) return isMobile ? "-70%" : "-55%";
    if (isRight) return isMobile ? "70%" : "55%";
    return 0;
  };

  return (
    <motion.div
      className="absolute w-full flex justify-center"
      animate={{
        scale: getScale(),
        opacity: getOpacity(),
        x: getX(),
        zIndex: getZIndex(),
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", maxWidth: "540px", padding: "0 16px" }}
    >
      <motion.div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full cursor-pointer relative"
        whileHover={isCenter ? { y: -8 } : {}}
      >
        {/* Card background blur */}
        <motion.div
          className="absolute -inset-0.5 rounded-3xl blur-2xl -z-10"
          style={{ background: project.color }}
          animate={{ opacity: isHovered && isCenter ? 0.25 : 0.1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Main card */}
        <div
          className="relative overflow-hidden rounded-3xl backdrop-blur-2xl border"
          style={{
            borderColor: isCenter
              ? `${project.color}80`
              : `${project.color}30`,
            backgroundColor: isCenter
              ? `rgba(255, 255, 255, 0.08)`
              : "rgba(255, 255, 255, 0.04)",
          }}
        >
          {/* Image section */}
          <div className="relative h-64 overflow-hidden group">
            {/* Gradient overlay */}
            <motion.div
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: `linear-gradient(135deg, ${project.color}30, #0A0A0A99)`,
              }}
            />

            {/* Image */}
            <motion.img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
              animate={{ scale: isHovered && isCenter ? 1.05 : 1 }}
              transition={{ duration: 0.6 }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Category badge */}
            <motion.div
              className="absolute top-5 left-5 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span
                className="px-4 py-2 text-xs uppercase tracking-[0.15em] font-mono font-semibold rounded-full backdrop-blur-md border"
                style={{
                  color: project.color,
                  borderColor: `${project.color}60`,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                }}
              >
                {project.category}
              </span>
            </motion.div>

            {/* Year badge */}
            <motion.div
              className="absolute top-5 right-5 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 backdrop-blur-md bg-black/40 rounded-full border border-white/10">
                {project.year}
              </span>
            </motion.div>

            {/* Play button - only show on center card when hovered */}
            <AnimatePresence>
              {isCenter && isHovered && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                  >
                    <div
                      className="w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-md"
                      style={{
                        borderColor: project.color,
                        backgroundColor: `${project.color}20`,
                      }}
                    >
                      <Play
                        size={28}
                        style={{ color: project.color }}
                        fill={project.color}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content section */}
          <motion.div
            className="p-8"
            animate={{ opacity: isCenter ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h3
              className="text-2xl md:text-3xl font-black font-display mb-2 leading-tight"
              style={{
                background: `linear-gradient(135deg, #fff 0%, ${project.accentColor ?? project.color} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-white/60 mb-6 leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.slice(0, 4).map((tech, i) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1 text-xs font-mono rounded-md border text-white/50"
                  style={{
                    borderColor: `${project.color}40`,
                    backgroundColor: `${project.color}08`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Stats */}
            {isCenter && project.stats && (
              <motion.div
                className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {project.stats.map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="font-black text-lg font-display"
                      style={{ color: project.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs font-mono text-white/30 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Action buttons - only on center card */}
            {isCenter && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href={getLinks(project).live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wide font-mono border-2 transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    borderColor: project.color,
                    color: project.color,
                    backgroundColor: `${project.color}15`,
                  }}
                >
                  <Eye size={14} />
                  Live
                </a>
                <a
                  href={getLinks(project).github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wide font-mono border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Github size={14} />
                  Code
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────── Detail Modal ─────────────────── */
const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden backdrop-blur-3xl border"
              style={{
                borderColor: `${project.color}60`,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                boxShadow: `0 0 100px ${project.color}20, inset 0 0 60px ${project.color}05`,
              }}
            >
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 h-10 w-10 rounded-full backdrop-blur-md border border-white/20 text-white/60 hover:text-white flex items-center justify-center transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>

              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${project.color}40, #0A0A0A99)`,
                  }}
                />
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Category badge */}
                  <span
                    className="px-4 py-2 text-xs uppercase tracking-[0.15em] font-mono font-semibold rounded-full border inline-block mb-4 backdrop-blur-md"
                    style={{
                      color: project.color,
                      borderColor: `${project.color}60`,
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {project.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl font-black font-display mb-4 leading-tight">
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(135deg, #fff 0%, ${project.accentColor ?? project.color} 100%)`,
                      }}
                    >
                      {project.title}
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    {project.fullDescription || project.description}
                  </p>

                  {/* Stats grid */}
                  {project.stats && (
                    <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-white/10">
                      {project.stats.map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.08 }}
                        >
                          <p
                            className="text-2xl font-black font-display"
                            style={{ color: project.color }}
                          >
                            {stat.value}
                          </p>
                          <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
                            {stat.label}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Tech stack */}
                  <div className="mb-8">
                    <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
                      Built With
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <motion.span
                          key={tech}
                          className="px-3.5 py-2 text-xs font-mono rounded-lg border font-medium"
                          style={{
                            borderColor: `${project.color}40`,
                            backgroundColor: `${project.color}10`,
                            color: project.color,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <motion.div
                    className="flex gap-4 flex-wrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <a
                      href={getLinks(project).live}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wide font-mono border-2 transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        borderColor: project.color,
                        color: "white",
                        backgroundColor: project.color,
                      }}
                    >
                      <ExternalLink size={16} />
                      Visit Live Site
                    </a>
                    <a
                      href={getLinks(project).github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wide font-mono border-2 border-white/20 text-white transition-all duration-300 flex items-center justify-center gap-2 hover:border-white/40"
                    >
                      <Github size={16} />
                      View Source
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────── Main Section ──────────────────────── */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ProjectsCarouselSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: apiProjects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    retry: 1,
  });

  const projects = apiProjects.length > 0 ? apiProjects : fallbackProjects;

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, [projects.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, [projects.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <>
      <section
        ref={containerRef}
        id="projects"
        className="relative min-h-screen py-20 md:py-32 overflow-hidden"
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #050505 0%, #080808 50%, #050505 100%)",
        }}
      >
        <AnimatedBackground />

        {/* Top separator */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Container */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <motion.div
            className="px-6 md:px-12 mb-16 md:mb-20 text-center max-w-4xl mx-auto"
            style={{ opacity, y }}
          >
            {/* Badge */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-amber-400"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={14} />
              </motion.span>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-amber-400/80">
                SHOWCASE
              </p>
              <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-amber-400/60 to-transparent" />
            </motion.div>

            {/* Title */}
            <motion.h2
              className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tighter mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-white">Featured</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                Projects
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Explore my latest work showcasing scalable architectures, immersive interfaces, and
              beautiful products crafted with precision.
            </motion.p>
          </motion.div>

          {/* Carousel section */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-12">
            {/* Cards container */}
            <motion.div
              ref={carouselRef}
              className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center touch-pan-y"
              style={{ perspective: "1000px" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  handleNext();
                } else if (swipe > swipeConfidenceThreshold) {
                  handlePrevious();
                }
              }}
            >
              {/* Center card */}
              {projects.map((project, idx) => {
                const centerIdx = currentIndex;
                const leftIdx = (centerIdx - 1 + projects.length) % projects.length;
                const rightIdx = (centerIdx + 1) % projects.length;

                return (
                  <CarouselProjectCard
                    key={project.id}
                    project={project}
                    isCenter={idx === centerIdx}
                    isLeft={idx === leftIdx}
                    isRight={idx === rightIdx}
                    onClick={() => setSelectedProject(project)}
                  />
                );
              })}
            </motion.div>

            {/* Controls */}
            <motion.div
              className="relative z-20 mt-12 md:mt-16 flex items-center justify-center gap-6 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {/* Previous button */}
              <motion.button
                onClick={handlePrevious}
                className="h-12 w-12 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all flex items-center justify-center backdrop-blur-md group"
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous project"
              >
                <ChevronLeft size={20} />
              </motion.button>

              {/* Dot indicators */}
              <div className="flex gap-2 items-center">
                {projects.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className="rounded-full transition-all duration-300"
                    animate={{
                      width: idx === currentIndex ? 24 : 6,
                      height: 6,
                      backgroundColor:
                        idx === currentIndex
                          ? projects[currentIndex].color
                          : "rgba(255, 255, 255, 0.2)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    aria-label={`Go to project ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next button */}
              <motion.button
                onClick={handleNext}
                className="h-12 w-12 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all flex items-center justify-center backdrop-blur-md group"
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next project"
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>

            {/* Project counter */}
            <motion.div
              className="mt-8 text-center text-white/40 font-mono text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="font-mono text-white/60">{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="mx-2">/</span>
              <span className="font-mono text-white/40">{String(projects.length).padStart(2, "0")}</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </section>

      {/* Project detail modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default ProjectsCarouselSection;
