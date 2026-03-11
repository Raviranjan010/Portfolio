import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
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
    description: "Real-time trading dashboard processing $2M+ daily volume. Built with React, WebSocket streams, and D3.js visualizations.",
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
    description: "Award-winning agency site with WebGL transitions, 3D product showcases, and an editorial blog engine.",
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
    description: "Carbon footprint tracker serving 50K+ users. ML-powered recommendations with real-time emissions data from IoT sensors.",
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
    description: "Multi-chain wallet security audit platform. Smart contract analysis with automated vulnerability detection.",
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
  github: project.github || project.githubUrl || project.repo || project.repository || DEFAULT_PROFILE_LINK,
  live: project.live || project.liveUrl || project.demo || project.demoUrl || project.url || DEFAULT_PROFILE_LINK,
});

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex h-[500px] w-[340px] md:h-[600px] md:w-[450px] lg:w-[500px] shrink-0 flex-col overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 shadow-2xl transition-all duration-500 hover:border-white/10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      {/* Radial Glow on Hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
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
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Placeholder gradient block if image fails to load */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A] -z-10" />

        {/* Top Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10" />

        {/* Category Tag */}
        <div className="absolute top-6 left-6 z-20 flex gap-2">
          <span
            className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-mono rounded-full font-semibold backdrop-blur-md bg-black/40 border"
            style={{ color: project.color, borderColor: `${project.color}30` }}
          >
            {project.category}
          </span>
        </div>

        {/* Action Links */}
        <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 -translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <a
            href={getLinks(project).github}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all transform hover:scale-110"
            aria-label="GitHub Repository"
          >
            <Github size={18} />
          </a>
          <a
            href={getLinks(project).live}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all transform hover:scale-110"
            aria-label="Live Demo"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col flex-grow p-6 md:p-8 bg-gradient-to-t from-[#050505] to-[#0A0A0A] z-20">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-mono text-white/40">{project.year}</span>
        </div>

        <h3 className="mb-4 text-2xl md:text-3xl font-display font-bold text-white transition-colors duration-300">
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:from-[var(--gold)] group-hover:to-yellow-200">
            {project.title}
          </span>
        </h3>

        <p className="text-sm md:text-base text-white/60 leading-relaxed font-body mb-8 line-clamp-3 md:line-clamp-4">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <span
              key={t}
              className="px-3 py-1.5 text-[10px] font-mono text-white/50 bg-white/5 rounded-md border border-white/5 transition-all duration-300 group-hover:border-white/10 group-hover:text-white/80 group-hover:bg-white/10"
              style={{ transitionDelay: isHovered ? `${i * 50}ms` : '0ms' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const { data: apiProjects = [], isFetching } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    retry: 1,
  });

  const projects = apiProjects.length > 0 ? apiProjects : fallbackProjects;

  // Calculate draggable width limit
  useEffect(() => {
    if (trackRef.current) {
      const updateWidth = () => {
        if (trackRef.current) {
          // scrollWidth is total width of track. We subtract window width to know how far negative we can drag.
          // Subtracting extra padding (e.g. -200) to allow scrolling all the way
          const maxDrag = trackRef.current.scrollWidth - window.innerWidth + 100;
          setTrackWidth(maxDrag > 0 ? maxDrag : 0);
        }
      };

      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, [projects]);

  // Use section scroll to drive the horizontal track's base translation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth the scroll position
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax elements
  const bgY = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);
  const titleY = useTransform(smoothProgress, [0, 0.5], [100, 0]);
  const titleOpacity = useTransform(smoothProgress, [0.1, 0.4], [0, 1]);

  // Base scroll translation: as we scroll down the section, the track shifts left automatically.
  const scrollTranslateX = useTransform(smoothProgress, [0, 1], ["5%", "-25%"]);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative min-h-[150vh] bg-[var(--bg)] overflow-hidden py-32 md:py-48"
    >
      {/* Abstract Parallax Background Elements */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-[var(--gold)]/10 to-transparent blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ y: useTransform(smoothProgress, [0, 1], ["20%", "-20%"]) }}
        className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-l from-white/5 to-transparent blur-[100px] pointer-events-none"
      />

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Header Area */}
      <motion.div
        style={{ opacity: titleOpacity, y: titleY }}
        className="relative z-10 px-6 md:px-16 max-w-7xl mx-auto mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10"
      >
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">
              <Sparkles size={14} />
            </span>
            <p className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--gold)]">
              Featured Works
            </p>
          </div>
          <h2 className="font-display font-black text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-white tracking-tighter">
            SELECTED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-yellow-200">
              PROJECTS
            </span>
          </h2>
        </div>

        <div className="max-w-md md:pb-4">
          <p className="font-body text-base md:text-lg text-white/50 leading-relaxed">
            A curated collection of scalable architectures, interactive experiences, and beautiful interfaces. Crafted with modern web technologies.
            {isFetching && <span className="animate-pulse text-[var(--gold)] ml-2">Loading...</span>}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-[1px] w-12 bg-white/20">
              <div className="h-full bg-[var(--gold)] w-full origin-left animate-pulse" />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
              Scroll + Drag to explore
            </span>
          </div>
        </div>
      </motion.div>

      {/* Horizontally Scrolling Track */}
      {/* Wrapper to hold the scroll driven translation */}
      <motion.div
        style={{ x: scrollTranslateX }}
        className="relative z-20 flex px-6 md:px-16 lg:pl-32"
      >
        {/* Inner container to hold the draggable track */}
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ right: 0, left: -trackWidth }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          className="relative flex gap-6 md:gap-10 lg:gap-16 cursor-grab active:cursor-grabbing pb-12"
        >
          <AnimatePresence>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>

          {/* End spacing/CTA item */}
          <div className="flex shrink-0 w-[200px] md:w-[300px] items-center justify-center">
            <a
              href={DEFAULT_PROFILE_LINK}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-6 justify-center h-48 w-48 rounded-full border border-white/10 text-white/50 hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 hover:text-[var(--gold)] transition-all duration-500"
            >
              <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/5 group-hover:bg-[var(--gold)]/20 transition-colors">
                <ArrowRight size={24} className="relative z-10 transition-transform duration-500 group-hover:translate-x-[150%]" />
                <ArrowRight size={24} className="absolute inset-0 m-auto -translate-x-[150%] transition-transform duration-500 group-hover:translate-x-0" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest">View All</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
