"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const incidencia_1 = require("../controllers/incidencia");
const router = express_1.default.Router();
// READ
router.get("/", (0, auth_1.authMiddleware)(['admin']), incidencia_1.getIncidencias);
router.get("/:id", (0, auth_1.authMiddleware)(['admin', 'profesor']), incidencia_1.getIncidenciasById);
router.get("/profesor/:profesorId", (0, auth_1.authMiddleware)(['admin', 'profesor']), incidencia_1.getIncidenciasByProfesorId);
// CREATE
router.post("/crear-incidencia", (0, auth_1.authMiddleware)(['admin', 'profesor']), incidencia_1.registerIncidencia);
// UPDATE
router.patch("/:id", (0, auth_1.authMiddleware)(['admin', 'profesor']), incidencia_1.editarIncidenciaById);
// DELETE
router.delete("/:id", (0, auth_1.authMiddleware)(['admin', 'profesor']), incidencia_1.deleteIncidenciaById);
exports.default = router;
