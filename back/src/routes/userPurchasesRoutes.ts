import express from 'express';
import { joinCourse, getPurchasedCourses} from '../controllers/userPurchases';
import {authMiddleware} from '../middleware/checkRole';

const router = express.Router();
router.post('/course/:courseId/join',joinCourse)
router.get('/get', authMiddleware, getPurchasedCourses)

export default router;