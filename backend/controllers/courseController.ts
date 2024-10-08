import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';

declare global {
  namespace Express {
      interface Request {
          user?: {
              id: string;
              role:Role // Adjust the type as necessary
              // Add other user properties if needed
          };
      }
  }
}

const prisma = new PrismaClient();

// Create a new course (Tutor or Admin only)
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, imageUrl, description, openToEveryone, slug, discordOauthUrl } = req.body;
    const createdById = req.user?.id;

    if (!createdById) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const createdByIdNumber = parseInt(createdById as string, 10);

    if (isNaN(createdByIdNumber)) {
      return res.status(400).json({ error: 'Invalid user ID' });
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