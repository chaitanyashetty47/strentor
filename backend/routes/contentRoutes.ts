import express from 'express';
import { getCourseContentStructure,createNewContent,associateContentWithCourse, uploadVideo} from '../controllers/contentController';
import isTutorOrAdmin from '../middleware/checkRole';
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/course-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });


const router = express.Router();


router.post('/content',isTutorOrAdmin, createNewContent);
router.post('/content/upload-video', isTutorOrAdmin, upload.single('video'), uploadVideo);
router.post('/course/:courseId/content/:contentId', isTutorOrAdmin,associateContentWithCourse, );
router.get('/course/:courseId/content',isTutorOrAdmin,getCourseContentStructure);



export default router;

