import express from "express";
import { registrarAula, getAulas, getAula, editarAula, deleteAula, getAulasByProfesorId } from "../controllers/aula";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// READ
router.get("/", authMiddleware(["admin"]), getAulas);
router.get("/:id", authMiddleware(["admin", "profesor"]), getAula);
router.get("/profesor/:profesorId", authMiddleware(["admin", "profesor"]), getAulasByProfesorId);

// CREATE
router.post("/crear-aula", authMiddleware(["admin"]), registrarAula);

// UPDATE
router.patch("/:id", authMiddleware(["admin"]), editarAula);

// DELETE
router.delete("/:id", authMiddleware(["admin"]), deleteAula);


export default router;