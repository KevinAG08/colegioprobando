"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aula_1 = require("../controllers/aula");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// READ
router.get("/", (0, auth_1.authMiddleware)(["admin"]), aula_1.getAulas);
router.get("/:id", (0, auth_1.authMiddleware)(["admin", "profesor"]), aula_1.getAula);
router.get("/profesor/:profesorId", (0, auth_1.authMiddleware)(["admin", "profesor"]), aula_1.getAulasByProfesorId);
// CREATE
router.post("/crear-aula", (0, auth_1.authMiddleware)(["admin"]), aula_1.registrarAula);
// UPDATE
router.patch("/:id", (0, auth_1.authMiddleware)(["admin"]), aula_1.editarAula);
// DELETE
router.delete("/:id", (0, auth_1.authMiddleware)(["admin"]), aula_1.deleteAula);
exports.default = router;
