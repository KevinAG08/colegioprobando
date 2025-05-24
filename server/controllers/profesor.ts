import { Request, Response } from "express";
import prismadb from "../utils/prismadb";
import bcrypt from "bcryptjs";

export const getProfesores = async (req: Request, res: Response) => {
  try {
    const profesores = await prismadb.user.findMany({
      where: {
        rol: "profesor",
      },
      include: {
        aulas: {
          include: {
            aula: true,
          },
        },
      },
    });

    res.status(200).json(profesores);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getProfesorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID del profesor no proporcionado" });
      return;
    }

    const profesor = await prismadb.user.findUnique({
      where: { id },
      include: {
        aulas: {
          include: {
            aula: true,
          },
        },
      },
    });

    res.status(200).json(profesor);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarProfesorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { nombres, apellidos, dni, email, direccion, telefono, aulaIds } =
      req.body;

    if (!id) {
      res.status(400).json({ error: "ID del profesor no proporcionado" });
      return;
    }

    if (!nombres || !apellidos || !dni || !email) {
      res.status(400).json({
        message: "Los campos nombres, apellidos, dni y email son obligatorios",
      });
      return;
    }

    const newProfesor = await prismadb.user.update({
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

    await prismadb.aulaProfesor.deleteMany({
      where: {
        profesorId: id,
      },
    });

    await prismadb.aulaProfesor.createMany({
      data: aulaIds.map((aulaId: string) => ({
        aulaId,
        profesorId: id,
      })),
    });

    const { password: _, ...userWithoutPassword } = newProfesor;

    res.status(200).json({
      message: "Profesor actualizado exitosamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateProfesorPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const profesor = await prismadb.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = profesor;

    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteProfesorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID del profesor no proporcionado" });
      return;
    }

    await prismadb.aulaProfesor.deleteMany({
      where: {
        profesorId: id,
      },
    });

    await prismadb.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Profesor eliminado exitosamente" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
