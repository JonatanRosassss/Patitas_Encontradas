import React from 'react';
import { interpolate, useCurrentFrame, staticFile } from 'remotion';
import { Colors } from '../../theme/tokens';

export interface RealHomeScreenProps {
  publishButtonScale?: number;
  highlightPublishButton?: boolean;
}

export const RealHomeScreen: React.FC<RealHomeScreenProps> = ({
  publishButtonScale = 1.0,
  highlightPublishButton = false,
}) => {
  const frame = useCurrentFrame();

  // Subtle button pulse if highlighted
  const pulse = highlightPublishButton
    ? 1.0 + Math.sin(frame * 0.2) * 0.04
    : 1.0;

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

      {/* 2. App Top Header (Greeting + Location + Bell) */}
      <div
        style={{
          padding: '12px 20px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontSize: '22px',
              fontWeight: 800,
              color: '#5A3A1F',
              lineHeight: 1.2,
            }}
          >
            ¡Hola, Martín! 👋
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              color: '#8D735C',
              fontWeight: 600,
              marginTop: '2px',
            }}
          >
            <span>📍</span>
            <span>Del Viso, Pilar</span>
            <span style={{ fontSize: '10px' }}>▼</span>
          </div>
        </div>

        {/* Bell Button */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(90, 58, 31, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '18px' }}>🔔</span>
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#FF8A00',
              border: '2px solid #FFFFFF',
            }}
          />
        </div>
      </div>

      {/* 3. HERO CALL-TO-ACTION BUTTON (+ PUBLICAR MASCOTA) */}
      <div style={{ padding: '10px 20px 14px' }}>
        <div
          id="btn-publicar-mascota"
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: '#FF8A00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: highlightPublishButton
              ? '0 10px 28px rgba(255, 138, 0, 0.45), 0 0 0 3px rgba(255, 138, 0, 0.25)'
              : '0 6px 18px rgba(255, 138, 0, 0.32)',
            transform: `scale(${publishButtonScale * pulse})`,
            transition: 'transform 0.1s ease',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF8A00',
              fontWeight: 900,
              fontSize: '16px',
            }}
          >
            +
          </div>
          <span
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontSize: '17px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.4px',
            }}
          >
            PUBLICAR MASCOTA
          </span>
        </div>
      </div>

      {/* 4. Filter Tabs Row */}
      <div
        style={{
          padding: '0 20px 14px',
          display: 'flex',
          gap: '8px',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            padding: '7px 16px',
            borderRadius: '20px',
            backgroundColor: '#FF8A00',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '13px',
          }}
        >
          Todas
        </div>
        <div
          style={{
            padding: '7px 14px',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            color: '#5A3A1F',
            fontWeight: 700,
            fontSize: '13px',
            border: '1px solid #E8DFD8',
          }}
        >
          🚨 Perdidas
        </div>
        <div
          style={{
            padding: '7px 14px',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            color: '#5A3A1F',
            fontWeight: 700,
            fontSize: '13px',
            border: '1px solid #E8DFD8',
          }}
        >
          🐾 Encontradas
        </div>
      </div>

      {/* 5. Real Pet Cards Feed */}
      <div
        style={{
          flex: 1,
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          overflow: 'hidden',
        }}
      >
        {/* Card 1: Maxi */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '14px',
            boxShadow: '0 6px 18px rgba(90, 58, 31, 0.07)',
            border: '1px solid #F0E8E2',
            display: 'flex',
            gap: '14px',
          }}
        >
          {/* Pet Photo */}
          <div
            style={{
              width: '94px',
              height: '94px',
              borderRadius: '16px',
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
              alt="Maxi"
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
            />
          </div>

          {/* Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span
                style={{
                  fontFamily: "'Baloo 2', cursive, sans-serif",
                  fontSize: '19px',
                  fontWeight: 800,
                  color: '#5A3A1F',
                  lineHeight: 1.1,
                }}
              >
                Maxi
              </span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: '10px',
                  backgroundColor: '#FFDBC8',
                  color: '#E65100',
                  fontWeight: 800,
                  fontSize: '11px',
                }}
              >
                PERDIDO
              </span>
            </div>

            <span style={{ fontSize: '13px', color: '#8D735C', marginTop: '2px', fontWeight: 500 }}>
              Perro mestizo · Macho
            </span>
            <span style={{ fontSize: '12px', color: '#B5A496', marginTop: '2px' }}>
              📍 Hace 2h · Del Viso, Pilar
            </span>

            {/* Reward Badge */}
            <div
              style={{
                marginTop: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '8px',
                backgroundColor: '#FFF1E4',
                color: '#E65100',
                fontSize: '12px',
                fontWeight: 800,
                alignSelf: 'flex-start',
                border: '1px solid #FFD3AD',
              }}
            >
              <span>💰</span>
              <span>Recompensa $50.000</span>
            </div>
          </div>
        </div>

        {/* Card 2: Sol */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '14px',
            boxShadow: '0 6px 18px rgba(90, 58, 31, 0.07)',
            border: '1px solid #F0E8E2',
            display: 'flex',
            gap: '14px',
            opacity: 0.9,
          }}
        >
          <div
            style={{
              width: '94px',
              height: '94px',
              borderRadius: '16px',
              backgroundColor: '#E8F5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '38px',
              flexShrink: 0,
            }}
          >
            🐱
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span
                style={{
                  fontFamily: "'Baloo 2', cursive, sans-serif",
                  fontSize: '19px',
                  fontWeight: 800,
                  color: '#5A3A1F',
                  lineHeight: 1.1,
                }}
              >
                Sol
              </span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: '10px',
                  backgroundColor: '#FFE7D2',
                  color: '#FF8A00',
                  fontWeight: 800,
                  fontSize: '11px',
                }}
              >
                ENCONTRADO
              </span>
            </div>
            <span style={{ fontSize: '13px', color: '#8D735C', marginTop: '2px', fontWeight: 500 }}>
              Gato Siamés · Hembra
            </span>
            <span style={{ fontSize: '12px', color: '#B5A496', marginTop: '2px' }}>
              📍 Hace 5h · B° Champagnat
            </span>
          </div>
        </div>
      </div>

      {/* 6. Bottom Navigation Bar */}
      <div
        style={{
          height: '68px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #EFE8E1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: '8px',
          boxShadow: '0 -4px 16px rgba(90, 58, 31, 0.04)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#FF8A00' }}>
          <span style={{ fontSize: '20px' }}>🐾</span>
          <span style={{ fontSize: '11px', fontWeight: 700 }}>Inicio</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#B5A496' }}>
          <span style={{ fontSize: '20px' }}>🗺️</span>
          <span style={{ fontSize: '11px', fontWeight: 600 }}>Mapa</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#B5A496' }}>
          <span style={{ fontSize: '20px' }}>❤️</span>
          <span style={{ fontSize: '11px', fontWeight: 600 }}>Guardados</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#B5A496' }}>
          <span style={{ fontSize: '20px' }}>👤</span>
          <span style={{ fontSize: '11px', fontWeight: 600 }}>Perfil</span>
        </div>
      </div>
    </div>
  );
};
