import React from 'react';
import { interpolate, useCurrentFrame, staticFile } from 'remotion';
import { LeafletRadarScene } from '../map/LeafletRadarScene';
import { Colors } from '../../theme/tokens';

export interface SightingResolutionScreenProps {
  buttonScale?: number;
  highlightButton?: boolean;
}

export const SightingResolutionScreen: React.FC<SightingResolutionScreenProps> = ({
  buttonScale = 1.0,
  highlightButton = false,
}) => {
  const frame = useCurrentFrame();

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

      {/* 2. Top Header */}
      <div
        style={{
          padding: '6px 20px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8DFD8',
              fontSize: '13px',
              fontWeight: 700,
              color: '#5A3A1F',
            }}
          >
            ← Volver
          </div>
          <span
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontSize: '20px',
              fontWeight: 800,
              color: '#5A3A1F',
            }}
          >
            Avistamiento Barrial
          </span>
        </div>

        <span
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: '#FFDBC8',
            color: '#E65100',
            fontWeight: 800,
            fontSize: '12px',
          }}
        >
          🚨 EN VIVO
        </span>
      </div>

      {/* 3. Interactive Map View with Radar in Pilar */}
      <div
        style={{
          height: '380px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          margin: '0 16px',
          boxShadow: '0 8px 24px rgba(90, 58, 31, 0.10)',
          border: '1.5px solid #E8DFD8',
        }}
      >
        <LeafletRadarScene
          radarProgress={1.0}
          zoomScale={1.12}
          showMarkerPin={true}
          activeLandmark="Panamericana Km 50, Pilar"
        />

        {/* Live Radar Badge overlay */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              boxShadow: '0 0 8px #22C55E',
            }}
          />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>
            Avistado hace 4 min · Del Viso / Km 50
          </span>
        </div>
      </div>

      {/* 4. Sighting Details Card */}
      <div
        style={{
          flex: 1,
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 6px 18px rgba(90, 58, 31, 0.06)',
            border: '1px solid #F0E8E2',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              backgroundColor: '#FFE7D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={staticFile('images/welcome_dog_badge.png')}
              alt="Milo"
              style={{ width: '85%', height: '85%', objectFit: 'contain' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: "'Baloo 2', cursive, sans-serif",
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#5A3A1F',
                }}
              >
                Milo fue reconocido
              </span>
              <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: 800 }}>
                100% Coincidencia
              </span>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: '#8D735C',
                margin: '2px 0 0',
                lineHeight: 1.3,
              }}
            >
              "Está con collar rojo, tranquilo al lado de la estación de servicio."
            </p>
          </div>
        </div>

        {/* 5. Resolution CTA: Marcar como encontrado */}
        <div
          id="btn-marcar-encontrado"
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: '#16A34A', // Emerald success green
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: highlightButton
              ? '0 12px 30px rgba(22, 163, 74, 0.45), 0 0 0 3px rgba(34, 197, 94, 0.3)'
              : '0 6px 18px rgba(22, 163, 74, 0.35)',
            transform: `scale(${buttonScale})`,
            transition: 'transform 0.1s ease',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          <span style={{ fontSize: '20px', color: '#FFFFFF' }}>✅</span>
          <span
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontSize: '18px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.4px',
            }}
          >
            MARCAR COMO ENCONTRADO
          </span>
        </div>
      </div>
    </div>
  );
};
