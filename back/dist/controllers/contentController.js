"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubfolder = exports.deleteSubfolder = exports.getContentOfSection = exports.getContentOfCourse = exports.deleteContent = exports.updateContent = exports.getContent = exports.uploadContent = exports.createSubfolder = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient")); // Use the single Prisma client instance
const cloudinary_1 = __importDefault(require("../config/cloudinary")); // Use Cloudinary config
// Create a subfolder
const createSubfolder = async (req, res) => {
    try {
        const { courseId, parentId } = req.params;
        const { title, description } = req.body;
        const newSubfolder = await prismaClient_1.default.content.create({
            data: {
                type: 'folder', // Set the type to folder
                title,
                description,
                parentId: parentId ? parseInt(parentId) : null, // Assign the parent folder if provided
            },
        });
        // Optionally, link subfolder to the course
        await prismaClient_1.default.course.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the subfolder.' });
    }
};
exports.createSubfolder = createSubfolder;
const uploadContent = async (req, res) => {
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
        const result = await cloudinary_1.default.uploader.upload(file.path, {
            resource_type: "auto",
            folder: `courses/${courseId}/${subfolderId}`,
        });
        // Save content in the database
        const newContent = await prismaClient_1.default.content.create({
            data: {
                type: type || 'video',
                title,
                description,
                thumbnail: result.secure_url, // Store the Cloudinary URL
                parentId: parseInt(subfolderId),
            },
        });
        // Link content to the course
        await prismaClient_1.default.course.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during upload.' });
    }
};
exports.uploadContent = uploadContent;
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
const getContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const content = await prismaClient_1.default.content.findUnique({
            where: { id: parseInt(contentId) },
            include: {
                children: true, // Include children if you want to fetch nested content
                courses: true, // Include related courses
            },
        });
        if (!content) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }
        res.json(content);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the content' });
    }
};
exports.getContent = getContent;
// Update content by ID
const updateContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const { title, description, hidden, type } = req.body;
        const updatedContent = await prismaClient_1.default.content.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the content' });
    }
};
exports.updateContent = updateContent;
// Delete content by ID
const deleteContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        // First, check if the content exists in the database
        const content = await prismaClient_1.default.content.findUnique({
            where: { id: parseInt(contentId) }
        });
        if (!content) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }
        // Extract the public_id from the Cloudinary URL (including the folder structure)
        const cloudinaryUrl = content.thumbnail;
        // console.log("cloudinary URL: ", cloudinaryUrl);
        // Extract the folder path and filename from the Cloudinary URL
        const publicId = cloudinaryUrl
            ?.split('/')
            .slice(-4) // This will capture 'courses/2/3/filename'
            .join('/')
            .split('.')[0]; // Remove the file extension (e.g., .mp4)
        // console.log("Public ID: ", publicId);
        if (!publicId) {
            console.error("Error deleting video file from Cloudinary as id cannot be retreived");
            res.status(500).json({ error: 'Error deleting files from Cloudinary as id cant be retrieved' });
        }
        // Delete the file from Cloudinary
        await cloudinary_1.default.uploader.destroy(publicId, { resource_type: "video" }, (error, result) => {
            if (error) {
                console.error('Cloudinary deletion error:', error);
                res.status(500).json({ error: 'Error deleting content from Cloudinary.' });
                return;
            }
            if (!result || result.result !== 'ok') {
                console.error("Error deleting video file from Cloudinary");
                res.status(500).json({ error: 'Error deleting files from Cloudinary' });
                return;
            }
            // If successful, proceed to delete the content from the database
            prismaClient_1.default.content.delete({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the content.' });
    }
};
exports.deleteContent = deleteContent;
// Get only folders/weeks for a specific course
const getContentOfCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const folders = await prismaClient_1.default.content.findMany({
            where: {
                courses: {
                    some: {
                        courseId: parseInt(courseId),
                    },
                },
                type: 'folder', // Filter to only include folders (or weeks)
            },
            include: {
                children: false, // No need to include child content here
            },
        });
        if (!folders) {
            res.status(404).json({ error: 'Folders not found' });
            return;
        }
        res.json(folders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching folders' });
    }
};
exports.getContentOfCourse = getContentOfCourse;
//get delete folder and its children
const getContentOfSection = async (req, res) => {
    const { folderId } = req.params;
    try {
        const folderContents = await prismaClient_1.default.content.findUnique({
            where: {
                id: parseInt(folderId),
            },
            include: {
                children: true, // Include children content inside the folder (week)
            },
        });
        if (!folderContents || !folderContents.children) {
            res.status(404).json({ error: 'Folder contents not found' });
            return;
        }
        // Return only the children contents (files inside the folder)
        res.json(folderContents.children); // Send only the children content
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching folder contents' });
    }
};
exports.getContentOfSection = getContentOfSection;
//delete subfolder
const deleteSubfolder = async (req, res) => {
    const { folderId } = req.params;
    try {
        // Find the folder and all its nested children recursively
        const folder = await prismaClient_1.default.content.findUnique({
            where: {
                id: parseInt(folderId),
                type: "folder"
            },
            include: {
                children: {
                    include: {
                        children: true // This will get nested children as well
                    }
                }
            }
        });
        if (!folder) {
            res.status(404).json({ error: 'Folder not found' });
            return;
        }
        // Helper function to get all nested children
        const getAllChildren = (content) => {
            let children = [...content.children];
            for (const child of content.children) {
                if (child.children) {
                    children = children.concat(getAllChildren(child));
                }
            }
            return children;
        };
        // Get all nested children
        const allChildren = getAllChildren(folder);
        // Delete thumbnails from Cloudinary
        for (const child of allChildren) {
            if (child.thumbnail) {
                const publicId = child.thumbnail
                    .split('/')
                    .slice(-4)
                    .join('/')
                    .split('.')[0];
                try {
                    await cloudinary_1.default.uploader.destroy(publicId, { resource_type: "video" });
                }
                catch (cloudinaryError) {
                    console.error(`Failed to delete thumbnail for content ${child.id}:`, cloudinaryError);
                    // Continue with deletion even if Cloudinary fails
                }
            }
        }
        // Delete the folder and all its children from the database
        // The cascade delete will handle the children automatically
        await prismaClient_1.default.content.delete({
            where: {
                id: parseInt(folderId)
            }
        });
        res.json({ message: 'Folder and its contents deleted successfully' });
    }
    catch (error) {
        console.error("Error deleting folder and contents:", error);
        res.status(500).json({ error: 'An error occurred while deleting the folder and its contents' });
    }
};
exports.deleteSubfolder = deleteSubfolder;
// Update content by ID
const updateSubfolder = async (req, res) => {
    try {
        const { folderId } = req.params;
        const { title, description } = req.body;
        const updatedContent = await prismaClient_1.default.content.update({
            where: { id: parseInt(folderId) },
            data: {
                title,
                description,
            },
        });
        res.json({
            message: 'Folder updated successfully!',
            content: updatedContent,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the content' });
    }
};
exports.updateSubfolder = updateSubfolder;
