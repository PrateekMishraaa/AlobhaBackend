import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/database.js';
import taskRoutes from './src/routes/taskRoutes.js';
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';
import limiter from "express-rate-limit"

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const ratelimiter = limiter({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, 
  legacyHeaders: false, 
})

app.use(ratelimiter)
const allowedOrigins = [
  'https://alobha-assignment-frontend.vercel.app',
  'http://localhost:5173',  
  'http://localhost:3000',   
  'http://localhost:5000',   
];

const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow anyway for development
      // callback(new Error('Not allowed by CORS')); // Use this for production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Origin',
  ],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 86400, 
};


app.use(cors(corsOptions));


app.options('*', cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.use('/api', taskRoutes);


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskMaster API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      tasks: '/api/tasks',
      createTask: 'POST /api/tasks',
      getAllTasks: 'GET /api/tasks',
      getTask: 'GET /api/tasks/:id',
      updateTask: 'PUT /api/tasks/:id',
      deleteTask: 'DELETE /api/tasks/:id',
    },
  });
});


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
});