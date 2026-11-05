import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GeminiSparkles } from '../effects/GeminiSparkles';
import { KineticWaterfallText } from '../typography/KineticWaterfallText';

export const ChaosGroupsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Social cards springs
  const card1Spring = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 120 } });
  const card2Spring = spring({ frame: frame - 75, fps, config: { damping: 12, stiffness: 120 } });
  const card3Spring = spring({ frame: frame - 125, fps, config: { damping: 12, stiffness: 120 } });

  // Sweep exit transition (Gemini light wave at end of scene)
  const exitSweep = interpolate(frame, [320, 385], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sceneOpacity = interpolate(exitSweep, [0.7, 1], [1, 0]);
  const sceneScale = interpolate(exitSweep, [0, 1], [1, 1.08]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#16100D',
        background: 'radial-gradient(ellipse at 50% 36%, #2C1B14 0%, #1F130E 50%, #120A07 100%)',
        opacity: sceneOpacity,
        transform: `scale(${sceneScale})`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 80px',
        fontFamily: "'Nunito', sans-serif",
        zIndex: 50,
      }}
    >
      <GeminiSparkles intensity={0.9} showAmbientGlow={true} warmthLevel="high" />

      {/* Dynamic Warm Ambient Light Orb */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: '900px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 138, 0, 0.22) 0%, rgba(217, 119, 6, 0.08) 55%, rgba(0,0,0,0) 75%)',
          filter: 'blur(90px)',
          transform: `translate(-50%, -50%) translate(${Math.sin(time * 0.8) * 35}px, ${Math.cos(time * 0.6) * 20}px)`,
          pointerEvents: 'none',
        }}
      />

      {/* TOP KINETIC TEXT (Waterfall Cascade Staggered Entry) */}
      <div
        style={{
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '1200px',
          marginBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <KineticWaterfallText
          startFrame={5}
          headline="¿Perdiste una mascota o encontraste una?"
          highlightWords={['encontraste', 'mascota']}
          highlightColor="#38BDF8"
          tag={{
            text: 'El problema de siempre',
            icon: '⚠️',
            color: '#FF8A00',
            bg: 'rgba(255, 138, 0, 0.2)',
            borderColor: 'rgba(255, 138, 0, 0.5)',
            startFrame: 0,
          }}
          fontSize={64}
          maxWidth={1200}
        />

        {/* Question 2 Waterfall Entry */}
        {frame >= 40 && (
          <div style={{ marginTop: '14px' }}>
            <KineticWaterfallText
              startFrame={42}
              headline="¿Y tuviste que ir reposteando por 10.000 grupos de Facebook y WhatsApp?"
              highlightWords={['10.000', 'grupos', 'WhatsApp']}
              highlightColor="#FF8A00"
              fontSize={42}
              maxWidth={1100}
            />
          </div>
        )}
      </div>

      {/* CHAOTIC STACKED SOCIAL CARDS WITH ORGANIC FLOATING HOVER */}
      <div
        style={{
          position: 'relative',
          width: '980px',
          height: '380px',
          zIndex: 10,
        }}
      >
        {/* Card 1: Facebook Group Post */}
        {frame >= 25 && (
          <div
            style={{
              position: 'absolute',
              left: '40px',
              top: '20px',
              width: '460px',
              padding: '24px',
              borderRadius: '24px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 25px 65px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.15)',
              transform: `translateY(${(1 - card1Spring) * 80 + Math.sin(time * 2.1) * 8}px) rotate(${-6 + Math.sin(frame * 0.08) * 1.5}deg) scale(${card1Spring})`,
              opacity: card1Spring,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#1877F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '22px',
                }}
              >
                f
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1C1E21' }}>
                  Mascotas Perdidas Pilar (Grupo #42)
                </div>
                <div style={{ fontSize: '13px', color: '#65676B' }}>Mariana G. · Hace 3 días</div>
              </div>
            </div>
            <p style={{ fontSize: '15px', color: '#2E384D', lineHeight: 1.45, margin: '0 0 14px 0' }}>
              ¡¡POR FAVOR DIFUNDIR!! Se escapó Toby en Del Viso. Ya publiqué en otros 15 grupos pero nadie responde 😭💔
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#8A94A6' }}>0 comentarios · 3 compartidos</span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: '#FFEBEA',
                  color: '#D93025',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                Sin alcance ⚠️
              </span>
            </div>
          </div>
        )}

        {/* Card 2: WhatsApp Overwhelmed Group */}
        {frame >= 75 && (
          <div
            style={{
              position: 'absolute',
              right: '50px',
              top: '50px',
              width: '460px',
              padding: '24px',
              borderRadius: '24px',
              backgroundColor: '#111B21',
              border: '1px solid #222E35',
              boxShadow: '0 30px 75px rgba(0, 0, 0, 0.7), 0 0 25px rgba(37, 211, 102, 0.2)',
              transform: `translateY(${(1 - card2Spring) * 90 + Math.cos(time * 1.9) * 8}px) rotate(${5 + Math.cos(frame * 0.09) * 1.5}deg) scale(${card2Spring})`,
              opacity: card2Spring,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '18px',
                  }}
                >
                  💬
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#E9EDEF' }}>
                    Vecinos en Alerta #78
                  </div>
                  <div style={{ fontSize: '12px', color: '#8696A0' }}>256 participantes</div>
                </div>
              </div>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#25D366',
                  color: '#111B21',
                  fontSize: '12px',
                  fontWeight: 900,
                }}
              >
                99+
              </span>
            </div>
            <div
              style={{
                backgroundColor: '#202C33',
                padding: '12px 14px',
                borderRadius: '12px',
                color: '#E9EDEF',
                fontSize: '14px',
                lineHeight: 1.4,
              }}
            >
              "Chicos, reenvíen porfa que el mensaje se perdió entre los audios y las cadenas del barrio..."
            </div>
          </div>
        )}

        {/* Card 3: Found Pet Cry For Help (Bottom center) */}
        {frame >= 125 && (
          <div
            style={{
              position: 'absolute',
              left: '260px',
              top: '160px',
              width: '480px',
              padding: '22px',
              borderRadius: '24px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 35px 85px rgba(0, 0, 0, 0.65)',
              transform: `translateY(${(1 - card3Spring) * 70 + Math.sin(time * 2.3 + 1) * 7}px) rotate(${-1 + Math.sin(time * 1.5) * 0.8}deg) scale(${card3Spring})`,
              opacity: card3Spring,
              zIndex: 15,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px' }}>🐕</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#E65100' }}>
                "ENCONTRÉ UN PERRITO Y NO SÉ QUÉ HACER"
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#5A3A1F', lineHeight: 1.4, margin: '0 0 10px 0' }}>
              Está en Tratado del Pilar, tiene collar azul pero no tengo dónde dejarlo. ¿Alguien que lo publique en otros grupos?
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#D93025',
                fontWeight: 800,
              }}
            >
              ⚠️ La información se dispersa y el tiempo corre...
            </div>
          </div>
        )}
      </div>

      {/* GEMINI WARM AMBER LIGHT WAVE TRANSITION (Exit Wipe) */}
      {exitSweep > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, rgba(255, 138, 0, 0) 0%, rgba(255, 138, 0, 0.85) ${exitSweep * 100 - 15}%, rgba(255, 218, 140, 0.98) ${exitSweep * 100}%, rgba(255, 255, 255, 1) ${exitSweep * 100 + 10}%, rgba(255, 138, 0, 0) ${exitSweep * 100 + 25}%)`,
            pointerEvents: 'none',
            zIndex: 99,
          }}
        />
      )}
    </div>
  );
};
