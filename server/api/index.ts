import express, { Express, Request, Response } from 'express'; 
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

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/aulas", aulasRoutes);
app.use("/profesores", profesorRoutes);
app.use("/estudiantes", estudianteRoutes);
app.use("/incidencias", incidenciaRoutes);
app.use("/asistencias", asistenciaRoutes);
app.use("/dashboard", dashboardRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'Server is healthy', timestamp: new Date().toISOString() });
});

export default app;