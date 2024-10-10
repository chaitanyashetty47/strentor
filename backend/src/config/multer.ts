import multer from 'multer';
import path from 'path';

// Configure multer to store the uploaded files in memory (or you can choose a disk storage)
const storage = multer.memoryStorage(); // Alternatively, use disk storage if needed

// Initialize multer with the storage configuration
const upload = multer({ storage });

export default upload;
