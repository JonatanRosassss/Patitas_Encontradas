import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CleanWarmSaaSStage } from '../stage/CleanWarmSaaSStage';
import { CleanDeviceChassis } from '../stage/CleanDeviceChassis';
import { RealHomeScreen } from '../screens/RealHomeScreen';
import { RealPublishScreen } from '../screens/RealPublishScreen';
import { BoostModalScreen } from '../screens/BoostModalScreen';
import { SightingNotificationBanner } from '../screens/SightingNotificationBanner';
import { SightingResolutionScreen } from '../screens/SightingResolutionScreen';
import { FoundCelebrationPayoff } from '../screens/FoundCelebrationPayoff';
import { FinalHeroLockup } from '../screens/FinalHeroLockup';
import { TouchCursor } from '../effects/TouchCursor';
import { KineticWaterfallText } from '../typography/KineticWaterfallText';

export const CleanSaaSNarrativeExperience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // -------------------------------------------------------------------------
  // BEAT GATES
  // -------------------------------------------------------------------------
  const isAct1 = frame < 360;                // Home screen & Call to action (0-6s)
  const isAct2 = frame >= 360 && frame < 760; // Publish form & GPS (6-12.6s)
  const isAct3 = frame >= 760 && frame < 1120;// Boost modal (12.6-18.6s)
  const isAct4 = frame >= 1120 && frame < 1500;// Sighting notification & map (18.6-25s)
  const isAct5 = frame >= 1500;              // Resolved payoff & Hero lockup (25-32s)
  const isHeroLockup = frame >= 1720;        // Final co-branding full screen (28.6-32s)

  // -------------------------------------------------------------------------
  // CAMERA ZOOMS & PANS (Sogage Style Dynamic Motion)
  // -------------------------------------------------------------------------
  const baseScale = interpolate(
    frame,
    [
      0,   180, 260, 360, // Act 1: 1.0 -> 1.25 -> 1.0
      380, 500, 620, 680, 760, // Act 2: 1.0 -> 1.15 -> 1.35 -> 1.10
      770, 830, 960, 1120, // Act 3: 1.10 -> 1.45 -> 1.45 -> 1.15
      1130, 1260, 1340, 1500, // Act 4: 1.15 -> 1.25 -> 1.20
      1510, 1570, 1660, 1720  // Act 5: 1.20 -> 1.35 -> 1.10
    ],
    [
      1.02, 1.02, 1.28, 1.02,
      1.05, 1.18, 1.36, 1.38, 1.10,
      1.10, 1.46, 1.46, 1.16,
      1.16, 1.28, 1.22, 1.18,
      1.18, 1.36, 1.12, 1.00
    ],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const basePanY = interpolate(
    frame,
    [
      0,   180, 260, 360,
      380, 500, 620, 680, 760,
      770, 830, 960, 1120,
      1130, 1260, 1340, 1500,
      1510, 1570, 1660, 1720
    ],
    [
      0,   0,   55,  0,
      0,   -20, -110, -110, 0,
      0,   -10, -10, 0,
      -30, 20,  0,   0,
      -30, -95, 0,   0
    ],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subtle continuous breathing drift
  const driftZoom = Math.sin(time * 0.45) * 0.015;
  const driftPanY = Math.cos(time * 0.4) * 4;
  const cameraScale = baseScale + driftZoom;
  const cameraPanY = basePanY + driftPanY;

  // -------------------------------------------------------------------------
  // DYNAMIC TYPING IN FORM (ACT 2)
  // -------------------------------------------------------------------------
  let typedPetName = '';
  if (frame >= 370) {
    const chars = ['M', 'i', 'l', 'o'];
    const charIndex = Math.min(chars.length, Math.floor((frame - 370) / 10));
    typedPetName = chars.slice(0, charIndex).join('');
  }

  // -------------------------------------------------------------------------
  // TOUCH CURSOR COORDINATES (INSIDE PHONE SCREEN 390x844)
  // -------------------------------------------------------------------------
  // Tap 1: Act 1 "+ Publicar Mascota" (Target: X: 195, Y: 135) - Tap frame: 250
  const cursor1X = interpolate(frame, [170, 245], [320, 195], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursor1Y = interpolate(frame, [170, 245], [420, 135], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showCursor1 = frame >= 165 && frame <= 285;

  // Tap 2: Act 2 "Usar mi GPS" (Target: X: 195, Y: 365) - Tap frame: 490
  const cursor2X = interpolate(frame, [430, 485], [195, 195], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursor2Y = interpolate(frame, [430, 485], [200, 365], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showCursor2 = frame >= 425 && frame <= 535;

  // Tap 3: Act 2 "Guardar y Publicar" (Target: X: 195, Y: 800) - Tap frame: 680
  const cursor3X = interpolate(frame, [610, 675], [195, 195], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursor3Y = interpolate(frame, [610, 675], [550, 800], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showCursor3 = frame >= 605 && frame <= 720;

  // Tap 4: Act 3 "¡Sí, impulsar!" (Target: X: 195, Y: 545) - Tap frame: 910
  const cursor4X = interpolate(frame, [830, 905], [300, 195], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursor4Y = interpolate(frame, [830, 905], [680, 545], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showCursor4 = frame >= 825 && frame <= 960;

  // Tap 5: Act 4 Notification banner tap (Target: X: 195, Y: 85) - Tap frame: 1250
  const cursor5X = interpolate(frame, [1180, 1245], [260, 195], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursor5Y = interpolate(frame, [1180, 1245], [300, 85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showCursor5 = frame >= 1175 && frame <= 1300;

  // Tap 6: Act 5 "Marcar como encontrado" (Target: X: 195, Y: 785) - Tap frame: 1560
  const cursor6X = interpolate(frame, [1500, 1555], [195, 195], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursor6Y = interpolate(frame, [1500, 1555], [620, 785], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showCursor6 = frame >= 1495 && frame <= 1620;

  // Active cursor coordinate
  const currentCursor = showCursor1
    ? { x: cursor1X, y: cursor1Y, tap: 250 }
    : showCursor2
    ? { x: cursor2X, y: cursor2Y, tap: 490 }
    : showCursor3
    ? { x: cursor3X, y: cursor3Y, tap: 680 }
    : showCursor4
    ? { x: cursor4X, y: cursor4Y, tap: 910 }
    : showCursor5
    ? { x: cursor5X, y: cursor5Y, tap: 1250 }
    : showCursor6
    ? { x: cursor6X, y: cursor6Y, tap: 1560 }
    : null;

  // Notification slide-in spring (Act 4)
  const notifSlide = spring({
    frame: frame - 1130,
    fps,
    config: { damping: 13, stiffness: 150 },
  });
  const notifY = interpolate(notifSlide, [0, 1], [-100, 52]);

  // Modal scale spring (Act 3)
  const modalSpring = spring({
    frame: frame - 760,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  return (
    <CleanWarmSaaSStage>
      {/* =================================================================== */}
      {/* A. LEFT SIDE: KINETIC NARRATIVE TYPOGRAPHY (Synced to beats)        */}
      {/* =================================================================== */}
      <div
        style={{
          position: 'absolute',
          left: '100px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '680px',
          zIndex: 50,
          opacity: isHeroLockup ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* BEAT 1: ¿Perdiste tu mascota en Pilar? */}
        {isAct1 && (
          <KineticWaterfallText
            startFrame={10}
            tag={{
              text: 'RED BARRIAL DE PILAR',
              icon: '🐾',
              color: '#FF8A00',
              bg: '#FFF4E8',
              borderColor: '#FFD3AD',
              startFrame: 10,
            }}
            headline="¿Perdiste tu mascota en Pilar?"
            highlightWords={['mascota', 'Pilar?']}
            highlightColor="#FF8A00"
            subtitle="Patitas Encontradas conecta a miles de vecinos solidarios en tiempo real."
            subtitleStartFrame={45}
            fontSize={52}
            subtitleFontSize={24}
            maxWidth={660}
          />
        )}

        {/* BEAT 2: Creá una alerta con GPS */}
        {isAct2 && (
          <KineticWaterfallText
            startFrame={365}
            tag={{
              text: 'REPORTE RÁPIDO CON GPS',
              icon: '📍',
              color: '#C2410C',
              bg: '#FFF7ED',
              borderColor: '#FFEDD5',
              startFrame: 365,
            }}
            headline="Creá una alerta geolocalizada en segundos"
            highlightWords={['alerta', 'geolocalizada']}
            highlightColor="#FF8A00"
            subtitle="Fijá el punto exacto con un tap para que los vecinos sepan dónde buscar."
            subtitleStartFrame={400}
            fontSize={50}
            subtitleFontSize={24}
            maxWidth={660}
          />
        )}

        {/* BEAT 3: Publicación destacada */}
        {isAct3 && (
          <KineticWaterfallText
            startFrame={765}
            tag={{
              text: 'MÁXIMO ALCANCE VECINAL',
              icon: '⭐',
              color: '#B45309',
              bg: '#FEF3C7',
              borderColor: '#FDE68A',
              startFrame: 765,
            }}
            headline="Impulsá tu alerta para que todos la vean"
            highlightWords={['Impulsá', 'todos']}
            highlightColor="#FF8A00"
            subtitle="Aparece primera en el feed de cada vecino en Del Viso y todo Pilar."
            subtitleStartFrame={800}
            fontSize={50}
            subtitleFontSize={24}
            maxWidth={660}
          />
        )}

        {/* BEAT 4: Notificaciones en tiempo real */}
        {isAct4 && (
          <KineticWaterfallText
            startFrame={1125}
            tag={{
              text: 'AVISTAMIENTOS EN VIVO',
              icon: '🚨',
              color: '#15803D',
              bg: '#DCFCE7',
              borderColor: '#86EFAC',
              startFrame: 1125,
            }}
            headline="La comunidad alerta cuando ven a tu perro"
            highlightWords={['comunidad', 'alerta']}
            highlightColor="#16A34A"
            subtitle="Recibí avisos instantáneos con mapa Leaflet y ubicación exacta."
            subtitleStartFrame={1160}
            fontSize={50}
            subtitleFontSize={24}
            maxWidth={660}
          />
        )}

        {/* BEAT 5: ¡Encontrado y en casa! */}
        {isAct5 && !isHeroLockup && (
          <KineticWaterfallText
            startFrame={1505}
            tag={{
              text: 'REENCUENTRO EXITOSO',
              icon: '💚',
              color: '#15803D',
              bg: '#DCFCE7',
              borderColor: '#86EFAC',
              startFrame: 1505,
            }}
            headline="¡Milo encontrado y a salvo en su casa!"
            highlightWords={['encontrado', 'casa!']}
            highlightColor="#16A34A"
            subtitle="El impacto real de una comunidad conectada y solidaria en Pilar."
            subtitleStartFrame={1535}
            fontSize={50}
            subtitleFontSize={24}
            maxWidth={660}
          />
        )}
      </div>

      {/* =================================================================== */}
      {/* B. RIGHT SIDE: HIGH-FIDELITY MOBILE DEVICE CHASSIS                  */}
      {/* =================================================================== */}
      <div
        style={{
          position: 'absolute',
          right: '120px',
          top: '50%',
          transform: `translateY(calc(-50% + ${cameraPanY}px))`,
          zIndex: 60,
          opacity: isHeroLockup ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        <CleanDeviceChassis scale={cameraScale} screenWidth={390} screenHeight={844}>
          {/* SCREEN CONTENT CONDITIONAL MOUNTING */}

          {/* 1. Act 1: Real Home Screen */}
          {frame < 360 && (
            <RealHomeScreen
              publishButtonScale={frame >= 250 && frame < 270 ? 0.94 : 1.0}
              highlightPublishButton={frame >= 220 && frame <= 270}
            />
          )}

          {/* 2. Act 2: Real Publish Screen */}
          {frame >= 360 && frame < 760 && (
            <RealPublishScreen
              typedName={typedPetName}
              hasGpsLocked={frame >= 500}
              hasPhotoUploaded={frame >= 540}
              highlightGps={frame >= 485 && frame <= 510}
              saveButtonScale={frame >= 680 && frame < 700 ? 0.94 : 1.0}
              highlightSave={frame >= 660 && frame <= 700}
            />
          )}

          {/* 3. Act 3: Boost Modal Screen (Over Publish Screen) */}
          {frame >= 760 && frame < 1120 && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <RealPublishScreen typedName="Milo" hasGpsLocked={true} hasPhotoUploaded={true} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `scale(${modalSpring})`,
                  transformOrigin: 'center center',
                }}
              >
                <BoostModalScreen
                  buttonScale={frame >= 910 && frame < 930 ? 0.94 : 1.0}
                  highlightButton={frame >= 890 && frame <= 930}
                />
              </div>
            </div>
          )}

          {/* 4. Act 4: Notification Banner & Sighting Map */}
          {frame >= 1120 && frame < 1500 && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {/* If before banner tap (1120-1260), show home screen with banner dropping down */}
              {frame < 1260 ? (
                <>
                  <RealHomeScreen />
                  <div style={{ position: 'absolute', top: `${notifY}px`, left: 0, right: 0 }}>
                    <SightingNotificationBanner
                      scale={frame >= 1250 && frame < 1270 ? 0.96 : 1.0}
                      highlight={frame >= 1240 && frame <= 1260}
                    />
                  </div>
                </>
              ) : (
                /* Once tapped, opens Sighting Map */
                <SightingResolutionScreen
                  buttonScale={frame >= 1560 && frame < 1580 ? 0.94 : 1.0}
                  highlightButton={frame >= 1540 && frame <= 1580}
                />
              )}
            </div>
          )}

          {/* 5. Act 5: Sighting Resolution into Celebration Payoff */}
          {frame >= 1500 && !isHeroLockup && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {frame < 1570 ? (
                <SightingResolutionScreen
                  buttonScale={frame >= 1560 && frame < 1580 ? 0.94 : 1.0}
                  highlightButton={frame >= 1540 && frame <= 1580}
                />
              ) : (
                <FoundCelebrationPayoff />
              )}
            </div>
          )}

          {/* TOUCH CURSOR RENDERED DIRECTLY OVER PHONE SCREEN */}
          {currentCursor && (
            <TouchCursor
              x={currentCursor.x}
              y={currentCursor.y}
              tapFrame={currentCursor.tap}
              visible={true}
            />
          )}
        </CleanDeviceChassis>
      </div>

      {/* =================================================================== */}
      {/* C. FINAL HERO LOCKUP FULL-SCREEN SEQUENCE (Frames 1720 - 1920)      */}
      {/* =================================================================== */}
      {isHeroLockup && <FinalHeroLockup />}
    </CleanWarmSaaSStage>
  );
};
