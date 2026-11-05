import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'El Correo es obligatorio')
  .email('El formato no es valido');

export const loginSchema = z.object({
  email: emailSchema,
  contrasenia: z
    .string()
    .min(6, 'La contrasenia debe tener minimo 6 caracteres'),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type loginFormData = LoginFormData;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

