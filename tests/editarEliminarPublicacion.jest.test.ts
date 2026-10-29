
jest.mock('@/services/ConexionFirebase', () => ({
  ConexionFirebase: {
    obtenerFirestore: jest.fn(() => ({ mocked: true })),
    obtenerStorage: jest.fn(() => ({ mocked: true })),
    obtenerAuth: jest.fn(() => ({ currentUser: { uid: 'usuario-1' } })),
  },
}));

jest.mock('@/services/notificaciones', () => ({
  notificarMascotaEncontrada: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db, nombre) => ({ db, nombre })),
  addDoc: jest.fn(),
  doc: jest.fn((db, coleccion, id) => ({ db, coleccion, id })),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => 'FECHA_SERVIDOR'),
  Timestamp: class Timestamp {},
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
}));

import {
  modificarAlertaMascota,
  eliminarAlertaMascota,
} from '../services/mascotasService';

import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

describe('Editar publicación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('actualiza los datos de la publicación correcta', async () => {
    await modificarAlertaMascota('publicacion-123', {
      nombre: 'Luna',
    } as any);

    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      'alertas',
      'publicacion-123'
    );

    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'publicacion-123' }),
      expect.objectContaining({
        nombre: 'Luna',
        fechaModificacion: 'FECHA_SERVIDOR',
      })
    );
  });

  test('propaga el error si Firebase falla al editar', async () => {
    (updateDoc as jest.Mock).mockRejectedValueOnce(
      new Error('Error de conexión')
    );

    await expect(
      modificarAlertaMascota('publicacion-123', {
        nombre: 'Luna',
      } as any)
    ).rejects.toThrow('Error de conexión');
  });
});

describe('Eliminar publicación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('elimina el documento correcto', async () => {
    await eliminarAlertaMascota('publicacion-456');

    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      'alertas',
      'publicacion-456'
    );

    expect(deleteDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'publicacion-456' })
    );
  });

  test('propaga el error si Firebase falla al eliminar', async () => {
    (deleteDoc as jest.Mock).mockRejectedValueOnce(
      new Error('No se pudo eliminar')
    );

    await expect(
      eliminarAlertaMascota('publicacion-456')
    ).rejects.toThrow('No se pudo eliminar');
  });
});
