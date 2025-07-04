import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getActividadReciente, getActividadRecienteProfesor, getAsistenciaMensual, getAsistenciaSemanalProfesor, getDistribucionTipoIncidencia, getDistribuciónTipoIncidenciaProfesor, getEstadisticas, getEstadisticasProfesor } from "../controllers/dashboard";

const router = express.Router();

router.get("/estadisticas", authMiddleware(["admin"]), getEstadisticas);
router.get("/distribucion-incidencia", authMiddleware(["admin"]), getDistribucionTipoIncidencia);
router.get("/asistencia-mensual", authMiddleware(["admin"]), getAsistenciaMensual);
router.get("/actividad-reciente", authMiddleware(["admin"]), getActividadReciente);
router.get("/estadisticas-profesor/:profesorId", authMiddleware(["admin", "profesor"]), getEstadisticasProfesor);
router.get("/distribucion-incidencia-profesor/:profesorId", authMiddleware(["admin", "profesor"]), getDistribuciónTipoIncidenciaProfesor);
router.get("/asistencia-semanal-profesor/:profesorId", authMiddleware(["admin", "profesor"]), getAsistenciaSemanalProfesor);
router.get("/actividad-reciente-profesor/:profesorId", authMiddleware(["admin", "profesor"]), getActividadRecienteProfesor);

export default router;