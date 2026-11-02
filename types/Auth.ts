/**
 * Contratos de tipos para autenticación y gestión de credenciales.
 */

export interface CambiarContraseniaPayload {
  contraseniaActual: string;
  nuevaContrasenia: string;
  confirmarContrasenia: string;
}

export interface CambiarContraseniaModalProps {
  visible: boolean;
  alCerrar: () => void;
  emailUsuario?: string | null;
}
