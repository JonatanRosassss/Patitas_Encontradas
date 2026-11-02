import React from 'react';
import { Img, staticFile } from 'remotion';
import { Colors, Typography, Radius } from '../../theme/tokens';

export interface MockPetCardProps {
  id?: string;
  name?: string;
  species?: string;
  breed?: string;
  status?: 'PERDIDO' | 'ENCONTRADO' | 'ADOPCION';
  reward?: string;
  location?: string;
  timeAgo?: string;
  isHighlighted?: boolean;
  scale?: number;
}

export const MockPetCard: React.FC<MockPetCardProps> = ({
  name = 'Milo',
  species = 'Caniche Toy · Macho',
  status = 'PERDIDO',
  reward = '$15.000',
  location = 'Barrio Champagnat, Pilar',
  timeAgo = 'Hace 15 min',
  isHighlighted = false,
  scale = 1.0,
}) => {
  const isPerdido = status === 'PERDIDO';
  const isEncontrado = status === 'ENCONTRADO';

  const statusBg = isPerdido
    ? Colors.statusPerdidoBg
    : isEncontrado
    ? Colors.statusEncontradoBg
    : Colors.statusAdopcionBg;

  const statusTextColor = isPerdido
    ? Colors.statusPerdido
    : isEncontrado
    ? Colors.statusEncontrado
    : Colors.statusAdopcion;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '120px',
        backgroundColor: Colors.card,
        borderRadius: `${Radius.lg}px`,
        padding: '12px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: isHighlighted
          ? `0 8px 24px rgba(255, 138, 0, 0.28), 0 0 0 2px ${Colors.primary}`
          : '0 4px 16px rgba(90, 58, 31, 0.08)',
        border: `1px solid ${isHighlighted ? Colors.primary : Colors.borderLight}`,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        fontFamily: Typography.fonts.body,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left Thumbnail Container */}
      <div
        style={{
          width: '95px',
          height: '95px',
          borderRadius: `${Radius.md}px`,
          backgroundColor: Colors.accent,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <Img
          src={staticFile('images/welcome_dog_badge.png')}
          style={{
            width: '85px',
            height: '85px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Right Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '95px',
          overflow: 'hidden',
        }}
      >
        {/* Top Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '3px 8px',
              borderRadius: `${Radius.sm}px`,
              backgroundColor: statusBg,
              color: statusTextColor,
              fontSize: '11px',
              fontWeight: Typography.weights.bold,
              letterSpacing: '0.4px',
            }}
          >
            {status}
          </div>

          {reward && (
            <div
              style={{
                padding: '3px 8px',
                borderRadius: `${Radius.sm}px`,
                backgroundColor: Colors.rewardBg,
                border: `1px solid ${Colors.rewardBorder}`,
                color: Colors.reward,
                fontSize: '11px',
                fontWeight: Typography.weights.bold,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span>🎁</span>
              <span>{reward}</span>
            </div>
          )}
        </div>

        {/* Pet Name */}
        <div
          style={{
            fontFamily: Typography.fonts.display,
            fontSize: '18px',
            fontWeight: Typography.weights.bold,
            color: Colors.text,
            lineHeight: '22px',
          }}
        >
          {name}
        </div>

        {/* Species & Breed */}
        <div
          style={{
            fontSize: '12px',
            fontWeight: Typography.weights.semiBold,
            color: Colors.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>🐾</span>
          <span>{species}</span>
        </div>

        {/* Location & Time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: Colors.textSecondary,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden' }}>
            <span>📍</span>
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {location}
            </span>
          </div>
          <span style={{ color: Colors.textMuted, flexShrink: 0 }}>{timeAgo}</span>
        </div>
      </div>

      {/* Save Button */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '28px',
          height: '28px',
          borderRadius: `${Radius.sm}px`,
          backgroundColor: Colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(255, 138, 0, 0.3)',
          color: Colors.white,
          fontSize: '13px',
        }}
      >
        🔖
      </div>
    </div>
  );
};
