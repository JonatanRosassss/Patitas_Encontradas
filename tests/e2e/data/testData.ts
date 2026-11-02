/**
 * Datos de prueba tipados para la suite E2E de Patitas Encontradas.
 * Diseñado bajo directivas ISTQB y Playwright TypeScript (cero tipos `any`).
 */

export interface TestUserCredentials {
  readonly emailValido: string;
  readonly emailInvalido: string;
  readonly passwordCorta: string;
  readonly passwordValida: string;
  readonly passwordNoCoincide: string;
  readonly nombreCompleto: string;
  readonly telefonoValido: string;
}

export interface SupportTicketTestData {
  readonly nombre: string;
  readonly emailValido: string;
  readonly emailInvalido: string;
  readonly tituloValido: string;
  readonly tituloCorto: string;
  readonly descripcionCorta: string;
  readonly descripcionValida: string;
}

export interface SearchQueriesData {
  readonly canicheConEspacios: string;
  readonly zonaVillaRosa: string;
  readonly inexistenteDinosaurio: string;
}

export interface ExpectedMessages {
  readonly loginEmailInvalido: string;
  readonly loginPassCorta: string;
  readonly registerCamposRequeridos: string;
  readonly registerPassNoCoinciden: string;
  readonly registerPassCorta: string;
  readonly ticketNombreRequerido: string;
  readonly ticketEmailRequerido: string;
  readonly ticketTituloRequerido: string;
  readonly ticketDescripcionCorta: string;
}

export const TEST_CREDENTIALS: TestUserCredentials = {
  emailValido: 'juan.perez@unpilar.edu.ar',
  emailInvalido: 'usuariocorreo_invalido',
  passwordCorta: '123',
  passwordValida: 'Pilar2026!Segura',
  passwordNoCoincide: 'OtraPasswordDistinta999!',
  nombreCompleto: 'Juan Pérez',
  telefonoValido: '11 5555-8888',
};

export const SUPPORT_TICKET_DATA: SupportTicketTestData = {
  nombre: 'Juan Pérez',
  emailValido: 'juan.perez@unpilar.edu.ar',
  emailInvalido: 'correo_sin_arroba',
  tituloValido: 'Error al cargar foto en avistamiento',
  tituloCorto: 'Bug',
  descripcionCorta: 'Falla al subir', // 14 caracteres (< 15) para disparar la validación en caliente
  descripcionValida: 'Al presionar el selector de cámara para adjuntar la foto del perro avistado en Champagnat, la pantalla se congela y no sube el archivo a Firebase.',
};

export const SEARCH_QUERIES: SearchQueriesData = {
  canicheConEspacios: ' cAnIcHe ',
  zonaVillaRosa: 'VILLA ROSA',
  inexistenteDinosaurio: 'Dinosaurio123',
};

export const EXPECTED_MESSAGES: ExpectedMessages = {
  loginEmailInvalido: 'El formato no es valido',
  loginPassCorta: 'La contrasenia debe tener minimo 6 caracteres',
  registerCamposRequeridos: 'Por favor completá todos los campos requeridos.',
  registerPassNoCoinciden: 'Las contraseñas no coinciden.',
  registerPassCorta: 'La contraseña debe tener al menos 6 caracteres.',
  ticketNombreRequerido: 'El nombre de contacto es obligatorio.',
  ticketEmailRequerido: 'El correo de contacto es obligatorio.',
  ticketTituloRequerido: 'El título o asunto es obligatorio.',
  ticketDescripcionCorta: 'Explicá lo sucedido con más detalle (mínimo 15 caracteres).',
};

export const WELCOME_PILLARS_DATA = [
  { id: 'mapa', label: 'Mapa en vivo', prefix: 'Tu red barrial para' },
  { id: 'reporte', label: 'Reporte rápido', prefix: 'Publicá una alerta' },
  { id: 'comunidad', label: 'Comunidad', prefix: 'Vecinos unidos sin' },
] as const;

export const FEED_FILTERS_DATA = [
  'Todos',
  'Perdidos',
  'Encontrados',
] as const;

export const FAQ_CATEGORIES_DATA = [
  'Todas',
  'Publicaciones',
  'Mapa',
  'Avistamientos',
  'Cuenta',
] as const;
