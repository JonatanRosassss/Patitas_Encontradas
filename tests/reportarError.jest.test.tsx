
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TicketForm } from '../components/soporte/TicketForm';
import { enviarTicketSoporte } from '../services/soporteService';

jest.mock('@/services/AuthContext', () => ({
  useAuth: () => ({
    usuario: {
      uid: 'usuario-test',
      email: 'sol@test.com',
      displayName: 'Usuario Test',
    },
  }),
}));

jest.mock('@/services/soporteService', () => ({
  enviarTicketSoporte: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('Reporte de errores - TicketForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el formulario de reporte', () => {
    const { getByText } = render(<TicketForm />);

    expect(getByText('Generar Ticket de Soporte')).toBeTruthy();
    expect(getByText('Motivo del reporte')).toBeTruthy();
    expect(getByText('Enviar Ticket a Soporte')).toBeTruthy();
  });

  it('valida los campos obligatorios al intentar enviar vacío', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByLabelText, getByText } = render(<TicketForm />);

    fireEvent.press(getByLabelText('Enviar Ticket a Soporte'));

    expect(alertSpy).toHaveBeenCalledWith(
      'Datos incompletos',
      expect.any(String),
    );
    expect(getByText('El título o asunto es obligatorio.')).toBeTruthy();

    alertSpy.mockRestore();
  });

  it('envía el ticket con los datos válidos', async () => {
    (enviarTicketSoporte as jest.Mock).mockResolvedValue('ticket123');

    const { getByPlaceholderText, getByLabelText } = render(
      <TicketForm />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Ej: No se cargan las fotos de avistamientos'),
      'Error al cargar fotos',
    );

    fireEvent.changeText(
      getByPlaceholderText('Explicá lo sucedido con el mayor detalle posible...'),
      'La aplicación no permite cargar las fotos de mi mascota.',
    );

    fireEvent.press(getByLabelText('Enviar Ticket a Soporte'));

    await waitFor(() => {
      expect(enviarTicketSoporte).toHaveBeenCalledWith(
        expect.objectContaining({
          usuarioId: 'usuario-test',
          nombreContacto: 'Usuario Test',
          emailContacto: 'sol@test.com',
          tipoProblema: 'ERROR_TECNICO',
          titulo: 'Error al cargar fotos',
          descripcion:
            'La aplicación no permite cargar las fotos de mi mascota.',
        }),
      );
    });

    expect(getByLabelText('Cerrar confirmación de ticket')).toBeTruthy();
  });

  it('muestra un error si falla el envío del ticket', async () => {
    jest
      .spyOn(Alert, 'alert')
      .mockImplementation(() => {});

    (enviarTicketSoporte as jest.Mock).mockRejectedValue(
      new Error('Error de conexión'),
    );

    const { getByPlaceholderText, getByLabelText } = render(
      <TicketForm />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Ej: No se cargan las fotos de avistamientos'),
      'Error al cargar fotos',
    );

    fireEvent.changeText(
      getByPlaceholderText('Explicá lo sucedido con el mayor detalle posible...'),
      'La aplicación no permite cargar las fotos de mi mascota.',
    );

    fireEvent.press(getByLabelText('Enviar Ticket a Soporte'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error de conexión',
        'Error de conexión',
      );
    });

    jest.restoreAllMocks();
  });
});
