import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const phases = [
  {
    phase: "01",
    title: "Foundation Phase",
    tags: ["Exploration", "Core Web", "Design Basics"],
    bullets: [
      "Built multiple responsive interfaces using HTML, CSS, JavaScript",
      "Developed strong fundamentals in layout systems, responsiveness, and clean UI structuring",
      "Started designing with Canva and exploring visual storytelling",
      "Learned the importance of user flow, readability, and simplicity",
    ],
    focus: "Understanding how users interact with digital interfaces"
  },
  {
    phase: "02",
    title: "Interactive Development",
    tags: ["UI/UX", "Animations", "User Engagement"],
    bullets: [
      "Created Interactive To-Do List with drag & drop functionality",
      "Animated BMI Calculator with visual metric graphs",
      "Implemented smooth transitions, hover-based interactions, and dynamic UI behavior",
      "Focused on making projects feel alive, not static",
    ],
    focus: "Turning static UI into engaging experiences"
  },
  {
    phase: "03",
    title: "Creative Engineering",
    tags: ["Unique Concepts", "Visual Experiments"],
    bullets: [
      "Smoke Effect Interface Project with interactive canvas",
      "Sticker Tag Interactive UI highlighting micro-interactions",
      "India Map using character-based design and SVG manipulation",
      "Enhanced projects with custom animations, effects, and unique patterns"
    ],
    focus: "Creating standout, non-generic digital experiences"
  },
  {
    phase: "04",
    title: "System & Real-World Thinking",
    tags: ["Logic", "Scalability", "Practical Applications"],
    bullets: [
      "Developed structured Ticketing System with search and availability logic",
      "Worked heavily with data handling, logic building, and real-world problem solving",
      "Practiced writing clean, structured, modular, and scalable code"
    ],
    focus: "Moving from UI strictly to functional systems"
  },
  {
    phase: "05",
    title: "Advanced Projects & Tools",
    tags: ["Modern Tech", "AI", "Cloud Awareness"],
    bullets: [
      "Built an AWS SAM-based project for serverless architecture understanding",
      "Engineered an UNO Game combining complex rules logic and UI",
      "Gained exposure to cloud-based workflows and generative AI concepts",
      "Focused on combining frontend presentation with system thinking"
    ],
    focus: "Building future-ready, tech-integrated solutions"
  },
  {
    phase: "06",
    title: "Design-Driven Portfolio",
    tags: ["Premium UI", "Personal Branding", "Product Thinking"],
    bullets: [
      "Designed a high-end portfolio system with advanced framer animations",
      "Wove section-based storytelling with smooth navigation and interactions",
      "Focused heavily on clean, non-generic layouts and professional presentation",
      "Established a powerful visual hierarchy and typography scaling"
    ],
    focus: "Presenting work like a product, not just random projects"
  },
  {
    phase: "07",
    title: "Content & Digital Growth",
    tags: ["YouTube", "Strategy", "Audience Understanding"],
    bullets: [
      "Built a YouTube presence with 200K+ audience engagement experience",
      "Mastered content positioning, audience psychology, and growth strategies",
      "Restarted entirely with a new focus on intersectional tech and finance content",
      "Experimented with different visual media delivery formats"
    ],
    focus: "Building systems beyond code — audience & business"
  }
];

const PhaseCard = ({ phase, total }: { phase: typeof phases[0], total: number }) => {
  return (
    <div className="group relative flex h-[75vh] w-[88vw] md:w-[75vw] lg:w-[60vw] max-w-5xl shrink-0 flex-col overflow-hidden bg-[#070707] border border-white/10 rounded-xl mr-6 md:mr-12 px-6 py-8 md:p-14 lg:p-16">
      
      {/* Background Graphic (Typographic) */}
      <div className="absolute right-0 bottom-[-5%] font-display text-[14rem] md:text-[24rem] lg:text-[32rem] font-black leading-none text-white/[0.02] pointer-events-none select-none tracking-tighter">
        {phase.phase}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Header Area */}
        <div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 md:mb-12">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {phase.tags.map(tag => (
                  <span key={tag} className="border border-white/10 px-3 py-1.5 font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#E8C547]">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] text-balance max-w-2xl uppercase">
                {phase.title}
              </h3>
            </div>
            <div className="hidden md:block font-mono text-xs text-white/30 tracking-widest uppercase mt-2 whitespace-nowrap">
              Phase {phase.phase} / 0{total}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-auto grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-10 md:gap-16 items-end">
          <ul className="space-y-4 md:space-y-5">
            {phase.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="font-mono text-[#E8C547] text-[10px] mt-1.5 uppercase shrink-0 font-bold">
                  {String.fromCharCode(97 + i)}.
                </span>
                <span className="text-white/70 font-body text-sm md:text-[15px] leading-relaxed max-w-md">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col justify-end h-full">
            <div className="bg-[#111] p-6 lg:p-8 border-l-2 border-[#E8C547] min-h-[140px] flex flex-col justify-center relative overflow-hidden group-hover:bg-[#151515] transition-colors duration-500">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3 relative z-10">
                Core Objective
              </span>
              <p className="font-body text-white font-medium text-base md:text-lg leading-relaxed text-balance relative z-10">
                "{phase.focus}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GallerySection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    const updateRange = () => {
      if (scrollRef.current) {
        setScrollRange(scrollRef.current.scrollWidth - window.innerWidth);
      }
    };
    updateRange();
    
    // Slight delay to ensure fonts/layout are rendered
    setTimeout(updateRange, 100); 

    window.addEventListener("resize", updateRange);
    return () => window.removeEventListener("resize", updateRange);
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, scrollRange > 0 ? -scrollRange : 0]);

  return (
    <section ref={targetRef} id="archive" className="relative h-[500vh] bg-[#030303]">
      {/* Sticky Container */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Header / Intro */}
        <div className="absolute left-6 top-20 z-20 w-[min(24rem,calc(100%-2rem))] md:left-12 md:top-28 lg:w-[28rem] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/50 border-l border-[#E8C547] pl-3">
              Chronology
            </p>
            <h2 className="font-display text-5xl font-black leading-none text-white md:text-6xl lg:text-7xl">
              EVOLUTION <br />
              <span className="text-[#E8C547]">ARCHIVE</span>
            </h2>
            <p className="mt-6 max-w-xs md:max-w-sm font-body text-sm leading-relaxed text-white/60 md:text-base bg-[#030303]/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 -ml-4 md:p-0 md:m-0 rounded-lg md:rounded-none">
              A comprehensive timeline detailing the evolution of my technical skills, design philosophy, and systematic thinking through 7 distinct phases.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Scrolling Area */}
        <motion.div ref={scrollRef} style={{ x }} className="flex h-full items-center">
          {/* Spacer to push first item past the header area on desktop */}
          <div className="w-[10vw] shrink-0 md:w-[35vw]" />

          {phases.map((phase) => (
            <PhaseCard key={phase.phase} phase={phase} total={phases.length} />
          ))}

          {/* Spacer at the end */}
          <div className="w-[10vw] shrink-0 md:w-[15vw]" />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-6 flex items-center gap-4 z-20 md:left-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="h-[1px] w-16 bg-white/10">
            <motion.div
              className="h-full bg-[#E8C547] w-full origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#E8C547]">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
