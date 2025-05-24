import { Request, Response } from "express";
import prismadb from "../utils/prismadb";

export const getEstudiantes = async (req: Request, res: Response) => {
  try {
    const estudiantes = await prismadb.estudiante.findMany({
      include: {
        aula: true,
      },
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getEstudiantesByProfesorId = async (req: Request, res: Response) => {
  try {
    const { profesorId } = req.params;

    if (!profesorId) {
      res.status(400).json({ error: "ID del profesor no proporcionado"});
      return;
    }

    const profesorAulas = await prismadb.aulaProfesor.findMany({
      where: { profesorId },
      include: {
        aula: true,
      },
    })

    const aulaIds = profesorAulas.map((aulaProfesor) => aulaProfesor.aulaId);

    const estudiantes = await prismadb.estudiante.findMany({
      where: { aulaId: { in: aulaIds } },
      include: {
        aula: true,
      },
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export const getEstudianteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID del estudiante no proporcionado" });
      return;
    }

    const estudiante = await prismadb.estudiante.findUnique({
      where: { id },
      include: {
        aula: true,
      },
    });

    res.status(200).json(estudiante);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getEstudiantesByAulaId = async (req: Request, res: Response) => {
  try {
    const { aulaId } = req.params;

    if (!aulaId) {
      res.status(400).json({ error: "ID de la aula no proporcionado" });
      return;
    }

    const estudiantes = await prismadb.estudiante.findMany({
      where: { aulaId },
      include: {
        aula: true,
      },
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarEstudianteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      nombres,
      apellidos,
      dni,
      email,
      apoderado,
      telefono,
      sexo,
      fechaNacimiento,
      aulaId,
    } = req.body;

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

    const newEstudiante = await prismadb.estudiante.update({
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
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteEstudianteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID del estudiante no proporcionado" });
      return;
    }

    await prismadb.estudiante.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Estudiante eliminado exitosamente" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
