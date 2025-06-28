import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
}