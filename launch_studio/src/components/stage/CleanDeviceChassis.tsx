import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CleanDeviceChassisProps {
  children?: React.ReactNode;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  driftIntensity?: number;
  screenWidth?: number;
  screenHeight?: number;
}

export const CleanDeviceChassis: React.FC<CleanDeviceChassisProps> = ({
  children,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1.0,
  driftIntensity = 1.0,
  screenWidth = 390,
  screenHeight = 844,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Gentle motivated drift to make the device feel physically alive
  const driftX = Math.sin(time * 0.7) * 0.6 * driftIntensity;
  const driftY = Math.cos(time * 0.5) * 0.8 * driftIntensity;
  const driftRoll = Math.sin(time * 0.6) * 0.4 * driftIntensity;

  const finalRotateX = rotateX + driftX;
  const finalRotateY = rotateY + driftY;
  const finalRotateZ = rotateZ + driftRoll;

  const bezel = 11;
  const outerWidth = screenWidth + bezel * 2;
  const outerHeight = screenHeight + bezel * 2;
  const cornerRadius = 48;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformStyle: 'preserve-3d',
        transform: `perspective(1400px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg) rotateZ(${finalRotateZ}deg) scale(${scale})`,
        willChange: 'transform',
      }}
    >
      {/* 1. Floor Ambient Occlusion Shadow (Multi-layered soft shadow for warm light background) */}
      <div
        style={{
          position: 'absolute',
          width: `${outerWidth * 0.95}px`,
          height: `${outerHeight * 0.9}px`,
          borderRadius: `${cornerRadius + 10}px`,
          background: 'radial-gradient(ellipse at center, rgba(90, 58, 31, 0.22) 0%, rgba(255, 138, 0, 0.08) 40%, transparent 70%)',
          transform: 'translate3d(0, 45px, -60px)',
          filter: 'blur(32px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. Outer Titanium Body & Frame */}
      <div
        style={{
          position: 'relative',
          width: `${outerWidth}px`,
          height: `${outerHeight}px`,
          borderRadius: `${cornerRadius}px`,
          background: 'linear-gradient(135deg, #E6DDD5 0%, #D8CFC7 50%, #ECE4DC 100%)',
          padding: `${bezel}px`,
          boxShadow: `
            0 30px 70px -15px rgba(90, 58, 31, 0.20),
            0 15px 35px -10px rgba(255, 138, 0, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.8) inset,
            0 0 0 1px rgba(90, 58, 31, 0.15)
          `,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Inner Display Screen */}
        <div
          style={{
            position: 'relative',
            width: `${screenWidth}px`,
            height: `${screenHeight}px`,
            borderRadius: `${cornerRadius - bezel}px`,
            backgroundColor: '#FAF8F5',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Dynamic Island / Speaker Pill */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '116px',
              height: '30px',
              borderRadius: '20px',
              backgroundColor: '#1E1712',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Camera dot */}
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#0F0B08',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            />
            {/* Sensor dot */}
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#150F0B',
              }}
            />
          </div>

          {/* Screen Content Rendered Here */}
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
