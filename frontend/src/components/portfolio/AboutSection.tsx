import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

const profileJson = `{
  "name": "Ravi Ranjan Kashyap",
  "role": "Web Developer & UI/UX Enthusiast",
  "education": "Lovely Professional University",
  "location": "Punjab, India",
  "languages": ["JavaScript", "HTML", "CSS"],
  "tools": ["Figma", "Canva", "Git"],
  "interests": ["UI/UX Design", "Artificial Intelligence", "Web Innovation"],
  "passions": ["modern web interfaces", "creative development", "interactive design"],
  "projects_built": "20+",
  "always_learning": true
}`;

const stats = [
  { value: "02", label: "Years", icon: "◆" },
  { value: "20+", label: "Projects", icon: "▲" },
  { value: "Multiple", label: "Technologies", icon: "●" },
  { value: "Growing", label: "Portfolio", icon: "■" },
];

const philosophyItems = [
  { title: "Clean Code", desc: "Simple, structured, and scalable code focused on performance and clarity." },
  { title: "Modern UI/UX", desc: "Visually polished interfaces with smooth animations and intuitive layouts." },
  { title: "User-Focused Design", desc: "Technology should feel effortless for users — experience comes first." },
];

/* ── Scroll-triggered reveal wrapper ── */
const ScrollReveal = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }) => {
  const offsets = { up: { y: 60 }, left: { x: -60 }, right: { x: 60 } };
  const offset = offsets[direction];
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", ...offset }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, x: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const [typedText, setTypedText] = useState("");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax layers
  const bgTextX = useSpring(useTransform(scrollYProgress, [0, 1], [100, -200]), { stiffness: 40, damping: 30 });
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const termParallax = useSpring(useTransform(scrollYProgress, [0.1, 0.5], [60, 0]), { stiffness: 60, damping: 20 });
  const termOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const philosophyScale = useTransform(scrollYProgress, [0.3, 0.6], [0.95, 1]);

  useEffect(() => {
    if (!isInView) { setTypedText(""); return; }
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= profileJson.length) { setTypedText(profileJson.slice(0, idx)); idx++; }
      else clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={sectionRef} id="about" className="section-spacing relative px-5 md:px-16 overflow-hidden">
      {/* Cloud motion background */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: cloudY }}>
        <div className="absolute rounded-full" style={{
          width: "50vw", height: "50vw", top: "-10%", right: "-15%",
          background: "radial-gradient(ellipse, var(--gold-dim), transparent 65%)",
          filter: "blur(80px)", animation: "breathe 8s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          width: "30vw", height: "30vw", bottom: "10%", left: "-10%",
          background: "radial-gradient(ellipse, var(--gold-dim), transparent 70%)",
          filter: "blur(60px)", opacity: 0.4, animation: "cloud-drift-b 15s ease-in-out infinite",
        }} />
      </motion.div>

      {/* Background scrolling text */}
      <motion.div className="absolute top-[12%] left-0 right-0 pointer-events-none select-none hidden md:block" style={{ x: bgTextX }}>
        <span className="font-display font-black whitespace-nowrap"
          style={{ fontSize: "clamp(6rem, 16vw, 14rem)", color: "transparent", WebkitTextStroke: "1px var(--text)", opacity: 0.03, lineHeight: 1 }}>
          ABOUT · THE CRAFT · WHO I AM
        </span>
      </motion.div>

      <div className="gradient-hr mb-12 md:mb-16" />

      {/* Header */}
      <ScrollReveal>
        <div className="relative z-10 mb-10 md:mb-14">
          <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold)" }}>
            WHO I AM
          </p>
          <h2 className="font-display font-black" style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)", lineHeight: 0.95, color: "var(--text)" }}>
            ABOUT<span style={{ color: "var(--gold)" }}> THE CRAFT</span>
          </h2>
        </div>
      </ScrollReveal>

      <div className="gradient-hr mb-10 md:mb-16" />

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Text column */}
        <div className="lg:w-[55%]">
          <ScrollReveal delay={0.1}>
            <p className="font-body text-base md:text-lg leading-relaxed mb-6" style={{ color: "var(--text-muted-raw)" }}>
              I design and build modern digital experiences where clean engineering meets polished UI/UX design. My focus is creating products that are not only functional but also visually engaging, intuitive, and performance-driven.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="font-body text-base md:text-lg leading-relaxed mb-6" style={{ color: "var(--text-muted-raw)" }}>
              As a Computer Science student at Lovely Professional University, I constantly experiment with new technologies, refine my development workflow, and push my projects beyond basic functionality — turning them into interactive and professional-grade web experiences.
            </p>
            <p className="font-body text-base md:text-lg leading-relaxed mb-10" style={{ color: "var(--text-muted-raw)" }}>
              From building interactive web tools and portfolio systems to experimenting with AI-powered solutions and modern frontend animations, every project I create is crafted with attention to detail and user experience.
            </p>
          </ScrollReveal>

          {/* Stats with parallax stagger */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 font-mono text-sm tracking-wider mb-12">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.08} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="flex items-center gap-3 group">
                  <motion.span className="text-[10px]" style={{ color: "var(--gold)" }}
                    whileHover={{ rotate: 360, scale: 1.5 }} transition={{ type: "spring", stiffness: 200 }}>
                    {s.icon}
                  </motion.span>
                  <motion.span className="font-display text-xl md:text-2xl font-bold" style={{ color: "var(--gold)" }}
                    whileHover={{ scale: 1.15, textShadow: "0 0 20px var(--gold-glow)" }}>
                    {s.value}
                  </motion.span>
                  <span className="uppercase text-xs" style={{ color: "var(--text-muted-raw)" }}>{s.label}</span>
                  {i < stats.length - 1 && <span className="ml-2" style={{ color: "var(--text-dim)" }}>·</span>}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Philosophy cards with hover glow */}
          <motion.div style={{ scale: philosophyScale }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {philosophyItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: false }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px var(--gold-dim)",
                  borderColor: "var(--border-accent)",
                }}
                className="rounded-xl p-5 group cursor-default glass"
                style={{ transition: "border-color 0.4s, box-shadow 0.4s" }}
              >
                <motion.div whileHover={{ rotateY: 8 }} transition={{ type: "spring", stiffness: 200 }}
                  style={{ transformStyle: "preserve-3d", perspective: "600px" }}>
                  <span className="font-display text-sm font-bold block mb-2" style={{ color: "var(--gold)" }}>{item.title}</span>
                  <span className="font-body text-xs leading-relaxed" style={{ color: "var(--text-muted-raw)" }}>{item.desc}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Terminal with parallax */}
        <motion.div style={{ y: termParallax, opacity: termOpacity }} className="lg:w-[45%]">
          <motion.div
            className="rounded-xl overflow-hidden glass"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            whileHover={{ boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 50px var(--gold-dim)", borderColor: "var(--border-accent)" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border-raw)" }}>
              <motion.div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} whileHover={{ scale: 1.4 }} />
              <motion.div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} whileHover={{ scale: 1.4 }} />
              <motion.div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} whileHover={{ scale: 1.4 }} />
              <span className="ml-3 font-mono text-xs" style={{ color: "var(--text-muted-raw)" }}>profile.json</span>
            </div>
            <pre className="p-4 md:p-5 font-mono text-xs md:text-sm leading-relaxed overflow-hidden" style={{ color: "var(--gold)", minHeight: 240 }}>
              {typedText}
              <span className="inline-block w-2 h-4 ml-0.5 align-middle" style={{ background: "var(--gold)", animation: "blink-caret 1s step-end infinite" }} />
            </pre>
          </motion.div>

          {/* Orbit decoration */}
          <motion.div className="relative mt-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative w-32 h-32">
              <motion.div className="absolute inset-0 rounded-full"
                style={{ border: "1px dashed var(--border-accent)", opacity: 0.4 }}
                animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
              <motion.div className="absolute w-3 h-3 rounded-full"
                style={{ background: "var(--gold)", boxShadow: "0 0 15px var(--gold-glow), 0 0 30px var(--gold-dim)", top: -6, left: "50%", marginLeft: -6 }}
                animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
              <motion.div className="absolute rounded-full"
                style={{ border: "1px solid var(--border-raw)", opacity: 0.3, top: "25%", left: "25%", width: "50%", height: "50%" }}
                animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[9px] tracking-widest uppercase text-center" style={{ color: "var(--text-dim)" }}>
                  ALWAYS<br />LEARNING
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div className="mt-12 text-center"
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <p className="font-body text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "var(--text-muted-raw)" }}>
              Technology evolves fast — and so do I. Every project is an opportunity to experiment, improve, and build something better than the last.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
