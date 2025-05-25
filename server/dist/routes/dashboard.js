"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const dashboard_1 = require("../controllers/dashboard");
const router = express_1.default.Router();
router.get("/estadisticas", (0, auth_1.authMiddleware)(["admin"]), dashboard_1.getEstadisticas);
router.get("/distribucion-aula", (0, auth_1.authMiddleware)(["admin"]), dashboard_1.getDistribucionAula);
router.get("/asistencia-semanal", (0, auth_1.authMiddleware)(["admin"]), dashboard_1.getAsistenciaSemanal);
router.get("/actividad-reciente", (0, auth_1.authMiddleware)(["admin"]), dashboard_1.getActividadReciente);
router.get("/estadisticas-profesor/:profesorId", (0, auth_1.authMiddleware)(["admin", "profesor"]), dashboard_1.getEstadisticasProfesor);
router.get("/distribucion-incidencia-profesor/:profesorId", (0, auth_1.authMiddleware)(["admin", "profesor"]), dashboard_1.getDistribuciónTipoIncidenciaProfesor);
router.get("/asistencia-semanal-profesor/:profesorId", (0, auth_1.authMiddleware)(["admin", "profesor"]), dashboard_1.getAsistenciaSemanalProfesor);
router.get("/actividad-reciente-profesor/:profesorId", (0, auth_1.authMiddleware)(["admin", "profesor"]), dashboard_1.getActividadRecienteProfesor);
exports.default = router;
