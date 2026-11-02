import React from 'react';
import { Composition } from 'remotion';
import './theme/typography.css';
import { VideoMetrics } from './theme/tokens';
import { PatitasLaunchTypography } from './compositions/PatitasLaunchTypography';
import { PatitasLaunchVoiceover } from './compositions/PatitasLaunchVoiceover';

export const Root: React.FC = () => {
  return (
    <>
      {/* Version A: Typography + Orchestral Score + Procedural SFX */}
      <Composition
        id="PatitasLaunchTypography"
        component={PatitasLaunchTypography}
        durationInFrames={VideoMetrics.durationInFrames}
        fps={VideoMetrics.fps}
        width={VideoMetrics.width}
        height={VideoMetrics.height}
      />

      {/* Version B: Voiceover + Ducked Orchestral Score + Procedural SFX */}
      <Composition
        id="PatitasLaunchVoiceover"
        component={PatitasLaunchVoiceover}
        durationInFrames={VideoMetrics.durationInFrames}
        fps={VideoMetrics.fps}
        width={VideoMetrics.width}
        height={VideoMetrics.height}
      />
    </>
  );
};
