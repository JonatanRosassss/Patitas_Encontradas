import React from 'react';
import { Platform, Alert } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Mocks de Firebase Auth y Firestore
const mockGetIdToken = jest.fn().mockResolvedValue('jwt_mock_token_123');
const mockUser = {
  uid: 'usr_pilar_profesor',
  email: 'profesor@patitas.com',
  displayName: 'Profesor Cátedra',
  getIdToken: mockGetIdToken,
};

const mockSignInWithEmailAndPassword = jest.fn();
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockUpdateProfile = jest.fn().mockResolvedValue(undefined);
const mockSetDoc = jest.fn().mockResolvedValue(undefined);
const mockDoc = jest.fn((_db: unknown, coll: string, id: string) => ({ path: `${coll}/${id}` }));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignInWithEmailAndPassword(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUserWithEmailAndPassword(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  getAuth: jest.fn(() => ({ currentUser: mockUser })),
  initializeAuth: jest.fn(() => ({ currentUser: mockUser })),
  getReactNativePersistence: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: (_db: unknown, coll: string, id: string) => mockDoc(_db, coll, id),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

jest.mock('@/services/ConexionFirebase', () => ({
  obtenerAuth: jest.fn(() => ({ currentUser: mockUser })),
  obtenerFirestore: jest.fn(() => ({})),
  ConexionFirebase: {
    obtenerAuth: jest.fn(() => ({ currentUser: mockUser })),
    obtenerFirestore: jest.fn(() => ({})),
  },
}));

// Componentes bajo prueba
import LoginScreen from '../../app/(auth)/login';
import PantallaRegistro from '../../app/(auth)/register';
import WelcomeScreenView from '../../components/bienvenida/WelcomeScreenView';

describe('RF1 - Autenticación y Bienvenida Nativa Android (RNTL)', () => {
  let alertSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('Verifica el entorno de ejecución nativo Android', () => {
    expect(Platform.OS).toBe('android');
    const globalObj = globalThis as unknown as { window?: { alert?: unknown } };
    expect(typeof globalObj.window?.alert).not.toBe('function');
  });

  describe('TC-101 / TC-102 / TC-105: Registro y Validación Nativa Android', () => {
    it('TC-101: Dispara Alert.alert nativo cuando los campos de registro están vacíos', async () => {
      const { getByText } = await render(<PantallaRegistro />);
      const botonRegistrar = getByText('Registrarme');

      await act(async () => {
        fireEvent.press(botonRegistrar);
      });

      expect(alertSpy).toHaveBeenCalledWith(
        'Atención',
        'Por favor completá todos los campos requeridos.',
        undefined
      );
    });

    it('TC-102: Dispara Alert.alert nativo cuando las contraseñas no coinciden', async () => {
      const { getByPlaceholderText, getByText } = await render(<PantallaRegistro />);

      await act(async () => {
        fireEvent.changeText(getByPlaceholderText('Ej. Juan Pérez'), 'Carlos Gómez');
        fireEvent.changeText(getByPlaceholderText('ejemplo@correo.com'), 'carlos@pilar.com');
        fireEvent.changeText(getByPlaceholderText('Ej. 11 1234-5678'), '1155443322');
        fireEvent.changeText(getByPlaceholderText('Mínimo 6 caracteres'), 'clave123');
        fireEvent.changeText(getByPlaceholderText('Repetir contraseña'), 'claveDIFERENTE');
      });

      await act(async () => {
        fireEvent.press(getByText('Registrarme'));
      });

      expect(alertSpy).toHaveBeenCalledWith(
        'Atención',
        'Las contraseñas no coinciden.',
        undefined
      );
    });

    it('TC-105: Dispara Alert.alert nativo cuando la clave tiene menos de 6 caracteres', async () => {
      const { getByPlaceholderText, getByText } = await render(<PantallaRegistro />);

      await act(async () => {
        fireEvent.changeText(getByPlaceholderText('Ej. Juan Pérez'), 'Lucía Ramos');
        fireEvent.changeText(getByPlaceholderText('ejemplo@correo.com'), 'lucia@pilar.com');
        fireEvent.changeText(getByPlaceholderText('Ej. 11 1234-5678'), '1122334455');
        fireEvent.changeText(getByPlaceholderText('Mínimo 6 caracteres'), '123');
        fireEvent.changeText(getByPlaceholderText('Repetir contraseña'), '123');
      });

      await act(async () => {
        fireEvent.press(getByText('Registrarme'));
      });

      expect(alertSpy).toHaveBeenCalledWith(
        'Atención',
        'La contraseña debe tener al menos 6 caracteres.',
        undefined
      );
    });

    it('TC-105b: Dispara Alert.alert nativo en LoginScreen cuando el correo es inválido', async () => {
      const { getByPlaceholderText, getByText } = await render(<LoginScreen />);

      await act(async () => {
        fireEvent.changeText(getByPlaceholderText('Mail'), 'usuariocorreo_invalido');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), '123456');
      });

      await act(async () => {
        fireEvent.press(getByText('Ingresar'));
      });

      expect(alertSpy).toHaveBeenCalledWith(
        'Atención',
        'El formato no es valido'
      );
    });
  });

  describe('TC-103 / TC-104: Login Nativo Android', () => {
    it('TC-103: Autenticación exitosa guarda sesión en AsyncStorage y redirige a /(tabs)', async () => {
      mockSignInWithEmailAndPassword.mockResolvedValueOnce({
        user: mockUser,
      });

      const { getByPlaceholderText, getByText } = await render(<LoginScreen />);

      await act(async () => {
        fireEvent.changeText(getByPlaceholderText('Mail'), 'profesor@patitas.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), '123456');
      });

      await act(async () => {
        fireEvent.press(getByText('Ingresar'));
      });

      await waitFor(() => {
        expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'profesor@patitas.com',
          '123456'
        );
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'user_session',
          JSON.stringify({
            uid: mockUser.uid,
            token: 'jwt_mock_token_123',
            email: mockUser.email,
          })
        );
      });

      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });

    it('TC-104: Login fallido con contraseña incorrecta dispara diálogo nativo Alert.alert', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({
        code: 'auth/invalid-credential',
        message: 'Invalid credentials',
      });

      const { getByPlaceholderText, getByText } = await render(<LoginScreen />);

      await act(async () => {
        fireEvent.changeText(getByPlaceholderText('Mail'), 'profesor@patitas.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), 'ClaveErronea99');
      });

      await act(async () => {
        fireEvent.press(getByText('Ingresar'));
      });

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Acceso denegado',
          'Correo o contraseña incorrectos.'
        );
      });
    });
  });

  describe('WelcomeScreenView: Renderizado Nativo Android Compacto', () => {
    it('Renderiza acciones principales y conmuta entre píldoras de características', async () => {
      const mockComenzar = jest.fn();
      const mockInvitado = jest.fn();
      const mockSaltar = jest.fn();

      const { getByText } = await render(
        <WelcomeScreenView
          alComenzarAhora={mockComenzar}
          alExplorarComoInvitado={mockInvitado}
          alSaltar={mockSaltar}
        />
      );

      // Verificación de botones principales
      const botonComenzar = getByText('Comenzar ahora');
      const botonInvitado = getByText('Explorar como invitado');
      const botonSaltar = getByText('Saltar');

      expect(botonComenzar).toBeTruthy();
      expect(botonInvitado).toBeTruthy();
      expect(botonSaltar).toBeTruthy();

      await act(async () => {
        fireEvent.press(botonComenzar);
      });
      expect(mockComenzar).toHaveBeenCalledTimes(1);

      await act(async () => {
        fireEvent.press(botonInvitado);
      });
      expect(mockInvitado).toHaveBeenCalledTimes(1);

      await act(async () => {
        fireEvent.press(botonSaltar);
      });
      expect(mockSaltar).toHaveBeenCalledTimes(1);

      // Interacción con píldoras de características
      const pildoraReporte = getByText('Reporte rápido');
      await act(async () => {
        fireEvent.press(pildoraReporte);
      });
      expect(getByText(/Publicá una alerta/i)).toBeTruthy();

      const pildoraComunidad = getByText('Comunidad');
      await act(async () => {
        fireEvent.press(pildoraComunidad);
      });
      expect(getByText(/Vecinos unidos sin/i)).toBeTruthy();
    });
  });
});
