import express from 'express';
import { getDashboardStats, getSalesReport } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/sales', protect, authorize('admin', 'manager'), getSalesReport);

export default router;
