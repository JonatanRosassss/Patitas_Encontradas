import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors } from '../../theme/tokens';

export interface DarkVoidStageProps {
  children?: React.ReactNode;
  cameraScale?: number;
  cameraTranslateX?: number;
  cameraTranslateY?: number;
  cameraRotateZ?: number;
  glowIntensity?: number;
  showBokeh?: boolean;
}

/**
 * Procedural Bokeh Particle generator
 */
interface Particle {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  blur: number;
}

const BOKEH_PARTICLES: Particle[] = [
  { id: 1, x: 15, y: 20, size: 140, speed: 0.03, drift: 25, opacity: 0.12, blur: 30 },
  { id: 2, x: 80, y: 15, size: 220, speed: 0.02, drift: -30, opacity: 0.15, blur: 45 },
  { id: 3, x: 25, y: 75, size: 180, speed: 0.025, drift: 20, opacity: 0.10, blur: 35 },
  { id: 4, x: 70, y: 80, size: 160, speed: 0.035, drift: -15, opacity: 0.14, blur: 25 },
  { id: 5, x: 50, y: 35, size: 90, speed: 0.04, drift: 10, opacity: 0.18, blur: 15 },
  { id: 6, x: 88, y: 55, size: 120, speed: 0.028, drift: -20, opacity: 0.11, blur: 28 },
  { id: 7, x: 10, y: 50, size: 110, speed: 0.032, drift: 18, opacity: 0.09, blur: 22 },
];

export const DarkVoidStage: React.FC<DarkVoidStageProps> = ({
  children,
  cameraScale = 1.0,
  cameraTranslateX = 0,
  cameraTranslateY = 0,
  cameraRotateZ = 0,
  glowIntensity = 1.0,
  showBokeh = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Breathing volumetric orange rim light in center stage
  const pulse = interpolate(
    Math.sin(time * 1.6),
    [-1, 1],
    [0.15, 0.28],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) * glowIntensity;

  const glowRadius = interpolate(
    Math.sin(time * 1.2),
    [-1, 1],
    [450, 600],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: Colors.darkVoidBg,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1400px',
      }}
    >
      {/* 1. Base Subtle Radial Gradient (Dark Void) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(255, 138, 0, 0.14) 0%, rgba(26, 22, 18, 0.6) 50%, rgba(15, 13, 11, 1) 90%)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. Dynamic Volumetric Orange Rim Glow Sphere */}
      <div
        style={{
          position: 'absolute',
          width: glowRadius * 2,
          height: glowRadius * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 138, 0, ${pulse}) 0%, rgba(255, 138, 0, 0.05) 50%, rgba(255, 138, 0, 0) 75%)`,
          pointerEvents: 'none',
          filter: 'blur(50px)',
          left: '50%',
          top: '46%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      />

      {/* 3. Floating Macro Bokeh Particles */}
      {showBokeh &&
        BOKEH_PARTICLES.map((p) => {
          const offsetY = Math.sin(time * p.speed * 2 * Math.PI) * 40;
          const offsetX = Math.cos(time * p.speed * 2 * Math.PI) * p.drift;
          const currentOpacity = p.opacity * (0.8 + 0.2 * Math.sin(time * 2 + p.id));

          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `calc(${p.x}% + ${offsetX}px)`,
                top: `calc(${p.y}% + ${offsetY}px)`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(255, 194, 138, ${currentOpacity}) 0%, rgba(255, 138, 0, ${currentOpacity * 0.4}) 60%, rgba(255, 138, 0, 0) 80%)`,
                filter: `blur(${p.blur}px)`,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
          );
        })}

      {/* 4. Stage Camera Wrapper with Dolly / Drift */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transform: `scale(${cameraScale}) translate3d(${cameraTranslateX}px, ${cameraTranslateY}px, 0px) rotate(${cameraRotateZ}deg)`,
          transformOrigin: 'center center',
          transition: 'none',
        }}
      >
        {children}
      </div>

      {/* 5. Subtle Vignette Edge Guard */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 160px rgba(0, 0, 0, 0.85)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />
    </AbsoluteFill>
  );
};
