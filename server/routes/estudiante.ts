import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  deleteEstudianteById,
  editarEstudianteById,
  getEstudianteById,
  getEstudiantes,
  getEstudiantesByAulaId,
  getEstudiantesByProfesorId,
} from "../controllers/estudiante";

const router = express.Router();

// READ
router.get("/", authMiddleware(["admin"]), getEstudiantes);
router.get("/:id", authMiddleware(["admin", "profesor"]), getEstudianteById);
router.get("/aula/:aulaId", authMiddleware(["admin", "profesor"]), getEstudiantesByAulaId);
router.get("/profesor/:profesorId", authMiddleware(["admin", "profesor"]), getEstudiantesByProfesorId);

// UPDATE
router.patch("/:id", authMiddleware(["admin"]), editarEstudianteById);

// DELETE
router.delete("/:id", authMiddleware(["admin"]), deleteEstudianteById);

export default router;
