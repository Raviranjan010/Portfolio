import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

type Certification = {
  title: string;
  issuer: string;
  year: string;
  summary: string;
  url?: string;
  color: string;
};

const CertificationsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleY = useSpring(useTransform(scrollYProgress, [0.05, 0.35], [60, 0]), {
    stiffness: 70,
    damping: 22,
  });
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  const certifications = useMemo<Certification[]>(
    () => [
      {
        title: "Frontend Web Development",
        issuer: "Online Certification",
        year: "2024",
        summary: "Mastered modern frontend frameworks, responsive design principles, and Web accessibility logic.",
        color: "#60A5FA",
      },
      {
        title: "Generative AI Concepts",
        issuer: "Specialized Training",
        year: "2024",
        summary: "Explored AI toolsets, advanced prompt engineering constructs, and multimodal LLM integration flows.",
        color: "#F59E0B",
      },
      {
        title: "UI/UX Visual Design",
        issuer: "Self-Paced Learning",
        year: "2023",
        summary: "Adopted core principles of aesthetic layout structuring, user psychology metrics, and rigorous color theory.",
        color: "#F472B6",
      },
    ],
    []
  );

  const Card = ({ item, index }: { item: Certification; index: number }) => {
    const [flipped, setFlipped] = useState(false);

    return (
      <motion.div
        className="perspective-[1000px] w-full h-full"
      >
        <motion.div
          onClick={() => setFlipped(!flipped)}
          className="relative w-full h-full cursor-pointer transform-style-3d min-h-[220px] md:min-h-[260px]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden z-10 p-6 md:p-7 rounded-3xl border glass-gold flex flex-col justify-between"
               style={{ background: "rgba(255,255,255,0.02)", boxShadow: `inset 0 0 40px ${item.color}05` }}>
            {/* Corner chrome */}
            <div
              className="pointer-events-none absolute top-4 left-4 w-10 h-10 opacity-30"
              style={{
                borderTop: `1px solid ${item.color}55`,
                borderLeft: `1px solid ${item.color}55`,
                borderRadius: 16,
              }}
            />
            {/* Glow underlay */}
            <motion.div
              aria-hidden
              className="absolute -inset-2 rounded-3xl blur-2xl opacity-0"
              style={{ background: item.color }}
              whileHover={{ opacity: 0.15 }}
              transition={{ duration: 0.35 }}
            />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex-1 mt-6">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--gold)" }}>
                  {item.issuer}
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold mt-3 leading-tight" style={{ color: "var(--text)" }}>
                  {item.title}
                </h3>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div
                  className="shrink-0 font-mono text-[10px] uppercase tracking-widest px-3 py-2 rounded-full border"
                  style={{ borderColor: `${item.color}55`, color: item.color, background: "rgba(255,255,255,0.04)" }}
                >
                  {item.year}
                </div>
                <p className="font-mono text-[9px] uppercase tracking-wider opacity-60" style={{ color: "var(--text-dim)" }}>
                  Tap to flip →
                </p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden z-20 p-6 md:p-7 rounded-3xl border flex flex-col items-center justify-center text-center" 
            style={{ 
              transform: "rotateY(180deg)", 
              background: `linear-gradient(135deg, ${item.color}15, rgba(0,0,0,0.85))`,
              borderColor: `${item.color}40`,
              boxShadow: `0 10px 40px ${item.color}10`
            }}
          >
            <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: "var(--text-muted-raw)" }}>
              {item.summary}
            </p>
            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 font-mono text-[10px] tracking-widest uppercase border-b pb-1 transition-colors hover:text-white"
                style={{ color: item.color, borderColor: `${item.color}50` }}
                onClick={(e) => e.stopPropagation()}
              >
                Verify Credential
              </a>
            )}
            {!item.url && (
              <span className="mt-6 font-mono text-[9px] tracking-[0.2em] uppercase opacity-50" style={{ color: item.color }}>
                Verified Core Skill
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section ref={sectionRef} id="certifications" className="section-spacing relative px-5 md:px-16 overflow-hidden">
      <div className="gradient-hr mb-12 md:mb-16" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div style={{ y: titleY }} className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold)" }}>
            Certifications
          </p>
          <h2 className="font-display font-black" style={{ fontSize: "clamp(2.5rem, 6vw, 6.5rem)", lineHeight: 0.95 }}>
            PROOF OF <span style={{ color: "var(--gold)" }}>WORK</span>
          </h2>
          <p
            className="font-body text-sm md:text-base leading-relaxed mt-4 max-w-2xl"
            style={{ color: "var(--text-muted-raw)" }}
          >
            Credentials that back my build approach: clean engineering, accessible UI, and real-world product thinking.
          </p>
        </motion.div>

        <motion.div style={{ opacity: cardsOpacity }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 justify-center max-w-5xl mx-auto">
          {certifications.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="h-full"
            >
              <Card item={item} index={index} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 md:mt-24 flex items-center justify-center">
          <div className="glass p-5 md:p-7 rounded-3xl max-w-3xl w-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--gold)" }}>
                  Want verification?
                </p>
                <p className="font-body text-sm md:text-base mt-3 max-w-lg mx-auto md:mx-0" style={{ color: "var(--text-muted-raw)" }}>
                  If you want full evidence (links, certificates, or portfolio notes), send a message from the contact form and I'll share details.
                </p>
              </div>
              <div
                aria-hidden
                className="w-20 h-20 rounded-full glass-gold flex items-center justify-center shrink-0"
                style={{
                  boxShadow: "0 0 60px rgba(232,197,71,0.12)",
                }}
              >
                <span className="font-display font-black text-2xl" style={{ color: "var(--gold)", transform: "translateY(-1px)" }}>
                  ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;

