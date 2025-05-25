"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// CREATE
router.post("/crear-admin", admin_1.registerAdmin);
router.post("/crear-profesor", (0, auth_1.authMiddleware)(["admin"]), admin_1.registerProfesor);
router.post("/crear-estudiante", (0, auth_1.authMiddleware)(["admin"]), admin_1.registerEstudiante);
// UPDATE
router.patch("/:id", (0, auth_1.authMiddleware)(["admin"]), admin_1.updateAdminById);
router.patch("/:id/password", (0, auth_1.authMiddleware)(["admin"]), admin_1.updateAdminPassword);
exports.default = router;
