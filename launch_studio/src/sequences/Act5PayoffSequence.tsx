import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DarkVoidStage } from '../components/stage/DarkVoidStage';
import { PhoneChassis } from '../components/stage/PhoneChassis';
import { MockDetailView } from '../components/ui/MockDetailView';
import { Colors } from '../theme/tokens';

export interface Act5PayoffSequenceProps {
  // Configurable options
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'heart';
}

const CONFETTI_LIST: Confetti[] = [
  { id: 1, x: 50, y: 40, vx: -120, vy: -140, color: '#FFD700', size: 14, shape: 'heart' },
  { id: 2, x: 50, y: 40, vx: 110, vy: -160, color: '#FF8A00', size: 12, shape: 'circle' },
  { id: 3, x: 50, y: 40, vx: -80, vy: -190, color: '#25D366', size: 10, shape: 'square' },
  { id: 4, x: 50, y: 40, vx: 70, vy: -180, color: '#FFE7D2', size: 14, shape: 'heart' },
  { id: 5, x: 50, y: 40, vx: -150, vy: -90, color: '#FF8A00', size: 11, shape: 'circle' },
  { id: 6, x: 50, y: 40, vx: 140, vy: -110, color: '#FFD700', size: 13, shape: 'square' },
  { id: 7, x: 50, y: 40, vx: -40, vy: -210, color: '#25D366', size: 15, shape: 'heart' },
  { id: 8, x: 50, y: 40, vx: 45, vy: -220, color: '#FF8A00', size: 12, shape: 'circle' },
  { id: 9, x: 50, y: 40, vx: -95, vy: -130, color: '#FFD700', size: 10, shape: 'square' },
  { id: 10, x: 50, y: 40, vx: 105, vy: -140, color: '#FFE7D2', size: 12, shape: 'heart' },
];

export const Act5PayoffSequence: React.FC<Act5PayoffSequenceProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Payoff mutation happens at frame 60 (1.0s into Act 5 after suspense breath)
  const isResolved = frame >= 60;

  // Spring for badge mutation & phone front centering
  const payoffSpring = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
      mass: 0.8,
    },
  });

  // Camera drift from slight oblique to heroic frontal wide
  const rotateX = interpolate(payoffSpring, [0, 1], [18, 6]);
  const rotateY = interpolate(payoffSpring, [0, 1], [-10, 0]);
  const rotateZ = interpolate(payoffSpring, [0, 1], [4, 0]);

  const cameraScale = interpolate(payoffSpring, [0, 1], [1.10, 1.05]);

  // Massive warm celebratory glow bloom
  const glowBloom = interpolate(
    frame,
    [40, 60, 120, 600],
    [0.8, 2.2, 1.8, 1.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <DarkVoidStage
      cameraScale={cameraScale}
      glowIntensity={glowBloom}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PhoneChassis
          rotateX={rotateX}
          rotateY={rotateY}
          rotateZ={rotateZ}
          scale={1.0}
        >
          <MockDetailView
            status={isResolved ? 'ENCONTRADO' : 'PERDIDO'}
            name="Milo"
            species="Perro · Caniche Toy (Macho)"
            reward={isResolved ? '¡Recompensa Entregada!' : 'Recompensa: $15.000'}
            location="Barrio Champagnat, Pilar"
            showPayoffCelebration={isResolved && frame < 360}
          />
        </PhoneChassis>

        {/* Celebratory Confetti & Particle Sparks in 3D Space */}
        {isResolved && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            {CONFETTI_LIST.map((c) => {
              const relT = (frame - 60) / fps;
              const posX = c.x + (c.vx * relT * 0.4);
              const posY = c.y + (c.vy * relT * 0.4) + (0.5 * 300 * relT * relT * 0.4); // Gravity
              const rot = relT * 280 * (c.id % 2 === 0 ? 1 : -1);
              const op = interpolate(frame - 60, [0, 180], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              if (op <= 0) return null;

              return (
                <div
                  key={c.id}
                  style={{
                    position: 'absolute',
                    left: `${posX}%`,
                    top: `${posY}%`,
                    width: `${c.size}px`,
                    height: `${c.size}px`,
                    backgroundColor: c.color,
                    borderRadius: c.shape === 'circle' ? '50%' : c.shape === 'heart' ? '4px' : '2px',
                    transform: `translate(-50%, -50%) rotate(${rot}deg)`,
                    opacity: op,
                    boxShadow: `0 0 10px ${c.color}`,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </DarkVoidStage>
  );
};
