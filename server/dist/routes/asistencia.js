"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const asistencia_1 = require("../controllers/asistencia");
const router = express_1.default.Router();
// READ
router.get('/', (0, auth_1.authMiddleware)(['admin']), asistencia_1.getAllAsistencias);
router.get('/:aulaId/:fecha', (0, auth_1.authMiddleware)(['admin', 'profesor']), asistencia_1.getAsistenciasByAulaAndDate);
// UPDATE
router.post('/save', (0, auth_1.authMiddleware)(['admin', 'profesor']), asistencia_1.saveAsistencias);
exports.default = router;
