import { Request, Response } from "express";
import prismadb from "../utils/prismadb";

export const saveAsistencias = async (req: Request, res: Response) => {
  try {
    const { aulaId, date, asistenciaDetalles } = req.body;

    if (!aulaId || !date || !asistenciaDetalles) {
      res.status(400).json({ message: "Faltan campos obligatorios" });
      return;
    }

    const profesorId = req.user?.id;

    if (!profesorId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const fechaAsistencia = new Date(date);
    const startOfDay = new Date(fechaAsistencia);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fechaAsistencia);
    endOfDay.setHours(23, 59, 59, 999);

    // First, check and clean up if multiple records exist (this shouldn't happen, but let's fix it)
    const existingAsistencias = await prismadb.asistencia.findMany({
      where: {
        aulaId,
        fecha: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const result = await prismadb.$transaction(async (prisma) => {
      let asistenciaId;

      // If multiple records exist, delete all but the first one
      if (existingAsistencias.length > 1) {
        // Keep the first record
        asistenciaId = existingAsistencias[0].id;

        // Delete all other records
        for (let i = 1; i < existingAsistencias.length; i++) {
          // First delete all detalles for this asistencia
          await prisma.asistenciaDetalle.deleteMany({
            where: { asistenciaId: existingAsistencias[i].id },
          });

          // Then delete the asistencia record itself
          await prisma.asistencia.delete({
            where: { id: existingAsistencias[i].id },
          });
        }

        // Now delete detalles for the remaining record to be updated
        await prisma.asistenciaDetalle.deleteMany({
          where: { asistenciaId },
        });
      }
      // If exactly one record exists, use it
      else if (existingAsistencias.length === 1) {
        asistenciaId = existingAsistencias[0].id;

        // Delete its detalles to be updated
        await prisma.asistenciaDetalle.deleteMany({
          where: { asistenciaId },
        });
      }
      // If no records exist, create a new one
      else {
        const newAsistencia = await prisma.asistencia.create({
          data: {
            fecha: fechaAsistencia,
            profesorId,
            aulaId,
          },
        });
        asistenciaId = newAsistencia.id;
      }

      // Create new detalles for the asistencia
      const detallesCreados = await prisma.asistenciaDetalle.createMany({
        data: asistenciaDetalles.map((detalle: any) => {
          return {
            asistenciaId,
            estudianteId: detalle.estudianteId,
            estado: detalle.estado,
          };
        }),
      });

      return { asistenciaId, detallesCount: detallesCreados.count };
    });

    res.status(200).json({
      message: "Asistencias registradas exitosamente",
      data: result,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAsistenciasByAulaAndDate = async (
  req: Request,
  res: Response
) => {
  try {
    const { aulaId, fecha } = req.params;

    if (!aulaId || !fecha) {
      res.status(400).json({ message: "Faltan campos obligatorios" });
      return;
    }

    const fechObj = new Date(fecha);

    if (isNaN(fechObj.getTime())) {
      res.status(400).json({ message: "Fecha inválida" });
      return;
    }

    const startOfDay = new Date(fechObj);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(fechObj);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all attendance records for this date (should be only one, but we'll handle multiple)
    const asistencias = await prismadb.asistencia.findMany({
      where: {
        aulaId,
        fecha: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        detalles: {
          include: {
            estudiante: true,
          },
        },
      },
      orderBy: {
        fecha: "asc", // Get the oldest one first if multiple exist
      },
    });

    if (!asistencias || asistencias.length === 0) {
      // Return an empty response instead of 404 error
      res.status(200).json(null);
      return;
    }

    // Return the first asistencia (oldest) if multiple exist
    // We'll clean up the duplicates on the next save operation
    res.status(200).json(asistencias[0]);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAllAsistencias = async (req: Request, res: Response) => {
  try {
    const asistencias = await prismadb.asistencia.findMany({
      include: {
        aula: true,
        detalles: {
          include: {
            estudiante: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    });

    res.status(200).json(asistencias);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getProfesorAsistencias = async (req: Request, res: Response) => {
  try {
    const { profesorId } = req.params;

    const asistencias = await prismadb.asistencia.findMany({
      include: {
        aula: true,
        detalles: {
          include: {
            estudiante: true,
          },
        },
      },
      where: {
        profesorId,
      },
      orderBy: {
        fecha: "desc",
      },
    });

    res.status(200).json(asistencias);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
