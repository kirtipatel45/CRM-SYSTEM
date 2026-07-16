import express from 'express';
import { getDashboardStats, getRevenueReport } from './report.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/revenue', authorize('Reports', 'read'), getRevenueReport);

export default router;
