"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const estudiante_1 = require("../controllers/estudiante");
const router = express_1.default.Router();
// READ
router.get("/", (0, auth_1.authMiddleware)(["admin"]), estudiante_1.getEstudiantes);
router.get("/:id", (0, auth_1.authMiddleware)(["admin"]), estudiante_1.getEstudianteById);
router.get("/aula/:aulaId", (0, auth_1.authMiddleware)(["admin", "profesor"]), estudiante_1.getEstudiantesByAulaId);
router.get("/profesor/:profesorId", (0, auth_1.authMiddleware)(["admin", "profesor"]), estudiante_1.getEstudiantesByProfesorId);
// UPDATE
router.patch("/:id", (0, auth_1.authMiddleware)(["admin"]), estudiante_1.editarEstudianteById);
// DELETE
router.delete("/:id", (0, auth_1.authMiddleware)(["admin"]), estudiante_1.deleteEstudianteById);
exports.default = router;
