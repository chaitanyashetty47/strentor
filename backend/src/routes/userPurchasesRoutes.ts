
import express from 'express';
import { joinCourse } from '../controllers/userPurchases';

const router = express.Router();
router.post('/course/:courseId/join',joinCourse)

export default router;