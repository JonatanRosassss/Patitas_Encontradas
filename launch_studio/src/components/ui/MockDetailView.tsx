import React from 'react';
import { Img, staticFile } from 'remotion';
import { Colors, Typography, Radius, DetailMetrics } from '../../theme/tokens';

export interface MockDetailViewProps {
  status?: 'PERDIDO' | 'ENCONTRADO';
  name?: string;
  species?: string;
  breed?: string;
  reward?: string;
  location?: string;
  authorName?: string;
  isWhatsAppPressed?: boolean;
  activePhotoIndex?: number;
  showPayoffCelebration?: boolean;
}

export const MockDetailView: React.FC<MockDetailViewProps> = ({
  status = 'PERDIDO',
  name = 'Milo',
  species = 'Perro · Caniche Toy',
  reward = 'Recompensa: $15.000',
  location = 'Barrio Champagnat, Pilar',
  authorName = 'María González (Vecina de Pilar)',
  isWhatsAppPressed = false,
  activePhotoIndex = 0,
  showPayoffCelebration = false,
}) => {
  const isPerdido = status === 'PERDIDO';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: Colors.backgroundLight,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: Typography.fonts.body,
      }}
    >
      {/* Scrollable Content Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* 1. PetHeroCarousel */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '280px',
            backgroundColor: '#FFE7D2',
            borderBottomLeftRadius: `${DetailMetrics.heroBottomRadius}px`,
            borderBottomRightRadius: `${DetailMetrics.heroBottomRadius}px`,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(90, 58, 31, 0.12)',
          }}
        >
          {/* Hero Image */}
          <Img
            src={
              activePhotoIndex === 0
                ? staticFile('images/welcome_hero_3d.png')
                : staticFile('images/welcome_dog_badge.png')
            }
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Top Left Floating Back Button */}
          <div
            style={{
              position: 'absolute',
              top: '46px',
              left: '16px',
              width: `${DetailMetrics.floatingButtonSize}px`,
              height: `${DetailMetrics.floatingButtonSize}px`,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '18px',
              color: Colors.text,
              cursor: 'pointer',
            }}
          >
            ←
          </div>

          {/* Bottom Left Floating Status Pill */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              padding: '6px 14px',
              borderRadius: `${Radius.full}px`,
              backgroundColor: isPerdido
                ? 'rgba(230, 81, 0, 0.94)'
                : 'rgba(46, 125, 50, 0.94)',
              backdropFilter: 'blur(8px)',
              boxShadow: isPerdido
                ? '0 4px 12px rgba(230, 81, 0, 0.4)'
                : '0 4px 12px rgba(46, 125, 50, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: Colors.white,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: Typography.weights.extraBold,
                color: Colors.white,
                letterSpacing: '0.8px',
              }}
            >
              {isPerdido ? 'PERDIDO' : '¡ENCONTRADO!'}
            </span>
          </div>

          {/* Bottom Right Floating Share Button */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: `${DetailMetrics.floatingButtonSize}px`,
              height: `${DetailMetrics.floatingButtonSize}px`,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '18px',
              color: Colors.text,
            }}
          >
            ↗
          </div>

          {/* Center Pagination Dots */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 10px',
              borderRadius: '12px',
              backgroundColor: 'rgba(43, 26, 12, 0.35)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: activePhotoIndex === 0 ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: Colors.white,
                transition: 'all 0.2s ease',
              }}
            />
            <div
              style={{
                width: activePhotoIndex === 1 ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                transition: 'all 0.2s ease',
              }}
            />
          </div>
        </div>

        {/* 2. Pet Info Section */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Header Title + Reward Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <h1
              style={{
                margin: 0,
                fontFamily: Typography.fonts.display,
                fontSize: `${Typography.sizes.display}px`,
                fontWeight: Typography.weights.bold,
                color: Colors.text,
                lineHeight: '36px',
              }}
            >
              {name}
            </h1>

            {reward && (
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: `${Radius.sm}px`,
                  backgroundColor: Colors.rewardBg,
                  border: `1.5px solid ${Colors.rewardBorder}`,
                  color: Colors.reward,
                  fontSize: '13px',
                  fontWeight: Typography.weights.bold,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(230, 81, 0, 0.15)',
                }}
              >
                <span>🎁</span>
                <span>{reward}</span>
              </div>
            )}
          </div>

          {/* Subtitle & Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: Colors.textSecondary,
              fontWeight: Typography.weights.medium,
            }}
          >
            <span>🐾 {species}</span>
            <span>•</span>
            <span style={{ color: Colors.textMuted }}>🕒 Hace 15 min</span>
          </div>

          {/* 3. Location Section */}
          <div
            style={{
              marginTop: '4px',
              backgroundColor: Colors.card,
              borderRadius: `${Radius.lg}px`,
              padding: '12px 14px',
              border: `1px solid ${Colors.borderLight}`,
              boxShadow: '0 2px 10px rgba(90, 58, 31, 0.04)',
            }}
          >
            <div
              style={{
                fontFamily: Typography.fonts.display,
                fontSize: '14px',
                fontWeight: Typography.weights.bold,
                color: Colors.text,
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>📍 Última vez visto</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '11px',
                  color: Colors.primary,
                  fontWeight: Typography.weights.semiBold,
                }}
              >
                Ver en mapa
              </span>
            </div>

            <div style={{ fontSize: '12px', color: Colors.textSecondary, marginBottom: '8px' }}>
              {location}
            </div>

            {/* Embedded Mini Map Mock with Leaflet styling */}
            <div
              style={{
                width: '100%',
                height: '90px',
                borderRadius: `${Radius.md}px`,
                backgroundColor: '#E8EDE0',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #D5DEC7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Map grid lines simulation */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(#D5DEC7 1px, transparent 1px), linear-gradient(90deg, #D5DEC7 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  opacity: 0.7,
                }}
              />
              {/* Street road line */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#FFFFFF',
                  transform: 'rotate(-15deg)',
                  boxShadow: '0 0 2px rgba(0,0,0,0.15)',
                }}
              />
              {/* Center Location Pin */}
              <div
                style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: Colors.primary,
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 8px rgba(90, 58, 31, 0.35)',
                  zIndex: 2,
                }}
              >
                <span style={{ fontSize: '14px' }}>🐾</span>
              </div>
            </div>
          </div>

          {/* 4. Author Contact Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: Colors.card,
              borderRadius: `${Radius.lg}px`,
              padding: '12px 14px',
              border: `1px solid ${Colors.borderLight}`,
              boxShadow: '0 2px 10px rgba(90, 58, 31, 0.04)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: Colors.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: Typography.weights.bold,
                color: Colors.text,
              }}
            >
              MG
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: Typography.weights.bold, color: Colors.text }}>
                {authorName}
              </div>
              <div style={{ fontSize: '11px', color: Colors.textSecondary }}>
                Contacto por WhatsApp disponible
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. PetContactBar (Elevated Bottom Bar with WhatsApp 1-Tap CTA) */}
      <div
        style={{
          width: '100%',
          backgroundColor: Colors.card,
          borderTop: `1px solid ${Colors.borderLight}`,
          padding: '12px 16px 24px 16px',
          boxSizing: 'border-box',
          boxShadow: '0 -4px 16px rgba(90, 58, 31, 0.06)',
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: '100%',
            height: `${DetailMetrics.contactButtonHeight}px`,
            borderRadius: `${Radius.full}px`,
            backgroundColor: isWhatsAppPressed
              ? Colors.whatsappPressed
              : Colors.whatsapp,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: isWhatsAppPressed
              ? '0 2px 6px rgba(37, 211, 102, 0.4)'
              : '0 6px 20px rgba(37, 211, 102, 0.35)',
            transform: isWhatsAppPressed ? 'scale(0.97)' : 'scale(1.0)',
            transition: 'all 0.15s ease',
            cursor: 'pointer',
          }}
        >
          {/* WhatsApp Brand Logo Icon */}
          <span style={{ fontSize: '22px' }}>💬</span>
          <span
            style={{
              fontFamily: Typography.fonts.body,
              fontSize: '16px',
              fontWeight: Typography.weights.bold,
              color: Colors.white,
              letterSpacing: '0.5px',
            }}
          >
            CONTACTAR POR WHATSAPP
          </span>
        </div>
      </div>

      {/* Celebration Payoff Particles Overlay */}
      {showPayoffCelebration && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 40%, rgba(255, 138, 0, 0.25) 0%, rgba(46, 125, 50, 0.2) 60%, rgba(0, 0, 0, 0) 80%)',
            pointerEvents: 'none',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '16px 32px',
              borderRadius: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: `2px solid ${Colors.primary}`,
              boxShadow: '0 12px 40px rgba(255, 138, 0, 0.5)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '36px' }}>🎉 🐾 ❤️</div>
            <div
              style={{
                fontFamily: Typography.fonts.display,
                fontSize: '28px',
                fontWeight: Typography.weights.extraBold,
                color: Colors.primary,
                margin: '4px 0',
              }}
            >
              ¡REENCUENTRO EXITOSO!
            </div>
            <div style={{ fontSize: '13px', color: Colors.textSecondary }}>
              Milo ya está en casa con su familia en Pilar
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
