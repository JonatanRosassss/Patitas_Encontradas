/**
 * Interfaz de Usuario para la base de datos y autenticación.
 */
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  avatarUrl?: string;
  fechaCreacion?: string | number;
}
