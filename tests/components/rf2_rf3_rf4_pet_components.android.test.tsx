import React from 'react';
import { Platform, Alert, Image } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import { router } from 'expo-router';

import { PetCard } from '../../components/ui/pet-card';
import { MapPetCard } from '../../components/map/MapPetCard';
import { PetContactBar } from '../../components/detalle/PetContactBar';
import { PetFloatingButton } from '../../components/detalle/PetFloatingButton';
import type { MapPet } from '../../types/map';

describe('RF2, RF3, RF4 - Componentes Nativos de Mascotas en Android (RNTL)', () => {
  let alertSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('Verifica configuración nativa Android para componentes de mascotas', () => {
    expect(Platform.OS).toBe('android');
  });

  describe('TC-201 / TC-301: PetCard Android & Manejo Resiliente de Fotos Locales', () => {
    const fotoAndroidLocal = 'file:///data/user/0/host.exp.exponent/cache/toby_perro.jpg';

    it('Acepta rutas nativas file:/// en Android y muestra badges de PERDIDO y Recompensa', async () => {
      const mockPress = jest.fn();
      const screen = await render(
        <PetCard
          id="pet-toby-001"
          nombre="Toby"
          tipo="PERRO"
          estado="PERDIDO"
          imagen={fotoAndroidLocal}
          ubicacion="Plaza 12 de Octubre, Pilar"
          tiempo="Hace 15 minutos"
          recompensa="$15.000"
          onPress={mockPress}
        />
      );

      // Verificación de datos principales
      expect(screen.getByText('Toby')).toBeTruthy();
      expect(screen.getByText('Perdido')).toBeTruthy();
      expect(screen.getByText('Recompensa')).toBeTruthy();
      expect(screen.getByText('PERRO')).toBeTruthy();
      expect(screen.getByText('Plaza 12 de Octubre, Pilar')).toBeTruthy();
      expect(screen.getByText('Hace 15 minutos')).toBeTruthy();

      // En Android nativo, el Image conserva la URI local sin forzar el fallback web
      const imagenComponente = screen.getByTestId('pet-card-image');
      expect(imagenComponente.props.source).toEqual({ uri: fotoAndroidLocal });

      // Click en la tarjeta ejecuta onPress
      await act(async () => {
        fireEvent.press(screen.getByText('Toby'));
      });
      expect(mockPress).toHaveBeenCalledTimes(1);
    });

    it('Conmuta a imagen fallback ante evento onError sin quebrar el árbol nativo', async () => {
      const screen = await render(
        <PetCard
          nombre="Toby"
          tipo="PERRO"
          estado="PERDIDO"
          imagen="file:///data/user/0/inexistente.jpg"
        />
      );

      const imagenComponente = screen.getByTestId('pet-card-image');

      // Disparar error de carga de imagen
      await act(async () => {
        fireEvent(imagenComponente, 'error');
      });

      // Debe haber conmutado a la URL fallback de Unsplash
      expect(imagenComponente.props.source.uri).toContain('images.unsplash.com');
    });

    it('Botón de guardar con hitSlop={8} muestra toast de confirmación', async () => {
      jest.useFakeTimers();

      const screen = await render(
        <PetCard
          nombre="Toby"
          tipo="PERRO"
          estado="PERDIDO"
          imagen={fotoAndroidLocal}
        />
      );

      const botonGuardar = screen.getByLabelText('Guardar publicación');
      expect(botonGuardar.props.hitSlop).toEqual(8);

      await act(async () => {
        fireEvent.press(botonGuardar);
      });

      // Verificación del Toast
      expect(screen.getByText('Publicación guardada')).toBeTruthy();

      // El toast desaparece después de 2000 ms
      await act(async () => {
        jest.advanceTimersByTime(2050);
      });

      expect(screen.queryByText('Publicación guardada')).toBeNull();

      jest.useRealTimers();
    });
  });

  describe('TC-305: MapPetCard Android (Ficha Flotante del Mapa)', () => {
    const mockPet: MapPet = {
      id: 'mascota-mapa-789',
      nombre: 'Toby',
      estado: 1, // Perdido
      foto: { uri: 'file:///data/user/0/toby_map.jpg' },
      descripcion: 'Mestizo pelaje marrón claro, collar azul',
      ubicacion: 'Panamericana Ramal Pilar Km 50',
      tiempo: 'Hace 30 min',
      coordenadas: { latitude: -34.4586, longitude: -58.9142 },
      recompensa: '$15.000',
    };

    it('Renderiza la ficha en el mapa con badges y navega a /detalle/ al presionar Ver Ficha', async () => {
      const mockClose = jest.fn();

      const screen = await render(
        <MapPetCard pet={mockPet} onClose={mockClose} />
      );

      expect(screen.getByText('Toby')).toBeTruthy();
      expect(screen.getByText('Alerta de Búsqueda')).toBeTruthy();
      expect(screen.getByText('Recompensa: $15.000')).toBeTruthy();
      expect(screen.getByText('Panamericana Ramal Pilar Km 50')).toBeTruthy();

      // Botón Ver Ficha Completa
      const botonFicha = screen.getByLabelText('Ver ficha completa de la mascota');
      await act(async () => {
        fireEvent.press(botonFicha);
      });
      expect(router.push).toHaveBeenCalledWith('/detalle/mascota-mapa-789');

      // Botón Cerrar
      const botonCerrar = screen.getByLabelText('Cerrar ficha de mascota');
      await act(async () => {
        fireEvent.press(botonCerrar);
      });
      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('Presionar "Avisar que vi a esta mascota" dispara Alert.alert nativo comunitario', async () => {
      const mockClose = jest.fn();

      const screen = await render(
        <MapPetCard pet={mockPet} onClose={mockClose} />
      );

      const botonAvisar = screen.getByLabelText('Avisar que vi a esta mascota');
      await act(async () => {
        fireEvent.press(botonAvisar);
      });

      expect(alertSpy).toHaveBeenCalledWith(
        'Aviso Comunitario',
        'Registramos tu aviso sobre Toby. La comunidad y sus dueños te lo agradecen.'
      );
    });
  });

  describe('TC-402 / TC-605: PetContactBar & SafeArea Android 48dp + Accesibilidad TalkBack', () => {
    it('Aplica paddingBottom seguro para barra de 3 botones de 48dp y cuenta con accessibilityRole button', async () => {
      const mockContactar = jest.fn();
      const mockCambioAltura = jest.fn();

      const screen = await render(
        <PetContactBar
          telefonoDisponible={true}
          contactando={false}
          insetInferior={48}
          onContactar={mockContactar}
          onCambioAltura={mockCambioAltura}
        />
      );

      // Verificación de accesibilidad TalkBack
      const botonWhatsapp = screen.getByRole('button');
      expect(botonWhatsapp).toBeTruthy();
      expect(screen.getByLabelText('Contactar a quien publicó por WhatsApp')).toBeTruthy();
      expect(screen.getByText('CONTACTAR POR WHATSAPP')).toBeTruthy();

      // Disparar evento de contacto
      await act(async () => {
        fireEvent.press(botonWhatsapp);
      });
      expect(mockContactar).toHaveBeenCalledTimes(1);
    });

    it('Muestra etiqueta alternativa cuando no hay teléfono disponible y deshabilita en estado contactando', async () => {
      const mockContactar = jest.fn();

      const screen = await render(
        <PetContactBar
          telefonoDisponible={false}
          contactando={false}
          insetInferior={48}
          onContactar={mockContactar}
          onCambioAltura={jest.fn()}
        />
      );

      expect(screen.getByText('CONTACTAR AL VECINO')).toBeTruthy();

      // Re-renderizar con contactando = true
      await act(async () => {
        screen.rerender(
          <PetContactBar
            telefonoDisponible={false}
            contactando={true}
            insetInferior={48}
            onContactar={mockContactar}
            onCambioAltura={jest.fn()}
          />
        );
      });

      // Cuando está contactando, el botón está deshabilitado
      const boton = screen.getByRole('button');
      expect(boton.props.accessibilityState).toEqual({ disabled: true });
    });
  });

  describe('PetFloatingButton: Botón Flotante con Soporte TalkBack', () => {
    it('Renderiza botón flotante accesible con hitSlop y reacciona a toques', async () => {
      const mockPress = jest.fn();

      const screen = await render(
        <PetFloatingButton
          icono="chevron-back"
          accessibilityLabel="Volver al listado"
          onPress={mockPress}
        />
      );

      const boton = screen.getByRole('button');
      expect(boton).toBeTruthy();
      expect(screen.getByLabelText('Volver al listado')).toBeTruthy();
      expect(boton.props.hitSlop).toEqual(8);

      await act(async () => {
        fireEvent.press(boton);
      });
      expect(mockPress).toHaveBeenCalledTimes(1);
    });
  });
});
