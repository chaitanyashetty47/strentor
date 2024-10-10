import { Request, Response } from 'express';
import prisma from '../config/prismaClient'; // Use the single Prisma client instance
import cloudinary from '../config/cloudinary'; // Use Cloudinary config

// Create a subfolder
export const createSubfolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, parentId } = req.params;
    const { title, description } = req.body;

    const newSubfolder = await prisma.content.create({
      data: {
        type: 'folder', // Set the type to folder
        title,
        description,
        parentId: parentId ? parseInt(parentId) : null, // Assign the parent folder if provided
      },
    });

    // Optionally, link subfolder to the course
    await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: {
        content: {
          create: [{ content: { connect: { id: newSubfolder.id } } }]
        },
      },
    });

    res.status(201).json({
      message: 'Subfolder created successfully!',
      subfolder: newSubfolder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the subfolder.' });
  }
};

export const uploadContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, subfolderId } = req.params;
    const { title, description, type } = req.body;
    const file = req.file;

    // Check if the file was uploaded
    if (!file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: `courses/${courseId}/${subfolderId}`,
    });

    // Save content in the database
    const newContent = await prisma.content.create({
      data: {
        type: type || 'video',
        title,
        description,
        thumbnail: result.secure_url, // Store the Cloudinary URL
        parentId: parseInt(subfolderId),
      },
    });

    // Link content to the course
    await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: {
        content: {
          create: [{ content: { connect: { id: newContent.id } } }]
        },
      },
    });

    res.status(201).json({
      message: 'File uploaded and added to course successfully!',
      content: newContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during upload.' });
  }
};


// export const uploadContent = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { courseId, subfolderId } = req.params;
//     const { title, description, type } = req.body;
//     const file = req.file;

//     // Check if the file was uploaded
//     if (!file) {
//       res.status(400).send("No file uploaded.");
//       return;
//     }

//     // Upload file to Cloudinary (adjust the path for your project)
//     const result = await cloudinary.uploader.upload_stream(
//       {
//         resource_type: "auto",
//         folder: `courses/${courseId}/${subfolderId}`,
//       },
//       (error, result) => {
//         if (error) {
//           res.status(500).json({ error: 'Error uploading to Cloudinary' });
//           return;
//         }

//         // Save content in the database
//         const newContent = await prisma.content.create({
//           data: {
//             type: type || 'video',
//             title,
//             description,
//             thumbnail: result?.secure_url || '', // Store the Cloudinary URL
//             parentId: parseInt(subfolderId),
//           },
//         });

//         // Link content to the course
//         await prisma.course.update({
//           where: { id: parseInt(courseId) },
//           data: {
//             content: {
//               create: [{ content: { connect: { id: newContent.id } } }]
//             },
//           },
//         });

//         res.status(201).json({
//           message: 'File uploaded and added to course successfully!',
//           content: newContent,
//         });
//       }
//     );

//     // Pipe the file stream to Cloudinary
//     file.stream.pipe(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred during upload.' });
//   }
// };


// Get content by ID
export const getContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;

    const content = await prisma.content.findUnique({
      where: { id: parseInt(contentId) },
      include: {
        children: true, // Include children if you want to fetch nested content
        courses: true,  // Include related courses
      },
    });

    if (!content) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }

    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the content' });
  }
};

// Update content by ID
export const updateContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    const { title, description, hidden, type } = req.body;

    const updatedContent = await prisma.content.update({
      where: { id: parseInt(contentId) },
      data: {
        title,
        description,
        hidden: hidden ?? undefined, // Only update if provided
        type: type || undefined, // Only update if provided
      },
    });

    res.json({
      message: 'Content updated successfully!',
      content: updatedContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the content' });
  }
};

// Delete content by ID


export const deleteContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;

    // First, check if the content exists in the database
    const content = await prisma.content.findUnique({ 
      where: { id: parseInt(contentId) } 
    });

    if (!content) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }

    // Extract the public_id from the Cloudinary URL (assuming the thumbnail is stored)
    const cloudinaryUrl = content.thumbnail;
    const publicId = cloudinaryUrl?.split('/').slice(-1)[0].split('.')[0]; // Extract the public_id

    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(publicId!, (error, result) => {
      if (error) {
        console.error('Cloudinary deletion error:', error);
        res.status(500).json({ error: 'Error deleting content from Cloudinary.' });
        return;
      }

      // If successful, proceed to delete the content from the database
      prisma.content.delete({
        where: { id: parseInt(contentId) },
      })
      .then(() => {
        res.json({ message: 'Content deleted from Cloudinary and database successfully!' });
      })
      .catch((dbError) => {
        console.error('Database deletion error:', dbError);
        res.status(500).json({ error: 'Error deleting content from the database.' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the content.' });
  }
};

