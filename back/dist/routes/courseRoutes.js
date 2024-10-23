"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const courseController_1 = require("../controllers/courseController");
const checkRole_1 = require("../middleware/checkRole");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/create', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, upload.single('file'), courseController_1.createCourse);
router.put('/update/:id', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, courseController_1.updateCourse);
router.delete('/delete/:id', checkRole_1.authMiddleware, checkRole_1.isTutorOrAdmin, courseController_1.deleteCourse);
router.get('/getall', courseController_1.getCourses);
router.get('/get/:courseId', courseController_1.getCourseById);
router.get('/:courseId/content', checkRole_1.authMiddleware, courseController_1.getContentOfCourse);
exports.default = router;
