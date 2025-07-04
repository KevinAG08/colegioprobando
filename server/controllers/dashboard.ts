import { Request, Response } from "express";
import prismadb from "../utils/prismadb";

export const getEstadisticas = async (req: Request, res: Response) => {
  try {
    const estudiantes = await prismadb.estudiante.count();

    const profesores = await prismadb.user.count({
      where: {
        rol: "profesor",
      },
    });

    const aulas = await prismadb.aula.count();

    // Calcular el porcentaje de asistencia para la semana actual
    const asistenciaSemana = await calcularAsistenciaSemana();

    const incidencias = await prismadb.incidencia.count();

    res.status(200).json({
      estudiantes,
      profesores,
      aulas,
      asistenciaSemana,
      incidencias,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función auxiliar para calcular asistencia semanal
const calcularAsistenciaSemana = async (profesorId?: string) => {
  const timeZone = process.env.TIMEZONE || "America/Lima";
  const hoy = new Date();
  
  // Obtener el lunes de la semana actual
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(hoy);
  const year = parseInt(parts.find((p) => p.type === "year")!.value, 10);
  const month = parseInt(parts.find((p) => p.type === "month")!.value, 10);
  const day = parseInt(parts.find((p) => p.type === "day")!.value, 10);

  const fechaActual = new Date(Date.UTC(year, month - 1, day));
  const diaSemana = fechaActual.getUTCDay();
  const diasParaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
  
  const inicioSemana = new Date(fechaActual);
  inicioSemana.setUTCDate(inicioSemana.getUTCDate() - diasParaLunes);
  inicioSemana.setUTCHours(0, 0, 0, 0);
  
  const finSemana = new Date(inicioSemana);
  finSemana.setUTCDate(finSemana.getUTCDate() + 6);
  finSemana.setUTCHours(23, 59, 59, 999);

  const whereClause: any = {
    asistencia: {
      fecha: {
        gte: inicioSemana,
        lte: finSemana,
      },
    },
  };

  if (profesorId) {
    whereClause.asistencia.profesorId = profesorId;
  }

  const asistenciasSemana = await prismadb.asistenciaDetalle.findMany({
    where: whereClause,
  });

  const totalAsistencias = asistenciasSemana.length;
  const presentes = asistenciasSemana.filter(
    (asistencia) =>
      asistencia.estado === "presente" ||
      asistencia.estado === "tardanza" ||
      asistencia.estado === "tardanza_justificada"
  ).length;

  return totalAsistencias > 0
    ? Math.round((presentes / totalAsistencias) * 100)
    : 0;
};

// Cambiado de getDistribucionAula a getDistribucionTipoIncidencia para admin
export const getDistribucionTipoIncidencia = async (req: Request, res: Response) => {
  try {
    // Obtener todos los tipos de incidencias únicos
    const tiposIncidencia = await prismadb.incidencia.findMany({
      select: {
        tipoIncidencia: true,
      },
      distinct: ['tipoIncidencia'],
    });

    // Contar incidencias por tipo
    const distribucion = await Promise.all(
      tiposIncidencia.map(async (tipo) => {
        const count = await prismadb.incidencia.count({
          where: {
            tipoIncidencia: tipo.tipoIncidencia,
          },
        });

        return {
          name: tipo.tipoIncidencia,
          value: count,
        };
      })
    );

    res.status(200).json(distribucion);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Cambiado de getAsistenciaSemanal a getAsistenciaMensual para admin
export const getAsistenciaMensual = async (req: Request, res: Response) => {
  try {
    const hoy = new Date();
    const timeZone = process.env.TIMEZONE || "America/Lima";
    
    // Obtener el primer día del mes actual
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const parts = formatter.formatToParts(hoy);
    const year = parseInt(parts.find((p) => p.type === "year")!.value, 10);
    const month = parseInt(parts.find((p) => p.type === "month")!.value, 10);

    const primerDiaMes = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const ultimoDiaMes = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Calcular las semanas del mes
    const semanas = [];
    let fechaActual = new Date(primerDiaMes);
    let semanaNumero = 1;

    while (fechaActual <= ultimoDiaMes) {
      const inicioSemana = new Date(fechaActual);
      const finSemana = new Date(fechaActual);
      finSemana.setUTCDate(finSemana.getUTCDate() + 6);
      
      // Si la semana se extiende más allá del mes, ajustar al último día del mes
      if (finSemana > ultimoDiaMes) {
        finSemana.setTime(ultimoDiaMes.getTime());
      }

      semanas.push({
        nombre: `Semana ${semanaNumero}`,
        inicio: inicioSemana,
        fin: finSemana,
      });

      fechaActual.setUTCDate(fechaActual.getUTCDate() + 7);
      semanaNumero++;
    }

    // Obtener datos de asistencia para cada semana
    const asistenciaMensual = await Promise.all(
      semanas.map(async ({ nombre, inicio, fin }) => {
        const asistencias = await prismadb.asistenciaDetalle.findMany({
          where: {
            asistencia: {
              fecha: {
                gte: inicio,
                lte: fin,
              },
            },
          },
          include: {
            asistencia: true,
          },
        });

        // Contar estados
        const presente = asistencias.filter(
          (a) => a.estado === "presente"
        ).length;
        const falta = asistencias.filter((a) => a.estado === "falta").length;
        const faltaJustificada = asistencias.filter(
          (a) => a.estado === "falta_justificada"
        ).length;
        const tardanza = asistencias.filter(
          (a) => a.estado === "tardanza"
        ).length;
        const tardanzaJustificada = asistencias.filter(
          (a) => a.estado === "tardanza_justificada"
        ).length;

        return {
          week: nombre,
          presente,
          falta,
          faltaJustificada,
          tardanza,
          tardanzaJustificada,
        };
      })
    );

    res.status(200).json(asistenciaMensual);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getActividadReciente = async (req: Request, res: Response) => {
  try {
    // Obtener las últimas 10 incidencias
    const incidencias = await prismadb.incidencia.findMany({
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
    const asistencias = await prismadb.asistencia.findMany({
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
      aula:
        incidencia.detalles.length > 0
          ? incidencia.detalles[0].estudiante.aula.nombre
          : null,
      timestamp: incidencia.fecha.toISOString(),
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
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    res.status(200).json(actividad);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getEstadisticasProfesor = async (req: Request, res: Response) => {
  try {
    const { profesorId } = req.params;

    const profesorAulas = await prismadb.aulaProfesor.findMany({
      where: { profesorId },
      include: {
        aula: true,
      },
    });

    const aulaIds = profesorAulas.map((aulaProfesor) => aulaProfesor.aulaId);

    const estudiantes = await prismadb.estudiante.count({
      where: { aulaId: { in: aulaIds } },
    });

    // Calcular el porcentaje de asistencia para el día de hoy en la zona horaria de la escuela.
    const timeZone = process.env.TIMEZONE || "America/Lima";
    const fechaHoy = new Date();

    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const parts = formatter.formatToParts(fechaHoy);
    const year = parseInt(parts.find((p) => p.type === "year")!.value, 10);
    const month = parseInt(parts.find((p) => p.type === "month")!.value, 10);
    const day = parseInt(parts.find((p) => p.type === "day")!.value, 10);

    const inicioDelDiaUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const finDelDiaUTC = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const asistenciasHoy = await prismadb.asistenciaDetalle.findMany({
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
    const presentes = asistenciasHoy.filter(
      (asistencia) =>
        asistencia.estado === "presente" ||
        asistencia.estado === "tardanza" ||
        asistencia.estado === "tardanza_justificada"
    ).length;

    const asistenciaHoy =
      totalAsistencias > 0
        ? Math.round((presentes / totalAsistencias) * 100)
        : 0;

    const incidencias = await prismadb.incidencia.count({
      where: {
        userId: profesorId,
      },
    });

    res.status(200).json({
      estudiantes,
      asistenciaHoy,
      incidencias,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getDistribuciónTipoIncidenciaProfesor = async (
  req: Request,
  res: Response
) => {
  try {
    const { profesorId } = req.params;

    // Obtener todas las incidencias del profesor con tipos únicos
    const tiposIncidencia = await prismadb.incidencia.findMany({
      where: {
        userId: profesorId,
      },
      select: {
        tipoIncidencia: true,
      },
      distinct: ['tipoIncidencia'],
    });

    // Contar incidencias por tipo para este profesor
    const distribucion = await Promise.all(
      tiposIncidencia.map(async (tipo) => {
        const count = await prismadb.incidencia.count({
          where: {
            userId: profesorId,
            tipoIncidencia: tipo.tipoIncidencia,
          },
        });

        return {
          name: tipo.tipoIncidencia,
          value: count,
        };
      })
    );

    res.status(200).json(distribucion);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAsistenciaSemanalProfesor = async (
  req: Request,
  res: Response
) => {
  try {
    const { profesorId } = req.params;

    const hoy = new Date();

    // Trabajar completamente en UTC para mantener consistencia
    const inicioUTC = new Date(
      Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate())
    );
    const diaSemana = inicioUTC.getUTCDay(); // 0 = domingo, 1 = lunes, etc.

    // Calcular días para retroceder al lunes
    const diasParaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
    inicioUTC.setUTCDate(inicioUTC.getUTCDate() - diasParaLunes);

    // Generar fechas para los días de la semana
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];
    const fechas = dias.map((dia, index) => {
      // Crear fecha de inicio del día en UTC
      const fechaInicio = new Date(
        Date.UTC(
          inicioUTC.getUTCFullYear(),
          inicioUTC.getUTCMonth(),
          inicioUTC.getUTCDate() + index,
          0,
          0,
          0,
          0
        )
      );

      // Crear fecha de fin del día en UTC
      const fechaFin = new Date(
        Date.UTC(
          inicioUTC.getUTCFullYear(),
          inicioUTC.getUTCMonth(),
          inicioUTC.getUTCDate() + index,
          23,
          59,
          59,
          999
        )
      );

      return {
        dia,
        fecha: fechaInicio,
        fechaFin,
      };
    });

    // Obtener datos de asistencia para cada día
    const asistenciaSemanal = await Promise.all(
      fechas.map(async ({ dia, fecha, fechaFin }) => {
        // Obtener todas las asistencias del día
        const asistencias = await prismadb.asistenciaDetalle.findMany({
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
        const presente = asistencias.filter(
          (a) => a.estado === "presente"
        ).length;
        const falta = asistencias.filter((a) => a.estado === "falta").length;
        const faltaJustificada = asistencias.filter(
          (a) => a.estado === "falta_justificada"
        ).length;
        const tardanza = asistencias.filter(
          (a) => a.estado === "tardanza"
        ).length;
        const tardanzaJustificada = asistencias.filter(
          (a) => a.estado === "tardanza_justificada"
        ).length;

        return {
          day: dia,
          presente,
          falta,
          faltaJustificada,
          tardanza,
          tardanzaJustificada,
        };
      })
    );

    res.status(200).json(asistenciaSemanal);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getActividadRecienteProfesor = async (
  req: Request,
  res: Response
) => {
  try {
    const { profesorId } = req.params;

    // Obtener las últimas 10 incidencias
    const incidencias = await prismadb.incidencia.findMany({
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
    const asistencias = await prismadb.asistencia.findMany({
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
      aula:
        incidencia.detalles.length > 0
          ? incidencia.detalles[0].estudiante.aula.nombre
          : null,
      timestamp: incidencia.fecha.toISOString(),
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
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    res.status(200).json(actividad);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};