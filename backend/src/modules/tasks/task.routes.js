import express from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask } from './task.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Re-using 'Settings' or 'Dashboard' for tasks generally, or assuming it's inherently accessible
router.get('/', getTasks); 
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
