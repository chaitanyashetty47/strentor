"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentOfCourse = exports.getCourseById = exports.getCourses = exports.deleteCourse = exports.updateCourse = exports.createCourse = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const prisma = new client_1.PrismaClient();
//Create a new course (Tutor or Admin only)
const createCourse = async (req, res) => {
    try {
        const { title, description, level, duration } = req.body;
        const file = req.file;
        const createdById = req.user?.id;
        if (!createdById) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        // const createdByIdNumber = parseInt(createdById as string, 10);
        const createdByIdNumber = createdById;
        if (isNaN(createdByIdNumber)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        if (!file) {
            res.status(400).send("No photo uploaded.");
            return;
        }
        // Upload file to Cloudinary
        const result = await cloudinary_1.default.uploader.upload(file.path, {
            resource_type: "auto",
            folder: `course`,
        });
        const imageUrl = result.secure_url;
        const course = await prisma.course.create({
            data: {
                title,
                imageUrl,
                description,
                duration,
                level,
                openToEveryone: true,
                createdBy: { connect: { id: createdByIdNumber } }
            }
        });
        res.status(201).json(course);
    }
    catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
};
exports.createCourse = createCourse;
// Update a course (Tutor or Admin only)
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, imageUrl, description, openToEveryone, slug, discordOauthUrl } = req.body;
        const course = await prisma.course.update({
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
};
exports.updateCourse = updateCourse;
// Delete a course (Tutor or Admin only)
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.course.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
};
exports.deleteCourse = deleteCourse;
// Get all courses (All roles)
const getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany();
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};
exports.getCourses = getCourses;
//get  courses by id
const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        res.json(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the course' });
    }
};
exports.getCourseById = getCourseById;
// Route to get course content, including sections and videos
const getContentOfCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        // Fetch course, sections, and their related content
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
            include: {
                content: {
                    include: {
                        content: true, // Include the related contents for each section
                    },
                },
            },
        });
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.json(course);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.getContentOfCourse = getContentOfCourse;
