import express from 'express';
import { createCourse, updateCourse, deleteCourse, getCourses } from '../controllers/courseController';
import {authMiddleware, isTutorOrAdmin} from '../middleware/checkRole';
import { Request, Response } from 'express'; // Added import for Request and Response types

const router = express.Router();

router.post('/create', authMiddleware ,isTutorOrAdmin, createCourse);
router.put('/update/:id', authMiddleware ,isTutorOrAdmin, updateCourse);
router.delete('/delete/:id', authMiddleware ,isTutorOrAdmin, deleteCourse);
router.get('/getall',getCourses);

export default router;

// async (req: Request, res: Response) => {
//     await createCourse(req, res);
//     return; // Ensure the function returns void
// }