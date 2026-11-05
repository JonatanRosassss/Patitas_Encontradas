import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GeminiSparklesProps {
  intensity?: number;
  showAmbientGlow?: boolean;
  warmthLevel?: 'medium' | 'high';
}

export const GeminiSparkles: React.FC<GeminiSparklesProps> = ({
  intensity = 1.0,
  showAmbientGlow = true,
  warmthLevel = 'high',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // 4-Pointed Star SVG component with organic floating drift & radiant trails
  const FloatingGeminiStar = ({
    baseX,
    baseY,
    size,
    color,
    rotSpeed = 1.0,
    driftSpeed = 0.8,
    delay = 0,
  }: {
    baseX: number;
    baseY: number;
    size: number;
    color: string;
    rotSpeed?: number;
    driftSpeed?: number;
    delay?: number;
  }) => {
    const pulse = Math.sin(time * 3.2 + delay);
    const scale = interpolate(pulse, [-1, 1], [0.72, 1.35]) * intensity;
    const rot = (time * 48 * rotSpeed + delay * 60) % 360;
    const opac = interpolate(pulse, [-1, 1], [0.45, 0.98]);

    // Continuous floating path
    const curX = baseX + Math.sin(time * driftSpeed + delay) * 3.5;
    const curY = baseY + Math.cos(time * (driftSpeed * 0.85) + delay) * 2.8;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${curX}%`,
          top: `${curY}%`,
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
          opacity: opac,
          pointerEvents: 'none',
          filter: `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 28px rgba(255, 138, 0, 0.45))`,
        }}
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
            fill={color}
          />
        </svg>
      </div>
    );
  };

  // Floating ambient micro-dust motes (Gemini dust particles)
  const dustParticles = [
    { id: 1, x: 22, y: 35, s: 6, c: '#FFB074', speed: 0.9, phase: 0.5 },
    { id: 2, x: 45, y: 70, s: 4, c: '#FFD188', speed: 1.2, phase: 1.8 },
    { id: 3, x: 72, y: 28, s: 5, c: '#FF8A00', speed: 0.7, phase: 2.3 },
    { id: 4, x: 82, y: 60, s: 7, c: '#38BDF8', speed: 1.0, phase: 3.1 },
    { id: 5, x: 30, y: 82, s: 5, c: '#FFC28A', speed: 0.8, phase: 4.0 },
    { id: 6, x: 62, y: 18, s: 4, c: '#FFE7D2', speed: 1.1, phase: 5.2 },
    { id: 7, x: 15, y: 55, s: 6, c: '#FF9E3B', speed: 0.95, phase: 6.0 },
    { id: 8, x: 88, y: 40, s: 5, c: '#38BDF8', speed: 0.75, phase: 7.1 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 5,
      }}
    >
      {/* =================================================================== */}
      {/* 1. WARM AMBER FLUID AURORAS & VOLUMETRIC GLOWS                      */}
      {/* =================================================================== */}
      {showAmbientGlow && (
        <>
          {/* Main Warm Amber Core behind Phone Stage */}
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '52%',
              width: '850px',
              height: '850px',
              borderRadius: '50%',
              background:
                warmthLevel === 'high'
                  ? 'radial-gradient(circle, rgba(255, 138, 0, 0.36) 0%, rgba(230, 81, 0, 0.20) 40%, rgba(255, 138, 0, 0) 72%)'
                  : 'radial-gradient(circle, rgba(255, 138, 0, 0.26) 0%, rgba(255, 138, 0, 0) 70%)',
              filter: 'blur(90px)',
              transform: `translate(${Math.sin(time * 0.9) * 45}px, ${Math.cos(time * 0.65) * 35}px)`,
              opacity: 0.95,
            }}
          />

          {/* Warm Peach & Honey Secondary Aurora behind Typography */}
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '12%',
              width: '780px',
              height: '780px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255, 176, 116, 0.24) 0%, rgba(217, 119, 6, 0.14) 45%, rgba(255, 138, 0, 0) 72%)',
              filter: 'blur(100px)',
              transform: `translate(${Math.cos(time * 0.75) * 50}px, ${Math.sin(time * 0.85) * 40}px)`,
              opacity: 0.9,
            }}
          />

          {/* Golden Sun Flare at Top Left */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: '20%',
              width: '650px',
              height: '650px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 209, 136, 0.22) 0%, rgba(255, 138, 0, 0.08) 50%, rgba(0,0,0,0) 70%)',
              filter: 'blur(85px)',
              transform: `translate(${Math.sin(time * 0.5) * 35}px, ${Math.cos(time * 0.8) * 30}px)`,
            }}
          />

          {/* High-tech Gemini Cyan Accent (Complementary Contrast) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '5%',
              width: '550px',
              height: '550px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0) 65%)',
              filter: 'blur(95px)',
              transform: `translate(${Math.sin(time * 1.1) * 30}px, ${Math.cos(time * 0.95) * 25}px)`,
            }}
          />
        </>
      )}

      {/* =================================================================== */}
      {/* 2. FLOATING GEMINI 4-POINTED STARS WITH ORGANIC FLUID PATHS         */}
      {/* =================================================================== */}
      <FloatingGeminiStar baseX={16} baseY={20} size={36} color="#FFD188" rotSpeed={0.9} driftSpeed={0.7} delay={0.2} />
      <FloatingGeminiStar baseX={48} baseY={10} size={28} color="#38BDF8" rotSpeed={-1.2} driftSpeed={0.9} delay={1.4} />
      <FloatingGeminiStar baseX={82} baseY={18} size={46} color="#FF8A00" rotSpeed={-0.85} driftSpeed={0.65} delay={2.1} />
      <FloatingGeminiStar baseX={90} baseY={66} size={32} color="#FFB074" rotSpeed={1.1} driftSpeed={0.8} delay={3.3} />
      <FloatingGeminiStar baseX={12} baseY={72} size={38} color="#FF8A00" rotSpeed={-0.75} driftSpeed={0.7} delay={4.2} />
      <FloatingGeminiStar baseX={62} baseY={86} size={30} color="#25D366" rotSpeed={0.8} driftSpeed={0.85} delay={5.1} />
      <FloatingGeminiStar baseX={38} baseY={88} size={26} color="#FFD188" rotSpeed={1.3} driftSpeed={0.9} delay={6.0} />

      {/* =================================================================== */}
      {/* 3. GEMINI AMBIENT DUST MOTES (Particles in continuous gentle drift) */}
      {/* =================================================================== */}
      {dustParticles.map((p) => {
        const floatY = (p.y - (time * p.speed * 8 + p.phase * 15)) % 100;
        const normalizedY = floatY < 0 ? floatY + 100 : floatY;
        const driftX = p.x + Math.sin(time * 1.5 + p.phase) * 3;
        const motePulse = Math.sin(time * 2.5 + p.phase);
        const moteOpacity = interpolate(motePulse, [-1, 1], [0.3, 0.85]);

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${driftX}%`,
              top: `${normalizedY}%`,
              width: `${p.s}px`,
              height: `${p.s}px`,
              borderRadius: '50%',
              backgroundColor: p.c,
              boxShadow: `0 0 10px ${p.c}`,
              opacity: moteOpacity,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </div>
  );
};
