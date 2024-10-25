import express from 'express';
import { checkHealth, checkDetailedHealth } from '../controllers/healthController';

const router = express.Router();

// Basic health check
router.get('/', checkHealth);

// Detailed health check with more metrics
router.get('/detailed', checkDetailedHealth);

export default router;