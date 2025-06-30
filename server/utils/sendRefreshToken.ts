import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    })
}