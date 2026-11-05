import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CleanWarmSaaSStageProps {
  children?: React.ReactNode;
}

export const CleanWarmSaaSStage: React.FC<CleanWarmSaaSStageProps> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Gentle floating movement for ambient warm light blobs
  const orb1X = Math.sin(time * 0.45) * 40;
  const orb1Y = Math.cos(time * 0.35) * 30;
  const orb2X = Math.cos(time * 0.4) * 35;
  const orb2Y = Math.sin(time * 0.5) * 25;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#FAF8F5', // Official app warm light background
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 1. Subtle Warm Peach/Amber Radial Gradient Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '900px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 138, 0, 0.08) 0%, rgba(255, 231, 210, 0.04) 50%, transparent 70%)',
          transform: `translate(${orb1X}px, ${orb1Y}px)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '1000px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 194, 138, 0.12) 0%, rgba(255, 231, 210, 0.05) 55%, transparent 75%)',
          transform: `translate(${orb2X}px, ${orb2Y}px)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. Micro Architectural Grid (Subtle, High-End SaaS Aesthetic) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle, rgba(90, 58, 31, 0.065) 1.2px, transparent 1.2px)
          `,
          backgroundSize: '36px 36px',
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      />

      {/* 3. Soft Vignette to Frame the Presentation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(90, 58, 31, 0.04) 85%, rgba(90, 58, 31, 0.09) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 4. Children (Camera stage, phone chassis, overlays) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
};
