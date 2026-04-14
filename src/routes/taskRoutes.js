import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { validateTask } from '../middlewares/validation.js';

const router = express.Router();


router.post('/tasks', validateTask, createTask);
router.get('/tasks', getAllTasks);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', validateTask, updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;