import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';

export interface SightingNotificationBannerProps {
  scale?: number;
  highlight?: boolean;
}

export const SightingNotificationBanner: React.FC<SightingNotificationBannerProps> = ({
  scale = 1.0,
  highlight = false,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        top: '52px',
        left: '14px',
        right: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '12px 14px',
        boxShadow: highlight
          ? '0 16px 36px rgba(90, 58, 31, 0.22), 0 0 0 2px #FF8A00'
          : '0 12px 30px rgba(90, 58, 31, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transform: `scale(${scale})`,
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        cursor: 'pointer',
      }}
    >
      {/* App Badge Icon */}
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: '#FFE7D2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '1.5px solid #FF8A00',
          overflow: 'hidden',
        }}
      >
        <img
          src={staticFile('images/welcome_dog_badge.png')}
          alt="Milo"
          style={{ width: '80%', height: '80%', objectFit: 'contain' }}
        />
      </div>

      {/* Notification Text Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#FF8A00',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
            }}
          >
            PATITAS ENCONTRADAS · Ahora
          </span>
          <span style={{ fontSize: '12px' }}>🚨</span>
        </div>

        <span
          style={{
            fontFamily: "'Baloo 2', cursive, sans-serif",
            fontSize: '14px',
            fontWeight: 800,
            color: '#5A3A1F',
            lineHeight: 1.2,
            marginTop: '2px',
          }}
        >
          ¡Avistamiento de Milo reportado!
        </span>

        <span
          style={{
            fontSize: '12px',
            color: '#8D735C',
            fontWeight: 600,
            lineHeight: 1.2,
            marginTop: '1px',
          }}
        >
          Un vecino vio a tu perro cerca de Panamericana Km 50.
        </span>
      </div>
    </div>
  );
};
