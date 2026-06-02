import express from 'express';
import { getInventory, createInventoryItem, updateInventoryItem, getLowStock } from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getInventory);
router.get('/low-stock', protect, getLowStock);
router.post('/', protect, authorize('admin', 'manager'), createInventoryItem);
router.put('/:id', protect, authorize('admin', 'manager'), updateInventoryItem);

export default router;
