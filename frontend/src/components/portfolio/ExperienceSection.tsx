import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const experiences = [
  {
    year: "2025",
    role: "Web Developer & UI/UX Designer",
    company: "Personal Projects & Portfolio",
    description:
      "Building modern web applications with a focus on clean UI, smooth animations, and interactive user experiences. Developing creative tools, portfolio systems, and web utilities using modern frontend technologies.",
    highlights: ["HTML", "CSS", "JavaScript", "UI/UX Design"],
    side: "left" as const,
  },

  {
    year: "2024",
    role: "Frontend Developer",
    company: "Academic & Personal Projects",
    description:
      "Developed multiple web-based projects including a sticker tag generator, animated timeline interface, and interactive web tools. Focused on responsive design and creative UI animations.",
    highlights: ["Responsive Design", "DOM Manipulation", "Animations", "JavaScript"],
    side: "right" as const,
  },

  {
    year: "2023",
    role: "Computer Science Student",
    company: "Lovely Professional University",
    description:
      "Started exploring web development, programming fundamentals, and data structures while pursuing a Computer Science degree. Built several projects to strengthen development skills and logical thinking.",
    highlights: ["C++", "OOP", "Data Structures", "Problem Solving"],
    side: "left" as const,
  },

  {
    year: "2022",
    role: "Design & Creative Tools Explorer",
    company: "Self Learning",
    description:
      "Explored creative tools like Figma and Canva while learning modern UI/UX principles. Created design assets, social media content, and visual interfaces.",
    highlights: ["Figma", "Canva", "Graphic Design", "Video Editing"],
    side: "right" as const,
  },

  {
    year: "2024",
    role: "AI & Generative Technology Learner",
    company: "Self Learning",
    description:
      "Completed courses on generative AI and image generation while experimenting with prompt engineering and creative AI tools.",
    highlights: ["Generative AI", "Prompt Engineering", "AI Tools"],
    side: "left" as const,
  },
];

const ExperienceCard = ({ exp, index }: { exp: typeof experiences[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "center center"] });

  const isLeft = exp.side === "left";
  const slideX = useSpring(useTransform(scrollYProgress, [0, 1], [isLeft ? -100 : 100, 0]), { stiffness: 60, damping: 20 });
  const cardOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const cardBlur = useTransform(scrollYProgress, [0, 0.4], [12, 0]);
  const cardRotate = useSpring(useTransform(scrollYProgress, [0, 1], [isLeft ? -6 : 6, 0]), { stiffness: 60, damping: 20 });
  const nodeScale = useSpring(useTransform(scrollYProgress, [0.2, 0.6], [0, 1]), { stiffness: 120, damping: 20 });

  return (
    <div ref={cardRef} className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-0 mb-12 md:mb-24 pl-6 md:pl-0">
      <div className={`flex ${isLeft ? "md:justify-end" : "md:justify-end md:order-3"}`}>
        {isLeft ? (
          <motion.div style={{ x: slideX, opacity: cardOpacity, rotate: cardRotate, filter: useTransform(cardBlur, v => `blur(${v}px)`) }}
            className="w-full md:max-w-md">
            <CardContent exp={exp} index={index} />
          </motion.div>
        ) : (
          <motion.div style={{ opacity: cardOpacity }} className="hidden md:flex items-center justify-end w-full pr-8">
            <motion.span className="font-display font-black text-right"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: "transparent", WebkitTextStroke: "1px var(--text)", opacity: 0.08, lineHeight: 1 }}
              whileHover={{ opacity: 0.15 }}>
              {exp.year}
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Center timeline node */}
      <div className="hidden md:flex flex-col items-center relative" style={{ width: "3rem" }}>
        <motion.div className="w-4 h-4 rounded-full z-10 mt-6"
          style={{ background: "var(--gold)", boxShadow: "0 0 20px var(--gold-glow), 0 0 40px var(--gold-dim)", scale: nodeScale }} />
        <motion.div className="w-4 h-4 rounded-full absolute mt-6"
          style={{ background: "var(--gold)", opacity: 0.3, scale: nodeScale }}
          animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
      </div>

      <div className={`flex ${isLeft ? "md:justify-start md:order-3" : "md:justify-start"}`}>
        {isLeft ? (
          <motion.div style={{ opacity: cardOpacity }} className="hidden md:flex items-center w-full pl-8">
            <motion.span className="font-display font-black"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: "transparent", WebkitTextStroke: "1px var(--text)", opacity: 0.08, lineHeight: 1 }}
              whileHover={{ opacity: 0.15 }}>
              {exp.year}
            </motion.span>
          </motion.div>
        ) : (
          <motion.div style={{ x: slideX, opacity: cardOpacity, rotate: cardRotate, filter: useTransform(cardBlur, v => `blur(${v}px)`) }}
            className="w-full md:max-w-md">
            <CardContent exp={exp} index={index} />
          </motion.div>
        )}
      </div>

      <div className="md:hidden absolute -top-2 right-4">
        <span className="font-display text-3xl font-black" style={{ color: "var(--gold)", opacity: 0.3 }}>{exp.year}</span>
      </div>
    </div>
  );
};

const CardContent = ({ exp, index }: { exp: typeof experiences[0]; index: number }) => (
  <motion.div
    className="rounded-2xl p-6 md:p-8 relative overflow-hidden group glass"
    style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
    whileHover={{
      borderColor: "var(--border-accent)", y: -6,
      boxShadow: "0 25px 70px rgba(0,0,0,0.4), 0 0 40px var(--gold-dim)",
    }}
    transition={{ duration: 0.3 }}
  >
    {/* Hover glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: "radial-gradient(circle at 50% 0%, var(--gold-dim), transparent 70%)" }} />

    <div className="flex items-start justify-between mb-4 relative z-10">
      <div>
        <motion.span className="font-display text-xl md:text-2xl font-black block mb-1" style={{ color: "var(--gold)" }}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: 0.1 }}>
          {exp.year}
        </motion.span>
        <h3 className="font-display text-lg md:text-xl font-bold" style={{ color: "var(--text)" }}>{exp.role}</h3>
      </div>
      <motion.span
        className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full mt-1"
        style={{ border: "1px solid var(--border-accent)", color: "var(--gold)" }}
        whileHover={{ background: "var(--gold)", color: "var(--bg)", scale: 1.05 }}
      >
        {exp.company}
      </motion.span>
    </div>

    <p className="font-body text-sm leading-relaxed mb-5 relative z-10" style={{ color: "var(--text-muted-raw)" }}>{exp.description}</p>

    <div className="flex flex-wrap gap-2 relative z-10">
      {exp.highlights.map((h, hi) => (
        <motion.span key={h}
          className="px-3 py-1 rounded-full font-mono text-[10px] md:text-xs"
          style={{ background: "var(--gold-dim)", color: "var(--gold)" }}
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }}
          transition={{ delay: 0.2 + hi * 0.08, duration: 0.3 }}
          whileHover={{ scale: 1.12, background: "var(--gold)", color: "var(--bg)", boxShadow: "0 0 15px var(--gold-glow)" }}
        >
          {h}
        </motion.span>
      ))}
    </div>

    <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-widest" style={{ color: "var(--text-dim)" }}>0{index + 1}</span>
  </motion.div>
);

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const lineScaleY = useSpring(useTransform(scrollYProgress, [0.05, 0.85], [0, 1]), { stiffness: 50, damping: 25 });
  const bgMarqueeX = useSpring(useTransform(scrollYProgress, [0, 1], [100, -200]), { stiffness: 40, damping: 30 });

  return (
    <section ref={sectionRef} id="experience" className="section-spacing relative px-5 md:px-16 overflow-hidden">
      <div className="gradient-hr mb-12 md:mb-16" />

      <motion.div className="absolute top-[12%] left-0 right-0 pointer-events-none select-none hidden md:block" style={{ x: bgMarqueeX }}>
        <span className="font-display font-black whitespace-nowrap"
          style={{ fontSize: "clamp(6rem, 16vw, 14rem)", color: "transparent", WebkitTextStroke: "1px var(--text)", opacity: 0.03, lineHeight: 1 }}>
          EXPERIENCE · CAREER · JOURNEY
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-14 md:mb-20"
      >
        <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold)" }}>WHERE I'VE BEEN</p>
        <h2 className="font-display font-black" style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)", lineHeight: 0.95, color: "var(--text)" }}>
          THE<span style={{ color: "var(--gold)" }}> JOURNEY</span>
        </h2>
      </motion.div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] hidden md:block"
          style={{ background: "linear-gradient(to bottom, var(--border-accent), var(--gold-dim), transparent)", transformOrigin: "top", scaleY: lineScaleY }} />
        <motion.div className="absolute left-2 top-0 bottom-0 w-[1px] md:hidden"
          style={{ background: "linear-gradient(to bottom, var(--border-accent), transparent)", transformOrigin: "top", scaleY: lineScaleY }} />
        {experiences.map((exp, i) => (
          <ExperienceCard key={i} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
