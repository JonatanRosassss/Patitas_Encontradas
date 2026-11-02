import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { DarkVoidStage } from '../components/stage/DarkVoidStage';
import { PhoneChassis } from '../components/stage/PhoneChassis';
import { PilarHeatmap } from '../components/map/PilarHeatmap';
import { MockPetCard } from '../components/ui/MockPetCard';
import { Colors, Typography, Radius } from '../theme/tokens';

export interface Act6TelemetrySequenceProps {
  // Configurable options
}

export const Act6TelemetrySequence: React.FC<Act6TelemetrySequenceProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1 (frames 0 to 540): Telemetry Dashboard
  // Part 2 (frames 540 to 900): Hero Co-Branding Lockup (Municipio de Pilar + Patitas Encontradas)

  // Animated KPI Counter ticking up to 73%
  const counterProgress = interpolate(frame, [30, 240], [0, 73], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const counterValue = Math.round(counterProgress);

  // Transition to Final Hero Lockup
  const lockupSpring = spring({
    frame: frame - 520,
    fps,
    config: {
      damping: 15,
      stiffness: 120,
      mass: 0.9,
    },
  });

  const isLockupPhase = frame >= 500;
  const lockupOpacity = interpolate(lockupSpring, [0, 1], [0, 1]);
  const lockupScale = interpolate(lockupSpring, [0, 1], [0.94, 1.0]);

  return (
    <DarkVoidStage
      cameraScale={1.0}
      glowIntensity={1.4}
    >
      {!isLockupPhase ? (
        /* PART 1: Telemetry Dashboard with Heatmap, KPI Card, and Phone Chassis */
        <div
          style={{
            width: '1600px',
            height: '900px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px',
            padding: '40px',
            boxSizing: 'border-box',
            fontFamily: Typography.fonts.body,
          }}
        >
          {/* Left Column: Key Civic Impact Metrics */}
          <div
            style={{
              flex: 1.1,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Header Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 138, 0, 0.18)',
                border: `1px solid ${Colors.primary}`,
                color: Colors.primary,
                fontSize: '13px',
                fontWeight: Typography.weights.extraBold,
                letterSpacing: '1px',
                width: 'fit-content',
              }}
            >
              <span>📊</span>
              <span>TELEMETRÍA DE IMPACTO BARRIAL</span>
            </div>

            {/* Primary KPI Card: 73% Recovery in <48h */}
            <div
              style={{
                backgroundColor: 'rgba(26, 22, 18, 0.85)',
                border: '1.5px solid rgba(255, 194, 138, 0.25)',
                borderRadius: '28px',
                padding: '32px 36px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 138, 0, 0.15)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div
                style={{
                  fontFamily: Typography.fonts.display,
                  fontSize: `${Typography.sizes.megaStat}px`,
                  fontWeight: Typography.weights.extraBold,
                  color: Colors.primary,
                  lineHeight: '90px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                }}
              >
                <span>{counterValue}</span>
                <span style={{ fontSize: '56px' }}>%</span>
              </div>
              <div
                style={{
                  fontFamily: Typography.fonts.display,
                  fontSize: '24px',
                  fontWeight: Typography.weights.bold,
                  color: Colors.white,
                  margin: '8px 0 4px 0',
                }}
              >
                Reencuentros en menos de 48 horas
              </div>
              <div
                style={{
                  fontSize: '15px',
                  color: Colors.textSecondary,
                  lineHeight: '22px',
                }}
              >
                La velocidad del radar barrial en Pilar reduce drásticamente el tiempo de desorientación de las mascotas.
              </div>
            </div>

            {/* Architecture Badge Card: $0 Map Cost (OpenStreetMap + Leaflet) */}
            <div
              style={{
                backgroundColor: 'rgba(26, 22, 18, 0.85)',
                border: '1.5px solid rgba(46, 125, 50, 0.35)',
                borderRadius: '24px',
                padding: '24px 28px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(46, 125, 50, 0.2)',
                  border: '1px solid #2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                🌱
              </div>
              <div>
                <div
                  style={{
                    fontFamily: Typography.fonts.display,
                    fontSize: '20px',
                    fontWeight: Typography.weights.bold,
                    color: Colors.white,
                  }}
                >
                  $0 Costo de Mapas · Licenciamiento Libre
                </div>
                <div style={{ fontSize: '13px', color: Colors.textSecondary, marginTop: '2px' }}>
                  OpenStreetMap + Leaflet.js: Cero dependencia de Google Maps API y soberanía de datos para el Municipio.
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Georeferenced Heatmap of Pilar */}
          <div
            style={{
              flex: 1.2,
              height: '520px',
            }}
          >
            <PilarHeatmap progress={Math.min(1.0, frame / 180)} />
          </div>

          {/* Right Column: Hero Chassis Preview */}
          <div
            style={{
              flex: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PhoneChassis
              rotateX={16}
              rotateY={-12}
              rotateZ={3}
              scale={0.88}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: Colors.backgroundLight,
                  padding: '52px 16px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    fontFamily: Typography.fonts.display,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: Colors.text,
                    marginBottom: '4px',
                  }}
                >
                  Alertas Resueltas en Pilar
                </div>
                <MockPetCard
                  name="Milo"
                  species="Caniche Toy · Macho"
                  status="ENCONTRADO"
                  location="Barrio Champagnat, Pilar"
                  timeAgo="Resuelto hoy"
                  reward=""
                />
                <MockPetCard
                  name="Luna"
                  species="Perra · Mestiza"
                  status="ENCONTRADO"
                  location="Plaza 12 de Octubre, Pilar"
                  timeAgo="Resuelto ayer"
                  reward=""
                />
              </div>
            </PhoneChassis>
          </div>
        </div>
      ) : (
        /* PART 2: Final Hero Co-Branding Lockup (Municipio de Pilar + Patitas Encontradas) */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: '1100px',
            padding: '48px 64px',
            borderRadius: '36px',
            backgroundColor: 'rgba(26, 22, 18, 0.88)',
            border: `1.5px solid ${Colors.darkVoidBorder}`,
            boxShadow: '0 30px 90px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 138, 0, 0.25)',
            backdropFilter: 'blur(24px)',
            opacity: lockupOpacity,
            transform: `scale(${lockupScale})`,
            fontFamily: Typography.fonts.body,
          }}
        >
          {/* Co-Branding Emblem Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              marginBottom: '28px',
            }}
          >
            {/* Patitas Encontradas Logo Badge */}
            <div
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '26px',
                background: 'linear-gradient(135deg, #FF8A00 0%, #E65100 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(255, 138, 0, 0.45)',
              }}
            >
              <Img
                src={staticFile('images/welcome_dog_badge.png')}
                style={{ width: '85px', height: '85px', objectFit: 'contain' }}
              />
            </div>

            {/* Civic Bridge Divider */}
            <div
              style={{
                width: '2px',
                height: '60px',
                backgroundColor: 'rgba(255, 194, 138, 0.3)',
              }}
            />

            {/* Municipio de Pilar Civic Seal Badge */}
            <div
              style={{
                padding: '14px 24px',
                borderRadius: '20px',
                backgroundColor: 'rgba(21, 101, 192, 0.15)',
                border: '1.5px solid rgba(33, 150, 243, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: Typography.weights.extraBold,
                  letterSpacing: '1.5px',
                  color: '#64B5F6',
                  textTransform: 'uppercase',
                }}
              >
                Iniciativa Cívica Barrial
              </div>
              <div
                style={{
                  fontFamily: Typography.fonts.display,
                  fontSize: '20px',
                  fontWeight: Typography.weights.bold,
                  color: Colors.white,
                  marginTop: '2px',
                }}
              >
                Municipio del Pilar
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1
            style={{
              margin: '0 0 12px 0',
              fontFamily: Typography.fonts.display,
              fontSize: `${Typography.sizes.heroTitle}px`,
              fontWeight: Typography.weights.bold,
              color: Colors.primary,
              letterSpacing: '0.5px',
              textShadow: '0 4px 24px rgba(255, 138, 0, 0.35)',
            }}
          >
            PATITAS ENCONTRADAS
          </h1>

          {/* Slogan */}
          <p
            style={{
              margin: '0 0 28px 0',
              fontFamily: Typography.fonts.display,
              fontSize: '26px',
              fontWeight: Typography.weights.semiBold,
              color: Colors.white,
              letterSpacing: '0.3px',
            }}
          >
            “La red comunitaria que cuida a quienes más queremos.”
          </p>

          {/* Call to Action Capsule */}
          <div
            style={{
              padding: '16px 44px',
              borderRadius: `${Radius.full}px`,
              background: 'linear-gradient(135deg, #FF8A00 0%, #E65100 100%)',
              color: Colors.white,
              fontSize: '18px',
              fontWeight: Typography.weights.bold,
              letterSpacing: '0.8px',
              boxShadow: '0 8px 30px rgba(255, 138, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span>📱</span>
            <span>Descargá la App · Disponible en Pilar</span>
          </div>

          {/* Civic Subline */}
          <div
            style={{
              marginTop: '24px',
              fontSize: '13px',
              color: Colors.textMuted,
              letterSpacing: '0.5px',
            }}
          >
            Secretaría de Modernización y Zoonosis · Partido del Pilar, Buenos Aires
          </div>
        </div>
      )}
    </DarkVoidStage>
  );
};
