import express  from 'express';
import multer from 'multer';
import { createOrUpdateUser, getAllUsers, getUserCourse, getUserById, getCoursesCreatedByUser, checkUserEmail} from '../controllers/userController';

const router = express.Router();

// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), createOrUpdateUser)
router.get('/getAll', getAllUsers)
router.get('/purchased', getUserCourse)
router.get('/get/:userId', getUserById)
router.get('/created',getCoursesCreatedByUser)
router.get('/check-email/:email', checkUserEmail);


export default router;