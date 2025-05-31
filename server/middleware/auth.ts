import jwt, { JwtPayload } from "jsonwebtoken"; // Removed VerifyErrors as it's not used directly here
import prismadb from "../utils/prismadb";
import { Request, Response, NextFunction } from "express";
import { User, Estudiante } from "@prisma/client";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  type: "user" | "estudiante";
}

type AuthenticatedEntity = (User | Estudiante) & {
  type: "user" | "estudiante";
};

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedEntity;
    }
  }
}

type UserRole = string;

export const authMiddleware = (requiredRoles: UserRole[] = []) => {
  // Return the actual middleware function

  // Read JWT_SECRET when the middleware factory is called, ensuring it's up-to-date.
  const JWT_SECRET_FROM_ENV = process.env.JWT_SECRET;
  if (!JWT_SECRET_FROM_ENV) {
    console.error(
      "FATAL ERROR: JWT_SECRET is not defined in environment variables when authMiddleware is configured."
    );
    // Consider throwing an error here for production if JWT_SECRET is critical
    // throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
  }
  // Provide a default only for development/testing if absolutely necessary, but warn loudly.
  const effectiveJwtSecret = JWT_SECRET_FROM_ENV || "my_jwt_super_secret_key_dev_only";
  if (!JWT_SECRET_FROM_ENV) {
    console.warn(
      "Warning: Using default JWT_SECRET. Set JWT_SECRET environment variable for production."
    );
  }

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Send response and stop execution for this request
      res
        .status(401)
        .json({ message: "No autorizado" });
      return; // Exit the function
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, effectiveJwtSecret) as CustomJwtPayload; // Use the effective secret

      // More robust check for decoded payload structure
      if (
        typeof decoded !== "object" ||
        !decoded || // Check if decoded is null/undefined
        typeof decoded.id !== "string" || // Check type of id
        !["user", "estudiante"].includes(decoded.type) // Check if type is valid
      ) {
        res.status(401).json({ message: "Token inválido o corrupto" });
        return; // Exit
      }

      let entity: User | Estudiante | null = null; // Use a more generic name

      // Fetch user or estudiante based on type
      if (decoded.type === "user") {
        entity = await prismadb.user.findUnique({
          where: { id: decoded.id },
          include: { refreshTokens: true },
        });
      }

      if (!entity) {
        res.status(401).json({ message: "Entidad autenticada no encontrada" });
        return; // Exit
      }

      // Role check - only applicable if the entity is a User and roles are required
      if (requiredRoles.length > 0 && decoded.type === "user") {
        // We know entity is User here, but casting is still needed for TS
        const userWithRole = entity as User;
        // Check if the user has a role and if it's included in the required roles
        if (!userWithRole.rol || !requiredRoles.includes(userWithRole.rol)) {
          res
            .status(403)
            .json({ message: "Acceso denegado. Rol insuficiente." });
          return; // Exit
        }
      }

      // Attach the authenticated entity (user or estudiante) and its type to the request
      req.user = { ...entity, type: decoded.type };

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Error en authMiddleware:", error);

      // Handle specific JWT errors
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: `Token inválido: ${error.message}` });
        return; // Exit
      }
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expirado" });
        return; // Exit
      }

      // Handle generic errors - Use 500 for server errors
      res
        .status(500)
        .json({
          message: "Error interno del servidor durante la autenticación",
        });
      // No return needed here as it's the end of the try-catch block
    }
  };
};
