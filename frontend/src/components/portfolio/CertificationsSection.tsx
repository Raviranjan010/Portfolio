import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { DoubleSide, MathUtils, TextureLoader } from "three";
import type { Mesh } from "three";
import cert1 from "@/assets/cert-1.jpg";
import cert2 from "@/assets/cert-2.jpg";
import cert3 from "@/assets/cert-3.jpg";
import cert4 from "@/assets/cert-4.jpg";
import cert5 from "@/assets/cert-5.jpg";
import cert6 from "@/assets/cert-6.jpg";
import { useIsMobile } from "@/hooks/use-mobile";
import ScrollReveal from "./ScrollReveal";

const CERTS = [
  { image: cert1, title: "AWS Cloud Practitioner", org: "Amazon Web Services", year: "2023" },
  { image: cert2, title: "UX Design Professional", org: "Google", year: "2022" },
  { image: cert3, title: "Frontend Developer", org: "Meta", year: "2022" },
  { image: cert4, title: "UI Design Certificate", org: "Figma", year: "2021" },
  { image: cert5, title: "Next.js Developer", org: "Vercel", year: "2023" },
  { image: cert6, title: "Advanced TypeScript", org: "Microsoft", year: "2024" },
];

const CertificatePlane = ({
  image,
  index,
  total,
  rotationY,
  activeIndex,
  radius,
}: {
  image: string;
  index: number;
  total: number;
  rotationY: number;
  activeIndex: number;
  radius: number;
}) => {
  const texture = useLoader(TextureLoader, image);
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    const angle = (index / total) * Math.PI * 2 + rotationY;
    const targetX = Math.sin(angle) * radius;
    const targetZ = Math.cos(angle) * radius - 0.4;
    const targetY = Math.sin(angle * 0.5) * 0.2;
    const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const focus = Math.max(0.35, Math.cos(normalized));
    const scale = index === activeIndex ? 1.1 : 0.94;

    meshRef.current.position.x = MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);
    meshRef.current.position.y = MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);
    meshRef.current.position.z = MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08);
    meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, -angle, 0.08);
    meshRef.current.scale.x = MathUtils.lerp(meshRef.current.scale.x, scale, 0.08);
    meshRef.current.scale.y = MathUtils.lerp(meshRef.current.scale.y, scale, 0.08);
    (meshRef.current.material as { opacity: number }).opacity = MathUtils.lerp(
      (meshRef.current.material as { opacity: number }).opacity,
      0.22 + focus * 0.78,
      0.08,
    );
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.3, 1.58]} />
      <meshBasicMaterial map={texture} side={DoubleSide} transparent opacity={0.8} />
    </mesh>
  );
};

const CarouselScene = ({
  rotationY,
  activeIndex,
  radius,
}: {
  rotationY: number;
  activeIndex: number;
  radius: number;
}) => (
  <>
    <ambientLight intensity={0.9} />
    <directionalLight position={[0, 3, 4]} intensity={1.2} />
    {CERTS.map((cert, index) => (
      <CertificatePlane
        key={cert.title}
        image={cert.image}
        index={index}
        total={CERTS.length}
        rotationY={rotationY}
        activeIndex={activeIndex}
        radius={radius}
      />
    ))}
  </>
);

const CertificatesSection = () => {
  const isMobile = useIsMobile();
  const [rotationY, setRotationY] = useState(0);
  const dragState = useRef({ dragging: false, lastX: 0, velocity: 0.012 });

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      dragState.current.velocity *= dragState.current.dragging ? 0.94 : 0.985;
      if (Math.abs(dragState.current.velocity) < 0.0015) {
        dragState.current.velocity = 0.004;
      }

      setRotationY((previous) => previous + dragState.current.velocity);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const normalizedAngle = ((-rotationY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const activeIndex = Math.round((normalizedAngle / (Math.PI * 2)) * CERTS.length) % CERTS.length;
  const activeCert = CERTS[activeIndex];
  const radius = isMobile ? 2.5 : 3.4;
  const sideCards = useMemo(
    () => CERTS.filter((_, index) => index !== activeIndex).slice(0, isMobile ? 2 : 3),
    [activeIndex, isMobile],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current.dragging = true;
    dragState.current.lastX = event.clientX;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return;
    const delta = event.clientX - dragState.current.lastX;
    dragState.current.velocity = delta * 0.0018;
    setRotationY((previous) => previous + dragState.current.velocity);
    dragState.current.lastX = event.clientX;
  };

  const onPointerUp = () => {
    dragState.current.dragging = false;
  };

  return (
    <section id="certificates" className="section-shell">
      <div className="section-grid">
        <ScrollReveal>
          <p className="text-sm tracking-[0.25em] uppercase text-primary">Certificates</p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Credentials & certifications
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <ScrollReveal delay={0.18}>
            <div
              className="relative h-[25rem] cursor-grab overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 active:cursor-grabbing md:h-[31rem]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <Canvas camera={{ position: [0, 0.1, 5], fov: 42 }} gl={{ alpha: true, antialias: true }}>
                <CarouselScene rotationY={rotationY} activeIndex={activeIndex} radius={radius} />
              </Canvas>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background via-background/70 to-transparent md:w-24" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/70 to-transparent md:w-24" />
            </div>
          </ScrollReveal>

          <div className="grid gap-5">
            <ScrollReveal delay={0.22}>
              <div className="glass-panel rounded-[2rem] border border-white/10 p-7">
                <p className="text-xs uppercase tracking-[0.24em] text-primary">Now centered</p>
                <h3 className="mt-3 font-display text-2xl font-bold text-foreground">{activeCert.title}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  {activeCert.org} · {activeCert.year}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Drag through the curved archive to explore certifications. Momentum and auto-rotation stay active so the
                  stack never feels static.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {sideCards.map((cert, index) => (
                <ScrollReveal key={cert.title} delay={0.26 + index * 0.06}>
                  <div className="glass-panel rounded-[1.5rem] border border-white/10 p-5">
                    <p className="font-medium text-foreground">{cert.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {cert.org} · {cert.year}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
