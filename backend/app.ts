import express from 'express';
import cors from 'cors';
import courseRoutes from './routes/courseRoutes';

import userRoutes from './routes/userRoutes';
import { setUserMiddleware } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());

// Apply authentication middleware to all routes
// app.use(authMiddleware);

// Set user information for authenticated requests
app.use(setUserMiddleware);


app.use('/users', userRoutes);
export default app;
