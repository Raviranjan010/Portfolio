import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
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

  // Track active section
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

  // Update indicator position
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

    // Brief delay to let the transition overlay appear before scrolling
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
            className="fixed inset-0 z-[9990] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{ duration: 0.7, times: [0, 0.35, 0.65, 1], ease: [0.76, 0, 0.24, 1] }}
              style={{ background: "var(--bg)", transformOrigin: "top" }}
            />
            {/* Gold accent line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px]"
              style={{ background: "var(--gold)", top: "50%", boxShadow: "0 0 20px var(--gold-glow)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 0.7, times: [0, 0.5, 1], ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[102] origin-left"
        style={{
          scaleX,
          background: "var(--gold)",
          boxShadow: "0 0 8px var(--gold-glow)",
        }}
      />

      <motion.nav
        ref={navRef}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 flex items-center justify-between transition-all duration-500"
        style={{
          height: scrolled ? 56 : 68,
          background: scrolled ? "var(--nav-scrolled-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.5)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.5)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-raw)" : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display text-lg font-bold tracking-wider relative"
          style={{ color: "var(--gold)" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          RR<span style={{ opacity: 0.5 }}>.</span>
        </motion.a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5 relative">
          {/* Sliding indicator */}
          {(hovered !== null || activeSection) && (
            <motion.div
              className="absolute bottom-0 h-[2px] rounded-full"
              style={{ background: "var(--gold)" }}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}

          {navItems.map((item, i) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <button
                key={item.label}
                ref={(el) => { itemRefs.current[i] = el; }}
                onClick={() => handleClick(item.href)}
                onMouseEnter={() => {
                  setHovered(i);
                  updateIndicator(i);
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  updateIndicator(null);
                }}
                className="relative font-body text-[11px] tracking-[0.15em] uppercase px-4 py-4 transition-colors duration-200"
                style={{
                  color: isActive
                    ? "var(--gold)"
                    : hovered === i
                    ? "var(--text)"
                    : "var(--text-muted-raw)",
                }}
              >
                {item.label}
              </button>
            );
          })}

          <div className="w-px h-4 mx-2" style={{ background: "var(--border-raw)" }} />
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col items-end justify-center gap-[5px] w-8 h-8 z-[110]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={{
              rotate: menuOpen ? 45 : 0,
              y: menuOpen ? 6.5 : 0,
              width: menuOpen ? 20 : 20,
            }}
            className="block h-[1.5px] rounded-full origin-center"
            style={{ background: menuOpen ? "var(--gold)" : "var(--text)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1, width: menuOpen ? 0 : 14 }}
            className="block h-[1.5px] rounded-full"
            style={{ background: "var(--gold)" }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={{
              rotate: menuOpen ? -45 : 0,
              y: menuOpen ? -6.5 : 0,
              width: menuOpen ? 20 : 16,
            }}
            className="block h-[1.5px] rounded-full origin-center"
            style={{ background: "var(--text)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </button>

        {/* Mobile fullscreen menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[105] flex flex-col justify-center"
              style={{ background: "var(--bg)" }}
            >
              {/* Background accent */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-1/3 right-0 w-72 h-72 rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle, var(--gold-glow), transparent 70%)", filter: "blur(40px)" }}
                />
              </div>

              <div className="px-8 py-20">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="font-mono text-[10px] tracking-[0.3em] uppercase mb-10"
                  style={{ color: "var(--text-dim)" }}
                >
                  Navigation
                </motion.p>

                <div className="flex flex-col gap-2">
                  {navItems.map((item, i) => {
                    const isActive = activeSection === item.href.replace("#", "");
                    return (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{
                          delay: 0.08 + i * 0.05,
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        onClick={() => handleClick(item.href)}
                        className="flex items-center gap-5 py-3 group text-left"
                      >
                        <span className="font-mono text-[10px] w-5" style={{ color: "var(--gold)", opacity: 0.4 }}>
                          0{i + 1}
                        </span>
                        <span
                          className="font-display text-3xl font-bold tracking-wide transition-all duration-300 group-hover:translate-x-2"
                          style={{ color: isActive ? "var(--gold)" : "var(--text)" }}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="mobile-active"
                            className="w-2 h-2 rounded-full ml-auto"
                            style={{ background: "var(--gold)" }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-16 flex items-center justify-between"
                >
                  <ThemeToggle />
                  <span className="font-mono text-[10px] tracking-widest" style={{ color: "var(--text-dim)" }}>
                    © 2026
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
