import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const testimonials = [
  {
    name: "Sumit Raj Verma",
    role: "Cloud Engineer",
    quote: "Ravi doesn't just write code — he architects experiences. His work on our trading platform redefined what we thought was possible in the browser.",
    avatar: "SRV",
  },
  {
    name: "Mukund Khandelwal",
    role: "Data Scientist",
    quote: "Every project Ravi touched became the one clients referenced in future briefs. He has a rare ability to bridge engineering and design thinking.",
    avatar: "MK",
  },
  {
    name: "Supriya",
    role: "Software Engineer",
    quote: "In six months, Ravi took our dashboard from a functional tool to a product people genuinely loved using. Our retention metrics speak for themselves.",
    avatar: "SP",
  },
];

const TestimonialCard = ({ t, index }: { t: typeof testimonials[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, filter: "blur(12px)", scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{
          rotateX: hovered ? (mousePos.y - 0.5) * -8 : 0,
          rotateY: hovered ? (mousePos.x - 0.5) * 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="rounded-2xl p-8 md:p-10 relative overflow-hidden glass"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: hovered
            ? "0 30px 80px rgba(0,0,0,0.4), 0 0 50px var(--gold-dim)"
            : "0 10px 30px rgba(0,0,0,0.15)",
          transition: "box-shadow 0.5s",
        }}
      >
        {/* Mouse-tracking glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hovered ? 0.8 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, var(--gold-dim), transparent 50%)`,
          }}
        />

        {/* Quote mark with hover animation */}
        <motion.span
          className="font-display block mb-4 leading-none select-none"
          style={{ fontSize: "clamp(4rem, 8vw, 7rem)", color: "var(--gold)", opacity: 0.12 }}
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? -10 : 0, opacity: hovered ? 0.2 : 0.12 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          „
        </motion.span>

        <p className="font-body text-base md:text-lg leading-[1.8] mb-8 relative z-10" style={{ color: "var(--text)" }}>
          {t.quote}
        </p>

        {/* Stars */}
        <div className="flex gap-1.5 mb-5 relative z-10">
          {[...Array(5)].map((_, j) => (
            <motion.svg
              key={j} width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.15 + j * 0.06, type: "spring", stiffness: 400, damping: 15 }}
              whileHover={{ scale: 1.5, rotate: 72, filter: "drop-shadow(0 0 6px var(--gold-glow))" }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </motion.svg>
          ))}
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center font-display text-sm font-bold"
            style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid var(--border-accent)" }}
            whileHover={{ scale: 1.25, rotate: 15, boxShadow: "0 0 25px var(--gold-glow)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {t.avatar}
          </motion.div>
          <div>
            <p className="font-display font-bold text-sm md:text-base" style={{ color: "var(--text)" }}>{t.name}</p>
            <p className="font-mono text-[10px] md:text-xs tracking-wider" style={{ color: "var(--gold)" }}>{t.role}</p>
          </div>
        </div>

        <span className="absolute top-5 right-6 font-mono text-[10px] tracking-widest" style={{ color: "var(--text-dim)" }}>0{index + 1}</span>
      </motion.div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgMarqueeX = useSpring(useTransform(scrollYProgress, [0, 1], [100, -250]), { stiffness: 40, damping: 30 });
  const lineScale = useSpring(useTransform(scrollYProgress, [0.1, 0.8], [0, 1]), { stiffness: 60, damping: 25 });
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={sectionRef} id="testimonials" className="section-spacing relative px-5 md:px-16 overflow-hidden">
      {/* Cloud background */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: cloudY }}>
        <div className="absolute rounded-full" style={{
          width: "40vw", height: "40vw", top: "5%", left: "-10%",
          background: "radial-gradient(ellipse, var(--gold-dim), transparent 65%)",
          filter: "blur(80px)", animation: "aurora-shift 20s ease-in-out infinite",
        }} />
      </motion.div>

      <div className="gradient-hr mb-12 md:mb-16" />

      {/* Background scrolling text */}
      <motion.div className="absolute top-[10%] left-0 right-0 pointer-events-none select-none hidden md:block" style={{ x: bgMarqueeX }}>
        <span className="font-display font-black whitespace-nowrap"
          style={{ fontSize: "clamp(6rem, 16vw, 14rem)", color: "transparent", WebkitTextStroke: "1px var(--text)", opacity: 0.03, lineHeight: 1 }}>
          TESTIMONIALS · KIND WORDS
        </span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -60, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-12 md:mb-16"
      >
        <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold)" }}>
          WHAT THEY SAY
        </p>
        <h2 className="font-display font-black" style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)", lineHeight: 0.95, color: "var(--text)" }}>
          KIND<span style={{ color: "var(--gold)" }}> WORDS</span>
        </h2>
      </motion.div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto relative">
        <motion.div className="absolute left-8 top-0 bottom-0 w-[1px] hidden lg:block"
          style={{
            background: "linear-gradient(to bottom, var(--border-accent), var(--gold-dim), transparent)",
            transformOrigin: "top", scaleY: lineScale,
          }} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-7 lg:col-start-1">
            <TestimonialCard t={testimonials[0]} index={0} />
          </div>
          <div className="lg:col-span-5 lg:mt-16">
            <TestimonialCard t={testimonials[1]} index={1} />
          </div>
          <div className="lg:col-span-7 lg:col-start-4">
            <TestimonialCard t={testimonials[2]} index={2} />
          </div>
        </div>
      </div>

      <motion.div className="mt-16 md:mt-20 h-[1px] w-full"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border-accent), transparent)",
          scaleX: useSpring(useTransform(scrollYProgress, [0.6, 0.95], [0, 1]), { stiffness: 80, damping: 25 }),
          transformOrigin: "center",
        }} />
    </section>
  );
};

export default TestimonialsSection;
