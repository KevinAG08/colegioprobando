import { z } from "zod";

export const profesorSchema = z
  .object({
    nombres: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellidos: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().optional(),
    dni: z.string().min(8, "DNI inválido").max(8, "DNI inválido"),
    rol: z.string(),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    aulaIds: z.array(z.string()).min(1, "Debe seleccionar al menos un aula"),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password.length >= 8;
      }
      return true;
    },
    {
      message: "La contraseña debe tener al menos 8 caracteres",
      path: ["password"],
    }
  );
