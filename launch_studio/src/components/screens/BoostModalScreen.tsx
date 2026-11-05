import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors } from '../../theme/tokens';

export interface BoostModalScreenProps {
  buttonScale?: number;
  highlightButton?: boolean;
}

export const BoostModalScreen: React.FC<BoostModalScreenProps> = ({
  buttonScale = 1.0,
  highlightButton = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating star rotation & gentle shimmer
  const starRotation = Math.sin(frame * 0.08) * 8;
  const pulseGlow = highlightButton ? 1.0 + Math.sin(frame * 0.2) * 0.03 : 1.0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(90, 58, 31, 0.48)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        zIndex: 100,
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Modal Dialog Card */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          padding: '28px 22px 20px',
          boxShadow: '0 24px 60px rgba(90, 58, 31, 0.32), 0 0 0 1px rgba(255, 231, 210, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Top Floating Badge (Star + Paw) */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: '#FFF4E8',
            border: '2px solid #FFD3AD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(255, 138, 0, 0.22)',
            marginBottom: '16px',
            transform: `rotate(${starRotation}deg)`,
          }}
        >
          <span style={{ fontSize: '32px' }}>⭐</span>
        </div>

        {/* Modal Title */}
        <h3
          style={{
            fontFamily: "'Baloo 2', cursive, sans-serif",
            fontSize: '20px',
            fontWeight: 800,
            color: '#5A3A1F',
            lineHeight: 1.25,
            margin: '0 0 8px 0',
          }}
        >
          ¿Deseas impulsar la publicación para que esté en destacadas?
        </h3>

        {/* Link Ver Beneficios */}
        <div
          style={{
            fontSize: '13px',
            color: '#FF8A00',
            fontWeight: 700,
            textDecoration: 'underline',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          Ver beneficios de publicación destacada
        </div>

        {/* Price tag chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: '#FFF7ED',
            border: '1px solid #FFEDD5',
            color: '#C2410C',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '14px',
          }}
        >
          <span>🔥 Máxima difusión barrial</span>
          <span style={{ color: '#EA580C' }}>· $2.500 ARS</span>
        </div>

        {/* Primary CTA Button: ¡Sí, impulsar! */}
        <div
          id="btn-si-impulsar"
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '25px',
            backgroundColor: '#FF8A00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#FFFFFF',
            fontFamily: "'Baloo 2', cursive, sans-serif",
            fontWeight: 800,
            fontSize: '18px',
            boxShadow: highlightButton
              ? '0 12px 30px rgba(255, 138, 0, 0.50), 0 0 0 3px rgba(255, 138, 0, 0.3)'
              : '0 6px 18px rgba(255, 138, 0, 0.35)',
            transform: `scale(${buttonScale * pulseGlow})`,
            transition: 'transform 0.1s ease',
            cursor: 'pointer',
          }}
        >
          <span>¡Sí, impulsar!</span>
          <span style={{ fontSize: '18px' }}>✨</span>
        </div>

        {/* Secondary Link: Publicar sin destacar */}
        <div
          style={{
            fontSize: '14px',
            color: '#8D735C',
            fontWeight: 600,
            marginTop: '14px',
            cursor: 'pointer',
          }}
        >
          Publicar sin destacar
        </div>
      </div>
    </div>
  );
};
