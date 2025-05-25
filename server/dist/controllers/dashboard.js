"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActividadRecienteProfesor = exports.getAsistenciaSemanalProfesor = exports.getDistribuciónTipoIncidenciaProfesor = exports.getEstadisticasProfesor = exports.getActividadReciente = exports.getAsistenciaSemanal = exports.getDistribucionAula = exports.getEstadisticas = void 0;
const prismadb_1 = __importDefault(require("../utils/prismadb"));
const getEstadisticas = async (req, res) => {
    try {
        const estudiantes = await prismadb_1.default.estudiante.count();
        const profesores = await prismadb_1.default.user.count({
            where: {
                rol: "profesor",
            },
        });
        const aulas = await prismadb_1.default.aula.count();
        // Calcular el porcentaje de asistencia hoy
        const fechaHoy = new Date();
        // Crear fecha de inicio del día en UTC
        const inicioDelDiaUTC = new Date(Date.UTC(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate(), 0, 0, 0, 0));
        // Crear fecha de fin del día en UTC
        const finDelDiaUTC = new Date(Date.UTC(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate(), 23, 59, 59, 999));
        const asistenciasHoy = await prismadb_1.default.asistenciaDetalle.findMany({
            where: {
                asistencia: {
                    fecha: {
                        gte: inicioDelDiaUTC,
                        lte: finDelDiaUTC, // Usar lte en lugar de lt
                    },
                },
            },
        });
        const totalAsistencias = asistenciasHoy.length;
        const presentes = asistenciasHoy.filter((asistencia) => asistencia.estado === "presente" ||
            asistencia.estado === "tardanza" ||
            asistencia.estado === "tardanza_justificada").length;
        const asistenciaHoy = totalAsistencias > 0
            ? Math.round((presentes / totalAsistencias) * 100)
            : 0;
        const incidencias = await prismadb_1.default.incidencia.count();
        res.status(200).json({
            estudiantes,
            profesores,
            aulas,
            asistenciaHoy,
            incidencias,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getEstadisticas = getEstadisticas;
const getDistribucionAula = async (req, res) => {
    try {
        // Obtener todas las aulas
        const aulas = await prismadb_1.default.aula.findMany({
            select: {
                id: true,
                nombre: true,
            },
        });
        // Contar estudiantes por aula
        const distribucion = await Promise.all(aulas.map(async (aula) => {
            const count = await prismadb_1.default.estudiante.count({
                where: {
                    aulaId: aula.id,
                },
            });
            return {
                name: aula.nombre,
                value: count,
            };
        }));
        res.status(200).json(distribucion);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getDistribucionAula = getDistribucionAula;
const getAsistenciaSemanal = async (req, res) => {
    try {
        const hoy = new Date();
        // Trabajar completamente en UTC para mantener consistencia
        const inicioUTC = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
        const diaSemana = inicioUTC.getUTCDay(); // 0 = domingo, 1 = lunes, etc.
        // Calcular días para retroceder al lunes
        const diasParaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
        inicioUTC.setUTCDate(inicioUTC.getUTCDate() - diasParaLunes);
        // Generar fechas para los días de la semana
        const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];
        const fechas = dias.map((dia, index) => {
            // Crear fecha de inicio del día en UTC
            const fechaInicio = new Date(Date.UTC(inicioUTC.getUTCFullYear(), inicioUTC.getUTCMonth(), inicioUTC.getUTCDate() + index, 0, 0, 0, 0));
            // Crear fecha de fin del día en UTC
            const fechaFin = new Date(Date.UTC(inicioUTC.getUTCFullYear(), inicioUTC.getUTCMonth(), inicioUTC.getUTCDate() + index, 23, 59, 59, 999));
            return {
                dia,
                fecha: fechaInicio,
                fechaFin,
            };
        });
        // Obtener datos de asistencia para cada día
        const asistenciaSemanal = await Promise.all(fechas.map(async ({ dia, fecha, fechaFin }) => {
            // Obtener todas las asistencias del día
            const asistencias = await prismadb_1.default.asistenciaDetalle.findMany({
                where: {
                    asistencia: {
                        fecha: {
                            gte: fecha,
                            lte: fechaFin,
                        },
                    },
                },
                include: {
                    asistencia: true,
                },
            });
            // Contar estados
            const presente = asistencias.filter((a) => a.estado === "presente").length;
            const falta = asistencias.filter((a) => a.estado === "falta").length;
            const faltaJustificada = asistencias.filter((a) => a.estado === "falta_justificada").length;
            const tardanza = asistencias.filter((a) => a.estado === "tardanza").length;
            const tardanzaJustificada = asistencias.filter((a) => a.estado === "tardanza_justificada").length;
            return {
                day: dia,
                presente,
                falta,
                faltaJustificada,
                tardanza,
                tardanzaJustificada,
            };
        }));
        res.status(200).json(asistenciaSemanal);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getAsistenciaSemanal = getAsistenciaSemanal;
const getActividadReciente = async (req, res) => {
    try {
        // Obtener las últimas 10 incidencias
        const incidencias = await prismadb_1.default.incidencia.findMany({
            take: 10,
            orderBy: {
                fecha: "desc",
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
                },
            },
        });
        // Obtener las últimas 10 asistencias
        const asistencias = await prismadb_1.default.asistencia.findMany({
            take: 10,
            orderBy: {
                fecha: "desc",
            },
            include: {
                profesor: true,
                aula: true,
            },
        });
        // Combinar y formatear la actividad reciente
        const actividadIncidencias = incidencias.map((incidencia) => ({
            id: incidencia.id,
            tipo: "incidencia",
            descripcion: `Nueva incidencia: ${incidencia.tipoIncidencia}`,
            nombre: `${incidencia.user.nombres} ${incidencia.user.apellidos}`,
            aula: incidencia.detalles.length > 0
                ? incidencia.detalles[0].estudiante.aula.nombre
                : null,
            timestamp: incidencia.fecha.toLocaleString(),
            fechaFormateada: incidencia.fecha.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC"
            }),
        }));
        const actividadAsistencias = asistencias.map((asistencia) => ({
            id: asistencia.id,
            tipo: "asistencia",
            descripcion: `Registro de asistencia: ${asistencia.aula.nombre}`,
            nombre: `${asistencia.profesor.nombres} ${asistencia.profesor.apellidos}`,
            aula: asistencia.aula.nombre,
            timestamp: asistencia.fecha.toISOString(),
            fechaFormateada: asistencia.fecha.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "UTC",
            }),
        }));
        // Combinar, ordenar por timestamp y limitar a 10 elementos
        const actividad = [...actividadIncidencias, ...actividadAsistencias]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
        res.status(200).json(actividad);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getActividadReciente = getActividadReciente;
const getEstadisticasProfesor = async (req, res) => {
    try {
        const { profesorId } = req.params;
        const profesorAulas = await prismadb_1.default.aulaProfesor.findMany({
            where: { profesorId },
            include: {
                aula: true,
            },
        });
        const aulaIds = profesorAulas.map((aulaProfesor) => aulaProfesor.aulaId);
        const estudiantes = await prismadb_1.default.estudiante.count({
            where: { aulaId: { in: aulaIds } },
        });
        // Calcular el porcentaje de asistencia hoy
        const fechaHoy = new Date();
        const inicioDelDiaUTC = new Date(Date.UTC(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate(), 0, 0, 0, 0));
        const finDelDiaUTC = new Date(Date.UTC(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate(), 23, 59, 59, 999));
        const asistenciasHoy = await prismadb_1.default.asistenciaDetalle.findMany({
            where: {
                asistencia: {
                    fecha: {
                        gte: inicioDelDiaUTC,
                        lte: finDelDiaUTC,
                    },
                    profesorId,
                },
            },
        });
        const totalAsistencias = asistenciasHoy.length;
        const presentes = asistenciasHoy.filter((asistencia) => asistencia.estado === "presente" ||
            asistencia.estado === "tardanza" ||
            asistencia.estado === "tardanza_justificada").length;
        const asistenciaHoy = totalAsistencias > 0
            ? Math.round((presentes / totalAsistencias) * 100)
            : 0;
        const incidencias = await prismadb_1.default.incidencia.count({
            where: {
                userId: profesorId,
            },
        });
        res.status(200).json({
            estudiantes,
            asistenciaHoy,
            incidencias,
        });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getEstadisticasProfesor = getEstadisticasProfesor;
const getDistribuciónTipoIncidenciaProfesor = async (req, res) => {
    try {
        const { profesorId } = req.params;
        // Obtener todas las incidencias del profesor
        const incidencias = await prismadb_1.default.incidencia.findMany({
            where: {
                userId: profesorId,
            },
            include: {
                detalles: {
                    include: {
                        estudiante: true,
                    },
                },
            },
        });
        // Contar incidencias por tipo
        const distribucion = await Promise.all(incidencias.map(async (incidencia) => {
            const count = await prismadb_1.default.incidenciaDetalle.count({
                where: {
                    incidenciaId: incidencia.id,
                },
            });
            return {
                name: incidencia.tipoIncidencia,
                value: count,
            };
        }));
        res.status(200).json(distribucion);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getDistribuciónTipoIncidenciaProfesor = getDistribuciónTipoIncidenciaProfesor;
const getAsistenciaSemanalProfesor = async (req, res) => {
    try {
        const { profesorId } = req.params;
        const hoy = new Date();
        // Trabajar completamente en UTC para mantener consistencia
        const inicioUTC = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
        const diaSemana = inicioUTC.getUTCDay(); // 0 = domingo, 1 = lunes, etc.
        // Calcular días para retroceder al lunes
        const diasParaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
        inicioUTC.setUTCDate(inicioUTC.getUTCDate() - diasParaLunes);
        // Generar fechas para los días de la semana
        const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];
        const fechas = dias.map((dia, index) => {
            // Crear fecha de inicio del día en UTC
            const fechaInicio = new Date(Date.UTC(inicioUTC.getUTCFullYear(), inicioUTC.getUTCMonth(), inicioUTC.getUTCDate() + index, 0, 0, 0, 0));
            // Crear fecha de fin del día en UTC
            const fechaFin = new Date(Date.UTC(inicioUTC.getUTCFullYear(), inicioUTC.getUTCMonth(), inicioUTC.getUTCDate() + index, 23, 59, 59, 999));
            return {
                dia,
                fecha: fechaInicio,
                fechaFin,
            };
        });
        // Obtener datos de asistencia para cada día
        const asistenciaSemanal = await Promise.all(fechas.map(async ({ dia, fecha, fechaFin }) => {
            // Obtener todas las asistencias del día
            const asistencias = await prismadb_1.default.asistenciaDetalle.findMany({
                where: {
                    asistencia: {
                        fecha: {
                            gte: fecha,
                            lte: fechaFin,
                        },
                        profesorId,
                    },
                },
                include: {
                    asistencia: true,
                },
            });
            // Contar estados
            const presente = asistencias.filter((a) => a.estado === "presente").length;
            const falta = asistencias.filter((a) => a.estado === "falta").length;
            const faltaJustificada = asistencias.filter((a) => a.estado === "falta_justificada").length;
            const tardanza = asistencias.filter((a) => a.estado === "tardanza").length;
            const tardanzaJustificada = asistencias.filter((a) => a.estado === "tardanza_justificada").length;
            return {
                day: dia,
                presente,
                falta,
                faltaJustificada,
                tardanza,
                tardanzaJustificada,
            };
        }));
        res.status(200).json(asistenciaSemanal);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getAsistenciaSemanalProfesor = getAsistenciaSemanalProfesor;
const getActividadRecienteProfesor = async (req, res) => {
    try {
        const { profesorId } = req.params;
        // Obtener las últimas 10 incidencias
        const incidencias = await prismadb_1.default.incidencia.findMany({
            take: 10,
            orderBy: {
                fecha: "desc",
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
                },
            },
            where: {
                userId: profesorId,
            },
        });
        // Obtener las últimas 10 asistencias
        const asistencias = await prismadb_1.default.asistencia.findMany({
            take: 10,
            orderBy: {
                fecha: "desc",
            },
            include: {
                profesor: true,
                aula: true,
            },
            where: {
                profesorId,
            },
        });
        // Combinar y formatear la actividad reciente
        const actividadIncidencias = incidencias.map((incidencia) => ({
            id: incidencia.id,
            tipo: "incidencia",
            descripcion: `Nueva incidencia: ${incidencia.tipoIncidencia}`,
            nombre: `${incidencia.user.nombres} ${incidencia.user.apellidos}`,
            aula: incidencia.detalles.length > 0
                ? incidencia.detalles[0].estudiante.aula.nombre
                : null,
            timestamp: incidencia.fecha.toLocaleString(),
            fechaFormateada: incidencia.fecha.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC",
            }),
        }));
        const actividadAsistencias = asistencias.map((asistencia) => ({
            id: asistencia.id,
            tipo: "asistencia",
            descripcion: `Registro de asistencia: ${asistencia.aula.nombre}`,
            nombre: `${asistencia.profesor.nombres} ${asistencia.profesor.apellidos}`,
            aula: asistencia.aula.nombre,
            timestamp: asistencia.fecha.toISOString(),
            fechaFormateada: asistencia.fecha.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "UTC",
            }),
        }));
        // Combinar, ordenar por timestamp y limitar a 10 elementos
        const actividad = [...actividadIncidencias, ...actividadAsistencias]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
        res.status(200).json(actividad);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getActividadRecienteProfesor = getActividadRecienteProfesor;
