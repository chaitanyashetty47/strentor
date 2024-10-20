import express from 'express';
import cors from 'cors';
import courseRoutes from './routes/courseRoutes';
import contentRoutes from './routes/contentRoutes';
import  userPurchasesRoutes  from './routes/userPurchasesRoutes';
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
app.use('/course', courseRoutes)
app.use('/purchases',userPurchasesRoutes)
app.use('/content',contentRoutes)


export default app;
