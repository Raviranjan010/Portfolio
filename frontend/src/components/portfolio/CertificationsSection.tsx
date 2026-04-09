import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ScrollReveal from "./ScrollReveal";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const previewImports = import.meta.glob("@/assets/certificates/previews/*.{jpg,png,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const CERTS = Object.keys(previewImports).map((path) => {
  const url = previewImports[path];
  const filename = path.split("/").pop() || "";
  const lower = filename.toLowerCase();

  let title = "Certificate of Achievement";
  let org = "Technology Certification";
  let year = "2024";

  if (lower.includes("advance python for ml and ai")) { title = "Advance Python for ML and AI"; org = "Google Cloud Ready"; }
  else if (lower.includes("advance python for ml and ds")) { title = "Advance Python for ML and DS"; org = "Training Certificate"; }
  else if (lower.includes("cloud computing")) { title = "Cloud Computing"; org = "NPTEL"; year = "2025"; }
  else if (lower.includes("coursera")) { title = "Communication in 21st Century Workplace"; org = "Coursera"; year = "2026"; }
  else if (lower.includes("datascience tableu and excel")) { title = "Data Science, Tableau and Excel"; org = "Skill Up"; }
  else if (lower.includes("digital sticker")) { title = "Unleashing the Power of AI Agents"; org = "AI Seminar"; }
  else if (lower.includes("hack2skill")) { title = "Hack2Skill Hackathon"; org = "Hack2Skill / Google"; }
  else if (lower.includes("ibm ai")) { title = "IBM AI Practitioner"; org = "IBM"; }
  else if (lower.includes("io9dz")) { title = "Data Analytics Job Simulation"; org = "Forage"; year = "2025"; }
  else if (lower.includes("java")) { title = "Java Skill Up"; org = "Skill Builder"; }
  else if (lower.includes("kke9h")) { title = "Solutions Architecture Simulation"; org = "Forage"; year = "2025"; }
  else if (lower.includes("national building")) { title = "National Building Program"; org = "Government Initiative"; }
  else if (lower.includes("nestle")) { title = "Nestle Global Challenge"; org = "Nestle"; }
  else if (lower.includes("react js")) { title = "React JS Certification"; org = "GeeksforGeeks"; }
  else if (lower.includes("sebi")) { title = "NISM Security Operations"; org = "SEBI"; year = "2025"; }
  else if (lower.includes("weekly compition") || lower.includes("weekly competition")) { title = "Unstop Weekly Competition"; org = "Unstop"; }
  else if (lower.includes("unstop")) { title = "Unstop Tech Participation"; org = "Unstop"; }

  return { image: url, title, org, year };
});

const N = CERTS.length;
const SLOT_ANGLE = (Math.PI * 2) / N;

function getActiveIndex(angle: number): number {
  const norm = ((-angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return Math.round((norm / (Math.PI * 2)) * N) % N;
}

const CertificatesSection = () => {
  const isMobile = useIsMobile();
  const [angle, setAngle] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const targetAngle = useRef(0);
  const currentAngle = useRef(0);
  const vel = useRef(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);
  const autoSpin = useRef(true);
  const rafId = useRef<number>(0);
  const lastTime = useRef(0);

  const stopAuto = useCallback((ms = 3500) => {
    autoSpin.current = false;
    setTimeout(() => { autoSpin.current = true; }, ms);
  }, []);

  const snapTo = useCallback((idx: number) => {
    const snapAngle = -(idx / N) * Math.PI * 2;
    const diff = snapAngle - (targetAngle.current % (Math.PI * 2));
    let normDiff = diff % (Math.PI * 2);
    if (normDiff > Math.PI) normDiff -= Math.PI * 2;
    if (normDiff < -Math.PI) normDiff += Math.PI * 2;
    
    targetAngle.current += normDiff;
    vel.current = 0;
    stopAuto();
  }, [stopAuto]);

  const goNext = useCallback(() => {
    targetAngle.current -= SLOT_ANGLE;
    vel.current = 0;
    stopAuto();
  }, [stopAuto]);

  const goPrev = useCallback(() => {
    targetAngle.current += SLOT_ANGLE;
    vel.current = 0;
    stopAuto();
  }, [stopAuto]);

  useEffect(() => {
    lastTime.current = performance.now();
    const tick = (ts: number) => {
      const dt = Math.min((ts - lastTime.current) / 16.67, 3);
      lastTime.current = ts;

      if (!dragging.current) {
        if (autoSpin.current) targetAngle.current -= 0.003 * dt;
        currentAngle.current += (targetAngle.current - currentAngle.current) * 0.08 * dt;
      } else {
        currentAngle.current += (targetAngle.current - currentAngle.current) * 0.25 * dt;
      }

      setAngle(currentAngle.current);

      const newActive = getActiveIndex(currentAngle.current);
      setActiveIdx((prev) => (prev !== newActive ? newActive : prev));

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    autoSpin.current = false;
    startX.current = e.clientX;
    startAngle.current = targetAngle.current;
    vel.current = 0;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    const newAngle = startAngle.current - dx * 0.008;
    vel.current = newAngle - targetAngle.current;
    targetAngle.current = newAngle;
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    targetAngle.current += vel.current * 12; // Add momentum
    stopAuto(4000);
  };

  useEffect(() => {
    if (previewImage) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [previewImage]);

  const activeCert = CERTS[activeIdx] ?? CERTS[0];

  // Visual layout constants
  const cardW = isMobile ? 240 : 380;
  const cardH = isMobile ? 165 : 260;
  const VISUAL_RADIUS = isMobile ? 500 : 900;
  const OFFSET_MULTIPLIER = isMobile ? 0.45 : 0.35; 

  return (
    <section id="certificates" className="section-shell">
      <div className="section-grid relative z-10">
        <ScrollReveal>
          <p className="text-sm tracking-[0.25em] uppercase text-primary font-semibold">Certificates</p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Credentials <span className="text-primary italic font-light">&</span> Certifications
          </h2>
        </ScrollReveal>

        <div className="mt-14 space-y-8">
          {/* Carousel */}
          <ScrollReveal delay={0.15}>
            <div
              className="relative mx-auto rounded-[2.5rem] border border-white/5 bg-gradient-to-tr from-black/80 to-neutral-900/40 ring-1 ring-white/10 overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]"
              style={{ height: isMobile ? "320px" : "440px" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {/* 3D scene */}
              <div
                className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
                style={{ perspective: isMobile ? "800px" : "1200px" }}
              >
                <div
                  className="absolute"
                  style={{
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {CERTS.map((cert, i) => {
                    const continuousIndex = -angle / SLOT_ANGLE;
                    let offset = (i - continuousIndex) % N;
                    if (offset > N / 2) offset -= N;
                    if (offset < -N / 2) offset += N;

                    const absOffset = Math.abs(offset);
                    const theta = offset * OFFSET_MULTIPLIER;
                    
                    const x = Math.sin(theta) * VISUAL_RADIUS;
                    const z = Math.cos(theta) * VISUAL_RADIUS - VISUAL_RADIUS;
                    const rotY = -theta * (180 / Math.PI);

                    const isActive = absOffset < 0.3;
                    const opacity = Math.max(0, 1 - Math.max(0, absOffset - 1.2) * 0.4);

                    const boxShadow = isActive
                      ? "0 0 0 2px #a78bfa, 0 20px 45px rgba(167,139,250,0.25)"
                      : "0 15px 35px rgba(0,0,0,0.6)";

                    return (
                      <div
                        key={cert.title + i}
                        onClick={() => {
                          if (isActive) setPreviewImage(cert.image);
                          else snapTo(i);
                        }}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          width: cardW,
                          height: cardH,
                          transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg)`,
                          opacity,
                          zIndex: Math.round((10 - absOffset) * 10),
                          borderRadius: "12px",
                          overflow: "hidden",
                          cursor: isActive ? "zoom-in" : "pointer",
                          transition: "box-shadow 0.3s ease, outline 0.3s ease",
                          boxShadow,
                          outline: "1px solid rgba(255,255,255,0.1)",
                          backfaceVisibility: "hidden",
                          pointerEvents: opacity < 0.1 ? "none" : "auto",
                        }}
                      >
                        <img
                          src={cert.image}
                          alt={cert.title}
                          draggable={false}
                          className="w-full h-full object-cover block pointer-events-none"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 sm:p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-xs sm:text-sm font-medium">
                              Click to preview
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Edge fades */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-black via-black/60 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-black via-black/60 to-transparent" />
            </div>
          </ScrollReveal>

          {/* Dot indicators + nav */}
          <ScrollReveal delay={0.18}>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={goPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 hover:scale-105"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-[200px] sm:max-w-md">
                {CERTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => snapTo(i)}
                    aria-label={`Go to certificate ${i + 1}`}
                    className="transition-all duration-300"
                    style={{
                      width: i === activeIdx ? 24 : 6,
                      height: 6,
                      borderRadius: 999,
                      background: i === activeIdx ? "#a78bfa" : "rgba(255,255,255,0.2)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 hover:scale-105"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </ScrollReveal>

          {/* Info panel */}
          <ScrollReveal delay={0.22}>
            <div className="glass-panel group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-6 sm:p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    Now centered
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-bold text-foreground leading-tight truncate">
                    {activeCert.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    {activeCert.org} · {activeCert.year}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewImage(activeCert.image)}
                  className="group/btn inline-flex shrink-0 items-center gap-2 self-start sm:self-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                >
                  <Maximize2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                  Preview Certificate
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Full-screen preview modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
             initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
             animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
             exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
             onClick={() => setPreviewImage(null)}
             className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-8"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
              className="absolute right-6 top-6 z-[110] rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </motion.button>

            <motion.div
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               onClick={(e) => e.stopPropagation()}
               className="relative overflow-hidden rounded-xl border border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
            >
              <img
                src={previewImage}
                alt="Detailed Certificate Preview"
                className="max-h-[85vh] max-w-[90vw] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesSection;
