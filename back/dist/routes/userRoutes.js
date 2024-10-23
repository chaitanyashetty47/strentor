"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/', upload.single('file'), userController_1.createOrUpdateUser);
router.get('/getAll', userController_1.getAllUsers);
router.get('/purchased', userController_1.getUserCourse);
router.get('/get/:userId', userController_1.getUserById);
exports.default = router;
