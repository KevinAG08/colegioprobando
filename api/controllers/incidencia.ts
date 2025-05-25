import { Response, Request } from "express";
import prismadb from "../utils/prismadb";

export const getIncidencias = async (req: Request, res: Response) => {
  try {
    const incidencias = await prismadb.incidencia.findMany({
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
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getIncidenciasByProfesorId = async (req: Request, res: Response) => {
  try {
    const { profesorId } = req.params;

    if (!profesorId) {
      res.status(400).json({ error: "ID del profesor no proporcionado" });
      return;
    }

    const incidencias = await prismadb.incidencia.findMany({
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
    })

    res.status(200).json(incidencias);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}


export const getIncidenciasById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID de la incidencia no proporcionado" });
      return;
    }

    const incidencia = await prismadb.incidencia.findUnique({
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
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const registerIncidencia = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      fecha,
      lugar,
      tipoIncidencia,
      descripcion,
      medidasAdoptadas,
      estudianteIds,
    } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    if (!fecha || !lugar || !tipoIncidencia || !descripcion) {
      res.status(400).json({
        message:
          "Los campos fecha, lugar, tipoIncidencia y descripcion son obligatorios",
      });
      return;
    }

    const incidencia = await prismadb.incidencia.create({
      data: {
        fecha: new Date(fecha),
        lugar,
        tipoIncidencia,
        descripcion,
        medidasAdoptadas,
        userId,
      },
    });

    await prismadb.incidenciaDetalle.createMany({
      data: estudianteIds.map((estudianteId: string) => ({
        incidenciaId: incidencia.id,
        estudianteId,
      })),
    });

    res
      .status(201)
      .json({ message: "Incidencia registrada exitosamente", incidencia });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const editarIncidenciaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID de la incidencia no proporcionado" });
      return;
    }

    const {
      fecha,
      lugar,
      tipoIncidencia,
      descripcion,
      medidasAdoptadas,
      estudianteIds,
    } = req.body;

    if (!fecha || !lugar || !tipoIncidencia || !descripcion) {
      res.status(400).json({
        message:
          "Los campos fecha, lugar, tipoIncidencia y descripcion son obligatorios",
      });
      return;
    }

    const newIncidencia = await prismadb.incidencia.update({
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

    await prismadb.incidenciaDetalle.deleteMany({
      where: {
        incidenciaId: id,
      },
    });

    await prismadb.incidenciaDetalle.createMany({
      data: estudianteIds.map((estudianteId: string) => ({
        incidenciaId: id,
        estudianteId,
      })),
    });

    res.status(200).json({
      message: "Incidencia actualizada exitosamente",
      incidencia: newIncidencia,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteIncidenciaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID de la incidencia no proporcionado" });
      return;
    }

    await prismadb.incidenciaDetalle.deleteMany({
      where: {
        incidenciaId: id,
      },
    });

    await prismadb.incidencia.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Incidencia eliminada exitosamente" });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
