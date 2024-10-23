"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
//import upload from '../config/multer';
const contentController_1 = require("../controllers/contentController");
const checkRole_1 = require("../middleware/checkRole"); // Middleware to check role
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = express_1.default.Router();
// Route to create a subfolder (restricted to TUTOR or ADMIN)
router.post('/create-subfolder/:courseId/:parentId?', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, contentController_1.createSubfolder);
// Route for uploading content, restricted to TUTOR or ADMIN
router.post('/upload/:courseId/:subfolderId', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, upload.single('file'), contentController_1.uploadContent);
// Route to get content by ID (open to all roles)
router.get('/:contentId', contentController_1.getContent);
// Route to update content, restricted to TUTOR or ADMIN
router.put('/:contentId', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, contentController_1.updateContent);
// Route to delete content, restricted to TUTOR or ADMIN
router.delete('/:contentId', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, contentController_1.deleteContent);
//Route to get weeks and folder of a course
router.get('/courses/:courseId/folders', checkRole_1.authMiddleware, contentController_1.getContentOfCourse);
//Route to get content of a week/section
router.get('/courses/:courseId/folders/:folderId', checkRole_1.authMiddleware, contentController_1.getContentOfSection);
//Route To delete subfolder
router.delete('/delete-subfolder/:folderId/:parentId?', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, contentController_1.deleteSubfolder);
router.put('/update-subfolder/:folderId', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, contentController_1.updateSubfolder);
exports.default = router;
