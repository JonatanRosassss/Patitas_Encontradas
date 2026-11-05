import React from 'react';
import { Composition } from 'remotion';
import './theme/typography.css';
import { VideoMetrics } from './theme/tokens';
import { PatitasLaunchTypography } from './compositions/PatitasLaunchTypography';
import { PatitasLaunchVoiceover } from './compositions/PatitasLaunchVoiceover';
import { PatitasFastDynamicLaunch } from './compositions/PatitasFastDynamicLaunch';

export const Root: React.FC = () => {
  return (
    <>
      {/* Fast Dynamic Tech Launch (Bring Any Agent + Gemini Inspiration, 32s, 60fps, No Voiceover) */}
      <Composition
        id="PatitasFastDynamicLaunch"
        component={PatitasFastDynamicLaunch}
        durationInFrames={1920}
        fps={60}
        width={1920}
        height={1080}
      />

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
