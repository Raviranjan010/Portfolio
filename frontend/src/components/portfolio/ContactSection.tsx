import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { toast } from "@/components/ui/sonner";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [sending, setSending] = useState(false);
  type DeliveryState = "idle" | "success" | "warning" | "error";
  const [deliveryState, setDeliveryState] = useState<DeliveryState>("idle");
  const [focused, setFocused] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-60, 0]),
    { stiffness: 80, damping: 25 }
  );
  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const formY = useSpring(
    useTransform(scrollYProgress, [0.05, 0.35], [60, 0]),
    { stiffness: 70, damping: 22 }
  );
  const formOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const leftPanelX = useSpring(
    useTransform(scrollYProgress, [0.05, 0.3], [-40, 0]),
    { stiffness: 70, damping: 22 }
  );

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) nextErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!formData.message.trim()) {
      nextErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 20) {
      nextErrors.message = "Message should be at least 20 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field: keyof ContactFormData, value: string) => {
    const maxByField: Partial<Record<keyof ContactFormData, number>> = {
      name: 100,
      email: 160,
      subject: 160,
      message: 5000,
    };
    const max = maxByField[field];
    const nextValue = typeof max === "number" ? value.slice(0, max) : value;

    setFormData((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSending(true);
    setServerMessage("");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      const payload: {
        message?: string;
        warning?: string;
        delivered?: boolean;
        saved?: boolean;
      } = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(payload.message || payload.warning || "Failed to send message");
      }

      const delivered = payload.delivered === true || res.status === 201;
      const saved = payload.saved === true;

      if (delivered) {
        setDeliveryState("success");
        setServerMessage(payload.message || payload.warning || "");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setFocused(null);
        toast.success(payload.message || "Message sent successfully.");
      } else if (saved) {
        // Delivered == false, but we successfully persisted the message
        setDeliveryState("warning");
        setServerMessage(payload.message || payload.warning || "");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setFocused(null);
        toast.warning(payload.message || "Message saved, but email delivery failed.");
      } else {
        // Could not deliver and could not persist
        setDeliveryState("error");
        setServerMessage(payload.message || payload.warning || "");
        toast.error(payload.message || payload.warning || "Message delivery failed. Please try again.");
      }
    } catch (err) {
      window.clearTimeout(timeoutId);
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setServerMessage(message);
      setDeliveryState("error");
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const inputContainerStyle = (field: string) => ({
    border: `1px solid ${errors[field as keyof ContactFormData] ? "rgba(248, 113, 113, 0.5)" : focused === field ? "var(--gold)" : "rgba(255,255,255,0.06)"}`,
    background: focused === field ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    boxShadow: errors[field as keyof ContactFormData]
      ? "0 0 0 3px rgba(248, 113, 113, 0.15)"
      : focused === field ? "0 0 0 3px rgba(232, 197, 71, 0.15)" : "none",
  });

  const fields = [
    { key: "name", label: "Your Name", type: "text" },
    { key: "email", label: "Your Email", type: "email" },
    { key: "subject", label: "Subject", type: "text" },
  ];

  return (
    <section ref={sectionRef} id="contact" className="section-spacing relative px-5 md:px-16 overflow-hidden">
      <div className="gradient-hr mb-12 md:mb-16" />

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-20">
        {/* Left panel */}
        <motion.div
          style={{ x: leftPanelX, opacity: headerOpacity }}
          className="lg:w-[40%]"
        >
          <motion.div style={{ x: headerX }}>
            <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold)" }}>
              GET IN TOUCH
            </p>
            <h2
              className="font-display font-black mb-6 md:mb-8"
              style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", lineHeight: 0.95, color: "var(--text)" }}
            >
              LET'S
              <span style={{ color: "var(--gold)" }}> TALK</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-body text-sm md:text-base mb-8 leading-relaxed"
            style={{ color: "var(--text-muted-raw)" }}
          >
            Have a project in mind? I'm always open to discussing new opportunities,
            creative ideas, or ways to bring your vision to life.
          </motion.p>

          <div className="space-y-3 mb-8">
            {[
              { label: "EMAIL", value: "raviranjan01b@gmail.com" },
              { label: "BASED", value: "Patna, Bihar" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 6 }}
              >
                <span className="font-mono text-[10px] md:text-xs tracking-wider w-12" style={{ color: "var(--gold)" }}>
                  {item.label}
                </span>
                <span className="font-body text-sm" style={{ color: "var(--text-muted-raw)" }}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Decorative SVG with draw animation — hidden on mobile */}
          <motion.svg
            viewBox="0 0 200 200"
            className="hidden md:block w-32 h-32 md:w-40 md:h-40 opacity-15"
            initial={{ opacity: 0, rotate: -10 }}
            whileInView={{ opacity: 0.15, rotate: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <line x1="20" y1="20" x2="180" y2="20" stroke="var(--gold)" strokeWidth="0.5" style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: "draw-line 3s ease forwards 1s" }} />
            <line x1="20" y1="20" x2="20" y2="180" stroke="var(--gold)" strokeWidth="0.5" style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: "draw-line 3s ease forwards 1.3s" }} />
            <line x1="20" y1="180" x2="180" y2="20" stroke="var(--gold)" strokeWidth="0.5" style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: "draw-line 3s ease forwards 1.6s" }} />
            <circle cx="100" cy="100" r="60" fill="none" stroke="var(--gold)" strokeWidth="0.5" style={{ strokeDasharray: 380, strokeDashoffset: 380, animation: "draw-line 3s ease forwards 1.9s" }} />
          </motion.svg>
        </motion.div>

        {/* Right panel - form */}
        <motion.div
          style={{ y: formY, opacity: formOpacity }}
          className="lg:w-[60%]"
        >
          <AnimatePresence mode="wait">
            {deliveryState === "idle" ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20, rotateX: 5 }}
                className="space-y-6 md:space-y-8"
              >
                {fields.map((field, i) => (
                  <motion.div
                    key={field.key}
                    className="relative"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  >
                    <div className="relative pt-6 pb-2 px-5" style={inputContainerStyle(field.key)}>
                      <label
                        htmlFor={`contact-${field.key}`}
                        className="absolute left-5 top-5 font-body text-xs pointer-events-none transition-all duration-300"
                        style={{
                          color: errors[field.key as keyof ContactFormData]
                            ? "#fca5a5"
                            : focused === field.key || formData[field.key as keyof typeof formData]
                            ? "var(--gold)" : "var(--text-muted-raw)",
                          transform: focused === field.key || formData[field.key as keyof typeof formData]
                            ? "translateY(-12px) scale(0.85)" : "translateY(2px) scale(1)",
                          transformOrigin: "left",
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required
                        id={`contact-${field.key}`}
                        ref={field.key === "name" ? nameInputRef : undefined}
                        aria-invalid={Boolean(errors[field.key as keyof ContactFormData])}
                        aria-describedby={
                          errors[field.key as keyof ContactFormData]
                            ? `contact-${field.key}-error`
                            : undefined
                        }
                        className="w-full font-body text-sm md:text-base outline-none bg-transparent"
                        style={{ color: "var(--text)" }}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => updateField(field.key as keyof ContactFormData, e.target.value)}
                        onFocus={() => setFocused(field.key)}
                        onBlur={() => setFocused(null)}
                        autoComplete={field.key === "email" ? "email" : field.key === "name" ? "name" : "off"}
                        maxLength={field.key === "name" ? 100 : field.key === "email" ? 160 : 160}
                      />
                    </div>
                    {errors[field.key as keyof ContactFormData] && (
                      <p
                        id={`contact-${field.key}-error`}
                        className="mt-2 text-xs font-body pl-2"
                        style={{ color: "#fca5a5" }}
                        role="alert"
                      >
                        {errors[field.key as keyof ContactFormData]}
                      </p>
                    )}
                  </motion.div>
                ))}

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.34, duration: 0.5 }}
                >
                  <div className="relative pt-6 pb-2 px-5" style={inputContainerStyle("message")}>
                    <label
                      htmlFor="contact-message"
                      className="absolute left-5 top-5 font-body text-xs pointer-events-none transition-all duration-300"
                      style={{
                        color: errors.message ? "#fca5a5" : focused === "message" || formData.message ? "var(--gold)" : "var(--text-muted-raw)",
                        transform: focused === "message" || formData.message ? "translateY(-12px) scale(0.85)" : "translateY(2px) scale(1)",
                        transformOrigin: "left",
                      }}
                    >
                      Your Message
                    </label>
                    <textarea
                      required
                      id="contact-message"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      rows={4}
                      className="w-full font-body text-sm md:text-base outline-none resize-none bg-transparent pt-2"
                      style={{ color: "var(--text)" }}
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      maxLength={5000}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 px-2">
                    {errors.message ? (
                      <p
                        id="contact-message-error"
                        className="text-xs font-body"
                        style={{ color: "#fca5a5" }}
                        role="alert"
                      >
                        {errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs font-mono tracking-wider" style={{ color: "var(--text-muted-raw)" }}>
                      {formData.message.trim().length}/5000
                    </p>
                  </div>
                </motion.div>

                {serverMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: "rgba(232, 197, 71, 0.22)",
                      background: "rgba(232, 197, 71, 0.06)",
                      color: "var(--text-muted-raw)",
                    }}
                    role="status"
                    aria-live="polite"
                  >
                    <p className="font-body text-sm">{serverMessage}</p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.4 }}
                >
                  <MagneticButton
                    as="button"
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 rounded-lg font-body text-sm tracking-widest uppercase transition-all duration-300"
                    style={{
                      background: sending ? "var(--gold-dim)" : "var(--gold)",
                      color: "var(--bg)",
                      boxShadow: sending ? "none" : "0 8px 30px var(--gold-glow)",
                    }}
                    strength={0.15}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </MagneticButton>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                key={deliveryState}
                initial={{ opacity: 0, scale: 0.85, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col items-center justify-center py-16"
              >
                {deliveryState === "success" && (
                  <>
                    <motion.svg
                      width="64"
                      height="64"
                      viewBox="0 0 80 80"
                      className="mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="var(--gold)"
                        strokeWidth="2"
                        style={{ strokeDasharray: 230, strokeDashoffset: 230, animation: "draw-line 0.8s ease forwards" }}
                      />
                      <path
                        d="M24 42 L35 53 L56 28"
                        fill="none"
                        stroke="var(--gold)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: "draw-line 0.6s ease forwards 0.5s" }}
                      />
                    </motion.svg>
                    <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Message Sent</h3>
                    <p className="font-body text-sm" style={{ color: "var(--text-muted-raw)", textAlign: "center", maxWidth: 420 }}>
                      {serverMessage || "Thank you! I'll get back to you within 24 hours."}
                    </p>
                  </>
                )}

                {deliveryState === "warning" && (
                  <>
                    <motion.svg
                      width="64"
                      height="64"
                      viewBox="0 0 80 80"
                      className="mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <circle cx="40" cy="40" r="36" fill="none" stroke="var(--gold)" strokeWidth="2"
                        style={{ strokeDasharray: 230, strokeDashoffset: 230, animation: "draw-line 0.8s ease forwards" }}
                      />
                      <path d="M40 22 L40 46" fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round"
                        style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: "draw-line 0.6s ease forwards 0.2s" }}
                      />
                      <circle cx="40" cy="58" r="3.2" fill="var(--gold)" />
                    </motion.svg>
                    <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Message Saved</h3>
                    <p className="font-body text-sm" style={{ color: "var(--text-muted-raw)", textAlign: "center", maxWidth: 420 }}>
                      {serverMessage || "Your message is saved, but email delivery failed. I'll check it from my inbox logs."}
                    </p>
                  </>
                )}

                {deliveryState === "error" && (
                  <>
                    <motion.svg
                      width="64"
                      height="64"
                      viewBox="0 0 80 80"
                      className="mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="#fca5a5"
                        strokeWidth="2"
                        style={{ strokeDasharray: 230, strokeDashoffset: 230, animation: "draw-line 0.8s ease forwards" }}
                      />
                      <path
                        d="M28 28 L52 52"
                        fill="none"
                        stroke="#fca5a5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: "draw-line 0.6s ease forwards 0.2s" }}
                      />
                      <path
                        d="M52 28 L28 52"
                        fill="none"
                        stroke="#fca5a5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: "draw-line 0.6s ease forwards 0.35s" }}
                      />
                    </motion.svg>
                    <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Couldn’t Send</h3>
                    <p className="font-body text-sm" style={{ color: "var(--text-muted-raw)", textAlign: "center", maxWidth: 420 }}>
                      {serverMessage || "Please try again in a moment."}
                    </p>
                  </>
                )}

                <div className="mt-8 w-full max-w-[320px]">
                  <MagneticButton
                    as="button"
                    type="button"
                    className="w-full py-3.5 rounded-lg font-body text-sm tracking-widest uppercase transition-all duration-300"
                    style={{
                      background: "rgba(232,197,71,0.08)",
                      color: "var(--gold)",
                      border: "1px solid rgba(232,197,71,0.35)",
                      boxShadow: deliveryState === "error" ? "none" : "0 8px 30px var(--gold-glow)",
                    }}
                    strength={0.15}
                    onClick={() => {
                      setDeliveryState("idle");
                      setServerMessage("");
                      setErrors({});
                      setFocused(null);
                      setTimeout(() => nameInputRef.current?.focus(), 50);
                    }}
                  >
                    {deliveryState === "success" ? "Send Another Message" : deliveryState === "warning" ? "Try Again" : "Try Again"}
                  </MagneticButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
