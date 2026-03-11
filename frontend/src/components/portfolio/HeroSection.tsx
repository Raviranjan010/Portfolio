import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import ResumePanel from "./ResumePanel";
import MagneticButton from "./MagneticButton";
import SectionDivider from "./SectionDivider";
import heroPortrait from "@/assets/hero-portrait.jpeg";

const firstName = "RAVI";
const lastName = "RANJAN";
const currentRole = "Full-Stack Developer";

const socials = [
  { icon: Github, href: "https://github.com/Raviranjan010", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/raviranjan77/", label: "LinkedIn" },
];

/* ── Smooth Word reveal for better responsiveness ── */
const FadeUpText = ({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) => {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{
        duration: 0.9,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

/* ── Main Hero - Modern Redesign ── */
const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Soft Parallax
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const smoothContentY = useSpring(contentY, { stiffness: 60, damping: 20 });

  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const smoothPortraitY = useSpring(portraitY, { stiffness: 60, damping: 20 });
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Smooth fade out instead of blur
  const fadeOutOnScroll = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);
  const scaleDownOnScroll = useTransform(scrollYProgress, [0, 0.8], [1, 0.96]);

  // Background huge marquee parallax
  const marqueeX = useTransform(scrollYProgress, [0, 1], [0, -400]);

  // Mouse parallax for the right side capsule
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const portraitRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 80, damping: 30 });
  const portraitRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 80, damping: 30 });
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 80, damping: 30 });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 80, damping: 30 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden w-full pt-16 md:pt-0"
      style={{ background: "var(--bg)" }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Background Elements & Noise ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Abstract Sweep Gradient */}
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] opacity-20"
          style={{
            background: "radial-gradient(circle at 40% 50%, var(--gold-dim) 0%, transparent 60%)",
          }}
        />

        {/* Giant Abstract Text in Background */}
        <motion.div
          className="absolute z-0 font-display font-black text-[clamp(12rem,12vw,14rem)] whitespace-nowrap opacity-[0.03] select-none text-[var(--text)] tracking-tighter"
          style={{ x: marqueeX, top: "50%", translateY: "-50%" }}
        >
          DEVELOPER ARCHITECT
        </motion.div>
      </div>

      {/* ── Main content wrapper ── */}
      <motion.div
        className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20"
        style={{
          opacity: fadeOutOnScroll,
          scale: scaleDownOnScroll
        }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 h-full">

          {/* ── Left Column: Typography & CTAs ── */}
          <motion.div style={{ y: smoothContentY }} className="w-full lg:w-[55%] flex flex-col relative z-20 z-10">

            {/* Minimal Status Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-4 mb-6 md:mb-8"
            >
              <div className="h-px w-8 lg:w-12 bg-gradient-to-r from-[var(--gold)] to-transparent opacity-80" />
              <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--gold)]">
                Available for execution
              </span>
            </motion.div>

            {/* Huge Cinematic Name (Responsive Wrap) */}
            <div className="mb-8 md:mb-10 font-display font-black leading-[0.9] text-[clamp(4rem,10vw,8.5rem)] text-[var(--text)] tracking-[-0.02em] uppercase flex flex-col items-start w-full">
              <div className="overflow-hidden pb-2 w-full">
                <FadeUpText text={firstName} delay={0.4} />
              </div>
              <div className="overflow-hidden pb-2 flex items-center gap-4 md:gap-6 w-full flex-wrap sm:flex-nowrap">
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "clamp(40px, 8vw, 80px)", opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="h-[clamp(4px,1vw,8px)] bg-[var(--gold)] hidden sm:block mt-1 sm:mt-0"
                />
                <FadeUpText text={lastName} delay={0.5} />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-[var(--gold)] mb-5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[var(--gold)] inline-block animate-pulse opacity-80" />
                {currentRole}
              </h2>
              <div className="border-l-[1.5px] border-[var(--border-accent)] pl-6 py-1">
                <p className="font-body text-sm md:text-base lg:text-lg leading-relaxed max-w-lg text-[var(--text-muted-raw)]">
                  I architect and engineer modern, high-performance web applications. Focused on converting complex problems into elegant, scaleable digital experiences.
                </p>
              </div>
            </motion.div>

            {/* CTAs and Socials Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6"
            >
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <MagneticButton
                  as="a" href="#projects"
                  onClick={(e: React.MouseEvent) => { e.preventDefault(); document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="group px-7 md:px-9 py-4 font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase relative overflow-hidden bg-[var(--gold)] text-[var(--bg)] shadow-[0_0_20px_var(--gold-dim)] transition-all hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] flex-1 justify-center sm:flex-none text-center"
                  style={{ borderRadius: "2px" }}
                  strength={0.2}
                >
                  <span className="relative z-10 flex items-centerjustify-center gap-2 font-bold w-full h-full">
                    Explore Work
                    <ExternalLink size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </MagneticButton>

                <div className="flex items-center justify-center gap-3 flex-1 sm:flex-none">
                  {socials.map((s) => (
                    <MagneticButton
                      key={s.label} as="a" href={s.href} target="_blank" rel="noopener noreferrer"
                      className="w-[50px] h-[50px] md:w-14 md:h-14 flex items-center justify-center rounded-sm transition-all duration-300 group ring-1 ring-[var(--border-raw)] bg-[var(--bg-glass)] hover:bg-[var(--gold-dim)] hover:ring-[var(--border-accent)]"
                      strength={0.3}
                    >
                      <s.icon size={18} className="text-[var(--text-muted-raw)] transition-colors duration-300 group-hover:text-[var(--gold)]" />
                    </MagneticButton>
                  ))}
                </div>
              </div>

              <div className="sm:ml-4 flex-1 sm:flex-none w-full sm:w-auto">
                <ResumePanel />
              </div>
            </motion.div>

          </motion.div>

          {/* ── Right Column: Architectural Image Capsule ── */}
          <motion.div
            style={{ y: smoothPortraitY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[45%] relative flex justify-center lg:justify-end perspective-1000 mt-6 lg:mt-0 z-10"
          >
            {/* The Glassmorphism Architectural Frame */}
            <motion.div
              className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-[3/4] rounded-sm transform-style-3d group"
              style={{
                rotateX: portraitRotateX,
                rotateY: portraitRotateY,
                scale: portraitScale
              }}
            >
              {/* Frame shadow/ambience layer */}
              <div className="absolute -inset-4 md:-inset-6 bg-[var(--gold-glow)] opacity-10 md:opacity-20 blur-2xl md:blur-3xl rounded-full -z-10 group-hover:opacity-40 transition-opacity duration-1000" />

              {/* Actual Photo Container */}
              <div className="absolute inset-0 rounded-sm overflow-hidden bg-[#0A0A0A] border border-[var(--border-raw)] ring-1 ring-white/5 shadow-2xl">
                <img
                  src={heroPortrait}
                  alt="Ravi Ranjan"
                  className="w-full h-full object-cover object-center translate-z-0 scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] will-change-transform"
                />

                {/* Internal Fine Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-80 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-dim)] to-transparent opacity-20 pointer-events-none mix-blend-overlay" />

                {/* Dynamic glare effect tracking mouse */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
                  style={{
                    background: "radial-gradient(circle 300px at var(--x) var(--y), rgba(255,255,255,0.8), transparent 80%)",
                    "--x": glareX,
                    "--y": glareY
                  } as any}
                />
              </div>

              {/* Geometric Accents attached to the frame */}
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[var(--gold)] opacity-70 translate-z-20 transition-all duration-500 group-hover:top-[-16px] group-hover:left-[-16px]" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[var(--gold)] opacity-70 translate-z-20 transition-all duration-500 group-hover:bottom-[-16px] group-hover:right-[-16px]" />

              {/* Floating Info Tag attached to Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-6 -left-4 md:-left-10 glass px-5 md:px-6 py-3.5 md:py-4 rounded-sm flex flex-col gap-1 translate-z-30 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-[var(--border-accent)] backdrop-blur-xl"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--gold)]">Location</span>
                <span className="font-display font-medium text-sm md:text-base text-white tracking-wide">India / Remote</span>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Background scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none"
      >
        <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
          <span className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-[var(--text-dim)]">
            Scroll
          </span>
          <div className="w-[1px] h-10 md:h-14 bg-gradient-to-b from-[var(--border-raw)] to-transparent overflow-hidden relative">
            <motion.div
              className="absolute top-0 w-full h-[40%] bg-[var(--gold)] shadow-[0_0_10px_var(--gold)]"
              animate={{ y: ["-100%", "300%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
