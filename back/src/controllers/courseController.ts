import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import cloudinary from '../config/cloudinary';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        supabaseId: string;
        email: string;
        name: string;
        role: Role;
      } ;
    }
  }
}


const prisma = new PrismaClient();

//Create a new course (Tutor or Admin only)
// export const createCourse = async (req: Request, res: Response):Promise<void> => {
//   try {
//     const { title, description, level, duration } = req.body;
//     const file = req.file;
//     const createdById = req.user?.id;

//     if (!createdById) {
//       res.status(401).json({ error: 'User not authenticated' });
//       return ;
//     }

//    // const createdByIdNumber = parseInt(createdById as string, 10);
   
//    const createdByIdNumber = createdById
//     if (isNaN(createdByIdNumber)) {
//       res.status(400).json({ error: 'Invalid user ID' });
//       return;
//     }

//     if (!file) {
//       res.status(400).send("No photo uploaded.");
//       return;
//     }

//     // Upload file to Cloudinary
//     const result = await cloudinary.uploader.upload(file.path, {
//       resource_type: "auto",
//       folder: `course`,
//     });

//     const imageUrl = result.secure_url

//     const course = await prisma.course.create({
//       data: {
//         title,
//         imageUrl,
//         description,
//         duration,
//         level,
//         openToEveryone: true,
//         createdBy: { connect: { id: createdByIdNumber } }
//       }
//     });

//     res.status(201).json(course);
//   } catch (error) {
//     console.error('Error creating course:', error);
//     res.status(500).json({ error: 'Failed to create course' });
//   }
// };

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, level, duration } = req.body;
    const file = req.file;
    const createdById = req.user?.id;

    if (!createdById) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const createdByIdNumber = createdById;
    if (isNaN(createdByIdNumber)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (!file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    // Upload file to Cloudinary from memory buffer
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'course' },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          res.status(500).json({ error: 'Failed to upload image' });
          return;
        }

        const imageUrl = result?.secure_url!;

        // Create the course with the image URL
        prisma.course.create({
          data: {
            title,
            imageUrl,
            description,
            duration,
            level,
            openToEveryone: true,
            createdBy: { connect: { id: createdByIdNumber } },
          },
        })
          .then((course) => res.status(201).json(course))
          .catch((error) => {
            console.error('Error creating course:', error);
            res.status(500).json({ error: 'Failed to create course' });
          });
      }
    );

    // Use a readable stream to pipe the buffer to Cloudinary
    const stream = result;
    stream.end(file.buffer);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};


// Update a course (Tutor or Admin only)
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, description, level, duration } = req.body;

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        imageUrl,
        description,
        level,
        duration
      }
    });

    res.status(200).json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete a course (Tutor or Admin only)
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete all related CourseContent entries first
    await prisma.courseContent.deleteMany({
      where: { courseId: parseInt(id) }
    });

    await prisma.usersPurchases.deleteMany({
      where: { courseId: parseInt(id) }
    })

    // Now delete the course
    await prisma.course.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

// Get all courses (All roles)
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

//get  courses by id

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the course' });
  }
};

// Route to get course content, including sections and videos

export const getContentOfCourse = async (req: Request, res: Response): Promise<void> =>{
  const { courseId } = req.params;

  try {
    // Fetch course, sections, and their related content
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        content: {
          include: {
            content: true, // Include the related contents for each section
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json(course);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};
