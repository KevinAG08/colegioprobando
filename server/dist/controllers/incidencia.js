"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncidenciaById = exports.editarIncidenciaById = exports.registerIncidencia = exports.getIncidenciasById = exports.getIncidenciasByProfesorId = exports.getIncidencias = void 0;
const prismadb_1 = __importDefault(require("../utils/prismadb"));
const getIncidencias = async (req, res) => {
    try {
        const incidencias = await prismadb_1.default.incidencia.findMany({
            include: {
                user: true,
                detalles: {
                    include: {
                        estudiante: {
                            include: {
                                aula: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json(incidencias);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getIncidencias = getIncidencias;
const getIncidenciasByProfesorId = async (req, res) => {
    try {
        const { profesorId } = req.params;
        if (!profesorId) {
            res.status(400).json({ error: "ID del profesor no proporcionado" });
            return;
        }
        const incidencias = await prismadb_1.default.incidencia.findMany({
            where: {
                userId: profesorId
            },
            include: {
                user: true,
                detalles: {
                    include: {
                        estudiante: {
                            include: {
                                aula: true,
                            },
                        },
                    },
                }
            }
        });
        res.status(200).json(incidencias);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getIncidenciasByProfesorId = getIncidenciasByProfesorId;
const getIncidenciasById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "ID de la incidencia no proporcionado" });
            return;
        }
        const incidencia = await prismadb_1.default.incidencia.findUnique({
            where: { id },
            include: {
                user: true,
                detalles: {
                    include: {
                        estudiante: {
                            include: {
                                aula: true,
                            },
                        }
                    },
                },
            },
        });
        res.status(200).json(incidencia);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getIncidenciasById = getIncidenciasById;
const registerIncidencia = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { fecha, lugar, tipoIncidencia, descripcion, medidasAdoptadas, estudianteIds, } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        if (!fecha || !lugar || !tipoIncidencia || !descripcion) {
            res.status(400).json({
                message: "Los campos fecha, lugar, tipoIncidencia y descripcion son obligatorios",
            });
            return;
        }
        const incidencia = await prismadb_1.default.incidencia.create({
            data: {
                fecha: new Date(fecha),
                lugar,
                tipoIncidencia,
                descripcion,
                medidasAdoptadas,
                userId,
            },
        });
        await prismadb_1.default.incidenciaDetalle.createMany({
            data: estudianteIds.map((estudianteId) => ({
                incidenciaId: incidencia.id,
                estudianteId,
            })),
        });
        res
            .status(201)
            .json({ message: "Incidencia registrada exitosamente", incidencia });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.registerIncidencia = registerIncidencia;
const editarIncidenciaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "ID de la incidencia no proporcionado" });
            return;
        }
        const { fecha, lugar, tipoIncidencia, descripcion, medidasAdoptadas, estudianteIds, } = req.body;
        if (!fecha || !lugar || !tipoIncidencia || !descripcion) {
            res.status(400).json({
                message: "Los campos fecha, lugar, tipoIncidencia y descripcion son obligatorios",
            });
            return;
        }
        const newIncidencia = await prismadb_1.default.incidencia.update({
            where: {
                id,
            },
            data: {
                fecha: new Date(fecha),
                lugar,
                tipoIncidencia,
                descripcion,
                medidasAdoptadas,
            },
        });
        await prismadb_1.default.incidenciaDetalle.deleteMany({
            where: {
                incidenciaId: id,
            },
        });
        await prismadb_1.default.incidenciaDetalle.createMany({
            data: estudianteIds.map((estudianteId) => ({
                incidenciaId: id,
                estudianteId,
            })),
        });
        res.status(200).json({
            message: "Incidencia actualizada exitosamente",
            incidencia: newIncidencia,
        });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.editarIncidenciaById = editarIncidenciaById;
const deleteIncidenciaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "ID de la incidencia no proporcionado" });
            return;
        }
        await prismadb_1.default.incidenciaDetalle.deleteMany({
            where: {
                incidenciaId: id,
            },
        });
        await prismadb_1.default.incidencia.delete({
            where: {
                id,
            },
        });
        res.status(200).json({ message: "Incidencia eliminada exitosamente" });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.deleteIncidenciaById = deleteIncidenciaById;
