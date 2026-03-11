import { useRef, useCallback, useState } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
  as?: "button" | "a" | "div";
  [key: string]: any;
}

const MagneticButton = ({
  children,
  className = "",
  style,
  strength = 0.35,
  as: Tag = "button",
  ...props
}: MagneticButtonProps) => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setOffset({ x, y });
  }, [strength]);

  const onLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        ...style,
        display: "inline-block",
        willChange: "transform",
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 && offset.y === 0
          ? "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "transform 0.2s ease-out",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default MagneticButton;
