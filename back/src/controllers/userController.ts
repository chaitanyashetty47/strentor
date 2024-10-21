import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import cloudinary from '../config/cloudinary';
import multer from 'multer';

const prisma = new PrismaClient();

// export const createOrUpdateUser = async (req: Request, res: Response) => {
//   try {
//     const { supabaseId, email, name, role } = req.body;

//     if (!supabaseId || !email || !name) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const user = await prisma.users.upsert({
//       where: { supabaseId: supabaseId },
//       update: {
//         email,
//         name,
//         role: role as Role,
//       },
//       create: {
//         supabaseId,
//         email,
//         name,
//         role: (role as Role) || Role.USER,
//       },
//     });

//     res.status(200).json(user);
//   } catch (error) {
//     console.error('Error creating/updating user:', error);
//     res.status(500).json({ error: 'Failed to create/update user' });
//   }
// };


export const createOrUpdateUser =  async (req: Request, res: Response): Promise<void> => {
    try {
      const { supabaseId, email, role, name, bio, aboutMe } = req.body;
      console.log("Request body:", req.body);
      console.log("Name: ", req.body.name);
      console.log("Bio", req.body.bio);
      console.log("About Me: ", req.body.aboutMe);

      const file = req.file;

      // Handle file upload if a file is provided
      if (!file) {
        res.status(400).send("No file uploaded.");
        return;
      }
  
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: `users`,
      });
  
      

      const user = await prisma.users.upsert({
        where: { supabaseId: supabaseId },
        update: {
          email,
          name,
          avatarUrl: result.secure_url, // Only update if a new image is uploaded
          role,
          ...(role === 'TUTOR' && { bio, aboutMe }), // Conditionally add bio and aboutMe if the role is TUTOR
        },
        create: {
          supabaseId,
          email,
          name,
          avatarUrl: result.secure_url,
          role,
          bio: role === 'TUTOR' ? bio : undefined,
          aboutMe: role === 'TUTOR' ? aboutMe : undefined,
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

//get purchased course by users
export const getUserCourse = async (req: Request, res: Response):Promise<void> =>  {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(400).json({ error: 'User email is required' });
      return;
    }
    const user = await prisma.users.findUnique({
      where: { email: userEmail },
      include: {
        purchasedCourses: {
          include: {
            course: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }


    // Transform the data to match the expected format
    const transformedUser = {
      ...user,
      purchasedCourses: user.purchasedCourses.map(purchase => ({
        ...purchase.course,
        purchasedAt: purchase.purchasedAt.toISOString()
      }))
    };

    res.status(200).json(transformedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
