"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function move(e: MouseEvent) {
      if (!glowRef.current) return;
      glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: "fixed",
        top: -200,
        left: -200,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(84,198,176,0.08) 0%, rgba(215,144,77,0.04) 40%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
        transition: "opacity 0.3s",
      }}
    />
  );
}
