import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();


// Join/Subscribe to a course
export const joinCourse = async (req: Request, res: Response):Promise<void> =>  {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id; // Assuming user ID is available in the request

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    // Check if the user has already purchased the course
    const existingPurchase = await prisma.usersPurchases.findUnique({
      where: {
        UsersId_courseId: {
          UsersId:userId,
          courseId: parseInt(courseId)
        }
      }
    });

    if (existingPurchase) {
      res.status(400).json({ error: 'User has already joined this course' });
      return;
    }

    // Create a new purchase record
    const purchase = await prisma.usersPurchases.create({
      data: {
        UsersId: userId,
        courseId: parseInt(courseId)
      }
    });

    res.status(201).json({ message: 'Successfully joined the course', purchase });
  } catch (error) {
    console.error('Error joining course:', error);
    res.status(500).json({ error: 'Failed to join course' });
  }
};