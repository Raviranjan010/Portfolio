import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Github, Linkedin, ExternalLink, ArrowDownRight } from "lucide-react";
import ResumePanel from "./ResumePanel";
import MagneticButton from "./MagneticButton";
import heroPortrait from "@/assets/ravi_.png";

const firstName = "RAVI";
const lastName = "RANJAN";
const currentRole = "Full-Stack Developer";

const socials = [
  { icon: Github, href: "https://github.com/Raviranjan010", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/raviranjan77/", label: "LinkedIn" },
];

const FadeUpText = ({ text, delay = 0, className = "" }: { text: string; delay?: number, className?: string }) => (
  <motion.div
    initial={{ y: "110%", opacity: 0 }}
    animate={{ y: "0%", opacity: 1 }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {text}
  </motion.div>
);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const smoothY = useSpring(scrollY, { stiffness: 40, damping: 20 });
  const textX = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const smoothTextX = useSpring(textX, { stiffness: 40, damping: 20 });
  const textXReverse = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const smoothTextXReverse = useSpring(textXReverse, { stiffness: 40, damping: 20 });
  
  const contentFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  // Complex Parallax & 3D Tilt calculation
  const imageRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 100, damping: 30 });
  const imageRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 100, damping: 30 });
  const imageX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-40, 40]), { stiffness: 50, damping: 20 });
  const imageY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-40, 40]), { stiffness: 50, damping: 20 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] w-full bg-[#030303] overflow-hidden flex items-center justify-center pt-24 md:pt-0 selection:bg-white selection:text-black"
      onMouseMove={handleMouseMove}
    >
      {/* ── Dynamic Background Noise ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen" 
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }}
      />

      {/* ── Sharp Grid Lines for Brutalist Structural Feel ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "8rem 8rem",
        backgroundPosition: "center center",
      }} />

      {/* ── Background Giant Parallax Typography ── */}
      <motion.div 
        className="absolute inset-0 flex flex-col justify-center pointer-events-none overflow-hidden z-0 opacity-[0.04] select-none mix-blend-plus-lighter"
        style={{ y: smoothY }}
      >
        <motion.div style={{ x: smoothTextX }} className="font-display font-black text-[25vw] leading-[0.8] whitespace-nowrap text-white">
          INNOVATE · BUILD · SCALE ·
        </motion.div>
        <motion.div style={{ x: smoothTextXReverse }} className="font-display font-black text-[25vw] leading-[0.8] whitespace-nowrap text-white outline-text">
          DESIGN · ENGINEER · SHIP ·
        </motion.div>
      </motion.div>

      {/* ── Main Content Container ── */}
      <motion.div 
        style={{ opacity: contentFade }}
        className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[85svh]"
      >
        
        {/* ── Left Column: Typography Block ── */}
        <div className="lg:col-span-7 flex flex-col justify-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 md:mb-10 inline-flex overflow-hidden"
          >
            <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/50 border border-white/10 px-4 py-2 flex items-center bg-black/50 backdrop-blur-sm">
              <span className="animate-pulse mr-3 inline-block w-1.5 h-1.5 bg-white rounded-full"></span>
              {currentRole}
            </span>
          </motion.div>

          <h1 className="font-display font-black text-[clamp(4.5rem,10vw,10.5rem)] leading-[0.85] tracking-[-0.03em] flex flex-col uppercase text-white m-0 p-0">
            <div className="overflow-hidden m-0 p-0">
              <FadeUpText text={firstName} delay={0.2} />
            </div>
            <div className="overflow-hidden flex items-center gap-4 m-0 p-0 mt-2 sm:mt-0">
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                className="h-[clamp(5px,1vw,10px)] w-[clamp(50px,8vw,120px)] bg-white origin-left hidden sm:block"
              />
              <FadeUpText text={lastName} delay={0.4} />
            </div>
          </h1>

          <div className="mt-10 md:mt-14 max-w-xl pl-6 relative">
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="font-body text-base lg:text-lg text-white/60 leading-relaxed font-light"
            >
              Architecting precision-engineered web experiences. Fusing minimalist design aesthetics with robust, scalable full-stack ecosystem architectures.
            </motion.p>
          </div>

          {/* ── Action Row ── */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 md:mt-16 flex items-center gap-4 md:gap-6 flex-wrap"
          >
            {/* @ts-ignore */}
            <MagneticButton 
              as="a" href="#projects"
              onClick={(e: React.MouseEvent) => { e.preventDefault(); document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-8 py-4 border border-white/20 bg-white text-black hover:bg-transparent hover:text-white transition-all duration-500 font-mono text-[11px] uppercase tracking-[0.2em] font-medium group hover:border-white shadow-none"
            >
              <div className="flex items-center gap-3">
                <span className="relative z-10 font-bold">Discover Works</span>
                <ArrowDownRight size={16} className="transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300" />
              </div>
            </MagneticButton>

            <div className="hidden sm:block">
              <ResumePanel />
            </div>

            <div className="flex items-center gap-3">
              {socials.map((s, idx) => (
                /* @ts-ignore */
                <MagneticButton
                  key={idx} as="a" href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-white/10 hover:border-white transition-colors duration-300 text-white group bg-white/5 backdrop-blur-sm"
                >
                  <s.icon size={18} className="group-hover:scale-110 transition-transform duration-300 text-white/70 group-hover:text-white" />
                </MagneticButton>
              ))}
            </div>
            
            <div className="sm:hidden block w-full mt-4">
              <ResumePanel />
            </div>
          </motion.div>
        </div>

        {/* ── Right Column: Interactive Anti-Crop Portrait ── */}
        <div className="lg:col-span-5 h-[50vh] lg:h-[80vh] w-full flex items-center justify-center relative perspective-1000 mt-8 lg:mt-0 z-10">
          <motion.div 
            style={{ 
              rotateX: imageRotateX, 
              rotateY: imageRotateY, 
              x: imageX, 
              y: imageY 
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-[90%] md:w-[80%] h-full flex items-center justify-center transform-style-3d group"
          >
            {/* Absolute positioning wireframes behind the image */}
            <div className="absolute inset-y-[10%] inset-x-0 border border-white/10 group-hover:border-white/30 transition-colors duration-700 pointer-events-none flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-white/30 absolute -top-[3px] -left-[3px]" />
               <div className="w-1.5 h-1.5 bg-white/30 absolute -bottom-[3px] -left-[3px]" />
               <div className="w-1.5 h-1.5 bg-white/30 absolute -top-[3px] -right-[3px]" />
               <div className="w-1.5 h-1.5 bg-white/30 absolute -bottom-[3px] -right-[3px]" />
            </div>
            
            {/* Floating horizontal lines intersecting the frame */}
            <div className="absolute top-[25%] -left-[15%] w-[130%] h-[1px] bg-white/5 group-hover:bg-white/20 transition-colors duration-700 pointer-events-none translate-z-[20px]" />
            <div className="absolute bottom-[25%] -left-[15%] w-[130%] h-[1px] bg-white/5 group-hover:bg-white/20 transition-colors duration-700 pointer-events-none translate-z-[40px]" />

            {/* ── Main Portrait ensuring full image display ── */}
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative w-full h-full z-20 flex justify-center items-center translate-z-[50px] overflow-visible"
            >
              <img 
                src={heroPortrait} 
                alt="Portrait" 
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-all duration-700 ease-out will-change-transform group-hover:scale-[1.02]"
                style={{
                  filter: isHovered ? "grayscale(0) brightness(1.05) contrast(1.05)" : "grayscale(0.6) brightness(0.9) contrast(1.1)",
                }}
              />
            </motion.div>

            {/* Technical Annotations floating on Z-axis */}
            <motion.div 
              className="absolute -right-8 md:-right-12 top-[30%] translate-z-[80px] origin-left hidden md:block"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 90 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className="font-mono text-[9px] tracking-[0.3em] uppercase bg-white text-black px-3 py-1.5 font-bold shadow-[10px_10px_0px_rgba(255,255,255,0.1)]">
                 Coordinates: Validated
              </div>
            </motion.div>

            <motion.div 
              className="absolute -left-6 bottom-[15%] translate-z-[120px] hidden lg:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <div className="glass px-3 py-2 border border-white/10 backdrop-blur-md flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-[8px] tracking-[0.2em] text-white/70 uppercase">System Active</span>
              </div>
            </motion.div>

          </motion.div>
        </div>

      </motion.div>

      {/* ── Scroll Indicator Indicator ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-12 z-50 mix-blend-difference pointer-events-none"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:rotate-[-90deg] md:origin-left">
          <span className="font-mono text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/50">Scroll</span>
          <div className="w-[1px] h-12 md:h-[1px] md:w-16 bg-white/20 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full md:w-auto md:h-full h-1/2 bg-white"
              animate={window.innerWidth > 768 ? { scaleX: [0, 1, 0], x: ["-100%", "0%", "100%"] } : { scaleY: [0, 1, 0], y: ["-100%", "0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;

