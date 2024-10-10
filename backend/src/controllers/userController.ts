import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrUpdateUser = async (req: Request, res: Response) => {
  try {
    const { supabaseId, email, name, role } = req.body;

    if (!supabaseId || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await prisma.users.upsert({
      where: { supabaseId: supabaseId },
      update: {
        email,
        name,
        role: role as Role,
      },
      create: {
        supabaseId,
        email,
        name,
        role: (role as Role) || Role.USER,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to create/update user' });
  }
};



//get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Failed to get all users' });
  }
};
