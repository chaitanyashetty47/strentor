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
exports.getCourses = exports.deleteCourse = exports.updateCourse = exports.createCourse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a new course (Tutor or Admin only)
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, imageUrl, description, openToEveryone, slug, discordOauthUrl } = req.body;
        const createdById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!createdById) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const createdByIdNumber = parseInt(createdById, 10);
        if (isNaN(createdByIdNumber)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const course = yield prisma.course.create({
            data: {
                title,
                imageUrl,
                description,
                openToEveryone,
                slug,
                discordOauthUrl,
                createdBy: { connect: { id: createdByIdNumber } }
            }
        });
        res.status(201).json(course);
    }
    catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
});
exports.createCourse = createCourse;
// Update a course (Tutor or Admin only)
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, imageUrl, description, openToEveryone, slug, discordOauthUrl } = req.body;
        const course = yield prisma.course.update({
            where: { id: parseInt(id) },
            data: {
                title,
                imageUrl,
                description,
                openToEveryone,
                slug,
                discordOauthUrl
            }
        });
        res.status(200).json(course);
    }
    catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Failed to update course' });
    }
});
exports.updateCourse = updateCourse;
// Delete a course (Tutor or Admin only)
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.course.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
});
exports.deleteCourse = deleteCourse;
// Get all courses (All roles)
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield prisma.course.findMany();
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});
exports.getCourses = getCourses;
