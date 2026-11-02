import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { TimelineActs } from '../theme/tokens';
import { Act1AlertSequence } from '../sequences/Act1AlertSequence';
import { Act2RadarSequence } from '../sequences/Act2RadarSequence';
import { Act3ReportSequence } from '../sequences/Act3ReportSequence';
import { Act4WhatsAppSequence } from '../sequences/Act4WhatsAppSequence';
import { Act5PayoffSequence } from '../sequences/Act5PayoffSequence';
import { Act6TelemetrySequence } from '../sequences/Act6TelemetrySequence';
import { KineticText } from '../components/typography/KineticText';
import { AudioMixer } from '../audio/AudioMixer';

export const PatitasLaunchTypography: React.FC = () => {
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

      {/* 2. Synchronized Kinetic Typography Cards (Version A Display) */}
      {/* Act 1 Kinetic Text */}
      <KineticText
        startFrame={60}
        durationFrames={480}
        tag="EMERGENCIA BARRIAL"
        primaryText="EN PILAR, CADA MINUTO CUENTA"
        secondaryText="El pánico y la desinformación retrasan el rescate"
        accentWord="MINUTO"
        position="bottom"
      />

      {/* Act 2 Kinetic Text */}
      <KineticText
        startFrame={660}
        durationFrames={600}
        tag="MAPAS LIBRES & RESILIENTES"
        primaryText="RADAR GEORREFERENCIADO VIVO"
        secondaryText="OpenStreetMap + Leaflet · Costo de infraestructura $0"
        accentWord="RADAR"
        position="bottom"
      />

      {/* Act 3 Kinetic Text */}
      <KineticText
        startFrame={1380}
        durationFrames={540}
        tag="PUBLICACIÓN ÁGIL"
        primaryText="REPORTE EN 30 SEGUNDOS"
        secondaryText="Foto en alta definición · GPS exacto · $15.000 Recompensa"
        accentWord="30 SEGUNDOS"
        position="bottom"
      />

      {/* Act 4 Kinetic Text */}
      <KineticText
        startFrame={2040}
        durationFrames={480}
        tag="CERO BUROCRACIA"
        primaryText="1 TOQUE A WHATSAPP"
        secondaryText="Conexión instantánea y directa entre vecinos de Pilar"
        accentWord="WHATSAPP"
        position="bottom"
      />

      {/* Act 5 Kinetic Text */}
      <KineticText
        startFrame={2640}
        durationFrames={480}
        tag="IMPACTO COMUNITARIO"
        primaryText="¡ENCONTRADO!"
        secondaryText="Alerta resuelta · Milo regresa a su hogar en Pilar"
        accentWord="¡ENCONTRADO!"
        position="top"
      />

      {/* Act 6 Kinetic Text */}
      <KineticText
        startFrame={3240}
        durationFrames={540}
        tag="MUNICIPIO DEL PILAR"
        primaryText="73% RESCATADOS EN <48HS"
        secondaryText="Tecnología barrial para una comunidad conectada y segura"
        accentWord="73%"
        position="bottom"
      />

      {/* 3. Audio Track (Version A: Full BGM + SFX) */}
      <AudioMixer version="typography" />
    </AbsoluteFill>
  );
};
