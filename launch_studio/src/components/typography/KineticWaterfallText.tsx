import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KineticWaterfallTextProps {
  startFrame: number;
  headline: string;
  highlightWords?: string[];
  highlightColor?: string;
  subtitle?: string;
  subtitleStartFrame?: number;
  subtitleHighlights?: string[];
  tag?: {
    text: string;
    icon?: string;
    color?: string;
    bg?: string;
    borderColor?: string;
    startFrame?: number;
  };
  fontSize?: number;
  subtitleFontSize?: number;
  maxWidth?: number;
  theme?: 'light' | 'dark';
}

export const KineticWaterfallText: React.FC<KineticWaterfallTextProps> = ({
  startFrame,
  headline,
  highlightWords = [],
  highlightColor = '#FF8A00',
  subtitle,
  subtitleStartFrame,
  subtitleHighlights = [],
  tag,
  fontSize = 52,
  subtitleFontSize = 24,
  maxWidth = 720,
  theme = 'light',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Stagger parameters for Waterfall Entry (cut-the-curve §6)
  const stagger = 3; // 3 frames per word (50ms gap)

  // Eyebrow Tag Spring
  const tagStart = tag?.startFrame ?? Math.max(0, startFrame - 18);
  const tagFrame = frame - tagStart;
  const tagSpring = spring({
    frame: Math.max(0, tagFrame),
    fps,
    config: { damping: 11, stiffness: 180 },
  });
  const tagPulse = 1 + Math.sin(time * 3) * 0.02;

  // Helper to split headline into words preserving line breaks if needed
  const headlineWords = headline.split(' ');

  // Subtitle start frame defaults to after headline completes
  const subStart = subtitleStartFrame ?? (startFrame + headlineWords.length * stagger + 6);

  // Gradient shimmer offset
  const shimmerPos = (frame * 3.5) % 200;

  const isLight = theme === 'light';
  const baseTextColor = isLight ? '#5A3A1F' : '#FAF8F5';
  const baseSubtitleColor = isLight ? '#7C5C43' : '#E8DFD8';

  return (
    <div style={{ maxWidth: `${maxWidth}px`, position: 'relative', zIndex: 10 }}>
      {/* 1. EYEBROW BADGE WITH BOUNCE & SUBTLE PULSE */}
      {tag && tagFrame >= 0 && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 18px',
            borderRadius: '100px',
            backgroundColor: tag.bg || (isLight ? '#FFF4E8' : 'rgba(255, 138, 0, 0.18)'),
            border: `1.5px solid ${tag.borderColor || (isLight ? '#FFD3AD' : 'rgba(255, 138, 0, 0.45)')}`,
            color: tag.color || (isLight ? '#C2410C' : '#FF8A00'),
            fontSize: '15px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '16px',
            opacity: tagSpring,
            transform: `translateY(${(1 - tagSpring) * 18}px) scale(${tagSpring * tagPulse})`,
            boxShadow: isLight ? '0 4px 14px rgba(255, 138, 0, 0.12)' : '0 4px 20px rgba(255, 138, 0, 0.25)',
          }}
        >
          {tag.icon && <span>{tag.icon}</span>}
          <span>{tag.text}</span>
        </div>
      )}

      {/* 2. HEADLINE WITH WORD-BY-WORD WATERFALL ENTRY */}
      <h1
        style={{
          fontFamily: "'Baloo 2', cursive, sans-serif",
          fontSize: `${fontSize}px`,
          fontWeight: 800,
          color: baseTextColor,
          lineHeight: 1.15,
          margin: '0 0 16px 0',
          letterSpacing: '-0.01em',
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '12px',
          rowGap: '6px',
        }}
      >
        {headlineWords.map((rawWord, i) => {
          // Normalize punctuation for matching highlights
          const cleanWord = rawWord.replace(/[.,¿?¡!]/g, '');
          const isHighlighted = highlightWords.some(
            (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
          );

          const wordFrame = frame - (startFrame + i * stagger);
          if (wordFrame < 0) {
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: 0,
                  visibility: 'hidden',
                }}
              >
                {rawWord}
              </span>
            );
          }

          const wordSpring = spring({
            frame: wordFrame,
            fps,
            config: { damping: 12, stiffness: 175 },
          });

          const translateY = (1 - wordSpring) * 45;
          const scale = interpolate(wordSpring, [0, 1], [0.82, 1.0]);

          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: wordSpring,
                transformOrigin: 'bottom center',
                ...(isHighlighted
                  ? {
                      background: `linear-gradient(90deg, ${highlightColor} 0%, #EA580C 50%, ${highlightColor} 100%)`,
                      backgroundSize: '200% 100%',
                      backgroundPosition: `${shimmerPos}% 0%`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: isLight ? 'none' : `drop-shadow(0 0 16px ${highlightColor}66)`,
                    }
                  : {
                      color: baseTextColor,
                      filter: isLight ? 'none' : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))',
                    }),
              }}
            >
              {rawWord}
            </span>
          );
        })}
      </h1>

      {/* 3. SUBTITLE WITH STAGGERED REVEAL & COLOR ACCENTS */}
      {subtitle && frame >= subStart && (
        <p
          style={{
            fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: `${subtitleFontSize}px`,
            fontWeight: 600,
            color: baseSubtitleColor,
            lineHeight: 1.35,
            margin: 0,
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '8px',
            rowGap: '4px',
          }}
        >
          {subtitle.split(' ').map((rawWord, j) => {
            const cleanSubWord = rawWord.replace(/[.,¿?¡!]/g, '');
            const isSubHighlighted = subtitleHighlights.some(
              (shw) => shw.toLowerCase() === cleanSubWord.toLowerCase()
            );

            const subWordFrame = frame - (subStart + j * 2);
            if (subWordFrame < 0) {
              return (
                <span key={j} style={{ opacity: 0, visibility: 'hidden' }}>
                  {rawWord}
                </span>
              );
            }

            const subSpring = spring({
              frame: subWordFrame,
              fps,
              config: { damping: 13, stiffness: 160 },
            });

            return (
              <span
                key={j}
                style={{
                  display: 'inline-block',
                  transform: `translateY(${(1 - subSpring) * 22}px)`,
                  opacity: subSpring,
                  color: isSubHighlighted ? highlightColor : baseSubtitleColor,
                  fontWeight: isSubHighlighted ? 800 : 600,
                }}
              >
                {rawWord}
              </span>
            );
          })}
        </p>
      )}
    </div>
  );
};
