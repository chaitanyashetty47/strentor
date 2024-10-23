import express from 'express';
import multer from 'multer';
import { createCourse, updateCourse, deleteCourse, getCourses, getContentOfCourse, getCourseById } from '../controllers/courseController';
import {authMiddleware, isTutorOrAdmin} from '../middleware/checkRole';

const router = express.Router();

const upload = multer({ dest: 'uploads/' })

router.post('/create', authMiddleware ,isTutorOrAdmin, upload.single('file') ,createCourse);
router.put('/update/:id', authMiddleware ,isTutorOrAdmin, updateCourse);
router.delete('/delete/:id', authMiddleware ,isTutorOrAdmin, deleteCourse);
router.get('/getall',getCourses);
router.get('/get/:courseId',getCourseById)
router.get('/:courseId/content', authMiddleware, getContentOfCourse);

export default router;

