export enum UserRole {
  ADMIN = "admin",
  PROFESOR = "profesor",
}

export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  dni: string;
  rol: UserRole;
  direccion?: string;
  telefono?: string;
  aulas?: AulaProfesor[];
}

export interface AulaProfesor {
  id: string;
  aulaId: string;
  profesorId: string;
  aula: Aula;
}

export interface Estudiante {
  id: string;
  nombres: string;
  apellidos: string;
  email?: string;
  dni: string;
  apoderado?: string;
  telefono?: string;
  sexo?: string;
  fechaNacimiento?: Date;
  aulaId: string;
  aula: Aula;
}

export interface Aula {
  id: string;
  nombre: string;
  nivel: string;
}

export interface Incidencia {
  id: string;
  fecha: Date;
  hora?: string;
  lugar: string;
  tipoIncidencia: string;
  descripcion: string;
  medidasAdoptadas: string;
  userId: string;
  user: User;
  detalles: IncidenciaDetalle[];
}

export interface IncidenciaDetalle {
  id: string;
  incidenciaId: string;
  estudianteId: string;
  estudiante: Estudiante;
}

export interface Asistencia {
  id: string;
  fecha: Date;
  profesorId: string;
  profesor: User;
  aulaId: string;
  aula: Aula;
  detalles: AsistenciaDetalle[];
}

export interface AsistenciaDetalle {
  id: string;
  asistenciaId: string;
  asistencia: Asistencia;
  estudianteId: string;
  estudiante: Estudiante;
  estado: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  error: string | null;
}
