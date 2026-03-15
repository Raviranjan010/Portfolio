import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Track active section logic (Unchanged)
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      let current = "";
      for (const item of navItems) {
        const el = document.querySelector(item.href);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) current = item.href.replace("#", "");
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const updateIndicator = useCallback((index: number | null) => {
    const targetIndex = index ?? navItems.findIndex((item) => item.href.replace("#", "") === activeSection);
    const el = itemRefs.current[targetIndex];
    if (el) {
      const navEl = navRef.current;
      if (!navEl) return;
      const navRect = navEl.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updateIndicator(null);
  }, [activeSection, updateIndicator]);

  const [transitioning, setTransitioning] = useState(false);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    setTransitioning(true);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 250);
    setTimeout(() => setTransitioning(false), 700);
  };

  return (
    <>
      {/* Page transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-[9990] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, times: [0, 0.4, 0.6, 1], ease: [0.83, 0, 0.17, 1] }}
              style={{ background: "var(--bg)", transformOrigin: "bottom" }}
            />
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: [0, 1, 0], y: 0 }}
               transition={{ duration: 0.8 }}
               className="z-10 font-display text-4xl font-light italic tracking-widest text-[var(--gold)]"
            >
              Loading Experience
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar with Glow */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[102] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, transparent, var(--gold), var(--gold-glow))",
          boxShadow: "0 0 15px var(--gold-glow)",
        }}
      />

      <motion.nav
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 flex items-center justify-between transition-all duration-700 ease-in-out"
        style={{
          height: scrolled ? 64 : 90,
          background: scrolled ? "rgba(var(--bg-rgb), 0.7)" : "transparent",
          backdropFilter: scrolled ? "blur(12px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(var(--gold-rgb), 0.1)" : "1px solid transparent",
        }}
      >
        {/* Animated Logo */}
        <motion.a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="group flex items-center gap-2 font-display text-2xl font-black tracking-tighter"
          whileHover={{ scale: 1.02 }}
        >
          <span style={{ color: "var(--text)" }}>R</span>
          <span className="relative" style={{ color: "var(--gold)" }}>
            R
            <motion.span 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -right-3 bottom-1 w-1.5 h-1.5 rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold-glow)]" 
            />
          </span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 relative">
          <div className="flex items-center bg-[var(--nav-pill-bg)] rounded-full px-2 py-1 border border-[rgba(255,255,255,0.05)]">
            {navItems.map((item, i) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.label}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  onClick={() => handleClick(item.href)}
                  onMouseEnter={() => { setHovered(i); updateIndicator(i); }}
                  onMouseLeave={() => { setHovered(null); updateIndicator(null); }}
                  className="relative font-mono text-[10px] tracking-[0.2em] uppercase px-5 py-3 transition-all duration-300"
                  style={{
                    color: isActive ? "var(--gold)" : "var(--text-muted-raw)",
                  }}
                >
                  <motion.span animate={{ letterSpacing: hovered === i ? "0.3em" : "0.2em" }}>
                    {item.label}
                  </motion.span>
                </button>
              );
            })}
            
            {/* Sliding Indicator with Liquid Effect */}
            <motion.div
              className="absolute bottom-2 h-[2px] rounded-full"
              style={{ background: "var(--gold)", boxShadow: "0 0 10px var(--gold-glow)" }}
              animate={{
                left: indicatorStyle.left + 20, // offset for padding
                width: indicatorStyle.width - 40,
                opacity: (hovered !== null || activeSection) ? 1 : 0
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          </div>

          <div className="h-6 w-[1px] bg-white/10 mx-4" />
          <ThemeToggle />
        </div>

        {/* Fancy Mobile Toggle */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-[var(--gold)]/5 border border-[var(--gold)]/10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="flex flex-col gap-1.5 items-end">
            <motion.span animate={{ width: menuOpen ? 24 : 18, rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} className="h-[1.5px] bg-[var(--gold)] rounded-full origin-center transition-all" />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1, width: 24 }} className="h-[1.5px] bg-[var(--text)] rounded-full" />
            <motion.span animate={{ width: menuOpen ? 24 : 12, rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} className="h-[1.5px] bg-[var(--gold)] rounded-full origin-center transition-all" />
          </div>
        </button>

        {/* Mobile Fullscreen Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[105] bg-[var(--bg)] flex flex-col"
            >
              {/* Decorative background grid */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: `radial-gradient(var(--gold) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

              <div className="mt-32 px-10 flex flex-col gap-8">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    onClick={() => handleClick(item.href)}
                    className="group relative flex flex-col items-start"
                  >
                    <span className="font-mono text-[10px] text-[var(--gold)] mb-1 opacity-50">0{i + 1}.</span>
                    <span className="font-display text-5xl font-bold tracking-tighter text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">
                      {item.label}
                    </span>
                    {activeSection === item.href.replace("#", "") && (
                       <motion.div layoutId="mobile-dot" className="absolute -left-6 top-1/2 w-2 h-2 rounded-full bg-[var(--gold)]" />
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.8 }}
                className="mt-auto p-10 flex items-center justify-between border-t border-white/5 bg-white/[0.02]"
              >
                <ThemeToggle />
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-dim)]">Current Status</p>
                  <p className="text-[11px] text-[var(--gold)] font-medium">Available for Projects</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
