// services/authMock.ts

export const USUARIOS_MOCK = [
  {
    email: 'profesor@patitas.com',
    contrasenia: '123456',
    nombre: 'Profesor',
  },
  {
    email: 'admin@patitas.com',
    contrasenia: 'patitas123',
    nombre: 'Administrador',
  },
];

export const simularInicioSesion = (email: string, contrasenia: string) => {
  const usuario = USUARIOS_MOCK.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.contrasenia === contrasenia
  );
  return usuario;
};