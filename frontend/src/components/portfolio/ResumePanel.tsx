import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Briefcase, Download, GraduationCap, Sparkles, X } from "lucide-react";
import { createPortal } from "react-dom";

type WorkItem = {
  period: string;
  role: string;
  company: string;
  details: string;
  metrics: string;
};

type EducationItem = {
  period: string;
  title: string;
  institution: string;
};

const workHistory: WorkItem[] = [
  {
    period: "2024 - Present",
    role: "Senior Full-Stack Engineer",
    company: "Zenith Labs",
    details: "Leading fintech infrastructure delivery across live trading surfaces, internal platform tooling, and performance-critical services.",
    metrics: "100K+ events/sec",
  },
  {
    period: "2022 - 2024",
    role: "Full-Stack Developer",
    company: "Nomad Creative",
    details: "Built motion-led web experiences and reusable design systems for premium brands, campaigns, and editorial launches.",
    metrics: "15+ launches",
  },
  {
    period: "2021 - 2022",
    role: "Frontend Engineer",
    company: "EcoTech Solutions",
    details: "Shipped a climate intelligence dashboard with accessible data visualization and a product UX tuned for repeat engagement.",
    metrics: "50K+ active users",
  },
  {
    period: "2020 - 2021",
    role: "Junior Developer",
    company: "StartupForge",
    details: "Handled full-stack product delivery across APIs, landing pages, deployment pipelines, and internal automation.",
    metrics: "0 to 1 product ops",
  },
];

const education: EducationItem[] = [
  { period: "2016 - 2020", title: "B.Sc. Computer Science", institution: "MIT" },
];

const certifications = [
  "AWS Solutions Architect",
  "Google Cloud Professional",
  "Meta Frontend Developer",
];

const strengths = ["React", "TypeScript", "Node", "System Design", "Framer Motion", "Product UI"];

const stats = [
  { label: "Years Building", value: "5+" },
  { label: "Products Shipped", value: "20+" },
  { label: "Specialty", value: "Full Stack" },
];

const ResumePanel = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const resumeContent = useMemo(() => {
    return [
      "Ravi Ranjan - Resume",
      "Full-Stack Developer and Creative Engineer",
      "",
      "SUMMARY",
      "Motion-focused engineer building premium digital products, polished interfaces, and scalable web systems.",
      "",
      "EXPERIENCE",
      ...workHistory.map((item) => `${item.period} | ${item.role} @ ${item.company}\n${item.details}\nImpact: ${item.metrics}`),
      "",
      "EDUCATION",
      ...education.map((item) => `${item.period} | ${item.title} - ${item.institution}`),
      "",
      "CERTIFICATIONS",
      ...certifications,
      "",
      "CORE STRENGTHS",
      ...strengths,
    ].join("\n");
  }, []);

  const handleDownload = () => {
    const blob = new Blob([resumeContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Ravi_Ranjan_Resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative overflow-hidden rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.28em]"
        style={{
          color: "var(--gold)",
          border: "1px solid rgba(232,197,71,0.42)",
          background: "linear-gradient(135deg, rgba(232,197,71,0.12), rgba(255,255,255,0.02))",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        }}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.14), transparent)" }}
          animate={{ x: ["-140%", "140%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative z-10 flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: "rgba(232,197,71,0.14)", border: "1px solid rgba(232,197,71,0.22)" }}
          >
            <Download size={14} />
          </span>
          <span>Resume / CV</span>
          <span className="hidden text-[10px] tracking-[0.18em] md:inline" style={{ color: "var(--text-dim)" }}>
            Interactive panel
          </span>
        </span>
      </motion.button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="fixed inset-0 z-[200]"
                  style={{ background: "rgba(3,4,8,0.72)", backdropFilter: "blur(10px)" }}
                  onClick={() => setOpen(false)}
                />

                <motion.aside
                  initial={{ x: "100%", opacity: 0.9 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0.9 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed inset-y-0 right-0 z-[201] w-full max-w-[42rem] overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(10,12,18,0.98), rgba(8,10,14,0.98))",
                    borderLeft: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "-24px 0 80px rgba(0,0,0,0.4)",
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute left-[-8rem] top-[-4rem] h-56 w-56 rounded-full blur-3xl"
                      style={{ background: "radial-gradient(circle, rgba(232,197,71,0.18), transparent 72%)" }}
                    />
                    <div
                      className="absolute right-[-10rem] top-[22%] h-72 w-72 rounded-full blur-3xl"
                      style={{ background: "radial-gradient(circle, rgba(70,155,227,0.16), transparent 72%)" }}
                    />
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                        backgroundSize: "84px 84px",
                      }}
                    />
                  </div>

                  <div className="relative flex h-full flex-col overflow-y-auto">
                    <div className="border-b px-6 py-5 md:px-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.36em]" style={{ color: "var(--gold)" }}>
                            Career Snapshot
                          </p>
                          <h2 className="font-display text-3xl font-black md:text-4xl" style={{ color: "var(--text)" }}>
                            Resume
                            <span style={{ color: "var(--gold)" }}> Panel</span>
                          </h2>
                          <p className="mt-3 max-w-lg font-body text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted-raw)" }}>
                            A polished overview of experience, certifications, and execution range across product engineering and motion-led interfaces.
                          </p>
                        </div>

                        <motion.button
                          type="button"
                          onClick={() => setOpen(false)}
                          whileHover={{ scale: 1.06, rotate: 90 }}
                          whileTap={{ scale: 0.96 }}
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-muted-raw)" }}
                          aria-label="Close resume panel"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    </div>

                    <div className="relative px-6 pb-8 pt-6 md:px-8">
                      <div
                        className="mb-6 overflow-hidden rounded-[28px] p-5 md:p-6"
                        style={{
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
                          boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
                        }}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--gold)", background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.22)" }}>
                              <Sparkles size={12} />
                              Available for selective work
                            </div>
                            <h3 className="font-display text-2xl font-black md:text-3xl" style={{ color: "var(--text)" }}>
                              Ravi Ranjan
                            </h3>
                            <p className="mt-2 font-body text-sm md:text-base" style={{ color: "var(--text-muted-raw)" }}>
                              Full-Stack Developer and Creative Engineer focused on premium UI systems, scalable frontend architecture, and production-quality motion.
                            </p>
                          </div>

                          <motion.button
                            type="button"
                            onClick={handleDownload}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em]"
                            style={{ color: "var(--bg)", background: "var(--gold)", boxShadow: "0 10px 28px rgba(232,197,71,0.24)" }}
                          >
                            <Download size={14} />
                            Download CV
                          </motion.button>
                        </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {stats.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl px-3 py-4"
                          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                        >
                          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "var(--text-dim)" }}>
                            {item.label}
                          </p>
                          <p className="font-display text-xl font-black md:text-2xl" style={{ color: item.label === "Specialty" ? "var(--gold)" : "var(--text)" }}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {strengths.map((strength) => (
                        <span
                          key={strength}
                          className="rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                          style={{ color: "var(--text)", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                      <div className="mb-8">
                        <div className="mb-5 flex items-center gap-2">
                          <Briefcase size={16} style={{ color: "var(--gold)" }} />
                          <h3 className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>
                            Experience
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {workHistory.map((item, index) => (
                            <motion.div
                              key={`${item.company}-${item.period}`}
                              initial={{ opacity: 0, x: 26 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.12 + index * 0.07, duration: 0.45 }}
                              className="relative overflow-hidden rounded-[24px] p-5"
                              style={{
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                              }}
                            >
                              <div
                                className="absolute bottom-0 left-0 top-0 w-[3px]"
                                style={{ background: "linear-gradient(180deg, var(--gold), rgba(232,197,71,0.08))" }}
                              />
                              <div className="flex flex-wrap items-start justify-between gap-3 pl-3">
                                <div>
                                  <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--text-dim)" }}>
                                    {item.period}
                                  </p>
                                  <h4 className="mt-2 font-display text-lg font-black md:text-xl" style={{ color: "var(--text)" }}>
                                    {item.role}
                                  </h4>
                                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--gold)" }}>
                                    {item.company}
                                  </p>
                                </div>
                                <div
                                  className="rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em]"
                                  style={{ color: "var(--gold)", background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.22)" }}
                                >
                                  {item.metrics}
                                </div>
                              </div>
                              <p className="mt-4 pl-3 font-body text-sm leading-relaxed md:text-[15px]" style={{ color: "var(--text-muted-raw)" }}>
                                {item.details}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div
                          className="rounded-[24px] p-5"
                          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))" }}
                        >
                          <div className="mb-5 flex items-center gap-2">
                            <GraduationCap size={16} style={{ color: "var(--gold)" }} />
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>
                              Education
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {education.map((item, index) => (
                              <motion.div
                                key={`${item.title}-${item.period}`}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.34 + index * 0.08, duration: 0.4 }}
                                className="rounded-2xl p-4"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                              >
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--text-dim)" }}>
                                  {item.period}
                                </p>
                                <h4 className="mt-2 font-display text-lg font-bold" style={{ color: "var(--text)" }}>
                                  {item.title}
                                </h4>
                                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--gold)" }}>
                                  {item.institution}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div
                          className="rounded-[24px] p-5"
                          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))" }}
                        >
                          <div className="mb-5 flex items-center gap-2">
                            <Award size={16} style={{ color: "var(--gold)" }} />
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>
                              Certifications
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {certifications.map((certification, index) => (
                              <motion.span
                                key={certification}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.42 + index * 0.06, duration: 0.35 }}
                                className="rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em]"
                                style={{ color: "var(--gold)", background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.22)" }}
                              >
                                {certification}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default ResumePanel;
