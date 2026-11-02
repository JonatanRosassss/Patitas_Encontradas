import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { DarkVoidStage } from '../components/stage/DarkVoidStage';
import { PhoneChassis } from '../components/stage/PhoneChassis';
import { MockDetailView } from '../components/ui/MockDetailView';

export interface Act3ReportSequenceProps {
  // Configurable options
}

export const Act3ReportSequence: React.FC<Act3ReportSequenceProps> = () => {
  const frame = useCurrentFrame();

  // Macro oblique perspective looking along the phone chassis (cinematic-shot macro angle)
  const rotateX = interpolate(frame, [0, 660], [28, 22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateY = interpolate(frame, [0, 660], [-16, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateZ = interpolate(frame, [0, 660], [6, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Macro camera push-in focusing closely on the info header and reward badge
  const cameraScale = interpolate(frame, [0, 660], [1.18, 1.38], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cameraTranslateX = interpolate(frame, [0, 660], [-15, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cameraTranslateY = interpolate(frame, [0, 660], [40, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Photo carousel swap from photo 0 to photo 1 around frame 300
  const activePhotoIndex = frame >= 300 ? 1 : 0;

  return (
    <DarkVoidStage
      cameraScale={cameraScale}
      cameraTranslateX={cameraTranslateX}
      cameraTranslateY={cameraTranslateY}
      glowIntensity={1.3}
    >
      <PhoneChassis
        rotateX={rotateX}
        rotateY={rotateY}
        rotateZ={rotateZ}
        scale={1.0}
      >
        <MockDetailView
          status="PERDIDO"
          name="Milo"
          species="Perro · Caniche Toy (Macho)"
          reward="Recompensa: $15.000"
          location="Barrio Champagnat, Pilar"
          activePhotoIndex={activePhotoIndex}
        />
      </PhoneChassis>
    </DarkVoidStage>
  );
};
