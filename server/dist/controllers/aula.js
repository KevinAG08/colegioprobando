"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAula = exports.editarAula = exports.getAulasByProfesorId = exports.getAula = exports.getAulas = exports.registrarAula = void 0;
const prismadb_1 = __importDefault(require("../utils/prismadb"));
const registrarAula = async (req, res) => {
    try {
        const { nombre, nivel } = req.body;
        const aulaExistente = await prismadb_1.default.aula.findUnique({
            where: { nombre },
        });
        if (aulaExistente) {
            res.status(400).json({ message: "El aula ya existe" });
            return;
        }
        const aula = await prismadb_1.default.aula.create({
            data: {
                nombre,
                nivel,
            },
        });
        res.status(201).json({
            message: "Aula registrada exitosamente",
            aula,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.registrarAula = registrarAula;
const getAulas = async (req, res) => {
    try {
        const aulas = await prismadb_1.default.aula.findMany();
        res.status(200).json(aulas);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getAulas = getAulas;
const getAula = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "ID de aula no proporcionado" });
            return;
        }
        const aula = await prismadb_1.default.aula.findUnique({
            where: { id },
        });
        res.status(200).json(aula);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getAula = getAula;
const getAulasByProfesorId = async (req, res) => {
    try {
        const { profesorId } = req.params;
        if (!profesorId) {
            res.status(400).json({ message: "ID del profesor no proporcionado" });
            return;
        }
        const aulas = await prismadb_1.default.aulaProfesor.findMany({
            where: { profesorId },
            include: {
                aula: true,
            },
        });
        res.status(200).json(aulas);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getAulasByProfesorId = getAulasByProfesorId;
const editarAula = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, nivel } = req.body;
        if (!id) {
            res.status(400).json({ message: "ID de aula no proporcionado" });
            return;
        }
        if (!nombre) {
            res.status(400).json({ message: "El nombre del aula es requerido" });
            return;
        }
        const aula = await prismadb_1.default.aula.update({
            where: {
                id,
            },
            data: {
                nombre,
                nivel,
            },
        });
        res.status(200).json(aula);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.editarAula = editarAula;
const deleteAula = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "ID de aula no proporcionado" });
            return;
        }
        const estudianteEnAula = await prismadb_1.default.estudiante.findFirst({
            where: {
                aulaId: id,
            },
        });
        if (estudianteEnAula) {
            res
                .status(400)
                .json({
                message: "No se puede eliminar el aula, porque tiene estudiantes asignados",
            });
            return;
        }
        const profesorEnAula = await prismadb_1.default.aulaProfesor.findFirst({
            where: {
                aulaId: id,
            },
        });
        if (profesorEnAula) {
            res
                .status(400)
                .json({
                message: "No se puede eliminar el aula, porque tiene profesores asignados",
            });
            return;
        }
        await prismadb_1.default.aula.delete({
            where: {
                id,
            },
        });
        res.status(200).json({ message: "Aula eliminada exitosamente" });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.deleteAula = deleteAula;
