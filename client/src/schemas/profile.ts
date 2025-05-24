import { z } from "zod";

export const perfilUsuarioSchema = z.object({
  nombres: z.string().min(1, "Los nombres son requeridos"),
  apellidos: z.string().min(1, "Los apellidos son requeridos"),
  email: z.string().email("Correo electrónico inválido"),
  dni: z.string().min(1, "El DNI es requerido"),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});