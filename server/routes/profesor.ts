import express from "express";
import { authMiddleware } from "../middleware/auth";
import { deleteProfesorById, editarProfesorById, getProfesorById, getProfesores, updateProfesorPassword } from "../controllers/profesor";

const router = express.Router();

// READ
router.get("/", authMiddleware(["admin"]), getProfesores);
router.get("/:id", authMiddleware(["admin"]), getProfesorById);

// UPDATE
router.patch("/:id", authMiddleware(["admin", "profesor"]), editarProfesorById);
router.patch("/:id/password", authMiddleware(["admin", "profesor"]), updateProfesorPassword);

// DELETE
router.delete("/:id", authMiddleware(["admin"]), deleteProfesorById);

export default router;