"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEstudianteById = exports.editarEstudianteById = exports.getEstudiantesByAulaId = exports.getEstudianteById = exports.getEstudiantesByProfesorId = exports.getEstudiantes = void 0;
const prismadb_1 = __importDefault(require("../utils/prismadb"));
const getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await prismadb_1.default.estudiante.findMany({
            include: {
                aula: true,
            },
        });
        res.status(200).json(estudiantes);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getEstudiantes = getEstudiantes;
const getEstudiantesByProfesorId = async (req, res) => {
    try {
        const { profesorId } = req.params;
        if (!profesorId) {
            res.status(400).json({ error: "ID del profesor no proporcionado" });
            return;
        }
        const profesorAulas = await prismadb_1.default.aulaProfesor.findMany({
            where: { profesorId },
            include: {
                aula: true,
            },
        });
        const aulaIds = profesorAulas.map((aulaProfesor) => aulaProfesor.aulaId);
        const estudiantes = await prismadb_1.default.estudiante.findMany({
            where: { aulaId: { in: aulaIds } },
            include: {
                aula: true,
            },
        });
        res.status(200).json(estudiantes);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getEstudiantesByProfesorId = getEstudiantesByProfesorId;
const getEstudianteById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "ID del estudiante no proporcionado" });
            return;
        }
        const estudiante = await prismadb_1.default.estudiante.findUnique({
            where: { id },
            include: {
                aula: true,
            },
        });
        res.status(200).json(estudiante);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getEstudianteById = getEstudianteById;
const getEstudiantesByAulaId = async (req, res) => {
    try {
        const { aulaId } = req.params;
        if (!aulaId) {
            res.status(400).json({ error: "ID de la aula no proporcionado" });
            return;
        }
        const estudiantes = await prismadb_1.default.estudiante.findMany({
            where: { aulaId },
            include: {
                aula: true,
            },
        });
        res.status(200).json(estudiantes);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getEstudiantesByAulaId = getEstudiantesByAulaId;
const editarEstudianteById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, dni, email, apoderado, telefono, sexo, fechaNacimiento, aulaId, } = req.body;
        if (!id) {
            res.status(400).json({ error: "ID del estudiante no proporcionado" });
            return;
        }
        if (!nombres || !apellidos || !dni || !aulaId) {
            res.status(400).json({
                error: "Los campos nombres, apellidos, dni y aulaId son obligatorios",
            });
            return;
        }
        const newEstudiante = await prismadb_1.default.estudiante.update({
            where: {
                id,
            },
            data: {
                nombres,
                apellidos,
                dni,
                email,
                apoderado,
                telefono,
                sexo,
                fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
                aulaId,
            },
        });
        res.status(200).json({
            message: "Estudiante actualizado exitosamente",
            estudiante: newEstudiante,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.editarEstudianteById = editarEstudianteById;
const deleteEstudianteById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "ID del estudiante no proporcionado" });
            return;
        }
        await prismadb_1.default.estudiante.delete({
            where: {
                id,
            },
        });
        res.status(200).json({ message: "Estudiante eliminado exitosamente" });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.deleteEstudianteById = deleteEstudianteById;
