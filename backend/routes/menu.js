import express from 'express';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getCategories, createCategory } from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', protect, getCategories);
router.post('/categories', protect, authorize('admin', 'manager'), createCategory);
router.get('/', protect, getMenuItems);
router.post('/', protect, authorize('admin', 'manager'), createMenuItem);
router.put('/:id', protect, authorize('admin', 'manager'), updateMenuItem);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

export default router;
