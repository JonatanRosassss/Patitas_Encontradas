import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors, Radius } from '../../theme/tokens';

export interface PhoneChassisProps {
  children?: React.ReactNode;
  rotateX?: number; // default: 25deg
  rotateY?: number; // default: -18deg
  rotateZ?: number; // default: 6deg
  scale?: number;   // default: 1.0
  driftIntensity?: number; // default: 1.0
  screenWidth?: number; // default: 390
  screenHeight?: number; // default: 844
  showReflection?: boolean;
}

export const PhoneChassis: React.FC<PhoneChassisProps> = ({
  children,
  rotateX = 25,
  rotateY = -18,
  rotateZ = 6,
  scale = 1.0,
  driftIntensity = 1.0,
  screenWidth = 390,
  screenHeight = 844,
  showReflection = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Cinematic micro-drift
  const driftX = interpolate(
    Math.sin(time * 0.8),
    [-1, 1],
    [-1.5, 1.5]
  ) * driftIntensity;

  const driftY = interpolate(
    Math.cos(time * 0.6),
    [-1, 1],
    [-2.0, 2.0]
  ) * driftIntensity;

  const driftRoll = interpolate(
    Math.sin(time * 0.7),
    [-1, 1],
    [-0.8, 0.8]
  ) * driftIntensity;

  const finalRotateX = rotateX + driftX;
  const finalRotateY = rotateY + driftY;
  const finalRotateZ = rotateZ + driftRoll;

  // Chassis bezel metrics (approx iPhone 15 Pro titanium frame)
  const bezelThickness = 12;
  const chassisWidth = screenWidth + bezelThickness * 2;
  const chassisHeight = screenHeight + bezelThickness * 2;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformStyle: 'preserve-3d',
        transform: `perspective(1200px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg) rotateZ(${finalRotateZ}deg) scale(${scale})`,
        transition: 'none',
      }}
    >
      {/* 1. Deep Floor Shadow on Dark Void Stage */}
      <div
        style={{
          position: 'absolute',
          width: `${chassisWidth * 1.15}px`,
          height: `${chassisHeight * 0.85}px`,
          borderRadius: `${Radius.phoneBezel * 1.5}px`,
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(255, 138, 0, 0.08) 45%, rgba(0, 0, 0, 0) 75%)',
          transform: 'translate3d(40px, 80px, -90px) rotateX(90deg)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. Outer Titanium Chassis Edge with Orange Rim Reflection */}
      <div
        style={{
          position: 'relative',
          width: `${chassisWidth}px`,
          height: `${chassisHeight}px`,
          borderRadius: `${Radius.phoneBezel}px`,
          background: 'linear-gradient(135deg, #2D2721 0%, #15120F 50%, #3A3026 100%)',
          padding: `${bezelThickness}px`,
          boxShadow: `
            0 30px 90px rgba(0, 0, 0, 0.9),
            0 0 0 1.5px rgba(255, 194, 138, 0.25),
            0 0 50px rgba(255, 138, 0, 0.22),
            inset 0 1px 2px rgba(255, 255, 255, 0.2),
            inset 0 -2px 4px rgba(0, 0, 0, 0.8)
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* 3. Screen Container (Mobile Viewport) */}
        <div
          style={{
            position: 'relative',
            width: `${screenWidth}px`,
            height: `${screenHeight}px`,
            borderRadius: `${Radius.screenInner}px`,
            backgroundColor: Colors.backgroundLight,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Dynamic Island / Hardware Pill Notch */}
          <div
            style={{
              position: 'absolute',
              top: '11px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '110px',
              height: '30px',
              borderRadius: '20px',
              backgroundColor: '#000000',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Front Camera Lens Specular */}
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #1F2840 0%, #0A0D15 100%)',
                boxShadow: 'inset 0 0 2px #344966',
              }}
            />
            {/* Sensor / Speaker Dot */}
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#111111',
              }}
            />
          </div>

          {/* Active Mobile Content / Scene */}
          <div
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {children}
          </div>

          {/* Specular Glass Sheen / Reflection Overlay */}
          {showReflection && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(125deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 35%, rgba(255, 255, 255, 0) 55%)',
                pointerEvents: 'none',
                zIndex: 9998,
              }}
            />
          )}

          {/* Home Indicator Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '134px',
              height: '5px',
              borderRadius: '3px',
              backgroundColor: '#000000',
              opacity: 0.25,
              zIndex: 9999,
            }}
          />
        </div>
      </div>
    </div>
  );
};
