import express  from 'express';
import multer from 'multer';
import { createOrUpdateUser, getAllUsers, getUserCourse } from '../controllers/userController';

const router = express.Router();

const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('file'), createOrUpdateUser)
router.get('/getAll', getAllUsers);
router.get('/purchased', getUserCourse)

export default router;