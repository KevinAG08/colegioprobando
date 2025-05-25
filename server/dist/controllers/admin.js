"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEstudiante = exports.registerProfesor = exports.updateAdminPassword = exports.updateAdminById = exports.registerAdmin = void 0;
const prismadb_1 = __importDefault(require("../utils/prismadb"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerAdmin = async (req, res) => {
    try {
        const { nombres, apellidos, dni, email, password, direccion, telefono } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prismadb_1.default.user.create({
            data: {
                nombres,
                apellidos,
                dni,
                email,
                password: hashedPassword,
                rol: "admin",
                direccion,
                telefono,
            },
        });
        const { password: _, ...userWithoutPassword } = user; // Eliminar el campo de contraseña antes de enviar la respuesta
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.registerAdmin = registerAdmin;
const updateAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, dni, email, direccion, telefono } = req.body;
        const admin = await prismadb_1.default.user.update({
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
        const { password: _, ...userWithoutPassword } = admin;
        res.status(200).json({
            message: "Usuario actualizado exitosamente",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.updateAdminById = updateAdminById;
const updateAdminPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const admin = await prismadb_1.default.user.update({
            where: {
                id,
            },
            data: {
                password: hashedPassword,
            },
        });
        const { password: _, ...userWithoutPassword } = admin;
        res.status(200).json({
            message: "Contraseña actualizada exitosamente",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.updateAdminPassword = updateAdminPassword;
const registerProfesor = async (req, res) => {
    try {
        const { nombres, apellidos, dni, email, password, direccion, telefono, aulaIds, } = req.body;
        if (!nombres || !apellidos || !dni || !email || !password) {
            res.status(400).json({
                message: "Los campos nombres, apellidos, dni, email y contraseña son obligatorios",
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const profesor = await prismadb_1.default.user.create({
            data: {
                nombres,
                apellidos,
                dni,
                email,
                password: hashedPassword,
                rol: "profesor",
                direccion,
                telefono,
            },
        });
        await prismadb_1.default.aulaProfesor.createMany({
            data: aulaIds.map((aulaId) => ({
                aulaId,
                profesorId: profesor.id,
            })),
        });
        const { password: _, ...profesorWithoutPassword } = profesor; // Eliminar el campo de contraseña antes de enviar la respuesta
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: profesorWithoutPassword,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.registerProfesor = registerProfesor;
const registerEstudiante = async (req, res) => {
    try {
        const { nombres, apellidos, dni, email, apoderado, telefono, sexo, fechaNacimiento, aulaId, } = req.body;
        if (!nombres || !apellidos || !dni || !aulaId) {
            res.status(400).json({
                error: "Los campos nombres, apellidos, dni y aulaId son obligatorios",
            });
            return;
        }
        const estudiante = await prismadb_1.default.estudiante.create({
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
        res.status(201).json({
            message: "Estudiante registrado exitosamente",
            estudiante: estudiante,
        });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.registerEstudiante = registerEstudiante;
