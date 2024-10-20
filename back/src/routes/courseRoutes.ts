import express from 'express';
import { createCourse, updateCourse, deleteCourse, getCourses, getContentOfCourse } from '../controllers/courseController';
import {authMiddleware, isTutorOrAdmin} from '../middleware/checkRole';

const router = express.Router();

router.post('/create', authMiddleware ,isTutorOrAdmin, createCourse);
router.put('/update/:id', authMiddleware ,isTutorOrAdmin, updateCourse);
router.delete('/delete/:id', authMiddleware ,isTutorOrAdmin, deleteCourse);
router.get('/getall',getCourses);
router.get('/:courseId/content', authMiddleware, getContentOfCourse);

export default router;

