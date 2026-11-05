import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';

export const FinalHeroLockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const logoSpring = spring({ frame: frame, fps, config: { damping: 13, stiffness: 120 } });
  const textSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 130 } });
  const cardsSpring = spring({ frame: frame - 24, fps, config: { damping: 14, stiffness: 140 } });
  const ctaSpring = spring({ frame: frame - 36, fps, config: { damping: 14, stiffness: 140 } });

  const floatY = Math.sin(time * 0.8) * 6;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        textAlign: 'center',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Ambient Warm Gradient Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 138, 0, 0.14) 0%, rgba(255, 231, 210, 0.05) 55%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* 1. 3D App Icon / Badge */}
      <div
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '40px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 24px 60px rgba(255, 138, 0, 0.28), 0 0 0 3px rgba(255, 138, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${floatY}px) scale(${logoSpring})`,
          marginBottom: '24px',
          overflow: 'hidden',
        }}
      >
        <img
          src={staticFile('images/welcome_dog_badge.png')}
          alt="Patitas Encontradas Logo"
          style={{ width: '85%', height: '85%', objectFit: 'contain' }}
        />
      </div>

      {/* 2. Brand Name & Slogan */}
      <div
        style={{
          transform: `scale(${textSpring})`,
          opacity: interpolate(textSpring, [0, 1], [0, 1]),
          marginBottom: '20px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Baloo 2', cursive, sans-serif",
            fontSize: '54px',
            fontWeight: 800,
            color: '#5A3A1F',
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Patitas <span style={{ color: '#FF8A00' }}>Encontradas</span>
        </h1>
        <p
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#7C5C43',
            margin: '8px 0 0',
          }}
        >
          La red barrial colaborativa de rescate de mascotas
        </p>
      </div>

      {/* 3. High-Impact Indicators & Co-Branding Cards */}
      <div
        style={{
          transform: `scale(${cardsSpring})`,
          opacity: interpolate(cardsSpring, [0, 1], [0, 1]),
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            padding: '12px 24px',
            borderRadius: '18px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #FFD3AD',
            boxShadow: '0 8px 24px rgba(90, 58, 31, 0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#5A3A1F',
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: '20px' }}>⏱️</span>
          <span><strong>73%</strong> de reencuentros en menos de 48 hs</span>
        </div>

        <div
          style={{
            padding: '12px 24px',
            borderRadius: '18px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E8DFD8',
            boxShadow: '0 8px 24px rgba(90, 58, 31, 0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#5A3A1F',
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: '20px' }}>🏛️</span>
          <span>En articulación con el <strong>Municipio de Pilar</strong></span>
        </div>
      </div>

      {/* 4. App Store Downloads & CTA */}
      <div
        style={{
          transform: `scale(${ctaSpring})`,
          opacity: interpolate(ctaSpring, [0, 1], [0, 1]),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '14px' }}>
          <div
            style={{
              padding: '12px 26px',
              borderRadius: '16px',
              backgroundColor: '#1E1712',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px',
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.16)',
            }}
          >
            <span style={{ fontSize: '18px' }}>▶</span>
            <span>Google Play</span>
          </div>
          <div
            style={{
              padding: '12px 26px',
              borderRadius: '16px',
              backgroundColor: '#1E1712',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px',
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.16)',
            }}
          >
            <span style={{ fontSize: '18px' }}></span>
            <span>App Store</span>
          </div>
        </div>

        <div
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#FF8A00',
            letterSpacing: '0.3px',
          }}
        >
          ✨ www.patitasencontradas.pilar.gob.ar · 100% Solidaria y Gratuita
        </div>
      </div>
    </div>
  );
};
