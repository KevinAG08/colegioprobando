import { z } from "zod";

export const estudianteSchema = z.object({
  nombres: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("El email no es válido").optional(),
  dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres"),
  apoderado: z.string().optional(),
  telefono: z.string().optional(),
  sexo: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  aulaId: z.string().min(1, { message: "Debe seleccionar un aula" }),
});
