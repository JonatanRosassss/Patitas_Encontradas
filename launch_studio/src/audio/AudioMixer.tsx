import React from 'react';
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AudioMixerProps {
  version: 'typography' | 'voiceover';
}

export const AudioMixer: React.FC<AudioMixerProps> = ({ version }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig(); // 60 fps
  const currentTimeSec = frame / fps;

  // Speech active intervals in seconds [start, end]
  const speechIntervals: [number, number][] = [
    [0.80, 9.78],   // Act 1
    [11.20, 21.78], // Act 2
    [23.00, 31.33], // Act 3
    [35.00, 42.75], // Act 4
    [45.00, 51.65], // Act 5
    [57.00, 65.74], // Act 6
  ];

  // Dynamic ducking for version B
  let duckingMultiplier = 1.0;
  if (version === 'voiceover') {
    const isSpeaking = speechIntervals.some(
      ([start, end]) => currentTimeSec >= start - 0.25 && currentTimeSec <= end + 0.35
    );
    duckingMultiplier = isSpeaking ? 0.22 : 0.70;
  } else {
    duckingMultiplier = 0.85;
  }

  // Smooth master music volume curve (fade in initial 0.5s, fade out final 1.5s)
  const masterMusicVolume = (f: number) => {
    const fadeIn = interpolate(f, [0, 30], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(f, [4000, 4080], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return fadeIn * fadeOut * duckingMultiplier;
  };

  return (
    <>
      {/* 1. Master 48kHz Stereo Orchestral Score */}
      <Audio
        src={staticFile('audio/orchestral_soundtrack_48k.mp3')}
        volume={masterMusicVolume}
      />

      {/* 2. Tactile SFX Schedule (Synchronized on 60fps frames) */}
      {/* Act 1 */}
      <Sequence from={90} durationInFrames={60}>
        <Audio src={staticFile('audio/sfx/push_notification.wav')} volume={0.85} />
      </Sequence>
      <Sequence from={552} durationInFrames={50}>
        <Audio src={staticFile('audio/sfx/camera_drift_whoosh.wav')} volume={0.60} />
      </Sequence>

      {/* Act 2 */}
      <Sequence from={720} durationInFrames={84}>
        <Audio src={staticFile('audio/sfx/radar_ping_sonar.wav')} volume={0.75} />
      </Sequence>
      <Sequence from={930} durationInFrames={84}>
        <Audio src={staticFile('audio/sfx/radar_ping_sonar.wav')} volume={0.70} />
      </Sequence>
      <Sequence from={1020} durationInFrames={45}>
        <Audio src={staticFile('audio/sfx/map_tile_zoom.wav')} volume={0.65} />
      </Sequence>

      {/* Act 3 */}
      <Sequence from={1500} durationInFrames={30}>
        <Audio src={staticFile('audio/sfx/haptic_tap.wav')} volume={0.70} />
      </Sequence>
      <Sequence from={1650} durationInFrames={30}>
        <Audio src={staticFile('audio/sfx/camera_shutter_snap.wav')} volume={0.80} />
      </Sequence>
      <Sequence from={2040} durationInFrames={72}>
        <Audio src={staticFile('audio/sfx/reward_badge_chime.wav')} volume={0.85} />
      </Sequence>

      {/* Act 4 */}
      <Sequence from={2100} durationInFrames={30}>
        <Audio src={staticFile('audio/sfx/haptic_tap.wav')} volume={0.70} />
      </Sequence>
      <Sequence from={2310} durationInFrames={45}>
        <Audio src={staticFile('audio/sfx/whatsapp_sent_whoosh.wav')} volume={0.80} />
      </Sequence>
      <Sequence from={2400} durationInFrames={90}>
        <Audio src={staticFile('audio/sfx/cinematic_riser.wav')} volume={0.85} />
      </Sequence>

      {/* Act 5 */}
      <Sequence from={2640} durationInFrames={120}>
        <Audio src={staticFile('audio/sfx/climax_braam_impact.wav')} volume={1.00} />
      </Sequence>
      <Sequence from={2730} durationInFrames={90}>
        <Audio src={staticFile('audio/sfx/success_sparkle.wav')} volume={0.80} />
      </Sequence>

      {/* Act 6 */}
      <Sequence from={3360} durationInFrames={40}>
        <Audio src={staticFile('audio/sfx/telemetry_hud_tick.wav')} volume={0.75} />
      </Sequence>
      <Sequence from={3840} durationInFrames={90}>
        <Audio src={staticFile('audio/sfx/brand_stamp_thud.wav')} volume={0.90} />
      </Sequence>

      {/* 3. Argentine Institutional Voiceover Tracks (Version B only) */}
      {version === 'voiceover' && (
        <>
          {/* Act 1 VO */}
          <Sequence from={48} durationInFrames={540}>
            <Audio src={staticFile('audio/vo/vo_act1.mp3')} volume={1.0} />
          </Sequence>

          {/* Act 2 VO */}
          <Sequence from={672} durationInFrames={635}>
            <Audio src={staticFile('audio/vo/vo_act2.mp3')} volume={1.0} />
          </Sequence>

          {/* Act 3 VO */}
          <Sequence from={1380} durationInFrames={500}>
            <Audio src={staticFile('audio/vo/vo_act3.mp3')} volume={1.0} />
          </Sequence>

          {/* Act 4 VO */}
          <Sequence from={2100} durationInFrames={465}>
            <Audio src={staticFile('audio/vo/vo_act4.mp3')} volume={1.0} />
          </Sequence>

          {/* Act 5 VO */}
          <Sequence from={2700} durationInFrames={400}>
            <Audio src={staticFile('audio/vo/vo_act5.mp3')} volume={1.0} />
          </Sequence>

          {/* Act 6 VO */}
          <Sequence from={3420} durationInFrames={525}>
            <Audio src={staticFile('audio/vo/vo_act6.mp3')} volume={1.0} />
          </Sequence>
        </>
      )}
    </>
  );
};
