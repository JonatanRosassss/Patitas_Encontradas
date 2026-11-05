import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors } from '../../theme/tokens';
import { GeminiSparkles } from '../effects/GeminiSparkles';
import { TouchCursor } from '../effects/TouchCursor';
import { KineticWaterfallText } from '../typography/KineticWaterfallText';

export const InteractiveAppExperience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // -------------------------------------------------------------------------
  // CAMERA ZOOM & PAN CONTROL WITH CONTINUOUS MOTIVATED DRIFT
  // -------------------------------------------------------------------------
  // Base keyframe movements
  const baseCameraZoom = interpolate(
    frame,
    [380, 440, 680, 860, 940, 1260, 1340, 1660, 1740],
    [1.0, 1.25, 1.28, 1.0, 1.40, 1.42, 1.25, 1.25, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const baseCameraPanX = interpolate(
    frame,
    [380, 440, 860, 940, 1260, 1340, 1660, 1740],
    [0, -40, 0, -20, 0, -30, 0, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const baseCameraPanY = interpolate(
    frame,
    [380, 440, 860, 940, 1260, 1340, 1660, 1740],
    [0, -30, 0, 20, 0, -25, 0, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Motivated Camera Drift (keeps scene alive, continuous cinematic breathing)
  const driftZoom = Math.sin(time * 0.45) * 0.022;
  const driftPanX = Math.cos(time * 0.4) * 6;
  const driftPanY = Math.sin(time * 0.5) * 5;
  const cameraZoom = baseCameraZoom + driftZoom;
  const cameraPanX = baseCameraPanX + driftPanX;
  const cameraPanY = baseCameraPanY + driftPanY;

  // -------------------------------------------------------------------------
  // SCENE TIMING GATES
  // -------------------------------------------------------------------------
  const isAct2 = frame >= 380 && frame < 860;    // Llegó Patitas & Reporte Perdido
  const isAct3 = frame >= 860 && frame < 1280;   // Radar Barrial en Vivo (Map)
  const isAct4 = frame >= 1280 && frame < 1680;  // Encontré una mascota & WhatsApp
  const isAct5 = frame >= 1680;                  // Reencuentro & Hero Lockup

  // -------------------------------------------------------------------------
  // TOUCH CURSOR COORDINATES & TAPS
  // -------------------------------------------------------------------------
  // Cursor 1: Tap "+ Publicar Alerta" at Frame 495
  const cursor1X = interpolate(frame, [440, 495], [680, 540], { extrapolateRight: 'clamp' });
  const cursor1Y = interpolate(frame, [440, 495], [600, 520], { extrapolateRight: 'clamp' });
  const showCursor1 = frame >= 430 && frame <= 530;

  // Cursor 2: Tap "Activar Alerta Barrial" at Frame 640
  const cursor2X = interpolate(frame, [590, 640], [480, 540], { extrapolateRight: 'clamp' });
  const cursor2Y = interpolate(frame, [590, 640], [680, 710], { extrapolateRight: 'clamp' });
  const showCursor2 = frame >= 580 && frame <= 680;

  // Cursor 3: Tap Pin on Map at Frame 1080
  const cursor3X = interpolate(frame, [1020, 1080], [420, 540], { extrapolateRight: 'clamp' });
  const cursor3Y = interpolate(frame, [1020, 1080], [380, 460], { extrapolateRight: 'clamp' });
  const showCursor3 = frame >= 1010 && frame <= 1130;

  // Cursor 4: Tap Tab "Encontrados" at Frame 1340
  const cursor4X = interpolate(frame, [1290, 1340], [460, 610], { extrapolateRight: 'clamp' });
  const cursor4Y = interpolate(frame, [1290, 1340], [320, 240], { extrapolateRight: 'clamp' });
  const showCursor4 = frame >= 1285 && frame <= 1380;

  // Cursor 5: Tap WhatsApp Button at Frame 1520
  const cursor5X = interpolate(frame, [1460, 1520], [620, 540], { extrapolateRight: 'clamp' });
  const cursor5Y = interpolate(frame, [1460, 1520], [680, 705], { extrapolateRight: 'clamp' });
  const showCursor5 = frame >= 1450 && frame <= 1570;

  // -------------------------------------------------------------------------
  // 3D MICRO-TILT OF SMARTPHONE RESPONDING TO CURSOR TOUCH
  // -------------------------------------------------------------------------
  const activeCursorX = showCursor1 ? cursor1X : showCursor2 ? cursor2X : showCursor3 ? cursor3X : showCursor4 ? cursor4X : showCursor5 ? cursor5X : 540;
  const activeCursorY = showCursor1 ? cursor1Y : showCursor2 ? cursor2Y : showCursor3 ? cursor3Y : showCursor4 ? cursor4Y : showCursor5 ? cursor5Y : 500;
  const tiltY = interpolate(activeCursorX, [380, 700], [-3.2, 3.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tiltX = interpolate(activeCursorY, [200, 800], [2.8, -2.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const phoneTiltX = tiltX + Math.sin(time * 0.7) * 0.5;
  const phoneTiltY = tiltY + Math.cos(time * 0.5) * 0.6;

  // -------------------------------------------------------------------------
  // SPRINGS FOR CONTENT REVEALS
  // -------------------------------------------------------------------------
  const photoDropSpring = spring({ frame: frame - 520, fps, config: { damping: 12, stiffness: 150 } });
  const mapPinSpring1 = spring({ frame: frame - 940, fps, config: { damping: 11, stiffness: 160 } });
  const mapPinSpring2 = spring({ frame: frame - 980, fps, config: { damping: 11, stiffness: 160 } });
  const previewCardSpring = spring({ frame: frame - 1085, fps, config: { damping: 13, stiffness: 140 } });
  const waBubbleSpring = spring({ frame: frame - 1530, fps, config: { damping: 12, stiffness: 140 } });
  const payoffFlipSpring = spring({ frame: frame - 1690, fps, config: { damping: 14, stiffness: 120 } });

  // Radar expanding rings
  const radarTime = (frame - 860) / fps;
  const radarRing1 = (radarTime * 120) % 280;
  const radarRing2 = ((radarTime + 0.6) * 120) % 280;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#16100D',
        background: 'radial-gradient(ellipse at 65% 40%, #2B1A13 0%, #1E120D 45%, #120A07 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <GeminiSparkles intensity={1.0} showAmbientGlow={true} warmthLevel="high" />

      {/* Warm Ambient Volumetric Light Orb behind phone */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          right: '18%',
          width: '780px',
          height: '780px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 138, 0, 0.28) 0%, rgba(217, 119, 6, 0.12) 50%, rgba(0,0,0,0) 75%)',
          filter: 'blur(95px)',
          pointerEvents: 'none',
          transform: `translate(${Math.sin(time * 0.6) * 30}px, ${Math.cos(time * 0.8) * 25}px)`,
        }}
      />

      {/* TWO-COLUMN LAYOUT: KINETIC NARRATIVE ON LEFT, PHONE ON RIGHT */}
      <div
        style={{
          width: '1800px',
          height: '960px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          zIndex: 10,
        }}
      >
        {/* =================================================================== */}
        {/* LEFT COLUMN: KINETIC WATERFALL TYPOGRAPHY                          */}
        {/* =================================================================== */}
        <div style={{ width: '740px', paddingRight: '20px' }}>
          {/* ACT 2 HEADLINE: LLEGÓ PATITAS ENCONTRADAS */}
          {isAct2 && (
            <KineticWaterfallText
              startFrame={385}
              tag={{
                text: 'Solución Instantánea',
                icon: '⚡',
                color: '#FF8A00',
                bg: 'rgba(255, 138, 0, 0.2)',
                borderColor: 'rgba(255, 138, 0, 0.5)',
                startFrame: 380,
              }}
              headline="Llegó Patitas Encontradas."
              highlightWords={['Patitas', 'Encontradas']}
              highlightColor="#FF8A00"
              subtitle="Una aplicación para crear una alerta geolocalizada a la gente cerca tuyo sobre tu mascota perdida."
              subtitleStartFrame={415}
              subtitleHighlights={['alerta', 'geolocalizada']}
              fontSize={66}
              subtitleFontSize={32}
              maxWidth={740}
            />
          )}

          {/* ACT 3 HEADLINE: RADAR BARRIAL EN VIVO */}
          {isAct3 && (
            <KineticWaterfallText
              startFrame={865}
              tag={{
                text: 'Radar en Tiempo Real',
                icon: '📡',
                color: '#38BDF8',
                bg: 'rgba(56, 189, 248, 0.18)',
                borderColor: 'rgba(56, 189, 248, 0.5)',
                startFrame: 860,
              }}
              headline="La gente cerca tuyo lo ve al instante en el mapa."
              highlightWords={['al', 'instante', 'mapa']}
              highlightColor="#FF8A00"
              subtitle="Tu alerta se expande en un radio barrial directo. Vecinos, comercios y veterinarias alertas en segundos."
              subtitleStartFrame={900}
              subtitleHighlights={['radio', 'barrial', 'alertas']}
              fontSize={62}
              subtitleFontSize={30}
              maxWidth={740}
            />
          )}

          {/* ACT 4 HEADLINE: ¿ENCONTRASTE Y NO SABÉS QUÉ HACER? */}
          {isAct4 && (
            <KineticWaterfallText
              startFrame={1285}
              tag={{
                text: 'Comunidad Solidaria',
                icon: '🤝',
                color: '#25D366',
                bg: 'rgba(37, 211, 102, 0.18)',
                borderColor: 'rgba(37, 211, 102, 0.5)',
                startFrame: 1280,
              }}
              headline="¿No perdiste una, pero encontraste y no sabés qué hacer?"
              highlightWords={['encontraste', 'sabés', 'qué', 'hacer']}
              highlightColor="#25D366"
              subtitle="También podés subir tu reporte para que la gente cerca tuyo vea tu pedido y contactar en 1 toque por WhatsApp."
              subtitleStartFrame={1330}
              subtitleHighlights={['contactar', 'WhatsApp']}
              fontSize={58}
              subtitleFontSize={30}
              maxWidth={740}
            />
          )}

          {/* ACT 5 HEADLINE: PAYOFF & HERO LOCKUP */}
          {isAct5 && (
            <div>
              <KineticWaterfallText
                startFrame={1685}
                tag={{
                  text: 'Final Feliz',
                  icon: '💚',
                  color: '#25D366',
                  bg: 'rgba(37, 211, 102, 0.18)',
                  borderColor: 'rgba(37, 211, 102, 0.5)',
                  startFrame: 1680,
                }}
                headline="Ninguna mascota sola. Toda una comunidad conectada."
                highlightWords={['Toda', 'comunidad', 'conectada']}
                highlightColor="#FF8A00"
                subtitle="Patitas Encontradas · La red barrial de rescate y reencuentro de Pilar."
                subtitleStartFrame={1720}
                fontSize={66}
                subtitleFontSize={30}
                maxWidth={740}
              />

              {/* App Store / Google Play badges */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                <div
                  style={{
                    padding: '12px 24px',
                    borderRadius: '16px',
                    backgroundColor: '#1E1B18',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <span style={{ fontSize: '26px' }}>🍏</span>
                  <div>
                    <div style={{ fontSize: '11px', color: '#B5A496', textTransform: 'uppercase' }}>Descargar en</div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>App Store</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 24px',
                    borderRadius: '16px',
                    backgroundColor: '#1E1B18',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <span style={{ fontSize: '26px' }}>▶️</span>
                  <div>
                    <div style={{ fontSize: '11px', color: '#B5A496', textTransform: 'uppercase' }}>Disponible en</div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: INTERACTIVE SMARTPHONE (Bring Any Agent style)        */}
        {/* =================================================================== */}
        <div
          style={{
            width: '900px',
            height: '920px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* CAMERA ZOOM & PAN CONTAINER WITH MOTIVATED DRIFT */}
          <div
            style={{
              transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
              transformOrigin: 'center center',
              transition: 'none',
              position: 'relative',
            }}
          >
            {/* SMARTPHONE CHASSIS WITH 3D MICRO-TILT & GOLDEN RIM LIGHT */}
            <div
              style={{
                width: '420px',
                height: '860px',
                borderRadius: '52px',
                backgroundColor: '#191512',
                padding: '12px',
                boxShadow: '0 45px 110px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 138, 0, 0.28), 0 0 0 2px rgba(255, 176, 116, 0.38)',
                transform: `perspective(1200px) rotateX(${phoneTiltX}deg) rotateY(${phoneTiltY}deg)`,
                transformOrigin: 'center center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Dynamic Island / Camera Notch */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '120px',
                  height: '32px',
                  borderRadius: '20px',
                  backgroundColor: '#000000',
                  zIndex: 999,
                }}
              />

              {/* SCREEN VIEWPORT */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '42px',
                  backgroundColor: '#FAF8F5',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* STATUS BAR */}
                <div
                  style={{
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 26px',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#5A3A1F',
                    zIndex: 20,
                  }}
                >
                  <span>9:41</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* APP HEADER */}
                <div
                  style={{
                    padding: '8px 24px 14px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #E8DFD8',
                    backgroundColor: '#FAF8F5',
                    zIndex: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>🐾</span>
                    <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '22px', fontWeight: 800, color: '#5A3A1F' }}>
                      Patitas <span style={{ color: '#FF8A00' }}>Encontradas</span>
                    </span>
                  </div>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#FFE7D2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}
                  >
                    🔔
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SCREEN CONTENT 1: REPORTAR PERDIDO (Act 2)                     */}
                {/* ------------------------------------------------------------- */}
                {isAct2 && (
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Header title */}
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#5A3A1F' }}>
                      Nueva Alerta de Mascota
                    </div>

                    {/* Photo Drop Box */}
                    <div
                      style={{
                        height: '240px',
                        borderRadius: '24px',
                        backgroundColor: '#FFF1E4',
                        border: '2px dashed #FF8A00',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {frame < 520 ? (
                        <div style={{ textAlign: 'center', color: '#8D735C' }}>
                          <span style={{ fontSize: '38px' }}>📷</span>
                          <div style={{ fontWeight: 800, marginTop: '8px' }}>Subir foto de la mascota</div>
                        </div>
                      ) : (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            transform: `scale(${photoDropSpring})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #FFE7D2 0%, #FFC28A 100%)',
                          }}
                        >
                          {/* Pet Illustration / Avatar */}
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '96px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}>🐕</div>
                            <div
                              style={{
                                display: 'inline-block',
                                padding: '4px 14px',
                                borderRadius: '12px',
                                backgroundColor: '#E65100',
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: '13px',
                                marginTop: '4px',
                              }}
                            >
                              MILO · GOLDEN RETRIEVER
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Fields */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '16px',
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid #E8DFD8',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: '#8D735C', fontWeight: 700 }}>ESTADO</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#E65100' }}>🚨 PERDIDO</div>
                      </div>

                      <div
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '16px',
                          backgroundColor: '#FFF8E1',
                          border: '1.5px solid #FFD54F',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: '#F57F17', fontWeight: 700 }}>RECOMPENSA</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#E65100' }}>💰 $20.000 ARS</div>
                      </div>
                    </div>

                    {/* Auto GPS Location */}
                    <div
                      style={{
                        padding: '14px',
                        borderRadius: '16px',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #FF8A00',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>📍</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#5A3A1F' }}>
                          Del Viso, Pilar (GPS Automático)
                        </div>
                        <div style={{ fontSize: '11px', color: '#25D366', fontWeight: 700 }}>
                          ● Radio de alerta: 2.5 km a la redonda
                        </div>
                      </div>
                    </div>

                    {/* Primary Submit Button */}
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '18px',
                        borderRadius: '20px',
                        backgroundColor: '#FF8A00',
                        color: '#FFFFFF',
                        fontWeight: 900,
                        fontSize: '18px',
                        textAlign: 'center',
                        boxShadow: '0 8px 24px rgba(255, 138, 0, 0.45)',
                        transform: frame >= 640 && frame <= 660 ? 'scale(0.96)' : 'scale(1)',
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      Activar Alerta Barrial 🚨
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SCREEN CONTENT 2: RADAR & LEAFLET MAP OF PILAR (Act 3)        */}
                {/* ------------------------------------------------------------- */}
                {isAct3 && (
                  <div style={{ position: 'relative', flex: 1, backgroundColor: '#E5E3DF', overflow: 'hidden' }}>
                    {/* SVG MAP OF PILAR STREET GRID */}
                    <svg width="100%" height="100%" viewBox="0 0 400 700" style={{ position: 'absolute', inset: 0 }}>
                      {/* Streets and avenues */}
                      <path d="M 0 250 L 400 250" stroke="#FFFFFF" strokeWidth="16" />
                      <path d="M 0 420 L 400 420" stroke="#FFFFFF" strokeWidth="22" />
                      <path d="M 180 0 L 180 700" stroke="#FFFFFF" strokeWidth="18" />
                      <path d="M 310 0 L 310 700" stroke="#FFFFFF" strokeWidth="12" />
                      <path d="M 50 100 L 350 600" stroke="#FFFFFF" strokeWidth="14" />

                      {/* Panamericana Highway */}
                      <path
                        d="M 20 0 Q 150 350 380 700"
                        stroke="#FFE0B2"
                        strokeWidth="20"
                        fill="none"
                      />

                      {/* Street labels */}
                      <text x="30" y="410" fill="#8D735C" fontSize="11" fontWeight="800">
                        AV. TRATADO DEL PILAR
                      </text>
                      <text x="195" y="80" fill="#8D735C" fontSize="11" fontWeight="800">
                        RUTA 8
                      </text>
                      <text x="210" y="520" fill="#E65100" fontSize="12" fontWeight="900">
                        PANAMERICANA RAMAL PILAR
                      </text>
                    </svg>

                    {/* EXPANDING RADAR RINGS (Gemini gradient effect) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '180px',
                        top: '420px',
                        width: `${radarRing1}px`,
                        height: `${radarRing1}px`,
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 138, 0, 0.7)',
                        boxShadow: '0 0 20px rgba(255, 138, 0, 0.4)',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        left: '180px',
                        top: '420px',
                        width: `${radarRing2}px`,
                        height: `${radarRing2}px`,
                        borderRadius: '50%',
                        border: '2px solid rgba(56, 189, 248, 0.65)',
                        boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* CENTER PIN: MILO PERDIDO */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '180px',
                        top: '420px',
                        transform: 'translate(-50%, -100%)',
                        zIndex: 30,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: '#E65100',
                          border: '3px solid #FFFFFF',
                          boxShadow: '0 8px 24px rgba(230, 81, 0, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '28px',
                        }}
                      >
                        🐕
                      </div>
                      <div
                        style={{
                          backgroundColor: '#E65100',
                          color: '#fff',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 900,
                          marginTop: '2px',
                        }}
                      >
                        MILO (PERDIDO)
                      </div>
                    </div>

                    {/* NEIGHBORHOOD MARKERS POPPING */}
                    {frame >= 940 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '90px',
                          top: '280px',
                          transform: `translate(-50%, -50%) scale(${mapPinSpring1})`,
                          zIndex: 25,
                          backgroundColor: '#FFFFFF',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>🏥</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#5A3A1F' }}>
                          Vet. Pilar Centro (Alerta Recibida)
                        </span>
                      </div>
                    )}

                    {frame >= 980 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '280px',
                          top: '320px',
                          transform: `translate(-50%, -50%) scale(${mapPinSpring2})`,
                          zIndex: 25,
                          backgroundColor: '#25D366',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>👁️</span>
                        <span style={{ fontSize: '11px', fontWeight: 900 }}>
                          Avistamiento a 350m
                        </span>
                      </div>
                    )}

                    {/* EXPANDED PREVIEW CARD (When Pin Tapped at Frame 1080) */}
                    {frame >= 1085 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '24px',
                          left: '20px',
                          right: '20px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '24px',
                          padding: '16px',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                          transform: `translateY(${(1 - previewCardSpring) * 100}px)`,
                          zIndex: 40,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            backgroundColor: '#FFE7D2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                          }}
                        >
                          🐕
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '17px', fontWeight: 900, color: '#5A3A1F' }}>Milo</div>
                            <span style={{ color: '#E65100', fontWeight: 900, fontSize: '13px' }}>$20.000</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#8D735C' }}>Extraviado hace 25 min</div>
                          <div style={{ fontSize: '12px', color: '#25D366', fontWeight: 800 }}>
                            📍 A 250 metros de tu posición
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SCREEN CONTENT 3: ENCONTRÉ UNA MASCOTA & WHATSAPP (Act 4)     */}
                {/* ------------------------------------------------------------- */}
                {isAct4 && (
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                    {/* SEGMENTED CONTROL TABS (Perdidos | Encontrados) */}
                    <div
                      style={{
                        display: 'flex',
                        backgroundColor: '#E8DFD8',
                        borderRadius: '16px',
                        padding: '4px',
                        position: 'relative',
                      }}
                    >
                      {/* Sliding Pill Indicator */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '4px',
                          bottom: '4px',
                          left: frame < 1340 ? '4px' : '50%',
                          width: 'calc(50% - 4px)',
                          borderRadius: '12px',
                          backgroundColor: frame < 1340 ? '#FF8A00' : '#25D366',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                          transition: 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '10px',
                          fontWeight: 800,
                          fontSize: '14px',
                          color: frame < 1340 ? '#fff' : '#5A3A1F',
                          zIndex: 5,
                        }}
                      >
                        Perdidos
                      </div>
                      <div
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '10px',
                          fontWeight: 800,
                          fontSize: '14px',
                          color: frame >= 1340 ? '#fff' : '#5A3A1F',
                          zIndex: 5,
                        }}
                      >
                        Encontrados 🐾
                      </div>
                    </div>

                    {/* FOUND PET CARD (Bring Any Agent style) */}
                    <div
                      style={{
                        borderRadius: '24px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #25D366',
                        padding: '16px',
                        boxShadow: '0 12px 30px rgba(37, 211, 102, 0.15)',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '100px',
                          backgroundColor: '#E8F5E9',
                          color: '#2E7D32',
                          fontWeight: 900,
                          fontSize: '12px',
                          marginBottom: '12px',
                        }}
                      >
                        🐾 ENCONTRADO EN LA VÍA PÚBLICA
                      </div>

                      {/* Photo slot */}
                      <div
                        style={{
                          height: '160px',
                          borderRadius: '18px',
                          backgroundColor: '#E8F5E9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '80px',
                          marginBottom: '14px',
                        }}
                      >
                        🐕‍🦺
                      </div>

                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#5A3A1F' }}>
                        Perro mediano con collar azul
                      </div>
                      <div style={{ fontSize: '13px', color: '#8D735C', marginTop: '4px' }}>
                        "Muy dócil, asustado. Resguardado en mi patio en Tratado del Pilar."
                      </div>
                    </div>

                    {/* WHATSAPP INSTANT CONTACT BAR */}
                    <div
                      style={{
                        marginTop: 'auto',
                        padding: '18px',
                        borderRadius: '20px',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        fontWeight: 900,
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 10px 28px rgba(37, 211, 102, 0.45)',
                        transform: frame >= 1520 && frame <= 1540 ? 'scale(0.96)' : 'scale(1)',
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>💬</span>
                      <span>Avisar al dueño por WhatsApp</span>
                    </div>

                    {/* ANIMATED WHATSAPP MESSAGE BUBBLE */}
                    {frame >= 1530 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '100px',
                          left: '20px',
                          right: '20px',
                          backgroundColor: '#DCF8C6',
                          borderRadius: '18px',
                          padding: '16px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                          transform: `scale(${waBubbleSpring})`,
                          border: '1px solid #C1E9A6',
                          zIndex: 50,
                        }}
                      >
                        <div style={{ fontSize: '11px', color: '#075E54', fontWeight: 800, marginBottom: '4px' }}>
                          WHATSAPP DIRECTO · HACE 1 SEGUNDO
                        </div>
                        <div style={{ fontSize: '14px', color: '#111B21', fontWeight: 600 }}>
                          "¡Hola! Vi tu publicación en Patitas Encontradas. Tengo a tu perrito a salvo en mi casa 💚"
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SCREEN CONTENT 4: PAYOFF REENCUENTRO (Act 5)                   */}
                {/* ------------------------------------------------------------- */}
                {isAct5 && (
                  <div
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      textAlign: 'center',
                    }}
                  >
                    {/* FLIPPING SUCCESS CARD */}
                    <div
                      style={{
                        padding: '30px 20px',
                        borderRadius: '28px',
                        backgroundColor: '#FFFFFF',
                        border: '3px solid #25D366',
                        boxShadow: '0 24px 60px rgba(37, 211, 102, 0.35)',
                        width: '100%',
                        transform: `scale(${payoffFlipSpring}) rotateY(${(1 - payoffFlipSpring) * 180}deg)`,
                      }}
                    >
                      <div style={{ fontSize: '72px', marginBottom: '12px' }}>🎉</div>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '6px 18px',
                          borderRadius: '100px',
                          backgroundColor: '#E8F5E9',
                          color: '#2E7D32',
                          fontWeight: 900,
                          fontSize: '15px',
                          marginBottom: '12px',
                        }}
                      >
                        ¡CASO RESUELTO!
                      </div>
                      <h2
                        style={{
                          fontFamily: "'Baloo 2', sans-serif",
                          fontSize: '28px',
                          fontWeight: 800,
                          color: '#5A3A1F',
                          margin: '0 0 8px 0',
                        }}
                      >
                        ¡Milo está en su casa!
                      </h2>
                      <p style={{ fontSize: '14px', color: '#8D735C', margin: 0 }}>
                        Reunido gracias al aviso de un vecino en Del Viso
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* TACTILE TOUCH CURSORS RENDERED OVER THE PHONE SCREEN            */}
            {/* --------------------------------------------------------------- */}
            <TouchCursor x={cursor1X} y={cursor1Y} tapFrame={495} visible={showCursor1} />
            <TouchCursor x={cursor2X} y={cursor2Y} tapFrame={640} visible={showCursor2} />
            <TouchCursor x={cursor3X} y={cursor3Y} tapFrame={1080} visible={showCursor3} />
            <TouchCursor x={cursor4X} y={cursor4Y} tapFrame={1340} visible={showCursor4} />
            <TouchCursor x={cursor5X} y={cursor5Y} tapFrame={1520} visible={showCursor5} />
          </div>
        </div>
      </div>
    </div>
  );
};
