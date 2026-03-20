import { Suspense, lazy, useCallback, useState } from "react";
import { motion } from "framer-motion";
import AboutSection from "@/components/portfolio/AboutSection";
import ContactSection from "@/components/portfolio/ContactSection";
import CursorTrail from "@/components/portfolio/CursorTrail";
import CustomCursor from "@/components/portfolio/CustomCursor";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import FloatingParticles from "@/components/portfolio/FloatingParticles";
import FooterSection from "@/components/portfolio/FooterSection";
import HeroSection from "@/components/portfolio/HeroSection";
import LoadingScreen from "@/components/portfolio/LoadingScreen";
import Navbar from "@/components/portfolio/Navbar";
import SectionDivider from "@/components/portfolio/SectionDivider";
import SkillsSection from "@/components/portfolio/SkillsSection";
import CertificationsSection from "@/components/portfolio/CertificationsSection";

const ProjectsSection = lazy(() => import("@/components/portfolio/ProjectsSection"));
const GallerySection = lazy(() => import("@/components/portfolio/GallerySection"));
const TestimonialsSection = lazy(() => import("@/components/portfolio/TestimonialsSection"));

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
      <ExperienceSection />
      <SectionDivider text="CERTIFICATIONS -" direction="right" />
      <CertificationsSection />
      <SectionDivider text="VISUAL ARCHIVE -" direction="left" />
      <Suspense fallback={null}>
        <ProjectsSection />
      </Suspense>
      <SectionDivider text="CAREER PATH -" direction="right" />
      
      <Suspense fallback={null}>
        <GallerySection />
      </Suspense>
      <SectionDivider text="KIND WORDS -" direction="right" />
      <Suspense fallback={null}>
        <TestimonialsSection />
      </Suspense>
      <SectionDivider text="LET'S CONNECT -" direction="left" />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
