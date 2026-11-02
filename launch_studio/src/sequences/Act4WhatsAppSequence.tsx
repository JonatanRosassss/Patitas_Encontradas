import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DarkVoidStage } from '../components/stage/DarkVoidStage';
import { PhoneChassis } from '../components/stage/PhoneChassis';
import { MockDetailView } from '../components/ui/MockDetailView';
import { Colors, Typography, Radius } from '../theme/tokens';

export interface Act4WhatsAppSequenceProps {
  // Configurable options
}

export const Act4WhatsAppSequence: React.FC<Act4WhatsAppSequenceProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button pressed state from frame 120 to 160
  const isButtonPressed = frame >= 120 && frame <= 165;

  // Drawer slide-up starting at frame 150
  const drawerSpring = spring({
    frame: frame - 150,
    fps,
    config: {
      damping: 15,
      stiffness: 170,
      mass: 0.7,
    },
  });

  const drawerTranslateY = interpolate(drawerSpring, [0, 1], [400, 0]);
  const drawerOpacity = interpolate(drawerSpring, [0, 0.3, 1], [0, 0.9, 1]);

  // Camera drift focusing on contact interaction
  const cameraScale = interpolate(frame, [0, 600], [1.25, 1.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cameraTranslateY = interpolate(frame, [0, 600], [-30, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <DarkVoidStage
      cameraScale={cameraScale}
      cameraTranslateY={cameraTranslateY}
      glowIntensity={1.25}
    >
      <PhoneChassis
        rotateX={20}
        rotateY={-10}
        rotateZ={4}
        scale={1.0}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MockDetailView
            status="PERDIDO"
            name="Milo"
            species="Perro · Caniche Toy (Macho)"
            reward="Recompensa: $15.000"
            location="Barrio Champagnat, Pilar"
            isWhatsAppPressed={isButtonPressed}
          />

          {/* WhatsApp Direct Chat Drawer Overlay */}
          {frame >= 140 && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '420px',
                backgroundColor: '#EFEAE2', // Authentic WhatsApp chat background tone
                borderTopLeftRadius: '28px',
                borderTopRightRadius: '28px',
                transform: `translateY(${drawerTranslateY}px)`,
                opacity: drawerOpacity,
                boxShadow: '0 -12px 40px rgba(0, 0, 0, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 500,
                fontFamily: Typography.fonts.body,
              }}
            >
              {/* WhatsApp Chat Header */}
              <div
                style={{
                  height: '62px',
                  backgroundColor: '#075E54', // Authentic WhatsApp Deep Green
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: Colors.white,
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: Colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.text,
                    fontWeight: Typography.weights.bold,
                    fontSize: '14px',
                  }}
                >
                  MG
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: Typography.weights.bold }}>
                    María González (Pilar)
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.85, color: '#A7E8BD' }}>
                    en línea · Patitas Encontradas
                  </div>
                </div>
                <div style={{ fontSize: '18px', opacity: 0.8 }}>⋮</div>
              </div>

              {/* Chat Message Stream */}
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                {/* Outgoing Message Bubble */}
                <div
                  style={{
                    alignSelf: 'flex-end',
                    maxWidth: '82%',
                    backgroundColor: '#DCF8C6', // Authentic WhatsApp Sent Bubble
                    borderRadius: '14px 14px 2px 14px',
                    padding: '10px 14px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#111111', lineHeight: '18px' }}>
                    ¡Hola María! Vi la alerta de <strong>Milo</strong> en la app. Lo acabo de ver cerca de la Estación Pilar. Te mando foto y ubicación exacta.
                  </div>
                  <div
                    style={{
                      alignSelf: 'flex-end',
                      fontSize: '10px',
                      color: '#7B8B7B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <span>14:32</span>
                    <span style={{ color: '#34B7F1' }}>✓✓</span>
                  </div>
                </div>

                {/* Instant Reply Bubble */}
                {frame >= 280 && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      maxWidth: '82%',
                      backgroundColor: Colors.white,
                      borderRadius: '14px 14px 14px 2px',
                      padding: '10px 14px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ fontSize: '13px', color: '#111111', lineHeight: '18px' }}>
                      ¡Por Dios, gracias vecino! Ya voy para allá. ¡Muchas gracias por la alerta!
                    </div>
                    <div style={{ alignSelf: 'flex-end', fontSize: '10px', color: Colors.textMuted }}>
                      14:33
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div
                style={{
                  height: '52px',
                  backgroundColor: '#F0F0F0',
                  padding: '8px 12px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: '36px',
                    backgroundColor: Colors.white,
                    borderRadius: '18px',
                    padding: '0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: Colors.textMuted,
                  }}
                >
                  Mensaje...
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#128C7E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.white,
                    fontSize: '14px',
                  }}
                >
                  ➤
                </div>
              </div>
            </div>
          )}
        </div>
      </PhoneChassis>
    </DarkVoidStage>
  );
};
