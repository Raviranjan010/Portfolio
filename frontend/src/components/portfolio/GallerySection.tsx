import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

type GalleryItem = {
  title: string;
  description: string;
  image: string;
  tag: string;
  year: string;
};

const images: GalleryItem[] = [
  {
    title: "Zenith Dashboard",
    description: "Real-time trading interface with live data streams and dynamic chart visualizations.",
    image: gallery1,
    tag: "FINTECH",
    year: "2025",
  },
  {
    title: "Nomad Brand System",
    description: "Complete visual identity and design language for a global creative studio.",
    image: gallery2,
    tag: "BRANDING",
    year: "2024",
  },
  {
    title: "EcoTrack Mobile",
    description: "Carbon tracking app with ML-powered insights and beautiful data presentation.",
    image: gallery3,
    tag: "CLIMATE",
    year: "2024",
  },
  {
    title: "Vaultkey Interface",
    description: "Multi-chain wallet security dashboard with real-time audit visualization.",
    image: gallery4,
    tag: "WEB3",
    year: "2023",
  },
];

const GalleryCard = ({ item, index }: { item: GalleryItem; index: number }) => {
  return (
    <motion.div
      className="group relative flex h-[60vh] md:h-[70vh] w-[85vw] md:w-[60vw] max-w-4xl shrink-0 flex-col overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl mr-8 md:mr-16"
      style={{
        background: "rgba(9,11,16,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Image with Hover Scale */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="h-full w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-12">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[rgba(232,197,71,0.3)] bg-[rgba(232,197,71,0.1)] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#E8C547] backdrop-blur-md">
              {item.tag}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
              {item.year}
            </span>
          </div>
          <div className="font-display text-4xl font-black text-white/10 md:text-6xl">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        <h3 className="mb-3 max-w-2xl font-display text-3xl font-bold text-white md:text-5xl lg:text-6xl text-balance leading-tight">
          {item.title}
        </h3>
        <p className="max-w-xl font-body text-sm leading-relaxed text-white/70 md:text-base">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};

const GallerySection = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map scroll progress to horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <section ref={targetRef} id="gallery" className="relative h-[300vh] bg-[#050505]">
      {/* Sticky Container */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Header / Intro */}
        <div className="absolute left-6 top-24 z-20 w-[min(24rem,calc(100%-2rem))] md:left-12 md:top-32 lg:w-[28rem]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#E8C547] md:text-xs">
              Curated Selection
            </p>
            <h2 className="font-display text-5xl font-black leading-none text-white md:text-6xl lg:text-7xl">
              VISUAL <br />
              <span className="text-[#E8C547]">ARCHIVE</span>
            </h2>
            <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-white/60 md:text-base">
              A chronological journey through my most impactful design and development work, showcasing modern interfaces and robust systems.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Scrolling Gallery */}
        <motion.div style={{ x, position: "relative" }} className="flex">
          {/* Spacer to push first item past the header area on desktop */}
          <div className="w-[10vw] shrink-0 md:w-[35vw]" />

          {images.map((item, index) => (
            <GalleryCard key={item.title} item={item} index={index} />
          ))}

          {/* Spacer at the end */}
          <div className="w-[10vw] shrink-0" />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-6 flex items-center gap-4 z-20 md:left-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="h-[1px] w-12 bg-white/20">
            <motion.div
              className="h-full bg-[#E8C547] w-full origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
