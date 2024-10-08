import express, { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';

declare global {
  namespace Express {
      interface Request {
          user?: {
              id: string; 
              role : Role // Adjust the type as necessary
              // Add other user properties if needed
          };
      }
  }
}

const prisma = new PrismaClient();
const router = express.Router();

// Middleware to check if the user is a tutor or admin
const isTutorOrAdmin = (req: Request, res: Response, next: Function) => {
  const userRole = req.user?.role; // Assume req.user is set by your authentication middleware
  if (userRole === Role.TUTOR || userRole === Role.ADMIN) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Only tutors and admins can perform this action.' });
  }
};
export default isTutorOrAdmin;