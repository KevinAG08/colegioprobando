import express from "express";
import { authMiddleware } from "../middleware/auth";
import { deleteIncidenciaById, editarIncidenciaById, getIncidencias, getIncidenciasById, getIncidenciasByProfesorId, registerIncidencia } from "../controllers/incidencia";

const router = express.Router();

// READ
router.get("/", authMiddleware(['admin']), getIncidencias);
router.get("/:id", authMiddleware(['admin', 'profesor']), getIncidenciasById);
router.get("/profesor/:profesorId", authMiddleware(['admin', 'profesor']), getIncidenciasByProfesorId);

// CREATE
router.post("/crear-incidencia", authMiddleware(['admin', 'profesor']), registerIncidencia);

// UPDATE
router.patch("/:id", authMiddleware(['admin', 'profesor']), editarIncidenciaById);

// DELETE
router.delete("/:id", authMiddleware(['admin', 'profesor']), deleteIncidenciaById);

export default router;