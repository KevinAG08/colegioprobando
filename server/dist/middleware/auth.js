"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Removed VerifyErrors as it's not used directly here
const prismadb_1 = __importDefault(require("../utils/prismadb"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
}
// Provide a default only for development/testing if absolutely necessary, but warn loudly.
const effectiveJwtSecret = JWT_SECRET || "my_jwt_super_secret_key_dev_only";
if (!JWT_SECRET) {
    console.warn("Warning: Using default JWT_SECRET. Set JWT_SECRET environment variable for production.");
}
const authMiddleware = (requiredRoles = []) => {
    // Return the actual middleware function
    return async (req, res, next) => {
        // Explicit return type
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
            const decoded = jsonwebtoken_1.default.verify(token, effectiveJwtSecret); // Use the effective secret
            // More robust check for decoded payload structure
            if (typeof decoded !== "object" ||
                !decoded || // Check if decoded is null/undefined
                typeof decoded.id !== "string" || // Check type of id
                !["user", "estudiante"].includes(decoded.type) // Check if type is valid
            ) {
                res.status(401).json({ message: "Token inválido o corrupto" });
                return; // Exit
            }
            let entity = null; // Use a more generic name
            // Fetch user or estudiante based on type
            if (decoded.type === "user") {
                entity = await prismadb_1.default.user.findUnique({
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
                const userWithRole = entity;
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
        }
        catch (error) {
            console.error("Error en authMiddleware:", error);
            // Handle specific JWT errors
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json({ message: `Token inválido: ${error.message}` });
                return; // Exit
            }
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
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
exports.authMiddleware = authMiddleware;
