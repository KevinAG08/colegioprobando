"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfesorById = exports.updateProfesorPassword = exports.editarProfesorById = exports.getProfesorById = exports.getProfesores = void 0;
const prismadb_1 = __importDefault(require("../utils/prismadb"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getProfesores = async (req, res) => {
    try {
        const profesores = await prismadb_1.default.user.findMany({
            where: {
                rol: "profesor",
            },
            include: {
                aulas: {
                    include: {
                        aula: true,
                    },
                },
            },
        });
        res.status(200).json(profesores);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getProfesores = getProfesores;
const getProfesorById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "ID del profesor no proporcionado" });
            return;
        }
        const profesor = await prismadb_1.default.user.findUnique({
            where: { id },
            include: {
                aulas: {
                    include: {
                        aula: true,
                    },
                },
            },
        });
        res.status(200).json(profesor);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getProfesorById = getProfesorById;
const editarProfesorById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, dni, email, direccion, telefono, aulaIds } = req.body;
        if (!id) {
            res.status(400).json({ error: "ID del profesor no proporcionado" });
            return;
        }
        if (!nombres || !apellidos || !dni || !email) {
            res.status(400).json({
                message: "Los campos nombres, apellidos, dni y email son obligatorios",
            });
            return;
        }
        const newProfesor = await prismadb_1.default.user.update({
            where: {
                id,
            },
            data: {
                nombres,
                apellidos,
                dni,
                email,
                direccion,
                telefono,
            },
        });
        await prismadb_1.default.aulaProfesor.deleteMany({
            where: {
                profesorId: id,
            },
        });
        await prismadb_1.default.aulaProfesor.createMany({
            data: aulaIds.map((aulaId) => ({
                aulaId,
                profesorId: id,
            })),
        });
        const { password: _, ...userWithoutPassword } = newProfesor;
        res.status(200).json({
            message: "Profesor actualizado exitosamente",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.editarProfesorById = editarProfesorById;
const updateProfesorPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const profesor = await prismadb_1.default.user.update({
            where: {
                id,
            },
            data: {
                password: hashedPassword,
            },
        });
        const { password: _, ...userWithoutPassword } = profesor;
        res.status(200).json({
            message: "Contraseña actualizada exitosamente",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.updateProfesorPassword = updateProfesorPassword;
const deleteProfesorById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "ID del profesor no proporcionado" });
            return;
        }
        await prismadb_1.default.aulaProfesor.deleteMany({
            where: {
                profesorId: id,
            },
        });
        await prismadb_1.default.user.delete({
            where: {
                id,
            },
        });
        res.status(200).json({ message: "Profesor eliminado exitosamente" });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.deleteProfesorById = deleteProfesorById;
