"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const contentRoutes_1 = __importDefault(require("./routes/contentRoutes"));
const userPurchasesRoutes_1 = __importDefault(require("./routes/userPurchasesRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Apply authentication middleware to all routes
// app.use(authMiddleware);
// Set user information for authenticated requests
app.use(auth_1.setUserMiddleware);
app.use('/users', userRoutes_1.default);
app.use('/course', courseRoutes_1.default);
app.use('purchases', userPurchasesRoutes_1.default);
app.use('/content', contentRoutes_1.default);
exports.default = app;
