import jwt from "jsonwebtoken";
import prismadb from "./prismadb";
import crypto from "crypto";
import { User, Estudiante } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_super_secret_key";
const ACCESS_TOKEN_EXPIRES_IN = "24h";
const REFRESH_TOKEN_EXPIRATION_DAYS = 30;

export const generateTokens = async (
  user: User | Estudiante,
  type: "user" | "estudiante"
) => {
  const accessToken = jwt.sign({ id: user.id, type }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

  await prismadb.refreshToken.create({
    data: {
      token: refreshToken,
      [type === "user" ? "userId" : "estudianteId"]: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};
