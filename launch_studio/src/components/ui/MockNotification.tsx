import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors, Typography, Radius } from '../../theme/tokens';

export interface MockNotificationProps {
  startFrame?: number;
  title?: string;
  subtitle?: string;
  location?: string;
  timeAgo?: string;
  isUrgent?: boolean;
}

export const MockNotification: React.FC<MockNotificationProps> = ({
  startFrame = 45,
  title = '🚨 ALERTA BARRIAL: MASCOTA EXTRAVIADA',
  subtitle = 'Se busca a Milo (Caniche Toy · Macho). Recompensa comunitaria destacada.',
  location = 'Barrio Champagnat, Pilar',
  timeAgo = 'Ahora',
  isUrgent = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for smooth natural drop
  const dropProgress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 160,
      mass: 0.8,
    },
  });

  const translateY = interpolate(dropProgress, [0, 1], [-180, 0]);
  const opacity = interpolate(dropProgress, [0, 0.4, 1], [0, 0.8, 1]);
  const scale = interpolate(dropProgress, [0, 0.8, 1], [0.92, 1.02, 1.0]);

  // Subtle warning pulse on urgent border
  const borderPulse = interpolate(
    Math.sin((frame / fps) * 4),
    [-1, 1],
    [0.3, 0.85]
  );

  if (frame < startFrame) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '56px',
        left: '16px',
        right: '16px',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: `${Radius.lg}px`,
        padding: '16px',
        border: `1.5px solid rgba(255, 138, 0, ${borderPulse})`,
        boxShadow: `
          0 12px 32px rgba(90, 58, 31, 0.18),
          0 4px 12px rgba(255, 138, 0, 0.25)
        `,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontFamily: Typography.fonts.body,
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              backgroundColor: Colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Img
              src={staticFile('images/welcome_dog_badge.png')}
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            />
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: Typography.weights.bold,
              letterSpacing: '0.8px',
              color: Colors.textSecondary,
              textTransform: 'uppercase',
            }}
          >
            Patitas Encontradas · Alerta
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            color: Colors.textMuted,
            fontWeight: Typography.weights.medium,
          }}
        >
          {timeAgo}
        </span>
      </div>

      {/* Main Title */}
      <div
        style={{
          fontFamily: Typography.fonts.display,
          fontSize: '15px',
          fontWeight: Typography.weights.bold,
          color: isUrgent ? Colors.statusPerdido : Colors.text,
          lineHeight: '19px',
        }}
      >
        {title}
      </div>

      {/* Subtitle / Description */}
      <div
        style={{
          fontSize: '13px',
          color: Colors.text,
          lineHeight: '17px',
          fontWeight: Typography.weights.regular,
        }}
      >
        {subtitle}
      </div>

      {/* Footer Location Pin */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '2px',
        }}
      >
        <span style={{ fontSize: '12px' }}>📍</span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: Typography.weights.semiBold,
            color: Colors.primary,
          }}
        >
          {location}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: Colors.statusPerdidoBg,
            color: Colors.statusPerdido,
            fontSize: '11px',
            fontWeight: Typography.weights.bold,
          }}
        >
          URGENTE
        </span>
      </div>
    </div>
  );
};
