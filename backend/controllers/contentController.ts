import express, { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const router = express.Router();

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/course-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Helper function to upload file to Cloudinary
async function uploadToCloudinary(filePath: string) {
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "course_content",
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result!.secure_url);
    });
  });
}

// Middleware to check if the user is a tutor or admin
const isTutorOrAdmin = (req: Request, res: Response, next: Function) => {
  const userRole = req.user?.role;
  if (userRole === Role.TUTOR || userRole === Role.ADMIN) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Only tutors and admins can perform this action.' });
  }
};

// Create a new content item (folder, video, or other content)
export const createNewContent = async (req: Request, res: Response) => {
  try {
    const { type, title, description, parentId } = req.body;

    const content = await prisma.content.create({
      data: {
        type,
        title,
        description,
        parentId: parentId ? parseInt(parentId) : null,
      }
    });

    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
};

// Upload a video and create a content item
export const uploadVideo =  async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded');
      return;
    }

    const { title, description, parentId } = req.body;

    // Upload file to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(req.file.path);

    const content = await prisma.content.create({
      data: {
        type: 'video',
        title: title || req.file.originalname,
        description,
        parentId: parentId ? parseInt(parentId) : null,
        thumbnail: cloudinaryUrl, // Cloudinary URL
      },
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(201).json(content);
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};


// Associate content with a course
export const associateContentWithCourse = async (req: Request, res: Response) => {
  try {
    const { courseId, contentId } = req.params;

    const courseContent = await prisma.courseContent.create({
      data: {
        courseId: parseInt(courseId),
        contentId: parseInt(contentId),
      }
    });

    res.status(201).json(courseContent);
  } catch (error) {
    console.error('Error associating content with course:', error);
    res.status(500).json({ error: 'Failed to associate content with course' });
  }
};

// Get course content structure
export const getCourseContentStructure = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const courseContent = await prisma.courseContent.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        content: {
          include: {
            children: true,
          }
        }
      }
    });

    res.status(200).json(courseContent);
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
};

export default router;