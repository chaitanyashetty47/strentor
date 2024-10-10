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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.getContent = exports.uploadContent = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient")); // Use the single Prisma client instance
const cloudinary_1 = __importDefault(require("../config/cloudinary")); // Use Cloudinary config
const uploadContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, subfolderId } = req.params;
        const { title, description, type } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).send("No file uploaded.");
            return;
        }
        // Upload file to Cloudinary
        const result = yield cloudinary_1.default.uploader.upload(file.path, {
            resource_type: "auto",
            folder: `courses/${courseId}/${subfolderId}`,
        });
        // Save content in the database
        const newContent = yield prismaClient_1.default.content.create({
            data: {
                type: type || 'video',
                title,
                description,
                thumbnail: result.secure_url,
                parentId: parseInt(subfolderId),
            },
        });
        // Link content to the course
        yield prismaClient_1.default.course.update({
            where: { id: parseInt(courseId) },
            data: {
                content: {
                    create: [{ content: { connect: { id: newContent.id } } }]
                },
            },
        });
        res.json({
            message: 'File uploaded and added to course successfully!',
            content: newContent,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during upload.' });
    }
});
exports.uploadContent = uploadContent;
// Get content by ID
const getContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId } = req.params;
        const content = yield prismaClient_1.default.content.findUnique({
            where: { id: parseInt(contentId) },
            include: {
                children: true, // Include children if you want to fetch nested content
                courses: true, // Include related courses
            },
        });
        if (!content) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }
        res.json(content);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the content' });
    }
});
exports.getContent = getContent;
// Update content by ID
const updateContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId } = req.params;
        const { title, description, hidden, type } = req.body;
        const updatedContent = yield prismaClient_1.default.content.update({
            where: { id: parseInt(contentId) },
            data: {
                title,
                description,
                hidden: hidden !== null && hidden !== void 0 ? hidden : undefined, // Only update if provided
                type: type || undefined, // Only update if provided
            },
        });
        res.json({
            message: 'Content updated successfully!',
            content: updatedContent,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the content' });
    }
});
exports.updateContent = updateContent;
// Delete content by ID
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId } = req.params;
        // First, check if the content exists
        const content = yield prismaClient_1.default.content.findUnique({ where: { id: parseInt(contentId) } });
        if (!content) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }
        // Delete the content
        yield prismaClient_1.default.content.delete({
            where: { id: parseInt(contentId) },
        });
        res.json({
            message: 'Content deleted successfully!',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the content' });
    }
});
exports.deleteContent = deleteContent;
