"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismadb_1 = __importDefault(require("./prismadb"));
const crypto_1 = __importDefault(require("crypto"));
const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_super_secret_key";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRATION_DAYS = 30;
const generateTokens = async (user, type) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, type }, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);
    await prismadb_1.default.refreshToken.create({
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
exports.generateTokens = generateTokens;
