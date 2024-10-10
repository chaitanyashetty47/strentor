"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contentController_1 = require("../controllers/contentController");
const checkRole_1 = __importDefault(require("../middleware/checkRole")); // Middleware to check role
const router = express_1.default.Router();
// Route for uploading content, restricted to TUTOR or ADMIN
router.post('/upload/:courseId/:subfolderId', checkRole_1.default, contentController_1.uploadContent);
// Route to get content by ID (open to all roles)
router.get('/:contentId', contentController_1.getContent);
// Route to update content, restricted to TUTOR or ADMIN
router.put('/:contentId', checkRole_1.default, contentController_1.updateContent);
// Route to delete content, restricted to TUTOR or ADMIN
router.delete('/:contentId', checkRole_1.default, contentController_1.deleteContent);
exports.default = router;
