"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Middleware to check if the user is a tutor or admin
const isTutorOrAdmin = (req, res, next) => {
    var _a;
    const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role; // Assume req.user is set by your authentication middleware
    if (userRole === client_1.Role.TUTOR || userRole === client_1.Role.ADMIN) {
        next();
    }
    else {
        res.status(403).json({ error: 'Access denied. Only tutors and admins can perform this action.' });
    }
};
exports.default = isTutorOrAdmin;
