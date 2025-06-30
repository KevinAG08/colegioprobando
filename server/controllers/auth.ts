import prismadb from "../utils/prismadb";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/generateTokens";
import { Request, Response } from "express";
import { sendRefreshToken } from "../utils/sendRefreshToken";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prismadb.user.findUnique({
      where: { email },
      include: {
        aulas: {
          include: {
            aula: true,
          },
        },
      },
    });
    const type = "user";

    if (!user) {
      res.status(401).json({ message: "Credenciales incorrectas!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciales incorrectas!" });
      return;
    }

    const { accessToken, refreshToken } = await generateTokens(user, type);

    sendRefreshToken(res, refreshToken);

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: { ...userWithoutPassword, type },
      accessToken,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    console.log("Procesando solicitud refresh-token");
    console.log("Cookies recibidas");
    const oldToken = req.cookies.refreshToken;

    if (!oldToken) {
      console.log("No se encontró refreshToken en las cookies");
      res
        .status(400)
        .json({ message: "Token de actualización no proporcionado" });
      return;
    }

    console.log("Buscando token en la base de datos: ", oldToken.substring(0, 10))

    const foundToken = await prismadb.refreshToken.findUnique({
      where: { token: oldToken },
      include: { user: true },
    });

    if (!foundToken) {
      console.log("Token no encontrado en la base de datos");
      res.status(401).json({ message: "Token inválido o expirado" });
      return;
    }

    console.log("Token encontrado en la base de datos, vence: ", foundToken.expiresAt)

    if (new Date() > foundToken.expiresAt) {
      console.log("Token expirado: ", foundToken.expiresAt);
      await prismadb.refreshToken.delete({ where: { id: foundToken.id } });
      res.status(401).json({ message: "Token expirado" });
      return;
    }

    // Eliminar el token antiguo
    await prismadb.refreshToken.delete({
      where: { id: foundToken.id },
    });

    const user = foundToken.user;
    const type = foundToken.userId ? "user" : "estudiante";

    if (!user) {
      console.error(
        `Inconsistencia de datos: RefreshToken ${foundToken.id} existe pero el usuario/estudiante asociado no.`
      );
      res
        .status(401)
        .json({ message: "Token inválido (usuario asociado no encontrado)" });
      return; // Salir
    }

    // Generar nuevos tokens
    const newTokens = await generateTokens(user, type);
    console.log("Tokens generados correctamente");

    sendRefreshToken(res, newTokens.refreshToken);

    const { password: _, ...userWithoutPassword } = user;

    console.log("Refresh exitoso, enviando nuevo accessToken");

    res
      .status(200)
      .json({ accessToken: newTokens.accessToken, user: userWithoutPassword });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    console.log("Logout attempt. Received token cookie:", token ? "Token Present" : "No Token");

    if (token) {
      const deleted = await prismadb.refreshToken.deleteMany({ where: { token } });
      console.log(`Deleted ${deleted.count} refresh tokens from DB.`);
    } else {
      console.log("No refresh token cookie received, cannot delete from DB.");
    }

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("refreshToken", {
      httpOnly: true,
      // Asegúrate de que estos flags coincidan con cómo se estableció la cookie
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({ message: "Sesión cerrada" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
