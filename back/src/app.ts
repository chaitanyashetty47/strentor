import express from 'express';
import cors from 'cors';
import courseRoutes from './routes/courseRoutes';
import contentRoutes from './routes/contentRoutes';
import  userPurchasesRoutes  from './routes/userPurchasesRoutes';
import userRoutes from './routes/userRoutes';
import healthRoutes from './routes/healthRoutes';
import { setUserMiddleware } from './middleware/auth';

const app = express();

app.use(cors({
  origin: ['https://course.thechaicoder.com','https://strentor-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}))

// Also ensure you're setting proper headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  next();
});

app.use(express.json());

// Apply authentication middleware to all routes
// app.use(authMiddleware);

// Health check routes before authentication middleware
app.use('/health', healthRoutes);


// Set user information for authenticated requests
app.use(setUserMiddleware);
app.use('/users', userRoutes);
app.use('/course', courseRoutes)
app.use('/purchases',userPurchasesRoutes)
app.use('/content',contentRoutes)


export default app;
