import React, { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  dx: number;
  dy: number;
  lifetime: number;
};

export type ParticleEventDetail = {
  x: number; // viewport clientX
  y: number; // viewport clientY
  count?: number;
  colors?: string[];
  lifetimeMs?: number;
};

let particleId = 0;

export function emitParticles(detail: ParticleEventDetail) {
  window.dispatchEvent(new CustomEvent<ParticleEventDetail>("hap:particles", { detail } as any));
}

export const ParticleLayer: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent<ParticleEventDetail>;
      const { x, y, count = 16, colors = ["#A020F0", "#FF6AD5", "#86A8E7", "#5FFBF1"], lifetimeMs = 900 } = ce.detail || ({} as any);
      const burst: Particle[] = Array.from({ length: count }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        return {
          id: ++particleId,
          x,
          y,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 6,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          lifetime: lifetimeMs,
        };
      });
      setParticles((prev) => [...prev, ...burst]);
      // Cleanup after lifetime
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !burst.some((b) => b.id === p.id)));
      }, lifetimeMs);
    }
    window.addEventListener("hap:particles", handler as any);
    return () => window.removeEventListener("hap:particles", handler as any);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: 9999,
            boxShadow: `0 0 12px ${p.color}55`,
            transform: `translate(-50%, -50%)`,
            animation: `particle-pop ${p.lifetime}ms ease-out forwards`,
            // Pass velocity via CSS vars used in keyframes
            // @ts-ignore
            "--dx": `${p.dx}px`,
            // @ts-ignore
            "--dy": `${p.dy}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};


