import express from "express";
import { registerAdmin, registerEstudiante, registerProfesor, updateAdminById, updateAdminPassword } from "../controllers/admin";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// CREATE
router.post("/crear-admin", registerAdmin);
router.post("/crear-profesor", authMiddleware(["admin"]), registerProfesor);
router.post("/crear-estudiante", authMiddleware(["admin"]), registerEstudiante);

// UPDATE
router.patch("/:id", authMiddleware(["admin"]), updateAdminById);
router.patch("/:id/password", authMiddleware(["admin"]), updateAdminPassword);

export default router;