import express from 'express';
import { createCourse } from '../controllers/courseController';
import isTutorOrAdmin from '../middleware/checkRole';
import { Request, Response } from 'express'; // Added import for Request and Response types

const router = express.Router();

router.post('/create', isTutorOrAdmin, async (req: Request, res: Response) => {
    await createCourse(req, res);
    return; // Ensure the function returns void
});

export default router;