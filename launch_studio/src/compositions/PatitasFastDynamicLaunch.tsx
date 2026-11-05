import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CleanSaaSNarrativeExperience } from '../components/scenes/CleanSaaSNarrativeExperience';

export const PatitasFastDynamicLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig(); // 60 fps, total 1920 frames (32.0s)

  // Master music volume curve: fade in (0 to 30 frames), stay high, fade out (1860 to 1920 frames)
  const masterBgmVolume = (f: number) => {
    const fadeIn = interpolate(f, [0, 24], [0, 0.85], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(f, [1860, 1920], [0.85, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return Math.min(fadeIn, fadeOut);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAF8F5', overflow: 'hidden' }}>
      {/* =================================================================== */}
      {/* 1. MASTER HIGH-ENERGY GROOVE SOUNDTRACK (32s @ 126 BPM)             */}
      {/* =================================================================== */}
      <Audio
        src={staticFile('audio/bgm/fast_modern_groove.wav')}
        volume={masterBgmVolume}
      />

      {/* =================================================================== */}
      {/* 2. SYNCHRONIZED TACTILE SOUND EFFECTS SUITE                         */}
      {/* =================================================================== */}

      {/* Act 1 SFX: Tap "+ Publicar Mascota" & Transition Whoosh */}
      <Sequence from={250} durationInFrames={30}>
        <Audio src={staticFile('audio/sfx/touch_tap.wav')} volume={0.95} />
      </Sequence>
      <Sequence from={340} durationInFrames={50}>
        <Audio src={staticFile('audio/sfx/camera_drift_whoosh.wav')} volume={0.65} />
      </Sequence>

      {/* Act 2 SFX: Form Auto-fill, GPS Tap, Photo Drop, Save Tap */}
      <Sequence from={490} durationInFrames={25}>
        <Audio src={staticFile('audio/sfx/touch_tap.wav')} volume={0.90} />
      </Sequence>
      <Sequence from={540} durationInFrames={35}>
        <Audio src={staticFile('audio/sfx/camera_shutter.wav')} volume={0.70} />
      </Sequence>
      <Sequence from={680} durationInFrames={25}>
        <Audio src={staticFile('audio/sfx/touch_tap.wav')} volume={0.95} />
      </Sequence>

      {/* Act 3 SFX: Boost Modal Pop, Tap "¡Sí, impulsar!", Sparkle Chime */}
      <Sequence from={760} durationInFrames={35}>
        <Audio src={staticFile('audio/sfx/alert_ping.wav')} volume={0.60} />
      </Sequence>
      <Sequence from={910} durationInFrames={25}>
        <Audio src={staticFile('audio/sfx/touch_tap.wav')} volume={0.95} />
      </Sequence>
      <Sequence from={920} durationInFrames={60}>
        <Audio src={staticFile('audio/sfx/reward_chime.wav')} volume={0.85} />
      </Sequence>
      <Sequence from={930} durationInFrames={50}>
        <Audio src={staticFile('audio/sfx/gemini_sparkle.wav')} volume={0.75} />
      </Sequence>

      {/* Act 4 SFX: Community Sighting Push Banner, Tap, Radar Scan */}
      <Sequence from={1130} durationInFrames={40}>
        <Audio src={staticFile('audio/sfx/push_notification.wav')} volume={0.85} />
      </Sequence>
      <Sequence from={1250} durationInFrames={25}>
        <Audio src={staticFile('audio/sfx/touch_tap.wav')} volume={0.90} />
      </Sequence>
      <Sequence from={1275} durationInFrames={70}>
        <Audio src={staticFile('audio/sfx/radar_ping_gemini.wav')} volume={0.80} />
      </Sequence>

      {/* Act 5 SFX: Tap "Marcar como encontrado", Reunited Chord, Brand Stamp */}
      <Sequence from={1560} durationInFrames={25}>
        <Audio src={staticFile('audio/sfx/touch_tap.wav')} volume={0.95} />
      </Sequence>
      <Sequence from={1575} durationInFrames={80}>
        <Audio src={staticFile('audio/sfx/success_chord.wav')} volume={0.90} />
      </Sequence>
      <Sequence from={1590} durationInFrames={60}>
        <Audio src={staticFile('audio/sfx/gemini_sparkle.wav')} volume={0.75} />
      </Sequence>
      <Sequence from={1740} durationInFrames={80}>
        <Audio src={staticFile('audio/sfx/brand_stamp_thud.wav')} volume={0.80} />
      </Sequence>

      {/* =================================================================== */}
      {/* 3. VISUAL MASTER EXPERIENCE                                         */}
      {/* =================================================================== */}
      <CleanSaaSNarrativeExperience />
    </AbsoluteFill>
  );
};
