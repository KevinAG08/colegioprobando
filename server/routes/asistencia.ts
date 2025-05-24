import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getAllAsistencias, getAsistenciasByAulaAndDate, saveAsistencias } from "../controllers/asistencia";

const router = express.Router();

// READ
router.get('/', authMiddleware(['admin']), getAllAsistencias);
router.get('/:aulaId/:fecha', authMiddleware(['admin', 'profesor']), getAsistenciasByAulaAndDate);

// UPDATE
router.post('/save', authMiddleware(['admin', 'profesor']), saveAsistencias);

export default router;