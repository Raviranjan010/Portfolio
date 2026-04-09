import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  year: string;
  github: string;
  live: string;
};

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "AI Resume Screener & Builder",
    category: "Artificial Intelligence",
    description: "Developed an AI-powered platform to analyze resumes, improve ATS compatibility, and recommend job roles. Built resume parsing system supporting PDF, DOCX, TXT. Implemented ATS scoring using NLP (TF-IDF + similarity models). Integrated Google Gemini for intelligent suggestions. Designed chatbot & form-based resume builder with export (PDF/DOCX). Developed recruiter dashboard for ranking candidates.",
    tech: ["Python", "Flask", "NLP", "Gemini API", "JavaScript"],
    image: "/project_ai_resume.png",
    year: "2024",
    github: "https://github.com/Raviranjan010",
    live: "https://github.com/Raviranjan010",
  },
  {
    id: 2,
    title: "AI Stock Price Prediction System",
    category: "Deep Learning",
    description: "Built a hybrid deep learning system for predicting stock movements using multiple advanced techniques. Designed GAN architecture (LSTM + CNN) for time-series prediction. Integrated sentiment analysis using BERT and financial indicators. Engineered 100+ features including ARIMA, Fourier transforms. Applied reinforcement learning for hyperparameter optimization. Combined statistical + deep learning models for improved accuracy.",
    tech: ["Python", "MXNet", "GAN", "LSTM", "CNN", "NLP"],
    image: "/project_stock.png",
    year: "2024",
    github: "https://github.com/Raviranjan010",
    live: "https://github.com/Raviranjan010",
  },
  {
    id: 3,
    title: "GoCart – Multi-Vendor Platform",
    category: "E-Commerce",
    description: "Developed a scalable e-commerce platform with multi-vendor support and role-based dashboards. Built vendor, admin, and customer dashboards. Implemented state management using Redux Toolkit. Designed responsive UI using Tailwind CSS. Structured app using Next.js.",
    tech: ["Next.js", "Tailwind CSS", "Redux Toolkit"],
    image: "/project_ecommerce.png",
    year: "2023",
    github: "https://github.com/Raviranjan010",
    live: "https://github.com/Raviranjan010",
  },
  {
    id: 4,
    title: "Web-Based Code Editor (WASM)",
    category: "Developer Tools",
    description: "Created a browser-based IDE with support for WebAssembly and low-level programming tools. Integrated Monaco Editor for advanced editing. Enabled WASM compilation and optimization. Added C/C++ formatting and x86 disassembly tools. Designed dynamic split-pane UI for better workflow.",
    tech: ["React", "TypeScript", "WebAssembly"],
    image: "/project_wasm.png",
    year: "2023",
    github: "https://github.com/Raviranjan010",
    live: "https://github.com/Raviranjan010",
  },
  {
    id: 5,
    title: "AWS Serverless Application",
    category: "Cloud Architecture",
    description: "Built a serverless backend system using AWS SAM and CloudFormation. Implemented Lambda-based services with Node.js. Used Infrastructure as Code for scalable deployment. Configured IAM roles and automated workflows. Enabled local testing using SAM CLI.",
    tech: ["AWS SAM", "Lambda", "CloudFormation"],
    image: "/project_aws.png",
    year: "2023",
    github: "https://github.com/Raviranjan010",
    live: "https://github.com/Raviranjan010",
  },
  {
    id: 6,
    title: "YouTube Thumbnail Downloader",
    category: "Utility Application",
    description: "Developed a fast and privacy-focused tool for downloading YouTube thumbnails. Supports multiple formats and resolutions (HD, HQ, WebP). Works with all YouTube URL formats (including Shorts). Fully client-side processing (no backend). Designed modern UI with smooth animations.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "/project_yt.png",
    year: "2022",
    github: "https://github.com/Raviranjan010",
    live: "https://github.com/Raviranjan010",
  }
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="w-[85vw] md:w-[65vw] lg:w-[48vw] shrink-0 flex flex-col group touch-pan-x select-none">
      {/* Image Box */}
      <div className="w-full h-[45vh] md:h-[55vh] relative overflow-hidden bg-[#0A0A0A] mb-8 border border-white/5 group-hover:border-white/20 transition-colors duration-700">
        <div className="w-full h-full relative">
          <img 
            src={project.image} 
            alt={project.title} 
            draggable={false}
            className="w-full h-full object-cover filter grayscale-[100%] opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] scale-105 group-hover:scale-100"
          />
        </div>
        
        {/* Minimalist Overlay Details */}
        <div className="absolute top-0 left-0 p-6 flex justify-between w-full z-10 pointer-events-none">
          <span className="font-mono text-xs uppercase tracking-[0.2em] bg-black/80 backdrop-blur-md px-4 py-2 text-white/50 group-hover:text-white transition-colors duration-500 border border-white/10">
            {project.year}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] bg-white text-black px-4 py-2 font-bold shadow-lg opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content Box */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 px-2">
        <div className="flex-1">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white/80 group-hover:text-white transition-colors duration-500 uppercase font-display leading-tight">
            {project.title}
          </h3>
          <p className="text-neutral-500 group-hover:text-neutral-400 font-medium text-sm md:text-base leading-relaxed md:line-clamp-4 max-w-xl transition-colors duration-500">
            {project.description}
          </p>
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col items-start md:items-end gap-5">
          <div className="flex gap-6 relative z-20">
            <a 
              href={project.live} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] pb-1 border-b border-neutral-800 hover:border-white transition-all text-neutral-500 hover:text-white cursor-pointer"
            >
              Live Site <ArrowUpRight size={14} />
            </a>
            <a 
              href={project.github} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] pb-1 border-b border-neutral-800 hover:border-white transition-all text-neutral-500 hover:text-white cursor-pointer"
            >
              Source <Github size={14} />
            </a>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 justify-start md:justify-end">
            {project.tech.map((t, i) => (
              <span 
                key={i} 
                className="text-[10px] font-mono tracking-widest uppercase border border-neutral-800 px-3 py-1.5 text-neutral-600 group-hover:border-neutral-600 group-hover:text-neutral-400 transition-colors duration-500 bg-black"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const x = useMotionValue(0);
  const smoothX = useSpring(x, { damping: 50, stiffness: 400, mass: 0.8 });

  useEffect(() => {
    const measure = () => {
      if (containerRef.current && dragRef.current) {
        const cw = Math.max(0, dragRef.current.scrollWidth - containerRef.current.offsetWidth);
        setCarouselWidth(cw);
      }
    };
    measure();
    // delay measure to ensure images load
    const timeout = setTimeout(measure, 500);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Custom Cursor state
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section 
      id="projects" 
      className="relative min-h-[120vh] bg-[#030303] text-white py-32 flex flex-col justify-center"
    >
      {/* Brutalist Grid Background - High tech, very subtle, no glow */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
         <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
      
      {/* Custom Drag Cursor Overlay */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference hidden md:flex items-center justify-center transition-transform duration-75"
            style={{ 
               translateX: cursorPos.x - 40,
               translateY: cursorPos.y - 40,
               width: 80, 
               height: 80 
            }}
          >
            <div className="w-full h-full rounded-full border border-white flex flex-col items-center justify-center bg-transparent backdrop-blur-sm">
               <span className="text-[10px] font-mono tracking-[0.3em] uppercase ml-1">Drag</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 mb-20 relative z-10 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-2 h-2 bg-white/40 block rounded-full"></span>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-white/50">
                Showcase Archive
              </p>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mix-blend-difference leading-[0.9]">
              Featured <br/> <span className="text-neutral-500 italic font-serif lowercase tracking-normal">projects</span>
            </h2>
          </div>
          
          <div className="max-w-md pb-4">
             <p className="text-neutral-500 font-medium text-sm md:text-base leading-relaxed border-l border-white/10 pl-6">
               An editorial showcase of production-ready systems, AI integration, and robust full-stack applications. Crafted completely without compromise.
             </p>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden cur md:cursor-none pb-12 pt-8"
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => {
          setIsHovering(false);
        }}
        onPointerCancel={() => setIsHovering(false)}
      >
        <motion.div
           ref={dragRef}
           drag="x"
           dragConstraints={{ left: -carouselWidth, right: 0 }}
           dragElastic={0.05}
           className="flex gap-12 md:gap-24 px-6 md:px-12 absolute z-20 cursor-grab active:cursor-grabbing md:cursor-none"
           style={{ x: smoothX }}
        >
           {defaultProjects.map((project) => (
             <ProjectCard key={project.id} project={project} />
           ))}
        </motion.div>
        
        {/* Invisible spacer to maintain layout height while drag items are absolute */}
        <div className="opacity-0 pointer-events-none flex gap-12 md:gap-24 px-6 md:px-12">
           {defaultProjects.map((project) => (
             <ProjectCard key={`spacer-${project.id}`} project={project} />
           ))}
        </div>
      </div>
      
      {/* Scroll indicator for mobile */}
      <div className="w-full flex justify-center mt-10 md:hidden z-10 relative">
         <div className="text-[10px] font-mono tracking-widest uppercase text-white/30 flex items-center gap-2">
            <span>Swipe to explore</span>
            <ArrowUpRight size={12} className="rotate-45" />
         </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
