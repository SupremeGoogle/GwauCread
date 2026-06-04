"use client";

import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";
import { type ReactNode, useRef } from "react";

interface Props extends HTMLMotionProps<"article"> {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, (v) => (v - 0.5) * -12);
  const rotateY = useTransform(springX, (v) => (v - 0.5) * 12);

  function handleMouse(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  }

  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.article
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        perspective: 1200,
      }}
      whileHover={{ z: 20 }}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </motion.article>
  );
}
