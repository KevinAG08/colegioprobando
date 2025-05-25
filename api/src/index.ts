import express, { Express } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from '../routes/auth';
import adminRoutes from '../routes/admin';
import aulasRoutes from '../routes/aula';
import profesorRoutes from '../routes/profesor';
import estudianteRoutes from '../routes/estudiante';
import incidenciaRoutes from '../routes/incidencia';
import asistenciaRoutes from '../routes/asistencia';
import dashboardRoutes from '../routes/dashboard';

dotenv.config();

const app: Express = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({
    origin: CLIENT_ORIGIN, 
    credentials: true,
}));

app.use(cookieParser())
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/aulas", aulasRoutes);
app.use("/profesores", profesorRoutes);
app.use("/estudiantes", estudianteRoutes);
app.use("/incidencias", incidenciaRoutes);
app.use("/asistencias", asistenciaRoutes);
app.use("/dashboard", dashboardRoutes);

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT_LOCAL = process.env.PORT || 5000;
  app.listen(PORT_LOCAL, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT_LOCAL}`);
  });
}