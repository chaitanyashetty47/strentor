import express from 'express';
import multer from 'multer';
//import upload from '../config/multer';

import {
  uploadContent,
  getContent,
  updateContent,
  deleteContent,
  createSubfolder
} from '../controllers/contentController';
import {isTutorOrAdmin, authMiddleware} from '../middleware/checkRole'; // Middleware to check role

const upload = multer({ dest: 'uploads/' })

const router = express.Router();

// Route to create a subfolder (restricted to TUTOR or ADMIN)
router.post('/create-subfolder/:courseId/:parentId?', authMiddleware, isTutorOrAdmin, createSubfolder);

// Route for uploading content, restricted to TUTOR or ADMIN
router.post('/upload/:courseId/:subfolderId', authMiddleware, isTutorOrAdmin, upload.single('file'), uploadContent);

// Route to get content by ID (open to all roles)
router.get('/:contentId', getContent);

// Route to update content, restricted to TUTOR or ADMIN
router.put('/:contentId', authMiddleware, isTutorOrAdmin, updateContent);

// Route to delete content, restricted to TUTOR or ADMIN
router.delete('/:contentId', authMiddleware, isTutorOrAdmin, deleteContent);

export default router;