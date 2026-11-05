import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TouchCursorProps {
  x: number;
  y: number;
  tapFrame?: number; // frame at which a tap occurs
  isPressed?: boolean;
  visible?: boolean;
}

export const TouchCursor: React.FC<TouchCursorProps> = ({
  x,
  y,
  tapFrame,
  isPressed = false,
  visible = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  // Tap animation: scale down when tapping
  let tapScale = 1.0;
  let rippleScale = 0.0;
  let rippleOpacity = 0.0;

  if (tapFrame !== undefined && frame >= tapFrame) {
    const elapsed = frame - tapFrame;
    // Scale compression on tap
    tapScale = interpolate(elapsed, [0, 6, 16], [1.0, 0.78, 1.0], {
      extrapolateRight: 'clamp',
    });

    // Expanding ripple
    rippleScale = interpolate(elapsed, [0, 24], [1.0, 2.8], {
      extrapolateRight: 'clamp',
    });
    rippleOpacity = interpolate(elapsed, [0, 6, 24], [0.85, 0.5, 0.0], {
      extrapolateRight: 'clamp',
    });
  } else if (isPressed) {
    tapScale = 0.82;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* Expanding Ripple Ring */}
      {rippleOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 138, 0, 0.9)',
            boxShadow: '0 0 16px rgba(255, 138, 0, 0.6)',
            transform: `translate(-50%, -50%) scale(${rippleScale})`,
            opacity: rippleOpacity,
          }}
        />
      )}

      {/* Touch Point Circle */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(6px)',
          border: '2.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35), 0 0 12px rgba(255, 138, 0, 0.5)',
          transform: `scale(${tapScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inner subtle core */}
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 138, 0, 0.85)',
            boxShadow: '0 0 8px #FF8A00',
          }}
        />
      </div>
    </div>
  );
};
