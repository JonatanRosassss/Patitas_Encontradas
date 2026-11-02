import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors, Typography } from '../../theme/tokens';

export interface PilarHeatmapProps {
  progress?: number;
}

interface HeatPoint {
  x: number;
  y: number;
  radius: number;
  intensity: number;
  name: string;
  count: number;
}

const HEAT_POINTS: HeatPoint[] = [
  { x: 190, y: 180, radius: 85, intensity: 0.85, name: 'Barrio Champagnat', count: 42 },
  { x: 230, y: 260, radius: 110, intensity: 0.95, name: 'Pilar Centro (Plaza 12 Oct)', count: 68 },
  { x: 320, y: 190, radius: 75, intensity: 0.65, name: 'Del Viso', count: 31 },
  { x: 160, y: 340, radius: 80, intensity: 0.70, name: 'Presidente Derqui', count: 38 },
  { x: 110, y: 140, radius: 65, intensity: 0.55, name: 'Villa Rosa', count: 24 },
  { x: 300, y: 320, radius: 70, intensity: 0.60, name: 'Panamericana Km 50', count: 29 },
];

export const PilarHeatmap: React.FC<PilarHeatmapProps> = ({ progress = 1.0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#161412',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 194, 138, 0.2)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
        fontFamily: Typography.fonts.body,
      }}
    >
      {/* 1. Underlying District Map Silhouette SVG */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <filter id="heatBlur">
            <feGaussianBlur stdDeviation="24" />
          </filter>
        </defs>

        {/* District contour boundary */}
        <path
          d="M 60,60 L 320,50 L 390,160 L 360,340 L 220,380 L 100,340 L 40,200 Z"
          fill="#1C1814"
          stroke="rgba(255, 138, 0, 0.25)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Major connecting arterial routes */}
        <line x1="60" y1="200" x2="360" y2="200" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="6" />
        <line x1="220" y1="50" x2="220" y2="380" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="6" />

        {/* 2. Heatmap Glowing Nodes */}
        {HEAT_POINTS.map((hp, idx) => {
          const pulse = 1.0 + 0.08 * Math.sin(time * 2.5 + idx);
          const currentRadius = hp.radius * pulse * progress;
          const currentOpacity = hp.intensity * 0.7 * progress;

          return (
            <g key={idx}>
              {/* Outer soft thermal glow */}
              <circle
                cx={hp.x}
                cy={hp.y}
                r={currentRadius}
                fill={Colors.primary}
                opacity={currentOpacity * 0.5}
                filter="url(#heatBlur)"
              />
              {/* Mid core thermal glow */}
              <circle
                cx={hp.x}
                cy={hp.y}
                r={currentRadius * 0.5}
                fill="#FF3D00"
                opacity={currentOpacity * 0.8}
                filter="url(#heatBlur)"
              />
              {/* High density center hot spot */}
              <circle
                cx={hp.x}
                cy={hp.y}
                r={currentRadius * 0.2}
                fill="#FFEA00"
                opacity={currentOpacity}
              />
            </g>
          );
        })}
      </svg>

      {/* 3. Heatmap Node Labels & Counters */}
      {HEAT_POINTS.map((hp, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: `${hp.x}px`,
            top: `${hp.y - 12}px`,
            transform: 'translate(-50%, -100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(26, 22, 18, 0.85)',
              border: `1px solid ${Colors.primary}`,
              color: Colors.white,
              fontSize: '10px',
              fontWeight: Typography.weights.bold,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>🐾 {hp.name}</span>
            <span style={{ color: Colors.primary }}>({hp.count})</span>
          </div>
        </div>
      ))}

      {/* 4. Legend & HUD Header */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: Colors.primary,
              boxShadow: `0 0 8px ${Colors.primary}`,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: Typography.weights.bold,
              color: Colors.white,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}
          >
            Mapa de Calor · Partido del Pilar
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '9px',
            color: Colors.textMuted,
          }}
        >
          <span>Baja</span>
          <div
            style={{
              width: '45px',
              height: '6px',
              borderRadius: '3px',
              background: 'linear-gradient(90deg, #FFEA00 0%, #FF3D00 50%, #FF8A00 100%)',
            }}
          />
          <span>Alta densidad</span>
        </div>
      </div>
    </div>
  );
};
