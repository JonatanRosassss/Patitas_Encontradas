import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DarkVoidStage } from '../components/stage/DarkVoidStage';
import { PhoneChassis } from '../components/stage/PhoneChassis';
import { MockNotification } from '../components/ui/MockNotification';
import { MockPetCard } from '../components/ui/MockPetCard';
import { Colors, Typography } from '../theme/tokens';

export interface Act1AlertSequenceProps {
  // Can receive variant or callbacks if needed
}

export const Act1AlertSequence: React.FC<Act1AlertSequenceProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth cinematic camera push-in from wide void into oblique macro
  const cameraScale = interpolate(frame, [0, 600], [0.88, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cameraTranslateY = interpolate(frame, [0, 600], [40, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic light bloom as notification arrives around frame 90
  const glowBloom = interpolate(
    frame,
    [80, 110, 200, 600],
    [1.0, 1.8, 1.2, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <DarkVoidStage
      cameraScale={cameraScale}
      cameraTranslateY={cameraTranslateY}
      glowIntensity={glowBloom}
    >
      <PhoneChassis
        rotateX={25}
        rotateY={-18}
        rotateZ={6}
        scale={1.0}
      >
        {/* Mobile Screen Home Interface */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: Colors.backgroundLight,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            fontFamily: Typography.fonts.body,
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: '52px 20px 16px 20px',
              backgroundColor: Colors.card,
              borderBottom: `1px solid ${Colors.borderLight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: Colors.textSecondary, fontWeight: Typography.weights.medium }}>
                Comunidad Activa
              </div>
              <div
                style={{
                  fontFamily: Typography.fonts.display,
                  fontSize: '22px',
                  fontWeight: Typography.weights.bold,
                  color: Colors.text,
                }}
              >
                Pilar Centro
              </div>
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: Colors.accent,
                color: Colors.primary,
                fontSize: '11px',
                fontWeight: Typography.weights.bold,
              }}
            >
              GPS ACTIVO
            </div>
          </div>

          {/* Feed Content */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              overflow: 'hidden',
            }}
          >
            {/* Search Bar */}
            <div
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: Colors.card,
                border: `1px solid ${Colors.borderLight}`,
                padding: '0 14px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: Colors.textMuted,
                fontSize: '13px',
              }}
            >
              <span>🔍</span>
              <span>Buscar en Pilar por zona o raza...</span>
            </div>

            {/* Existing pet card in feed */}
            <MockPetCard
              name="Luna"
              species="Perra · Mestiza"
              status="ENCONTRADO"
              location="Plaza 12 de Octubre, Pilar"
              timeAgo="Hace 1 hora"
              reward=""
            />
          </div>

          {/* Incoming High-Priority Emergency Notification (Triggers at frame 75) */}
          <MockNotification
            startFrame={75}
            title="🚨 ALERTA BARRIAL · PILAR CENTRO"
            subtitle="Se extravió Milo (Caniche Toy · Macho) en Barrio Champagnat. Recompensa $15.000."
            location="Barrio Champagnat, Pilar"
            timeAgo="Ahora"
            isUrgent={true}
          />
        </div>
      </PhoneChassis>
    </DarkVoidStage>
  );
};
