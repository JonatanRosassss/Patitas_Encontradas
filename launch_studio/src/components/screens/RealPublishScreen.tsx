import React from 'react';
import { interpolate, useCurrentFrame, staticFile } from 'remotion';
import { Colors } from '../../theme/tokens';

export interface RealPublishScreenProps {
  typedName?: string;
  hasGpsLocked?: boolean;
  hasPhotoUploaded?: boolean;
  saveButtonScale?: number;
  highlightGps?: boolean;
  highlightSave?: boolean;
}

export const RealPublishScreen: React.FC<RealPublishScreenProps> = ({
  typedName = 'Milo',
  hasGpsLocked = true,
  hasPhotoUploaded = true,
  saveButtonScale = 1.0,
  highlightGps = false,
  highlightSave = false,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* 1. Status Bar */}
      <div
        style={{
          height: '44px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: 700,
          color: '#1A1612',
          paddingTop: '6px',
        }}
      >
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px' }}>􀙇</span>
          <span style={{ fontSize: '11px' }}>􀛨</span>
        </div>
      </div>

      {/* 2. Form Top Bar */}
      <div
        style={{
          padding: '8px 20px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            padding: '6px 12px',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8DFD8',
            fontSize: '13px',
            fontWeight: 700,
            color: '#5A3A1F',
          }}
        >
          ← Volver
        </div>
        <span
          style={{
            fontFamily: "'Baloo 2', cursive, sans-serif",
            fontSize: '22px',
            fontWeight: 800,
            color: '#5A3A1F',
          }}
        >
          Publicar Alerta
        </span>
      </div>

      {/* 3. Form Scroll Content */}
      <div
        style={{
          flex: 1,
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'hidden',
        }}
      >
        {/* Toggle Perdí / Encontré */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#EFE8E1',
            borderRadius: '14px',
            padding: '4px',
            gap: '4px',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#FF8A00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontWeight: 800,
              fontSize: '15px',
              boxShadow: '0 2px 8px rgba(255, 138, 0, 0.3)',
            }}
          >
            Perdí mi mascota
          </div>
          <div
            style={{
              flex: 1,
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8D735C',
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontWeight: 700,
              fontSize: '15px',
            }}
          >
            Encontré una
          </div>
        </div>

        {/* Input: Nombre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#5A3A1F' }}>
            Nombre de la mascota *
          </label>
          <div
            style={{
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #FF8A00',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              fontSize: '15px',
              fontWeight: 700,
              color: '#5A3A1F',
              boxShadow: '0 2px 8px rgba(255, 138, 0, 0.12)',
            }}
          >
            <span>{typedName}</span>
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '18px',
                backgroundColor: '#FF8A00',
                marginLeft: '2px',
                animation: 'blink 1s infinite',
              }}
            />
          </div>
        </div>

        {/* Especie Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#5A3A1F' }}>
            Especie
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '12px',
                backgroundColor: '#FFE7D2',
                border: '1.5px solid #FF8A00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF8A00',
                fontWeight: 800,
                fontSize: '14px',
              }}
            >
              🐶 Perro
            </div>
            <div
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8DFD8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8D735C',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              🐱 Gato
            </div>
            <div
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8DFD8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8D735C',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              🐾 Otro
            </div>
          </div>
        </div>

        {/* Ubicación & GPS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#5A3A1F' }}>
            Ubicación en Pilar *
          </label>
          <div
            style={{
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8DFD8',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              fontSize: '14px',
              color: '#5A3A1F',
              fontWeight: 600,
            }}
          >
            Del Viso, Pilar
          </div>

          {/* Botón GPS */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
            <div
              id="btn-usar-gps"
              style={{
                flex: 1,
                height: '36px',
                borderRadius: '10px',
                backgroundColor: highlightGps ? '#FF8A00' : '#FFFFFF',
                border: highlightGps ? '1px solid #FF8A00' : '1px solid #FF8A00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: highlightGps ? '#FFFFFF' : '#FF8A00',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: highlightGps ? '0 4px 14px rgba(255, 138, 0, 0.35)' : 'none',
              }}
            >
              <span>📍</span>
              <span>Usar mi GPS</span>
            </div>
          </div>

          {/* Badge Coordenadas Confirmadas */}
          {hasGpsLocked && (
            <div
              style={{
                marginTop: '4px',
                padding: '6px 12px',
                borderRadius: '10px',
                backgroundColor: '#E8F5E9',
                border: '1px solid #A5D6A7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#2E7D32',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <span>✅ GPS fijado: -34.4448, -58.7961</span>
              <span style={{ fontSize: '11px', color: '#1B5E20' }}>Del Viso</span>
            </div>
          )}
        </div>

        {/* Subir Fotos Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#5A3A1F' }}>
            Fotos de Milo
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {hasPhotoUploaded && (
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '14px',
                  backgroundColor: '#FFE7D2',
                  border: '2px solid #FF8A00',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255, 138, 0, 0.2)',
                  position: 'relative',
                }}
              >
                <img
                  src={staticFile('images/welcome_dog_badge.png')}
                  alt="Milo preview"
                  style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#2E7D32',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✓
                </div>
              </div>
            )}
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1.5px dashed #C2B4A8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8D735C',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '20px' }}>📷</span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>+ Foto</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Sticky Button: GUARDAR Y PUBLICAR */}
      <div
        style={{
          padding: '12px 20px 24px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #EFE8E1',
          boxShadow: '0 -4px 16px rgba(90, 58, 31, 0.05)',
        }}
      >
        <div
          id="btn-guardar-publicar"
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: '#FF8A00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: highlightSave
              ? '0 10px 28px rgba(255, 138, 0, 0.45), 0 0 0 3px rgba(255, 138, 0, 0.25)'
              : '0 6px 20px rgba(255, 138, 0, 0.32)',
            transform: `scale(${saveButtonScale})`,
            transition: 'transform 0.1s ease',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontSize: '18px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.5px',
            }}
          >
            GUARDAR Y PUBLICAR
          </span>
          <span style={{ fontSize: '18px', color: '#FFFFFF' }}>🚀</span>
        </div>
      </div>
    </div>
  );
};
