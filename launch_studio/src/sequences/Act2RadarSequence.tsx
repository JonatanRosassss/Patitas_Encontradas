import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { DarkVoidStage } from '../components/stage/DarkVoidStage';
import { PhoneChassis } from '../components/stage/PhoneChassis';
import { LeafletRadarScene } from '../components/map/LeafletRadarScene';

export interface Act2RadarSequenceProps {
  // Configurable options
}

export const Act2RadarSequence: React.FC<Act2RadarSequenceProps> = () => {
  const frame = useCurrentFrame();

  // Smooth rotation from slight oblique into high-angle map inspection
  const rotateX = interpolate(frame, [0, 240, 720], [22, 10, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateY = interpolate(frame, [0, 240, 720], [-14, -3, -1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateZ = interpolate(frame, [0, 240, 720], [5, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera drift & zoom into Barrio Champagnat incident zone
  const cameraScale = interpolate(frame, [0, 720], [1.02, 1.20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cameraTranslateY = interpolate(frame, [0, 720], [0, -25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <DarkVoidStage
      cameraScale={cameraScale}
      cameraTranslateY={cameraTranslateY}
      glowIntensity={1.2}
    >
      <PhoneChassis
        rotateX={rotateX}
        rotateY={rotateY}
        rotateZ={rotateZ}
        scale={1.0}
      >
        <LeafletRadarScene
          zoomScale={1.05}
          showMarkerPin={true}
          activeLandmark="Barrio Champagnat · Pilar"
        />
      </PhoneChassis>
    </DarkVoidStage>
  );
};
