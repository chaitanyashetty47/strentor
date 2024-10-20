import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';

// declare global {
//   namespace Express {
//       interface Request {
//           user?: {
//               id: string;
//               role:Role // Adjust the type as necessary
//               // Add other user properties if needed
//           };
//       }
//   }
// }

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

// Create a new course (Tutor or Admin only)
export const createCourse = async (req: Request, res: Response):Promise<void> => {
  try {
    const { title, imageUrl, description, openToEveryone, slug, discordOauthUrl } = req.body;
    const createdById = req.user?.id;

    if (!createdById) {
      res.status(401).json({ error: 'User not authenticated' });
      return ;
    }

   // const createdByIdNumber = parseInt(createdById as string, 10);
   
   const createdByIdNumber = createdById
    if (isNaN(createdByIdNumber)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const course = await prisma.course.create({
      data: {
        title,
        imageUrl,
        description,
        openToEveryone,
        slug,
        discordOauthUrl,
        createdBy: { connect: { id: createdByIdNumber } }
      }
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Update a course (Tutor or Admin only)
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, description, openToEveryone, slug, discordOauthUrl } = req.body;

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        imageUrl,
        description,
        openToEveryone,
        slug,
        discordOauthUrl
      }
    });

    res.status(200).json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete a course (Tutor or Admin only)
export const deleteCourse =  async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
