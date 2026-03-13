import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import AboutSection from "@/components/portfolio/AboutSection";
import ContactSection from "@/components/portfolio/ContactSection";
import CursorTrail from "@/components/portfolio/CursorTrail";
import CustomCursor from "@/components/portfolio/CustomCursor";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import FloatingParticles from "@/components/portfolio/FloatingParticles";
import FooterSection from "@/components/portfolio/FooterSection";
import GallerySection from "@/components/portfolio/GallerySection";
import HeroSection from "@/components/portfolio/HeroSection";
import LoadingScreen from "@/components/portfolio/LoadingScreen";
import Navbar from "@/components/portfolio/Navbar";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SectionDivider from "@/components/portfolio/SectionDivider";
import SkillsSection from "@/components/portfolio/SkillsSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {loading && <LoadingScreen onComplete={handleComplete} />}
      <CustomCursor />
      <CursorTrail />
      <FloatingParticles />
      <Navbar />
      <HeroSection />
      <SectionDivider text="ABOUT ME -" direction="left" />
      <AboutSection />
      <SectionDivider text="EXPERTISE -" direction="right" />
      <SkillsSection />
      <SectionDivider text="SELECTED WORK -" direction="left" />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <ExperienceSection />
      <SectionDivider text="VISUAL ARCHIVE -" direction="left" />
        <ProjectsSection />
      </motion.div>
      <SectionDivider text="CAREER PATH -" direction="right" />
      
      <GallerySection />
      <SectionDivider text="KIND WORDS -" direction="right" />
      <TestimonialsSection />
      <SectionDivider text="LET'S CONNECT -" direction="left" />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
