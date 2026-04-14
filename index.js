import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/database.js';
import taskRoutes from './src/routes/taskRoutes.js';
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';


dotenv.config();


connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));


app.use('/api', taskRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});