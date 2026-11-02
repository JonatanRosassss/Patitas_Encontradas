import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { TimelineActs, Colors, Typography } from '../theme/tokens';
import { Act1AlertSequence } from '../sequences/Act1AlertSequence';
import { Act2RadarSequence } from '../sequences/Act2RadarSequence';
import { Act3ReportSequence } from '../sequences/Act3ReportSequence';
import { Act4WhatsAppSequence } from '../sequences/Act4WhatsAppSequence';
import { Act5PayoffSequence } from '../sequences/Act5PayoffSequence';
import { Act6TelemetrySequence } from '../sequences/Act6TelemetrySequence';
import { AudioMixer } from '../audio/AudioMixer';

interface SubtitleItem {
  startFrame: number;
  endFrame: number;
  speaker: string;
  text: string;
}

const SUBTITLE_SCRIPT: SubtitleItem[] = [
  {
    startFrame: 48,
    endFrame: 588,
    speaker: 'Locución Institucional',
    text: 'En Pilar, cuando una mascota se pierde, cada minuto cuenta. El miedo y la desinformación colapsan los canales vecinales.',
  },
  {
    startFrame: 672,
    endFrame: 1307,
    speaker: 'Locución Institucional',
    text: 'Patitas Encontradas activa un radar georreferenciado en tiempo real. La comunidad entera recibe la alerta en un radio exacto, con mapas libres y costo cero.',
  },
  {
    startFrame: 1380,
    endFrame: 1880,
    speaker: 'Locución Institucional',
    text: 'Publicación en menos de treinta segundos: foto en alta definición, GPS preciso y recompensa comunitaria visible al instante.',
  },
  {
    startFrame: 2100,
    endFrame: 2565,
    speaker: 'Locución Institucional',
    text: 'Sin intermediarios ni burocracia. Un solo toque conecta directamente al rescatista con el dueño por WhatsApp.',
  },
  {
    startFrame: 2700,
    endFrame: 3100,
    speaker: 'Locución Institucional',
    text: '¡Mascota recuperada! La alerta se actualiza de inmediato para tranquilidad de todo el barrio.',
  },
  {
    startFrame: 3420,
    endFrame: 3945,
    speaker: 'Locución Institucional',
    text: 'Setenta y tres por ciento de reencuentros en menos de cuarenta y ocho horas. Tecnología barrial para un Pilar más seguro y conectado.',
  },
];

export const PatitasLaunchVoiceover: React.FC = () => {
  const frame = useCurrentFrame();

  // Find active subtitle if within range
  const activeSubtitle = SUBTITLE_SCRIPT.find(
    (item) => frame >= item.startFrame && frame <= item.endFrame
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0F0D0B' }}>
      {/* 1. Visual Sequences in Timeline Acts */}
      <Sequence from={TimelineActs.act1.startFrame} durationInFrames={TimelineActs.act1.durationFrames}>
        <Act1AlertSequence />
      </Sequence>

      <Sequence from={TimelineActs.act2.startFrame} durationInFrames={TimelineActs.act2.durationFrames}>
        <Act2RadarSequence />
      </Sequence>

      <Sequence from={TimelineActs.act3.startFrame} durationInFrames={TimelineActs.act3.durationFrames}>
        <Act3ReportSequence />
      </Sequence>

      <Sequence from={TimelineActs.act4.startFrame} durationInFrames={TimelineActs.act4.durationFrames}>
        <Act4WhatsAppSequence />
      </Sequence>

      <Sequence from={TimelineActs.act5.startFrame} durationInFrames={TimelineActs.act5.durationFrames}>
        <Act5PayoffSequence />
      </Sequence>

      <Sequence from={TimelineActs.act6.startFrame} durationInFrames={TimelineActs.act6.durationFrames}>
        <Act6TelemetrySequence />
      </Sequence>

      {/* 2. Subtitle Strip (Version B: Voiceover Support) */}
      {activeSubtitle && (
        <div
          style={{
            position: 'absolute',
            bottom: '44px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '1100px',
            padding: '12px 32px',
            borderRadius: '20px',
            backgroundColor: 'rgba(15, 13, 11, 0.88)',
            border: '1px solid rgba(255, 194, 138, 0.25)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            zIndex: 600,
            fontFamily: Typography.fonts.body,
          }}
        >
          <div
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 138, 0, 0.2)',
              border: `1px solid ${Colors.primary}`,
              color: Colors.primary,
              fontSize: '11px',
              fontWeight: Typography.weights.bold,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {activeSubtitle.speaker}
          </div>

          <div
            style={{
              fontSize: '18px',
              fontWeight: Typography.weights.semiBold,
              color: Colors.white,
              lineHeight: '26px',
              letterSpacing: '0.2px',
            }}
          >
            {activeSubtitle.text}
          </div>
        </div>
      )}

      {/* 3. Audio Track (Version B: Ducked BGM + VO + SFX) */}
      <AudioMixer version="voiceover" />
    </AbsoluteFill>
  );
};
