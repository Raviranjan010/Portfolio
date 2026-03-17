import { useRef, useCallback, useState } from "react";

type AsTag = "button" | "a" | "div";

type PropsForTag<T extends AsTag> =
  T extends "button"
    ? React.ComponentPropsWithoutRef<"button">
    : T extends "a"
      ? React.ComponentPropsWithoutRef<"a">
      : React.ComponentPropsWithoutRef<"div">;

type MagneticButtonProps<T extends AsTag = "button"> = {
  as?: T;
  strength?: number;
} & Omit<PropsForTag<T>, "as">;

const MagneticButton = ({
  children,
  className = "",
  style,
  strength = 0.35,
  as: Tag = "button",
  ...props
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
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
      ref={ref as unknown as never}
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
      {...(props as unknown as Record<string, unknown>)}
    >
      {children}
    </Tag>
  );
};

export default MagneticButton;
