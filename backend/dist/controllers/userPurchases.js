"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinCourse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Join/Subscribe to a course
const joinCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { courseId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming user ID is available in the request
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Check if the course exists
        const course = yield prisma.course.findUnique({
            where: { id: parseInt(courseId) }
        });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        // Check if the user has already purchased the course
        const existingPurchase = yield prisma.usersPurchases.findUnique({
            where: {
                UsersId_courseId: {
                    UsersId: parseInt(userId),
                    courseId: parseInt(courseId)
                }
            }
        });
        if (existingPurchase) {
            return res.status(400).json({ error: 'User has already joined this course' });
        }
        // Create a new purchase record
        const purchase = yield prisma.usersPurchases.create({
            data: {
                UsersId: parseInt(userId),
                courseId: parseInt(courseId)
            }
        });
        res.status(201).json({ message: 'Successfully joined the course', purchase });
    }
    catch (error) {
        console.error('Error joining course:', error);
        res.status(500).json({ error: 'Failed to join course' });
    }
});
exports.joinCourse = joinCourse;
