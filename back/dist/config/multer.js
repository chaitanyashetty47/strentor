"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Configure multer to store the uploaded files in memory (or you can choose a disk storage)
const storage = multer_1.default.memoryStorage(); // Alternatively, use disk storage if needed
// Initialize multer with the storage configuration
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
