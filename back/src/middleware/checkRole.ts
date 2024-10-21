import { Request, Response, NextFunction } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import {supabase} from '../config/supabaseClient'

// const supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_API_KEY!)
const prisma = new PrismaClient()

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

export const authMiddleware = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return;
  }

  try {
    // Verify the token
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error) throw error

    if (!user) {
      res.status(401).json({ error: 'Invalid token' })
      return;
    }

    // Fetch the user's details from your Users table
    const dbUser = await prisma.users.findUnique({
      where: { supabaseId: user.id },
      select: {
        id: true,
        supabaseId: true,
        email: true,
        name: true,
        role: true
      }
    })

    if (!dbUser) {
      res.status(404).json({ error: 'User not found in database' })
      return;
    }

    // Attach user to the request object
    req.user = dbUser

    next()
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
}

export const isTutorOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'TUTOR' || req.user.role === 'ADMIN')) {
    next()
  } else {
    res.status(403).json({ error: 'Access denied. Tutor or Admin role required.' })
  }
}