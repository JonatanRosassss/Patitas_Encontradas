import { z } from 'zod';


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El Correo es obligatorio")
    .email("El formato no es valido"),
  constrasenia: z
    .string()
    .min(6, "La contrasenia debe tener minimo 6 caracteres"),
}
);

export type loginFormData = z.infer<typeof loginSchema>;
