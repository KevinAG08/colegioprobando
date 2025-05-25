"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let prismadb;
if (process.env.NODE_ENV === "production") {
    prismadb = new client_1.PrismaClient();
}
else {
    if (!global.prisma) {
        global.prisma = new client_1.PrismaClient();
    }
    prismadb = global.prisma;
}
exports.default = prismadb;
