import React from 'react';
import { Composition, AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from 'remotion';
import './theme/typography.css';
import { Colors, Typography, VideoMetrics, TimelineActs } from './theme/tokens';

export type LaunchVideoProps = Record<string, unknown> & {
  variant?: 'typography' | 'voiceover';
};

/**
 * Base Placeholder frame for launch video before M2-M5 scenes are plugged in.
 * Demonstrates 100% adherence to Dark Void styling and design tokens.
 */
export const PlaceholderLaunchVideo: React.FC<LaunchVideoProps> = ({ variant = 'typography' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle ambient pulse for the volumetric orange light behind the stage
  const pulse = interpolate(
    Math.sin((frame / fps) * 1.5),
    [-1, 1],
    [0.18, 0.32],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const glowRadius = interpolate(
    Math.sin((frame / fps) * 1.2),
    [-1, 1],
    [400, 520],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const isTypography = variant === 'typography';
  const variantTitle = isTypography
    ? 'VERSIÓN A · TIPOGRAFÍA CINÉTICA & SFX'
    : 'VERSIÓN B · LOCUCIÓN INSTITUCIONAL & SFX';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: Colors.darkVoidBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: Typography.fonts.body,
        color: Colors.white,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dynamic Volumetric Orange Glow Layer */}
      <div
        style={{
          position: 'absolute',
          width: glowRadius * 2,
          height: glowRadius * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 138, 0, ${pulse}) 0%, rgba(255, 138, 0, 0) 70%)`,
          pointerEvents: 'none',
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '45%',
        }}
      />

      {/* Center Stage Card Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 64px',
          borderRadius: '32px',
          background: 'rgba(26, 22, 18, 0.75)',
          border: `1px solid ${Colors.darkVoidBorder}`,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 138, 0, 0.12)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
          maxWidth: '960px',
        }}
      >
        {/* Brand Emblem */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #FF8A00 0%, #E65100 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(255, 138, 0, 0.4)',
            marginBottom: '28px',
          }}
        >
          <Img
            src={staticFile('images/welcome_dog_badge.png')}
            style={{
              width: '90px',
              height: '90px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Brand Title */}
        <h1
          style={{
            fontFamily: Typography.fonts.display,
            fontSize: Typography.sizes.heroTitle,
            fontWeight: Typography.weights.bold,
            color: Colors.primary,
            margin: '0 0 12px 0',
            letterSpacing: '1px',
            textShadow: '0 4px 20px rgba(255, 138, 0, 0.3)',
          }}
        >
          PATITAS ENCONTRADAS
        </h1>

        {/* Narrative Subtitle */}
        <p
          style={{
            fontSize: Typography.sizes.xl,
            fontWeight: Typography.weights.medium,
            color: Colors.secondary,
            margin: '0 0 24px 0',
            letterSpacing: '0.5px',
          }}
        >
          Red Comunitaria de Búsqueda y Rescate de Mascotas · Partido del Pilar
        </p>

        {/* Variant Chip */}
        <div
          style={{
            padding: '10px 24px',
            borderRadius: '9999px',
            background: isTypography ? 'rgba(255, 138, 0, 0.18)' : 'rgba(37, 211, 102, 0.18)',
            border: `1px solid ${isTypography ? Colors.primary : Colors.whatsapp}`,
            color: isTypography ? Colors.primary : Colors.whatsapp,
            fontSize: Typography.sizes.md,
            fontWeight: Typography.weights.bold,
            letterSpacing: '1px',
            marginBottom: '32px',
          }}
        >
          {variantTitle}
        </div>

        {/* Timeline Specs Grid */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            fontSize: Typography.sizes.sm,
            color: Colors.textMuted,
          }}
        >
          <div>
            <strong style={{ color: Colors.white }}>Resolución:</strong> 1920x1080 (Full HD)
          </div>
          <div>
            <strong style={{ color: Colors.white }}>FPS:</strong> 60 fps constantes
          </div>
          <div>
            <strong style={{ color: Colors.white }}>Duración:</strong> 68.00s (4080 frames)
          </div>
          <div>
            <strong style={{ color: Colors.white }}>Audio:</strong> 48.000 Hz Estéreo
          </div>
        </div>

        {/* Act Sequence Progress Indicator */}
        <div
          style={{
            marginTop: '28px',
            display: 'flex',
            gap: '8px',
            width: '100%',
          }}
        >
          {Object.values(TimelineActs).map((act) => {
            const isActive = frame >= act.startFrame && frame < act.endFrame;
            return (
              <div
                key={act.id}
                style={{
                  flex: act.durationFrames,
                  height: '6px',
                  borderRadius: '3px',
                  background: isActive ? Colors.primary : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: isActive ? '0 0 10px rgba(255, 138, 0, 0.8)' : 'none',
                }}
                title={act.name}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => {
  return (
    <>
      {/* Version A: Typography + Orchestral Score + Procedural SFX */}
      <Composition
        id="PatitasLaunchTypography"
        component={PlaceholderLaunchVideo}
        durationInFrames={VideoMetrics.durationInFrames}
        fps={VideoMetrics.fps}
        width={VideoMetrics.width}
        height={VideoMetrics.height}
        defaultProps={{
          variant: 'typography',
        }}
      />

      {/* Version B: Voiceover + Orchestral Score + Procedural SFX */}
      <Composition
        id="PatitasLaunchVoiceover"
        component={PlaceholderLaunchVideo}
        durationInFrames={VideoMetrics.durationInFrames}
        fps={VideoMetrics.fps}
        width={VideoMetrics.width}
        height={VideoMetrics.height}
        defaultProps={{
          variant: 'voiceover',
        }}
      />
    </>
  );
};
