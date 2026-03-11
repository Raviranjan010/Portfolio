import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
    const duration = 2600;

    const tick = () => {
      const elapsed = performance.now() - startTime.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => onComplete(), 3800),
    ];
    return () => {
      cancelAnimationFrame(rafRef.current);
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Cinzel:wght@400;600&family=JetBrains+Mono:wght@300;400&display=swap');

        :root {
          --bg: #0a0905;
          --gold: #c9a84c;
          --gold-light: #e8c97a;
          --gold-dim: #7a6230;
          --text: #f0ead8;
          --text-muted-raw: #6b6047;
          --border-raw: rgba(201,168,76,0.18);
        }

        @keyframes grain-shift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2%, -3%); }
          50% { transform: translate(1%, 2%); }
          75% { transform: translate(3%, -1%); }
        }

        @keyframes shimmer-sweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes pulse-ring {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.04); }
        }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-80px) translateX(20px); opacity: 0; }
        }

        .font-display { font-family: 'Cinzel', serif; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .shimmer-bar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%);
          animation: shimmer-sweep 2s ease-in-out infinite;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: var(--gold);
          animation: float-particle var(--dur) var(--delay) ease-in-out infinite;
        }
      `}</style>

      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: "var(--bg)" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase >= 3 ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Radial glow behind logo */}
        <div
          className="absolute"
          style={{
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
            animation: "pulse-ring 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.045,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            animation: "grain-shift 0.5s steps(1) infinite",
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${38 + i * 3.5}%`,
              bottom: "44%",
              "--dur": `${2.4 + i * 0.4}s`,
              "--delay": `${i * 0.35}s`,
              opacity: phase >= 1 ? 1 : 0,
            } as React.CSSProperties}
          />
        ))}

        {/* Decorative horizontal rule — top */}
        <motion.div
          className="absolute top-10 left-1/2"
          style={{ translateX: "-50%", display: "flex", alignItems: "center", gap: 12 }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, scaleX: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, var(--gold-dim))" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", opacity: 0.6 }} />
          <div style={{ width: 60, height: 1, background: "linear-gradient(to left, transparent, var(--gold-dim))" }} />
        </motion.div>

        {/* Main content */}
        <div className="relative flex flex-col items-center">

          {/* ── SVG Logo Mark — R ── */}
          <svg width="130" height="130" viewBox="0 0 130 130" fill="none" className="mb-9">
            {/* Outer orbit ring */}
            <motion.circle
              cx="65" cy="65" r="58"
              stroke="url(#goldGrad)" strokeWidth="0.6" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Inner ring */}
            <motion.circle
              cx="65" cy="65" r="44"
              stroke="var(--gold)" strokeWidth="0.35" fill="none" strokeDasharray="4 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 0.35 : 0 }}
              transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Subtle diagonal rule */}
            <motion.line
              x1="26" y1="104" x2="104" y2="26"
              stroke="var(--gold)" strokeWidth="0.4" opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* ── Letter R ── */}
            {/* Vertical stem */}
            <motion.line
              x1="46" y1="38" x2="46" y2="90"
              stroke="var(--gold)" strokeWidth="2.2" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Bowl top arm */}
            <motion.path
              d="M46 38 Q85 38 85 55 Q85 72 46 72"
              stroke="var(--gold)" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Diagonal leg */}
            <motion.line
              x1="46" y1="72" x2="84" y2="90"
              stroke="var(--gold)" strokeWidth="2.2" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Accent dot — top right orbit */}
            <motion.circle cx="89" cy="36" r="2.5" fill="var(--gold-light)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 0.9 : 0 }}
              transition={{ duration: 0.5, delay: 1.3, ease: "backOut" }}
            />
            {/* Accent dot — bottom left orbit */}
            <motion.circle cx="36" cy="96" r="1.5" fill="var(--gold)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 0.5 : 0 }}
              transition={{ duration: 0.5, delay: 1.5, ease: "backOut" }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="130" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7a6230" />
                <stop offset="50%" stopColor="#c9a84c" />
                <stop offset="100%" stopColor="#7a6230" />
              </linearGradient>
            </defs>
          </svg>

          {/* Name */}
          <div className="overflow-hidden">
            <motion.div
              className="font-display text-2xl md:text-3xl font-semibold tracking-[0.35em] uppercase"
              style={{ color: "var(--text)" }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: phase >= 2 ? 0 : 60, opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              Ravi&nbsp;Ranjan
            </motion.div>
          </div>

          {/* Thin gold rule under name */}
          <motion.div
            style={{
              height: 1,
              background: "linear-gradient(to right, transparent, var(--gold), transparent)",
              marginTop: 10,
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: phase >= 2 ? 180 : 0, opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Subtitle */}
          <motion.div
            className="font-mono text-[10px] tracking-[0.55em] uppercase mt-3"
            style={{ color: "var(--gold)" }}
            initial={{ opacity: 0, letterSpacing: "1.2em" }}
            animate={{
              opacity: phase >= 2 ? 0.8 : 0,
              letterSpacing: phase >= 2 ? "0.55em" : "1.2em",
            }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            Portfolio
          </motion.div>

          {/* Progress bar */}
          <div className="mt-10 flex flex-col items-center gap-3">
            {/* Track */}
            <div className="relative w-52 h-[1px]" style={{ background: "var(--border-raw)" }}>
              {/* Fill */}
              <motion.div
                className="absolute inset-y-0 left-0 shimmer-bar overflow-hidden"
                style={{
                  background: "linear-gradient(to right, var(--gold-dim), var(--gold-light))",
                  width: `${progress}%`,
                }}
              />
              {/* Leading glow dot */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${progress}%`,
                  transform: "translate(-50%, -50%)",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--gold-light)",
                  boxShadow: "0 0 8px 2px rgba(232,201,122,0.6)",
                  opacity: progress > 0 && progress < 100 ? 1 : 0,
                }}
              />
            </div>

            <motion.span
              className="font-mono text-[9px] tracking-[0.4em]"
              style={{ color: "var(--text-muted-raw)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {String(progress).padStart(3, "0")}%
            </motion.span>
          </div>
        </div>

        {/* Decorative horizontal rule — bottom */}
        <motion.div
          className="absolute bottom-10 left-1/2"
          style={{ translateX: "-50%", display: "flex", alignItems: "center", gap: 12 }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, scaleX: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, var(--gold-dim))" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", opacity: 0.6 }} />
          <div style={{ width: 60, height: 1, background: "linear-gradient(to left, transparent, var(--gold-dim))" }} />
        </motion.div>
      </motion.div>

      {/* Curtain reveal — two halves slide away */}
      {phase >= 3 && (
        <>
          <motion.div
            className="fixed inset-0 z-[9998]"
            style={{ background: "var(--bg)", originY: 0 }}
            initial={{ clipPath: "inset(0 0 50% 0)" }}
            animate={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
          <motion.div
            className="fixed inset-0 z-[9998]"
            style={{ background: "var(--bg)", originY: 1 }}
            initial={{ clipPath: "inset(50% 0 0 0)" }}
            animate={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
        </>
      )}
    </>
  );
};

export default LoadingScreen;