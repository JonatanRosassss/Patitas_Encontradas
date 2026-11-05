import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Colors } from '../../theme/tokens';

export interface FoundCelebrationPayoffProps {
  progress?: number;
}

export const FoundCelebrationPayoff: React.FC<FoundCelebrationPayoffProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Confetti particles generator
  const confettiCount = 36;
  const confetti = Array.from({ length: confettiCount }).map((_, i) => {
    const angle = (i / confettiCount) * Math.PI * 2;
    const speed = 120 + ((i * 37) % 180);
    const x = Math.cos(angle) * speed * Math.min(time * 1.5, 1.2);
    const y = Math.sin(angle) * speed * Math.min(time * 1.5, 1.2) + (time * 60);
    const rotation = (i * 45) + time * 360;
    const colors = ['#22C55E', '#FF8A00', '#F59E0B', '#3B82F6', '#EC4899'];
    const color = colors[i % colors.length];
    const size = 6 + (i % 6);
    return { x, y, rotation, color, size };
  });

  // Trophy & badge spring
  const trophySpring = spring({ frame: frame, fps, config: { damping: 12, stiffness: 140 } });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 1. Status Bar */}
      <div
        style={{
          height: '44px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: 700,
          color: '#1A1612',
          paddingTop: '6px',
        }}
      >
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px' }}>􀙇</span>
          <span style={{ fontSize: '11px' }}>􀛨</span>
        </div>
      </div>

      {/* Confetti Particles Layer */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1px',
          height: '1px',
          pointerEvents: 'none',
          zIndex: 80,
        }}
      >
        {confetti.map((c, idx) => (
          <div
            key={`confetti-${idx}`}
            style={{
              position: 'absolute',
              width: `${c.size}px`,
              height: `${c.size * 1.6}px`,
              borderRadius: '2px',
              backgroundColor: c.color,
              transform: `translate(${c.x}px, ${c.y}px) rotate(${c.rotation}deg)`,
              opacity: interpolate(time, [0, 0.2, 1.8, 2.5], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          />
        ))}
      </div>

      {/* 2. Main Content Card */}
      <div
        style={{
          flex: 1,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          zIndex: 50,
        }}
      >
        {/* Success Icon Circle */}
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            border: '4px solid #22C55E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 40px rgba(34, 197, 94, 0.35)',
            transform: `scale(${trophySpring})`,
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '48px' }}>🎉</span>
        </div>

        {/* State Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '20px',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            fontSize: '14px',
            fontWeight: 800,
            marginBottom: '12px',
            border: '1.5px solid #86EFAC',
          }}
        >
          <span>💚</span>
          <span>¡ENCONTRADO Y EN CASA!</span>
        </div>

        {/* Main Title */}
        <h2
          style={{
            fontFamily: "'Baloo 2', cursive, sans-serif",
            fontSize: '28px',
            fontWeight: 800,
            color: '#5A3A1F',
            lineHeight: 1.15,
            margin: '0 0 8px 0',
          }}
        >
          ¡Milo regresó con su familia!
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '14px',
            color: '#8D735C',
            lineHeight: 1.4,
            maxWidth: '280px',
            margin: '0 0 24px 0',
          }}
        >
          Gracias al aviso inmediato de la red comunitaria en Del Viso, Pilar.
        </p>

        {/* Milo's Photo with Green Ring */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: '#FFE7D2',
            border: '3px solid #22C55E',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(90, 58, 31, 0.12)',
            marginBottom: '20px',
          }}
        >
          <img
            src={staticFile('images/welcome_dog_badge.png')}
            alt="Milo"
            style={{ width: '85%', height: '85%', objectFit: 'contain' }}
          />
        </div>

        {/* Community Stat Pill */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 18px',
            boxShadow: '0 6px 20px rgba(90, 58, 31, 0.08)',
            border: '1px solid #F0E8E2',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FFE7D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            ⏱️
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#5A3A1F' }}>
              Reencuentro en menos de 2 horas
            </div>
            <div style={{ fontSize: '11px', color: '#8D735C' }}>
              Alerta destacada alcanzó a 1.420 vecinos en Pilar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
