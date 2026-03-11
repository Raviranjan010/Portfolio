import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";

const socials = [
  { label: "GitHub",    href: "https://github.com/Raviranjan010",            icon: "GH" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/raviranjan77/",   icon: "LI" },
  { label: "Instagram", href: "https://instagram.com",                        icon: "IG" },
  { label: "YouTube",   href: "https://youtube.com",                          icon: "YT" },
  { label: "Twitter",   href: "https://twitter.com",                          icon: "TW" },
  { label: "Dribbble",  href: "https://dribbble.com",                         icon: "DR" },
];

const navSections = [
  {
    title: "Navigation",
    links: [
      { label: "Home",     href: "#home" },
      { label: "About",    href: "#about" },
      { label: "Work",     href: "#work" },
      { label: "Skills",   href: "#skills" },
      { label: "Contact",  href: "#contact" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "All Projects",  href: "#projects" },
      { label: "Open Source",   href: "#open-source" },
      { label: "Case Studies",  href: "#case-studies" },
      { label: "Archive",       href: "#archive" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Hire Me",         href: "#contact" },
      { label: "Resume / CV",     href: "#resume" },
      { label: "Blog",            href: "#blog" },
      { label: "Newsletter",      href: "#newsletter" },
    ],
  },
];

/* ── Scroll progress ring ─────────────────────────────────────────── */
const ScrollProgressRing = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPercent(Math.round(v * 100));
  });

  return (
    <motion.div
      className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 w-11 h-11 md:w-14 md:h-14 flex items-center justify-center cursor-pointer"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: "spring" }}
    >
      <svg width="44" height="44" viewBox="0 0 56 56" className="absolute md:w-14 md:h-14">
        <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border-raw)" strokeWidth="1" />
        <motion.circle
          cx="28" cy="28" r="24" fill="none" stroke="var(--gold)" strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength, rotate: -90, transformOrigin: "center" }}
        />
      </svg>
      <span className="font-mono text-[10px]" style={{ color: "var(--gold)" }}>{percent}%</span>
    </motion.div>
  );
};

/* ── Animated status dot ─────────────────────────────────────────── */
const AvailabilityBadge = () => (
  <motion.div
    className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
    style={{ borderColor: "var(--border-raw)", background: "rgba(255,255,255,0.02)" }}
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false }}
    transition={{ delay: 0.1 }}
  >
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: "#4ade80" }}
      />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#4ade80" }} />
    </span>
    <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#4ade80" }}>
      Available for work
    </span>
  </motion.div>
);

/* ── Ticker / marquee strip ──────────────────────────────────────── */
const TickerStrip = () => {
  const items = [
    "Full-Stack Developer",
    "·",
    "UI / UX Enthusiast",
    "·",
    "Open Source Contributor",
    "·",
    "Creative Technologist",
    "·",
    "Always Learning",
    "·",
  ];
  const repeated = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden py-3 border-y"
      style={{ borderColor: "var(--border-raw)", background: "rgba(255,255,255,0.015)" }}
    >
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs tracking-widest uppercase shrink-0"
            style={{ color: item === "·" ? "var(--gold)" : "var(--text-dim)" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ── Social icon pill ────────────────────────────────────────────── */
const SocialPill = ({
  s,
  i,
  hoveredSocial,
  setHoveredSocial,
}: {
  s: typeof socials[0];
  i: number;
  hoveredSocial: number | null;
  setHoveredSocial: (v: number | null) => void;
}) => {
  const isHovered = hoveredSocial === i;

  return (
    <MagneticButton
      as="a"
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group flex items-center gap-2 px-4 py-2 rounded-full border font-body text-xs tracking-widest uppercase overflow-hidden transition-colors duration-300"
      style={{
        borderColor: isHovered ? "var(--gold)" : "var(--border-raw)",
        color: isHovered ? "var(--gold)" : "var(--text-muted-raw)",
        background: isHovered ? "rgba(var(--gold-rgb, 212,175,55), 0.06)" : "transparent",
        transition: "border-color 0.3s, color 0.3s, background 0.3s",
      }}
      strength={0.45}
      onMouseEnter={() => setHoveredSocial(i)}
      onMouseLeave={() => setHoveredSocial(null)}
    >
      {/* Shimmer sweep */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={isHovered ? { backgroundPosition: ["200% 0", "-200% 0"] } : {}}
        transition={{ duration: 0.6 }}
      />
      <span
        className="font-mono text-[10px] font-bold"
        style={{ color: isHovered ? "var(--gold)" : "var(--text-dim)" }}
      >
        {s.icon}
      </span>
      {s.label}
    </MagneticButton>
  );
};

/* ── Nav column ──────────────────────────────────────────────────── */
const NavColumn = ({
  section,
  delay,
}: {
  section: typeof navSections[0];
  delay: number;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay, duration: 0.5 }}
    >
      <p
        className="font-mono text-[10px] tracking-[0.2em] uppercase mb-5"
        style={{ color: "var(--gold)" }}
      >
        {section.title}
      </p>
      <ul className="flex flex-col gap-3">
        {section.links.map((link, i) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="relative font-body text-sm inline-flex items-center gap-2 transition-colors duration-200"
              style={{ color: hovered === i ? "var(--text)" : "var(--text-muted-raw)" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.span
                className="inline-block h-px"
                style={{ background: "var(--gold)" }}
                animate={{ width: hovered === i ? 16 : 0 }}
                transition={{ duration: 0.25 }}
              />
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

/* ── Main footer ─────────────────────────────────────────────────── */
const FooterSection = () => {
  const nameRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [nameHovered, setNameHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  /* Live clock */
  useEffect(() => {
    const tick = () =>
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const nameScale = useTransform(scrollYProgress, [0.3, 0.8], [0.9, 1]);

  const handleNameHover = () => setNameHovered(true);
  const handleNameLeave = () => setNameHovered(false);

  return (
    <div>
      <ScrollProgressRing />

      <footer
        ref={sectionRef}
        className="section-spacing relative overflow-hidden"
      >
        {/* ── Background cloud blobs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${800 + i * 150}px`,
                height: `${800 + i * 150}px`,
                background: "radial-gradient(circle, var(--cloud), transparent)",
                opacity: 0.5,
                bottom: `${-20 + i * 10}%`,
                left: `${-10 + i * 30}%`,
                animation: `cloud-drift-a ${20 + i * 5}s ease-in-out infinite ${i * 3}s`,
              }}
            />
          ))}
        </div>

        {/* ── Ticker strip ── */}
        <TickerStrip />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="px-5 md:px-16"
        >
          <div className="gradient-hr mb-16 mt-16" />

          {/* ── Hero name ── */}
          <motion.div
            ref={nameRef}
            className="mb-10 cursor-pointer select-none"
            onMouseEnter={handleNameHover}
            onMouseLeave={handleNameLeave}
            style={{ scale: nameScale }}
          >
            <span
              className="font-display font-black block"
              style={{
                fontSize: "clamp(3rem, 10vw, 8rem)",
                color: "var(--text)",
                lineHeight: 1,
              }}
            >
              {"Ravi Ranjan".split("").map((l, i) => (
                <span
                  key={i}
                  className="footer-letter inline-block"
                  style={{
                    letterSpacing: nameHovered ? "0.3em" : "0em",
                    transition: `letter-spacing 0.4s ease ${i * 0.02}s`,
                  }}
                >
                  {l === " " ? "\u00A0" : l}
                </span>
              ))}
            </span>

            {/* Subtitle + availability badge below name */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
            >
              <span
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--text-dim)" }}
              >
                Full-Stack Developer · India
              </span>
              <AvailabilityBadge />
            </motion.div>
          </motion.div>

          {/* ── Nav columns + contact blurb ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            {/* Tagline column */}
            <motion.div
              className="col-span-2 md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.05 }}
            >
              <p
                className="font-body text-sm leading-relaxed mb-6"
                style={{ color: "var(--text-muted-raw)", maxWidth: "22ch" }}
              >
                Building thoughtful digital experiences with obsessive attention to craft and detail.
              </p>

              {/* Live clock */}
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--text-dim)" }}
                >
                  IST
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentTime}
                    className="font-mono text-xs"
                    style={{ color: "var(--gold)" }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentTime}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Nav columns */}
            {navSections.map((section, i) => (
              <NavColumn key={section.title} section={section} delay={0.1 + i * 0.08} />
            ))}
          </div>

          {/* ── Social pills ── */}
          <div className="flex flex-wrap gap-3 mb-14">
            {socials.map((s, i) => (
              <SocialPill
                key={s.label}
                s={s}
                i={i}
                hoveredSocial={hoveredSocial}
                setHoveredSocial={setHoveredSocial}
              />
            ))}
          </div>

          <div className="gradient-hr mb-8" />

          {/* ── Bottom bar ── */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
            <motion.p
              className="font-mono text-xs tracking-wider"
              style={{ color: "var(--text-dim)" }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              © 2026 Ravi Ranjan · Crafted with obsessive attention.
            </motion.p>

            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
            >
              {["Privacy", "Terms", "Sitemap"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-mono text-[10px] tracking-widest uppercase transition-colors duration-200"
                  style={{ color: "var(--text-dim)" }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--text-muted-raw)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--text-dim)")
                  }
                >
                  {item}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default FooterSection;