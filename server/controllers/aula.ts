import prismadb from "../utils/prismadb";
import { Request, Response } from "express";

export const registrarAula = async (req: Request, res: Response) => {
  try {
    const { nombre, nivel } = req.body;

    const aulaExistente = await prismadb.aula.findUnique({
      where: { nombre },
    });

    if (aulaExistente) {
      res.status(400).json({ message: "El aula ya existe" });
      return;
    }

    const aula = await prismadb.aula.create({
      data: {
        nombre,
        nivel,
      },
    });

    res.status(201).json({
      message: "Aula registrada exitosamente",
      aula,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAulas = async (req: Request, res: Response) => {
  try {
    const aulas = await prismadb.aula.findMany();

    res.status(200).json(aulas);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAula = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID de aula no proporcionado" });
      return;
    }

    const aula = await prismadb.aula.findUnique({
      where: { id },
    });

    res.status(200).json(aula);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAulasByProfesorId = async (req: Request, res: Response) => {
  try {
    const { profesorId } = req.params;

    if (!profesorId) {
      res.status(400).json({ message: "ID del profesor no proporcionado" });
      return;
    }

    const aulas = await prismadb.aulaProfesor.findMany({
      where: { profesorId },
      include: {
        aula: true,
      },
    })

    res.status(200).json(aulas);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export const editarAula = async (req: Request, res: Response) => {
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

    const aula = await prismadb.aula.update({
      where: {
        id,
      },
      data: {
        nombre,
        nivel,
      },
    });

    res.status(200).json(aula);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteAula = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID de aula no proporcionado" });
      return;
    }

    const estudianteEnAula = await prismadb.estudiante.findFirst({
      where: {
        aulaId: id,
      },
    });

    if (estudianteEnAula) {
      res
        .status(400)
        .json({
          message:
            "No se puede eliminar el aula, porque tiene estudiantes asignados",
        });
      return;
    }

    const profesorEnAula = await prismadb.aulaProfesor.findFirst({
      where: {
        aulaId: id,
      },
    });

    if (profesorEnAula) {
      res
        .status(400)
        .json({
          message:
            "No se puede eliminar el aula, porque tiene profesores asignados",
        });
      return;
    }

    await prismadb.aula.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Aula eliminada exitosamente" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
