import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors, Typography } from '../../theme/tokens';

export interface KineticTextProps {
  primaryText: string;
  secondaryText?: string;
  accentWord?: string;
  tag?: string;
  startFrame?: number;
  durationFrames?: number;
  position?: 'top' | 'bottom' | 'center';
}

export const KineticText: React.FC<KineticTextProps> = ({
  primaryText,
  secondaryText,
  accentWord,
  tag,
  startFrame = 0,
  durationFrames = 180,
  position = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > durationFrames) {
    return null;
  }

  // Smooth entrance spring
  const enterSpring = spring({
    frame: relFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 180,
      mass: 0.6,
    },
  });

  // Exit interpolation towards the end of the duration
  const exitProgress = interpolate(
    relFrame,
    [durationFrames - 20, durationFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(enterSpring, [0, 1], [40, 0]) + exitProgress * -30;
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) * (1 - exitProgress);
  const scale = interpolate(enterSpring, [0, 1], [0.92, 1.0]) * (1 - exitProgress * 0.05);
  const blur = interpolate(enterSpring, [0, 1], [10, 0]) + exitProgress * 8;

  // Split primary text to highlight accentWord in primary orange
  const renderTextWithAccent = () => {
    if (!accentWord) {
      return primaryText;
    }
    const parts = primaryText.split(new RegExp(`(${accentWord})`, 'gi'));
    return parts.map((part, idx) => {
      if (part.toLowerCase() === accentWord.toLowerCase()) {
        return (
          <span
            key={idx}
            style={{
              color: Colors.primary,
              textShadow: '0 0 24px rgba(255, 138, 0, 0.65)',
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const getPositionStyles = (): React.CSSProperties => {
    if (position === 'top') {
      return { top: '64px', left: '50%', transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})` };
    }
    if (position === 'center') {
      return { top: '50%', left: '50%', transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})` };
    }
    return { bottom: '72px', left: '50%', transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})` };
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...getPositionStyles(),
        opacity,
        filter: `blur(${blur}px)`,
        zIndex: 500,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '1200px',
        padding: '20px 48px',
        borderRadius: '32px',
        background: 'rgba(26, 22, 18, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(255, 194, 138, 0.3)',
        boxShadow: `
          0 24px 60px rgba(0, 0, 0, 0.8),
          0 0 35px rgba(255, 138, 0, 0.25)
        `,
      }}
    >
      {tag && (
        <div
          style={{
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 138, 0, 0.2)',
            border: `1px solid ${Colors.primary}`,
            color: Colors.primary,
            fontSize: '13px',
            fontWeight: Typography.weights.extraBold,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          {tag}
        </div>
      )}

      {/* Main Punchy Kinetic Title */}
      <h2
        style={{
          margin: 0,
          fontFamily: Typography.fonts.display,
          fontSize: '44px',
          fontWeight: Typography.weights.bold,
          color: Colors.white,
          letterSpacing: '-0.5px',
          lineHeight: '52px',
          textShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
        }}
      >
        {renderTextWithAccent()}
      </h2>

      {/* Secondary Context Line */}
      {secondaryText && (
        <p
          style={{
            margin: '8px 0 0 0',
            fontFamily: Typography.fonts.body,
            fontSize: '20px',
            fontWeight: Typography.weights.medium,
            color: Colors.secondary,
            letterSpacing: '0.2px',
          }}
        >
          {secondaryText}
        </p>
      )}
    </div>
  );
};
