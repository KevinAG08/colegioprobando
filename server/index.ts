import express, { Express } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import aulasRoutes from './routes/aula';
import profesorRoutes from './routes/profesor';
import estudianteRoutes from './routes/estudiante';
import incidenciaRoutes from './routes/incidencia';
import asistenciaRoutes from './routes/asistencia';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})


