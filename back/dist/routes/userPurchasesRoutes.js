"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userPurchases_1 = require("../controllers/userPurchases");
const checkRole_1 = require("../middleware/checkRole");
const router = express_1.default.Router();
router.post('/course/:courseId/join', userPurchases_1.joinCourse);
router.get('/get', checkRole_1.authMiddleware, userPurchases_1.getPurchasedCourses);
exports.default = router;
