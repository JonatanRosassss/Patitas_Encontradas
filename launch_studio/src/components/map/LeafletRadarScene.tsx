import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors, Typography, Radius, PilarLandmarks } from '../../theme/tokens';

export interface LeafletRadarSceneProps {
  radarProgress?: number; // 0 to 1
  zoomScale?: number;
  showMarkerPin?: boolean;
  activeLandmark?: string;
}

export const LeafletRadarScene: React.FC<LeafletRadarSceneProps> = ({
  zoomScale = 1.0,
  showMarkerPin = true,
  activeLandmark = 'Barrio Champagnat',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Concentric radar waves expansion
  const wave1 = (time * 1.2) % 1.0;
  const wave2 = (time * 1.2 + 0.33) % 1.0;
  const wave3 = (time * 1.2 + 0.66) % 1.0;

  // Pin drop bounce physics
  const pinSpring = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 10,
      stiffness: 180,
      mass: 0.6,
    },
  });

  const pinScale = interpolate(pinSpring, [0, 1], [0, 1]);
  const pinTranslateY = interpolate(pinSpring, [0, 1], [-80, 0]);

  // Map Center: Milo's location in Champagnat (approx pixel coordinate in 390x844 view: center)
  const centerX = 195;
  const centerY = 380;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#E5EBD9', // Authentic OpenStreetMap cartographic terrain tone
        position: 'relative',
        overflow: 'hidden',
        fontFamily: Typography.fonts.body,
      }}
    >
      {/* 1. Vector Map Grid & Street Layout (Pilar Centro / Champagnat / FFCC San Martin) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${zoomScale})`,
          transformOrigin: `${centerX}px ${centerY}px`,
        }}
      >
        {/* Pilar River / Rio Luján natural green curve */}
        <path
          d="M -50,120 Q 120,160 250,80 T 450,140"
          fill="none"
          stroke="#C2D8C0"
          strokeWidth="36"
        />

        {/* Secondary Neighborhood Blocks / Parcels */}
        <rect x="20" y="160" width="80" height="70" rx="6" fill="#DDE5D0" />
        <rect x="120" y="150" width="90" height="85" rx="6" fill="#DDE5D0" />
        <rect x="230" y="170" width="130" height="60" rx="6" fill="#DDE5D0" />

        <rect x="30" y="270" width="110" height="90" rx="6" fill="#DDE5D0" />
        <rect x="160" y="260" width="90" height="110" rx="6" fill="#DDE5D0" />
        <rect x="270" y="250" width="100" height="80" rx="6" fill="#DDE5D0" />

        <rect x="40" y="400" width="90" height="120" rx="6" fill="#DDE5D0" />
        <rect x="150" y="410" width="100" height="100" rx="6" fill="#DDE5D0" />
        <rect x="270" y="380" width="100" height="130" rx="6" fill="#DDE5D0" />

        {/* Plaza 12 de Octubre Park Reserve */}
        <rect x="140" y="540" width="110" height="90" rx="8" fill="#B8D6AD" />
        <text
          x="195"
          y="590"
          fill="#4A6B3D"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          PLAZA 12 DE OCTUBRE
        </text>

        {/* Main Arterial Roadways (Ruta 8 / Av. Tratado del Pilar / Caamaño) */}
        {/* Av. Tratado del Pilar */}
        <line
          x1="-20"
          y1="520"
          x2="420"
          y2="520"
          stroke="#FFFFFF"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <line
          x1="-20"
          y1="520"
          x2="420"
          y2="520"
          stroke="#F4B042"
          strokeWidth="4"
          strokeDasharray="10 8"
        />

        {/* Panamericana Branch */}
        <line
          x1="320"
          y1="-20"
          x2="320"
          y2="860"
          stroke="#FFFFFF"
          strokeWidth="18"
        />
        <line
          x1="320"
          y1="-20"
          x2="320"
          y2="860"
          stroke="#F4B042"
          strokeWidth="4"
          strokeDasharray="14 10"
        />

        {/* Local Streets Network */}
        <line x1="20" y1="245" x2="380" y2="245" stroke="#FFFFFF" strokeWidth="8" />
        <line x1="20" y1="380" x2="380" y2="380" stroke="#FFFFFF" strokeWidth="10" />
        <line x1="150" y1="120" x2="150" y2="700" stroke="#FFFFFF" strokeWidth="8" />
        <line x1="260" y1="120" x2="260" y2="700" stroke="#FFFFFF" strokeWidth="8" />

        {/* Train Line (FFCC San Martín to Estación Pilar) */}
        <line
          x1="-20"
          y1="670"
          x2="420"
          y2="670"
          stroke="#7A7A7A"
          strokeWidth="4"
          strokeDasharray="6 6"
        />
        <text x="70" y="660" fill="#666666" fontSize="9" fontWeight="bold">
          FFCC SAN MARTÍN · ESTACIÓN PILAR
        </text>

        {/* Street Name Labels */}
        <text x="50" y="240" fill="#7D746D" fontSize="9" fontWeight="600">
          Calle Champagnat
        </text>
        <text x="60" y="374" fill="#7D746D" fontSize="9" fontWeight="600">
          Av. Honorio Pueyrredón
        </text>
        <text x="332" y="180" fill="#C27A23" fontSize="9" fontWeight="bold">
          Panamericana Ramal Pilar
        </text>

        {/* 2. Concentric Radar Scan Waves originating from Incident Point */}
        <circle
          cx={centerX}
          cy={centerY}
          r={wave1 * 260}
          fill="none"
          stroke={Colors.primary}
          strokeWidth="2.5"
          opacity={1.0 - wave1}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={wave2 * 260}
          fill="none"
          stroke={Colors.primary}
          strokeWidth="2"
          opacity={1.0 - wave2}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={wave3 * 260}
          fill="none"
          stroke={Colors.primary}
          strokeWidth="1.5"
          opacity={1.0 - wave3}
        />

        {/* Radar Scanning Sweep Cone */}
        <defs>
          <radialGradient id="radarSweepGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 138, 0, 0.4)" />
            <stop offset="70%" stopColor="rgba(255, 138, 0, 0.15)" />
            <stop offset="100%" stopColor="rgba(255, 138, 0, 0)" />
          </radialGradient>
        </defs>
        <circle cx={centerX} cy={centerY} r="180" fill="url(#radarSweepGlow)" />
      </svg>

      {/* 3. Lost Pet Marker Pin (Milo) */}
      {showMarkerPin && (
        <div
          style={{
            position: 'absolute',
            left: `${centerX}px`,
            top: `${centerY}px`,
            transform: `translate(-50%, -100%) scale(${pinScale}) translateY(${pinTranslateY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          {/* Floating Callout Label */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: `${Radius.full}px`,
              backgroundColor: 'rgba(230, 81, 0, 0.95)',
              color: Colors.white,
              fontSize: '11px',
              fontWeight: Typography.weights.extraBold,
              letterSpacing: '0.5px',
              boxShadow: '0 4px 12px rgba(230, 81, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <span>🚨</span>
            <span>MILO (PERDIDO) · RECOMPENSA $15.000</span>
          </div>

          {/* Pin Body */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50% 50% 50% 0',
              backgroundColor: Colors.primary,
              transform: 'rotate(-45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(90, 58, 31, 0.4)',
              border: '3px solid #FFFFFF',
            }}
          >
            <span
              style={{
                transform: 'rotate(45deg)',
                fontSize: '20px',
              }}
            >
              🐾
            </span>
          </div>

          {/* Ground Contact Shadow */}
          <div
            style={{
              width: '18px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              marginTop: '4px',
              filter: 'blur(1px)',
            }}
          />
        </div>
      )}

      {/* Secondary Marker: Luna (Plaza 12 de Octubre) */}
      <div
        style={{
          position: 'absolute',
          left: '195px',
          top: '560px',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 90,
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: Colors.secondary,
            border: '2px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(90, 58, 31, 0.25)',
          }}
        >
          <span style={{ fontSize: '14px' }}>🐾</span>
        </div>
        <div
          style={{
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            fontSize: '10px',
            fontWeight: Typography.weights.bold,
            color: Colors.text,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          Luna (Encontrada)
        </div>
      </div>

      {/* 4. Top Overlay HUD: Leaflet Navigation & Active Zone */}
      <div
        style={{
          position: 'absolute',
          top: '52px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 200,
        }}
      >
        {/* Search / Radar Status Capsule */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: `${Radius.full}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${Colors.borderLight}`,
            boxShadow: '0 4px 16px rgba(90, 58, 31, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: Colors.primary,
              boxShadow: `0 0 8px ${Colors.primary}`,
            }}
          />
          <span
            style={{
              fontSize: '12px',
              fontWeight: Typography.weights.bold,
              color: Colors.text,
            }}
          >
            Radar Activo: {activeLandmark} (Radio 2.5 km)
          </span>
        </div>

        {/* Leaflet Attribution Badge */}
        <div
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            fontSize: '10px',
            fontWeight: Typography.weights.bold,
            color: Colors.textSecondary,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          }}
        >
          Leaflet · OpenStreetMap
        </div>
      </div>

      {/* 5. Bottom Map Compass & Zoom Floating Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 200,
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: Colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: Colors.text,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          +
        </div>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: Colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: Colors.text,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          -
        </div>
      </div>
    </div>
  );
};
