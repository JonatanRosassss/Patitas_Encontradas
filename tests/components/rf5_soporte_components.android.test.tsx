import React from 'react';
import { Platform, Alert } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import { FaqAccordion } from '../../components/soporte/FaqAccordion';
import { TicketForm } from '../../components/soporte/TicketForm';
import { PREGUNTAS_FRECUENTES } from '../../data/faqsData';

// Mock de soporteService
const mockEnviarTicketSoporte = jest.fn();
jest.mock('@/services/soporteService', () => ({
  enviarTicketSoporte: (...args: unknown[]) => mockEnviarTicketSoporte(...args),
}));

// Mock de AuthContext
jest.mock('@/services/AuthContext', () => ({
  useAuth: () => ({
    usuario: null,
    perfilUsuario: null,
  }),
}));

describe('RF5 - Componentes Nativos de Soporte en Android (RNTL)', () => {
  let alertSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('Verifica configuración nativa Android en componentes de soporte', () => {
    expect(Platform.OS).toBe('android');
  });

  describe('TC-503: FaqAccordion Android + LayoutAnimation', () => {
    it('Renderiza las 9 preguntas iniciales y chips con contadores', async () => {
      const { getByText } = await render(<FaqAccordion />);

      // Título de la sección
      expect(getByText('Preguntas Frecuentes')).toBeTruthy();

      // Verificar chips de categorías
      expect(getByText('Todas')).toBeTruthy();
      expect(getByText('Publicaciones')).toBeTruthy();
      expect(getByText('Mapa')).toBeTruthy();
      expect(getByText('Avistamientos')).toBeTruthy();
      expect(getByText('Cuenta')).toBeTruthy();

      // Contador total (9 preguntas cargadas)
      expect(PREGUNTAS_FRECUENTES.length).toBe(9);
      expect(getByText('9')).toBeTruthy();
    });

    it('Filtra preguntas por categoría y expande/colapsa respuestas con feedback de accesibilidad', async () => {
      const { getByText, queryByText } = await render(<FaqAccordion />);

      // Filtrar por categoría "Mapa"
      const chipMapa = getByText('Mapa');
      await act(async () => {
        fireEvent.press(chipMapa);
      });

      // Preguntas del mapa deben estar visibles
      const preguntaMapa = getByText(/¿Cómo filtro las mascotas en el mapa\?/i);
      expect(preguntaMapa).toBeTruthy();

      // Respuesta no visible antes de pulsar
      expect(queryByText(/En la pantalla del Mapa/i)).toBeNull();

      // Pulsar la pregunta para expandir
      await act(async () => {
        fireEvent.press(preguntaMapa);
      });

      // Respuesta visible tras expandir
      expect(getByText(/En la pantalla del Mapa/i)).toBeTruthy();

      // Pulsar de nuevo para colapsar
      await act(async () => {
        fireEvent.press(preguntaMapa);
      });
      expect(queryByText(/En la pantalla del Mapa/i)).toBeNull();
    });
  });

  describe('TC-504: TicketForm Envío Exitoso Android', () => {
    it('Envía ticket a soporte pasando dispositivo android y abre Modal de confirmación con código #TKT', async () => {
      mockEnviarTicketSoporte.mockResolvedValueOnce('doc_ticket_456789');

      const mockSuccess = jest.fn();
      const { getByPlaceholderText, getByText, getByLabelText } = await render(
        <TicketForm onSuccess={mockSuccess} />
      );

      // Completar campos del formulario
      await act(async () => {
        fireEvent.changeText(getByPlaceholderText('Ej: Juan Pérez'), 'Juan Pérez');
        fireEvent.changeText(getByPlaceholderText('tu-correo@ejemplo.com'), 'vecino@mail.com');
        fireEvent.changeText(
          getByPlaceholderText('Ej: No se cargan las fotos de avistamientos'),
          'Error al cargar foto'
        );
        fireEvent.changeText(
          getByPlaceholderText('Explicá lo sucedido con el mayor detalle posible...'),
          'La galería se cierra en Android 13 Moto G52'
        );
      });

      // Presionar enviar
      const botonEnviar = getByLabelText('Enviar Ticket a Soporte');
      await act(async () => {
        fireEvent.press(botonEnviar);
      });

      await waitFor(() => {
        expect(mockEnviarTicketSoporte).toHaveBeenCalledWith({
          usuarioId: null,
          nombreContacto: 'Juan Pérez',
          emailContacto: 'vecino@mail.com',
          tipoProblema: 'ERROR_TECNICO',
          titulo: 'Error al cargar foto',
          descripcion: 'La galería se cierra en Android 13 Moto G52',
          dispositivo: 'android (Expo/React Native)',
        });
      });

      // Verificación de apertura del Modal de éxito con el código generado
      await waitFor(() => {
        expect(getByText('¡Ticket Enviado con Éxito!')).toBeTruthy();
        expect(getByText('#TKT-DOC_TICK')).toBeTruthy();
      });

      // Cerrar el modal mediante el botón "Entendido"
      const botonEntendido = getByText('Entendido');
      await act(async () => {
        fireEvent.press(botonEntendido);
      });

      expect(mockSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('TC-505: TicketForm Validación Negativa Android', () => {
    it('Impide el envío con campos vacíos, dispara diálogo nativo Alert.alert y muestra errores en rojo', async () => {
      const { getByLabelText, getByText } = await render(<TicketForm />);

      const botonEnviar = getByLabelText('Enviar Ticket a Soporte');
      await act(async () => {
        fireEvent.press(botonEnviar);
      });

      // No debe haber llamado a enviarTicketSoporte
      expect(mockEnviarTicketSoporte).not.toHaveBeenCalled();

      // Dispara diálogo nativo de alerta
      expect(alertSpy).toHaveBeenCalledWith(
        'Datos incompletos',
        'Por favor revisá los campos señalados en rojo antes de continuar.'
      );

      // Mensajes de error en pantalla
      expect(getByText('El nombre de contacto es obligatorio.')).toBeTruthy();
      expect(getByText('El correo de contacto es obligatorio.')).toBeTruthy();
      expect(getByText('El título o asunto es obligatorio.')).toBeTruthy();
      expect(getByText('La descripción del problema es obligatoria.')).toBeTruthy();
    });
  });
});
