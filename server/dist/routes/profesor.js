"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const profesor_1 = require("../controllers/profesor");
const router = express_1.default.Router();
// READ
router.get("/", (0, auth_1.authMiddleware)(["admin"]), profesor_1.getProfesores);
router.get("/:id", (0, auth_1.authMiddleware)(["admin"]), profesor_1.getProfesorById);
// UPDATE
router.patch("/:id", (0, auth_1.authMiddleware)(["admin", "profesor"]), profesor_1.editarProfesorById);
router.patch("/:id/password", (0, auth_1.authMiddleware)(["admin", "profesor"]), profesor_1.updateProfesorPassword);
// DELETE
router.delete("/:id", (0, auth_1.authMiddleware)(["admin"]), profesor_1.deleteProfesorById);
exports.default = router;
